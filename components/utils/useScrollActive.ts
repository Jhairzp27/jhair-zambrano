"use client";

import { useEffect, useRef, useState } from "react";

/**
 * En pantallas táctiles no existe hover. Este hook "enciende" un elemento mientras cruza una
 * franja un poco por debajo del centro de la pantalla: al hacer scroll, los elementos se van
 * activando uno tras otro con los mismos estilos que el hover de desktop (variantes `lit` en globals.css).
 * En dispositivos con mouse no hace nada: ahí manda el hover real.
 */
export function useScrollActive<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(hover: hover)").matches) return;

    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      rootMargin: "-40% 0px -45% 0px", // franja entre el 40% y el 55% del alto de la pantalla
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, active] as const;
}
