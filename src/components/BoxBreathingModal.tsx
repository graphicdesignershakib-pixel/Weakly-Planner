import React, { useState, useEffect } from 'react';
import { Wind, Play, Square, Sparkles, Volume2, VolumeX } from 'lucide-react';

export const BoxBreathingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [seconds, setSeconds] = useState(4);
  const [isActive, setIsActive] = useState(true);
  const [completedCycles, setCompletedCycles] = useState(0);

  useEffect(() => {
    if (!isOpen || !isActive) return;

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev > 1) return prev - 1;

        // Transition phases: Inhale -> Hold -> Exhale -> Rest -> Inhale
        setPhase((currentPhase) => {
          if (currentPhase === 'Inhale') return 'Hold';
          if (currentPhase === 'Hold') return 'Exhale';
          if (currentPhase === 'Exhale') return 'Rest';
          setCompletedCycles((c) => c + 1);
          return 'Inhale';
        });

        return 4;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isActive]);

  if (!isOpen) return null;

  const phaseInstruction = {
    Inhale: 'Breathe in slowly through your nose...',
    Hold: 'Keep your lungs gently full and still...',
    Exhale: 'Slowly release breath through your mouth...',
    Rest: 'Empty lungs, peaceful stillness before next breath...',
  }[phase];

  const phaseColor = {
    Inhale: 'text-sky-500 border-sky-400/50 bg-sky-500/10 scale-110',
    Hold: 'text-purple-500 border-purple-400/50 bg-purple-500/10 scale-115',
    Exhale: 'text-teal-500 border-teal-400/50 bg-teal-500/10 scale-95',
    Rest: 'text-amber-500 border-amber-400/50 bg-amber-500/10 scale-90',
  }[phase];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
    >
      <div className="bg-[#09090B] border border-zinc-800 text-white rounded-3xl max-w-md w-full p-6 sm:p-8 flex flex-col items-center shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <div className="w-full flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-6">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-sky-950/60 text-sky-400 border border-sky-800/40 rounded-lg">
              <Wind className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Box Breathing 4-4-4-4 · De-Stress
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Big Breathing Pulsing Circle */}
        <div className="my-6 relative flex items-center justify-center">
          {/* Outer glow ring */}
          <div
            className={`w-52 h-52 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out shadow-2xl ${phaseColor}`}
          >
            <span className="text-4xl font-black font-mono tracking-tighter tabular-nums mb-1">
              {seconds}s
            </span>
            <span className="text-lg font-bold tracking-widest uppercase">
              {phase}
            </span>
          </div>
        </div>

        {/* Instructions */}
        <p className="text-sm font-medium text-zinc-300 text-center max-w-xs h-10 mb-4 transition-all duration-300">
          {phaseInstruction}
        </p>

        {/* Cycles counter & control */}
        <div className="w-full flex items-center justify-between pt-4 border-t border-zinc-800/80 text-xs text-zinc-400">
          <span className="font-mono">Completed Cycles: <strong className="text-white">{completedCycles}</strong></span>
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-colors cursor-pointer"
          >
            {isActive ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
            <span>{isActive ? 'Pause' : 'Resume'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
