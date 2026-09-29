import React from 'react';
import {
  CalendarDays,
  Target,
  Compass,
  Calendar,
  Clock,
} from 'lucide-react';

export type PlannerViewMode = 'monthly' | 'planner' | 'focus' | 'mindset' | 'timer';

interface NavigationTabsProps {
  currentTab: PlannerViewMode;
  onChangeTab: (tab: PlannerViewMode) => void;
  tasksCount?: number;
  habitsCount?: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  currentTab,
  onChangeTab,
  tasksCount,
}) => {
  const tabs = [
    {
      id: 'monthly',
      label: 'মাসিক হ্যাবিট ট্র্যাকার (Google Sheets)',
      icon: Calendar,
      badge: 'Hero',
    },
    {
      id: 'planner',
      label: 'দৈনিক প্ল্যানার ও কাজ (Daily Planner)',
      icon: CalendarDays,
      count: tasksCount,
    },
    {
      id: 'focus',
      label: 'লক্ষ্য ও প্রায়োরিটি (Goals & Focus)',
      icon: Target,
    },
    {
      id: 'mindset',
      label: 'সাপ্তাহিক রিভিউ (Weekly Review)',
      icon: Compass,
    },
    {
      id: 'timer',
      label: 'ফোকাস টাইমার (Pomodoro)',
      icon: Clock,
    },
  ] as const;

  return (
    <div className="w-full bg-white/80 dark:bg-[#0B0F17]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 sticky top-[61px] z-20 transition-colors shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto no-scrollbar py-2.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChangeTab(tab.id as PlannerViewMode)}
                className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap select-none ${
                  isActive
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md ring-1 ring-slate-900/10 dark:ring-white/20 scale-[1.01]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-amber-400 dark:text-amber-500' : 'text-slate-400'
                  }`}
                />
                <span>{tab.label}</span>
                {'badge' in tab && tab.badge && (
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-mono font-bold tracking-wider ${
                      isActive
                        ? 'bg-amber-400/20 text-amber-300 dark:text-amber-700'
                        : 'bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
                {'count' in tab && tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold transition-colors ${
                      isActive
                        ? 'bg-white/20 dark:bg-slate-900/20 text-white dark:text-slate-900'
                        : 'bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
