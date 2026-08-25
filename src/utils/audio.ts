// Web Audio synthesizer for pristine sound effects and procedural ambient rain

class SoundManager {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientSource: AudioNode | null = null;
  private isAmbientPlaying = false;
  private soundEffectsEnabled = true;
  private volume = 0.5;

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setSoundEffectsEnabled(enabled: boolean) {
    this.soundEffectsEnabled = enabled;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(
        this.volume * 0.12,
        this.ctx.currentTime,
        0.1
      );
    }
  }

  // Play a raindrop chime tuned to harmonic pentatonic scale based on streak
  public playRaindrop(streak = 0) {
    if (!this.soundEffectsEnabled) return;
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;

      // Pentatonic scale base frequencies (C4, D4, E4, G4, A4, C5, etc.)
      const notes = [
        261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99,
        880.0, 1046.5,
      ];
      const noteIndex = Math.min(streak, notes.length - 1);
      const freq = notes[noteIndex];

      // Primary tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      // Slight pitch bend down to simulate liquid drop
      osc.frequency.exponentialRampToValueAtTime(freq * 0.95, now + 0.18);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.3 * this.volume, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.38);

      // Harmonic shimmer for high streaks
      if (streak >= 3) {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(freq * 2, now + 0.03);
        gain2.gain.setValueAtTime(0, now + 0.03);
        gain2.gain.linearRampToValueAtTime(0.12 * this.volume, now + 0.05);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.03);
        osc2.stop(now + 0.42);
      }
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  // Play soft error drop
  public playWrong() {
    if (!this.soundEffectsEnabled) return;
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.28);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.25 * this.volume, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.32);
    } catch {
      // Ignore
    }
  }

  // Play click / select tick
  public playClick() {
    if (!this.soundEffectsEnabled) return;
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.08 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Ignore
    }
  }

  // Play achievement / victory chord
  public playVictory() {
    if (!this.soundEffectsEnabled) return;
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      const chord = [523.25, 659.25, 783.99, 1046.5]; // C major triad + octave

      chord.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + i * 0.08;

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.2 * this.volume, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.65);
      });
    } catch {
      // Ignore
    }
  }

  // Procedural lo-fi gentle ambient rain sound
  public toggleAmbientRain(enable: boolean) {
    if (enable === this.isAmbientPlaying) return;
    try {
      const ctx = this.initContext();
      if (enable) {
        // Generate continuous white/pink noise buffer
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0,
          b1 = 0,
          b2 = 0,
          b3 = 0,
          b4 = 0,
          b5 = 0,
          b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.969 * b2 + white * 0.153852;
          b3 = 0.8665 * b3 + white * 0.3104856;
          b4 = 0.55 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.016898;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.11;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        // Bandpass filter to make it sound like gentle outdoor rain
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(850, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          this.volume * 0.1,
          ctx.currentTime + 1.2
        );

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        whiteNoise.start(0);

        this.ambientSource = whiteNoise;
        this.ambientGain = gainNode;
        this.isAmbientPlaying = true;
      } else {
        if (this.ambientGain && this.ambientSource && this.ctx) {
          this.ambientGain.gain.linearRampToValueAtTime(
            0.0001,
            this.ctx.currentTime + 0.6
          );
          setTimeout(() => {
            try {
              (this.ambientSource as any)?.stop?.();
              this.ambientSource = null;
              this.ambientGain = null;
              this.isAmbientPlaying = false;
            } catch {
              // Ignore
            }
          }, 700);
        }
      }
    } catch {
      // Ignore
    }
  }

  public isAmbientActive(): boolean {
    return this.isAmbientPlaying;
  }
}

export const soundManager = new SoundManager();
