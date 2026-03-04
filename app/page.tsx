import HeroCanvas from "@/components/3d/HeroCanvas";
import SystemControls from '@/components/ui/SystemControls';

export default function Home() {
  return (
    <main className="w-full bg-black text-white relative overflow-x-hidden selection:bg-white selection:text-black">

      <div
        className="fixed inset-0 z-[-5] opacity-[0.04] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />

      <div className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none">
        <div className="w-auto h-[100vw] md:w-[60vw] md:h-[60vw] bg-white/3 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      {/* Premium Minimalist Grid */}
      <div className="fixed inset-0 z-[-30] bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <HeroCanvas />

      <section id="hero" className="relative min-h-screen w-full flex flex-col justify-between pt-12 pb-24 px-8 md:px-16 pointer-events-none z-20">

        {/* Top Header Area */}
        <div className="flex justify-between items-start w-full mt-20">
          <div className="px-5 py-2 rounded-full border border-white/10 bg-white/3 backdrop-blur-md flex items-center gap-3 drop-shadow-lg z-30 pointer-events-auto cursor-pointer hover:bg-white/8 transition-colors">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/80 font-medium">Available for new opportunities</span>
          </div>
        </div>

        <div className="z-20 flex flex-col items-start w-full mt-auto pointer-events-none">

          <h1 className="text-[5rem] md:text-[8rem] lg:text-[11rem] font-bold font-space-grotesk tracking-tighter text-white leading-[0.85] drop-shadow-2xl">
            JHAIR<br /> ZAMBRANO
          </h1>

          <div className="mt-8 flex flex-col items-start border-l-2 border-white/30 pl-6 max-w-md">
            <p className="text-base md:text-lg font-light text-white/70 leading-relaxed text-left">
              Software Engineering Student <span className="text-white/30">@</span> EPN <br />
              Bridging the gap between <span className="text-white font-medium">design</span> and <span className="text-white font-medium">engineering</span>.
            </p>
          </div>

        </div>

        {/* Indicador de scroll minimalista y BRILLANTE */}
        <div className="absolute bottom-16 right-8 md:right-16 flex flex-col items-center gap-4 text-white text-[10px] tracking-[0.25em] uppercase">
          <span className="[writing-mode:vertical-rl] rotate-0 mb-2 animate-pulse drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] font-medium">
            Scroll to discover
          </span>
          <div className="w-0.5 h-16 bg-white animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.9)] rounded-full" />
        </div>
      </section>

      {/* --- 01. ABOUT ME --- */}
      <section 
        id="about" 
        className="min-h-screen w-full flex items-center relative z-20 pointer-events-none border-t border-white/10 scroll-mt-0"
      >
        {/* GRID: 1 columna en móvil, 3 en PC */}
        <div className="w-full h-full grid grid-cols-1 lg:grid-cols-3 items-center gap-0 px-0">

          {/* 1. LEFT COLUMN: Identity + Personal Touch */}
          <div className="flex flex-col items-center justify-center h-full px-10 py-20 pointer-events-auto">
            
            {/* FOTO CARD */}
            <div className="w-full max-w-55 aspect-3/4 rounded-xl border border-white/10 bg-white/0.03 backdrop-blur-md relative overflow-hidden group transition-all duration-500 hover:border-white/20 mb-8">
              
              <div className="absolute inset-0">
                 {/* TODO: Reemplazar este div por el componente <Image /> de Next.js cuando tenga la foto final.
                  Ruta esperada: /public/assets/me.jpg */}
                 <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-white/10 font-mono text-xs">
                    [IMG_SOURCE]
                 </div>
              </div>

              {/* GRADIENTES Y TEXTO (Van ENCIMA de la foto) */}
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/90 z-10" />
              <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center z-20">
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-mono mb-1">
                  Jhair Zambrano
                </span>
                <span className="text-[8px] uppercase tracking-widest text-orange-500 font-bold">
                  Software Engineer
                </span>
              </div>
            </div>

            {/* LATIN QUOTE & SOFT SKILLS */}
            <div className="max-w-60 text-center space-y-6">
              <p className="text-white/60 text-xs font-serif italic tracking-wide leading-relaxed border-b border-white/10 pb-4">
                &quot;Aut inveniam viam aut faciam.&quot;
              </p>
              
              <div className="flex flex-wrap justify-center gap-2">
                 <span className="px-3 py-1 rounded-full border border-white/5 bg-white/2 text-[9px] uppercase tracking-wider text-white/40 hover:text-white hover:border-orange-500/30 transition-all cursor-default">
                    Proactive
                 </span>
                 <span className="px-3 py-1 rounded-full border border-white/5 bg-white/2 text-[9px] uppercase tracking-wider text-white/40 hover:text-white hover:border-orange-500/30 transition-all cursor-default">
                    Leadership
                 </span>
                 <span className="px-3 py-1 rounded-full border border-white/5 bg-white/2 text-[9px] uppercase tracking-wider text-white/40 hover:text-white hover:border-orange-500/30 transition-all cursor-default">
                    Problem Solver
                 </span>
                 <span className="px-3 py-1 rounded-full border border-white/5 bg-white/2 text-[9px] uppercase tracking-wider text-white/40 hover:text-white hover:border-orange-500/30 transition-all cursor-default">
                    Resilient
                 </span>
              </div>
            </div>

          </div>

          <div className="flex flex-col items-start justify-center h-full pl-4 lg:pl-16 pointer-events-auto relative z-30">
            <SystemControls />
          </div>

          {/* 3. RIGHT COLUMN: Bio & Mindset */}
          <div className="flex flex-col justify-center px-10 py-20 border-l border-white/5 pointer-events-auto">
            
            <div className="flex items-center gap-3 mb-8">
              <span className="text-orange-500 font-mono text-xs">01.</span>
              <h2 className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/40">About me</h2>
            </div>

            <h3 className="text-3xl md:text-4xl font-space-grotesk text-white mb-8 tracking-tight leading-none">
              Beyond <br />
              <span className="text-white/40">functional</span> <br />
            </h3>

            {/* Texto Narrativo */}
            <p className="text-white/60 text-sm md:text-base font-light leading-relaxed mb-6 text-justify max-w-md">
              Software Engineering student at <strong className="text-white font-medium">EPN</strong>. I bridge the gap between rigorous backend logic and immersive user experiences.
            </p>
            <p className="text-white/40 text-xs md:text-sm font-light leading-relaxed mb-8 text-justify max-w-md">
              My focus isn&apos;t just on code that compiles, but on systems that scale. I build software where performance meets aesthetics.
            </p>

            <div className="flex flex-col gap-4 border-t border-white/10 pt-6 mt-2">
              
              {/* Item 1: Scalable */}
              <div className="flex items-start gap-4 group">
                <div className="mt-1 flex items-center justify-center w-8 h-8 rounded bg-white/5 border border-white/10 group-hover:border-orange-500/50 group-hover:bg-orange-500/10 transition-all duration-300">
                  {/* Icono de Capas/Server */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 group-hover:text-orange-500 transition-colors">
                    <path d="m2 9 10 5 10-5"/><path d="m2 17 10 5 10-5"/><path d="m2 13 10 5 10-5"/><path d="M12 2 2 7l10 5 10-5-10-5z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-white text-sm font-medium group-hover:text-orange-500 transition-colors">Scalable Architecture</h4>
                  <p className="text-white/40 text-xs leading-relaxed">Systems built to handle growth without breaking.</p>
                </div>
              </div>

              {/* Item 2: Clean Code */}
              <div className="flex items-start gap-4 group">
                <div className="mt-1 flex items-center justify-center w-8 h-8 rounded bg-white/5 border border-white/10 group-hover:border-orange-500/50 group-hover:bg-orange-500/10 transition-all duration-300">
                  {/* Icono de Código */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 group-hover:text-orange-500 transition-colors">
                    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-white text-sm font-medium group-hover:text-orange-500 transition-colors">Clean Code Philosophy</h4>
                  <p className="text-white/40 text-xs leading-relaxed">Readable, maintainable, and efficient logic.</p>
                </div>
              </div>

              {/* Item 3: User Centric */}
              <div className="flex items-start gap-4 group">
                <div className="mt-1 flex items-center justify-center w-8 h-8 rounded bg-white/5 border border-white/10 group-hover:border-orange-500/50 group-hover:bg-orange-500/10 transition-all duration-300">
                  {/* Icono de Usuario/Corazón */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 group-hover:text-orange-500 transition-colors">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-white text-sm font-medium group-hover:text-orange-500 transition-colors">User-Centric Engineering</h4>
                  <p className="text-white/40 text-xs leading-relaxed">Tech that solves real human problems.</p>
                </div>
              </div>

              {/* Item 4: Agile / Process */}
              <div className="flex items-start gap-4 group">
                <div className="mt-1 flex items-center justify-center w-8 h-8 rounded bg-white/5 border border-white/10 group-hover:border-orange-500/50 group-hover:bg-orange-500/10 transition-all duration-300">
                  {/* Icono de Sincronización/Ciclo (Representando Sprints) */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 group-hover:text-orange-500 transition-colors">
                    <path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-white text-sm font-medium group-hover:text-orange-500 transition-colors">Agile Mindset</h4>
                  <p className="text-white/40 text-xs leading-relaxed">Scrum & Kanban adaptable. Iterative delivery.</p>
                </div>
              </div>
 
            </div>

          </div>

        </div>
      </section>

      <section id="stack" className="min-h-screen w-full flex items-center justify-center relative z-20 pointer-events-none border-t border-white/10 bg-black/40 backdrop-blur-md scroll-m-0">
        <div className="text-center max-w-4xl px-4">
          <h2 className="text-xs md:text-sm tracking-[0.3em] uppercase text-white/40 mb-8">02. Stack & Skills</h2>
          <h3 className="text-3xl md:text-5xl lg:text-6xl font-space-grotesk text-white/90 mb-8 leading-tight tracking-tight">Java, Python, Next.js, Docker...<br /><br /><span className="text-white/30 text-2xl md:text-4xl">& anything else required to get the job done.</span></h3>
        </div>
      </section>

      <section id="works" className="min-h-screen w-full flex items-center justify-center relative z-20 pointer-events-none border-t border-white/10 bg-black/40 backdrop-blur-md pb-20 scroll-m-0">
        <div className="text-center max-w-4xl px-4">
          <h2 className="text-xs md:text-sm tracking-[0.3em] uppercase text-white/40 mb-8">03. Selected Works</h2>
          <h3 className="text-4xl md:text-6xl lg:text-7xl font-space-grotesk text-white tracking-tight">Engineering beyond<br />the standard.</h3>
        </div>
      </section>

    </main>
  );
} 