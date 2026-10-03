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
  Radio,
  X,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { ambientSound } from '../utils/ambientAudio';
import { playTaskCompleteSound } from '../utils/soundEffects';
import { fireConfetti } from '../utils/confetti';
import { Task } from '../types/planner';

interface AmbientFocusTimerProps {
  isOpen: boolean;
  onClose: () => void;
  tasks?: Task[];
  onTaskCompleted?: (taskId: string) => void;
}

type SoundType = 'rain' | 'waves' | 'brown' | 'breeze' | null;

export const AmbientFocusTimer: React.FC<AmbientFocusTimerProps> = ({
  isOpen,
  onClose,
  tasks = [],
  onTaskCompleted,
}) => {
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSound, setSelectedSound] = useState<SoundType>(null);
  const [volume, setVolume] = useState(0.6);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync timer when duration changes and not running
  const setPreset = (mins: number) => {
    setIsRunning(false);
    setDurationMinutes(mins);
    setSecondsRemaining(mins * 60);
  };

  // Timer tick
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            ambientSound.stop();
            setSelectedSound(null);
            playTaskCompleteSound();
            fireConfetti();
            if (selectedTaskId && onTaskCompleted) {
              onTaskCompleted(selectedTaskId);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, selectedTaskId, onTaskCompleted]);

  // Clean up ambient sound on close
  useEffect(() => {
    if (!isOpen) {
      ambientSound.stop();
      setSelectedSound(null);
      setIsRunning(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleSound = (sound: SoundType) => {
    if (selectedSound === sound) {
      ambientSound.stop();
      setSelectedSound(null);
    } else if (sound) {
      ambientSound.play(sound);
      ambientSound.setVolume(volume);
      setSelectedSound(sound);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    ambientSound.setVolume(newVol);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((durationMinutes * 60 - secondsRemaining) / (durationMinutes * 60)) * 100;
  const currentTask = tasks.find((t) => t.id === selectedTaskId);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 ${
        isFullscreen ? 'p-0' : ''
      }`}
    >
      <div
        className={`bg-zinc-950 text-white rounded-3xl shadow-2xl border border-zinc-800 relative flex flex-col justify-between overflow-hidden transition-all ${
          isFullscreen
            ? 'w-screen h-screen rounded-none p-6 sm:p-10'
            : 'max-w-xl w-full p-6 sm:p-8'
        }`}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-black tracking-tight text-white flex items-center gap-2">
                <span>ডিপ ওয়ার্ক ফোকাস মোড</span>
                <span className="text-[10px] font-mono uppercase bg-indigo-900/60 text-indigo-300 border border-indigo-700/60 px-2 py-0.5 rounded-full">
                  Ambient Audio
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                প্রাকৃতিক শব্দ ও পোমোডোরো টাইমার দিয়ে গভীর মনোযোগ তৈরি করুন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl cursor-pointer transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl cursor-pointer transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center: Big Countdown Clock */}
        <div className="my-8 flex flex-col items-center justify-center text-center">
          {/* Preset Buttons */}
          <div className="flex items-center gap-2 mb-6 bg-zinc-900/80 p-1 rounded-2xl border border-zinc-800">
            {[15, 25, 45, 60].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setPreset(mins)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  durationMinutes === mins
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>

          {/* Clock Display */}
          <div className="relative flex items-center justify-center my-2">
            {/* Circular Ring SVG */}
            <svg className="w-56 h-56 sm:w-64 sm:h-64 -rotate-90 transform">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                className="stroke-zinc-850"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                stroke="url(#gradientFocus)"
                strokeWidth="8"
                fill="none"
                strokeDasharray="1000"
                strokeDashoffset={1000 - (1000 * progress) / 100}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
              <defs>
                <linearGradient id="gradientFocus" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl sm:text-5xl font-mono font-black tracking-tight text-white">
                {formatTime(secondsRemaining)}
              </span>
              <span className="text-xs text-zinc-400 mt-1 font-medium">
                {isRunning ? 'ফোকাস সেশন চলছে...' : 'বিরতি / প্রস্তুত'}
              </span>
            </div>
          </div>

          {/* Active Task Selector */}
          {tasks.length > 0 && (
            <div className="mt-4 max-w-sm w-full">
              <label className="text-[11px] text-zinc-400 block mb-1 font-medium">
                কোন কাজটি করছেন সিলেক্ট করুন:
              </label>
              <select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="">(সাধারণ ফোকাস - কোনো নির্দিষ্ট কাজ নয়)</option>
                {tasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.completed ? '✓ ' : '○ '} {t.title} {t.time ? `(${t.time})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Primary Play/Pause/Reset Controls */}
          <div className="flex items-center gap-4 mt-6">
            <button
              type="button"
              onClick={() => {
                setSecondsRemaining(durationMinutes * 60);
                setIsRunning(false);
              }}
              className="p-3 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white rounded-2xl border border-zinc-800 transition-colors cursor-pointer"
              title="রিসেট"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setIsRunning(!isRunning)}
              className="px-8 py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-95 transition-all cursor-pointer"
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>পজ করুন</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>শুরু করুন</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Ambient Sound Control Strip */}
        <div className="bg-zinc-900/80 border border-zinc-800/80 p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-indigo-400" />
              <span>ব্যাকগ্রাউন্ড অ্যাম্বিয়েন্ট সাউন্ড (মনোযোগ বাড়ানোর জন্য)</span>
            </span>

            {/* Volume control */}
            <div className="flex items-center gap-2">
              {volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
              )}
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-20 accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => toggleSound('rain')}
              className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                selectedSound === 'rain'
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-xs'
                  : 'bg-zinc-850/60 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              <CloudRain className="w-4 h-4 text-sky-400" />
              <span>বৃষ্টির শব্দ 🌧️</span>
            </button>

            <button
              type="button"
              onClick={() => toggleSound('waves')}
              className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                selectedSound === 'waves'
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/50 shadow-xs'
                  : 'bg-zinc-850/60 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              <Waves className="w-4 h-4 text-teal-400" />
              <span>সাগরের ঢেউ 🌊</span>
            </button>

            <button
              type="button"
              onClick={() => toggleSound('brown')}
              className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                selectedSound === 'brown'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-xs'
                  : 'bg-zinc-850/60 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              <Radio className="w-4 h-4 text-purple-400" />
              <span>ডিপ নয়েজ 🎧</span>
            </button>

            <button
              type="button"
              onClick={() => toggleSound('breeze')}
              className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                selectedSound === 'breeze'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-xs'
                  : 'bg-zinc-850/60 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              <Wind className="w-4 h-4 text-emerald-400" />
              <span>বনের বাতাস 🍃</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
