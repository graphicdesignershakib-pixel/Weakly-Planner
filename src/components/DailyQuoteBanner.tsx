import React, { useState } from 'react';
import { Quote, Sparkles, RefreshCw, Copy, Check } from 'lucide-react';

const QUOTES = [
  {
    quote: "ছোট ছোট অভ্যাসই একদিন পাহাড়সম সাফল্য তৈরি করে।",
    author: "জেমস ক্লিয়ার (Atomic Habits)",
    category: "অভ্যাস",
  },
  {
    quote: "আজকের অলসতা আগামীকালের জন্য বোঝা হয়ে দাঁড়াবে। প্রতিদিন অল্প অল্প করে এগিয়ে যান।",
    author: "জীবনবোধ",
    category: "অধ্যবসায়",
  },
  {
    quote: "কাজের শুরুটাই হলো কাজের অর্ধেক সম্পন্ন করার সমান।",
    author: "এরিস্টটল",
    category: "শুরু",
  },
  {
    quote: "সময়কে শাসন করুন, নয়তো সময় আপনাকে নিয়ন্ত্রণ করবে।",
    author: "প্রোডাক্টিভিটি টিপ",
    category: "সময় ব্যবস্থাপনা",
  },
  {
    quote: "প্রতিদিনের ছোট শৃঙ্খলা দীর্ঘমেয়াদী মুক্তির চাবিকাঠি।",
    author: "সেলফ-ডিসিপ্লিন",
    category: "শৃঙ্খলা",
  },
  {
    quote: "যে ব্যক্তি নিজের মনকে নিয়ন্ত্রণ করতে পেরেছে, সে দুনিয়ার যেকোনো বিজয় অর্জন করতে পারে।",
    author: "জ্ঞানগর্ভ বাণী",
    category: "মনোবল",
  },
];

export const DailyQuoteBanner: React.FC = () => {
  const [index, setIndex] = useState(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return dayOfYear % QUOTES.length;
  });

  const [copied, setCopied] = useState(false);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % QUOTES.length);
  };

  const handleCopy = () => {
    const current = QUOTES[index];
    navigator.clipboard.writeText(`"${current.quote}" — ${current.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const current = QUOTES[index];

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-indigo-500/10 dark:from-amber-950/20 dark:via-sky-950/20 dark:to-indigo-950/20 rounded-2xl p-3.5 sm:p-4 border border-amber-200/50 dark:border-amber-900/30 flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-start gap-3 flex-1 min-w-[240px]">
        <span className="p-2 bg-amber-500 text-white rounded-xl shadow-xs shrink-0 mt-0.5">
          <Quote className="w-3.5 h-3.5" />
        </span>
        <div>
          <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 italic leading-relaxed">
            "{current.quote}"
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
              — {current.author}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              • {current.category}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 ml-auto">
        <button
          type="button"
          onClick={handleCopy}
          className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors shadow-2xs"
          title="কপি করুন"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors shadow-2xs"
          title="নতুন বাণী দেখুন"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
