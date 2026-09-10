"use client";

import Spline from "@splinetool/react-spline";
import type { Application, SPEObject } from "@splinetool/runtime";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useKeyboard } from "@/components/context/KeyboardContext";
import KeyboardSkeleton from "./KeyboardSkeleton";

gsap.registerPlugin(ScrollTrigger);

interface ScrollKeyframe {
  scroll: number;
  tx: number;
  ty: number;
  scale: number;
  rotX: number;
  rotY: number;
  rotZ: number;
}

const PARALLAX_CONFIG = {
  MAX_RADIUS: 600,
  DEFAULT_INTENSITY: 0.15,
  LANDED_INTENSITY: 0.005,
  LANDED_SCROLL_THRESHOLD: 0.95,
} as const;

// --- KEYFRAMES: DESKTOP (> 1024px) ---
// Los dos primeros frames (hero) reciben un offset dinámico (dTx/dTy) para anclar
// el teclado a la "R" del apellido sin importar el tamaño de pantalla. Ver alignToSurname().
const makeDesktopKeyframes = (dTx: number, dTy: number): readonly ScrollKeyframe[] => [
  { scroll: 0, tx: 10 + dTx, ty: 7 + dTy, scale: 1, rotX: 0, rotY: 0, rotZ: 0 },
  { scroll: 120, tx: 10 + dTx, ty: 2 + dTy, scale: 0.9, rotX: 0.1, rotY: 0.1, rotZ: -0.1 },
  { scroll: 800, tx: 0, ty: 10, scale: 0.75, rotX: 0, rotY: Math.PI / 2, rotZ: -(Math.PI * 2) },
  { scroll: 1600, tx: 0, ty: 40, scale: 0.5, rotX: -0.3, rotY: Math.PI, rotZ: -(Math.PI * 2) - Math.PI / 4 },
  { scroll: 2400, tx: 0, ty: 15, scale: 0.85, rotX: 0.35, rotY: Math.PI * 2, rotZ: -(Math.PI * 2) },
  // ~3270 es la sección STACK: el teclado sale casi entero por la izquierda
  // para no tapar el cerebro (que ocupa la columna izquierda).
  { scroll: 3200, tx: -62, ty: 30, scale: 0.42, rotX: -0.2, rotY: Math.PI * 2.5, rotZ: -(Math.PI * 3) },
  { scroll: 4500, tx: -23.5, ty: 33, scale: 0.81, rotX: -0.74, rotY: Math.PI * 4, rotZ: -(Math.PI * 4) - 0.04 },
];

// Calibración del anclaje del teclado en el hero (desktop).
// El teclado 3D vive dentro de un canvas de 150vw, por lo que su centro visual está
// desplazado respecto al centro del contenedor por una fracción ~constante del viewport.
// KB_CENTER_X es esa fracción + 0.5: al restarla a la fracción horizontal objetivo
// (el centro de "RANO") obtenemos el tx que coloca el teclado justo sobre esas letras,
// sin importar el ancho de pantalla. KB_CENTER_Y hace lo análogo en vertical (mantiene
// el encuadre a 1440x900 y sigue la altura del apellido).
const KB_CENTER_X = 0.222;
const KB_CENTER_Y = 0.459;

// --- KEYFRAMES: MOBILE (< 768px) ---
const MOBILE_KEYFRAMES: readonly ScrollKeyframe[] = [
  { scroll: 0, tx: -15, ty: 2, scale: 1.9, rotX: Math.PI * 2 + 0.4, rotY: Math.PI / 2 + 0.4, rotZ: 0 },
  { scroll: 450, tx: 0, ty: 10, scale: 1.55, rotX: Math.PI + 0.2, rotY: Math.PI / 2, rotZ: 0 },
  { scroll: 800, tx: 0, ty: 0, scale: 1.55, rotX: 0.1, rotY: Math.PI / 4, rotZ: 0 },
  { scroll: 1600, tx: 0, ty: 45, scale: 1.5, rotX: -0.2, rotY: Math.PI, rotZ: -(Math.PI * 2) },
  { scroll: 2400, tx: 0, ty: 20, scale: 1.5, rotX: 0.3, rotY: Math.PI * 2, rotZ: 0 },
  // ~3270 = sección STACK: casi fuera por la izquierda para no tapar el cerebro ni la tarjeta
  { scroll: 3300, tx: -62, ty: 40, scale: 0.7, rotX: -0.2, rotY: Math.PI * 2.6, rotZ: -(Math.PI * 3) },
  { scroll: 4500, tx: 0, ty: 15, scale: 1.44, rotX: -0.8, rotY: Math.PI * 4, rotZ: -(Math.PI * 4) - 0.04 },
];

