import HeroCanvas from "@/components/3d/HeroCanvas";

export default function Home() {
  return (
    <main className="w-full bg-black text-white relative overflow-x-hidden selection:bg-white selection:text-black">

      <div
        className="fixed inset-0 z-[-5] opacity-[0.04] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />

      <div className="fixed inset-0 z-[-20] flex items-center justify-center pointer-events-none">
        <div className="w-[100vw] h-[100vw] md:w-[60vw] md:h-[60vw] bg-white/[0.03] blur-[150px] rounded-full mix-blend-screen" />
      </div>

      {/* Premium Minimalist Grid */}
      <div className="fixed inset-0 z-[-30] bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <HeroCanvas />

      <section className="relative min-h-screen w-full flex flex-col justify-between pt-12 pb-24 px-8 md:px-16 pointer-events-none z-20">

        {/* Top Header Area */}
        <div className="flex justify-between items-start w-full mt-20">
          <div className="px-5 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md flex items-center gap-3 drop-shadow-lg z-30 pointer-events-auto cursor-pointer hover:bg-white/[0.08] transition-colors">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/80 font-medium">Available for new opportunities</span>
          </div>
        </div>

        {/* Massive Typography - Pushed to the Bottom Left */}
        <div className="z-20 flex flex-col items-start w-full mix-blend-difference mt-auto">

          <h1 className="text-[5rem] md:text-[8rem] lg:text-[11rem] font-bold font-space-grotesk tracking-tighter text-white leading-[0.85] drop-shadow-md">
            JHAIR<br />ZAMBRANO
          </h1>

          <div className="mt-8 flex flex-col items-start border-l-2 border-white/30 pl-6 max-w-md">
            <p className="text-base md:text-lg font-light text-white/70 leading-relaxed text-left">
              Software Engineering Student <span className="text-white/30">@</span> EPN <br />
              Bridging the gap between <span className="text-white font-medium">design</span> and <span className="text-white font-medium">engineering</span>.
            </p>
          </div>

        </div>

        {/* Indicador de scroll minimalista - Pushed right */}
        <div className="absolute bottom-16 right-8 md:right-16 flex flex-col items-center gap-4 text-white/30 text-[10px] tracking-[0.25em] uppercase">
          <span className="[writing-mode:vertical-rl] rotate-0 mb-2">Scroll to discover</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* --- RESTO DE SECCIONES --- */}
      <section className="min-h-screen w-full flex items-center justify-center relative z-20 pointer-events-none">
        <div className="text-center max-w-4xl px-4">
          <h2 className="text-xs md:text-sm tracking-[0.3em] uppercase text-white/40 mb-8">01. About Me</h2>
          <h3 className="text-4xl md:text-6xl lg:text-7xl font-space-grotesk text-white mb-8 tracking-tight">Crafting ultimate aesthetics <br /> through deep engineering.</h3>
          <p className="text-white/50 text-xl font-light leading-relaxed max-w-2xl mx-auto">
            I architect scalable backend solutions without compromising on the frontend experience. True full-stack engineering is an art form.
          </p>
        </div>
      </section>

      <section className="min-h-screen w-full flex items-center justify-center relative z-20 pointer-events-none border-t border-white/10 bg-black/40 backdrop-blur-md">
        <div className="text-center max-w-4xl px-4">
          <h2 className="text-xs md:text-sm tracking-[0.3em] uppercase text-white/40 mb-8">02. Stack & Skills</h2>
          <h3 className="text-3xl md:text-5xl lg:text-6xl font-space-grotesk text-white/90 mb-8 leading-tight tracking-tight">Java, Python, Next.js, Docker...<br /><br /><span className="text-white/30 text-2xl md:text-4xl">& anything else required to get the job done.</span></h3>
        </div>
      </section>

      <section className="min-h-screen w-full flex items-center justify-center relative z-20 pointer-events-none border-t border-white/10 bg-black/40 backdrop-blur-md pb-20">
        <div className="text-center max-w-4xl px-4">
          <h2 className="text-xs md:text-sm tracking-[0.3em] uppercase text-white/40 mb-8">03. Selected Works</h2>
          <h3 className="text-4xl md:text-6xl lg:text-7xl font-space-grotesk text-white tracking-tight">Engineering beyond<br />the standard.</h3>
        </div>
      </section>

    </main>
  );
}