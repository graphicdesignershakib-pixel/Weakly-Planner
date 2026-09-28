/**
 * Synthesized Ambient Background Audio using Web Audio API.
 * High-quality white noise, rain sound, and ocean waves.
 * Zero external audio files required, completely offline capable.
 */

let ambientCtx: AudioContext | null = null;
let currentSourceNode: AudioNode | null = null;
let gainNode: GainNode | null = null;
let activeAmbientType: 'rain' | 'ocean' | 'whitenoise' | 'cafe' | 'binaural' | null = null;
let modulationInterval: number | null = null;
let oscillatorNodes: OscillatorNode[] = [];

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ambientCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      ambientCtx = new AudioContextClass();
    }
  }
  if (ambientCtx && ambientCtx.state === 'suspended') {
    ambientCtx.resume();
  }
  return ambientCtx;
}

function createNoiseBuffer(ctx: AudioContext, seconds = 5): AudioBuffer {
  const bufferSize = ctx.sampleRate * seconds;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0.0;

  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    // Pink noise filter approximation
    data[i] = (lastOut + 0.02 * white) / 1.02;
    lastOut = data[i];
    data[i] *= 3.5;
  }
  return buffer;
}

export function startAmbientSound(
  type: 'rain' | 'ocean' | 'whitenoise' | 'cafe' | 'binaural',
  volume = 0.35
): void {
  stopAmbientSound();

  const ctx = getContext();
  if (!ctx) return;

  activeAmbientType = type;

  gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(volume, ctx.currentTime);

  if (type === 'binaural') {
    // Binaural Beats: Alpha waves (432Hz in left ear, 442Hz in right ear -> 10Hz Alpha focus frequency)
    const merger = ctx.createChannelMerger(2);

    const oscLeft = ctx.createOscillator();
    oscLeft.type = 'sine';
    oscLeft.frequency.setValueAtTime(216, ctx.currentTime);

    const oscRight = ctx.createOscillator();
    oscRight.type = 'sine';
    oscRight.frequency.setValueAtTime(226, ctx.currentTime); // 10Hz differential

    const gainLeft = ctx.createGain();
    gainLeft.gain.setValueAtTime(0.5, ctx.currentTime);
    const gainRight = ctx.createGain();
    gainRight.gain.setValueAtTime(0.5, ctx.currentTime);

    oscLeft.connect(gainLeft);
    oscRight.connect(gainRight);

    gainLeft.connect(merger, 0, 0);
    gainRight.connect(merger, 0, 1);

    merger.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscLeft.start();
    oscRight.start();
    oscillatorNodes = [oscLeft, oscRight];
    return;
  }

  const buffer = createNoiseBuffer(ctx, 4);
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = buffer;
  noiseSource.loop = true;

  if (type === 'cafe') {
    // Cafe / Coffee Shop Ambience simulation: Warm filtered noise with slight rumble & murmur filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(550, ctx.currentTime);
    filter.Q.setValueAtTime(0.8, ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(gainNode);
  } else if (type === 'rain') {
    // Rain filter: Lowpass filter around 750Hz with resonance
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(750, ctx.currentTime);
    filter.Q.setValueAtTime(2, ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(gainNode);
  } else if (type === 'ocean') {
    // Ocean: Bandpass filter with slow sweeping frequency
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, ctx.currentTime);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(gainNode);

    // Modulate filter frequency to mimic waves
    let waveStep = 0;
    modulationInterval = window.setInterval(() => {
      if (!ctx) return;
      waveStep += 0.05;
      const targetFreq = 260 + Math.sin(waveStep) * 160;
      filter.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.4);
    }, 200);
  } else {
    // White/Pink noise: Lowpass around 1200Hz for warm tone
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(gainNode);
  }

  gainNode.connect(ctx.destination);
  noiseSource.start();
  currentSourceNode = noiseSource;
}

export function stopAmbientSound(): void {
  if (modulationInterval !== null) {
    clearInterval(modulationInterval);
    modulationInterval = null;
  }
  if (oscillatorNodes.length > 0) {
    oscillatorNodes.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore
      }
    });
    oscillatorNodes = [];
  }
  if (currentSourceNode) {
    try {
      (currentSourceNode as AudioBufferSourceNode).stop();
      currentSourceNode.disconnect();
    } catch {
      // ignore
    }
    currentSourceNode = null;
  }
  if (gainNode) {
    try {
      gainNode.disconnect();
    } catch {
      // ignore
    }
    gainNode = null;
  }
  activeAmbientType = null;
}

export function setAmbientVolume(vol: number): void {
  if (gainNode && ambientCtx) {
    gainNode.gain.setTargetAtTime(vol, ambientCtx.currentTime, 0.1);
  }
}

export function getActiveAmbientType(): 'rain' | 'ocean' | 'whitenoise' | 'cafe' | 'binaural' | null {
  return activeAmbientType;
}
