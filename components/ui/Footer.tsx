"use client";

import { useState, useRef, useEffect } from "react";
import {
  FiGithub,
  FiLinkedin,
  FiTerminal,
  FiCpu,
  FiFolder,
  FiGitBranch,
  FiCalendar,
  FiBatteryCharging,
  FiBattery,
  FiCheck,
  FiUser,
  FiMail,
  FiMessageSquare,
  FiCornerDownLeft,
} from "react-icons/fi";
import { IconType } from "react-icons";
import { SiFiverr } from "react-icons/si";

interface BatteryManager extends EventTarget {
  level: number;
  charging: boolean;
  addEventListener(
    type: string,
    listener: (this: BatteryManager, ev: Event) => void,
  ): void;
  removeEventListener(
    type: string,
    listener: (this: BatteryManager, ev: Event) => void,
  ): void;
}

interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

// --- TIPOS PARA PROPS ---
interface AtomicSegmentProps {
  bg: string;
  textColor: string;
  icon?: IconType;
  text: string;
  isFirst?: boolean;
  isLast?: boolean;
  zIndex?: number;
}

// --- COLORES ---
const C = {
  blue: "#0077c2",
  orange: "#FF9248",
  yellow: "#FFFB38",
  purple: "#83769c",
  green: "#27c93f",
  cyan: "#21c7c7",
  textDark: "#2d3436",
  textLight: "#ffffff",
};

const AtomicSegment = ({
  bg,
  textColor,
  icon: Icon,
  text,
  isFirst = false,
  isLast = false,
  zIndex = 0,
}: AtomicSegmentProps) => {
  return (
    <div
      className={`flex items-center h-6 relative font-mono text-[10px] md:text-xs font-bold leading-none select-none ${!isLast ? "-mr-3.5" : ""}`}
      style={{ zIndex: zIndex }}
    >
      <div
        className={`flex items-center gap-2 px-3 pl-4 h-full whitespace-nowrap ${isFirst ? "rounded-l-sm pl-3" : ""}`}
        style={{ backgroundColor: bg, color: textColor }}
      >
        {Icon && <Icon size={11} />}
        <span className="mt-px">{text}</span>
      </div>

      {!isLast && (
        <div
          className="w-0 h-0 border-t-12 border-t-transparent border-l-14 border-b-12 border-b-transparent relative"
          style={{ borderLeftColor: bg }}
        ></div>
      )}

      {isLast && (
        <div
          className="h-full pr-2 rounded-r-sm"
          style={{ backgroundColor: bg }}
        ></div>
      )}
    </div>
  );
};

