"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

/**
 * Las luces RGB ya están resueltas DENTRO de la escena de Spline: Backspace las enciende y
 * Enter las apaga, cada una con sus propias transiciones. Aquí no se tocan luces: solo se
 * reproducen esas pulsaciones (clave en móvil, donde no hay teclado físico).
 *
 * Dos detalles comprobados en el runtime de Spline:
 *   1. Escucha el teclado en `document`; un evento lanzado en `window` no le llega.
 *   2. Marca la tecla como "mantenida" hasta recibir el keyup; sin él ignora las
 *      siguientes pulsaciones de esa tecla. Por eso se envían keydown y keyup.
 */
const KEY_ON = "Backspace";
const KEY_OFF = "Enter";

function pressKey(key: string) {
  for (const type of ["keydown", "keyup"] as const) {
    document.body.dispatchEvent(new KeyboardEvent(type, { key, code: key, bubbles: true, cancelable: true }));
  }
}

interface KeyboardContextType {
  lightsOn: boolean;
  toggleLights: () => void;
  /** Cambia el estado y reproduce la tecla para que Spline aplique el efecto. */
  setLightsOn: (on: boolean) => void;
  /** Solo actualiza el estado (cuando el usuario pulsó la tecla de verdad). */
  syncFromRealKey: (on: boolean) => void;
  /** La escena terminó de cargar y ya puede recibir teclas. */
  markSceneReady: () => void;
}

const KeyboardContext = createContext<KeyboardContextType | undefined>(undefined);

export function KeyboardProvider({ children }: { children: ReactNode }) {
  const [lightsOn, setLightsOnState] = useState(false);
  const lightsOnRef = useRef(false);
  const readyRef = useRef(false);
  /** Tecla pedida antes de que la escena cargara; se envía al quedar lista. */
  const pendingRef = useRef<string | null>(null);

  const send = useCallback((key: string) => {
    if (readyRef.current) pressKey(key);
    else pendingRef.current = key;
  }, []);

  const setLightsOn = useCallback(
    (on: boolean) => {
      if (lightsOnRef.current === on) return; // idempotente: evita bucles con el listener de teclado
      lightsOnRef.current = on;
      setLightsOnState(on);
      send(on ? KEY_ON : KEY_OFF);
    },
    [send],
  );

  const toggleLights = useCallback(() => {
    setLightsOn(!lightsOnRef.current);
  }, [setLightsOn]);

  const syncFromRealKey = useCallback((on: boolean) => {
    if (lightsOnRef.current === on) return;
    lightsOnRef.current = on;
    setLightsOnState(on);
  }, []);

  const markSceneReady = useCallback(() => {
    readyRef.current = true;
    if (pendingRef.current) {
      pressKey(pendingRef.current);
      pendingRef.current = null;
    }
  }, []);

  return (
    <KeyboardContext.Provider value={{ lightsOn, toggleLights, setLightsOn, syncFromRealKey, markSceneReady }}>
      {children}
    </KeyboardContext.Provider>
  );
}

export function useKeyboard() {
  const ctx = useContext(KeyboardContext);
  if (!ctx) throw new Error("useKeyboard debe usarse dentro de KeyboardProvider");
  return ctx;
}
