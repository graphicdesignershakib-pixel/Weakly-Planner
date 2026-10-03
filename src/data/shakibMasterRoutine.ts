import { PlannerState, Habit, DayPlan, Task } from '../types/planner';
import { getWeekDaysInfo } from '../utils/dateUtils';

export const SHAKIB_HABITS: Habit[] = [
  { id: 'h-fajr', name: 'Fajr (৫:০০ AM-এ ওঠা ও নামাজ)', category: 'pray', completed: [false, false, false, false, false, false, false] },
  { id: 'h-prayers', name: '৫ ওয়াক্ত নামাজ (Fixed Anchor)', category: 'pray', completed: [false, false, false, false, false, false, false] },
  { id: 'h-chinese', name: 'Chinese ভাষা প্র্যাকটিস (১৫-২০ মিনিট)', category: 'study', completed: [false, false, false, false, false, false, false] },
  { id: 'h-english', name: 'English প্র্যাকটিস (১৫-২০ মিনিট)', category: 'study', completed: [false, false, false, false, false, false, false] },
  { id: 'h-deepwork', name: 'Deep Work Block (দিনের মূল কাজ)', category: 'work', completed: [false, false, false, false, false, false, false] },
  { id: 'h-adobestock', name: 'Adobe Stock (রবি, বৃহস্পতি, শুক্র)', category: 'work', completed: [false, false, false, false, false, false, false] },
  { id: 'h-portfolio', name: 'Portfolio Development (সোম, শুক্র)', category: 'work', completed: [false, false, false, false, false, false, false] },
  { id: 'h-newskill', name: 'New Skill Learning (মঙ্গল, বুধ)', category: 'study', completed: [false, false, false, false, false, false, false] },
  { id: 'h-walk', name: 'হাঁটা / হালকা ব্যায়াম (১৫-২০ মিনিট)', category: 'health', completed: [false, false, false, false, false, false, false] },
  { id: 'h-reading', name: 'বই পড়া / Reading (৫-১০ পৃষ্ঠা)', category: 'personal', completed: [false, false, false, false, false, false, false] },
  { id: 'h-socialmedia', name: 'Social Media Limit (≤ ২.৫ ঘণ্টা/দিন)', category: 'personal', completed: [false, false, false, false, false, false, false] },
  { id: 'h-sleep', name: 'সময়মতো বিছানায় যাওয়া (১১:০০ PM)', category: 'health', completed: [false, false, false, false, false, false, false] },
];

