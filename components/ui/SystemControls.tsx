'use client';

import { FiVolume2, FiVolumeX } from 'react-icons/fi'; // O tus iconos preferidos
import { useSound } from '../context/SoundContext';

export default function SystemControls() {
  const { isMuted, toggleMute } = useSound();

  return (
    <div className="flex flex-col gap-4">

      <button
        onClick={toggleMute}
        className={`
          flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300
          ${isMuted 
            ? 'bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500 hover:text-white' 
            : 'bg-white/5 border-white/10 text-white hover:bg-white hover:text-black'}
        `}
        aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
      >
        {isMuted ? <FiVolumeX size={18} /> : <FiVolume2 size={18} />}
      </button>

      {/* Etiqueta opcional */}
      <span className="text-[10px] uppercase tracking-widest text-white/40 text-center font-mono mt-1">
        {isMuted ? 'Muted' : 'Sound On'}
      </span>
    </div>
  );
}