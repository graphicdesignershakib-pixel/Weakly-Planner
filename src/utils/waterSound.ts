/**
 * Water Droplet & Pour Sound via Web Audio API.
 * Synthesizes realistic bubbling water sounds without any external files.
 */

let audioCtx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playWaterDropSound(glassIndex = 1): void {
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const baseFreq = 400 + glassIndex * 60; // Pitch increases as glass fills

  // Oscillator for the droplet tone
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(baseFreq, now);
  // Pitch glide up then sharp drop (characteristic of a water drop)
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now + 0.05);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, now + 0.12);

  // Gain envelope
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.25, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.16);
}
