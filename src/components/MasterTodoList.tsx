import React, { useState } from 'react';
import { MasterTodo, DayInfo } from '../types/planner';
import {
  CheckSquare,
  Plus,
  Trash2,
  Calendar,
  ArrowRight,
  Check,
  AlertCircle,
  Briefcase,
  User,
  BookOpen,
  Filter,
} from 'lucide-react';

interface MasterTodoListProps {
  todos: MasterTodo[];
  daysInfo: DayInfo[];
  onToggleTodo: (id: string) => void;
  onAddTodo: (title: string, priority: MasterTodo['priority'], category: MasterTodo['category']) => void;
  onDeleteTodo: (id: string) => void;
  onAssignToDay: (todo: MasterTodo, dayIndex: number) => void;
}

export const MasterTodoList: React.FC<MasterTodoListProps> = ({
  todos,
  daysInfo,
  onToggleTodo,
  onAddTodo,
  onDeleteTodo,
  onAssignToDay,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [priority, setPriority] = useState<MasterTodo['priority']>('normal');
  const [category, setCategory] = useState<MasterTodo['category']>('work');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    onAddTodo(trimmed, priority, category);
    setNewTitle('');
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  const todayIndex = daysInfo.findIndex((d) => d.isToday);
  const targetToday = todayIndex !== -1 ? todayIndex : 0;

  return (
    <section aria-labelledby="master-todo-heading" className="bg-white border border-[#E5E7EB] rounded-xl p-4 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F4F4F5]">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-[#111111] text-white rounded-lg shadow-xs">
            <CheckSquare className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 id="master-todo-heading" className="text-base font-bold text-[#111111] tracking-tight">
                Master To-Do & Backlog
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FAFAFA] border border-[#E5E7EB] text-[#52525B] px-2 py-0.5 rounded-full">
                {activeCount} Pending
              </span>
            </div>
            <p className="text-xs text-[#71717A] mt-0.5">
              Brain dump tasks, backlog items & quick assign to any day
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#F8F9FA] p-1 rounded-lg border border-[#E5E7EB]">
          <button
            type="button"
            onClick={() => setFilter('active')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
              filter === 'active'
                ? 'bg-white text-[#111111] shadow-xs'
                : 'text-[#71717A] hover:text-[#111111]'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('completed')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
              filter === 'completed'
                ? 'bg-white text-[#111111] shadow-xs'
                : 'text-[#71717A] hover:text-[#111111]'
            }`}
          >
            Done ({completedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-[#111111] shadow-xs'
                : 'text-[#71717A] hover:text-[#111111]'
            }`}
          >
            All ({todos.length})
          </button>
        </div>
      </div>

      {/* Quick Add Form */}
      <form onSubmit={handleAdd} className="pt-4 pb-3 border-b border-[#F4F4F5] flex flex-col sm:flex-row items-stretch gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Capture an idea or task for this week..."
          className="flex-1 text-xs text-[#111111] bg-[#F8F9FA] hover:bg-white focus:bg-white border border-[#E5E7EB] focus:border-[#111111] rounded-lg px-3 py-2 transition-colors focus:outline-none placeholder:text-[#A1A1AA]"
        />

        <div className="flex items-center gap-2">
          {/* Priority */}
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as MasterTodo['priority'])}
            className="text-xs font-semibold bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg px-2.5 py-2 text-[#111111] focus:outline-none"
          >
            <option value="normal">Normal Priority</option>
            <option value="high">High Priority</option>
            <option value="urgent">🔥 Urgent</option>
          </select>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as MasterTodo['category'])}
            className="text-xs font-semibold bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg px-2.5 py-2 text-[#111111] focus:outline-none"
          >
            <option value="work">💼 Work</option>
            <option value="personal">🌿 Personal</option>
            <option value="study">📖 Study</option>
          </select>

          <button
            type="submit"
            disabled={!newTitle.trim()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#111111] text-white disabled:bg-[#E5E7EB] disabled:text-[#A1A1AA] hover:bg-[#27272A] rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </form>

      {/* Task List */}
      <div className="divide-y divide-[#F4F4F5] mt-2 max-h-[360px] overflow-y-auto">
        {filteredTodos.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#A1A1AA]">
            {filter === 'active' ? 'No active backlog tasks. All caught up!' : 'No tasks in this list.'}
          </div>
        ) : (
          filteredTodos.map((todo) => {
            const isUrgent = todo.priority === 'urgent';
            const isHigh = todo.priority === 'high';

            return (
              <div
                key={todo.id}
                className="py-2.5 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#F8F9FA]/80 rounded transition-colors group"
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={todo.completed}
                    onClick={() => onToggleTodo(todo.id)}
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                      todo.completed
                        ? 'bg-[#111111] border-[#111111] text-white'
                        : 'bg-white border-[#D4D4D8] hover:border-[#71717A]'
                    }`}
                  >
                    {todo.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>

                  <span
                    onClick={() => onToggleTodo(todo.id)}
                    className={`text-xs select-text cursor-pointer truncate ${
                      todo.completed
                        ? 'line-through text-[#8E8E93]'
                        : isUrgent
                        ? 'font-bold text-[#DC2626]'
                        : isHigh
                        ? 'font-semibold text-[#111111]'
                        : 'text-[#111111]'
                    }`}
                  >
                    {todo.title}
                  </span>

                  {/* Priority / Category Tags */}
                  <div className="flex items-center gap-1 shrink-0">
                    {isUrgent && (
                      <span className="text-[9px] font-bold uppercase bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded">
                        Urgent
                      </span>
                    )}
                    {isHigh && (
                      <span className="text-[9px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded">
                        High
                      </span>
                    )}
                    <span className="text-[9px] text-[#71717A] bg-[#FAFAFA] border border-[#E5E7EB] px-1.5 py-0.5 rounded">
                      {todo.category}
                    </span>
                  </div>
                </div>

                {/* Quick Assign to Daily Planner */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => onAssignToDay(todo, targetToday)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#52525B] hover:text-[#111111] hover:bg-[#E5E7EB] px-2 py-1 rounded transition-colors cursor-pointer border border-[#E5E7EB] bg-white shadow-2xs"
                    title={`Send to ${daysInfo[targetToday]?.dayName || 'Today'}`}
                  >
                    <ArrowRight className="w-3 h-3" />
                    <span>Send to {daysInfo[targetToday]?.dayAbbr || 'Today'}</span>
                  </button>

                  {/* Select day dropdown */}
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val !== '') {
                        onAssignToDay(todo, parseInt(val, 10));
                        e.target.value = '';
                      }
                    }}
                    className="text-[11px] text-[#71717A] hover:text-[#111111] bg-white border border-[#E5E7EB] rounded px-1.5 py-1 cursor-pointer focus:outline-none"
                    title="Send to specific day"
                  >
                    <option value="" disabled>
                      Day...
                    </option>
                    {daysInfo.map((d) => (
                      <option key={d.dayIndex} value={d.dayIndex}>
                        {d.dayAbbr} ({d.formattedDate})
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => onDeleteTodo(todo.id)}
                    className="p-1 text-[#A1A1AA] hover:text-[#DC2626] hover:bg-[#FEE2E2] rounded transition-colors cursor-pointer ml-1"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
