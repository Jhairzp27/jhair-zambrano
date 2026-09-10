"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";

/* ================================= Datos ================================= */

// Para agregar o quitar habilidades solo se edita lib/skills.ts (ahí está la guía).
import { GROUPS, SKILLS, SYNAPSES, type Level, type Skill, type Vec3 } from "@/lib/skills";

const GROUP_NAMES = Object.keys(GROUPS);

const DWELL_MS = 7000; // tiempo de lectura por grupo
const TRAVEL_MS = 1200; // giro hacia la siguiente región
const RESUME_MS = 3500; // espera tras interactuar antes de retomar el recorrido
const FOV = 4.2;
/** El recorrido mira cada región desde la derecha: el perfil lateral es lo que más se reconoce como cerebro. */
const VIEW_BIAS = 0.9;
/** El nivel se lee por tamaño y brillo, como los nodos principales de Brain Atlas. */
const NODE_PX: Record<Level, number> = { primary: 5.5, secondary: 4, learning: 3.2 };
const GLOW: Record<Level, number> = { primary: 1, secondary: 0.7, learning: 0.5 };
const LEVEL_RANK: Record<Level, number> = { primary: 0, secondary: 1, learning: 2 };
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const TAU = Math.PI * 2;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
/** Diferencia angular más corta, en (-π, π]. */
const angleDiff = (to: number, from: number) => ((((to - from) % TAU) + TAU * 1.5) % TAU) - Math.PI;

const SKILL = new Map(SKILLS.map((s) => [s.name, s]));
const groupOf = (name: string) => SKILL.get(name)?.category ?? "";

/** Skills de cada grupo, las de más dominio primero. */
const MEMBERS: Record<string, Skill[]> = Object.fromEntries(
  GROUP_NAMES.map((g) => [
    g,
    SKILLS.filter((s) => s.category === g).sort((a, b) => LEVEL_RANK[a.level] - LEVEL_RANK[b.level]),
  ]),
);

const NEIGHBORS = new Map(
  SKILLS.map((s) => [
    s.name,
    new Set(SYNAPSES.flatMap(([a, b]) => (a === s.name ? [b] : b === s.name ? [a] : []))),
  ]),
);

interface CrossLink {
  own: string;
  other: string;
  why: string;
}

/** Sinapsis de cada grupo hacia los demás, vistas desde ese grupo. */
const CROSS_LINKS: Record<string, CrossLink[]> = Object.fromEntries(
  GROUP_NAMES.map((group) => [
    group,
    SYNAPSES.flatMap(([a, b, why]): CrossLink[] => {
      if (!why) return [];
      if (groupOf(a) === group) return [{ own: a, other: b, why }];
      if (groupOf(b) === group) return [{ own: b, other: a, why }];
      return [];
    }),
  ]),
);

/* ============================ Cerebro en 3D ============================ */

/**
 * Volumen del cerebro como unión de elipsoides: dos hemisferios (la fisura entre ambos
 * aparece sola), lóbulos temporales, cerebelo y tronco encefálico.
 */
const BRAIN: { c: Vec3; r: Vec3 }[] = [
  { c: [-0.34, -0.12, 0.02], r: [0.4, 0.52, 1] },
  { c: [0.34, -0.12, 0.02], r: [0.4, 0.52, 1] },
  { c: [-0.46, 0.26, -0.1], r: [0.26, 0.22, 0.46] },
  { c: [0.46, 0.26, -0.1], r: [0.26, 0.22, 0.46] },
  { c: [-0.22, 0.46, 0.66], r: [0.26, 0.2, 0.28] },
  { c: [0.22, 0.46, 0.66], r: [0.26, 0.2, 0.28] },
  { c: [0, 0.56, 0.32], r: [0.13, 0.42, 0.14] },
];

/** Menor valor de "elipsoide normalizado" en `p`: < 1 significa dentro del cerebro. */
function brainField([x, y, z]: Vec3, skip = -1) {
  let min = Infinity;
  BRAIN.forEach(({ c, r }, i) => {
    if (i === skip) return;
    const v = ((x - c[0]) / r[0]) ** 2 + ((y - c[1]) / r[1]) ** 2 + ((z - c[2]) / r[2]) ** 2;
    if (v < min) min = v;
  });
  return min;
}

