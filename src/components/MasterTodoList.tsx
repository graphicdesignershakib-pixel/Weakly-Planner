import React, { useState } from 'react';
import { MasterTodo, DayInfo } from '../types/planner';
import {
  CheckSquare,
  Plus,
  Trash2,
  ArrowRight,
  Check,
  Search,
  CheckCheck,
  Edit3,
  X,
} from 'lucide-react';

interface MasterTodoListProps {
  todos: MasterTodo[];
  daysInfo: DayInfo[];
  onToggleTodo: (id: string) => void;
  onAddTodo: (title: string, priority: MasterTodo['priority'], category: MasterTodo['category']) => void;
  onDeleteTodo: (id: string) => void;
  onAssignToDay: (todo: MasterTodo, dayIndex: number) => void;
  onClearCompletedTodos?: () => void;
  onEditTodo?: (id: string, newTitle: string, priority?: MasterTodo['priority'], category?: MasterTodo['category']) => void;
}

export const MasterTodoList: React.FC<MasterTodoListProps> = ({
  todos,
  daysInfo,
  onToggleTodo,
  onAddTodo,
  onDeleteTodo,
  onAssignToDay,
  onClearCompletedTodos,
  onEditTodo,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [priority, setPriority] = useState<MasterTodo['priority']>('normal');
  const [category, setCategory] = useState<MasterTodo['category']>('work');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'work' | 'personal' | 'study' | 'urgent'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingPriority, setEditingPriority] = useState<MasterTodo['priority']>('normal');
  const [editingCategory, setEditingCategory] = useState<MasterTodo['category']>('work');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    onAddTodo(trimmed, priority, category);
    setNewTitle('');
  };

  const startEdit = (todo: MasterTodo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
    setEditingPriority(todo.priority);
    setEditingCategory(todo.category);
  };

  const saveEdit = (id: string) => {
    const trimmed = editingTitle.trim();
    if (trimmed && onEditTodo) {
      onEditTodo(id, trimmed, editingPriority, editingCategory);
    }
    setEditingId(null);
  };

  const filteredTodos = todos.filter((t) => {
    if (statusFilter === 'active' && t.completed) return false;
    if (statusFilter === 'completed' && !t.completed) return false;
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      return t.title.toLowerCase().includes(searchQuery.toLowerCase().trim());
    }
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  const todayIndex = daysInfo.findIndex((d) => d.isToday);
  const targetToday = todayIndex !== -1 ? todayIndex : 0;

  return (
    <section aria-labelledby="master-todo-heading" className="bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all luxury-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-gradient-to-tr from-slate-900 to-indigo-900 text-white rounded-xl shadow-md shadow-indigo-950/20">
            <CheckSquare className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 id="master-todo-heading" className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Master To-Do & Backlog
              </h2>
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">
                {activeCount} Pending
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Brain dump tasks, backlog items & quick assign to any day
            </p>
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => setStatusFilter('active')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'active'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('completed')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'completed'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Done ({completedCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All ({todos.length})
          </button>
        </div>
      </div>

      {/* Search & Category Filter Strip */}
      <div className="pt-3 pb-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search backlog tasks..."
            className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {(['all', 'work', 'personal', 'study', 'urgent'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize transition-all cursor-pointer whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Add Form */}
      <form onSubmit={handleAdd} className="pt-2 pb-3 border-b border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row items-stretch gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Capture an idea or task for this week..."
          className="flex-1 text-xs text-slate-900 dark:text-white bg-slate-50/80 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-slate-900 dark:focus:border-white rounded-xl px-3 py-2 transition-colors focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-2xs"
        />

        <div className="flex items-center gap-2">
          {/* Priority */}
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as MasterTodo['priority'])}
            className="text-xs font-semibold bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-slate-900 dark:text-white focus:outline-none cursor-pointer"
          >
            <option value="normal">Normal Priority</option>
            <option value="high">High Priority</option>
            <option value="urgent">🔥 Urgent</option>
          </select>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as MasterTodo['category'])}
            className="text-xs font-semibold bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-slate-900 dark:text-white focus:outline-none cursor-pointer"
          >
            <option value="work">💼 Work</option>
            <option value="personal">🌿 Personal</option>
            <option value="study">📖 Study</option>
          </select>

          <button
            type="submit"
            disabled={!newTitle.trim()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </form>

      {/* Task List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/60 mt-2 max-h-[360px] overflow-y-auto custom-scrollbar">
        {filteredTodos.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
            {searchQuery
              ? `No tasks matching "${searchQuery}"`
              : statusFilter === 'active'
              ? 'No active backlog tasks. All caught up!'
              : 'No tasks in this view.'}
          </div>
        ) : (
          filteredTodos.map((todo) => {
            const isUrgent = todo.priority === 'urgent';
            const isHigh = todo.priority === 'high';
            const isEditing = editingId === todo.id;

            return (
              <div
                key={todo.id}
                className="py-2.5 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/80 dark:hover:bg-slate-850/50 rounded-xl transition-colors group"
              >
                {isEditing ? (
                  <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="text-xs bg-white dark:bg-slate-900 border border-slate-900 dark:border-white rounded-lg px-2.5 py-1 text-slate-900 dark:text-white focus:outline-none flex-1"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(todo.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                    />
                    <div className="flex items-center gap-1.5">
                      <select
                        value={editingPriority}
                        onChange={(e) => setEditingPriority(e.target.value as MasterTodo['priority'])}
                        className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-900 dark:text-white"
                      >
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">🔥 Urgent</option>
                      </select>
                      <select
                        value={editingCategory}
                        onChange={(e) => setEditingCategory(e.target.value as MasterTodo['category'])}
                        className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-900 dark:text-white"
                      >
                        <option value="work">Work</option>
                        <option value="personal">Personal</option>
                        <option value="study">Study</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => saveEdit(todo.id)}
                        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer"
                        title="Save"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="p-1 text-slate-400 hover:bg-slate-200 rounded-lg cursor-pointer"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={todo.completed}
                        onClick={() => onToggleTodo(todo.id)}
                        className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                          todo.completed
                            ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-900 shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        {todo.completed && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>

                      <span
                        onClick={() => onToggleTodo(todo.id)}
                        className={`text-xs select-text cursor-pointer truncate ${
                          todo.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : isUrgent
                            ? 'font-bold text-rose-600 dark:text-rose-400'
                            : isHigh
                            ? 'font-bold text-slate-900 dark:text-white'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {todo.title}
                      </span>

                      {/* Priority / Category Tags */}
                      <div className="flex items-center gap-1 shrink-0">
                        {isUrgent && (
                          <span className="text-[9px] font-bold uppercase bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50 px-1.5 py-0.5 rounded-md font-mono">
                            Urgent
                          </span>
                        )}
                        {isHigh && (
                          <span className="text-[9px] font-bold uppercase bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 px-1.5 py-0.5 rounded-md font-mono">
                            High
                          </span>
                        )}
                        <span className="text-[9px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 px-1.5 py-0.5 rounded-md capitalize">
                          {todo.category}
                        </span>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => startEdit(todo)}
                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
                        title="Edit task"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onAssignToDay(todo, targetToday)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 px-2 py-1 rounded-lg transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xs"
                        title={`Send to ${daysInfo[targetToday]?.dayName || 'Today'}`}
                      >
                        <ArrowRight className="w-3 h-3 text-indigo-500" />
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
                        className="text-[11px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-1.5 py-1 cursor-pointer focus:outline-none"
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
                        className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer ml-1"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Batch Actions */}
      {completedCount > 0 && onClearCompletedTodos && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
          <span>{completedCount} backlog items marked as done</span>
          <button
            type="button"
            onClick={onClearCompletedTodos}
            className="inline-flex items-center gap-1 font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Clear Completed</span>
          </button>
        </div>
      )}
    </section>
  );
};
