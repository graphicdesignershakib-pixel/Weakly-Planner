/**
 * Lightweight pure HTML5 Canvas Confetti animation.
 * Zero external libraries, smooth 60fps particle physics.
 */

interface Particle {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  rot: number;
  vRot: number;
  color: string;
  opacity: number;
}

const CONFETTI_COLORS = [
  '#10B981', // emerald
  '#F59E0B', // amber
  '#3B82F6', // blue
  '#EC4899', // pink
  '#8B5CF6', // purple
  '#111111', // dark
  '#14B8A6', // teal
];

export function fireConfetti(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const width = (canvas.width = window.innerWidth * dpr);
  const height = (canvas.height = window.innerHeight * dpr);
  ctx.scale(dpr, dpr);

  const particleCount = 75;
  const particles: Particle[] = [];

  for (let i = 0; i < particleCount; i++) {
    const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
    const startY = window.innerHeight * 0.45;
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 9;

    particles.push({
      x: startX,
      y: startY,
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 6,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 5,
      rot: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      opacity: 1,
    });
  }

  let animationFrameId: number;
  const startTime = Date.now();

  function render() {
    if (!ctx) return;
    const elapsed = Date.now() - startTime;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    let aliveCount = 0;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22; // gravity
      p.vx *= 0.985; // friction
      p.rot += p.vRot;

      if (elapsed > 1000) {
        p.opacity -= 0.025;
      }

      if (p.opacity > 0 && p.y < window.innerHeight + 50) {
        aliveCount++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    }

    if (aliveCount > 0 && elapsed < 2500) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrameId);
      canvas.remove();
    }
  }

  animationFrameId = requestAnimationFrame(render);
}
