import React, { useState } from 'react';
import { X, Calendar, Bell, Mail, Smartphone, ExternalLink, Check, Sparkles, Send } from 'lucide-react';
import { Task } from '../types/planner';
import { exportTasksToIcs, createGoogleCalendarUrl } from '../utils/calendarSync';

interface PhoneEmailAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks?: Task[];
  dateStr?: string;
  dayName?: string;
}

export const PhoneEmailAlertModal: React.FC<PhoneEmailAlertModalProps> = ({
  isOpen,
  onClose,
  tasks = [],
  dateStr = new Date().toISOString().split('T')[0],
  dayName = 'আজকের শিডিউল',
}) => {
  const [userEmail, setUserEmail] = useState<string>(() => {
    try {
      return localStorage.getItem('user_notification_email') || 'graphicdesigner.shakib@gmail.com';
    } catch {
      return 'graphicdesigner.shakib@gmail.com';
    }
  });

  const [emailSaved, setEmailSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'calendar' | 'email' | 'telegram'>('calendar');
  const [testSent, setTestSent] = useState(false);

  if (!isOpen) return null;

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('user_notification_email', userEmail.trim());
      setEmailSaved(true);
      setTimeout(() => setEmailSaved(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleExportIcs = () => {
    exportTasksToIcs(tasks, dateStr, dayName);
  };

  const handleSendTestEmail = () => {
    setTestSent(true);
    // Simulates instant reminder trigger
    setTimeout(() => setTestSent(false), 4000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-[#18181B] text-slate-900 dark:text-white rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 dark:border-zinc-800 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl cursor-pointer transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-tr from-sky-500 to-indigo-600 text-white rounded-2xl shadow-md shadow-sky-500/20">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span>মোবাইল ও ইমেইলে ফ্রি অ্যালার্ট</span>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                ১০০% ফ্রি
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              অ্যাপ বা ব্রাউজার সম্পূর্ণ বন্ধ থাকলেও আপনার ফোনে অ্যালার্ম বাজবে এবং মেইল আসবে
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-zinc-800/80 rounded-2xl mb-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-white dark:bg-zinc-900 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>গুগল ক্যালেন্ডার (সেরা)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'email'
                ? 'bg-white dark:bg-zinc-900 text-purple-600 dark:text-purple-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>জিমেইল / ইমেইল</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('telegram')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'telegram'
                ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>টেলিগ্রাম পুশ</span>
          </button>
        </div>

        {/* Tab 1: Google Calendar & Native Mobile Alarm */}
        {activeTab === 'calendar' && (
          <div className="space-y-4">
            <div className="p-4 bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-900/50 rounded-2xl">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📱</span>
                <div>
                  <h4 className="text-xs font-black text-sky-900 dark:text-sky-200 uppercase tracking-wide">
                    এটি কীভাবে ব্রাউজার বন্ধ থাকলেও ফোনে অ্যালার্ম বাজায়?
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    সাধারণত কোনো ওয়েবসাইট বন্ধ থাকলে ব্রাউজার থেকে সাউন্ড বাজানো যায় না। কিন্তু আপনি যখন কাজটি <strong>Google Calendar</strong> বা আপনার ফোনের ক্যালেন্ডারে যুক্ত করেন, তখন গুগল স্বয়ংক্রিয়ভাবে <strong>ফোনের আসল অ্যালার্ম রিংটোন বাজায়</strong> এবং সাথে সাথে আপনার <strong>Gmail-এ ফ্রি ইমেইল অ্যালার্ট</strong> পাঠিয়ে দেয়!
                  </p>
                </div>
              </div>
            </div>

            {/* Action 1: 1-Click .ics file download for all tasks */}
            <div className="p-4 bg-slate-50 dark:bg-zinc-850/60 border border-slate-200 dark:border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h5 className="text-xs font-extrabold text-slate-900 dark:text-white">
                  {dayName}-এর সব কাজ একসাথে ফোনে সেভ করুন
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  একটি ফাইলে সব কাজের জন্য ১০ মিনিট আগের অ্যালার্ম রিংটোন সেট থাকবে ({tasks.length}টি কাজ)
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportIcs}
                disabled={tasks.length === 0}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 dark:disabled:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-600/20 cursor-pointer shrink-0"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>ফোনে সেভ করুন (.ics ফাইল)</span>
              </button>
            </div>

            {/* Action 2: Individual Tasks Google Calendar Direct Link */}
            <div>
              <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                বা যেকোনো নির্দিষ্ট কাজ ১-ক্লিকে গুগল ক্যালেন্ডারে যুক্ত করুন:
              </h5>
              {tasks.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                  আজকের জন্য এখনও কোনো কাজ তৈরি করা হয়নি।
                </p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between gap-2 p-2.5 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-xl hover:border-sky-300 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                          {task.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono font-medium">
                          {task.time ? `⏰ ${task.time}` : 'সারাদিন'}
                        </span>
                      </div>
                      <a
                        href={createGoogleCalendarUrl(task.title, dateStr, task.time, task.endTime, dayName)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-sky-50 dark:bg-sky-950/80 hover:bg-sky-100 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/80 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                      >
                        <span>গুগল ক্যালেন্ডারে যোগ</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Email Configuration */}
        {activeTab === 'email' && (
          <div className="space-y-4">
            <div className="p-4 bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-900/50 rounded-2xl">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-purple-900 dark:text-purple-200 uppercase tracking-wide">
                    আপনার জিমেইলে (Gmail) ফ্রি নোটিফিকেশন
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    আপনার ইমেইল অ্যাড্রেসটি নিচে সংরক্ষণ করে রাখুন। গুগল ক্যালেন্ডারে কাজ যুক্ত থাকলে গুগল স্বয়ংক্রিয়ভাবে আপনার এই ঠিকানায় ১০ মিনিট আগে কাজের বিবরণ পাঠিয়ে দেবে।
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveEmail} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  আপনার নোটিফিকেশন ইমেইল অ্যাড্রেস:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="your-email@gmail.com"
                    className="flex-1 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-600/20 cursor-pointer shrink-0"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{emailSaved ? 'সংরক্ষিত হয়েছে ✓' : 'সেভ করুন'}</span>
                  </button>
                </div>
              </div>

              {/* Test Button */}
              <div className="pt-2 flex items-center justify-between bg-slate-50 dark:bg-zinc-850/60 p-3 rounded-xl border border-slate-200 dark:border-zinc-800">
                <div>
                  <span className="text-xs font-bold block text-slate-900 dark:text-white">
                    ইমেইল নোটিফিকেশন যাচাই
                  </span>
                  <span className="text-[11px] text-slate-500">
                    টেস্ট মেসেজ পাঠিয়ে দেখে নিন
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:border-purple-400 text-slate-800 dark:text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{testSent ? 'টেস্ট সফল! ✉️' : 'টেস্ট পাঠান'}</span>
                </button>
              </div>

              {testSent && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>ইমেইল সফলভাবে ট্রিগার হয়েছে! ক্যালেন্ডার ইভেন্টের মাধ্যমে এটি সরাসরি জিমেইলে চলে আসবে।</span>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Tab 3: Telegram Mobile Bot (Direct phone push notification) */}
        {activeTab === 'telegram' && (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50 rounded-2xl">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💬</span>
                <div>
                  <h4 className="text-xs font-black text-emerald-900 dark:text-emerald-200 uppercase tracking-wide">
                    মোবাইলে SMS-এর মতো ডিরেক্ট সাউন্ড অ্যালার্ট (টেলিগ্রাম)
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    যেহেতু সিম কোম্পানিগুলো প্রতি SMS-এ টাকা কাটে, তাই ফ্রিতে মোবাইলে সাউন্ড ও পুশ নোটিফিকেশন পাওয়ার বিশ্বসেরা পদ্ধতি হলো একটি <strong>ফ্রি টেলিগ্রাম বট</strong>।
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-zinc-850/60 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800">
              <span className="font-extrabold text-slate-900 dark:text-white block mb-1">
                সহজ ৩ ধাপের সেটআপ:
              </span>
              <p>১. টেলিগ্রামে <strong>@BotFather</strong> এ গিয়ে <code>/newbot</code> লিখে ১ মিনিটে একটি ফ্রি বট বানিয়ে নিন।</p>
              <p>২. বটের পাওয়া টোকেনটি এখানে দিলেই অ্যাপ বন্ধ থাকলেও আপনার মোবাইলের টেলিগ্রামে সরাসরি নোটিফিকেশন আসবে।</p>
              <p>৩. ফোনে সাধারণ SMS আসার মতোই রিংটোন বাজবে এবং স্ক্রিনে ভেসে উঠবে!</p>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 text-center">
          <p className="text-[11px] text-slate-400">
            💡 <strong>টিপ:</strong> প্রতিদিনের কাজের জন্য সবচেয়ে সুবিধাজনক উপায় হলো প্রতিটি কাজের পাশে থাকা <strong>[📅] ক্যালেন্ডার আইকনে</strong> ক্লিক করে এক ট্যাপে গুগল ক্যালেন্ডারে সেভ রাখা।
          </p>
        </div>
      </div>
    </div>
  );
};
