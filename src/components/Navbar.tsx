import React, { useState, useEffect } from 'react';
import { User, Announcement } from '../types';
import { LalapineLogo } from './LalapineLogo';
import { dailyQuestManager } from '../utils/dailyQuestManager';
import {
  PixelRabbitIcon,
  PixelHutch,
  PixelMeadow,
  PixelCommunity,
  PixelBell,
  PixelSun,
  PixelMoon,
  PixelUserIcon,
  PixelQuestIcon,
  PixelCarrot,
  PixelFoodBag,
  PixelSparkle,
} from './PixelSprites';

interface NavbarProps {
  activeTab: 'bots' | 'hutch' | 'meadow' | 'community' | 'shop';
  setActiveTab: (tab: 'bots' | 'hutch' | 'meadow' | 'community') => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  user: User;
  onOpenAuth: () => void;
  onOpenNotifications: () => void;
  onOpenRandomBot: () => void;
  onOpenShop?: () => void;
  onOpenDailyQuests?: () => void;
  announcements: Announcement[];
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  toggleDarkMode,
  user,
  onOpenAuth,
  onOpenNotifications,
  onOpenRandomBot: _onOpenRandomBot,
  onOpenShop: _onOpenShop,
  onOpenDailyQuests,
  announcements,
}) => {
  const [unclaimedQuestsCount, setUnclaimedQuestsCount] = useState(0);
  const unreadCount = announcements.filter((a) => !a.read).length;

  useEffect(() => {
    const unsub = dailyQuestManager.subscribe((quests) => {
      setUnclaimedQuestsCount(quests.filter((q) => q.completed && !q.claimed).length);
    });
    return unsub;
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-sky-200/80 dark:border-sky-900/60 transition-colors duration-200 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Zone 1: la Lapine Crescent Rabbit Moon Logo & Wordmark */}
        <button
          onClick={() => setActiveTab('bots')}
          className="flex items-center gap-2.5 text-left group shrink-0 focus:outline-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-200/60 via-cyan-100/60 to-blue-100/50 dark:from-sky-950/60 dark:to-cyan-900/60 p-0.5 border-2 border-sky-300 dark:border-sky-700 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform pixel-box">
            <LalapineLogo className="w-8 h-8" />
          </div>
          <div>
            <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-sky-100 flex items-center gap-1.5">
              la Lapine
              <PixelSparkle size={14} color="#38bdf8" className="animate-sparkle" />
            </span>
          </div>
        </button>

        {/* Zone 2: Pixel Navigation links */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('bots')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'bots'
                ? 'bg-sky-500 text-white shadow-2xs font-bold pixel-tag'
                : 'text-slate-800 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-300 hover:bg-sky-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <PixelRabbitIcon size={18} className="shrink-0" />
            <span>Trại Thỏ</span>
          </button>

          <button
            onClick={() => setActiveTab('hutch')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'hutch'
                ? 'bg-sky-600 text-white shadow-2xs font-bold pixel-tag'
                : 'text-slate-800 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-300 hover:bg-sky-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <PixelHutch size={18} className="shrink-0" />
            <span>Chuồng Thỏ</span>
          </button>

          <button
            onClick={() => setActiveTab('meadow')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'meadow'
                ? 'bg-emerald-500 text-white shadow-2xs font-bold pixel-tag'
                : 'text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <PixelMeadow size={18} className="shrink-0" />
            <span>Đồng Cỏ Thỏ</span>
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'community'
                ? 'bg-indigo-600 text-white shadow-2xs font-bold pixel-tag'
                : 'text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <PixelCommunity size={18} className="shrink-0" />
            <span>Thảo Luận</span>
          </button>
        </nav>

        {/* Zone 3: Actions (Daily Quests, Mailbox, Theme, User Profile) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Daily Quests Button */}
          {onOpenDailyQuests && (
            <button
              onClick={onOpenDailyQuests}
              aria-label="Nhiệm vụ hằng ngày"
              title="Nhiệm Vụ Hằng Ngày · Nhận Cà Rốt & Quà"
              className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border-2 border-amber-300 dark:border-amber-700 bg-gradient-to-r from-amber-50 to-amber-100/90 dark:from-amber-950/60 dark:to-slate-900/80 hover:from-amber-100 hover:to-amber-200 text-amber-950 dark:text-amber-100 text-xs font-bold transition-all shadow-2xs hover:scale-105 active:scale-95 pixel-tag"
            >
              <PixelQuestIcon size={18} className="shrink-0" />
              <span className="hidden sm:inline">Nhiệm Vụ</span>
              {unclaimedQuestsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
              )}
              {unclaimedQuestsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white dark:border-slate-900" />
              )}
            </button>
          )}

          {/* Notifications Mailbox */}
          <button
            onClick={onOpenNotifications}
            aria-label="Hộp thư thông báo"
            title="Hộp thư thông báo"
            className="relative p-2 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-sky-100 dark:hover:bg-slate-800 transition-colors"
          >
            <PixelBell size={20} className="shrink-0" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
            )}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white dark:border-slate-900" />
            )}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label="Đổi chế độ sáng tối"
            title="Đổi chế độ sáng tối"
            className="p-2 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-sky-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <PixelSun size={20} className="shrink-0" /> : <PixelMoon size={20} className="shrink-0" />}
          </button>

          {/* User profile / Inventory pills */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border-2 border-sky-200 dark:border-sky-800 bg-white/90 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-2xs pixel-tag"
          >
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-sky-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <PixelUserIcon size={18} />
              )}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[100px]">
                  {user.name}
                </span>
                {user.equippedBadge && (
                  <span
                    className="px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-800 dark:text-amber-300 text-[9px] font-extrabold border border-amber-400/40 truncate max-w-[105px]"
                    title={user.equippedBadge}
                  >
                    {user.equippedBadge}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <PixelCarrot size={13} /> {user.carrots}
                </span>
                <span className="flex items-center gap-1">
                  <PixelFoodBag size={13} /> {user.foodBags}
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