// --- KEYFRAMES: TABLET (768px - 1024px) ---
const TABLET_KEYFRAMES: readonly ScrollKeyframe[] = [
  { scroll: 0,    tx: 0, ty: -2, scale: 1.3,  rotX: 0.1, rotY: 0, rotZ: 0 },
  { scroll: 450, tx: 0, ty: 10, scale: 1.55, rotX: Math.PI *2 + 0.2, rotY: Math.PI /2, rotZ: 0 },
  { scroll: 800, tx: 0, ty: 20, scale: 1.15, rotX: 0.2, rotY: (Math.PI /4) , rotZ: 0 },
  { scroll: 1600, tx: 0, ty: 45, scale: 1.5, rotX: -0.2, rotY: Math.PI, rotZ: -(Math.PI * 2) },
  { scroll: 2400, tx: 0, ty: 20, scale: 1.5, rotX: 0.3, rotY: Math.PI * 2, rotZ: 0 },
  { scroll: 4500, tx: -1, ty: 30, scale: 1.44, rotX: -0.8, rotY: Math.PI * 4, rotZ: -(Math.PI * 4) - 0.04 },
];

// sessionStorage no emite eventos dentro de la misma pestaña: basta con leerlo al renderizar.
const noopSubscribe = () => () => {};
const readKeyboardShown = () => {
  try {
    return sessionStorage.getItem("kb-shown") === "1";
  } catch {
    return false; // modo privado o storage bloqueado
  }
};

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const splineAppRef = useRef<Application | null>(null);
  const keyboardRef = useRef<SPEObject | null>(null);
  const { markSceneReady, setLightsOn } = useKeyboard();

  // Estado para responsive
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isSplineLoaded, setIsSplineLoaded] = useState(false);

  // El skeleton solo se muestra si el teclado NO se ha mostrado aún en esta sesión.
  // En el servidor y durante la hidratación vale null: no se pinta nada hasta leer sessionStorage.
  const keyboardShownBefore = useSyncExternalStore(noopSubscribe, readKeyboardShown, () => null);

  const scrollState = useRef({
    tx: 0, ty: 0, scale: 1, rotX: 0, rotY: 0, rotZ: 0,
  });

  const mouseOffset = useRef({ x: 0, y: 0 });
  const scrollProgressRef = useRef(0);

  // --- 2. DETECCIÓN DE DISPOSITIVO (Strategy Pattern implícito) ---
  useEffect(() => {
    const checkDevice = () => {
      const w = window.innerWidth;
      
      let newDevice: 'mobile' | 'tablet' | 'desktop' = 'desktop';
      if (w < 640) newDevice = 'mobile';
      else if (w >= 640 && w < 1024) newDevice = 'tablet';
      else newDevice = 'desktop';

      setDeviceType(newDevice);
    };
    
    checkDevice();

    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkDevice, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // --- DETECCIÓN EXACTA DEL TECLADO MÓVIL (Visual Viewport) ---
  useEffect(() => {
    if (!window.visualViewport) return;
    const initialHeight = window.visualViewport.height;

    const handleViewportResize = () => {
      if (window.visualViewport!.scale > 1.05) {
        setIsKeyboardOpen(false);
        return;
      }

      const activeTag = document.activeElement?.tagName;
      const isInputFocused = activeTag === "INPUT" || activeTag === "TEXTAREA";

      // Solo si la altura se reduce MÁS de 150px Y hay un input activo, es el teclado.
      if (window.visualViewport!.height < initialHeight - 150 && isInputFocused) {
        setIsKeyboardOpen(true);
      } else {
        setIsKeyboardOpen(false);
      }
    };

    window.visualViewport.addEventListener("resize", handleViewportResize);
    window.visualViewport.addEventListener("scroll", handleViewportResize);
    
    return () => {
      window.visualViewport?.removeEventListener("resize", handleViewportResize);
      window.visualViewport?.removeEventListener("scroll", handleViewportResize);
    }
  }, []);

  // Offset del hero en desktop para anclar el teclado a la "R" del apellido.
  const [heroOffset, setHeroOffset] = useState({ dTx: 0, dTy: 0 });

  useEffect(() => {
    // Móvil y tablet usan keyframes propios que no leen este offset.
    if (deviceType !== "desktop") return;
    const alignToSurname = () => {
      const anchor = document.getElementById("surname-anchor");
      if (!anchor) return;
      const r = anchor.getBoundingClientRect();
      if (!r.width) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Objetivo horizontal: el borde IZQUIERDO del teclado se alinea con el inicio de la
      // "R", de modo que el teclado quede sobre "RANO" y se extienda a la derecha.
      const rLeftFracX = r.left / vw;
      // Vertical: seguimos la parte superior de la "R" (a scroll 0).
      const fracTop = (r.top + window.scrollY) / vh;
      const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
      const txAbs = clamp((rLeftFracX - KB_CENTER_X) * 100, 0, 55);
      const tyAbs = clamp((fracTop - KB_CENTER_Y) * 100, -3, 18);
      // makeDesktopKeyframes suma 10/7 base, por eso guardamos el delta.
      setHeroOffset({ dTx: txAbs - 10, dTy: tyAbs - 7 });
    };
    alignToSurname();
    // Re-medir cuando la fuente (Space Grotesk) termine de cargar: cambia el ancho de la "R".
    if (document.fonts?.ready) {
      document.fonts.ready.then(alignToSurname);
    }
    window.addEventListener("resize", alignToSurname);
    return () => window.removeEventListener("resize", alignToSurname);
  }, [deviceType]);

  // Selección de estrategia de animación
  const currentKeyframes = useMemo(() => {
    if (deviceType === 'mobile') return MOBILE_KEYFRAMES;
    if (deviceType === 'tablet') return TABLET_KEYFRAMES;
    return makeDesktopKeyframes(heroOffset.dTx, heroOffset.dTy);
  }, [deviceType, heroOffset]);

  // --- 3. LOGICA DE RENDERIZADO ---
  const applyTransforms = useCallback(() => {
    const s = scrollState.current;

    // Variables copiadas para manipularlas
    let { tx, ty, scale, rotX, rotY, rotZ } = s;

    // Solo actúa si el teclado está abierto Y es móvil
    if (isKeyboardOpen && deviceType === 'mobile') {
      tx = 0;
      ty = 50;
      scale = 1.3;
      rotX = -0.8;
      rotY = Math.PI * 4;
      rotZ = -(Math.PI * 4) - 0.04;
    }

    // Aplicar al contenedor DOM (Posición y Escala)
    if (containerRef.current) {
      containerRef.current.style.transform = `translate3d(${tx}vw, ${ty}vh, 0) scale(${scale})`;
    }

    // Aplicar al objeto 3D (Rotación + Parallax)
    if (keyboardRef.current) {
      // Parallax activado en Tablet y Desktop
      const mouse = deviceType === 'mobile' ? { x: 0, y: 0 } : mouseOffset.current;

      const isLanded = scrollProgressRef.current > PARALLAX_CONFIG.LANDED_SCROLL_THRESHOLD;
      const factor = isLanded ? PARALLAX_CONFIG.LANDED_INTENSITY : PARALLAX_CONFIG.DEFAULT_INTENSITY;

      keyboardRef.current.rotation.x = rotX + mouse.y * factor;
      keyboardRef.current.rotation.y = rotY + mouse.x * factor;
      keyboardRef.current.rotation.z = rotZ;
    }
  }, [deviceType, isKeyboardOpen]);

  // --- MANEJADOR DE TRANSICIONES SUAVES (Anti-Agressividad) ---
  useEffect(() => {
    if (!containerRef.current) return;

    if (isKeyboardOpen && deviceType === 'mobile') {
      containerRef.current.style.transition = "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)";
      applyTransforms();
    } else {
      containerRef.current.style.transition = "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)";
      applyTransforms();
      
      const timer = setTimeout(() => {
        if (containerRef.current && !isKeyboardOpen) {
          containerRef.current.style.transition = "none";
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isKeyboardOpen, deviceType, applyTransforms]);

  // --- INICIALIZACIÓN ---
  useEffect(() => {
    const initial = currentKeyframes[0];
    scrollState.current = { ...initial };

    // Fuerza la actualización visual inmediata
    applyTransforms();
  }, [currentKeyframes, applyTransforms]);

  // --- 4. EVENT HANDLERS ---
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (deviceType === 'mobile') return;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Normalización de coordenadas (-1 a 1)
      const intensityX = (e.clientX / window.innerWidth) * 2 - 1;
      const intensityY = -(e.clientY / window.innerHeight) * 2 + 1;

      // Cálculo de distancia para atenuación en bordes
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      let radialFactor = 1 - distance / PARALLAX_CONFIG.MAX_RADIUS;
      if (radialFactor < 0) radialFactor = 0;

      mouseOffset.current.x = intensityX * radialFactor;
      mouseOffset.current.y = intensityY * radialFactor;

      applyTransforms();
    },
    [deviceType, applyTransforms],
  );

  // --- AUTO ON/OFF: el teclado se enciende al salir del hero y se apaga al volver arriba.
  // Detectamos el CRUCE del umbral (con histéresis) para no pelear con el botón manual:
  // dentro de la zona encendida el usuario puede apagarlo a mano y se respeta.
  useEffect(() => {
    const ON_AT = 0.55;   // fracción del alto del hero
    const OFF_AT = 0.25;  // apagar solo al volver bien arriba
    let insideHero = true;

    const onScroll = () => {
      const y = window.scrollY;
      const h = window.innerHeight || 1;
      if (insideHero && y > h * ON_AT) {
        insideHero = false;
        setLightsOn(true);
      } else if (!insideHero && y < h * OFF_AT) {
        insideHero = true;
        setLightsOn(false);
      }
    };

    // Estado inicial explícito: apagado si cargamos dentro del hero.
    const h0 = window.innerHeight || 1;
    insideHero = window.scrollY < h0 * ON_AT;
    setLightsOn(!insideHero);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [setLightsOn]);

  // --- 5. ORQUESTACIÓN DE ANIMACIONES (GSAP + ScrollTrigger) ---
  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress;
        },
      },
    });

    for (let i = 1; i < currentKeyframes.length; i++) {
      const prev = currentKeyframes[i - 1];
      const curr = currentKeyframes[i];

      tl.to(
        scrollState.current,
        {
          tx: curr.tx, ty: curr.ty, scale: curr.scale,
          rotX: curr.rotX, rotY: curr.rotY, rotZ: curr.rotZ,
          duration: curr.scroll - prev.scroll,
          ease: "none",
          onUpdate: applyTransforms,
        },
        prev.scroll,
      );
    }

    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup riguroso
    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [currentKeyframes, handleMouseMove, applyTransforms]);

  function onSplineLoad(app: Application) {
    splineAppRef.current = app;
    const keyboard = app.findObjectByName("Keyboard");
    keyboardRef.current = keyboard ?? null;

    if (keyboard) {
      const initial = scrollState.current;
      keyboard.rotation.x = initial.rotX;
      keyboard.rotation.y = initial.rotY;
      keyboard.rotation.z = initial.rotZ;
      keyboard.scale.x = 0.5;
      keyboard.scale.y = 0.5;
      keyboard.scale.z = 0.5;
    }

    // Desde aquí el botón de luces de SystemControls ya puede enviar sus teclas a la escena.
    markSceneReady();

    setIsSplineLoaded(true);
    try {
      sessionStorage.setItem("kb-shown", "1");
    } catch {
      // sessionStorage no disponible (modo privado, etc.) — no es crítico
    }
  }

  // Estilos iniciales para JSX (evitar FOUC en el contenedor)
  const initial = currentKeyframes[0];

  return (
    <div
      ref={containerRef}
      style={{
        transform: `translate3d(${initial.tx}vw, ${initial.ty}vh, 0) scale(${initial.scale})`,
        willChange: "transform",
      }}
      className="fixed inset-0 z-15 w-screen h-dvh flex items-center justify-center pointer-events-none"
    >
      {/* Skeleton SVG mientras carga Spline (solo si el teclado no se ha mostrado antes) */}
      {keyboardShownBefore === false && (
        <KeyboardSkeleton isLoaded={isSplineLoaded} />
      )}

      {/* Contenedor del modelo 3D */}
      <div
        className={`w-[150vw] h-[150vh] flex items-center justify-center transition-opacity duration-[1500ms] ease-out ${
          isSplineLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <Spline scene="/models/keyboard.splinecode" onLoad={onSplineLoad} />
      </div>
    </div>
  );
}