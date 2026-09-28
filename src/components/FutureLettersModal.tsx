import React, { useState, useEffect } from 'react';
import {
  Mail,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Calendar,
  X,
  Sparkles,
  Send,
  Eye,
  Clock,
} from 'lucide-react';
import { FutureLetter } from '../types/planner';
import { fireConfetti } from '../utils/confetti';
import { playLevelUpSound } from '../utils/soundEffects';

interface FutureLettersModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

export const FutureLettersModal: React.FC<FutureLettersModalProps> = ({
  isOpen,
  onClose,
  userName = 'Shakib',
}) => {
  const [letters, setLetters] = useState<FutureLetter[]>(() => {
    try {
      const saved = localStorage.getItem('weekly_planner_future_letters');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default welcome letter
    return [
      {
        id: 'fl-sample-1',
        createdDate: '2026-09-28',
        unlockDate: '2026-10-28',
        title: 'Dear Future Self: Keep your standards high',
        message: 'Remember why you started this journey. The daily small steps compound into monumental achievements. Believe in yourself and stay disciplined!',
        authorName: userName,
        moodTag: '⚡ Unstoppable',
        isOpened: false,
      },
    ];
  });

  const [activeLetter, setActiveLetter] = useState<FutureLetter | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');
  const [unlockPreset, setUnlockPreset] = useState<'1week' | '1month' | '3months' | 'custom'>('1month');
  const [customDate, setCustomDate] = useState<string>('');
  const [moodTag, setMoodTag] = useState<string>('🎯 Focused');

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    try {
      localStorage.setItem('weekly_planner_future_letters', JSON.stringify(letters));
    } catch {
      // ignore
    }
  }, [letters]);

  if (!isOpen) return null;

  const calculateUnlockDate = (): string => {
    const d = new Date();
    if (unlockPreset === '1week') d.setDate(d.getDate() + 7);
    else if (unlockPreset === '1month') d.setMonth(d.getMonth() + 1);
    else if (unlockPreset === '3months') d.setMonth(d.getMonth() + 3);
    else if (unlockPreset === 'custom' && customDate) return customDate;
    else d.setMonth(d.getMonth() + 1);
    return d.toISOString().split('T')[0];
  };

  const handleCreateLetter = () => {
    if (!newTitle.trim() || !newMessage.trim()) return;

    const newLetter: FutureLetter = {
      id: `fl-${Date.now().toString(36)}`,
      createdDate: todayStr,
      unlockDate: calculateUnlockDate(),
      title: newTitle.trim(),
      message: newMessage.trim(),
      authorName: userName,
      moodTag,
      isOpened: false,
    };

    setLetters([newLetter, ...letters]);
    setIsCreating(false);
    setNewTitle('');
    setNewMessage('');
    fireConfetti();
  };

  const handleDeleteLetter = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLetters(letters.filter((l) => l.id !== id));
    if (activeLetter?.id === id) setActiveLetter(null);
  };

  const handleOpenLetter = (letter: FutureLetter) => {
    const isUnlocked = todayStr >= letter.unlockDate;
    if (isUnlocked) {
      if (!letter.isOpened) {
        playLevelUpSound();
        fireConfetti();
        const updated = letters.map((l) => (l.id === letter.id ? { ...l, isOpened: true } : l));
        setLetters(updated);
      }
      setActiveLetter({ ...letter, isOpened: true });
    } else {
      setActiveLetter(letter);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E5E7EB] dark:border-[#27272A] flex items-center justify-between bg-gradient-to-r from-purple-500/10 via-transparent to-pink-500/10">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400">
              <Mail className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-[#111111] dark:text-white flex items-center gap-2">
                Time Capsule: Letters to Future Self
              </h2>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
                Encourage, inspire, or challenge your future self
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#71717A] hover:text-[#111111] dark:hover:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar flex-1">
          {/* Creating View */}
          {isCreating ? (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA]">
                  Seal a New Letter into the Future
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-xs text-rose-500 hover:underline"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#71717A] dark:text-[#A1A1AA] block mb-1">
                  Subject / Envelope Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Read this when you feel stuck or celebrate 10k!"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E7EB] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#121214] text-[#111111] dark:text-white focus:outline-hidden focus:ring-1 focus:ring-purple-500 font-medium"
                />
              </div>

              {/* Unlock Timing Selector */}
              <div>
                <label className="text-xs font-semibold text-[#71717A] dark:text-[#A1A1AA] block mb-1.5">
                  When should this letter unlock?
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: '1week', label: 'In 1 Week' },
                    { id: '1month', label: 'In 1 Month' },
                    { id: '3months', label: 'In 3 Months' },
                    { id: 'custom', label: 'Custom Date' },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setUnlockPreset(preset.id as any)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        unlockPreset === preset.id
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300'
                          : 'border-[#E5E7EB] dark:border-[#27272A] text-[#71717A] hover:bg-[#F4F4F5] dark:hover:bg-[#202024]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                {unlockPreset === 'custom' && (
                  <input
                    type="date"
                    min={todayStr}
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="mt-2 w-full px-3 py-2 text-xs rounded-lg border border-[#E5E7EB] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#121214] text-[#111111] dark:text-white"
                  />
                )}
              </div>

              {/* Message Body */}
              <div>
                <label className="text-xs font-semibold text-[#71717A] dark:text-[#A1A1AA] block mb-1">
                  Letter to Future Self
                </label>
                <textarea
                  rows={6}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Write from the heart. What are your aspirations right now? What promise do you want to keep?..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E7EB] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#121214] text-[#111111] dark:text-white focus:outline-hidden focus:ring-1 focus:ring-purple-500 leading-relaxed resize-none"
                />
              </div>

              {/* Mood selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#71717A]">Mood / Vibe:</span>
                {['⚡ Unstoppable', '🎯 Focused', '🌱 Grateful', '💪 Resilient'].map((vibe) => (
                  <button
                    key={vibe}
                    type="button"
                    onClick={() => setMoodTag(vibe)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                      moodTag === vibe
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-600'
                        : 'border-[#E5E7EB] dark:border-[#27272A] text-[#71717A]'
                    }`}
                  >
                    {vibe}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleCreateLetter}
                disabled={!newTitle.trim() || !newMessage.trim()}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Seal Letter & Lock until {calculateUnlockDate()}</span>
              </button>
            </div>
          ) : activeLetter ? (
            /* Reading Active Letter View */
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#27272A] pb-3">
                <button
                  type="button"
                  onClick={() => setActiveLetter(null)}
                  className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                >
                  ← Back to Capsule List
                </button>
                <span className="text-[10px] text-[#71717A]">
                  Written on {activeLetter.createdDate}
                </span>
              </div>

              {todayStr >= activeLetter.unlockDate ? (
                /* Unlocked Letter View */
                <div className="bg-[#FAF5FF] dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 rounded-2xl p-6 relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                      {activeLetter.moodTag || '💌 Letter'}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <Unlock className="w-3 h-3" /> Unlocked
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#111111] dark:text-white mb-4">
                    {activeLetter.title}
                  </h3>

                  <div className="text-xs text-[#27272A] dark:text-zinc-200 leading-relaxed whitespace-pre-wrap font-serif">
                    {activeLetter.message}
                  </div>

                  <div className="mt-6 pt-4 border-t border-purple-200 dark:border-purple-900/40 flex items-center justify-between text-xs text-[#71717A]">
                    <span>With love, from the past you ({activeLetter.authorName})</span>
                    <Sparkles className="w-4 h-4 text-purple-500" />
                  </div>
                </div>
              ) : (
                /* Locked Letter View */
                <div className="text-center py-10 bg-[#FAFAFA] dark:bg-[#121214] border border-[#E5E7EB] dark:border-[#27272A] rounded-2xl p-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-[#111111] dark:text-white">
                    "{activeLetter.title}"
                  </h4>
                  <p className="text-xs text-[#71717A] max-w-sm mx-auto">
                    This capsule is locked tight. It will safely open for you on{' '}
                    <strong className="text-purple-600 dark:text-purple-400">
                      {activeLetter.unlockDate}
                    </strong>
                    . Patience breeds greatness!
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Capsule List View */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider">
                  Your Time Capsules ({letters.length})
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreating(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Write to Future Me</span>
                </button>
              </div>

              {letters.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-[#E5E7EB] dark:border-[#27272A] rounded-2xl">
                  <Mail className="w-8 h-8 text-[#A1A1AA] mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-[#71717A]">No future letters sealed yet.</p>
                  <button
                    type="button"
                    onClick={() => setIsCreating(true)}
                    className="mt-3 text-xs font-bold text-purple-600 hover:underline cursor-pointer"
                  >
                    + Write your first future note
                  </button>
                </div>
              ) : (
                <div className="grid gap-3">
                  {letters.map((letter) => {
                    const isUnlocked = todayStr >= letter.unlockDate;
                    return (
                      <div
                        key={letter.id}
                        onClick={() => handleOpenLetter(letter)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                          isUnlocked
                            ? 'bg-[#FAF5FF] dark:bg-purple-950/20 border-purple-200 dark:border-purple-800/40 hover:border-purple-400'
                            : 'bg-white dark:bg-[#18181B] border-[#E5E7EB] dark:border-[#27272A] hover:border-amber-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`p-2 rounded-lg ${
                              isUnlocked
                                ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300'
                                : 'bg-[#F4F4F5] dark:bg-[#202024] text-[#71717A]'
                            }`}
                          >
                            {isUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-[#111111] dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                {letter.title}
                              </h4>
                              {letter.moodTag && (
                                <span className="text-[10px] font-semibold text-[#71717A]">
                                  {letter.moodTag}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-[#A1A1AA] mt-0.5">
                              <span>Created: {letter.createdDate}</span>
                              <span>·</span>
                              <span className={isUnlocked ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>
                                {isUnlocked ? '✓ Ready to read!' : `Unlocks on ${letter.unlockDate}`}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            {isUnlocked ? 'Read letter →' : 'View seal'}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteLetter(letter.id, e)}
                            className="p-1 text-[#A1A1AA] hover:text-rose-500 rounded transition-colors"
                            title="Delete letter"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