/** Generador pseudoaleatorio con semilla: el cerebro sale idéntico en cada visita y en el servidor. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Valores por punto del polvo: posición (3), normal (3) y brillo (1). */
const DUST_STRIDE = 7;

/**
 * Polvo de puntos: la superficie visible de la unión y un poco de relleno.
 * La normal permite iluminar más el borde de la silueta, que es lo que hace que se lea como cerebro.
 */
function buildDust(): Float32Array {
  const rand = seeded(11);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const out: number[] = [];

  BRAIN.forEach(({ c, r }, index) => {
    // área aproximada del elipsoide, para repartir la densidad por igual
    const area = 4 * Math.PI * (((r[0] * r[1]) ** 1.6 + (r[0] * r[2]) ** 1.6 + (r[1] * r[2]) ** 1.6) / 3) ** (1 / 1.6);
    const count = Math.round(area * 140);
    for (let i = 0; i < count; i++) {
      const dy = 1 - (2 * (i + 0.5)) / count;
      const ring = Math.sqrt(1 - dy * dy);
      const dx = Math.cos(golden * i) * ring;
      const dz = Math.sin(golden * i) * ring;
      if (brainField([c[0] + dx * r[0], c[1] + dy * r[1], c[2] + dz * r[2]], index) < 1) continue; // oculto dentro de otra parte
      const shell = 1 - rand() * 0.07; // algo de espesor, como polvo
      // bandas suaves de brillo que sugieren circunvoluciones
      const folds = 0.72 + 0.28 * Math.sin(dz * 11 + Math.sin(dy * 7) * 1.4) * Math.sin(dy * 9 + dx * 4);
      const nx = dx / r[0];
      const ny = dy / r[1];
      const nz = dz / r[2];
      const nl = Math.hypot(nx, ny, nz) || 1;
      out.push(
        c[0] + dx * r[0] * shell, c[1] + dy * r[1] * shell, c[2] + dz * r[2] * shell,
        nx / nl, ny / nl, nz / nl,
        folds,
      );
    }
  });

  let inner = 0;
  while (inner < 320) {
    const p: Vec3 = [rand() * 1.5 - 0.75, rand() * 1.62 - 0.64, rand() * 2.1 - 1.05];
    if (brainField(p) > 0.85) continue;
    out.push(p[0], p[1], p[2], 0, 0, 0, 0.3); // relleno sin normal: no participa del borde
    inner++;
  }
  return new Float32Array(out);
}

interface Placed extends Skill {
  p: Vec3;
}

/**
 * Coloca cada skill dentro de la región de su grupo y siempre dentro del cerebro (con margen).
 * De varios candidatos elige el más alejado de las neuronas ya colocadas: quedan repartidas sin encimarse.
 */
function placeNodes(): Placed[] {
  const rand = seeded(7);
  const placed: Placed[] = [];
  for (const group of GROUP_NAMES) {
    const { center, spread } = GROUPS[group];
    for (const skill of MEMBERS[group]) {
      let best: Vec3 = center;
      let bestGap = -1;
      for (let attempt = 0, found = 0; attempt < 600 && found < 24; attempt++) {
        const u = rand() * 2 - 1;
        const v = rand() * 2 - 1;
        const w = rand() * 2 - 1;
        if (u * u + v * v + w * w > 1) continue;
        const p: Vec3 = [center[0] + u * spread[0], center[1] + v * spread[1], center[2] + w * spread[2]];
        if (brainField(p) > 0.7) continue;
        found++;
        const gap = placed.reduce((m, n) => Math.min(m, Math.hypot(n.p[0] - p[0], n.p[1] - p[1], n.p[2] - p[2])), Infinity);
        if (gap > bestGap) {
          bestGap = gap;
          best = p;
        }
      }
      placed.push({ ...skill, p: best });
    }
  }
  return placed;
}

const DUST = buildDust();
const NODES = placeNodes();

