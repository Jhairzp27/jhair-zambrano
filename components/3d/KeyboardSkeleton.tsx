"use client";

import { useEffect, useRef, useState } from "react";

interface KeyboardSkeletonProps {
  isLoaded?: boolean;
}

const KEY_ROWS = [
  { y: 24, h: 22, keys: Array.from({ length: 14 }, (_, i) => ({ x: 30 + i * 39, w: 34 })) },
  { y: 52, h: 26, keys: [...Array.from({ length: 12 }, (_, i) => ({ x: 30 + i * 39, w: 34 })), { x: 30 + 12 * 39, w: 73 }] },
  { y: 84, h: 26, keys: [...Array.from({ length: 11 }, (_, i) => ({ x: 38 + i * 39, w: 34 })), { x: 38 + 11 * 39, w: 65 }] },
  { y: 116, h: 26, keys: [...Array.from({ length: 10 }, (_, i) => ({ x: 46 + i * 39, w: 34 })), { x: 46 + 10 * 39, w: 57 }] },
  {
    y: 148, h: 26, keys: [
      { x: 30, w: 60 }, { x: 96, w: 34 },
      { x: 136, w: 240 },
      { x: 382, w: 34 }, { x: 422, w: 34 },
    ],
  },
];

const ARROWS = [
  { x: 487, y: 148, w: 30, h: 24 },
  { x: 527, y: 148, w: 30, h: 24 },
  { x: 567, y: 148, w: 30, h: 24 },
  { x: 527, y: 120, w: 30, h: 24 },
];

