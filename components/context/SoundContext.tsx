'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import audioService from '@/lib/audio-service';

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: ReactNode }) {
  // Iniciamos MUTEADO
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    audioService.setMuted(newState);
  };

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}