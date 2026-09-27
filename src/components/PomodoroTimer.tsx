import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  CloudRain,
  Waves,
  Wind,
  Timer,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import {
  startAmbientSound,
  stopAmbientSound,
  setAmbientVolume,
  getActiveAmbientType,
} from '../utils/ambientAudio';
import { playLevelUpSound } from '../utils/soundEffects';
import { fireConfetti } from '../utils/confetti';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const MODE_DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const PomodoroTimer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(MODE_DURATIONS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [ambientType, setAmbientType] = useState<'rain' | 'ocean' | 'whitenoise' | 'off'>('off');
  const [volume, setVolume] = useState(0.35);
  const [completedSessions, setCompletedSessions] = useState(0);

  const totalTime = MODE_DURATIONS[mode];
  const progressPct = Math.round(((totalTime - timeLeft) / totalTime) * 100);

  useEffect(() => {
    let interval: number | null = null;
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      playLevelUpSound();
      fireConfetti();
      if (mode === 'focus') {
        setCompletedSessions((c) => c + 1);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode]);

  const handleTogglePlay = () => {
    if (!isRunning && ambientType !== 'off' && !getActiveAmbientType()) {
      startAmbientSound(ambientType as 'rain' | 'ocean' | 'whitenoise', volume);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(MODE_DURATIONS[mode]);
  };

  const handleSwitchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODE_DURATIONS[newMode]);
  };

  const handleSelectAmbient = (type: 'rain' | 'ocean' | 'whitenoise' | 'off') => {
    setAmbientType(type);
    if (type === 'off') {
      stopAmbientSound();
    } else {
      startAmbientSound(type, volume);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setAmbientVolume(newVol);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] rounded-xl shadow-xs overflow-hidden transition-colors">
      {/* Timer Bar / Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-[#FAFAFA] dark:hover:bg-[#202024] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded-lg">
            <Timer className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-white">
                Pomodoro Focus & Ambient Audio
              </h3>
              {completedSessions > 0 && (
                <span className="text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 px-1.5 py-0.2 rounded-full">
                  {completedSessions} {completedSessions === 1 ? 'Sprint' : 'Sprints'} Done
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
              {isRunning ? 'Currently in flow state' : '25m Deep Work · 5m Rest'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-bold text-[#111111] dark:text-white tracking-tight">
            {formattedTime}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleTogglePlay();
            }}
            className="p-1.5 bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded-md hover:opacity-90 transition-opacity cursor-pointer"
            title={isRunning ? 'Pause' : 'Start'}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <span className="text-[#A1A1AA]">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </div>
      </div>

      {/* Expanded Station Body */}
      {isOpen && (
        <div className="p-4 border-t border-[#F4F4F5] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#121214] flex flex-col md:flex-row items-center justify-between gap-5">
          {/* Left: Mode Buttons & Timer Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            {/* Mode selection pills */}
            <div className="flex items-center gap-1 bg-white dark:bg-[#18181B] p-1 rounded-lg border border-[#E5E7EB] dark:border-[#27272A]">
              <button
                type="button"
                onClick={() => handleSwitchMode('focus')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'focus'
                    ? 'bg-[#111111] text-white dark:bg-white dark:text-[#111111]'
                    : 'text-[#71717A] hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                Focus (25m)
              </button>
              <button
                type="button"
                onClick={() => handleSwitchMode('shortBreak')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'shortBreak'
                    ? 'bg-[#111111] text-white dark:bg-white dark:text-[#111111]'
                    : 'text-[#71717A] hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                Short Break (5m)
              </button>
              <button
                type="button"
                onClick={() => handleSwitchMode('longBreak')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'longBreak'
                    ? 'bg-[#111111] text-white dark:bg-white dark:text-[#111111]'
                    : 'text-[#71717A] hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                Long Break (15m)
              </button>
            </div>

            {/* Main Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded-lg text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
              >
                {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] text-[#71717A] hover:text-[#111111] dark:hover:text-white rounded-lg cursor-pointer transition-colors"
                title="Reset timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right: Ambient Sound Synthesizer */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
            <span className="text-xs font-semibold text-[#71717A] dark:text-[#A1A1AA] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Ambient:
            </span>

            {/* Sound selectors */}
            <div className="flex items-center gap-1 bg-white dark:bg-[#18181B] p-1 rounded-lg border border-[#E5E7EB] dark:border-[#27272A]">
              <button
                type="button"
                onClick={() => handleSelectAmbient('off')}
                className={`p-1.5 rounded transition-all cursor-pointer ${
                  ambientType === 'off'
                    ? 'bg-[#111111] text-white dark:bg-white dark:text-[#111111]'
                    : 'text-[#71717A] hover:text-[#111111] dark:hover:text-white'
                }`}
                title="Mute ambient sound"
              >
                <VolumeX className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleSelectAmbient('rain')}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                  ambientType === 'rain'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-[#71717A] hover:text-[#111111] dark:hover:text-white'
                }`}
                title="Calm Rain Sound"
              >
                <CloudRain className="w-3 h-3" />
                <span>Rain</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectAmbient('ocean')}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                  ambientType === 'ocean'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-[#71717A] hover:text-[#111111] dark:hover:text-white'
                }`}
                title="Ocean Waves Sound"
              >
                <Waves className="w-3 h-3" />
                <span>Ocean</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectAmbient('whitenoise')}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                  ambientType === 'whitenoise'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-[#71717A] hover:text-[#111111] dark:hover:text-white'
                }`}
                title="White/Pink Focus Noise"
              >
                <Wind className="w-3 h-3" />
                <span>Noise</span>
              </button>
            </div>

            {/* Volume slider */}
            {ambientType !== 'off' && (
              <div className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-[#71717A]" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-16 accent-[#111111] dark:accent-white cursor-pointer"
                  title="Ambient volume"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
