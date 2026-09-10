import HeroCanvas from "@/components/3d/HeroCanvas";
import CredentialItem from "@/components/ui/CredentialItems";
import DevAvatar from "@/components/ui/DevAvatar";
import Footer from "@/components/ui/Footer";
import ProjectCard from "@/components/ui/ProjectCard";
import ScrollHover from "@/components/ui/ScrollHover";
import SystemControls from "@/components/ui/SystemControls";
import TechStack from "@/components/ui/TechStack";

export default function Home() {
  return (
    <main className="w-full bg-black text-white relative overflow-x-hidden selection:bg-white selection:text-black">

      {/* RUIDO DE FONDO */}
      <div
        className="fixed inset-0 z-[-5] opacity-[0.04] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />

      {/* LUZ AMBIENTAL */}
      <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="w-auto h-[100vw] md:w-[60vw] md:h-[60vw] bg-white/3 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      {/* GRID DE FONDO */}
      <div className="fixed inset-0 z-[-30] bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] md:bg-[size:64px_64px]" />

      {/* CANVAS 3D (Teclado) */}
      <HeroCanvas />

      {/* --- HERO --- */}
      <section id="hero" className="relative min-h-screen w-full flex flex-col justify-between pt-12 pb-12 md:pb-24 px-6 md:px-16 pointer-events-none z-30">
        {/* MOVIL - Badge */}
        <div className="md:hidden absolute top-[25%] left-6 z-30 pointer-events-auto">
          <div className="[writing-mode:vertical-rl] rotate-180 px-4 py-1.3 rounded-full border border-white/10 bg-white/3 backdrop-blur-md flex items-center gap-3 drop-shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            <span className="text-[9px] uppercase tracking-[0.15em] text-white/80 font-medium">
              Available for work
            </span>
          </div>
        </div>

        {/* ESCRITORIO - Badge */}
        <div className="hidden md:flex justify-between items-start w-full mt-20">
          <div className="px-5 py-2 rounded-full border border-white/10 bg-white/3 backdrop-blur-md flex items-center gap-3 drop-shadow-lg z-30 pointer-events-auto cursor-pointer hover:bg-white/8 transition-colors">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            <span className="text-xs uppercase tracking-[0.2em] text-white/80 font-medium">
              Available for new opportunities
            </span>
          </div>
        </div>

        <div className="z-20 flex flex-col items-start pointer-events-none absolute left-6 top-[62%] md:static md:w-full md:mt-auto md:mb-0">
          <h1 className="text-[13vw] sm:text-[9vw] lg:text-[11vw] font-bold font-space-grotesk tracking-tighter text-white leading-[0.85] drop-shadow-2xl">
            JHAIR<br /> ZAMB<span id="surname-anchor">R</span>ANO
          </h1>

          <div className="mt-6 md:mt-8 flex flex-col items-start border-l-2 border-white/30 pl-4 md:pl-6 max-w-[80vw] md:max-w-md">
            <p className="text-sm md:text-lg font-light text-white/70 leading-relaxed text-left">
              Software Engineering Student <span className="text-white/30">@</span> EPN <br />
              Bridging the gap between <span className="text-white font-medium">design</span> and <span className="text-white font-medium">engineering</span>.
            </p>
          </div>
        </div>

        {/* MOVIL - Scroll hint */}
        <div className="flex md:hidden absolute top-1/2 -translate-y-1/2 right-4 flex-col items-center gap-4 text-white text-[10px] tracking-[0.25em] uppercase z-30 mix-blend-difference">
          <span className="[writing-mode:vertical-rl] rotate-0 mb-2 animate-pulse drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] font-medium text-[9px]">
            Scroll to discover
          </span>
          <div className="w-0.5 h-12 bg-white animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.9)] rounded-full" />
        </div>

        {/* ESCRITORIO - Scroll hint */}
        <div className="hidden md:flex absolute bottom-16 right-16 flex-col items-center gap-4 text-white text-[10px] tracking-[0.25em] uppercase">
          <span className="[writing-mode:vertical-rl] rotate-0 mb-2 animate-pulse drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] font-medium">
            Scroll to discover
          </span>
          <div className="w-0.5 h-16 bg-white animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.9)] rounded-full" />
        </div>
      </section>

      {/* --- 01. ABOUT ME --- */}
      <section
        id="about"
        className="min-h-screen w-full flex items-center relative z-30 pointer-events-none border-t border-white/10 scroll-mt-0"
      >
        {/* GRID: 1 columna en móvil, 3 en PC (el teclado 3D cae en la central) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 items-center gap-0 py-20 lg:py-0">

          {/* 1. LEFT: Avatar + Quote + Soft Skills */}
          <div className="flex flex-col items-center justify-center px-10 py-10 lg:py-20 pointer-events-auto">
            <DevAvatar />

            <div className="max-w-60 text-center space-y-6 mt-4">
              <p className="text-white/60 text-xs font-serif italic tracking-wide leading-relaxed border-b border-white/10 pb-4">
                &quot;Aut inveniam viam aut faciam.&quot;
              </p>

              <div className="flex flex-wrap justify-center gap-2">
                {["Proactive", "Leadership", "Problem Solver", "Resilient"].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] text-[9px] uppercase tracking-wider text-white/50 hover:text-white hover:border-orange-500/30 transition-all cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 2. CENTER: System Controls (el teclado cae aquí en desktop) */}
          <div className="flex flex-col items-start justify-center px-10 py-8 lg:px-0 lg:py-0 lg:h-full lg:pl-16 pointer-events-auto relative z-30">
            <SystemControls />
          </div>

          {/* 3. RIGHT: Bio & Mindset */}
          <div className="flex flex-col justify-center px-10 py-10 lg:py-20 border-t lg:border-t-0 lg:border-l border-white/5 pointer-events-auto">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-orange-500 font-mono text-xs">01.</span>
              <h2 className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/40">About me</h2>
            </div>

            <h3 className="text-3xl md:text-4xl font-space-grotesk text-white mb-8 tracking-tight leading-none">
              Beyond <br />
              <span className="text-white/40">functional</span>
            </h3>

            <p className="text-white/60 text-sm md:text-base font-light leading-relaxed mb-6 text-justify max-w-md">
              Software Engineering student at <strong className="text-white font-medium">EPN</strong>. I bridge the gap between rigorous backend logic and immersive user experiences.
            </p>
            <p className="text-white/50 text-xs md:text-sm font-light leading-relaxed mb-8 text-justify max-w-md">
              My focus isn&apos;t just on code that compiles, but on systems that scale. I build software where performance meets aesthetics.
            </p>

            {/* En móvil cada punto se enciende al pasar por el centro de la pantalla (ScrollHover) */}
            <div className="flex flex-col gap-4 border-t border-white/10 pt-6 mt-2">
              {[
                {
                  title: "Scalable Architecture",
                  desc: "Systems built to handle growth without breaking.",
                  icon: <><path d="m2 9 10 5 10-5"/><path d="m2 17 10 5 10-5"/><path d="m2 13 10 5 10-5"/><path d="M12 2 2 7l10 5 10-5-10-5z"/></>,
                },
                {
                  title: "Clean Code Philosophy",
                  desc: "Readable, maintainable, and efficient logic.",
                  icon: <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>,
                },
                {
                  title: "User-Centric Engineering",
                  desc: "Tech that solves real human problems.",
                  icon: <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>,
                },
                {
                  title: "Agile Mindset",
                  desc: "Scrum & Kanban adaptable. Iterative delivery.",
                  icon: <><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></>,
                },
              ].map((item) => (
                <ScrollHover key={item.title} className="flex items-start gap-4 group">
                  <div className="mt-1 flex items-center justify-center w-8 h-8 rounded bg-white/5 border border-white/10 lit:border-orange-500/50 lit:bg-orange-500/10 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 lit:text-orange-500 transition-colors">
                      {item.icon}
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-medium lit:text-orange-500 transition-colors">{item.title}</h4>
                    <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </ScrollHover>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- 02. SELECTED WORKS --- */}
      <section id="works" className="w-full relative z-30 border-t border-white/10 bg-black/55 backdrop-blur-md py-32">
        <div className="max-w-300 mx-auto px-6 md:px-12">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-orange-500 font-mono text-xs">02.</span>
                <h2 className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/40">
                  Portfolio
                </h2>
              </div>
              <h3 className="text-4xl md:text-5xl font-space-grotesk font-bold text-white tracking-tighter">
                SELECTED <span className="text-orange-500">WORKS</span>
              </h3>
            </div>

            <p className="text-white/50 text-xs max-w-xs text-right hidden md:block leading-relaxed pl-6">
              Real-world problems solved with code. <br />
              From strategic consulting to backend architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

            <ProjectCard
              title="Habit Tracking Ecosystem"
              category="Software Architecture"
              description="Full-cycle development of a productivity platform using Java & Jakarta EE. Engineered the complete UML navigation maps and database schema. Features session management and complex CRUD operations."
              techStack={["Java", "Jakarta EE", "PostgreSQL", "UML Design", "MVC", "Docker", "CI/CD", "Git"]}
              repoLink="https://github.com/Jhairzp27/Habit-Tracker"
              demoLink="https://habit-tracker-jf6y.onrender.com/"
              videoSrc="/api/video?path=/Portafolio/HabitTrackerx3.webm"
              imageSrc="/posters/HabitTracker.png"
            />

            <ProjectCard
              title="Magnus Audit Digital Transformation"
              category="Web Strategy & SEO"
              description="Led the digital modernization for an accounting firm in Ecuador. Implemented corporate infrastructure (Email/Hosting), optimized SEO ranking strategies, and integrated Google Analytics for business intelligence."
              techStack={["Web Design", "Mockups", "Figma", "SEO", "Google Analytics", "Digital Strategy", "UX/UI"]}
              demoLink="https://www.magnusauditec.com/"
              videoSrc="/api/video?path=/Portafolio/Magnusx2.webm"
              imageSrc="/posters/Magnus.png"
            />

            <ProjectCard
              title="Disaccort Corp. Platform"
              category="Frontend Development"
              description="Corporate web platform focused on brand identity and responsive performance. Implemented modern UI patterns."
              techStack={["HTML/CSS", "JavaScript", "Responsive Design", "Brand Identity", "Git"]}
              repoLink="https://github.com/Jhairzp27/Disaccort"
              demoLink="https://jhairzp27.github.io/Disaccort/"
              videoSrc="/api/video?path=/Portafolio/Disaccort.webm"
              imageSrc="/posters/Disaccort.png"
            />

            <ProjectCard
              title="Transport Unit Analytics"
              category="Data Automation"
              description="Developed an internal automated tool to process transport unit logistics. Replaced manual Excel workflows, generating statistical insights on fleet efficiency. (Proprietary Tool)."
              techStack={["Python", "Pandas", "Excel Automation", "Data Science", "Data Analytics", "Internal Tool"]}
            />

            <ProjectCard
              title="CineMax Architecture"
              category="Modular Software Design"
              description="Collaborative development of a cinema management system focusing on modularity and design patterns. Led the architectural division of modules to ensure decoupled and maintainable code."
              techStack={["Software Design", "Modular Arch", "Team Leadership", "Git Flow", "Design Patterns"]}
              repoLink="https://github.com/CineMax-Diseno-De-Software-GR3SW/CineMax"
              videoSrc="/api/video?path=/Portafolio/CineMax2.webm"
              imageSrc="/posters/CineMax.png"
            />

            {/* COMING SOON */}
            <ScrollHover className="group relative flex flex-col h-full min-h-75 border border-dashed border-white/10 rounded-2xl items-center justify-center lit-self:border-orange-500/30 lit-self:bg-orange-500/2 transition-all duration-500">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 lit:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 lit:text-orange-500 transition-colors">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 lit:text-white/60 transition-colors font-mono">
                Project Classified
              </span>
              <span className="text-[11px] text-orange-500/60 mt-2 font-mono opacity-0 lit:opacity-100 transition-opacity">
                {"// IN DEVELOPMENT"}
              </span>
            </ScrollHover>
          </div>
        </div>
      </section>

      {/* --- 03. STACK --- */}
      <TechStack />

      {/* --- 04. CREDENTIALS --- */}
      <section id="credentials" className="w-full relative z-30 border-t border-white/10 bg-black/55 backdrop-blur-md py-24">
        <div className="max-w-250 mx-auto px-6 md:px-12">

          <div className="flex items-center gap-3 mb-12">
            <span className="text-orange-500 font-mono text-xs">04.</span>
            <h2 className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/40">
              Certifications
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            <CredentialItem
              title="Code in Place (Python Methodology)"
              issuer="Stanford University"
              date="2024"
              status="completed"
              logoText="S"
            />
            <CredentialItem
              title="Software Engineering Bootcamp"
              issuer="Escuela Politécnica Nacional (EPN)"
              date="2023"
              status="completed"
              logoText="E"
            />
            <CredentialItem
              title="Google Data Analytics Professional Certificate"
              issuer="Google"
              date="Est. Completion: 2026"
              status="in-progress"
              progress={65}
              logoText="G"
            />
          </div>

          <div className="mt-8 text-center">
            <p className="text-white/50 text-[10px] font-mono">
              VERIFIED CREDENTIALS AVAILABLE ON <a href="https://www.linkedin.com/in/gregoy-jhair-zambrano" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline underline-offset-4">LINKEDIN</a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
