import { audioSynth } from './audioSynth';
import { Language } from '../types';

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking = false;
  private onEndCallback: (() => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public isSupported(): boolean {
    return this.synth !== null;
  }

  public speak(
    text: string,
    lang: Language = 'es',
    onEnd?: () => void
  ) {
    if (!this.synth) return;

    this.stop();
    this.onEndCallback = onEnd || null;

    // Duck background music
    audioSynth.setDucking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'es' ? 'es-ES' : lang === 'pt' ? 'pt-BR' : 'en-US';
    utterance.rate = 1.02; // Professional executive pace
    utterance.pitch = 0.98; // Authoritative tone

    // Try to pick a polished voice if available
    const voices = this.synth.getVoices();
    const prefix = lang === 'es' ? 'es' : lang === 'pt' ? 'pt' : 'en';
    const preferredVoice = voices.find(
      v => v.lang.startsWith(prefix) &&
           (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium'))
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      this.isSpeaking = false;
      audioSynth.setDucking(false);
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      audioSynth.setDucking(false);
    };

    this.currentUtterance = utterance;
    this.isSpeaking = true;
    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    audioSynth.setDucking(false);
  }

  public pause() {
    if (this.synth) {
      this.synth.pause();
    }
  }

  public resume() {
    if (this.synth) {
      this.synth.resume();
    }
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}

export const speechService = new SpeechService();
