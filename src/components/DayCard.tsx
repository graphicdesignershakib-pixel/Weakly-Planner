import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  FileText,
  ChevronUp,
  ChevronDown,
  Star,
} from 'lucide-react';
import { DayPlan, Task, DayInfo } from '../types/planner';
import { CompletionRing } from './CompletionRing';
import { calculateDailyProgress } from '../utils/calculations';

interface DayCardProps {
  dayInfo: DayInfo;
  dayPlan?: DayPlan;
  isActive: boolean;
  onToggleTask: (dayIndex: number, taskId: string) => void;
  onAddTask: (dayIndex: number, title: string) => void;
  onEditTask: (dayIndex: number, taskId: string, newTitle: string) => void;
  onDeleteTask: (dayIndex: number, taskId: string) => void;
  onMoveTask: (dayIndex: number, fromIndex: number, direction: 'up' | 'down') => void;
  onTogglePriority: (dayIndex: number, taskId: string) => void;
  onUpdateNote: (dayIndex: number, note: string) => void;
}

export const DayCard: React.FC<DayCardProps> = ({
  dayInfo,
  dayPlan,
  isActive,
  onToggleTask,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onTogglePriority,
  onUpdateNote,
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [tempNote, setTempNote] = useState(dayPlan?.note || '');

  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const tasks = dayPlan?.tasks || [];
  const progress = calculateDailyProgress(dayPlan);

  useEffect(() => {
    setTempNote(dayPlan?.note || '');
  }, [dayPlan?.note]);

  useEffect(() => {
    if (editingTaskId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingTaskId]);

  const handleAddNewTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newTaskTitle.trim();
    if (!trimmed) return;
    onAddTask(dayInfo.dayIndex, trimmed);
    setNewTaskTitle('');
    inputRef.current?.focus();
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
  };

  const saveEdit = (taskId: string) => {
    const trimmed = editingTitle.trim();
    if (trimmed) {
      onEditTask(dayInfo.dayIndex, taskId, trimmed);
    }
    setEditingTaskId(null);
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingTitle('');
  };

  const handleSaveNote = () => {
    onUpdateNote(dayInfo.dayIndex, tempNote.trim());
    setIsEditingNote(false);
  };

  return (
    <div
      id={`day-card-${dayInfo.dayIndex}`}
      className={`day-card bg-white border rounded-lg flex flex-col justify-between transition-all duration-200 ${
        isActive
          ? 'border-[#111111] shadow-xs ring-1 ring-[#111111]/10'
          : 'border-[#E5E7EB] hover:border-[#D4D4D8]'
      }`}
    >
      {/* Card Header */}
      <div className="p-4 border-b border-[#F4F4F5] flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold tracking-tight text-[#111111]">
              {dayInfo.dayName}
            </h3>
            {dayInfo.isToday && (
              <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                Today
              </span>
            )}
          </div>
          <p className="text-xs text-[#71717A] tabular-nums mt-0.5">
            {dayInfo.formattedDate}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CompletionRing progress={progress} size={42} strokeWidth={3.5} />
        </div>
      </div>

      {/* Daily Note / Sub-goal strip */}
      <div className="px-4 py-2 bg-[#FAFAFA] border-b border-[#F4F4F5]">
        {isEditingNote ? (
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={tempNote}
              onChange={(e) => setTempNote(e.target.value)}
              placeholder="Daily focus note..."
              className="text-xs w-full bg-white border border-[#D4D4D8] rounded px-2 py-1 text-[#111111] focus:outline-none focus:border-[#111111]"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveNote();
                if (e.key === 'Escape') setIsEditingNote(false);
              }}
            />
            <button
              onClick={handleSaveNote}
              className="p-1 text-[#111111] hover:bg-[#E5E7EB] rounded"
              title="Save note"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsEditingNote(false)}
              className="p-1 text-[#71717A] hover:bg-[#E5E7EB] rounded"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => setIsEditingNote(true)}
            className="flex items-center justify-between text-xs text-[#71717A] hover:text-[#111111] cursor-pointer group py-0.5"
          >
            <span className="truncate italic">
              {dayPlan?.note ? dayPlan.note : 'Add daily focus note...'}
            </span>
            <FileText className="w-3 h-3 text-[#A1A1AA] group-hover:text-[#111111] shrink-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
      </div>

      {/* Task List Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5 min-h-[120px]">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center px-2">
              <p className="text-xs text-[#A1A1AA] font-normal">
                No tasks planned yet. Add your first task.
              </p>
            </div>
          ) : (
            tasks.map((task, index) => {
              const isEditing = editingTaskId === task.id;
              const isHighPriority = task.priority === 'high';

              return (
                <div
                  key={task.id}
                  className={`group flex items-start justify-between gap-1.5 p-1.5 rounded transition-colors ${
                    task.completed
                      ? 'bg-[#FAFAFA]'
                      : isHighPriority
                      ? 'bg-[#FEFCE8] border border-amber-200'
                      : 'hover:bg-[#F8F9FA]'
                  }`}
                >
                  {/* Checkbox and Title */}
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={task.completed}
                      onClick={() => onToggleTask(dayInfo.dayIndex, task.id)}
                      className={`mt-0.5 w-4 h-4 rounded-xs border flex items-center justify-center shrink-0 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] ${
                        task.completed
                          ? 'bg-[#111111] border-[#111111] text-white'
                          : 'bg-white border-[#D4D4D8] hover:border-[#71717A]'
                      }`}
                    >
                      {task.completed && (
                        <Check className="w-3 h-3 stroke-[3]" />
                      )}
                    </button>

                    {isEditing ? (
                      <div className="flex items-center gap-1 w-full">
                        <input
                          ref={editInputRef}
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="w-full text-xs text-[#111111] bg-white border border-[#111111] rounded px-1.5 py-0.5 focus:outline-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit(task.id);
                            if (e.key === 'Escape') cancelEdit();
                          }}
                        />
                        <button
                          onClick={() => saveEdit(task.id)}
                          className="p-1 text-[#111111] hover:bg-[#E5E7EB] rounded shrink-0 cursor-pointer"
                          title="Save"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1 text-[#71717A] hover:bg-[#E5E7EB] rounded shrink-0 cursor-pointer"
                          title="Cancel"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-1.5 min-w-0 flex-1">
                        <span
                          onClick={() => onToggleTask(dayInfo.dayIndex, task.id)}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            startEditing(task);
                          }}
                          className={`text-xs break-words leading-relaxed select-text cursor-pointer hover:opacity-80 transition-opacity ${
                            task.completed
                              ? 'line-through text-[#8E8E93]'
                              : isHighPriority
                              ? 'text-[#111111] font-semibold'
                              : 'text-[#111111]'
                          }`}
                          title="Click to toggle, double-click to edit"
                        >
                          {task.title}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions (visible on hover / active) */}
                  {!isEditing && (
                    <div className="flex items-center gap-0.5 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      {/* Priority toggle */}
                      <button
                        type="button"
                        onClick={() => onTogglePriority(dayInfo.dayIndex, task.id)}
                        className={`p-1 rounded transition-colors cursor-pointer ${
                          isHighPriority
                            ? 'text-amber-600 hover:text-amber-700'
                            : 'text-[#A1A1AA] hover:text-amber-600'
                        }`}
                        title={isHighPriority ? 'High priority' : 'Mark high priority'}
                        aria-label="Toggle priority"
                      >
                        <Star className={`w-3 h-3 ${isHighPriority ? 'fill-current' : ''}`} />
                      </button>

                      {/* Move Up */}
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => onMoveTask(dayInfo.dayIndex, index, 'up')}
                          className="p-1 text-[#A1A1AA] hover:text-[#111111] hover:bg-[#E5E7EB] rounded cursor-pointer"
                          title="Move up"
                          aria-label="Move task up"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                      )}

                      {/* Move Down */}
                      {index < tasks.length - 1 && (
                        <button
                          type="button"
                          onClick={() => onMoveTask(dayInfo.dayIndex, index, 'down')}
                          className="p-1 text-[#A1A1AA] hover:text-[#111111] hover:bg-[#E5E7EB] rounded cursor-pointer"
                          title="Move down"
                          aria-label="Move task down"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      )}

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => startEditing(task)}
                        className="p-1 text-[#71717A] hover:text-[#111111] hover:bg-[#E5E7EB] rounded transition-colors cursor-pointer"
                        title="Edit task"
                        aria-label="Edit task"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => onDeleteTask(dayInfo.dayIndex, task.id)}
                        className="p-1 text-[#71717A] hover:text-[#DC2626] hover:bg-[#FEE2E2] rounded transition-colors cursor-pointer"
                        title="Delete task"
                        aria-label="Delete task"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Add Task Input */}
        <form onSubmit={handleAddNewTask} className="mt-4 pt-3 border-t border-[#F4F4F5]">
          <div className="flex items-center gap-1.5">
            <input
              id={`task-input-${dayInfo.dayIndex}`}
              ref={inputRef}
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a task..."
              className="w-full text-xs text-[#111111] bg-[#F8F9FA] hover:bg-white focus:bg-white border border-[#E5E7EB] focus:border-[#111111] rounded px-2.5 py-1.5 transition-colors focus:outline-none placeholder:text-[#A1A1AA]"
            />
            <button
              type="submit"
              disabled={!newTaskTitle.trim()}
              className="p-1.5 bg-[#111111] text-white disabled:bg-[#E5E7EB] disabled:text-[#A1A1AA] hover:bg-[#27272A] rounded transition-colors shrink-0 cursor-pointer"
              title="Add task (Enter)"
              aria-label="Add task"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
