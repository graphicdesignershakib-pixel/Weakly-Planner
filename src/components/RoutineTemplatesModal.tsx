import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Palette,
  BookOpen,
  Dumbbell,
  Briefcase,
  Check,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { RoutineTemplate } from '../types/wellness';
import { DayInfo } from '../types/planner';
import { fireConfetti } from '../utils/confetti';
import { useLanguage } from '../context/LanguageContext';

interface RoutineTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  daysInfo: DayInfo[];
  activeDayIndex: number | null;
  onApplyTemplate: (
    dayIndex: number,
    tasks: Array<{ title: string; time?: string; priority?: 'high' | 'normal' }>
  ) => void;
}

const ROUTINE_TEMPLATES: RoutineTemplate[] = [
  {
    id: 'designer',
    title: 'গ্রাফিক ডিজাইনার ও ফ্রিল্যান্সার রুটিন',
    titleEn: 'Graphic Designer & Freelancer Routine',
    icon: '🎨',
    badge: 'Creative Flow',
    description: 'ক্লায়েন্ট কাজ, পোর্টফোলিও তৈরি এবং ডিজাইনিংয়ে গভীর ফোকাস ধরে রাখার জন্য সেরা রুটিন।',
    descriptionEn: 'Tailored for creative sprints, client deliverables, and portfolio growth.',
    tasks: [
      { title: 'ক্লায়েন্ট মেসেজ ও ইনবক্স রিভিউ', titleEn: 'Client inbox & message review', time: '09:00 AM', priority: 'normal' },
      { title: 'প্রধান ক্লায়েন্ট ডিজাইন প্রজেক্ট (Deep Work সেশন)', titleEn: 'Lead client design delivery (Deep Work)', time: '10:00 AM', priority: 'high' },
      { title: 'নতুন ডিজাইন ট্রেন্ড দেখা ও স্কিল প্র্যাকটিস', titleEn: 'Design trend study & skill practice', time: '02:30 PM', priority: 'normal' },
      { title: 'সোশ্যাল মিডিয়া ও পোর্টফোলিও আপডেট', titleEn: 'Social showcase & portfolio update', time: '04:30 PM', priority: 'normal' },
      { title: 'ইনভয়েস চেক ও আগামীকালের খসড়া তৈরি', titleEn: 'Invoice check & draft tomorrow schedule', time: '06:30 PM', priority: 'normal' },
    ],
  },
  {
    id: 'study',
    title: 'স্টুডেন্ট ও পড়াশোনা রুটিন',
    titleEn: 'Student Study & Exam Focus',
    icon: '📚',
    badge: 'Exam Mastery',
    description: 'পরীক্ষার প্রস্তুতি, কনসেপ্ট ক্লিয়ার করা এবং নিয়মিত রিভিশনের জন্য তৈরি।',
    descriptionEn: 'Structured spaced repetition, difficult topics, and practice questions.',
    tasks: [
      { title: 'সকালের রিভিশন ও ফর্মুলা রিকেপ', titleEn: 'Morning formula & concept review', time: '08:00 AM', priority: 'high' },
      { title: 'সবচেয়ে কঠিন বিষয়ের পড়া (Deep Study)', titleEn: 'Tackle the hardest subject chapter', time: '09:30 AM', priority: 'high' },
      { title: 'বিগত বছরের প্রশ্ন ও ম্যাথ সলভ', titleEn: 'Past paper practice & problem solving', time: '03:00 PM', priority: 'normal' },
      { title: 'অ্যাসাইনমেন্ট বা হোমওয়ার্ক সম্পন্ন করা', titleEn: 'Complete pending assignments', time: '06:00 PM', priority: 'normal' },
      { title: 'দিনের সারাংশ নোট ও আগামীকালের সিলেবাস দেখা', titleEn: 'Active recall summary & tomorrow plan', time: '09:30 PM', priority: 'normal' },
    ],
  },
  {
    id: 'fitness',
    title: 'ফিটনেস, স্বাস্থ্য ও সুশৃঙ্খল রুটিন',
    titleEn: 'Fitness & Healthy Lifestyle',
    icon: '🏃',
    badge: 'Peak Energy',
    description: 'শরীর সুস্থ রাখা, সঠিক সময়ে খাবার খাওয়া এবং এনার্জি লেভেল তুঙ্গে রাখার রুটিন।',
    descriptionEn: 'Daily exercise, balanced nutrition, hydration, and restorative sleep.',
    tasks: [
      { title: '১ গ্লাস পানি পান ও ২০ মিনিট মর্নিং ওয়াক/জগিং', titleEn: 'Hydrate & 20m morning walk/jog', time: '06:30 AM', priority: 'high' },
      { title: 'পুষ্টিকর প্রোটিন সমৃদ্ধ নাস্তা গ্রহণ', titleEn: 'Nutritious balanced breakfast', time: '08:00 AM', priority: 'normal' },
      { title: 'কাজের মাঝে ১ লিটার পানি সম্পন্ন ও স্ট্রেচিং', titleEn: 'Midday hydration & desk stretching', time: '12:00 PM', priority: 'normal' },
      { title: '১ ঘণ্টা জিম বা হোম ওয়ার্কআউট সেশন', titleEn: '1-Hour gym / home workout session', time: '05:30 PM', priority: 'high' },
      { title: 'ফোন দূরে রেখে রাতের আরামদায়ক ঘুম', titleEn: 'Screen-off bedtime & 8hr restorative sleep', time: '10:30 PM', priority: 'high' },
    ],
  },
  {
    id: 'executive',
    title: 'প্রোডাক্টিভ এক্সিকিউটিভ ও বিজনেস রুটিন',
    titleEn: 'High-Performance Executive',
    icon: '💼',
    badge: 'Leadership',
    description: 'উচ্চ পর্যায়ের সিদ্ধান্ত গ্রহণ, অগ্রাধিকার নির্ধারণ এবং সর্বোচ্চ আউটপুটের জন্য।',
    descriptionEn: 'Ruthless prioritization, team sync, and uninterrupted strategic blocks.',
    tasks: [
      { title: 'দিনের প্রধান ৩টি অপরিবর্তনীয় প্রায়োরিটি ঠিক করা', titleEn: 'Define top 3 non-negotiable priorities', time: '08:30 AM', priority: 'high' },
      { title: 'টিম স্ট্যান্ডআপ ও দ্রুত প্রজেক্ট আপডেট', titleEn: 'Team alignment & status sync', time: '09:30 AM', priority: 'normal' },
      { title: '৯৯% মনোযোগে স্ট্র্যাটেজিক কাজ (Uninterrupted Deep Work)', titleEn: 'High-leverage strategic work block', time: '10:30 AM', priority: 'high' },
      { title: 'পার্টনার ও ক্লায়েন্ট ফলো-আপ', titleEn: 'Partnership & client growth calls', time: '02:30 PM', priority: 'normal' },
      { title: 'দিনের অর্জন রিভিউ ও ইনবক্স জিরো', titleEn: 'Day closure, win review & inbox zero', time: '05:30 PM', priority: 'normal' },
    ],
  },
];

