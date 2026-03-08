'use client';

import Spline from '@splinetool/react-spline';
import type { Application, SPEObject } from '@splinetool/runtime';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCallback, useEffect, useRef } from 'react';
import { useSound } from '../context/SoundContext';


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

const SCROLL_KEYFRAMES: readonly ScrollKeyframe[] = [
  // Inicio
  { scroll: 0,    tx:  10, ty:  7, scale: 1,    rotX:  0,    rotY: 0,                 rotZ: 0 },
  { scroll: 120,  tx:  10, ty:  2, scale: 0.9,  rotX:  0.1,  rotY: 0.1,               rotZ: -0.1 },
  { scroll: 800,  tx:   0, ty: 10, scale: 0.75, rotX:  0,    rotY: Math.PI / 2,       rotZ: -(Math.PI * 2) },
  { scroll: 1600, tx:   0, ty: 40, scale: 0.65,  rotX: -0.3,  rotY: Math.PI,           rotZ: -(Math.PI * 2) - Math.PI / 4 },
  { scroll: 2400, tx:   0, ty: 15, scale: 0.85, rotX:  0.35, rotY: Math.PI * 2,       rotZ: -(Math.PI * 2) },
  { scroll: 3200, tx:   0, ty: 10, scale: 0.6,  rotX: -0.2,  rotY: Math.PI * 2.5,     rotZ: -(Math.PI * 3) },
  { scroll: 4500, tx: -23.5,  ty: 40.5, scale: 0.81, rotX: -0.74, rotY: Math.PI * 4, rotZ: -(Math.PI * 4) - 0.04 },
];

const MOUSE_PARALLAX = {
  MAX_RADIUS: 600,
  DEFAULT_INTENSITY: 0.15,
  LANDED_INTENSITY: 0.005,
  LANDED_SCROLL_THRESHOLD: 0.95,
} as const;

const INTRO_KEYPRESS_SEQUENCE = [
  { key: 'Key j', delay: 1000 },
  { key: 'Key h', delay: 1300 },
  { key: 'Key a', delay: 1600 },
  { key: 'Key i', delay: 1900 },
  { key: 'Key r', delay: 2200 },
] as const;

const KEYBOARD_INITIAL_SCALE = 0.5;
const KEY_PRESS_DURATION_MS = 200;

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const splineAppRef = useRef<Application | null>(null);
  const keyboardRef = useRef<SPEObject | null>(null);
  const { isMuted } = useSound(); // Consumimos el estado

  const scrollState = useRef({
    tx: SCROLL_KEYFRAMES[0].tx,
    ty: SCROLL_KEYFRAMES[0].ty,
    scale: SCROLL_KEYFRAMES[0].scale,
    rotX: SCROLL_KEYFRAMES[0].rotX,
    rotY: SCROLL_KEYFRAMES[0].rotY,
    rotZ: SCROLL_KEYFRAMES[0].rotZ,
  });

  const mouseOffset = useRef({ x: 0, y: 0 });
  const scrollProgressRef = useRef(0);

  const applyTransforms = useCallback(() => {
    const s = scrollState.current;

    if (containerRef.current) {
      containerRef.current.style.transform = 
        `translate(${s.tx}vw, ${s.ty}vh) scale(${s.scale})`;
    }

    if (keyboardRef.current) {
      const mouse = mouseOffset.current;
      const isLanded = scrollProgressRef.current > MOUSE_PARALLAX.LANDED_SCROLL_THRESHOLD;
      const factor = isLanded ? MOUSE_PARALLAX.LANDED_INTENSITY : MOUSE_PARALLAX.DEFAULT_INTENSITY;

      keyboardRef.current.rotation.x = s.rotX + mouse.y * factor;
      keyboardRef.current.rotation.y = s.rotY + mouse.x * factor;
      keyboardRef.current.rotation.z = s.rotZ;
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    let intensity = 1 - distance / MOUSE_PARALLAX.MAX_RADIUS;
    if (intensity < 0) intensity = 0;

    mouseOffset.current.x = ((e.clientX / window.innerWidth) * 2 - 1) * intensity;
    mouseOffset.current.y = (-(e.clientY / window.innerHeight) * 2 + 1) * intensity;

    applyTransforms();
  }, [applyTransforms]);

  useEffect(() => {
    const tl = gsap.timeline();

    for (let i = 1; i < SCROLL_KEYFRAMES.length; i++) {
      const prev = SCROLL_KEYFRAMES[i - 1];
      const curr = SCROLL_KEYFRAMES[i];

      tl.to(scrollState.current, {
        tx: curr.tx,
        ty: curr.ty,
        scale: curr.scale,
        rotX: curr.rotX,
        rotY: curr.rotY,
        rotZ: curr.rotZ,
        duration: curr.scroll - prev.scroll,
        ease: 'none',
        onUpdate: applyTransforms,
      }, prev.scroll);
    }

    // --- AQUÍ ESTÁ LA MAGIA ---
    const trigger = ScrollTrigger.create({
      animation: tl,
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
      },
    });

    window.addEventListener('mousemove', handleMouseMove);

    // 1. Método DOM: Busca todos los elementos de audio/video creados por Spline
    const mediaElements = document.querySelectorAll('audio, video');
    mediaElements.forEach((el) => {
      // TypeScript puede quejarse aquí, casteamos a HTMLMediaElement
      (el as HTMLMediaElement).muted = isMuted;
    });

    // 2. Método Observer: Spline a veces crea los audios dinámicamente al presionar teclas.
    // Observamos cambios en el DOM para silenciar nuevos sonidos al instante.
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLMediaElement) {
            node.muted = isMuted;
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      trigger.kill();
      tl.kill();
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };

    
  }, [applyTransforms, handleMouseMove, isMuted]);

  function onSplineLoad(app: Application) {
    splineAppRef.current = app;
    const keyboard = app.findObjectByName('Keyboard');
    keyboardRef.current = keyboard ?? null;

    if (keyboard) {
      keyboard.scale.x = KEYBOARD_INITIAL_SCALE;
      keyboard.scale.y = KEYBOARD_INITIAL_SCALE;
      keyboard.scale.z = KEYBOARD_INITIAL_SCALE;
      keyboard.position.x = 0;
      keyboard.position.y = 0;
    }

    for (const { key, delay } of INTRO_KEYPRESS_SEQUENCE) {
      setTimeout(() => {
        app.emitEvent('keyDown', key);
        setTimeout(() => app.emitEvent('keyUp', key), KEY_PRESS_DURATION_MS);
      }, delay);
    }
  }

  const initial = SCROLL_KEYFRAMES[0];

  return (
    <div
      ref={containerRef}
      style={{ transform: `translate(${initial.tx}vw, ${initial.ty}vh) scale(${initial.scale})` }}
      className="fixed inset-0 z-10 w-screen h-screen flex items-center justify-center pointer-events-none"
    >
      <div className="w-[150vw] h-[150vh] flex items-center justify-center pointer-events-none">
        <Spline
          scene="/models/keyboard.splinecode"
          onLoad={onSplineLoad}
        />
      </div>
    </div>
  );
}