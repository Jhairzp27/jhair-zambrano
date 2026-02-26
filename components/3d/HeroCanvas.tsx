'use client';

import Spline from '@splinetool/react-spline';
import type { Application } from '@splinetool/runtime';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function HeroCanvas() {
  const { scrollY } = useScroll();

  const translateX = useTransform(scrollY, [0, 1000], ['0%', '45%']);
  const translateY = useTransform(scrollY, [0, 1000], ['0%', '20%']);
  const scale = useTransform(scrollY, [0, 1000], [1, 0.7]);

  const splineRef = useRef<Application | null>(null);
  const tecladoObjRef = useRef<any>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const update3DObject = () => {
      if (tecladoObjRef.current) {
        const currentScroll = scrollY.get();
        const mouseRotX = mousePos.current.y * 0.5;
        const mouseRotY = mousePos.current.x * 0.5;
        const gravityRotX = currentScroll * 0.005;
        const gravityRotY = currentScroll * 0.003;
        const gravityRotZ = currentScroll * 0.002;

        tecladoObjRef.current.rotation.x = mouseRotX + gravityRotX;
        tecladoObjRef.current.rotation.y = mouseRotY + gravityRotY;
        tecladoObjRef.current.rotation.z = gravityRotZ;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      update3DObject();
    };

    const unsubscribeScroll = scrollY.on("change", update3DObject);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      unsubscribeScroll();
    };
  }, [scrollY]);

  function onLoad(splineApp: Application) {
    splineRef.current = splineApp;
    tecladoObjRef.current = splineApp.findObjectByName('Keyboard');

    if (tecladoObjRef.current) {
      tecladoObjRef.current.scale.set(0.49, 0.49, 0.49);

      tecladoObjRef.current.position.y = 0;
      tecladoObjRef.current.position.x = 200;
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
      className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none"
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