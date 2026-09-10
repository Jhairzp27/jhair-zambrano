"use client";

import { useEffect, useRef, useState } from "react";
import { FiGithub, FiExternalLink, FiPlay } from "react-icons/fi";
import { useScrollActive } from "@/components/utils/useScrollActive";

interface ProjectCardProps {
  title: string;
  category: string;
  description: string;
  techStack: string[];
  repoLink?: string;
  demoLink?: string;
  videoSrc?: string;
  imageSrc?: string;
}

const isTouch = () => window.matchMedia("(hover: none)").matches;

export default function ProjectCard({
  title,
  category,
  description,
  techStack,
  repoLink,
  demoLink,
  videoSrc,
  imageSrc,
}: ProjectCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // En desktop se enciende con hover; en móvil, al cruzar la franja activa del scroll.
  const [cardRef, active] = useScrollActive<HTMLDivElement>();
  const [playing, setPlaying] = useState(false);

  const play = () => {
    // El catch atrapa el NotSupportedError y evita que la pantalla se rompa
    videoRef.current?.play().catch((error) => {
      console.warn("Video paused or still loading:", error);
    });
  };

  const pause = () => videoRef.current?.pause();

  // En móvil el video se detiene al salir de la franja activa: no gasta datos ni batería.
  useEffect(() => {
    if (!active) videoRef.current?.pause();
  }, [active]);

  return (
    <div
      ref={cardRef}
      data-active={active}
      data-playing={playing}
      className="group relative flex flex-col h-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden lit-self:border-orange-500/50 transition-all duration-500 lit-self:shadow-[0_0_30px_rgba(0,0,0,0.5)] lit-self:-translate-y-2 backdrop-blur-sm cursor-pointer"
      onMouseEnter={() => !isTouch() && play()}
      onMouseLeave={() => !isTouch() && pause()}
      // En táctil no hay hover: tocar la tarjeta reproduce o pausa el video.
      onClick={() => {
        if (!videoSrc || !isTouch()) return;
        if (playing) pause();
        else play();
      }}
    >
      {/* 1. AREA VISUAL (Video / Imagen) */}
      <div className="relative h-48 w-full overflow-hidden bg-black/50 border-b border-white/5">
        {/* VIDEO PLAYER */}
        {videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            muted
            loop
            playsInline
            preload="none"
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale transition-opacity duration-500 lit:opacity-100 lit:grayscale-0 group-data-[playing=true]:opacity-100 group-data-[playing=true]:grayscale-0"
            poster={imageSrc}
          />
        ) : (
          // Fallback si no hay video (Placeholder)
          <div className="absolute inset-0 flex items-center justify-center bg-white/5">
            <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">
              [ NO_SIGNAL ]
            </span>
          </div>
        )}

        {/* Overlay Icono "Play": se oculta mientras el video corre */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-100 group-data-[playing=true]:opacity-0 transition-opacity duration-300">
            <FiPlay className="text-white/50 ml-1" />
          </div>
        </div>

        {/* Botones de acción (Aparecen abajo a la derecha cuando la tarjeta está encendida) */}
        <div className="absolute bottom-3 right-3 flex gap-2 translate-y-10 lit:translate-y-0 transition-transform duration-300 z-20">
          {repoLink && (
            <a
              href={repoLink}
              target="_blank"
              aria-label={`${title} repository`}
              className="p-2 rounded-full bg-black/80 border border-white/20 hover:bg-white hover:text-black transition-all text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <FiGithub size={16} />
            </a>
          )}
          {demoLink && (
            <a
              href={demoLink}
              target="_blank"
              aria-label={`${title} live demo`}
              className="p-2 rounded-full bg-black/80 border border-white/20 hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <FiExternalLink size={16} />
            </a>
          )}
        </div>
      </div>

      {/* 2. INFO */}
      <div className="flex flex-col grow p-6 gap-4 relative z-10 bg-black/20">
        {/* bg-black/20 para legibilidad sobre el blur */}
        <div>
          <span className="text-orange-500 font-mono text-[9px] tracking-widest uppercase mb-1 block">
            {category}
          </span>
          <h3 className="text-xl font-space-grotesk font-bold text-white lit:text-orange-500 transition-colors">
            {title}
          </h3>
        </div>
        <p className="text-white/50 text-xs leading-relaxed line-clamp-3">
          {description}
        </p>
        <div className="mt-auto pt-4 border-t border-white/5 flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="text-[9px] font-mono text-white/30 bg-white/5 px-2 py-1 rounded border border-transparent lit:border-orange-500/20 lit:text-orange-500/80 transition-all duration-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