export default function Footer() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [step, setStep] = useState<"name" | "email" | "message">("name");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [inputError, setInputError] = useState<string>("");

  // ESTADO BATERÍA REAL
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isCharging, setIsCharging] = useState(true);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const msgInputRef = useRef<HTMLInputElement>(null);

  // --- HOOK: DETECTAR BATERÍA REAL ---
  useEffect(() => {
    const nav = navigator as NavigatorWithBattery;
    if (typeof nav.getBattery === "function") {
      nav.getBattery().then((battery) => {
        const updateBattery = () => {
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);
        };
        updateBattery();
        battery.addEventListener("levelchange", updateBattery as EventListener);
        battery.addEventListener(
          "chargingchange",
          updateBattery as EventListener,
        );
      });
    }
  }, []);

  useEffect(() => {
    if (status === "idle") {
      if (step === "email") emailInputRef.current?.focus();
      if (step === "message") msgInputRef.current?.focus();
    }
  }, [status, step]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (inputError) setInputError("");
  };

  const handleNextStep = () => {
    setInputError(""); // Limpiamos errores previos

    if (step === "name") {
      if (!formData.name.trim()) {
        setInputError("ERR: NAME_REQUIRED - Identity cannot be empty.");
        return;
      }
      setStep("email");
    }
    else if (step === "email") {
      if (!formData.email.trim()) {
        setInputError("ERR: EMAIL_REQUIRED - Cannot reach you without an address.");
        return;
      }
      // Regex para validar formato de email (ejemplo@dominio.com)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        setInputError("ERR: INVALID_EMAIL_FORMAT - Check syntax.");
        return;
      }
      setStep("message");
    }
    else if (step === "message") {
      if (!formData.message.trim()) {
        setInputError("ERR: MESSAGE_EMPTY - Payload missing.");
        return;
      }
      handleSubmit();
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNextStep();
    }
  };

  const handleSubmit = async () => {
    setStatus("sending");

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        
        setTimeout(() => {
          setFormData({ name: "", email: "", message: "" });
          setStatus("idle");
          setStep("name");
        }, 5000);
      } else {
        console.error("Error del servidor al enviar correo");
        setStatus("error");
      }
    } catch (error) {
      console.error("Error de red al enviar correo:", error);
      setStatus("error");
    }
  };

  const dateString = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <footer className="relative w-full bg-black border-t border-white/10 overflow-hidden flex flex-col">
      {/* LUCES DE FONDO */}
      <div className="absolute bottom-[-20%] left-[-10%] w-150 h-150 bg-[#0077c2]/10 blur-[150px] pointer-events-none rounded-full"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-150 h-150 bg-[#FF9248]/10 blur-[150px] pointer-events-none rounded-full"></div>

      {/* Se le quita el z-10 a este wrapper principal para que NO atrape a los hijos */}
      <div className="max-w-350 w-full mx-auto px-6 lg:px-12 py-16 lg:py-24 relative grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-end">
          
          {/* COLUMNA 1: TEXTO (Arriba en móvil, Derecha en Desktop) */}
          <div className="flex flex-col justify-end h-full order-1 lg:order-2 relative z-30">
            <h2 className="text-5xl md:text-7xl font-space-grotesk font-bold text-white leading-[0.85] tracking-tighter mb-6">
              LET&apos;S <br />
              <span className="text-white/20">WORK</span> <br />
              <span style={{ color: C.orange }}>TOGETHER.</span>
            </h2>
            <div className="border-l-2 pl-6 mb-8 lg:mb-4" style={{ borderColor: C.blue }}>
              <p className="text-white/60 text-sm max-w-md leading-relaxed font-mono">
                Initialize connection protocol via the terminal.
              </p>
            </div>
          </div>

          {/* COLUMNA 2: TERMINAL Y DECK (Abajo en móvil, Izquierda en Desktop) */}
          <div className="flex flex-col gap-6 order-2 lg:order-1 mt-8 lg:mt-0 relative">
            
            {/* TERMINAL */}
            {/* 🔥 AGREGADO: relative z-30 para quedar SOBRE el teclado */}
            <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-md overflow-hidden shadow-2xl font-mono text-xs md:text-sm relative z-30 group hover:border-[#21c7c7]/30 transition-colors duration-500">
              {/* Barra de Título */}
              <div className="bg-[#1a1a1a] px-3 py-2 flex items-center justify-between border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                </div>
                <div className="flex items-center gap-2 text-white/30 text-[10px]">
                  <FiTerminal size={10} />
                  <span>Interactive-session</span>
                </div>
                <div className="w-8"></div>
              </div>

              {/* CUERPO TERMINAL */}
              <div className="p-4 min-h-55 flex flex-col relative">
                {/* BARRA ATOMIC */}
                <div className="flex flex-wrap items-center justify-between mb-4 gap-y-2">
                  <div className="flex items-center">
                    <AtomicSegment bg={C.blue} textColor={C.textLight} icon={FiCpu} text="guest" isFirst={true} zIndex={30} />
                    <AtomicSegment bg={C.orange} textColor={C.textDark} icon={FiFolder} text="contact" zIndex={20} />
                    <AtomicSegment bg={C.yellow} textColor="#011627" icon={FiGitBranch} text="init" isLast={true} zIndex={10} />
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <div className={`flex items-center h-6 px-3 gap-2 rounded-full border border-white/5 text-[10px] font-bold transition-colors ${batteryLevel < 20 ? "bg-red-500/20 text-red-400" : "bg-[#27c93f] text-[#0a0a0a]"}`}>
                      {isCharging ? <FiBatteryCharging size={12} /> : <FiBattery size={12} />}
                      <span>{batteryLevel}%</span>
                    </div>
                    <div className="hidden sm:flex items-center h-6 bg-[#303030] text-white px-3 gap-2 rounded-full border border-white/5 text-[10px] font-bold">
                      <FiCalendar size={11} />
                      <span>{dateString}</span>
                    </div>
                  </div>
                </div>

                {/* INPUTS WIZARD */}
                <div className="grow pl-1 mt-2">
                  {status === "success" ? (
                    <div className="h-full flex flex-col items-center justify-center text-[#27c93f] gap-3 animate-in fade-in zoom-in py-2">
                      <FiCheck size={32} />
                      <p className="text-lg tracking-widest font-bold">TRANSMISSION SENT</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {step !== "name" && (
                        <div className="mb-1 opacity-50 flex items-center gap-2 text-[#21c7c7] text-xs">
                          <span>✔</span> <span className="text-white/50">User:</span>
                          <span className="text-white">{formData.name}</span>
                        </div>
                      )}
                      {step === "message" && (
                        <div className="mb-2 opacity-50 flex items-center gap-2 text-[#21c7c7] text-xs">
                          <span>✔</span> <span className="text-white/50">Email:</span>
                          <span className="text-white">{formData.email}</span>
                        </div>
                      )}

                      <div className="text-xs text-orange-400 mb-1 font-bold flex items-center gap-2">
                        {step === "name" && <><FiUser /> IDENTIFY YOURSELF:</>}
                        {step === "email" && <><FiMail /> RETURN ADDRESS (EMAIL):</>}
                        {step === "message" && <><FiMessageSquare /> TRANSMISSION CONTENT:</>}
                      </div>

                      {/* Input + Botón de Enviar */}
                      <div className="flex items-center gap-2 text-base md:text-lg mt-1 w-full md:w-[90%]">
                        <span style={{ color: C.cyan }}>╰─</span>
                        <span className="text-[#e0f8ff]">🚀</span>
                        
                        <div className="grow ml-2 relative group/input flex items-center bg-white/5 rounded pl-3 pr-1.5 h-10 border border-white/10 focus-within:border-[#21c7c7]/50 transition-colors">
                          <input
                            ref={step === "name" ? nameInputRef : step === "email" ? emailInputRef : msgInputRef}
                            type={step === "email" ? "email" : "text"}
                            name={step}
                            value={step === "name" ? formData.name : step === "email" ? formData.email : formData.message}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            placeholder={step === "name" ? "e.g. Satoshi Nakamoto" : step === "email" ? "e.g. satoshi@bitcoin.org" : "Type your request here..."}
                            className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/20 caret-[#21c7c7] h-full text-sm font-mono"
                            autoComplete="off"
                            disabled={status === "sending"}
                          />
                          
                          {/* EL BOTÓN DE ENVIAR (UX Mobile Friendly) */}
                          <button
                            onClick={handleNextStep}
                            disabled={status === "sending"}
                            className="h-7 px-3 bg-[#21c7c7]/20 hover:bg-[#21c7c7]/40 text-[#21c7c7] rounded flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer"
                            aria-label="Next step"
                          >
                            <FiCornerDownLeft size={16} />
                          </button>
                        </div>
                      </div>
                      
                      {inputError && (
                        <div className="mt-2 ml-8 text-[10px] md:text-xs text-[#ff5f56] font-mono animate-pulse flex items-center gap-2">
                          <span>[!]</span>
                          <span>{inputError}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ZONA DE TECLADO 3D (Decorativo) */}
            <div className="h-48 sm:h-64 lg:h-40 w-full border border-dashed border-white/20 rounded-md flex items-center justify-center relative z-10 bg-transparent">
              <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest absolute top-2 left-3">
                {"// Hardware_Input_Deck"}
              </span>
            </div>
          </div>
          
        </div>
      </div>

      {/* FOOTER INFERIOR ABSOLUTO (Redes Móvil + Copyright) */}
      <div className="w-full pb-8 pt-6 relative z-30 flex flex-col items-center gap-6">
        
        {/* REDES SOCIALES SOLO MÓVIL */}
        <div className="flex sm:hidden items-center gap-8 text-white/50">
          <a href="https://github.com/Jhairzp27" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
            <FiGithub size={22} />
          </a>
          <a href="https://linkedin.com/in/gregoy-jhair-zambrano" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
            <FiLinkedin size={22} />
          </a>
          <a href="https://fiverr.com/gregoliana" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
            <SiFiverr size={24} className="-mt-1" />
          </a>
        </div>

        {/* COPYRIGHT */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-[9px] font-mono text-white/30 uppercase tracking-widest">
          <span>© 2026 Jhair Zambrano. All Rights Reserved.</span>
          <span className="hidden sm:inline">|</span>
          <span>Quito, Ecuador.</span>
        </div>
      </div>
    </footer>
  );
}