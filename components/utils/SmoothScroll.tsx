'use client';

import { ReactLenis } from '@studio-freight/react-lenis';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function SmoothScroll({ children }: Props) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 0.8, smoothWheel: true }}>
      {/* @ts-expect-error: Lenis utiliza tipos de React 18 que entran en conflicto con React 19 */}
      {children}
    </ReactLenis>
  );
}