function makeTask(title: string, time: string, endTime?: string, priority: 'high' | 'normal' = 'normal'): Task {
  return {
    id: `shakib-task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title,
    time,
    endTime,
    completed: false,
    priority,
  };
}

// 0 = Monday, 1 = Tuesday, 2 = Wednesday, 3 = Thursday, 4 = Friday, 5 = Saturday, 6 = Sunday
export function getShakibDayTasks(dayIndex: number): Task[] {
  switch (dayIndex) {
    // 0: Monday — Portfolio + Deep Work
    case 0:
      return [
        makeTask('Fajr — অজু ও নামাজ (নামাজের পর ফোন ছাড়া বিছানায়)', '05:00 AM', '05:15 AM', 'high'),
        makeTask('চূড়ান্ত ওঠা: পানি, মুখ ধোয়া, জানালা খোলা (ফোন নয়)', '08:00 AM', '08:20 AM', 'high'),
        makeTask('আজকের ৩টি কাজ লেখা (MUST: Portfolio প্রজেক্ট, SHOULD: Description, COULD: Adobe Stock)', '08:20 AM', '08:30 AM', 'high'),
        makeTask('Chinese — ১৫–২০ মিনিট (শব্দ + শোনা + বলা)', '09:15 AM', '09:35 AM', 'high'),
        makeTask('Portfolio Deep Work — প্রজেক্ট ডিজাইন / কেস স্টাডি (ফোন অন্য ঘরে)', '09:45 AM', '11:15 AM', 'high'),
        makeTask('ব্রেক: চা/নাস্তা, জানালার পাশে হাঁটা (ফোন নয়)', '11:15 AM', '11:45 AM', 'normal'),
        makeTask('Portfolio সহায়ক কাজ: Export, Description, ফাইল সাজানো', '11:45 AM', '12:30 PM', 'normal'),
        makeTask('Johor — নামাজ', '01:15 PM', '01:30 PM', 'high'),
        makeTask('English — ১৫–২০ মিনিট (শোনা/পড়া/বলা)', '02:30 PM', '02:50 PM', 'high'),
        makeTask('ফ্রি সময় / হালকা বিশ্রাম / Entertainment window (সর্বোচ্চ ৪৫ মি.)', '02:50 PM', '04:30 PM', 'normal'),
        makeTask('Asr — নামাজ', '04:45 PM', '05:00 PM', 'high'),
        makeTask('হাঁটা (১৫-২০ মিনিট)', '05:00 PM', '05:30 PM', 'normal'),
        makeTask('Maghrib — নামাজ', '06:00 PM', '06:15 PM', 'high'),
        makeTask('ফ্রি সময় / পরিবার / Entertainment window (সীমার ভেতরে)', '06:15 PM', '07:55 PM', 'normal'),
        makeTask('Isha — নামাজ', '08:00 PM', '08:15 PM', 'high'),
        makeTask('রাতের খাবার + পরিবারের সাথে সময় (খাওয়ার সময় ফোন নয়)', '08:15 PM', '09:15 PM', 'normal'),
        makeTask('Reading — ৫ পৃষ্ঠা বই পড়া', '09:15 PM', '09:35 PM', 'high'),
        makeTask('Wind-down: ফোন বিছানা থেকে দূরে চার্জে, আগামীকালের ৩ কাজ, অজু', '10:30 PM', '11:00 PM', 'high'),
        makeTask('ঘুম (Phase 1 লক্ষ্য: ১১:০০ PM)', '11:00 PM', undefined, 'high'),
      ];

    // 1: Tuesday — Internship + Light Learning
    case 1:
      return [
        makeTask('Fajr — অজু ও নামাজ', '05:00 AM', '05:15 AM', 'high'),
        makeTask('চূড়ান্ত ওঠা: পানি, মুখ ধোয়া, ৩ কাজ লেখা', '08:00 AM', '08:30 AM', 'high'),
        makeTask('নাস্তা, তৈরি হওয়া, আগের রাতে গোছানো ব্যাগ নেওয়া', '08:30 AM', '09:00 AM', 'normal'),
        makeTask('যাতায়াত + Chinese ১৫ মিনিট (Audio/Flashcard)', '09:00 AM', '10:00 AM', 'high'),
        makeTask('Internship (১০:০০ AM – ১:১৫ PM)', '10:00 AM', '01:15 PM', 'high'),
        makeTask('Johor — Internship-এর বিরতিতে নামাজ + দুপুরের খাবার', '01:15 PM', '01:45 PM', 'high'),
        makeTask('Internship (১:৪৫ PM – ৩:০০ PM)', '01:45 PM', '03:00 PM', 'high'),
        makeTask('ফেরা + English ১৫–২০ মিনিট (Podcast/Audio)', '03:00 PM', '04:00 PM', 'high'),
        makeTask('বিশ্রাম + Entertainment window (সর্বোচ্চ ৩০ মি.)', '04:00 PM', '04:45 PM', 'normal'),
        makeTask('Asr — নামাজ', '04:45 PM', '05:00 PM', 'high'),
        makeTask('Light Learning — ৩০–৪০ মিনিট: টিউটোরিয়াল/বইয়ের অধ্যায় + ৫ লাইন নোট', '05:00 PM', '05:55 PM', 'high'),
        makeTask('Maghrib — নামাজ', '06:00 PM', '06:15 PM', 'high'),
        makeTask('হাঁটা (১৫ মিনিট)', '06:15 PM', '06:45 PM', 'normal'),
        makeTask('Isha — নামাজ', '08:00 PM', '08:15 PM', 'high'),
        makeTask('রাতের খাবার + পরিবার', '08:15 PM', '09:15 PM', 'normal'),
        makeTask('Reading — ৫ পৃষ্ঠা বই পড়া', '09:15 PM', '09:35 PM', 'high'),
        makeTask('Wind-down: ফোন চার্জে, আগামীকালের ৩ কাজ লেখা, অজু', '10:30 PM', '11:00 PM', 'high'),
        makeTask('ঘুম (১১:০০ PM)', '11:00 PM', undefined, 'high'),
      ];

    // 2: Wednesday — New Skill Development
    case 2:
      return [
        makeTask('Fajr — অজু ও নামাজ', '05:00 AM', '05:15 AM', 'high'),
        makeTask('চূড়ান্ত ওঠা: পানি, মুখ ধোয়া, ৩ কাজ লেখা', '08:00 AM', '08:30 AM', 'high'),
        makeTask('Chinese — ১৫–২০ মিনিট (শব্দ + শোনা + বলা)', '09:15 AM', '09:35 AM', 'high'),
        makeTask('New Skill — Learn: কোর্স/টিউটোরিয়াল দেখে নোট নিয়ে শেখা (একটিই skill)', '09:45 AM', '11:15 AM', 'high'),
        makeTask('ব্রেক: চা/নাস্তা, জানালার পাশে হাঁটা', '11:15 AM', '11:45 AM', 'normal'),
        makeTask('New Skill — Practice: যা শিখলেন তা নিয়ে ছোট অনুশীলন', '11:45 AM', '12:30 PM', 'normal'),
        makeTask('Johor — নামাজ + দুপুরের খাবার', '01:15 PM', '01:45 PM', 'high'),
        makeTask('English — ১৫–২০ মিনিট (শোনা/পড়া/বলা)', '02:30 PM', '02:50 PM', 'high'),
        makeTask('ফ্রি সময় / বিনোদন window (সর্বোচ্চ ৪৫ মি.)', '02:50 PM', '04:30 PM', 'normal'),
        makeTask('Asr — নামাজ', '04:45 PM', '05:00 PM', 'high'),
        makeTask('হাঁটা / হালকা ব্যায়াম (১৫-২০ মিনিট)', '05:00 PM', '05:30 PM', 'normal'),
        makeTask('Maghrib — নামাজ', '06:00 PM', '06:15 PM', 'high'),
        makeTask('ফ্রি সময় / পরিবার / Entertainment', '06:15 PM', '07:55 PM', 'normal'),
        makeTask('Isha — নামাজ', '08:00 PM', '08:15 PM', 'high'),
        makeTask('রাতের খাবার + পরিবার', '08:15 PM', '09:15 PM', 'normal'),
        makeTask('Reading — ৫ পৃষ্ঠা', '09:15 PM', '09:35 PM', 'high'),
        makeTask('Wind-down: ফোন চার্জে দূরে, কালকের ৩ কাজ, অজু', '10:30 PM', '11:00 PM', 'high'),
        makeTask('ঘুম (১১:০০ PM)', '11:00 PM', undefined, 'high'),
      ];

    // 3: Thursday — Internship + Adobe Stock
    case 3:
      return [
        makeTask('Fajr — অজু ও নামাজ', '05:00 AM', '05:15 AM', 'high'),
        makeTask('চূড়ান্ত ওঠা: পানি, মুখ ধোয়া, ৩ কাজ লেখা', '08:00 AM', '08:30 AM', 'high'),
        makeTask('নাস্তা, তৈরি হওয়া, ব্যাগ গোছানো', '08:30 AM', '09:00 AM', 'normal'),
        makeTask('যাতায়াত + Chinese ১৫ মিনিট (Audio/Flashcard)', '09:00 AM', '10:00 AM', 'high'),
        makeTask('Internship (১০:০০ AM – ১:১৫ PM)', '10:00 AM', '01:15 PM', 'high'),
        makeTask('Johor — Internship-এর বিরতিতে নামাজ + দুপুরের খাবার', '01:15 PM', '01:45 PM', 'high'),
        makeTask('Internship (১:৪৫ PM – ৩:০০ PM)', '01:45 PM', '03:00 PM', 'high'),
        makeTask('ফেরা + English ১৫–২০ মিনিট (Podcast/Audio)', '03:00 PM', '04:00 PM', 'high'),
        makeTask('বিশ্রাম (সর্বোচ্চ ৩০ মি. বিনোদন)', '04:00 PM', '04:45 PM', 'normal'),
        makeTask('Asr — নামাজ', '04:45 PM', '05:00 PM', 'high'),
        makeTask('Adobe Stock sprint — ৫০ মিনিট: asset তৈরি / finishing / upload', '05:00 PM', '05:55 PM', 'high'),
        makeTask('Maghrib — নামাজ', '06:00 PM', '06:15 PM', 'high'),
        makeTask('হাঁটা (১৫ মিনিট)', '06:15 PM', '06:45 PM', 'normal'),
        makeTask('Isha — নামাজ', '08:00 PM', '08:15 PM', 'high'),
        makeTask('রাতের খাবার + পরিবার', '08:15 PM', '09:15 PM', 'normal'),
        makeTask('Reading — ৫ পৃষ্ঠা', '09:15 PM', '09:35 PM', 'high'),
        makeTask('Wind-down: ফোন চার্জে, কালকের ৩ কাজ, অজু', '10:30 PM', '11:00 PM', 'high'),
        makeTask('ঘুম (১১:০০ PM)', '11:00 PM', undefined, 'high'),
      ];

    // 4: Friday — Adobe Stock Production + Portfolio
    case 4:
      return [
        makeTask('Fajr — অজু ও নামাজ', '05:00 AM', '05:15 AM', 'high'),
        makeTask('চূড়ান্ত ওঠা: পানি, মুখ ধোয়া, ৩ কাজ লেখা', '08:00 AM', '08:30 AM', 'high'),
        makeTask('Chinese — ১৫–২০ মিনিট (শব্দ + শোনা + বলা)', '09:15 AM', '09:35 AM', 'high'),
        makeTask('Adobe Stock Production — সপ্তাহের সবচেয়ে বড় উৎপাদন block (asset তৈরি)', '09:45 AM', '11:15 AM', 'high'),
        makeTask('ব্রেক: চা/নাস্তা, জানালার পাশে হাঁটা', '11:15 AM', '11:45 AM', 'normal'),
        makeTask('Portfolio — ৩০–৪৫ মিনিট (সোমবারের কাজ এগিয়ে নেওয়া)', '11:45 AM', '12:30 PM', 'normal'),
        makeTask('গোসল/প্রস্তুতি, জুমুআর নামাজ, দুপুরের খাবার', '12:30 PM', '02:15 PM', 'high'),
        makeTask('English — ১৫–২০ মিনিট (শোনা/পড়া/বলা)', '02:30 PM', '02:50 PM', 'high'),
        makeTask('Adobe Stock: metadata/title-keyword লেখা ও upload (ঐচ্ছিক)', '02:50 PM', '04:30 PM', 'normal'),
        makeTask('Asr — নামাজ', '04:45 PM', '05:00 PM', 'high'),
        makeTask('হাঁটা (১৫ মিনিট)', '05:00 PM', '05:30 PM', 'normal'),
        makeTask('Maghrib — নামাজ', '06:00 PM', '06:15 PM', 'high'),
        makeTask('ফ্রি সময় / পরিবার / বিনোদন window', '06:15 PM', '07:55 PM', 'normal'),
        makeTask('Isha — নামাজ', '08:00 PM', '08:15 PM', 'high'),
        makeTask('রাতের খাবার + পরিবার', '08:15 PM', '09:15 PM', 'normal'),
        makeTask('Reading — ৫ পৃষ্ঠা', '09:15 PM', '09:35 PM', 'high'),
        makeTask('Wind-down: ফোন বিছানা থেকে দূরে চার্জে, অজু', '10:30 PM', '11:00 PM', 'high'),
        makeTask('ঘুম (১১:০০ PM)', '11:00 PM', undefined, 'high'),
      ];

    // 5: Saturday — Weekly Review + Learning + Reset (Day 1)
    case 5:
      return [
        makeTask('Fajr — অজু ও নামাজ (নামাজের পর ফোন ছাড়া বিছানায়)', '05:00 AM', '05:15 AM', 'high'),
        makeTask('চূড়ান্ত ওঠা: এক গ্লাস পানি, মুখ ধোয়া, জানালা খোলা (ফোন নয়)', '08:00 AM', '08:20 AM', 'high'),
        makeTask('আজকের ৩টি কাজ লেখা (MUST: ফোন Setup + Baseline, SHOULD: 1 Major Skill বাছাই, COULD: আগামী সপ্তাহের লক্ষ্য)', '08:20 AM', '08:30 AM', 'high'),
        makeTask('নাস্তা + পরিবারের সাথে শান্তভাবে দিন শুরু', '08:30 AM', '09:15 AM', 'normal'),
        makeTask('Chinese — ১৫–২০ মিনিট (শব্দ + শোনা)', '09:15 AM', '09:35 AM', 'high'),
        makeTask('Setup & Baseline (২০ মি.) + Deep Work (৪৫ মি.): ১টি Major Skill বাছাই ও ট্র্যাকার সেটআপ', '09:45 AM', '11:15 AM', 'high'),
        makeTask('ব্রেক: চা/নাস্তা, জানালার পাশে হাঁটা (ফোন ছাড়া)', '11:15 AM', '11:45 AM', 'normal'),
        makeTask('Reset: ডেস্ক/ঘর গোছানো, ফাইল-ফোল্ডার সাজানো, ফোন clean-up', '11:45 AM', '12:30 PM', 'normal'),
        makeTask('Johor — নামাজ + দুপুরের খাবার', '01:15 PM', '01:45 PM', 'high'),
        makeTask('বিশ্রাম / দুপুরের ছোট ঘুম (সর্বোচ্চ ৩০ মি.)', '01:45 PM', '02:30 PM', 'normal'),
        makeTask('English — ১৫–২০ মিনিট (শোনা/পড়া/বলা)', '02:30 PM', '02:50 PM', 'high'),
        makeTask('ফ্রি সময় / বিনোদন window (Adobe Stock backlog upload)', '02:50 PM', '04:30 PM', 'normal'),
        makeTask('Asr — নামাজ', '04:45 PM', '05:00 PM', 'high'),
        makeTask('হাঁটা (১৫ মিনিট)', '05:00 PM', '05:30 PM', 'normal'),
        makeTask('Maghrib — নামাজ', '06:00 PM', '06:15 PM', 'high'),
        makeTask('ফ্রি সময় / পরিবার / বিনোদন', '06:15 PM', '07:55 PM', 'normal'),
        makeTask('Isha — নামাজ', '08:00 PM', '08:15 PM', 'high'),
        makeTask('রাতের খাবার + পরিবারের সাথে সময়', '08:15 PM', '09:15 PM', 'normal'),
        makeTask('Reading — ৫ পৃষ্ঠা বই পড়া', '09:15 PM', '09:35 PM', 'high'),
        makeTask('Screen Time দেখে Social Media Limit নোট করা (লক্ষ্য: ≤ ২.৫ ঘণ্টা)', '10:15 PM', '10:30 PM', 'high'),
        makeTask('Wind-down: ফোন চার্জে দূরে, কালকের Internship প্রস্তুতি ও MUST কাজ লেখা, অজু', '10:30 PM', '11:00 PM', 'high'),
        makeTask('ঘুম (১১:০০ PM)', '11:00 PM', undefined, 'high'),
      ];

    // 6: Sunday — Internship + Adobe Stock
    case 6:
      return [
        makeTask('Fajr — অজু ও নামাজ', '05:00 AM', '05:15 AM', 'high'),
        makeTask('চূড়ান্ত ওঠা: পানি, মুখ ধোয়া, ৩ কাজ লেখা (MUST: Adobe Stock 1 asset, SHOULD: Title-keyword, COULD: আইডিয়া)', '08:00 AM', '08:30 AM', 'high'),
        makeTask('নাস্তা, তৈরি হওয়া, ব্যাগ গোছানো', '08:30 AM', '09:00 AM', 'normal'),
        makeTask('যাতায়াত + Chinese ১৫ মিনিট (Audio/Flashcard)', '09:00 AM', '10:00 AM', 'high'),
        makeTask('Internship (১০:০০ AM – ১:১৫ PM)', '10:00 AM', '01:15 PM', 'high'),
        makeTask('Johor — Internship-এর বিরতিতে নামাজ + দুপুরের খাবার', '01:15 PM', '01:45 PM', 'high'),
        makeTask('Internship (১:৪৫ PM – ৩:০০ PM)', '01:45 PM', '03:00 PM', 'high'),
        makeTask('ফেরা + English ১৫–২০ মিনিট (Podcast/Audio)', '03:00 PM', '04:00 PM', 'high'),
        makeTask('বিশ্রাম (সর্বোচ্চ ৩০ মি. বিনোদন)', '04:00 PM', '04:45 PM', 'normal'),
        makeTask('Asr — নামাজ', '04:45 PM', '05:00 PM', 'high'),
        makeTask('Adobe Stock sprint — ৫০ মিনিট: asset তৈরি / finishing / keyword ও upload', '05:00 PM', '05:55 PM', 'high'),
        makeTask('Maghrib — নামাজ', '06:00 PM', '06:15 PM', 'high'),
        makeTask('হাঁটা (১৫ মিনিট)', '06:15 PM', '06:45 PM', 'normal'),
        makeTask('Isha — নামাজ', '08:00 PM', '08:15 PM', 'high'),
        makeTask('রাতের খাবার + পরিবার', '08:15 PM', '09:15 PM', 'normal'),
        makeTask('Reading — ৫ পৃষ্ঠা', '09:15 PM', '09:35 PM', 'high'),
        makeTask('Wind-down: ফোন চার্জে, কালকের ৩ কাজ লেখা, অজু', '10:30 PM', '11:00 PM', 'high'),
        makeTask('ঘুম (১১:০০ PM)', '11:00 PM', undefined, 'high'),
      ];

    default:
      return [];
  }
}

export function generateShakibMasterPlannerState(weekStart: string): PlannerState {
  const daysInfo = getWeekDaysInfo(weekStart);

  const days: DayPlan[] = daysInfo.map((info) => ({
    date: info.dateStr,
    note: getDayThemeNote(info.dayIndex),
    tasks: getShakibDayTasks(info.dayIndex),
    waterGlasses: 0,
    winOfTheDay: '',
  }));

  return {
    weekStart,
    focus: 'Discipline Reset Phase 1: ঘুম ও নামাজ ঠিক করা (Fixed Anchors)',
    objective: 'বাস্তবসম্মত · ধাপে ধাপে · টেকসই — “perfect” হওয়ার জন্য নয়, নিজের কথা রাখার অভ্যাসের জন্য।',
    reward: 'সপ্তাহ শেষে অপরাধবোধহীন ফ্রি টাইম ও রিল্যাক্সেশন ✨',
    days,
    habits: SHAKIB_HABITS,
    review: {
      wentWell: '',
      challenges: '',
      achievement: '',
      lesson: '',
      nextWeekPriority: 'Phase 2-তে উত্তরণ এবং Deep Work সময় বাড়ানো',
    },
    masterTodos: [
      {
        id: 'st-1',
        title: 'Digital Wellbeing-এ Facebook ও YouTube-এর সীমা ৭৫ মিনিট করে সেট করা',
        completed: false,
        priority: 'urgent',
        category: 'personal',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'st-2',
        title: '৩০ দিনের জন্য ১টি Major Skill বাছাই করা (New Skill Development)',
        completed: false,
        priority: 'high',
        category: 'study',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'st-3',
        title: 'ফোন বিছানা থেকে দূরে টেবিল বা অন্য প্রান্তে চার্জে রাখার অভ্যাস করা',
        completed: false,
        priority: 'high',
        category: 'personal',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'st-4',
        title: 'Adobe Stock-এর জন্য ৩টি নতুন অ্যাসেট ডিজাইন তৈরি করা (Phase 1 লক্ষ্য)',
        completed: false,
        priority: 'normal',
        category: 'work',
        createdAt: new Date().toISOString(),
      },
    ],
    longTermGoals: [
      {
        id: 'lg-1',
        title: '৩০ দিনের Discipline Reset সফলভাবে সম্পন্ন করা (Day 1 to Day 30)',
        timeframe: '১ নভেম্বর ২০২৬',
        category: 'personal',
        progress: 3,
        milestones: [
          { id: 'm-1', title: 'Phase 1: ঘুম ও নামাজ ঠিক করা (Day 1–7)', completed: false },
          { id: 'm-2', title: 'Phase 2: কাঠামো ও Deep Work (Day 8–14)', completed: false },
          { id: 'm-3', title: 'Phase 3: ফলাফল ও ক্রিয়েশন (Day 15–21)', completed: false },
          { id: 'm-4', title: 'Phase 4: স্থিতি ও স্বয়ংক্রিয়তা (Day 22–30)', completed: false },
        ],
      },
    ],
    shortTermGoals: [
      {
        id: 'sg-1',
        title: 'Fajr-এ ওটার হার সপ্তাহে কমপক্ষে ৫ দিন রাখা',
        deadline: '৯ অক্টোবর (Day 7)',
        category: 'personal',
        status: 'in_progress',
      },
      {
        id: 'sg-2',
        title: 'Social Media স্ক্রিন টাইম দৈনিক ২.৫ ঘণ্টার নিচে নামিয়ে আনা',
        deadline: '৯ অক্টোবর',
        category: 'personal',
        status: 'in_progress',
      },
    ],
  };
}

function getDayThemeNote(dayIndex: number): string {
  switch (dayIndex) {
    case 0:
      return '🎨 থিম: Portfolio + Deep Work (সপ্তাহের শুরুতে সবচেয়ে ফ্রেশ মাথা দিয়ে কঠিন প্রজেক্ট)';
    case 1:
      return '💼 থিম: Internship + Light Learning (১০-৩টা ইন্টার্নশিপ, বিকেলে হালকা শেখা)';
    case 2:
      return '🚀 থিম: New Skill Development (Deep Work ব্লকে নতুন স্কিল শেখা ও অনুশীলন)';
    case 3:
      return '💼 থিম: Internship + Adobe Stock (বিকেলে ৫০ মিনিট অ্যাডোবি স্টক স্প্রিন্ট)';
    case 4:
      return '⭐ থিম: Adobe Stock Production + Portfolio (সকালের বড় উৎপাদন ব্লক, জুমুআ ও পোর্টফোলিও)';
    case 5:
      return '📋 থিম: Weekly Review + Learning + Reset (সপ্তাহের পর্যালোচনা, গোছানো ও নতুন শক্তি সঞ্চয়)';
    case 6:
      return '💼 থিম: Internship + Adobe Stock (ইন্টার্নশিপ ও সন্ধ্যায় অ্যাডোবি স্টক তৈরি/আপলোড)';
    default:
      return '';
  }
}
