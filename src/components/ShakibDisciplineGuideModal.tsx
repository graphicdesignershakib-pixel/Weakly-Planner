import React, { useState } from 'react';
import {
  X,
  Compass,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Smartphone,
  Shield,
  Coffee,
  Flame,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ShakibDisciplineGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadFullRoutine: () => void;
}

export const ShakibDisciplineGuideModal: React.FC<ShakibDisciplineGuideModalProps> = ({
  isOpen,
  onClose,
  onLoadFullRoutine,
}) => {
  const { isBn } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'rules' | 'restart' | 'social'>('overview');

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white dark:bg-[#18181B] text-slate-900 dark:text-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 dark:border-zinc-800 relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-gradient-to-tr from-indigo-600 to-sky-500 text-white rounded-2xl shadow-xs">
              <Compass className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-black">
                {isBn ? 'শাকিবের ৩০ দিনের Discipline Reset System' : "Shakib's 30-Day Discipline Reset System"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isBn ? 'বাস্তবসম্মত · ধাপে ধাপে · টেকসই — নিজের কথা রাখার জন্য' : 'Realistic, Progressive & Sustainable system'}
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

        {/* 1-Click Load Action Banner */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 border border-sky-300/40 dark:border-sky-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-black text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-500" />
              <span>{isBn ? 'এক ক্লিকে আপনার পুরো সপ্তাহের রুটিন সাজিয়ে নিন' : 'Populate your entire weekly routine now'}</span>
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              {isBn ? 'শনি থেকে রবি — ইন্টার্নশিপ, ডিপ ওয়ার্ক, অ্যাডোবি স্টক ও নামাজের সঠিক সময় অনুযায়ী' : 'Auto-schedules Internship, Adobe Stock, Portfolio & prayers'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              onLoadFullRoutine();
              onClose();
            }}
            className="px-4 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs cursor-pointer shadow-sm transition-all shrink-0 flex items-center justify-center gap-1.5"
          >
            <span>{isBn ? '⚡ রুটিন লোড করুন' : '⚡ Load Routine'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Navigation Sub-tabs */}
        <div className="flex gap-1.5 my-3 p-1 bg-slate-100 dark:bg-zinc-800/60 rounded-xl overflow-x-auto text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {isBn ? '৪টি Phase' : '4 Phases'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'rules'
                ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {isBn ? '৭টি নিয়ম' : '7 Rules'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('restart')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'restart'
                ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {isBn ? 'ভাঙলে কী করবেন' : 'Restart Protocol'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'social'
                ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {isBn ? 'Social Media নীতি' : 'Social Media Control'}
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-1 text-xs space-y-3">
          {activeTab === 'overview' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl border border-sky-200 dark:border-sky-900/40 bg-sky-50/30 dark:bg-sky-950/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-sky-700 dark:text-sky-300">Phase ১ — ভিত (Day ১–৭)</span>
                    <span className="text-[10px] bg-sky-200 dark:bg-sky-900 text-sky-800 dark:text-sky-200 px-1.5 py-0.5 rounded-full font-mono font-bold">৩–৯ অক্টো</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    মূল ফোকাস: ঘুম ও নামাজ ঠিক করা। ফজরে ওঠা ও ১১টায় ঘুমানো। বাকি সব কাজ ছোট শুরু (Chinese/English ১৫ মি.)।
                  </p>
                </div>

                <div className="p-3 rounded-2xl border border-indigo-200 dark:border-indigo-900/40 bg-indigo-50/30 dark:bg-indigo-950/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-indigo-700 dark:text-indigo-300">Phase ২ — কাঠামো (Day ৮–১৪)</span>
                    <span className="text-[10px] bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-1.5 py-0.5 rounded-full font-mono font-bold">১০–১৬ অক্টো</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    সময়কে Block করে কাজ শেখা। Deep Work ৫০ মিনিট + ১০ মি. ব্রেক। ফোন দূরে রেখে কাজ।
                  </p>
                </div>

                <div className="p-3 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-emerald-700 dark:text-emerald-300">Phase ৩ — ফলাফল (Day ১৫–২১)</span>
                    <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.5 rounded-full font-mono font-bold">১৭–২৩ অক্টো</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    Learn ➔ Practice ➔ Create চক্র। সপ্তাহে Adobe Stock ৮টি অ্যাসেট, Portfolio ৩ ঘণ্টা ও New Skill আউটপুট।
                  </p>
                </div>

                <div className="p-3 rounded-2xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/30 dark:bg-purple-950/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-purple-700 dark:text-purple-300">Phase ৪ — স্থিতি (Day ২২–৩০)</span>
                    <span className="text-[10px] bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-1.5 py-0.5 rounded-full font-mono font-bold">২৪ অক্টো–১ নভে</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    অভ্যাস স্বয়ংক্রিয় করা। মোটিভেশন না থাকলেও সিস্টেম এগিয়ে নেওয়া। সোশ্যাল মিডিয়া সর্বোচ্চ ১ ঘণ্টা।
                  </p>
                </div>
              </div>

              {/* Weekly Rhythm */}
              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  <span>সাপ্তাহিক থিম বণ্টন:</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700">
                    <span className="font-bold text-sky-600 block">সোম: Portfolio</span>
                    <span className="text-slate-500 text-[10px]">সকালে ফ্রেশ মাথায় কাজ</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700">
                    <span className="font-bold text-emerald-600 block">রবি/মঙ্গল/বৃহ: Internship</span>
                    <span className="text-slate-500 text-[10px]">১০-৩টা অফিস + বিকেলে কাজ</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700">
                    <span className="font-bold text-purple-600 block">বুধ: New Skill</span>
                    <span className="text-slate-500 text-[10px]">শেখা ও অনুশীলন</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700">
                    <span className="font-bold text-amber-600 block">শুক্র/শনি: Stock & Reset</span>
                    <span className="text-slate-500 text-[10px]">বড় প্রোডাকশন ও রিভিউ</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-2">
              {[
                { title: '১. Never miss twice', desc: 'একদিন না পারা স্বাভাবিক, দুই দিন টানা না পারলে অভ্যাস ভেঙে যায়। পরদিন অন্তত ৫-১০ মিনিট হলেও করুন।' },
                { title: '২. Minimum version is better than zero', desc: '১০ মিনিট Chinese = ০ মিনিটের চেয়ে লক্ষ গুণ ভালো। শক্তি কম থাকলে Minimum Day বেছে নিন।' },
                { title: '৩. Action before motivation', desc: 'মোটিভেশনের জন্য অপেক্ষা নয়। ১০ মিনিটের টাইমার দিয়ে শুরু করুন, কাজ শুরু করলে মোটিভেশন আসে।' },
                { title: '৪. Entertainment after important work', desc: 'বিনোদন হচ্ছে কাজের পুরস্কার; কাজের আগে নয়। দিনের MUST কাজ শেষ হলে উইন্ডো খুলুন।' },
                { title: '৫. One major skill at a time', desc: 'একসাথে ৩টি স্কিল শিখলে কোনোটিই হয় না। ৩০ দিন ১টি স্কিলেই লেগে থাকুন।' },
                { title: '৬. Do not overload one day', desc: 'প্রতিদিন Daily Habit + মাত্র ১টি বড় কাজ (MUST)। বেশি কাজ লিখে দিন নষ্ট করবেন না।' },
                { title: '৭. Restart immediately after failure', desc: 'ভাঙার পর “আগামী সপ্তাহ থেকে শুরু” বলা ফাঁদ। সাথে সাথে পানি খান ➔ অজু ➔ পরের সালাত।' },
              ].map((r, i) => (
                <div key={i} className="p-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
                  <h4 className="font-black text-slate-900 dark:text-white text-xs">{r.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{r.desc}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'restart' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
                <h4 className="font-black text-amber-900 dark:text-amber-300 text-xs flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>ব্যর্থতা এই পরিকল্পনার অংশ, অপরাধবোধ নেই!</span>
                </h4>
                <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                  “Discipline মানে কখনো না ভাঙা নয়। Discipline মানে ভাঙার পর কত দ্রুত ফিরে আসেন।”
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <span className="font-black text-indigo-600 dark:text-indigo-400 block">ধাপ ১: থামুন, দোষ নয় (৩০ সেকেন্ড)</span>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">বলুন: “ঠিক আছে, ভেঙে গেছে। এটা তথ্য।” নিজেকে শাস্তি দেবেন না।</p>
                </div>
                <div className="p-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <span className="font-black text-sky-600 dark:text-sky-400 block">ধাপ ২: পরের ছোট কাজ (১০-১৫ মিনিট)</span>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">পানি খান ➔ অজু ➔ পরের নামাজ। তারপর পরের অভ্যাস (Chinese বা English ১০ মি.)।</p>
                </div>
                <div className="p-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <span className="font-black text-emerald-600 dark:text-emerald-400 block">ধাপ ৩: আজকের Minimum Day ঘোষণা (৫ মিনিট)</span>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">আজকের জন্য কেবল ১টি MUST কাজ ঠিক করুন। বাকি ভার মুক্ত রাখুন।</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-300 text-xs">
                <span className="font-bold block mb-0.5">📱 ফেসবুক ও ইউটিউব সীমা:</span>
                <span>Day ১–১০: সর্বোচ্চ ২.৫ ঘণ্টা · Day ১১–২০: ১.৫ ঘণ্টা · Day ২১–৩০: ১ ঘণ্টা।</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900">
                  <span className="font-bold text-slate-800 dark:text-white block">সকালে ওঠার প্রথম ঘণ্টায় ফোন নয়</span>
                  <span className="text-slate-500">দিনের প্রথম মনোযোগ আপনার, অন্যের পোস্টের নয়।</span>
                </div>
                <div className="p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900">
                  <span className="font-bold text-slate-800 dark:text-white block">Deep Work-এ ফোন অন্য ঘরে</span>
                  <span className="text-slate-500">টেবিলে উপুড় করে রাখলেও মনোযোগ নষ্ট হয়।</span>
                </div>
                <div className="p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900">
                  <span className="font-bold text-slate-800 dark:text-white block">বিছানায় ফোন নয়</span>
                  <span className="text-slate-500">ঘুমানোর ৩০ মিনিট আগে ফোন চার্জে, বিছানার বাইরে।</span>
                </div>
                <div className="p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900">
                  <span className="font-bold text-slate-800 dark:text-white block">Shorts / Reels ১৫ মিনিট সর্বোচ্চ</span>
                  <span className="text-slate-500">অটোপ্লে বন্ধ রাখুন এবং টাইমার দিয়ে দেখুন।</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
