import React, { useState, useMemo } from 'react';
import { Search, X, CheckSquare, Calendar, BookOpen, ListTodo, ArrowRight } from 'lucide-react';
import { PlannerState, DayInfo } from '../types/planner';
import { useLanguage } from '../context/LanguageContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: PlannerState;
  daysInfo: DayInfo[];
  onSelectDay: (dayIndex: number) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  state,
  daysInfo,
  onSelectDay,
}) => {
  const { isBn } = useLanguage();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { tasks: [], habits: [], todos: [] };

    // Search tasks
    const matchedTasks: Array<{ title: string; dayIndex: number; dayName: string; completed: boolean; time?: string }> = [];
    state.days.forEach((day, dIdx) => {
      const dInfo = daysInfo[dIdx];
      day.tasks.forEach((t) => {
        if (t.title.toLowerCase().includes(q)) {
          matchedTasks.push({
            title: t.title,
            dayIndex: dIdx,
            dayName: dInfo ? dInfo.dayName : `Day ${dIdx + 1}`,
            completed: t.completed,
            time: t.time,
          });
        }
      });
    });

    // Search habits
    const matchedHabits = (state.habits || []).filter((h) => h.name.toLowerCase().includes(q));

    // Search master todos
    const matchedTodos = (state.masterTodos || []).filter((t) => t.title.toLowerCase().includes(q));

    return {
      tasks: matchedTasks,
      habits: matchedHabits,
      todos: matchedTodos,
    };
  }, [query, state, daysInfo]);

  const totalMatches = results.tasks.length + results.habits.length + results.todos.length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white dark:bg-[#18181B] text-slate-900 dark:text-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-zinc-800 relative flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-zinc-800">
          <Search className="w-5 h-5 text-indigo-500 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isBn ? 'যেকোনো কাজ, নোট বা অভ্যাস সার্চ করুন...' : 'Search tasks, habits, todos...'}
            className="flex-1 bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-bold bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 rounded-lg"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
          {!query.trim() ? (
            <div className="text-center py-10 text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs font-medium">
                {isBn ? 'খুঁজতে টাইপ করুন (যেমন: মিটিং, নামাজ, ডিজাইন, পড়া)' : 'Type to search across everything'}
              </p>
            </div>
          ) : totalMatches === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <p className="text-xs font-medium">
                {isBn ? `"${query}" দিয়ে কোনো তথ্য পাওয়া যায়নি` : `No matches found for "${query}"`}
              </p>
            </div>
          ) : (
            <>
              {/* Daily Tasks Matches */}
              {results.tasks.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-sky-500" />
                    <span>{isBn ? 'দৈনিক কাজের মধ্যে পাওয়া গেছে' : 'Daily Tasks'} ({results.tasks.length})</span>
                  </h4>
                  <div className="space-y-1">
                    {results.tasks.map((task, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          onSelectDay(task.dayIndex);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800/80 bg-slate-50/60 dark:bg-zinc-850 hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer flex items-center justify-between gap-2 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`w-4 h-4 rounded-md border text-[10px] flex items-center justify-center shrink-0 ${
                              task.completed
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-slate-300 dark:border-slate-600'
                            }`}
                          >
                            {task.completed ? '✓' : ''}
                          </span>
                          <span
                            className={`text-xs font-semibold truncate ${
                              task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {task.time && (
                            <span className="text-[10px] font-mono text-slate-400 bg-white dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-zinc-700">
                              {task.time}
                            </span>
                          )}
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <span>{task.dayName}</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Master Todos Matches */}
              {results.todos.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ListTodo className="w-3.5 h-3.5 text-amber-500" />
                    <span>{isBn ? 'মাস্টার টুডু লিস্টে' : 'Master Todos'} ({results.todos.length})</span>
                  </h4>
                  <div className="space-y-1">
                    {results.todos.map((todo) => (
                      <div
                        key={todo.id}
                        className="p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800/80 bg-slate-50/60 dark:bg-zinc-850 flex items-center justify-between gap-2"
                      >
                        <span className={`text-xs font-semibold ${todo.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                          {todo.title}
                        </span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-zinc-700 font-bold">
                          {todo.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Habits Matches */}
              {results.habits.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-500" />
                    <span>{isBn ? 'অভ্যাস ট্র্যাকার' : 'Habit Tracker'} ({results.habits.length})</span>
                  </h4>
                  <div className="space-y-1">
                    {results.habits.map((habit) => (
                      <div
                        key={habit.id}
                        className="p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800/80 bg-slate-50/60 dark:bg-zinc-850 flex items-center justify-between gap-2"
                      >
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {habit.name}
                        </span>
                        <span className="text-[10px] font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded">
                          {habit.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