/** Hacia dónde gira el cerebro para dejar cada región al frente. */
const VIEWS: Record<string, { yaw: number; pitch: number }> = Object.fromEntries(
  GROUP_NAMES.map((g) => {
    const [x, y, z] = GROUPS[g].center;
    // Las regiones del hemisferio izquierdo (x < 0) se miran desde la izquierda.
    const lateral = x + Math.sign(x || 1) * VIEW_BIAS;
    return [
      g,
      {
        yaw: Math.atan2(-lateral, z),
        pitch: clamp(Math.atan2(y, Math.hypot(lateral, z)) * 0.55 - 0.2, -0.6, 0.35),
      },
    ];
  }),
);

/* ============================== Utilidades ============================== */

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface NodeHit {
  name: string;
  x: number;
  y: number;
  r: number;
}

const overlaps = (a: Rect, list: Rect[], gap = 3) =>
  list.some((b) => a.x < b.x + b.w + gap && b.x < a.x + a.w + gap && a.y < b.y + b.h + gap && b.y < a.y + a.h + gap);

function sceneSize(width: number) {
  const compact = width < 480;
  return {
    compact,
    height: Math.round(width * (compact ? 0.92 : 0.82)),
    scale: width * (compact ? 0.4 : 0.36),
  };
}

/** Estilo del chip según el nivel: mismo lenguaje que el cerebro (más dominio = más color y brillo). */
function chipStyle(level: Level, rgb: string): CSSProperties {
  if (level === "primary") return { borderColor: `rgba(${rgb},0.65)`, color: `rgb(${rgb})`, background: `rgba(${rgb},0.12)` };
  if (level === "secondary") return { borderColor: `rgba(${rgb},0.35)`, color: "rgba(255,255,255,0.8)" };
  return { borderColor: "rgba(255,255,255,0.22)", borderStyle: "dashed", color: "rgba(255,255,255,0.5)" };
}

/* ============================== Componente ============================== */

