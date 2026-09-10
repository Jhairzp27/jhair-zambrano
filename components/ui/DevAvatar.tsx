"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function DevAvatar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [typingHand, setTypingHand] = useState<"left" | "right">("left");

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (window.innerWidth / 2);
    const dy = (e.clientY - cy) / (window.innerHeight / 2);
    const clamp = (v: number, max: number) => Math.max(-max, Math.min(max, v));
    setEyeOffset({ x: clamp(dx * 3, 2.5), y: clamp(dy * 2, 1.5) });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    const id = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setTypingHand((p) => (p === "left" ? "right" : "left"));
    }, 300 + Math.random() * 200);
    return () => clearInterval(id);
  }, []);

  const ex = eyeOffset.x;
  const ey = eyeOffset.y;

  return (
    <div ref={containerRef} className="w-full max-w-[260px] select-none">
      <svg
        viewBox="0 0 200 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-[0_0_30px_rgba(249,115,22,0.08)]"
      >
        <defs>
          <clipPath id="av-g1"><rect x="0" y="55" width="200" height="5" /></clipPath>
          <clipPath id="av-g2"><rect x="0" y="82" width="200" height="4" /></clipPath>
          <filter id="av-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* HAIR - pixel spikes */}
        {[
          { x: 62, h: 16, o: 0.12 },
          { x: 70, h: 24, o: 0.14 },
          { x: 78, h: 28, o: 0.16 },
          { x: 86, h: 22, o: 0.14 },
          { x: 94, h: 30, o: 0.15 },
          { x: 102, h: 26, o: 0.13 },
          { x: 110, h: 20, o: 0.11 },
          { x: 118, h: 14, o: 0.09 },
          { x: 126, h: 10, o: 0.07 },
        ].map((s) => (
          <rect key={s.x} x={s.x} y={36 - s.h} width="8" height={s.h} fill={`rgba(255,255,255,${s.o})`} />
        ))}
        <rect x="58" y="36" width="84" height="8" fill="rgba(255,255,255,0.08)" />

        {/* HEAD */}
        <rect x="62" y="40" width="76" height="60" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="rgba(255,255,255,0.02)" />

        {/* Glitch offset */}
        <rect x="65" y="40" width="76" height="60" stroke="rgba(249,115,22,0.1)" strokeWidth="0.6" fill="none" clipPath="url(#av-g1)" />

        {/* GLASSES */}
        <rect x="70" y="58" width="18" height="14" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" fill="rgba(255,255,255,0.02)" />
        <rect x="112" y="58" width="18" height="14" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" fill="rgba(255,255,255,0.02)" />
        <rect x="88" y="63" width="24" height="2" fill="rgba(255,255,255,0.12)" />

        {/* EYES */}
        {isBlinking ? (
          <>
            <rect x="74" y="64" width="10" height="1.5" fill="rgba(249,115,22,0.6)" />
            <rect x="116" y="64" width="10" height="1.5" fill="rgba(249,115,22,0.6)" />
          </>
        ) : (
          <>
            <rect x={74 + ex} y={62 + ey} width="10" height="6" fill="rgba(249,115,22,0.8)" />
            <rect x={116 + ex} y={62 + ey} width="10" height="6" fill="rgba(249,115,22,0.8)" />
            <rect x={78 + ex * 1.2} y={63 + ey * 1.2} width="4" height="4" fill="rgba(0,0,0,0.7)" />
            <rect x={120 + ex * 1.2} y={63 + ey * 1.2} width="4" height="4" fill="rgba(0,0,0,0.7)" />
            <rect x={80 + ex * 1.2} y={63 + ey * 1.2} width="2" height="2" fill="rgba(255,255,255,0.5)" />
            <rect x={122 + ex * 1.2} y={63 + ey * 1.2} width="2" height="2" fill="rgba(255,255,255,0.5)" />
          </>
        )}

        {/* Mouth */}
        <rect x="88" y="82" width="24" height="3" fill="rgba(255,255,255,0.08)" />

        {/* Glitch bar on mouth */}
        <rect x="85" y="82" width="30" height="4" stroke="rgba(0,180,255,0.06)" strokeWidth="0.4" fill="none" clipPath="url(#av-g2)" />

        {/* BODY */}
        <rect x="52" y="106" width="96" height="70" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="rgba(255,255,255,0.02)" />
        <rect x="92" y="106" width="16" height="50" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        <rect x="94" y="108" width="12" height="20" fill="rgba(255,255,255,0.04)" />

        {/* Arms */}
        <rect
          x="36" y="110" width="16" height="50"
          stroke="rgba(255,255,255,0.1)" strokeWidth="0.8"
          fill="rgba(255,255,255,0.02)"
          style={{ transform: typingHand === "left" ? "translateY(-2px)" : "none", transition: "transform 0.15s" }}
        />
        <rect
          x="148" y="110" width="16" height="50"
          stroke="rgba(255,255,255,0.1)" strokeWidth="0.8"
          fill="rgba(255,255,255,0.02)"
          style={{ transform: typingHand === "right" ? "translateY(-2px)" : "none", transition: "transform 0.15s" }}
        />

        {/* Glitch scanlines */}
        <rect x="40" y="140" width="120" height="2" fill="rgba(249,115,22,0.06)">
          <animate attributeName="x" values="40;43;38;40" dur="3s" repeatCount="indefinite" />
        </rect>
        <rect x="45" y="165" width="110" height="1.5" fill="rgba(0,180,255,0.04)">
          <animate attributeName="x" values="45;42;47;45" dur="3s" repeatCount="indefinite" />
        </rect>

        {/* Pixel dissolve particles */}
        <rect x="148" y="106" width="4" height="4" fill="rgba(255,255,255,0.06)" />
        <rect x="152" y="110" width="4" height="4" fill="rgba(255,255,255,0.04)" />
        <rect x="156" y="114" width="4" height="4" fill="rgba(255,255,255,0.02)" />
        <rect x="48" y="170" width="4" height="4" fill="rgba(249,115,22,0.08)" />
        <rect x="44" y="166" width="4" height="4" fill="rgba(249,115,22,0.05)" />
        <rect x="152" y="168" width="4" height="4" fill="rgba(249,115,22,0.06)" />

        {/* Code text */}
        <text x="55" y="195" fill="rgba(249,115,22,0.15)" fontFamily="monospace" fontSize="5.5">
          class Dev extends Human {"{"}
        </text>
        <text x="60" y="205" fill="rgba(255,255,255,0.08)" fontFamily="monospace" fontSize="5">
          {"  build() { return art; }"}
        </text>
        <text x="55" y="215" fill="rgba(249,115,22,0.1)" fontFamily="monospace" fontSize="5.5">
          {"}"}
        </text>

        {/* Cursor blink */}
        <rect x="70" y="218" width="4" height="7" fill="rgba(249,115,22,0.5)">
          <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
        </rect>

        {/* Status */}
        <circle cx="145" cy="45" r="4" fill="rgba(52,211,153,0.8)" filter="url(#av-glow)" />
        <circle cx="145" cy="45" r="7" stroke="rgba(52,211,153,0.3)" strokeWidth="0.5" fill="none">
          <animate attributeName="r" values="7;9;7" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>

      <div className="mt-4 text-center">
        <p className="text-sm font-space-grotesk font-bold uppercase tracking-[0.2em] text-orange-500">
          Software Engineer
        </p>
        <p className="text-[9px] font-mono text-white/30 uppercase tracking-[0.3em] mt-1.5">
          &lt;Developer mode=&quot;active&quot; /&gt;
        </p>
      </div>
    </div>
  );
}
