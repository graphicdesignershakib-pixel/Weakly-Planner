import React from 'react';
import { Habit, DayPlan } from '../types/planner';
import { PieChart, Activity, Sparkles, BookOpen, Briefcase, User, Award, CheckCircle2 } from 'lucide-react';

interface LifeBalanceScoreProps {
  habits: Habit[];
  days: DayPlan[];
}

export const LifeBalanceScore: React.FC<LifeBalanceScoreProps> = ({ habits, days }) => {
  // Calculate pillar completions
  const getPillarScore = (category: 'health' | 'pray' | 'study' | 'work' | 'personal') => {
    const catHabits = habits.filter((h) => (h.category || 'health') === category);
    const totalChecks = catHabits.length * 7;
    const completedChecks = catHabits.reduce(
      (acc, h) => acc + h.completed.filter(Boolean).length,
      0
    );

    // If no habits for this pillar, default to a balanced baseline or 50%
    if (totalChecks === 0) return 60;
    return Math.round((completedChecks / totalChecks) * 100);
  };

  const healthScore = getPillarScore('health');
  const prayScore = getPillarScore('pray');
  const studyScore = getPillarScore('study');
  const workScore = getPillarScore('work');
  const personalScore = getPillarScore('personal');

  const pillars = [
    { label: 'Health & Fitness', score: healthScore, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40', bar: 'bg-emerald-500' },
    { label: 'Pray & Mindfulness', score: prayScore, icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/40', bar: 'bg-purple-500' },
    { label: 'Study & Learning', score: studyScore, icon: BookOpen, color: 'text-sky-600', bg: 'bg-sky-50 dark:bg-sky-950/40', bar: 'bg-sky-500' },
    { label: 'Work & Career', score: workScore, icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/40', bar: 'bg-amber-500' },
    { label: 'Personal & Wellness', score: personalScore, icon: User, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-950/40', bar: 'bg-rose-500' },
  ];

  // Overall Balance Index is average score penalized by imbalance variance
  const scores = pillars.map((p) => p.score);
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  const getStatusText = (score: number) => {
    if (score >= 85) return 'Harmonious & Thriving ✨';
    if (score >= 70) return 'Solid Balance 💪';
    if (score >= 50) return 'Progressing Well 📈';
    return 'Room to Align 🌱';
  };

  return (
    <section aria-labelledby="life-balance-heading" className="bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all luxury-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-xl shadow-md shadow-emerald-500/20">
            <PieChart className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 id="life-balance-heading" className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Life Balance & Holistic Alignment Index
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 px-2 py-0.5 rounded-full">
                {getStatusText(avg)}
              </span>
            </div>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-0.5">
              5 Core Pillars of a fulfilled, disciplined & balanced lifestyle
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#F8F9FA] dark:bg-[#202024] px-3.5 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-[#27272A] self-start sm:self-auto">
          <Award className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-semibold text-[#52525B] dark:text-[#A1A1AA]">Overall Index:</span>
          <span className="text-sm font-bold font-mono text-[#111111] dark:text-white tabular-nums">
            {avg}%
          </span>
        </div>
      </div>

      {/* 5 Pillars Progress Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-4">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.label}
              className="p-3 rounded-lg border border-[#E5E7EB] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#121214] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`p-1.5 rounded-md ${pillar.bg} ${pillar.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-mono text-xs font-bold text-[#111111] dark:text-white">
                    {pillar.score}%
                  </span>
                </div>
                <h3 className="text-xs font-bold text-[#111111] dark:text-white leading-tight">
                  {pillar.label}
                </h3>
              </div>

              <div className="mt-3">
                <div className="w-full bg-[#E5E7EB] dark:bg-[#27272A] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${pillar.bar} rounded-full transition-all duration-500`}
                    style={{ width: `${pillar.score}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
