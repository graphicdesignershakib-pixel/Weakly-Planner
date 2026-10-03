/**
 * Web Audio API synthesizer for natural ambient study sounds:
 * - Rain (Filtered pink/brown noise with soothing frequency modulations)
 * - Ocean Waves (Slow LFO oscillation over bandpassed noise)
 * - Deep Focus White/Brown Noise (Warm smooth acoustic rumble for focus)
 * - Forest Breeze (Soft wind sweep)
 * - Cafe / Ambient Binaural
 */

type AmbientType = 'rain' | 'ocean' | 'whitenoise' | 'cafe' | 'binaural' | 'waves' | 'brown' | 'breeze';

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private currentType: string | null = null;
  private gainNode: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private lfoNode: OscillatorNode | null = null;
  private isPlaying = false;
  private volume = 0.5;

  private getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private createNoiseBuffer(ctx: AudioContext, type: 'brown' | 'pink' | 'white'): AudioBuffer {
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === 'brown') {
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5;
      } else if (type === 'pink') {
        lastOut = (lastOut * 0.95) + (white * 0.05);
        data[i] = lastOut * 4;
      } else {
        data[i] = white * 0.3;
      }
    }
    return buffer;
  }

  public play(type: AmbientType): void {
    this.stop();
    const ctx = this.getAudioContext();
    this.currentType = type;

    const gain = ctx.createGain();
    gain.gain.value = this.volume;
    this.gainNode = gain;

    const noiseBuffer = this.createNoiseBuffer(ctx, type === 'brown' || type === 'ocean' ? 'brown' : 'pink');
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;
    this.noiseNode = source;

    if (type === 'rain') {
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(850, ctx.currentTime);
      filter.Q.setValueAtTime(1, ctx.currentTime);

      source.connect(filter);
      filter.connect(gain);
      this.filterNode = filter;
    } else if (type === 'waves' || type === 'ocean') {
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(280, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();
      this.lfoNode = lfo;

      source.connect(filter);
      filter.connect(gain);
      this.filterNode = filter;
    } else if (type === 'breeze' || type === 'cafe') {
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(500, ctx.currentTime);
      filter.Q.setValueAtTime(2.5, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.08, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(200, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();
      this.lfoNode = lfo;

      source.connect(filter);
      filter.connect(gain);
      this.filterNode = filter;
    } else {
      // Whitenoise / Brown / Binaural
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(550, ctx.currentTime);

      source.connect(filter);
      filter.connect(gain);
      this.filterNode = filter;
    }

    gain.connect(ctx.destination);
    source.start();
    this.isPlaying = true;
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public stop(): void {
    if (this.noiseNode) {
      try {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
      } catch {
        // ignore
      }
      this.noiseNode = null;
    }
    if (this.lfoNode) {
      try {
        this.lfoNode.stop();
        this.lfoNode.disconnect();
      } catch {
        // ignore
      }
      this.lfoNode = null;
    }
    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch {
        // ignore
      }
      this.gainNode = null;
    }
    this.isPlaying = false;
    this.currentType = null;
  }

  public getStatus(): { isPlaying: boolean; type: string | null; volume: number } {
    return {
      isPlaying: this.isPlaying,
      type: this.currentType,
      volume: this.volume,
    };
  }
}

export const ambientSound = new AmbientSoundEngine();

// Legacy / Helper functions for compatibility
export function startAmbientSound(
  type: 'rain' | 'ocean' | 'whitenoise' | 'cafe' | 'binaural',
  volume?: number
): void {
  if (typeof volume === 'number') {
    ambientSound.setVolume(volume);
  }
  ambientSound.play(type);
}

export function stopAmbientSound(): void {
  ambientSound.stop();
}

export function setAmbientVolume(vol: number): void {
  ambientSound.setVolume(vol);
}

export function getActiveAmbientType(): string | null {
  return ambientSound.getStatus().type;
}
