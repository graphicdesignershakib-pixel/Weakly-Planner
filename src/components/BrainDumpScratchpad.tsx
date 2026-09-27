import React, { useState } from 'react';
import {
  Lightbulb,
  Plus,
  Trash2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';
import { ScratchNote, DayInfo } from '../types/planner';

interface BrainDumpScratchpadProps {
  notes: ScratchNote[];
  onAddNote: (content: string) => void;
  onDeleteNote: (id: string) => void;
  onTransferToDay: (noteId: string, content: string, dayIndex: number) => void;
  daysInfo: DayInfo[];
}

export const BrainDumpScratchpad: React.FC<BrainDumpScratchpadProps> = ({
  notes,
  onAddNote,
  onDeleteNote,
  onTransferToDay,
  daysInfo,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newText, setNewText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    onAddNote(newText.trim());
    setNewText('');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const todayIndex = daysInfo.findIndex((d) => d.isToday);
  const targetDayIdx = todayIndex !== -1 ? todayIndex : 0;

  return (
    <div className="bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] rounded-xl overflow-hidden shadow-xs transition-colors">
      {/* Header bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-3.5 sm:p-4 flex items-center justify-between cursor-pointer hover:bg-[#FAFAFA] dark:hover:bg-[#151518] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 rounded-lg">
            <Lightbulb className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-white">
                Brain Dump & Scratchpad
              </h3>
              {notes.length > 0 && (
                <span className="text-[10px] font-bold font-mono px-1.5 py-0.2 rounded-full bg-[#F4F4F5] dark:bg-[#27272A] text-[#71717A] dark:text-[#A1A1AA]">
                  {notes.length}
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
              Capture floating thoughts, phone notes, or quick ideas before organizing
            </p>
          </div>
        </div>

        <button
          type="button"
          className="p-1 text-[#71717A] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white rounded-lg cursor-pointer"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 pt-1 border-t border-[#F4F4F5] dark:border-[#27272A] space-y-3">
          {/* Quick Input Bar */}
          <form onSubmit={handleAdd} className="flex items-center gap-2">
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Dump a thought, link, or random idea... (Press Enter)"
              className="w-full text-xs text-[#111111] dark:text-white bg-[#F8F9FA] dark:bg-[#121214] border border-[#E5E7EB] dark:border-[#27272A] focus:border-[#111111] dark:focus:border-white rounded-lg px-3 py-2 outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!newText.trim()}
              className="inline-flex items-center gap-1 px-3 py-2 bg-[#111111] dark:bg-white text-white dark:text-[#111111] disabled:opacity-30 rounded-lg text-xs font-bold cursor-pointer shrink-0 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Capture</span>
            </button>
          </form>

          {/* Notes List */}
          {notes.length === 0 ? (
            <div className="text-center py-5 border border-dashed border-[#E5E7EB] dark:border-[#27272A] rounded-lg">
              <p className="text-xs text-[#A1A1AA] italic">
                Clean mind! No unorganized thoughts right now.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 bg-[#FAFAFA] dark:bg-[#121214] border border-[#E5E7EB] dark:border-[#27272A] rounded-xl flex flex-col justify-between group hover:border-[#D4D4D8] dark:hover:border-[#3F3F46] transition-all"
                >
                  <p className="text-xs text-[#111111] dark:text-zinc-100 break-words whitespace-pre-wrap leading-relaxed">
                    {note.content}
                  </p>

                  <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-[#F4F4F5] dark:border-[#27272A] text-[10px]">
                    <span className="text-[#A1A1AA] font-mono">
                      {note.createdAt}
                    </span>

                    <div className="flex items-center gap-1">
                      {/* Copy note */}
                      <button
                        type="button"
                        onClick={() => handleCopy(note.id, note.content)}
                        className="p-1 text-[#71717A] hover:text-[#111111] dark:hover:text-white rounded cursor-pointer"
                        title="Copy note"
                      >
                        {copiedId === note.id ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>

                      {/* Push to Today */}
                      <button
                        type="button"
                        onClick={() => onTransferToDay(note.id, note.content, targetDayIdx)}
                        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 rounded font-semibold hover:bg-amber-100 cursor-pointer"
                        title="Convert to Today's Task"
                      >
                        <span>To {daysInfo[targetDayIdx]?.dayAbbr || 'Today'}</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </button>

                      {/* Delete note */}
                      <button
                        type="button"
                        onClick={() => onDeleteNote(note.id)}
                        className="p-1 text-[#71717A] hover:text-rose-600 rounded cursor-pointer"
                        title="Delete note"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
