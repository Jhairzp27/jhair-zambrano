"use client";

import { FiAward, FiLoader, FiCheckCircle } from "react-icons/fi";

interface CredentialItemProps {
    title: string;
    issuer: string;
    date: string;
    status: "completed" | "in-progress";
    progress?: number;
    logoText?: string;
}

export default function CredentialItem({
    title,
    issuer,
    date,
    status,
    progress = 0,
    logoText,
}: CredentialItemProps) {
    return (
    <div className="group relative flex items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-orange-500/30 hover:bg-white/[0.07] transition-all duration-300">
      {/* 1. ICONO / LOGO (Minimalista) */}
        <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-black/50 border border-white/10 text-white/50 font-space-grotesk font-bold text-lg group-hover:text-orange-500 group-hover:border-orange-500/50 transition-colors">
            {logoText || <FiAward />}
        </div>

      {/* 2. INFO PRINCIPAL */}
    <div className="grow flex flex-col gap-1">
        <div className="flex items-center gap-3">
            <h4 className="text-white font-medium text-base group-hover:text-orange-500 transition-colors">
                {title}
            </h4>
          {/* Badge de Estado */}
            {status === "in-progress" && (
                <span className="text-[9px] px-2 py-0.5 rounded border border-orange-500/30 bg-orange-500/10 text-orange-400 uppercase tracking-wide animate-pulse">
                    In Progress
                </span>
            )}
        </div>
        <p className="text-white/40 text-sm font-light">
            {issuer} <span className="mx-2 opacity-30">|</span>{" "}
            <span className="font-mono text-xs opacity-60">{date}</span>
        </p>

        {/* 3. BARRA DE PROGRESO (Solo si está en curso) */}
        {status === "in-progress" && (
            <div className="mt-2 w-full max-w-[200px] h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                    className="h-full bg-orange-500 transition-all duration-1000 ease-out relative"
                    style={{ width: `${progress}%` }}
                >
                    {/* Efecto de brillo corriendo */}
                    <div className="absolute inset-0 bg-white/30 animate-[shimmer_1s_infinite]"></div>
                </div>
            </div>
        )}
    </div>

    {/* 4. ICONO DE ESTADO FINAL */}
    <div className="text-white/20 group-hover:text-white transition-colors">
        {status === "completed" ? (
            <FiCheckCircle
            size={22}
            className="group-hover:text-green-400 transition-colors"/>
        ) : (
        <FiLoader size={22} className="animate-spin text-orange-500" />
        )}
    </div>
    </div>
);
}
