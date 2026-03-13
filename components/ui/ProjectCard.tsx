"use client";

import { useRef } from "react";
import { FiGithub, FiExternalLink, FiPlay } from "react-icons/fi";

interface ProjectCardProps {
  title: string;
  category: string;
  description: string;
  techStack: string[];
  repoLink?: string;
  demoLink?: string;
  videoSrc?: string
  imageSrc?: string
}

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

  // Manejadores para reproducir solo al hacer hover
  const handleMouseEnter = () => {
    if (videoRef.current) {
      // El catch atrapa el NotSupportedError y evita que la pantalla se rompa
      videoRef.current.play().catch((error) => {
        console.warn("Reproducción pausada o cargando:", error);
      });
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      // Opcional: Si reseteas a 0, asegúrate de no romper la carga
      // videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="group relative flex flex-col h-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:-translate-y-2 backdrop-blur-sm cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0"
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

        {/* Overlay Icono "Play" (Sugiere interacción) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-300">
            <FiPlay className="text-white/50 ml-1" />
          </div>
        </div>

        {/* Botones de acción (Aparecen abajo a la derecha en hover) */}
        <div className="absolute bottom-3 right-3 flex gap-2 translate-y-10 group-hover:translate-y-0 transition-transform duration-300 z-20">
          {repoLink && (
            <a
              href={repoLink}
              target="_blank"
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
        {" "}
        {/* bg-black/20 para legibilidad sobre el blur */}
        <div>
          <span className="text-orange-500 font-mono text-[9px] tracking-widest uppercase mb-1 block">
            {category}
          </span>
          <h3 className="text-xl font-space-grotesk font-bold text-white group-hover:text-orange-500 transition-colors">
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
              className="text-[9px] font-mono text-white/30 bg-white/5 px-2 py-1 rounded border border-transparent group-hover:border-orange-500/20 group-hover:text-orange-500/80 transition-all duration-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