export default function TechStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(640);
  const [inView, setInView] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  // Estado que lee el bucle de dibujo sin provocar renders.
  const tourRef = useRef({ index: 0, start: 0, holdUntil: 0 });
  const viewRef = useRef({ ...VIEWS[GROUP_NAMES[0]] });
  const selectedRef = useRef<string | null>(null);
  const cardHoverRef = useRef(false);
  const dragRef = useRef<{ x: number; y: number; moved: number } | null>(null);
  const hitRef = useRef<{ nodes: NodeHit[]; labels: (Rect & { name: string })[] }>({ nodes: [], labels: [] });

  /**
   * Única fuente de verdad del grupo mostrado: mueve a la vez el giro, el brillo y las tarjetas.
   * `restart` devuelve el tiempo de lectura completo aunque el grupo ya esté activo.
   */
  const goTo = useCallback((index: number, restart = false) => {
    const tour = tourRef.current;
    if (index < 0 || (tour.index === index && !restart)) return;
    tour.index = index;
    tour.start = performance.now();
    setActiveIndex(index);
  }, []);

  const select = useCallback(
    (name: string | null) => {
      if (selectedRef.current === name) return;
      selectedRef.current = name;
      setSelected(name);
      if (name) goTo(GROUP_NAMES.indexOf(groupOf(name)));
      else tourRef.current.holdUntil = performance.now() + RESUME_MS;
    },
    [goTo],
  );

  // Solo dibuja mientras la sección está cerca de la pantalla.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (!entry.isIntersecting) {
          selectedRef.current = null;
          setSelected(null);
        }
      },
      { rootMargin: "120px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // El cerebro siempre cabe completo: solo cambia de tamaño.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.round(clamp(entry.contentRect.width, 260, 680)));
    });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  /* -------------------------------- Dibujo -------------------------------- */
  useEffect(() => {
    if (!inView) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const S = sceneSize(width);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(S.height * dpr);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const k = width / 600;
    const dotPx = S.compact ? 1.3 : 1.6;
    const titleFont = S.compact ? 9 : 10.5;
    const subFont = S.compact ? 7.5 : 8.5;
    const labelFont = S.compact ? 9 : 10.5;
    const BINS = 6;
    const bins: number[][] = Array.from({ length: BINS }, () => []);

    const tour = tourRef.current;
    tour.start = performance.now();
    let last = tour.start;
    let raf = 0;

    const draw = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;

      /* 1. Recorrido: la lectura se congela mientras alguien interactúa */
      const busy =
        dragRef.current !== null || selectedRef.current !== null || cardHoverRef.current || now < tour.holdUntil;
      if (busy) tour.start += dt;
      else if (now - tour.start > TRAVEL_MS + DWELL_MS) goTo((tour.index + 1) % GROUP_NAMES.length);

      const bar = progressRef.current;
      if (bar) {
        bar.style.transform = `scaleX(${clamp((now - tour.start - TRAVEL_MS) / DWELL_MS, 0, 1)})`;
        bar.dataset.paused = String(busy);
      }

      const active = GROUP_NAMES[tour.index];
      const view = viewRef.current;
      if (!busy) {
        const target = VIEWS[active];
        const ease = reduced ? 1 : 1 - Math.exp(-dt / 380);
        view.yaw += angleDiff(target.yaw, view.yaw) * ease;
        view.pitch += (target.pitch - view.pitch) * ease;
      }
      const yaw = view.yaw + (busy || reduced ? 0 : Math.sin(now / 2600) * 0.07);
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const cp = Math.cos(view.pitch);
      const sp = Math.sin(view.pitch);
      const rotate = (x: number, y: number, z: number) => {
        const x1 = x * cy + z * sy;
        const z1 = -x * sy + z * cy;
        const y2 = y * cp - z1 * sp;
        const z2 = y * sp + z1 * cp;
        const d = FOV / (FOV - z2);
        return { x: x1 * S.scale * d, y: y2 * S.scale * d, z: z2, d };
      };
      // Sea cual sea el giro, el centro del cerebro queda en el centro del lienzo.
      const mid = rotate(0, 0.17, 0.02);
      const shiftX = width / 2 - mid.x;
      const shiftY = S.height / 2 - mid.y;
      const project = (x: number, y: number, z: number) => {
        const p = rotate(x, y, z);
        p.x += shiftX;
        p.y += shiftY;
        return p;
      };
      const depthAlpha = (z: number) => clamp((z + 1.1) / 1.9, 0.25, 1);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, S.height);

      /* 2. Brillo suave de la región activa, bajo el polvo */
      const group = GROUPS[active];
      const pc = project(...group.center);
      const glow = ctx.createRadialGradient(pc.x, pc.y, 0, pc.x, pc.y, S.scale * 0.65 * pc.d);
      glow.addColorStop(0, `rgba(${group.rgb},0.16)`);
      glow.addColorStop(1, `rgba(${group.rgb},0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, S.height);

      /* 3. Polvo del cerebro, agrupado por brillo para pintarlo en pocas pasadas */
      for (const bin of bins) bin.length = 0;
      for (let i = 0; i < DUST.length; i += S.compact ? DUST_STRIDE * 2 : DUST_STRIDE) {
        const p = project(DUST[i], DUST[i + 1], DUST[i + 2]);
        // Los puntos que miran de canto a la cámara dibujan la silueta: se iluminan más.
        const nx = DUST[i + 3];
        const ny = DUST[i + 4];
        const nz = DUST[i + 5];
        const facing = Math.abs(ny * sp + (-nx * sy + nz * cy) * cp);
        const rim = nx || ny || nz ? 1 - facing : 0.3;
        const light = DUST[i + 6] * (0.3 + 0.7 * rim) * clamp((p.z + 1.2) / 2.2, 0.2, 1);
        bins[Math.min(BINS - 1, Math.floor(light * BINS))].push(p.x, p.y, p.d);
      }
      bins.forEach((pts, b) => {
        if (!pts.length) return;
        ctx.fillStyle = `rgba(255,226,204,${(0.08 + (b / (BINS - 1)) * 0.5).toFixed(3)})`;
        ctx.beginPath();
        for (let j = 0; j < pts.length; j += 3) {
          const s = dotPx * pts[j + 2];
          ctx.rect(pts[j] - s / 2, pts[j + 1] - s / 2, s, s);
        }
        ctx.fill();
      });

      /* 4. Posición de cada neurona en pantalla */
      const screen = new Map(NODES.map((n) => [n.name, project(...n.p)]));
      const sel = selectedRef.current;
      const neighbors = sel ? NEIGHBORS.get(sel) : undefined;
      const isFocus = (name: string) =>
        sel ? name === sel || Boolean(neighbors?.has(name)) : groupOf(name) === active;

      /* 5. Sinapsis: rectas dentro de la región, arcos con impulsos entre regiones */
      const center = project(0, 0.05, 0.05);
      SYNAPSES.forEach(([a, b], idx) => {
        const pa = screen.get(a);
        const pb = screen.get(b);
        if (!pa || !pb) return;
        const ga = groupOf(a);
        const gb = groupOf(b);
        const touchesSel = sel !== null && (a === sel || b === sel);
        const hot = sel ? touchesSel : ga === active || gb === active;
        const dim = sel !== null && !touchesSel;
        const depth = depthAlpha((pa.z + pb.z) / 2);

        if (ga === gb) {
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.strokeStyle = `rgba(${GROUPS[ga].rgb},${((hot ? 0.5 : dim ? 0.04 : 0.13) * depth).toFixed(3)})`;
          ctx.lineWidth = hot ? 1.1 : 0.7;
          ctx.stroke();
          return;
        }

        // El impulso sale del lado que se está leyendo (o de la neurona seleccionada).
        const fromA = sel ? a === sel : ga === active;
        const [from, to, gFrom, gTo] = fromA ? [pa, pb, ga, gb] : [pb, pa, gb, ga];
        const mx = (from.x + to.x) / 2;
        const my = (from.y + to.y) / 2;
        const len = Math.hypot(to.x - from.x, to.y - from.y) || 1;
        let nx = -(to.y - from.y) / len;
        let ny = (to.x - from.x) / len;
        if ((center.x - mx) * nx + (center.y - my) * ny < 0) {
          nx = -nx;
          ny = -ny;
        }
        const qx = mx + nx * len * 0.18;
        const qy = my + ny * len * 0.18;

        const alpha = (hot ? 0.9 : dim ? 0.03 : 0.2) * depth;
        const grad = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        grad.addColorStop(0, `rgba(${GROUPS[gFrom].rgb},${alpha.toFixed(3)})`);
        grad.addColorStop(1, `rgba(${GROUPS[gTo].rgb},${alpha.toFixed(3)})`);
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.quadraticCurveTo(qx, qy, to.x, to.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = hot ? 1.6 : 0.8;
        if (hot) {
          ctx.shadowColor = `rgba(${GROUPS[gFrom].rgb},0.8)`;
          ctx.shadowBlur = 8;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        if (reduced || dim) return;
        const period = hot ? 1500 : 3200;
        for (const offset of hot ? [0, 0.5] : [0]) {
          const t = (now / period + idx * 0.37 + offset) % 1;
          const u = 1 - t;
          ctx.beginPath();
          ctx.arc(u * u * from.x + 2 * u * t * qx + t * t * to.x, u * u * from.y + 2 * u * t * qy + t * t * to.y, hot ? 2.4 : 1.4, 0, TAU);
          ctx.fillStyle = `rgba(255,236,214,${((hot ? 0.95 : 0.4) * Math.sin(Math.PI * t)).toFixed(3)})`;
          ctx.fill();
        }
      });

      /* 6. Neuronas, de atrás hacia adelante. Nivel = tamaño y brillo */
      const nodeHits: NodeHit[] = [];
      for (const n of [...NODES].sort((a, b) => screen.get(a.name)!.z - screen.get(b.name)!.z)) {
        const s = screen.get(n.name)!;
        const rgb = GROUPS[n.category].rgb;
        const focus = isFocus(n.name);
        const light = GLOW[n.level] * depthAlpha(s.z) * (focus ? 1 : sel ? 0.3 : 0.6);
        const r = Math.max(S.compact ? 2.2 : 2.6, NODE_PX[n.level] * k) * s.d * (n.name === sel ? 1.5 : focus ? 1.15 : 1);

        const halo = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r * 3.4);
        halo.addColorStop(0, `rgba(${rgb},${(0.45 * light).toFixed(3)})`);
        halo.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r * 3.4, 0, TAU);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, TAU);
        if (n.level === "learning") {
          ctx.setLineDash([2, 2]);
          ctx.strokeStyle = `rgba(${rgb},${(0.1 + 0.9 * light).toFixed(3)})`;
          ctx.lineWidth = 1.1;
          ctx.stroke();
          ctx.setLineDash([]);
        } else {
          ctx.fillStyle = `rgba(${rgb},${Math.min(1, 0.35 + light).toFixed(3)})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(s.x, s.y, r * 0.42, 0, TAU);
          ctx.fillStyle = `rgba(255,250,244,${(0.9 * light).toFixed(3)})`; // destello del núcleo
          ctx.fill();
        }
        nodeHits.push({ name: n.name, x: s.x, y: s.y, r });
      }

      /* 7. Textos: nada se encima. Lo importante primero; lo demás solo si cabe */
      const taken: Rect[] = [];
      const labels: (Rect & { name: string })[] = [];
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";

      const drawTitle = (g: string) => {
        const { rgb, role } = GROUPS[g];
        const c = project(...GROUPS[g].center);
        const alpha = g === active ? 1 : 0.15 + 0.35 * depthAlpha(c.z);
        const title = g.toUpperCase();
        const sub = `${role} · ${MEMBERS[g].length} skills`;
        ctx.font = `700 ${titleFont}px ${MONO}`;
        const tw = ctx.measureText(title).width;
        ctx.font = `400 ${subFont}px ${MONO}`;
        const w = Math.max(tw, ctx.measureText(sub).width);
        const x = clamp(c.x + 14, 4, width - w - 4);
        const y = clamp(c.y - S.scale * 0.22 * c.d, titleFont, S.height - titleFont * 2.6);
        const box = { x, y: y - titleFont * 0.7, w, h: titleFont * 1.4 + subFont * 1.4 };
        if (overlaps(box, taken)) return;
        taken.push(box);
        ctx.font = `700 ${titleFont}px ${MONO}`;
        ctx.fillStyle = `rgba(${rgb},${alpha.toFixed(3)})`;
        ctx.fillText(title, x, y);
        ctx.font = `400 ${subFont}px ${MONO}`;
        ctx.fillStyle = `rgba(255,255,255,${(alpha * 0.45).toFixed(3)})`;
        ctx.fillText(sub, x, y + titleFont * 1.25);
      };

      const drawLabel = (name: string, strong: boolean) => {
        const hit = nodeHits.find((h) => h.name === name);
        if (!hit) return;
        ctx.font = `${strong ? 700 : 500} ${labelFont}px ${MONO}`;
        const w = ctx.measureText(name).width + 8;
        const h = labelFont + 6;
        const gap = hit.r + 4;
        const spots = [
          [hit.x + gap, hit.y - h / 2],
          [hit.x - gap - w, hit.y - h / 2],
          [hit.x - w / 2, hit.y - gap - h],
          [hit.x - w / 2, hit.y + gap],
        ];
        for (const [x, y] of spots) {
          const box = { x, y, w, h };
          if (x < 2 || y < 2 || x + w > width - 2 || y + h > S.height - 2 || overlaps(box, taken)) continue;
          taken.push(box);
          labels.push({ name, ...box });
          ctx.fillStyle = "rgba(6,6,6,0.66)";
          ctx.fillRect(x, y, w, h);
          ctx.fillStyle = strong ? `rgb(${GROUPS[groupOf(name)].rgb})` : "rgba(255,255,255,0.82)";
          ctx.fillText(name, x + 4, y + h / 2 + 0.5);
          return;
        }
      };

      drawTitle(active);
      // Las neuronas resaltadas son obstáculos: ningún texto las tapa.
      for (const n of nodeHits) {
        if (isFocus(n.name)) taken.push({ x: n.x - n.r, y: n.y - n.r, w: n.r * 2, h: n.r * 2 });
      }
      if (sel) drawLabel(sel, true);
      for (const s of MEMBERS[active]) if (s.name !== sel) drawLabel(s.name, false);
      neighbors?.forEach((name) => {
        if (groupOf(name) !== active) drawLabel(name, false);
      });
      for (const g of GROUP_NAMES) if (g !== active) drawTitle(g);

      hitRef.current = { nodes: nodeHits, labels };
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [inView, width, goTo]);

  /* ----------------------------- Interacción ----------------------------- */
  const pick = useCallback((clientX: number, clientY: number, pad: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null;

    const { nodes, labels } = hitRef.current;
    const label = labels.find((l) => x >= l.x && x <= l.x + l.w && y >= l.y && y <= l.y + l.h);
    if (label) return label.name;

    let best: string | null = null;
    let bestD = Infinity;
    for (const n of nodes) {
      const d = Math.hypot(n.x - x, n.y - y);
      if (d <= n.r + pad && d < bestD) {
        bestD = d;
        best = n.name;
      }
    }
    return best;
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const canvas = canvasRef.current;
      const drag = dragRef.current;
      if (drag) {
        const dx = e.clientX - drag.x;
        const dy = e.clientY - drag.y;
        drag.moved += Math.abs(dx) + Math.abs(dy);
        drag.x = e.clientX;
        drag.y = e.clientY;
        if (drag.moved > 6) {
          // Se queda donde lo dejes; tras RESUME_MS vuelve a su recorrido.
          const view = viewRef.current;
          view.yaw += dx * 0.006;
          if (e.pointerType === "mouse") view.pitch = clamp(view.pitch + dy * 0.004, -0.8, 0.6);
          if (canvas) canvas.style.cursor = "grabbing";
        }
        return;
      }
      if (e.pointerType !== "mouse") return;
      const hit = pick(e.clientX, e.clientY, 6);
      select(hit);
      if (canvas) canvas.style.cursor = hit ? "pointer" : "grab";
    };

    const onUp = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      dragRef.current = null;
      if (canvasRef.current) canvasRef.current.style.cursor = "grab";
      // En táctil no hay hover: un toque sin arrastre selecciona (o limpia si cae en vacío).
      if (drag.moved < 8 && e.pointerType !== "mouse") select(pick(e.clientX, e.clientY, 18));
      if (drag.moved >= 8) tourRef.current.holdUntil = performance.now() + RESUME_MS;
    };

    // El navegador tomó el gesto (scroll vertical en móvil): no es un arrastre del cerebro.
    const onCancel = () => {
      dragRef.current = null;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
    };
  }, [pick, select]);

  const onTab = (index: number) => {
    selectedRef.current = null;
    setSelected(null);
    goTo(index, true); // la lectura de ese grupo empieza de cero
  };

  const activeGroup = GROUP_NAMES[activeIndex];

  return (
    <section id="stack" ref={sectionRef} className="w-full relative z-30 border-t border-white/5 py-20">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-orange-500 font-mono text-xs">03.</span>
              <h2 className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/40">Technology</h2>
            </div>
            <h3 className="text-4xl md:text-5xl font-space-grotesk font-bold text-white tracking-tighter">
              MY <span className="text-orange-500">STACK</span>
            </h3>
            <p className="text-white/30 text-[11px] font-mono mt-3">
              {"// each region is a skill area · tap a neuron or a tab to explore it"}
            </p>
          </div>
          {/* El color identifica el grupo; el tamaño y el brillo, el nivel. */}
          <div className="flex flex-wrap items-center gap-4 text-[9px] font-mono uppercase tracking-wider text-white/40">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white/85 shadow-[0_0_8px_rgba(255,255,255,0.7)]" /> Core
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/60" /> In use
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full border border-dashed border-white/60" /> Exploring
            </span>
          </div>
        </div>

        <div role="tablist" aria-label="Brain areas" className="flex flex-wrap gap-2 mb-6">
          {GROUP_NAMES.map((g, i) => {
            const on = i === activeIndex;
            const { rgb } = GROUPS[g];
            return (
              <button
                key={g}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => onTab(i)}
                style={on ? { borderColor: `rgba(${rgb},0.7)`, color: `rgb(${rgb})`, background: `rgba(${rgb},0.1)` } : undefined}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                  on ? "" : "border-white/10 text-white/45 hover:text-white/80 hover:border-white/30"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: `rgb(${rgb})` }} />
                {g}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 lg:gap-10 items-start">
          <div ref={hostRef} className="relative w-full flex justify-center">
            <canvas
              ref={canvasRef}
              onPointerDown={(e) => {
                dragRef.current = { x: e.clientX, y: e.clientY, moved: 0 };
              }}
              role="img"
              aria-label="3D brain map of Jhair's skills, grouped by region and connected across areas"
              style={{
                width,
                height: sceneSize(width).height,
                maxWidth: "100%",
                cursor: "grab",
                touchAction: "pan-y", // deja hacer scroll vertical en móvil sobre el cerebro
              }}
              className="block"
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between text-[9px] font-mono uppercase tracking-[0.2em] text-white/35">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
                Atlas · {GROUP_NAMES.length} areas · {SKILLS.length} skills
              </span>
              <span className="hidden sm:inline">Drag · rotate</span>
            </div>
          </div>

          {/* Pasar el mouse por las tarjetas pausa el recorrido para leer con calma. */}
          <aside
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") cardHoverRef.current = true;
            }}
            onPointerLeave={() => {
              cardHoverRef.current = false;
              tourRef.current.holdUntil = performance.now() + 1200;
            }}
            className="flex flex-col gap-4"
          >
            <GroupCard group={activeGroup} selected={selected} progressRef={progressRef} />
            <SynapseCard group={activeGroup} selected={selected} />
          </aside>
        </div>
      </div>
    </section>
  );
}

