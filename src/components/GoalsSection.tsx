import React, { useState } from 'react';
import { LongTermGoal, ShortTermGoal } from '../types/planner';
import {
  Compass,
  Target,
  Plus,
  Trash2,
  Check,
  ChevronDown,
  ChevronUp,
  Award,
  Calendar,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface GoalsSectionProps {
  longTermGoals: LongTermGoal[];
  shortTermGoals: ShortTermGoal[];
  onAddLongGoal: (title: string, timeframe: string, category: LongTermGoal['category']) => void;
  onUpdateLongGoalProgress: (id: string, progress: number) => void;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onAddMilestone: (goalId: string, title: string) => void;
  onDeleteLongGoal: (id: string) => void;
  onAddShortGoal: (title: string, deadline: string, category: ShortTermGoal['category']) => void;
  onToggleShortGoalStatus: (id: string) => void;
  onDeleteShortGoal: (id: string) => void;
}

export const GoalsSection: React.FC<GoalsSectionProps> = ({
  longTermGoals,
  shortTermGoals,
  onAddLongGoal,
  onUpdateLongGoalProgress,
  onToggleMilestone,
  onAddMilestone,
  onDeleteLongGoal,
  onAddShortGoal,
  onToggleShortGoalStatus,
  onDeleteShortGoal,
}) => {
  const [activeTab, setActiveTab] = useState<'long' | 'short'>('long');
  const [newTitle, setNewTitle] = useState('');
  const [newTimeframe, setNewTimeframe] = useState('2026 Q4');
  const [newCategory, setNewCategory] = useState<'career' | 'health' | 'finance' | 'spiritual' | 'personal'>('career');
  const [newMilestoneText, setNewMilestoneText] = useState<{ [goalId: string]: string }>({});

  const handleAddLong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddLongGoal(newTitle.trim(), newTimeframe, newCategory);
    setNewTitle('');
  };

  const handleAddShort = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddShortGoal(newTitle.trim(), newTimeframe || 'This Month', newCategory as ShortTermGoal['category']);
    setNewTitle('');
  };

  const completedShortGoals = shortTermGoals.filter((g) => g.status === 'completed').length;

  return (
    <section aria-labelledby="goals-section-heading" className="bg-white border border-[#E5E7EB] rounded-xl p-4 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F4F4F5]">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-[#111111] text-white rounded-lg shadow-xs">
            <Compass className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 id="goals-section-heading" className="text-base font-bold text-[#111111] tracking-tight">
                Life Goals & Vision Hub
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FAFAFA] border border-[#E5E7EB] text-[#52525B] px-2 py-0.5 rounded-full">
                Strategic Alignment
              </span>
            </div>
            <p className="text-xs text-[#71717A] mt-0.5">
              Connect daily actions with your quarterly vision & long-term milestones
            </p>
          </div>
        </div>

        {/* Long / Short Term Tabs */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#F8F9FA] p-1 rounded-lg border border-[#E5E7EB]">
          <button
            type="button"
            onClick={() => setActiveTab('long')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'long'
                ? 'bg-white text-[#111111] shadow-xs'
                : 'text-[#71717A] hover:text-[#111111]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span>Long-Term ({longTermGoals.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('short')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'short'
                ? 'bg-white text-[#111111] shadow-xs'
                : 'text-[#71717A] hover:text-[#111111]'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-emerald-600" />
            <span>Short-Term ({completedShortGoals}/{shortTermGoals.length})</span>
          </button>
        </div>
      </div>

      {/* Content depending on Active Tab */}
      {activeTab === 'long' ? (
        <div className="pt-4 space-y-4">
          {/* Quick Add Long Goal */}
          <form onSubmit={handleAddLong} className="flex flex-col sm:flex-row items-stretch gap-2 pb-3 border-b border-[#F4F4F5]">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Master Full-Stack Architecture, Run a Half Marathon..."
              className="flex-1 text-xs text-[#111111] bg-[#F8F9FA] hover:bg-white focus:bg-white border border-[#E5E7EB] focus:border-[#111111] rounded-lg px-3 py-2 transition-colors focus:outline-none"
            />
            <input
              type="text"
              value={newTimeframe}
              onChange={(e) => setNewTimeframe(e.target.value)}
              placeholder="Timeframe (e.g. 1 Year)"
              className="w-32 text-xs text-[#111111] bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg px-2.5 py-2 focus:outline-none"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as LongTermGoal['category'])}
              className="text-xs font-semibold bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg px-2.5 py-2 text-[#111111]"
            >
              <option value="career">💼 Career</option>
              <option value="health">🏃 Health</option>
              <option value="spiritual">🤲 Spiritual</option>
              <option value="finance">💰 Finance</option>
              <option value="personal">🌿 Personal</option>
            </select>
            <button
              type="submit"
              disabled={!newTitle.trim()}
              className="inline-flex items-center gap-1 px-3.5 py-2 bg-[#111111] text-white disabled:bg-[#E5E7EB] disabled:text-[#A1A1AA] hover:bg-[#27272A] rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Goal</span>
            </button>
          </form>

          {/* Long Term Goals Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {longTermGoals.map((goal) => (
              <div
                key={goal.id}
                className="border border-[#E5E7EB] rounded-lg p-3.5 bg-[#FAFAFA] flex flex-col justify-between hover:border-[#D4D4D8] transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white border border-[#E5E7EB] text-[#52525B] px-2 py-0.5 rounded">
                      {goal.category} · {goal.timeframe}
                    </span>
                    <button
                      type="button"
                      onClick={() => onDeleteLongGoal(goal.id)}
                      className="p-1 text-[#A1A1AA] hover:text-[#DC2626] rounded cursor-pointer"
                      title="Delete goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-[#111111] leading-snug mb-2">
                    {goal.title}
                  </h3>

                  {/* Progress slider bar */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-[11px] text-[#71717A]">Overall Progress</span>
                      <span className="font-mono font-bold text-[#111111]">{goal.progress}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={goal.progress}
                      onChange={(e) => onUpdateLongGoalProgress(goal.id, parseInt(e.target.value, 10))}
                      className="w-full accent-[#111111] cursor-pointer"
                    />
                  </div>

                  {/* Milestones list */}
                  <div className="space-y-1 pt-2 border-t border-[#E5E7EB]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] block mb-1">
                      Key Milestones
                    </span>
                    {goal.milestones.map((m) => (
                      <div key={m.id} className="flex items-center gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => onToggleMilestone(goal.id, m.id)}
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 cursor-pointer ${
                            m.completed
                              ? 'bg-[#111111] border-[#111111] text-white'
                              : 'bg-white border-[#D4D4D8]'
                          }`}
                        >
                          {m.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </button>
                        <span className={m.completed ? 'line-through text-[#888888]' : 'text-[#111111]'}>
                          {m.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Milestone Form */}
                <div className="mt-3 pt-2 border-t border-[#E5E7EB] flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newMilestoneText[goal.id] || ''}
                    onChange={(e) =>
                      setNewMilestoneText({ ...newMilestoneText, [goal.id]: e.target.value })
                    }
                    placeholder="Add milestone..."
                    className="text-[11px] bg-white border border-[#E5E7EB] rounded px-2 py-1 flex-1 focus:outline-none focus:border-[#111111]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = (newMilestoneText[goal.id] || '').trim();
                        if (val) {
                          onAddMilestone(goal.id, val);
                          setNewMilestoneText({ ...newMilestoneText, [goal.id]: '' });
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = (newMilestoneText[goal.id] || '').trim();
                      if (val) {
                        onAddMilestone(goal.id, val);
                        setNewMilestoneText({ ...newMilestoneText, [goal.id]: '' });
                      }
                    }}
                    className="p-1 bg-[#111111] text-white rounded cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="pt-4 space-y-4">
          {/* Quick Add Short Goal */}
          <form onSubmit={handleAddShort} className="flex flex-col sm:flex-row items-stretch gap-2 pb-3 border-b border-[#F4F4F5]">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Read 1 atomic habits book, Finish Vercel deploy..."
              className="flex-1 text-xs text-[#111111] bg-[#F8F9FA] hover:bg-white focus:bg-white border border-[#E5E7EB] focus:border-[#111111] rounded-lg px-3 py-2 transition-colors focus:outline-none"
            />
            <input
              type="text"
              value={newTimeframe}
              onChange={(e) => setNewTimeframe(e.target.value)}
              placeholder="Deadline (e.g. Next 2 Weeks)"
              className="w-36 text-xs text-[#111111] bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg px-2.5 py-2 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newTitle.trim()}
              className="inline-flex items-center gap-1 px-3.5 py-2 bg-[#111111] text-white disabled:bg-[#E5E7EB] disabled:text-[#A1A1AA] hover:bg-[#27272A] rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Sprint Goal</span>
            </button>
          </form>

          {/* Short Term Goals List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {shortTermGoals.map((goal) => {
              const isDone = goal.status === 'completed';

              return (
                <div
                  key={goal.id}
                  className={`p-3 rounded-lg border flex items-start justify-between gap-3 transition-colors ${
                    isDone
                      ? 'bg-[#F4F4F5] border-[#E5E7EB]'
                      : 'bg-white border-[#E5E7EB] hover:border-[#111111]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isDone}
                      onClick={() => onToggleShortGoalStatus(goal.id)}
                      className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                        isDone
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-white border-[#D4D4D8] hover:border-[#111111]'
                      }`}
                    >
                      {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                    <div>
                      <span
                        onClick={() => onToggleShortGoalStatus(goal.id)}
                        className={`text-xs font-semibold select-text cursor-pointer block ${
                          isDone ? 'line-through text-[#888888]' : 'text-[#111111]'
                        }`}
                      >
                        {goal.title}
                      </span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] text-[#71717A] bg-[#FAFAFA] border border-[#E5E7EB] px-1.5 py-0.2 rounded font-mono">
                          {goal.deadline}
                        </span>
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                            isDone
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isDone ? 'Achieved' : 'In Progress'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteShortGoal(goal.id)}
                    className="p-1 text-[#A1A1AA] hover:text-[#DC2626] rounded cursor-pointer shrink-0"
                    title="Delete goal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
