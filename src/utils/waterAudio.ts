// Synthesized water droplet / bubble sound using Web Audio API
export function playWaterDropSound(): void {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Create droplet pitch sweep
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const now = ctx.currentTime;
    osc.type = 'sine';
    
    // Frequency ramps up like a water droplet: e.g. 600Hz -> 1400Hz in 0.12s
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.12);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);

    setTimeout(() => {
      try {
        ctx.close();
      } catch {
        // ignore
      }
    }, 300);
  } catch {
    // ignore audio block
  }
}
