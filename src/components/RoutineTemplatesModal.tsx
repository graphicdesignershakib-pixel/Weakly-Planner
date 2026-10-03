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
    id: 'shakib_internship',
    title: 'শাকিবের রুটিন: ইন্টার্নশিপ দিন (রবি · মঙ্গল · বৃহস্পতি)',
    titleEn: "Shakib: Internship Day Routine (Sun, Tue, Thu)",
    icon: '💼',
    badge: '10am-3pm Office',
    description: '১০:০০ AM – ৩:০০ PM ইন্টার্নশিপ, যাতায়াতে Chinese ও English, আসরের পর ৫০ মিনিট Adobe Stock / Light Learning।',
    descriptionEn: 'Structured around 10am-3pm internship with commute habits and evening stock sprint.',
    tasks: [
      { title: 'Fajr — অজু ও নামাজ (নামাজের পর ফোন ছাড়া বিশ্রাম)', titleEn: 'Fajr prayer & calm morning', time: '05:00 AM', priority: 'high' },
      { title: 'চূড়ান্ত ওঠা: পানি, মুখ ধোয়া ও আজকের ৩টি কাজ লেখা', titleEn: 'Wake up, hydrate, write 3 tasks', time: '08:00 AM', priority: 'high' },
      { title: 'নাস্তা, তৈরি হওয়া ও আগের রাতে গোছানো ব্যাগ নেওয়া', titleEn: 'Breakfast & prep', time: '08:30 AM', priority: 'normal' },
      { title: 'যাতায়াত + Chinese ১৫ মিনিট (Audio/Flashcard)', titleEn: 'Commute + 15m Chinese audio', time: '09:00 AM', priority: 'high' },
      { title: 'Internship (১০:০০ AM – ১:১৫ PM)', titleEn: 'Internship Work Session 1', time: '10:00 AM', priority: 'high' },
      { title: 'Johor — বিরতিতে নামাজ + দুপুরের খাবার', titleEn: 'Dhuhr prayer & lunch break', time: '01:15 PM', priority: 'high' },
      { title: 'Internship (১:৪৫ PM – ৩:০০ PM)', titleEn: 'Internship Work Session 2', time: '01:45 PM', priority: 'high' },
      { title: 'ফেরা + English ১৫–২০ মিনিট (Podcast/Audio)', titleEn: 'Return commute + 15m English podcast', time: '03:00 PM', priority: 'high' },
      { title: 'বিশ্রাম + হালকা নাস্তা (সর্বোচ্চ ৩০ মি. ফোন)', titleEn: 'Post-office rest & refreshment', time: '04:00 PM', priority: 'normal' },
      { title: 'Asr — নামাজ', titleEn: 'Asr prayer', time: '04:45 PM', priority: 'high' },
      { title: 'Adobe Stock Sprint / Light Learning (৫০ মিনিট)', titleEn: 'Adobe Stock / Learning sprint (50m)', time: '05:00 PM', priority: 'high' },
      { title: 'Maghrib — নামাজ', titleEn: 'Maghrib prayer', time: '06:00 PM', priority: 'high' },
      { title: 'হাঁটা (১৫-২০ মিনিট)', titleEn: 'Evening 15m walk', time: '06:15 PM', priority: 'normal' },
      { title: 'ফ্রি সময় / পরিবার / Entertainment (সীমার মধ্যে)', titleEn: 'Family / rest time', time: '06:45 PM', priority: 'normal' },
      { title: 'Isha — নামাজ', titleEn: 'Isha prayer', time: '08:00 PM', priority: 'high' },
      { title: 'রাতের খাবার + পরিবারের সাথে আড্ডা (ফোন নয়)', titleEn: 'Dinner & family bonding', time: '08:15 PM', priority: 'normal' },
      { title: 'Reading — ৫ পৃষ্ঠা বই পড়া', titleEn: 'Reading 5 book pages', time: '09:15 PM', priority: 'high' },
      { title: 'Wind-down: ফোন চার্জে দূরে, কালকের প্রস্তুতি, অজু', titleEn: 'Wind-down & charge phone away', time: '10:30 PM', priority: 'high' },
      { title: 'ঘুম (১১:০০ PM)', titleEn: 'Sleep by 11:00 PM', time: '11:00 PM', priority: 'high' },
    ],
  },
  {
    id: 'shakib_non_internship',
    title: 'শাকিবের রুটিন: নন-ইন্টার্নশিপ দিন (সোম · বুধ · শুক্র · শনি)',
    titleEn: "Shakib: Deep Work Routine (Mon, Wed, Fri, Sat)",
    icon: '⚡',
    badge: 'Deep Work Flow',
    description: 'সকালে ফ্রেশ মাথায় Portfolio / New Skill / Adobe Stock উৎপাদন, বিকেলে বিশ্রাম ও নিয়মিত অভ্যাস।',
    descriptionEn: 'Deep work blocks in the morning for portfolio, new skills, and stock creation.',
    tasks: [
      { title: 'Fajr — অজু ও নামাজ', titleEn: 'Fajr prayer & morning reset', time: '05:00 AM', priority: 'high' },
      { title: 'চূড়ান্ত ওঠা: পানি, মুখ ধোয়া, জানালা খোলা (ফোন নয়)', titleEn: 'Wake up, hydrate, phone away', time: '08:00 AM', priority: 'high' },
      { title: 'আজকের ৩টি কাজ লেখা (MUST / SHOULD / COULD)', titleEn: 'Write top 3 daily priorities', time: '08:20 AM', priority: 'high' },
      { title: 'Chinese — ১৫–২০ মিনিট (শব্দ + শোনা + বলা)', titleEn: 'Chinese practice 15-20m', time: '09:15 AM', priority: 'high' },
      { title: 'Deep Work Block ১: Portfolio / New Skill / Adobe Stock', titleEn: 'Deep Work Session (Focused output)', time: '09:45 AM', priority: 'high' },
      { title: 'ব্রেক: চা/নাস্তা, জানালার পাশে হাঁটা', titleEn: 'Refreshment break & walk', time: '11:15 AM', priority: 'normal' },
      { title: 'Block ২: সহায়ক কাজ (Export, Description, ফাইল সাজানো)', titleEn: 'Secondary tasks & exports', time: '11:45 AM', priority: 'normal' },
      { title: 'Johor — নামাজ + দুপুরের খাবার', titleEn: 'Dhuhr prayer & lunch', time: '01:15 PM', priority: 'high' },
      { title: 'বিশ্রাম / দুপুরের ছোট ঘুম (সর্বোচ্চ ৩০ মি.)', titleEn: 'Power nap / rest (max 30m)', time: '01:45 PM', priority: 'normal' },
      { title: 'English — ১৫–২০ মিনিট (শোনা/পড়া/বলা)', titleEn: 'English practice 15-20m', time: '02:30 PM', priority: 'high' },
      { title: 'ফ্রি সময় / হালকা কাজ / বিনোদন window', titleEn: 'Free time / light entertainment', time: '02:50 PM', priority: 'normal' },
      { title: 'Asr — নামাজ', titleEn: 'Asr prayer', time: '04:45 PM', priority: 'high' },
      { title: 'হাঁটা (১৫-২০ মিনিট)', titleEn: 'Outdoor walk 15-20m', time: '05:00 PM', priority: 'normal' },
      { title: 'Maghrib — নামাজ', titleEn: 'Maghrib prayer', time: '06:00 PM', priority: 'high' },
      { title: 'ফ্রি সময় / পরিবার / বিনোদন window', titleEn: 'Family & leisure time', time: '06:15 PM', priority: 'normal' },
      { title: 'Isha — নামাজ', titleEn: 'Isha prayer', time: '08:00 PM', priority: 'high' },
      { title: 'রাতের খাবার + পরিবারের সাথে সময়', titleEn: 'Dinner & family time', time: '08:15 PM', priority: 'normal' },
      { title: 'Reading — ৫ পৃষ্ঠা বই পড়া', titleEn: 'Reading 5 book pages', time: '09:15 PM', priority: 'high' },
      { title: 'Wind-down: ফোন চার্জে দূরে, কালকের ৩ কাজ লেখা, অজু', titleEn: 'Night wind-down & phone charge away', time: '10:30 PM', priority: 'high' },
      { title: 'ঘুম (১১:০০ PM)', titleEn: 'Restorative sleep by 11:00 PM', time: '11:00 PM', priority: 'high' },
    ],
  },
  {
    id: 'shakib_minimum_day',
    title: 'শাকিবের Minimum Day (ক্লান্ত বা ব্যস্ত দিনের রুটিন)',
    titleEn: "Shakib: Minimum Viable Day",
    icon: '🌿',
    badge: 'Low Friction',
    description: 'ক্লান্ত, অসুস্থ বা জরুরি কাজে রুটিন ভেঙে গেলে সব বাদ দিয়ে শুধু এই ন্যূনতম কাজগুলো ধরে রাখুন।',
    descriptionEn: 'Safety net for tired/busy days: keep core habits without burning out.',
    tasks: [
      { title: 'Fajr — নামাজ', titleEn: 'Fajr prayer', time: '05:00 AM', priority: 'high' },
      { title: 'পানি পান + আজকের কেবল ১টি MUST কাজ নির্ধারণ (৫ মি.)', titleEn: 'Hydrate & 1 MUST task', time: '08:00 AM', priority: 'high' },
      { title: 'Chinese — ১০ মিনিট (শুধু শব্দ বা ফ্ল্যাশ কার্ড)', titleEn: 'Chinese 10m flashcards', time: '09:15 AM', priority: 'high' },
      { title: 'Johor — নামাজ', titleEn: 'Dhuhr prayer', time: '01:15 PM', priority: 'high' },
      { title: 'English — ১০ মিনিট (ছোট একটি Podcast/অডিও)', titleEn: 'English 10m short audio', time: '02:30 PM', priority: 'high' },
      { title: 'Asr — নামাজ', titleEn: 'Asr prayer', time: '04:45 PM', priority: 'high' },
      { title: 'হাঁটা — ১০ মিনিট (হালকা শরীর সচল করা)', titleEn: '10m light walk', time: '05:00 PM', priority: 'normal' },
      { title: 'Maghrib — নামাজ', titleEn: 'Maghrib prayer', time: '06:00 PM', priority: 'high' },
      { title: 'Isha — নামাজ', titleEn: 'Isha prayer', time: '08:00 PM', priority: 'high' },
      { title: 'Reading — ৫ পৃষ্ঠা বই পড়া', titleEn: 'Reading 5 book pages', time: '09:15 PM', priority: 'normal' },
      { title: 'ফোন বিছানা থেকে দূরে চার্জে রাখা', titleEn: 'Keep phone away from bed', time: '10:30 PM', priority: 'high' },
      { title: 'ঘুম ও পর্যাপ্ত বিশ্রাম', titleEn: 'Early restorative sleep', time: '11:00 PM', priority: 'high' },
    ],
  },
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