export default function KeyboardSkeleton({ isLoaded = false }: KeyboardSkeletonProps) {
  const [timelinePhase, setTimelinePhase] = useState<"draw" | "wave" | "breathe">("draw");
  const svgRef = useRef<SVGSVGElement>(null);
  // La salida no es un estado aparte: ocurre en cuanto el modelo cargó y la animación llegó a "breathe".
  const phase = isLoaded && timelinePhase === "breathe" ? "exit" : timelinePhase;

  useEffect(() => {
    const waveTimer = setTimeout(() => setTimelinePhase("wave"), 1800);
    const breatheTimer = setTimeout(() => setTimelinePhase("breathe"), 3200);
    return () => {
      clearTimeout(waveTimer);
      clearTimeout(breatheTimer);
    };
  }, []);

  let keyIndex = 0;

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center z-10 transition-all duration-1000 ${
        phase === "exit" ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 620 220"
        className="w-[75vw] max-w-[620px] h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="sk-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="sk-glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer frame */}
        <rect
          x="10" y="10" width="600" height="200" rx="12"
          className={`sk-frame ${phase}`}
        />

        {/* Key rows */}
        {KEY_ROWS.map((row, rowIdx) =>
          row.keys.map((key, colIdx) => {
            const idx = keyIndex++;
            const isSpacebar = key.w > 100;
            return (
              <rect
                key={`key-${rowIdx}-${colIdx}`}
                x={key.x} y={row.y} width={key.w} height={row.h} rx="3"
                className={`sk-key ${phase} ${isSpacebar ? "sk-spacebar" : ""}`}
                style={{
                  "--draw-delay": `${0.3 + idx * 0.025}s`,
                  "--wave-delay": `${idx * 0.02}s`,
                } as React.CSSProperties}
              />
            );
          })
        )}

        {/* Arrow keys (orange accent) */}
        {ARROWS.map((arrow, i) => (
          <rect
            key={`arrow-${i}`}
            x={arrow.x} y={arrow.y} width={arrow.w} height={arrow.h} rx="3"
            className={`sk-arrow ${phase}`}
            style={{
              "--draw-delay": `${1.6 + i * 0.06}s`,
              "--wave-delay": `${(keyIndex + i) * 0.02}s`,
            } as React.CSSProperties}
          />
        ))}

        {/* Loading text */}
        <text
          x="310" y="207"
          textAnchor="middle"
          className={`sk-text ${phase}`}
        >
          {phase === "breathe" ? "INITIALIZING 3D ENGINE..." : "LOADING HARDWARE..."}
        </text>
      </svg>

      <style>{`
        /* === FRAME === */
        .sk-frame {
          stroke: rgba(255,255,255,0.12);
          stroke-width: 1;
          fill: none;
          stroke-dasharray: 1800;
          stroke-dashoffset: 1800;
          animation: sk-draw 1.4s ease-out 0s forwards;
        }
        .sk-frame.breathe, .sk-frame.exit {
          animation: sk-draw 1.4s ease-out 0s forwards, sk-breathe-frame 3s ease-in-out 0s infinite;
        }

        /* === KEYS === */
        .sk-key {
          stroke: rgba(255,255,255,0.08);
          stroke-width: 0.75;
          fill: none;
          stroke-dasharray: 300;
          stroke-dashoffset: 300;
          animation: sk-draw 0.4s ease-out var(--draw-delay) forwards;
        }

        .sk-key.wave {
          animation:
            sk-draw 0.4s ease-out var(--draw-delay) forwards,
            sk-color-wave 0.6s ease-out var(--wave-delay) forwards;
        }

        .sk-key.breathe, .sk-key.exit {
          stroke-dashoffset: 0;
          animation: sk-breathe-key 2.5s ease-in-out var(--wave-delay) infinite;
        }

        .sk-spacebar {
          stroke-width: 1;
          stroke: rgba(255,255,255,0.15);
        }

        /* === ARROWS (ORANGE) === */
        .sk-arrow {
          stroke: rgba(249,115,22,0.4);
          stroke-width: 1.2;
          fill: none;
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: sk-draw 0.4s ease-out var(--draw-delay) forwards;
        }

        .sk-arrow.wave {
          animation:
            sk-draw 0.4s ease-out var(--draw-delay) forwards,
            sk-arrow-wave 0.8s ease-out var(--wave-delay) forwards;
        }

        .sk-arrow.breathe, .sk-arrow.exit {
          stroke-dashoffset: 0;
          stroke: rgba(249,115,22,0.7);
          fill: rgba(249,115,22,0.05);
          filter: url(#sk-glow);
          animation: sk-arrow-pulse 1.8s ease-in-out 0s infinite;
        }

        /* === TEXT === */
        .sk-text {
          fill: rgba(255,255,255,0.3);
          font-family: ui-monospace, monospace;
          font-size: 7px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          transition: opacity 0.5s;
        }
        .sk-text.exit { opacity: 0; }
        .sk-text.breathe { animation: sk-text-pulse 2s ease-in-out infinite; }

        /* === KEYFRAMES === */
        @keyframes sk-draw {
          to { stroke-dashoffset: 0; }
        }

        @keyframes sk-color-wave {
          0% { stroke: rgba(255,255,255,0.08); fill: none; }
          50% { stroke: rgba(249,115,22,0.6); fill: rgba(249,115,22,0.03); filter: url(#sk-glow); }
          100% { stroke: rgba(255,255,255,0.15); fill: none; filter: none; }
        }

        @keyframes sk-arrow-wave {
          0% { stroke: rgba(249,115,22,0.4); fill: none; }
          50% { stroke: rgba(249,115,22,1); fill: rgba(249,115,22,0.15); filter: url(#sk-glow-strong); }
          100% { stroke: rgba(249,115,22,0.7); fill: rgba(249,115,22,0.05); }
        }

        @keyframes sk-breathe-frame {
          0%, 100% { stroke: rgba(255,255,255,0.1); }
          50% { stroke: rgba(255,255,255,0.2); }
        }

        @keyframes sk-breathe-key {
          0%, 100% { stroke: rgba(255,255,255,0.1); }
          50% { stroke: rgba(255,255,255,0.18); }
        }

        @keyframes sk-arrow-pulse {
          0%, 100% { stroke: rgba(249,115,22,0.5); fill: rgba(249,115,22,0.03); }
          50% { stroke: rgba(249,115,22,0.9); fill: rgba(249,115,22,0.08); }
        }

        @keyframes sk-text-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
