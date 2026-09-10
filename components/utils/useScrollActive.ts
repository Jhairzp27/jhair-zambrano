"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Solo celulares y tablets: pantalla táctil (sin hover) y angosta. En desktop nunca aplica,
 * aunque la laptop tenga pantalla táctil: ahí el estado "encendido" lo da el hover del mouse.
 */
const SCROLL_LIT_QUERY = "(hover: none) and (pointer: coarse) and (max-width: 1023px)";

export const isScrollLitDevice = () => window.matchMedia(SCROLL_LIT_QUERY).matches;

/**
 * En móvil no existe hover. Este hook "enciende" un elemento mientras cruza una franja un poco
 * por debajo del centro de la pantalla: al hacer scroll, los elementos se van activando uno tras
 * otro con los mismos estilos que el hover de desktop (variantes `lit` en globals.css).
 */
export function useScrollActive<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const media = window.matchMedia(SCROLL_LIT_QUERY);
    let observer: IntersectionObserver | null = null;

    const start = () => {
      observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
        rootMargin: "-40% 0px -45% 0px", // franja entre el 40% y el 55% del alto de la pantalla
      });
      observer.observe(element);
    };
    const stop = () => {
      observer?.disconnect();
      observer = null;
    };

    if (media.matches) start();

    // Si cambia el tipo de pantalla (rotar, redimensionar, DevTools) se enciende o se apaga.
    const onChange = () => {
      stop();
      if (media.matches) start();
      else setActive(false);
    };
    media.addEventListener("change", onChange);

    return () => {
      media.removeEventListener("change", onChange);
      stop();
    };
  }, []);

  return [ref, active] as const;
}
