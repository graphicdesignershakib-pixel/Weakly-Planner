import React, { useRef, useState } from 'react';
import {
  Download,
  Share2,
  X,
  Sparkles,
  Trophy,
  Flame,
  CheckCircle,
  Copy,
  Check,
} from 'lucide-react';
import { PlannerState, DayInfo } from '../types/planner';
import {
  calculateWeeklyProgress,
  calculateOverallHabitProgress,
} from '../utils/calculations';

interface WeeklyAchievementCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: PlannerState;
  daysInfo: DayInfo[];
  levelTitle?: string;
  levelNumber?: number;
}

export const WeeklyAchievementCardModal: React.FC<WeeklyAchievementCardModalProps> = ({
  isOpen,
  onClose,
  state,
  daysInfo,
  levelTitle = 'Master Executor',
  levelNumber = 5,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const taskProgress = calculateWeeklyProgress(state.days);
  const habitProgress = calculateOverallHabitProgress(state.habits);
  const weekLabel = `${daysInfo[0]?.formattedDate} – ${daysInfo[6]?.formattedDate}`;

  // Export card to PNG via HTML5 Canvas
  const handleDownloadPNG = async () => {
    setIsExporting(true);
    try {
      const canvas = document.createElement('canvas');
      const width = 800;
      const height = 960;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Render aesthetic dark luxury card
      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(0.5, '#020617');
      bgGrad.addColorStop(1, '#09090b');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Card inner border
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 30, width - 60, height - 60);

      // Top Brand & Header
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.fillText('WEEKLY LIFE PLANNER · LIFE OS', 60, 85);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px monospace';
      ctx.fillText(`Week: ${weekLabel}`, 60, 115);

      // Main Title
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 44px system-ui, sans-serif';
      ctx.fillText('Weekly Execution Review', 60, 180);

      // Focus Quote Box
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(60, 215, width - 120, 95, 12);
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 14px system-ui, sans-serif';
      ctx.fillText('WEEKLY FOCUS THEME', 85, 245);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 20px system-ui, sans-serif';
      const focusText = state.focus ? `"${state.focus}"` : '"Disciplined Execution & Growth"';
      ctx.fillText(focusText.slice(0, 48), 85, 280);

      // Level / Badge Row
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.fillText(`🏆 Level ${levelNumber} · ${levelTitle}`, 60, 360);

      // 2 Stat Metric Boxes
      // Box 1: Task Completion
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(60, 395, 320, 180, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.fillText('TASKS COMPLETED', 85, 435);

      ctx.fillStyle = '#34d399';
      ctx.font = '900 52px system-ui, sans-serif';
      ctx.fillText(`${taskProgress.percentage}%`, 85, 505);

      ctx.fillStyle = '#64748b';
      ctx.font = '16px monospace';
      ctx.fillText(`${taskProgress.completed} of ${taskProgress.total} tasks finished`, 85, 545);

      // Box 2: Habit Consistency
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(420, 395, 320, 180, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.fillText('HABIT CONSISTENCY', 445, 435);

      ctx.fillStyle = '#f59e0b';
      ctx.font = '900 52px system-ui, sans-serif';
      ctx.fillText(`${habitProgress.percentage}%`, 445, 505);

      ctx.fillStyle = '#64748b';
      ctx.font = '16px monospace';
      ctx.fillText(`${habitProgress.completed} streak checks locked in`, 445, 545);

      // 7-day mini bar visualization
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 16px system-ui, sans-serif';
      ctx.fillText('7-DAY COMPLETION BREAKDOWN', 60, 630);

      daysInfo.forEach((d, idx) => {
        const dayPlan = state.days[idx];
        const done = dayPlan?.tasks.filter((t) => t.completed).length || 0;
        const tot = dayPlan?.tasks.length || 0;
        const pct = tot > 0 ? Math.round((done / tot) * 100) : 0;

        const x = 60 + idx * 98;
        const barHeight = Math.max(10, pct * 1.2);

        // Bar bg
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x, 780 - 120, 75, 120);

        // Bar fill
        ctx.fillStyle = pct === 100 ? '#10b981' : '#38bdf8';
        ctx.fillRect(x, 780 - barHeight, 75, barHeight);

        // Label
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 14px system-ui, sans-serif';
        ctx.fillText(d.dayAbbr, x + 20, 810);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(`${pct}%`, x + 20, 780 - barHeight - 8);
      });

      // Footer
      ctx.fillStyle = '#64748b';
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillText('Generated with Weekly Life Planner · Strive for Excellence', 60, 890);

      // Trigger Download
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `weekly-achievement-${state.weekStart}.png`;
      a.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch {
      // fallback
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyText = () => {
    const summary = `🏆 Weekly Life Planner Achievement:\nWeek: ${weekLabel}\nTasks: ${taskProgress.completed}/${taskProgress.total} (${taskProgress.percentage}%)\nHabit Consistency: ${habitProgress.percentage}%\nTheme: "${state.focus || 'Focus'}"\nLevel: ${levelTitle} (Lv ${levelNumber}) 🔥`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="achievement-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
    >
      <div className="bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#71717A] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white rounded-lg cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <span className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-lg">
            <Trophy className="w-5 h-5" />
          </span>
          <div>
            <h3 id="achievement-modal-title" className="text-base font-bold text-[#111111] dark:text-white">
              Weekly Achievement Card
            </h3>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
              Download high-res image to share your wins & discipline
            </p>
          </div>
        </div>

        {/* Card Visual Preview */}
        <div
          ref={cardRef}
          className="my-4 p-5 rounded-xl bg-gradient-to-br from-[#0F172A] via-[#090D16] to-[#020617] text-white border border-slate-700/60 shadow-xl space-y-4"
        >
          <div className="flex justify-between items-start border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest block">
                Weekly Life Planner · Life OS
              </span>
              <h4 className="text-lg font-extrabold text-white mt-0.5">
                Weekly Execution Report
              </h4>
              <span className="text-xs text-slate-400 font-mono">
                {weekLabel}
              </span>
            </div>
            <span className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 text-xs font-bold flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" /> Lv {levelNumber}
            </span>
          </div>

          {/* Theme quote */}
          <div className="bg-slate-800/60 border border-slate-700/50 p-3 rounded-lg">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
              Core Theme
            </span>
            <p className="text-xs font-semibold text-slate-100 mt-0.5">
              {state.focus ? `"${state.focus}"` : '"Consistency & Relentless Execution"'}
            </p>
          </div>

          {/* 2 Big Stat Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg">
              <span className="text-[11px] text-slate-400 uppercase font-bold block">Tasks Done</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {taskProgress.percentage}%
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                {taskProgress.completed}/{taskProgress.total} completed
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg">
              <span className="text-[11px] text-slate-400 uppercase font-bold block">Habit Streak</span>
              <span className="text-2xl font-black text-amber-400 font-mono">
                {habitProgress.percentage}%
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                {habitProgress.completed}/{habitProgress.total} consistency
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-[#F4F4F5] dark:border-[#27272A]">
          <button
            type="button"
            onClick={handleCopyText}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 border border-[#E5E7EB] dark:border-[#27272A] text-xs font-semibold text-[#111111] dark:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#202024] rounded-lg cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Summary' : 'Copy Text'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPNG}
            disabled={isExporting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#111111] dark:bg-white text-white dark:text-[#111111] hover:bg-[#27272A] dark:hover:bg-zinc-200 rounded-lg text-xs font-bold transition-opacity cursor-pointer shadow-xs"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Card Saved as PNG!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download Shareable PNG</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
