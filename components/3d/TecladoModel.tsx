'use client';

import { Float, useGLTF } from '@react-three/drei';
import { ThreeElements } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';

export default function TecladoModel(props: ThreeElements['group']) {
  const { scene } = useGLTF('/models/keyboard.splinecode');

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#1a1a1a'),
          roughness: 0.2,
          metalness: 0.8,
        });
      }
    });
  }, [scene]);

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <primitive object={scene} {...props} />
    </Float>
  );
}

useGLTF.preload('/models/keyboard.splinecode');