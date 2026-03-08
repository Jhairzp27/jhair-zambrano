class AudioService {
  private static instance: AudioService;

  private isMuted: boolean = true;

  private masterGains: Set<GainNode> = new Set();
  private contexts: Set<AudioContext> = new Set();
  private elements: Set<HTMLMediaElement> = new Set();
  private isPatched: boolean = false;

  private constructor() {
    if (typeof window !== "undefined") {
      this.patchBrowserAudio();
    }
  }

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    this.applyState();
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private applyState(): void {
    const targetVolume = this.isMuted ? 0 : 1;

    // 1. Web Audio API
    this.masterGains.forEach((gainNode) => {
      const ctx = gainNode.context;
      try {
        gainNode.gain.setTargetAtTime(targetVolume, ctx.currentTime, 0.05);
      } catch (e) {
        // Ignoramos errores menores de contexto cerrado o inválido
      }
    });

    // 2. Reactivar si es necesario
    if (!this.isMuted) {
      this.contexts.forEach((ctx) => {
        if (ctx.state === "suspended") {
          void ctx.resume();
        }
      });
    }

    // 3. Elementos simples
    this.elements.forEach((el) => {
      el.muted = this.isMuted;
    });
  }

  private patchBrowserAudio = (): void => {
    if (this.isPatched) return;

    const win = window as Window &
      typeof globalThis & {
        AudioContext?: typeof AudioContext;
        webkitAudioContext?: typeof AudioContext;
      };

    const OriginalContext = win.AudioContext || win.webkitAudioContext;
    if (OriginalContext) {
      // Cierres para capturar el scope de AudioService sin usar 'this' o alias
      const getIsMuted = () => this.isMuted;
      const addContext = (ctx: AudioContext) => this.contexts.add(ctx);
      const addGain = (gain: GainNode) => this.masterGains.add(gain);

      class PatchedContext extends OriginalContext {
        private _masterGain: GainNode;
        private _realDestination: AudioDestinationNode;

        constructor(opts?: AudioContextOptions) {
          super(opts);

          addContext(this);
          
          this._realDestination = super.destination;
          this._masterGain = super.createGain();
          this._masterGain.connect(this._realDestination);

          // Aplicar volumen inicial
          const initialVol = getIsMuted() ? 0 : 1;
          this._masterGain.gain.value = initialVol;

          addGain(this._masterGain);
        }

        get destination(): AudioDestinationNode {
          return this._masterGain as unknown as AudioDestinationNode;
        }
      }
      win.AudioContext = PatchedContext;
      win.webkitAudioContext = PatchedContext;
    }
    this.isPatched = true;
  };
}

export default AudioService.getInstance();