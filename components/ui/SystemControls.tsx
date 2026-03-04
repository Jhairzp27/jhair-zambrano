'use client';

import { useState, useEffect } from 'react';
import { FiSun, FiVolume2, FiVolumeX } from 'react-icons/fi';



export default function SystemControls() {
  // TODO: Implementar control de volumen real conectado a Spline.
  // Actualmente solo es visual. Necesitamos exponer una variable en Spline ('isMuted')
  // y modificarla aquí usando spline.setVariable().
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [rgbEnabled, setRgbEnabled] = useState(true);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Backspace') setRgbEnabled(true);
      if (event.key === 'Enter') setRgbEnabled(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 select-none animate-in fade-in zoom-in duration-700">
      
      <div className="flex flex-col items-center gap-6 py-6 px-4 rounded-full border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl w-17.5">
        
        {/* Header del panel*/}
        <div className="border-b border-white/10 pb-4 mb-2 w-full flex justify-center">
          <span className="text-[9px] font-mono text-white/30 tracking-widest block [writing-mode:vertical-rl] rotate-180 uppercase opacity-70">
            SYS
          </span>
        </div>

        {/* Audio Icon */}
        <div className={`transition-all duration-300 ${audioEnabled ? "text-orange-500 scale-110" : "text-white/20"}`}>
          <div className="text-xl">
            {audioEnabled ? <FiVolume2 /> : <FiVolumeX />}
          </div>
        </div>

        {/* Sun Icon (Estado actual) */}
        <div className={`transition-all duration-500 ${
          rgbEnabled 
            ? "text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.6)] scale-110" 
            : "text-white/20"
        }`}>
          <div className="text-xl">
            <FiSun />
          </div>
        </div>

      </div>

      {/* 2. LA TECLA GIGANTE*/}
      <div className="flex flex-col items-center gap-2">
        
        <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">
          {rgbEnabled ? "TO TURN OFF" : "TO TURN ON"}
        </span>

        <div className="group relative">
          <div className={`absolute inset-0 bg-white/5 rounded-lg transform translate-y-1 ${
            rgbEnabled ? "border border-orange-500/30" : "border border-white/10"
          }`}></div>
          
          <div className={`relative flex items-center justify-center w-16 h-14 bg-linear-to-b from-white/10 to-white/5 border border-white/20 rounded-lg shadow-inner backdrop-blur-sm transition-transform active:translate-y-1 duration-100 ${
            "animate-pulse hover:animate-none cursor-pointer" 
          }`}>
            
            <div className="flex flex-col items-center justify-center">
              {/* Símbolo Gigante */}
              <span className={`text-2xl font-bold mb-1 ${rgbEnabled ? "text-white" : "text-orange-500"}`}>
                {rgbEnabled ? "↵" : "⌫"}
              </span>
              
              {/* Nombre de la tecla pequeño */}
              <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider">
                {rgbEnabled ? "ENTER" : "BACK"}
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}