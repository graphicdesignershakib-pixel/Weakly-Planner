import React, { useState } from 'react';
import { Sparkles, RefreshCw, Quote, Heart, BookmarkCheck } from 'lucide-react';

interface QuranVerse {
  arabic: string;
  translation: string;
  surah: string;
  reflection: string;
}

const VERSES: QuranVerse[] = [
  {
    arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'For indeed, with hardship comes ease. Indeed, with hardship comes ease.',
    surah: 'Surah Ash-Sharh (94:5-6)',
    reflection: 'No difficulty is permanent. Every single challenge carries divine relief alongside it.',
  },
  {
    arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
    translation: 'Allah does not burden a soul beyond that it can bear.',
    surah: 'Surah Al-Baqarah (2:286)',
    reflection: 'You have the resilience and strength within you to handle whatever life puts in front of you.',
  },
  {
    arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    translation: 'Unquestionably, by the remembrance of Allah hearts find peace.',
    surah: 'Surah Ar-Ra’d (13:28)',
    reflection: 'Whenever overwhelmed by work or worldly anxiety, pause and reconnect for true serenity.',
  },
  {
    arabic: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
    translation: 'And whoever relies upon Allah — then He is sufficient for him.',
    surah: 'Surah At-Talaq (65:3)',
    reflection: 'Do your sincere part with maximum discipline, then place your absolute trust in the Almighty.',
  },
  {
    arabic: 'وَأَن لَّيْسَ لِلْإِنسَانِ إِلَّا مَا سَعَىٰ',
    translation: 'And that there is not for man except that for which he strives.',
    surah: 'Surah An-Najm (53:39)',
    reflection: 'Your sincere effort, consistent work, and focus are never lost.',
  },
  {
    arabic: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
    translation: 'If you are grateful, I will surely increase your favor.',
    surah: 'Surah Ibrahim (14:7)',
    reflection: 'Gratitude multiplies blessing, focus, and inner satisfaction in daily life.',
  },
  {
    arabic: 'وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا',
    translation: 'And those who strive for Us — We will surely guide them to Our ways.',
    surah: 'Surah Al-’Ankabut (29:69)',
    reflection: 'Dedication and sincere effort always open doors you never expected.',
  },
];

export const DailyVerseCard: React.FC = () => {
  // Deterministic verse based on day of month + year to be consistent each day, but allow cycling
  const initialIndex = new Date().getDate() % VERSES.length;
  const [index, setIndex] = useState(initialIndex);
  const [isLiked, setIsLiked] = useState(false);

  const current = VERSES[index];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % VERSES.length);
  };

  return (
    <div className="bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group luxury-card">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800/60 mb-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white rounded-xl shadow-md shadow-purple-500/20">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Spiritual Wisdom · Verse of the Day
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Daily Anchor for Peace & Purpose
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsLiked(!isLiked)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isLiked
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/40 text-rose-600'
                : 'border-[#E5E7EB] dark:border-[#27272A] text-[#71717A] dark:text-[#A1A1AA] hover:text-rose-600'
            }`}
            title="Save to heart"
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#71717A] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white border border-[#E5E7EB] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#121214] hover:bg-white dark:hover:bg-[#202024] rounded-lg transition-colors cursor-pointer"
            title="Read next inspiring verse"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Next Verse</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Arabic text with elegant font */}
        <div className="flex-1 space-y-2">
          <p
            dir="rtl"
            className="text-lg sm:text-xl font-serif text-right text-purple-950 dark:text-purple-200 font-semibold tracking-wide leading-relaxed py-1"
          >
            {current.arabic}
          </p>

          <p className="text-xs sm:text-sm font-medium text-[#111111] dark:text-zinc-100 leading-snug">
            “{current.translation}”
          </p>
        </div>

        {/* Reference & Reflection badge */}
        <div className="md:w-64 shrink-0 bg-[#FAFAFA] dark:bg-[#121214] border border-[#E5E7EB] dark:border-[#27272A] rounded-lg p-3 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-300 font-bold text-xs mb-1">
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>{current.surah}</span>
          </div>
          <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] italic leading-relaxed">
            {current.reflection}
          </p>
        </div>
      </div>
    </div>
  );
};
