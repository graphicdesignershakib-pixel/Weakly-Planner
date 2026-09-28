import React, { useState } from 'react';
import {
  BookOpen,
  X,
  Sparkles,
  Flame,
  Mail,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  Heart,
  Droplet,
  Headphones,
  Keyboard,
  Printer,
  Palette,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserManualModal: React.FC<UserManualModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'quickstart' | 'features' | 'vip' | 'shortcuts' | 'faq'>('quickstart');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E5E7EB] dark:border-[#27272A] flex items-center justify-between bg-gradient-to-r from-sky-500/10 via-transparent to-indigo-500/10">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-sky-500/20 text-sky-600 dark:text-sky-400">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-[#111111] dark:text-white flex items-center gap-2">
                Weekly Planner Pro — User Manual & Guide
              </h2>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
                আপনার প্রোডাক্টিভিটি প্ল্যানারের সম্পূর্ণ ব্যবহার নির্দেশিকা (User Manual)
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E5E7EB] dark:border-[#27272A] px-6 pt-2 gap-2 bg-[#FAFAFA] dark:bg-[#141416] overflow-x-auto no-scrollbar">
          {[
            { id: 'quickstart', label: '🚀 কুইক স্টার্ট (Quickstart)' },
            { id: 'vip', label: '🌟 ভিআইপি ফিচারসমূহ (VIP Features)' },
            { id: 'features', label: '🛠️ কোর টুলস (Daily Tools)' },
            { id: 'shortcuts', label: '⌨️ কীবোর্ড শর্টকাট' },
            { id: 'faq', label: '💡 টিপস ও ব্যাকআপ' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id as any)}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeSection === tab.id
                  ? 'border-sky-500 text-sky-600 dark:text-sky-400'
                  : 'border-transparent text-[#71717A] hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Manual Content */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar text-[#27272A] dark:text-zinc-200 text-xs leading-relaxed">
          {/* Quickstart Tab */}
          {activeSection === 'quickstart' && (
            <div className="space-y-4">
              <div className="bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/40 p-4 rounded-xl">
                <h3 className="text-sm font-bold text-sky-950 dark:text-sky-200 mb-1 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-sky-500" />
                  Weekly Planner Pro কী এবং কেন এটি অনন্য?
                </h3>
                <p className="text-[#52525B] dark:text-zinc-300">
                  এটি কেবল একটি সাধারণ টু-ডু লিস্ট নয়; এটি একটি সম্পূর্ণ **লাইফস্টাইল ও হাই-পারফরম্যান্স প্রোডাক্টিভিটি সিস্টেম**। এতে টাইম-ব্লকিং, হ্যাবিট ট্র্যাকার, সালাহ ট্র্যাকার, ওয়াটার ইনটেক, পোমোডোরো এবং মাইন্ডসেট জার্নালিং একই সুতোয় গাঁথা।
                </p>
              </div>

              <h4 className="font-bold text-sm text-[#111111] dark:text-white">
                💡 প্রতিদিন ব্যবহারের সহজ ৩টি ধাপ:
              </h4>

              <div className="grid gap-3">
                <div className="p-3.5 rounded-xl border border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#1C1C20] flex gap-3 items-start">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 font-bold flex items-center justify-center shrink-0 text-xs">
                    ১
                  </span>
                  <div>
                    <h5 className="font-bold text-[#111111] dark:text-white">
                      সকালে: Morning Clarity সেট করুন
                    </h5>
                    <p className="text-[#71717A] dark:text-[#A1A1AA] mt-0.5">
                      হেডারের শিখা আইকন (🔥)-এ ক্লিক করে আজকের শীর্ষ ৩টি Non-Negotiable কাজ লিখে ফেলুন। এগুলো সরাসরি আজকের প্ল্যানার লিস্টে হাই-প্রায়োরিটি হিসেবে যোগ হবে।
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#1C1C20] flex gap-3 items-start">
                  <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 font-bold flex items-center justify-center shrink-0 text-xs">
                    ২
                  </span>
                  <div>
                    <h5 className="font-bold text-[#111111] dark:text-white">
                      সারাদিন: ফোকাস দিয়ে কাজ ও ট্র্যাকিং
                    </h5>
                    <p className="text-[#71717A] dark:text-[#A1A1AA] mt-0.5">
                      পোমোডোরো টাইমার ও ক্যাফে/বাইনোরাল সাউন্ড ছেড়ে ডিপ ওয়ার্ক করুন। কাজ শেষে চেকবক্সে টিক দিন, পানি পানের পর গ্লাসে ক্লিক করুন এবং সালাহ ট্র্যাক করুন।
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#1C1C20] flex gap-3 items-start">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold flex items-center justify-center shrink-0 text-xs">
                    ৩
                  </span>
                  <div>
                    <h5 className="font-bold text-[#111111] dark:text-white">
                      রাতে: Evening Reflection ও রিল্যাক্স
                    </h5>
                    <p className="text-[#71717A] dark:text-[#A1A1AA] mt-0.5">
                      দিনশেষে আজকের ৩টি কৃতজ্ঞতা (Gratitude) এবং সারাদিনের সেরা মুহূর্ত লিখে মাইন্ড রিফ্রেশ করে শান্তিতে ঘুমাতে যান।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIP Features Tab */}
          {activeSection === 'vip' && (
            <div className="space-y-4">
              <div className="grid gap-3">
                <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <h4 className="font-bold text-amber-900 dark:text-amber-200">
                      ১. Daily Rituals (Morning Clarity & Evening Reflection)
                    </h4>
                  </div>
                  <p className="text-amber-800/90 dark:text-amber-300/80">
                    হেডারের শিখা আইকন (🔥) থেকে খোলা যায়। সকালের জন্য ইনটেনশন এবং রাতের জন্য ডিপ্রেশন কমানোর গ্রেটিটিউড জার্নাল।
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/50 dark:bg-purple-950/20">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Mail className="w-4 h-4 text-purple-500" />
                    <h4 className="font-bold text-purple-900 dark:text-purple-200">
                      ২. Letters to Future Self (টাইম ক্যাপসুল)
                    </h4>
                  </div>
                  <p className="text-purple-800/90 dark:text-purple-300/80">
                    ভবিষ্যতের নিজের উদ্দেশ্যে ১ সপ্তাহ, ১ মাস বা যেকোনো তারিখের জন্য চিঠি লিখে লক করে রাখুন। নির্দিষ্ট তারিখের আগে এটি খোলা সম্ভব নয়। খুললেই মিলবে কনফেটি সেলিব্রেশন!
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-pink-200 dark:border-pink-900/40 bg-pink-50/50 dark:bg-pink-950/20">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="w-4 h-4 text-pink-500" />
                    <h4 className="font-bold text-pink-900 dark:text-pink-200">
                      ৩. Weekly Wrapped Story (স্পটিফাই স্টাইল রিভিউ)
                    </h4>
                  </div>
                  <p className="text-pink-800/90 dark:text-pink-300/80">
                    হেডারের স্পার্কল আইকন (✨) চাপলে পুরো সপ্তাহের পারফরম্যান্স একটি ৫-স্লাইডের স্টোরি আকারে দারুণ অ্যানিমেশনের সাথে সামনে তুলে ধরে।
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/20">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Headphones className="w-4 h-4 text-indigo-500" />
                    <h4 className="font-bold text-indigo-900 dark:text-indigo-200">
                      ৪. 10Hz Alpha Binaural Beats & Café Ambience
                    </h4>
                  </div>
                  <p className="text-indigo-800/90 dark:text-indigo-300/80">
                    পোমোডোরো টাইমারের নিচে Café এবং Binaural বোতাম রয়েছে। ব্রাউজারের ভেতর থেকেই ন্যাচারাল ফ্রিকোয়েন্সি সাউন্ড জেনারেট করে গভীর মনোযোগের পরিবেশ তৈরি করে।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Daily Core Tools Tab */}
          {activeSection === 'features' && (
            <div className="space-y-3">
              <div className="border border-[#E5E7EB] dark:border-[#27272A] rounded-xl p-3 bg-[#FAFAFA] dark:bg-[#121214]">
                <h4 className="font-bold text-[#111111] dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-500" />
                  লাইভ ক্লক ও অটো ডে/উইক সিঙ্ক
                </h4>
                <p className="text-[#71717A] dark:text-[#A1A1AA] mt-1">
                  হেডারে লাইভ সেকেন্ড টিক করে। রাত ১২টা বাজলে পেজ রিফ্রেশ ছাড়াই আজকের দিনটি স্বয়ংক্রিয়ভাবে হাইলাইট হয়ে যাবে এবং নতুন সপ্তাহে শিফট হবে।
                </p>
              </div>

              <div className="border border-[#E5E7EB] dark:border-[#27272A] rounded-xl p-3 bg-[#FAFAFA] dark:bg-[#121214]">
                <h4 className="font-bold text-[#111111] dark:text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-emerald-500" />
                  ৪টি প্রিমিয়াম থিম
                </h4>
                <p className="text-[#71717A] dark:text-[#A1A1AA] mt-1">
                  হেডারের প্যালেট আইকন দিয়ে সুইচ করুন: <strong>Minimal</strong> (শার্প), <strong>Sage</strong> (স্নিগ্ধ অলিভ গ্রিন), <strong>Latte</strong> (উষ্ণ ক্যাফে), <strong>Obsidian</strong> (ডিপ ব্ল্যাক ওলেড)।
                </p>
              </div>

              <div className="border border-[#E5E7EB] dark:border-[#27272A] rounded-xl p-3 bg-[#FAFAFA] dark:bg-[#121214]">
                <h4 className="font-bold text-[#111111] dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  Google & Apple Calendar Export (.ics)
                </h4>
                <p className="text-[#71717A] dark:text-[#A1A1AA] mt-1">
                  প্রিন্ট বাটনের পাশের ক্যালেন্ডার আইকনে ক্লিক করলেই সম্পূর্ণ সপ্তাহের সব টাইম-ব্লকড টাস্ক ক্যালেন্ডার ফাইল হিসেবে ডাউনলোড হবে।
                </p>
              </div>

              <div className="border border-[#E5E7EB] dark:border-[#27272A] rounded-xl p-3 bg-[#FAFAFA] dark:bg-[#121214]">
                <h4 className="font-bold text-[#111111] dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-500" />
                  Brain Dump & Scratchpad
                </h4>
                <p className="text-[#71717A] dark:text-[#A1A1AA] mt-1">
                  ডেইলি গ্রিডের নিচে উপস্থিত স্ক্র্যাচপ্যাডে আকস্মিক আইডিয়া ড্রাফট করে রাখুন। "To Today ➔" চাপলেই নোটটি আজকের টাস্ক লিস্টে চলে যাবে।
                </p>
              </div>
            </div>
          )}

          {/* Shortcuts Tab */}
          {activeSection === 'shortcuts' && (
            <div className="space-y-3">
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
                মাউস ছাড়া দ্রুত কাজ করার জন্য কীবোর্ড শর্টকাটগুলো ব্যবহার করুন:
              </p>
              <div className="grid grid-cols-2 gap-2 font-mono">
                {[
                  { k: '⌘ / Ctrl + K', d: 'গ্লোবাল সার্চ ও কমান্ড প্যালেট' },
                  { k: '⌘ / Ctrl + P', d: 'প্রিন্ট বা PDF এক্সপোর্ট' },
                  { k: 'T', d: 'বর্তমান সপ্তাহে জাম্প (Today)' },
                  { k: '← / →', d: 'পূর্ববর্তী বা পরবর্তী সপ্তাহে যাওয়া' },
                  { k: '1 – 7', d: 'সোমবার থেকে রবিবার সিলেক্ট' },
                  { k: 'N', d: 'নতুন টাস্ক ইনপুট বক্সে ফোকাস' },
                  { k: 'Enter', d: 'টাস্ক সাবমিট করা' },
                  { k: 'Esc', d: 'যেকোনো উইন্ডো বা মডাল বন্ধ' },
                ].map((s) => (
                  <div
                    key={s.k}
                    className="p-2.5 rounded-lg border border-[#E5E7EB] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#121214] flex flex-col justify-between"
                  >
                    <span className="font-bold text-[#111111] dark:text-white text-xs">{s.k}</span>
                    <span className="text-[11px] font-sans text-[#71717A] dark:text-[#A1A1AA] mt-1">{s.d}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ & Backup Tab */}
          {activeSection === 'faq' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/50 dark:bg-emerald-950/20">
                <h4 className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  আমার ডেটা কি সুরক্ষিত এবং ব্রাউজারে সংরক্ষিত থাকে?
                </h4>
                <p className="text-emerald-800/90 dark:text-emerald-300/80">
                  হ্যাঁ! আপনার সমস্ত প্ল্যানার ডাটা, হ্যাবিট, সালাহ, জার্নাল ও চিঠি সম্পূর্ণ ক্লায়েন্ট-সাইড লোকাল স্টোরেজে সুরক্ষিতভাবে সংরক্ষিত থাকে। কোনো তথ্য বাইরের সার্ভারে যায় না।
                </p>
              </div>

              <div>
                <h4 className="font-bold text-xs text-[#111111] dark:text-white mb-1.5">
                  💾 ডেটা ব্যাকআপ ও রিস্টোর করার নিয়ম:
                </h4>
                <p className="text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                  হেডারের <strong>ডাউনলোড আইকন (📥)</strong>-এ ক্লিক করে যেকোনো সময় পুরো প্ল্যানারের একটি `.json` ব্যাকআপ ফাইল নিজের কম্পিউটারে ডাউনলোড করে রাখতে পারেন। পরবর্তীতে অন্য ব্রাউজার বা ডিভাইসে <strong>আপলোড আইকন (📤)</strong> দিয়ে এক সেকেন্ডেই তা রিস্টোর করা যায়।
                </p>
              </div>

              <div>
                <h4 className="font-bold text-xs text-[#111111] dark:text-white mb-1.5">
                  🖨️ পেপার প্রিন্ট বা PDF ডাউনলোড:
                </h4>
                <p className="text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                  হেডারের <strong>প্রিন্টার আইকন</strong> অথবা কীবোর্ডে <code>Ctrl + P</code> চাপলেই পুরো সপ্তাহের প্ল্যানারটি একটি সুন্দর পরিপাটি A4 সাইজ পেপারে প্রিন্ট বা 'Save as PDF' করার উপযোগী ভিউতে প্রস্তুত হয়ে যাবে।
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#E5E7EB] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#141416] flex items-center justify-between">
          <span className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
            Weekly Planner Pro · Made for elite performers
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-white bg-[#111111] dark:bg-white dark:text-[#111111] rounded-xl hover:opacity-90 shadow-sm cursor-pointer transition-all"
          >
            বুঝেছি / সম্পন্ন
          </button>
        </div>
      </div>
    </div>
  );
};