export const RoutineTemplatesModal: React.FC<RoutineTemplatesModalProps> = ({
  isOpen,
  onClose,
  daysInfo,
  activeDayIndex,
  onApplyTemplate,
}) => {
  const { isBn } = useLanguage();
  const defaultDay = activeDayIndex !== null ? activeDayIndex : (daysInfo.findIndex((d) => d.isToday) !== -1 ? daysInfo.findIndex((d) => d.isToday) : 0);
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(defaultDay);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('designer');

  if (!isOpen) return null;

  const currentTemplate = ROUTINE_TEMPLATES.find((t) => t.id === selectedTemplateId) || ROUTINE_TEMPLATES[0];

  const handleApply = () => {
    const tasksToApply = currentTemplate.tasks.map((t) => ({
      title: isBn ? t.title : t.titleEn,
      time: t.time,
      priority: t.priority,
    }));

    onApplyTemplate(selectedDayIdx, tasksToApply);
    fireConfetti();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-[#18181B] text-slate-900 dark:text-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-zinc-800 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-gradient-to-tr from-amber-500 to-indigo-600 text-white rounded-2xl shadow-xs">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-black">
                {isBn ? '১-ক্লিকে রেডিমেড ডেইলি রুটিন' : '1-Click Daily Routine Presets'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isBn
                  ? 'আপনার প্রফেশন অনুযায়ী তৈরি আদর্শ দিনের কাজের তালিকা'
                  : 'Pre-built high performance routine structures for your day'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* Day Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              <span>{isBn ? 'কোন দিনে যোগ করবেন?' : 'Apply to which day?'}</span>
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {daysInfo.map((d) => (
                <button
                  key={d.dayIndex}
                  type="button"
                  onClick={() => setSelectedDayIdx(d.dayIndex)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedDayIdx === d.dayIndex
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {d.dayName} {d.isToday ? (isBn ? '(আজ)' : '(Today)') : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Routine Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ROUTINE_TEMPLATES.map((tpl) => {
              const isSelected = selectedTemplateId === tpl.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplateId(tpl.id)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-xs'
                      : 'border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-slate-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl p-1.5 rounded-xl bg-white dark:bg-zinc-800 shadow-2xs">
                        {tpl.icon}
                      </span>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white">
                          {isBn ? tpl.title : tpl.titleEn}
                        </h4>
                        <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                          {tpl.badge}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {isBn ? tpl.description : tpl.descriptionEn}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Preview Tasks in Selected Template */}
          <div className="bg-slate-50 dark:bg-zinc-900/60 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800">
            <h5 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>{isBn ? 'এই রুটিনে যা যা যুক্ত হবে:' : 'Tasks included in this routine:'}</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-mono">
                ({currentTemplate.tasks.length} {isBn ? 'টি টাস্ক' : 'tasks'})
              </span>
            </h5>

            <div className="space-y-1.5">
              {currentTemplate.tasks.map((task, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-xl bg-white dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/60 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-zinc-700 text-slate-500 dark:text-slate-300 flex items-center justify-center text-[10px] font-mono font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {isBn ? task.title : task.titleEn}
                    </span>
                  </div>

                  {task.time && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 shrink-0">
                      {task.time}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
          <span className="text-xs text-slate-500 font-medium">
            {isBn ? 'লক্ষ্য অনুযায়ী সব টাস্ক সাজানো হবে' : 'Customizable anytime after loading'}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 cursor-pointer"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-black shadow-md shadow-indigo-600/25 transition-all cursor-pointer active:scale-95"
            >
              <span>{isBn ? 'রুটিন লোড করুন' : 'Load Routine'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
