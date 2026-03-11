"use client";

import Spline from "@splinetool/react-spline";
import type { Application, SPEObject } from "@splinetool/runtime";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
const DESKTOP_KEYFRAMES: readonly ScrollKeyframe[] = [
  { scroll: 0, tx: 10, ty: 7, scale: 1, rotX: 0, rotY: 0, rotZ: 0 },
  { scroll: 120, tx: 10, ty: 2, scale: 0.9, rotX: 0.1, rotY: 0.1, rotZ: -0.1 },
  { scroll: 800, tx: 0, ty: 10, scale: 0.75, rotX: 0, rotY: Math.PI / 2, rotZ: -(Math.PI * 2) },
  { scroll: 1600, tx: 0, ty: 40, scale: 0.5, rotX: -0.3, rotY: Math.PI, rotZ: -(Math.PI * 2) - Math.PI / 4 },
  { scroll: 2400, tx: 0, ty: 15, scale: 0.85, rotX: 0.35, rotY: Math.PI * 2, rotZ: -(Math.PI * 2) },
  { scroll: 3200, tx: 0, ty: 10, scale: 0.6, rotX: -0.2, rotY: Math.PI * 2.5, rotZ: -(Math.PI * 3) },
  { scroll: 4500, tx: -23.5, ty: 33, scale: 0.81, rotX: -0.74, rotY: Math.PI * 4, rotZ: -(Math.PI * 4) - 0.04 },
];

// --- KEYFRAMES: MOBILE (< 768px) ---
const MOBILE_KEYFRAMES: readonly ScrollKeyframe[] = [
  { scroll: 0, tx: -15, ty: 2, scale: 1.9, rotX: Math.PI * 2 + 0.4, rotY: Math.PI / 2 + 0.4, rotZ: 0 },
  { scroll: 450, tx: 0, ty: 10, scale: 1.55, rotX: Math.PI + 0.2, rotY: Math.PI / 2, rotZ: 0 },
  { scroll: 800, tx: 0, ty: 0, scale: 1.55, rotX: 0.1, rotY: Math.PI / 4, rotZ: 0 },
  { scroll: 1600, tx: 0, ty: 45, scale: 1.5, rotX: -0.2, rotY: Math.PI, rotZ: -(Math.PI * 2) },
  { scroll: 2400, tx: 0, ty: 20, scale: 1.5, rotX: 0.3, rotY: Math.PI * 2, rotZ: 0 },
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

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const splineAppRef = useRef<Application | null>(null);
  const keyboardRef = useRef<SPEObject | null>(null);

  // Estado para responsive
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

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

  // Selección de estrategia de animación
  const currentKeyframes = useMemo(() => {
    if (deviceType === 'mobile') return MOBILE_KEYFRAMES;
    if (deviceType === 'tablet') return TABLET_KEYFRAMES;
    return DESKTOP_KEYFRAMES;
  }, [deviceType]);

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

  // --- 6. CARGA DE ESCENA (Spline Events) ---
  function onSplineLoad(app: Application) {
    splineAppRef.current = app;
    const keyboard = app.findObjectByName("Keyboard");
    keyboardRef.current = keyboard ?? null;

    if (keyboard) {
      const initial = scrollState.current;
      keyboard.rotation.x = initial.rotX;
      keyboard.rotation.y = initial.rotY;
      keyboard.rotation.z = initial.rotZ;
      // La escala la maneja el contenedor CSS para mejor performance,
      // pero si Spline la requiere interna, se puede setear aquí.
      keyboard.scale.x = 0.5;
      keyboard.scale.y = 0.5;
      keyboard.scale.z = 0.5;
    }
  }

  // Estilos iniciales para JSX (evitar FOUC en el contenedor)
  const initial = currentKeyframes[0];

  return (
    <div
      ref={containerRef}
      style={{
        transform: `translate3d(${initial.tx}vw, ${initial.ty}vh, 0) scale(${initial.scale})`,
        willChange: "transform", // Hint para el navegador
      }}
      // 🔥 CAMBIO CLAVE DE CAPAS: Le ponemos z-20 y h-[100dvh]
      className="fixed inset-0 z-20 w-screen h-dvh flex items-center justify-center pointer-events-none"
    >
      {/* Contenedor más grande para evitar clipping en rotaciones extremas */}
      <div className="w-[150vw] h-[150vh] flex items-center justify-center">
        <Spline scene="/models/keyboard.splinecode" onLoad={onSplineLoad} />
      </div>
    </div>
  );
}