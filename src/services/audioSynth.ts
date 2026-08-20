// Web Audio API Generative Ambient Music Synthesizer
// Designed specifically for high-level executive presentations (CEOs / CFOs)

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private step = 0;
  private currentTheme: 'executive' | 'cyber' | 'minimal' | 'pulse' = 'executive';

  // Musical scales for generative ambient chords (Frequencies in Hz)
  // C minor 9 / Eb major 7 / Ab major 7 / Bb suspended
  private chords = [
    [130.81, 196.00, 261.63, 311.13, 392.00, 466.16], // C min 9 / 11
    [155.56, 233.08, 311.13, 392.00, 466.16, 587.33], // Eb maj 9
    [103.83, 155.56, 207.65, 261.63, 311.13, 392.00], // Ab maj 7 (#11)
    [116.54, 174.61, 233.08, 349.23, 440.00, 523.25], // Bb sus 2 / 4
  ];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.65, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      const clamped = Math.max(0, Math.min(1, vol));
      this.masterGain.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.05);
    }
  }

  public setDucking(ducked: boolean) {
    if (this.musicGain && this.ctx) {
      const targetVol = ducked ? 0.12 : 0.4;
      this.musicGain.gain.setTargetAtTime(targetVol, this.ctx.currentTime, 0.2);
    }
  }

  public setTheme(theme: 'executive' | 'cyber' | 'minimal' | 'pulse') {
    this.currentTheme = theme;
  }

  public startBackgroundMusic(theme: 'executive' | 'cyber' | 'minimal' | 'pulse' = 'executive') {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.currentTheme = theme;

    this.playDroneLayer();
    this.scheduleNextPhrase();
  }

  public stopBackgroundMusic() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public togglePlay(theme?: 'executive' | 'cyber' | 'minimal' | 'pulse') {
    if (this.isPlaying) {
      this.stopBackgroundMusic();
      return false;
    } else {
      this.startBackgroundMusic(theme || this.currentTheme);
      return true;
    }
  }

  public isMusicPlaying(): boolean {
    return this.isPlaying;
  }

  // Deep warm continuous drone
  private playDroneLayer() {
    if (!this.ctx || !this.musicGain || !this.isPlaying) return;

    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(65.41, this.ctx.currentTime); // C2

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(65.41 * 1.5, this.ctx.currentTime); // G2 fifth
      osc2.detune.setValueAtTime(4, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.25, this.ctx.currentTime + 3);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc1.start();
      osc2.start();

      // Gentle LFO filter movement
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.1, this.ctx.currentTime); // 10s cycle
      lfoGain.gain.setValueAtTime(80, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();
    } catch {
      // Audio context policy safe fail
    }
  }

  // Generative chord and arpeggio evolution
  private scheduleNextPhrase = () => {
    if (!this.isPlaying || !this.ctx || !this.musicGain) return;

    const chordIndex = this.step % this.chords.length;
    const currentChord = this.chords[chordIndex];
    this.step++;

    const now = this.ctx.currentTime;
    const duration = 6.0; // 6 seconds per harmonic wave

    // Play pad voices
    currentChord.slice(0, 4).forEach((freq, i) => {
      if (!this.ctx || !this.musicGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const pan = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

      osc.type = this.currentTheme === 'cyber' ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime((Math.random() - 0.5) * 8, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(this.currentTheme === 'cyber' ? 800 : 500, now);

      const noteGain = 0.08 / (i + 1);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(noteGain, now + 2.0);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration - 0.2);

      osc.connect(filter);
      filter.connect(gain);

      if (pan) {
        pan.pan.setValueAtTime((i - 1.5) * 0.4, now);
        gain.connect(pan);
        pan.connect(this.musicGain);
      } else {
        gain.connect(this.musicGain);
      }

      osc.start(now);
      osc.stop(now + duration);
    });

    // High tech bell shimmer arpeggio
    const arpNotes = [currentChord[3] * 2, currentChord[4] * 2, currentChord[5] * 2];
    arpNotes.forEach((arpFreq, idx) => {
      if (!this.ctx || !this.musicGain) return;
      const noteTime = now + 1.2 + idx * 0.8;
      const bellOsc = this.ctx.createOscillator();
      const bellGain = this.ctx.createGain();

      bellOsc.type = 'sine';
      bellOsc.frequency.setValueAtTime(arpFreq, noteTime);

      bellGain.gain.setValueAtTime(0.0001, noteTime);
      bellGain.gain.exponentialRampToValueAtTime(0.05, noteTime + 0.05);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 1.8);

      bellOsc.connect(bellGain);
      bellGain.connect(this.musicGain);

      bellOsc.start(noteTime);
      bellOsc.stop(noteTime + 2.0);
    });

    // Schedule next harmonic cycle
    this.timerId = window.setTimeout(this.scheduleNextPhrase, (duration - 0.5) * 1000);
  };

  // Executive Sound FX
  public playSlideTransitionSound() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.18); // A5

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(3, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.15, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Safe catch
    }
  }

  public playAlertPulseSound() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch {
      // Safe catch
    }
  }

  public playAlertChime() {
    this.playTone(660, 0.15, 'triangle', 0.12);
  }

  public playTone(freq: number = 440, duration: number = 0.2, type: OscillatorType = 'sine', gainVal: number = 0.1) {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(gainVal, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch {
      // Safe catch
    }
  }

  public playClickSound() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Safe catch
    }
  }
}

export const audioSynth = new AudioSynthesizer();
