'use client';

import { useMotionValueEvent, useScroll } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { FiGithub, FiLinkedin } from 'react-icons/fi';
import { SiFiverr } from 'react-icons/si';

export default function Header() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  const socialIconClass = "text-white/60 hover:text-white hover:scale-110 hover:-translate-y-0.5 transition-all duration-75 ease-out text-lg";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 w-full border-b transition-all duration-300 ease-in-out ${
        isScrolled
          ? "bg-black/50 backdrop-blur-xl border-white/20 py-3 shadow-2xl"
          : "bg-transparent backdrop-blur-none border-white/10 py-5"
      }`}
    >
      
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/">
          <span className="font-space-grotesk font-bold tracking-widest text-xl text-white hover:text-orange-500 transition-colors duration-100 cursor-pointer">
            JZ
          </span>
        </Link>

        {/* NAVEGACIÓN */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12 absolute left-1/2 -translate-x-1/2">
          {['About', 'Stack', 'Works'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[10px] tracking-[0.25em] uppercase font-bold text-white/60 hover:text-white transition-colors duration-200 group flex items-center relative pr-4"
            >
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 text-orange-500 font-black opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-3 transition-all duration-200 ease-out">
                {'>'}
              </span>

              <span className="transition-transform duration-200 ease-out group-hover:translate-x-2">
                {item}
              </span>
            </a>
          ))}
        </nav>

        {/* ZONA DE ACCIÓN */}
        <div className="flex items-center gap-6">
          
          <div className="hidden sm:flex items-center gap-5">
            <a href="https://github.com/tu-usuario" target="_blank" rel="noopener noreferrer" className={socialIconClass} aria-label="GitHub">
              <FiGithub />
            </a>
            <a href="https://linkedin.com/in/tu-usuario" target="_blank" rel="noopener noreferrer" className={socialIconClass} aria-label="LinkedIn">
              <FiLinkedin />
            </a>
            <a href="https://fiverr.com/tu-usuario" target="_blank" rel="noopener noreferrer" className={socialIconClass} aria-label="Fiverr">
              <SiFiverr className="text-[2em] -mt-1" />
            </a>
          </div>

          {/* Separador */}
          <div className={`hidden sm:block h-6 w-[1px] transition-colors duration-300 ${
            isScrolled ? "bg-white/20" : "bg-white/10"
          }`} />

          {/* BOTÓN CTA */}
          <button 
            className={`
              flex items-center justify-center
              text-white border border-white/20 rounded-full 
              text-[10px] md:text-xs tracking-[0.15em] uppercase font-bold 
              hover:bg-white hover:text-black hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]
              active:scale-95
              transition-all duration-100 ease-out
              cursor-pointer
              ${isScrolled ? "px-5 py-1.5" : "px-6 py-2"}
            `}
          >
            {"Let's Talk"}
          </button>
        </div>

      </div>
    </header>
  );
}