function GroupCard({
  group,
  selected,
  progressRef,
}: {
  group: string;
  selected: string | null;
  progressRef: RefObject<HTMLDivElement | null>;
}) {
  const { rgb, cortex, role } = GROUPS[group];
  return (
    <div className="rounded-2xl border border-white/10 bg-black/50 backdrop-blur-md p-5">
      <div className="h-0.5 w-full rounded-full bg-white/10 overflow-hidden mb-5">
        <div
          ref={progressRef}
          className="h-full w-full origin-left transition-opacity data-[paused=true]:opacity-40"
          style={{ transform: "scaleX(0)", background: `rgb(${rgb})` }}
        />
      </div>
      <div key={group} className="animate-in fade-in duration-500">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: `rgb(${rgb})`, boxShadow: `0 0 8px rgba(${rgb},0.8)` }} />
          <h4 className="text-white font-space-grotesk font-bold tracking-tight text-xl">{group}</h4>
        </div>
        <p className="text-white/35 text-[10px] font-mono uppercase tracking-[0.18em] mb-4 pl-4">
          {cortex} · {role}
        </p>
        <ul className="flex flex-wrap gap-2">
          {MEMBERS[group].map((s) => (
            <li
              key={s.name}
              style={chipStyle(s.level, rgb)}
              className={`px-2.5 py-1 rounded-md border text-[11px] font-mono transition-transform ${
                s.level === "primary" ? "font-semibold" : ""
              } ${selected === s.name ? "ring-1 ring-white/50 scale-105" : ""}`}
            >
              {s.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Solo se pinta la tarjeta del grupo activo: su alto se ajusta a cuántas sinapsis tenga. */
function SynapseCard({ group, selected }: { group: string; selected: string | null }) {
  const links = CROSS_LINKS[group];
  if (!links.length) return null;
  const { rgb } = GROUPS[group];
  return (
    <div className="rounded-2xl border border-white/10 bg-black/50 backdrop-blur-md p-5">
      <div key={group} className="animate-in fade-in duration-500">
        <p className="mb-3 flex items-baseline justify-between text-[10px] font-mono uppercase tracking-[0.18em] text-white/40">
          Cross-area synapses
          <span className="text-white/25">{links.length}</span>
        </p>
        <ul className="space-y-2.5">
          {links.map(({ own, other, why }) => {
            const hot = selected === own || selected === other;
            return (
              <li
                key={own + other}
                className="border-l-2 pl-3 transition-colors"
                style={{ borderColor: hot ? `rgb(${rgb})` : "rgba(255,255,255,0.1)" }}
              >
                <p className="text-[11px] font-mono">
                  <span style={{ color: `rgb(${rgb})` }}>{own}</span>
                  <span className="text-white/35 mx-1.5">⟷</span>
                  <span style={{ color: `rgb(${GROUPS[groupOf(other)].rgb})` }}>{other}</span>
                  <span className="text-white/30"> · {groupOf(other)}</span>
                </p>
                <p className="text-[11px] text-white/45 leading-snug">{why}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
