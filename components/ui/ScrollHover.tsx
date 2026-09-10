"use client";

import type { ReactNode } from "react";
import { useScrollActive } from "@/components/utils/useScrollActive";

/** Permite usar el estado "encendido" por scroll dentro de componentes de servidor (como page.tsx). */
export default function ScrollHover({ className, children }: { className?: string; children: ReactNode }) {
  const [ref, active] = useScrollActive<HTMLDivElement>();
  return (
    <div ref={ref} data-active={active} className={className}>
      {children}
    </div>
  );
}
