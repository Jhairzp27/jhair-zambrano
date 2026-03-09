"use client";

import { useMotionValueEvent, useScroll, AnimatePresence, motion, Variants,} from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { SiFiverr } from "react-icons/si";

const HamburgerButton = ({
  isOpen,
  toggle,
}: {
  isOpen: boolean;
  toggle: () => void;
}) => {
  return (
    <button
      onClick={toggle}
      className="md:hidden z-70 p-2 -mr-2 text-white focus:outline-none group"
      aria-label="Toggle menu"
    >
      <div className="flex flex-col justify-center items-center gap-1.25 w-6 h-6">
        <motion.span
          animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
          className="w-6 h-0.5 bg-white block rounded-full origin-center shadow-[0_0_8px_rgba(255,255,255,0.5)]"
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        <motion.span
          animate={isOpen ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
          className="w-4 h-0.5 bg-white/80 block rounded-full group-hover:w-6 transition-all duration-300"
          transition={{ duration: 0.2 }}
        />
        <motion.span
          animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
          className="w-6 h-0.5 bg-white block rounded-full origin-center shadow-[0_0_8px_rgba(255,255,255,0.5)]"
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </div>
    </button>
  );
};

export default function Header() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const socialIconClass =
    "text-white/60 hover:text-white hover:scale-110 hover:-translate-y-0.5 transition-all duration-75 ease-out text-lg";

  const handleMobileLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }, 300);
  };

  // --- ANIMACIONES ---
  const overlayVariants: Variants = {
    closed: {
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut", delay: 0.1 },
    },
    open: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
  };

  const navListVariants: Variants = {
    closed: {},
    open: { transition: { delayChildren: 0.2, staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    closed: {
      opacity: 0,
      y: 20,
      filter: "blur(10px)",
      transition: { duration: 0.2, ease: "easeIn" },
    },
    open: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const paddingClass = isScrolled ? "py-2" : "py-3";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 w-full transition-all duration-300 ease-in-out ${paddingClass}`}
    >
      {/* CAPA DE FONDO*/}
      <div
        className={`absolute inset-0 -z-10 border-b transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "opacity-0 border-transparent bg-transparent"
            : isScrolled
              ? "opacity-100 bg-black/50 backdrop-blur-xl border-white/20 shadow-2xl"
              : "opacity-0 border-white/10 bg-transparent"
        }`}
      />

      {/* Borde sutil en Hero */}
      <div
        className={`absolute inset-0 -z-20 border-b border-white/10 transition-opacity duration-300 ${
          !isScrolled && !isMobileMenuOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="w-full max-w-350 mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* LOGO */}
        <Link
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            setIsMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="group relative z-70"
        >
          <span className="font-space-grotesk font-bold tracking-widest text-xl text-white group-hover:text-orange-500 transition-colors duration-200 cursor-pointer">
            JZ.
          </span>
        </Link>

        {/* NAVEGACIÓN DESKTOP */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12 absolute left-1/2 -translate-x-1/2">
          {["About", "Stack", "Works"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[10px] tracking-[0.25em] uppercase font-bold text-white/60 hover:text-white transition-colors duration-200 group flex items-center relative pr-4"
            >
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 text-orange-500 font-black opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-3 transition-all duration-200 ease-out">
                {">"}
              </span>
              <span className="transition-transform duration-200 ease-out group-hover:translate-x-2">
                {item}
              </span>
            </a>
          ))}
        </nav>

        {/* ZONA DE ACCIÓN */}
        <div className="flex items-center gap-4 sm:gap-6 z-70">
          <div className="hidden sm:flex items-center gap-5">
            <a
              href="https://github.com/Jhairzp27"
              target="_blank"
              rel="noopener noreferrer"
              className={socialIconClass}
              aria-label="GitHub"
            >
              <FiGithub />
            </a>
            <a
              href="https://linkedin.com/in/gregoy-jhair-zambrano"
              target="_blank"
              rel="noopener noreferrer"
              className={socialIconClass}
              aria-label="LinkedIn"
            >
              <FiLinkedin />
            </a>
            <a
              href="https://fiverr.com/gregoliana"
              target="_blank"
              rel="noopener noreferrer"
              className={socialIconClass}
              aria-label="Fiverr"
            >
              <SiFiverr className="text-[2em] -mt-1" />
            </a>
          </div>

          <div
            className={`hidden sm:block h-6 w-px transition-colors duration-300 ${
              isScrolled && !isMobileMenuOpen ? "bg-white/20" : "bg-white/10"
            }`}
          />

          <button
            className={`
              flex items-center justify-center
              text-white border border-white/20 rounded-full 
              text-[10px] md:text-xs tracking-[0.15em] uppercase font-bold 
              hover:bg-white hover:text-black hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]
              active:scale-95
              transition-all duration-100 ease-out
              cursor-pointer
              ${isScrolled ? "px-4 py-1.5 md:px-5" : "px-5 py-2 md:px-6"}
            `}
          >
            {"Let's Talk"}
          </button>

          {/* BOTÓN HAMBURGUESA */}
          <HamburgerButton
            isOpen={isMobileMenuOpen}
            toggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 z-50 bg-[#050505]/98 backdrop-blur-3xl md:hidden flex flex-col items-center justify-center"
          >
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <motion.nav
              variants={navListVariants}
              className="flex flex-col items-start gap-8 relative z-10"
            >
              {["About", "Stack", "Works"].map((item) => (
                <motion.div variants={itemVariants} key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    onClick={(e) =>
                      handleMobileLinkClick(e, item.toLowerCase())
                    }
                    className="group relative flex items-center text-3xl md:text-4xl tracking-[0.15em] uppercase font-bold text-white/60 hover:text-white active:text-orange-500 active:scale-95 transition-all duration-200 font-space-grotesk pl-6"
                  >
                    <span className="absolute left-0 text-orange-500 font-black opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 group-active:opacity-100 group-active:translate-x-0 transition-all duration-300 ease-out">
                      {">"}
                    </span>
                    <span className="transition-transform duration-300 ease-out group-hover:translate-x-4 group-active:translate-x-4">
                      {item}
                    </span>
                  </a>
                </motion.div>
              ))}
            </motion.nav>

            <motion.div
              variants={navListVariants}
              className="flex items-center gap-10 mt-16 border-t border-white/10 pt-10 relative z-10"
            >
              <a
                href="https://github.com/Jhairzp27"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white active:text-orange-500 active:scale-90 transition-all text-2xl"
              >
                <FiGithub />
              </a>
              <a
                href="https://linkedin.com/in/gregoy-jhair-zambrano"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white active:text-orange-500 active:scale-90 transition-all text-2xl"
              >
                <FiLinkedin />
              </a>
              <a
                href="https://fiverr.com/gregoliana"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white active:text-orange-500 active:scale-90 transition-all text-3xl"
              >
                <SiFiverr />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
