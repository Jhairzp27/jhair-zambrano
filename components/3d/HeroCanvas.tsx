'use client';

import Spline from '@splinetool/react-spline';
import type { Application, SPEObject } from '@splinetool/runtime';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function HeroCanvas() {
  const { scrollY } = useScroll();

  // 0: Hero | 120: Inicia la caída | 800: Aterriza en About | 1600: Skills | 2400: Works
  const bp = [0, 120, 800, 1600, 2400];

  // --- 1. CSS TRANSFORMS (Layout) ---
  const translateX = useTransform(scrollY, bp, ['10vw', '10vw', '0vw', '0vw', '0vw']);
  const translateY = useTransform(scrollY, bp, ['7vh', '2vh', '10vh', '40vh', '15vh']);
  const scale = useTransform(scrollY, bp, [1, 0.9, 0.75, 0.5, 0.85]);

  // --- 2. 3D ROTATIONS (La Caída Fluida) ---
  
  // EJE X (Cabeceo): 
  // Lo mantenemos simple. Solo se inclina un poco hacia adelante/atrás para dar sensación de peso.
  const rotX = useTransform(scrollY, bp, [
    0, 
    0.1, 
    0, 
    -0.3, 
    0.35
  ]);

  // EJE Y (El giro de "Llave"): 
  // AHORA ES SUAVE. Pasa de 0 a 90º (Math.PI / 2) a lo largo de 400 píxeles de scroll.
  const rotY = useTransform(scrollY, bp, [
    0, 
    0.1, 
    Math.PI / 2, 
    Math.PI, 
    Math.PI * 2
  ]);

  // EJE Z (El nuevo "Flip" tipo Barrel Roll): 
  // Da un giro lateral completo (360º = -Math.PI * 2) mientras cae, aterrizando perfectamente recto.
  const rotZ = useTransform(scrollY, bp, [
    0, 
    -0.1, 
    -Math.PI * 2, 
    -Math.PI * 2 - Math.PI / 4, 
    -Math.PI * 2
  ]);

  const splineRef = useRef<Application | null>(null);
  const tecladoObjRef = useRef<SPEObject | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const update3DObject = () => {
      if (!tecladoObjRef.current) return;

      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      tecladoObjRef.current.rotation.x = rotX.get() + my * 0.15;
      tecladoObjRef.current.rotation.y = rotY.get() + mx * 0.15;
      tecladoObjRef.current.rotation.z = rotZ.get();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const maxRadius = 600;
      let intensity = 1 - (distance / maxRadius);
      if (intensity < 0) intensity = 0; 

      mousePos.current.x = ((e.clientX / window.innerWidth) * 2 - 1) * intensity;
      mousePos.current.y = (-(e.clientY / window.innerHeight) * 2 + 1) * intensity;

      update3DObject();
    };

    const unsubscribeScroll = scrollY.on('change', update3DObject);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      unsubscribeScroll();
    };
  }, [scrollY, rotX, rotY, rotZ]);

  function onLoad(splineApp: Application) {
    splineRef.current = splineApp;
    const keyboard = splineApp.findObjectByName('Keyboard');
    tecladoObjRef.current = keyboard || null;

    if (tecladoObjRef.current) {
      tecladoObjRef.current.scale.set(0.5, 0.5, 0.5);
      tecladoObjRef.current.position.x = 0;
      tecladoObjRef.current.position.y = 0;
    }

    const pressKey = (keyName: string, delay: number) => {
      setTimeout(() => {
        splineApp.emitEvent('keyDown', keyName);
        setTimeout(() => { splineApp.emitEvent('keyUp', keyName); }, 200);
      }, delay);
    };
    pressKey('Key j', 1000); pressKey('Key h', 1300); pressKey('Key a', 1600); pressKey('Key i', 1900); pressKey('Key r', 2200);
  }

  return (
    <motion.div
      style={{ x: translateX, y: translateY, scale }}
      className="fixed inset-0 z-10 w-screen h-screen flex items-center justify-center pointer-events-none"
    >
      <div className="w-[150vw] h-[150vh] flex items-center justify-center pointer-events-none">
        <Spline
          scene="/models/keyboard.splinecode"
          onLoad={onLoad}
        />
      </div>
    </motion.div>
  );
}