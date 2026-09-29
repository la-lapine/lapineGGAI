/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, CharacterBot, Announcement } from './types';
import {
  INITIAL_BOTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_USER,
} from './data/initialData';
import { fetchPublicProfilesFromGithub } from './utils/githubProfileParser';
import { audioEngine } from './utils/audioEngine';
import { Navbar } from './components/Navbar';
import { BotShowcase } from './components/BotShowcase';
import { BotProfileModal } from './components/BotProfileModal';
import { BotChatModal } from './components/BotChatModal';
import { RandomBotModal } from './components/RandomBotModal';
import { RabbitHutch } from './components/RabbitHutch';
import { PublicMeadow } from './components/PublicMeadow';
import { Shop } from './components/Shop';
import { CommunityBoard } from './components/CommunityBoard';
import { NotificationModal } from './components/NotificationModal';
import { FloatingNotificationDock } from './components/FloatingNotificationDock';
import { DailyQuestModal } from './components/DailyQuestModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { MusicPlayer } from './components/MusicPlayer';
import { BackToTop } from './components/BackToTop';
import { SnowfallOverlay } from './components/SnowfallOverlay';
import { AgeGateScreen } from './components/AgeGateScreen';
import { LalapineLogo } from './components/LalapineLogo';
import { Heart } from 'lucide-react';

const USER_STORAGE_KEY = 'lalapine_user_v2';
const ANNOUNCEMENTS_STORAGE_KEY = 'lalapine_announcements_v2';
const THEME_STORAGE_KEY = 'lalapine_theme_v2';

export default function App() {
  // Age Verification Gate state: shown first upon site access
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('lalapine_age_verified') === 'true';
    } catch {
      return false;
    }
  });

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved) return saved === 'dark';
    return false; // default light pastel
  });

  // User state
  const [user, setUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_USER;
  });

  // Announcements state
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  // Bots state (Public Profiles automatically loaded from GitHub .txt)
  const [bots, setBots] = useState<CharacterBot[]>(() => {
    try {
      const saved = localStorage.getItem('lalapine_bots_public_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_BOTS; // Empty array by default until fetched
  });

  // Active navigation tab: Trại Thỏ, Chuồng thỏ, Đồng cỏ thỏ, Thảo luận
  const [activeTab, setActiveTab] = useState<'bots' | 'hutch' | 'meadow' | 'community'>('bots');

  // Modals state
  const [selectedProfileBot, setSelectedProfileBot] = useState<CharacterBot | null>(null);
  const [activeChatBot, setActiveChatBot] = useState<CharacterBot | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isRandomBotOpen, setIsRandomBotOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isDailyQuestOpen, setIsDailyQuestOpen] = useState(false);

  // Check-in & Welcome Back Reward Modal state
  const [checkInModal, setCheckInModal] = useState<{
    type: 'daily' | 'welcome_back';
    carrots: number;
    foodBags: number;
    toys: number;
  } | null>(null);

  // Sync theme with HTML document class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'light');
    }
  }, [isDarkMode]);

  // Sync user state to localStorage and handle daily interaction reset
  useEffect(() => {
    const today = new Date().toLocaleDateString('vi-VN');
    if (user.lastInteractionDate && user.lastInteractionDate !== today) {
      setUser(prev => ({ ...prev, interactionsToday: 0, lastInteractionDate: today }));
      return;
    }

    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch {
      // storage full or disabled
    }
  }, [user]);

  // Automatically load public profiles from GitHub raw txt on startup
  useEffect(() => {
    let isMounted = true;
    fetchPublicProfilesFromGithub().then((publicBots) => {
      if (isMounted && publicBots.length > 0) {
        setBots(publicBots);
        try {
          localStorage.setItem('lalapine_bots_public_v2', JSON.stringify(publicBots));
        } catch {
          // ignore
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Start music automatically on first user click anywhere in the app
  useEffect(() => {
    const handleFirstInteraction = () => {
      audioEngine.tryAutoPlayOnFirstInteraction();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  // Check-in & Welcome Back Reward System for registered users
  useEffect(() => {
    if (user.id === 'guest-rabbit-traveler' || user.email === 'traveler@lalapine.world') {
      return;
    }

    const todayStr = new Date().toLocaleDateString('vi-VN');
    const lastLogin = user.lastLoginDate;

    if (!lastLogin || lastLogin !== todayStr) {
      let daysDiff = 0;
      if (lastLogin) {
        const parts = lastLogin.split('/');
        if (parts.length === 3) {
          const lastDateObj = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
          const nowObj = new Date();
          daysDiff = Math.floor((nowObj.getTime() - lastDateObj.getTime()) / (1000 * 60 * 60 * 24));
        }
      }

      if (daysDiff >= 3) {
        // Quà Trở Lại: sau 3 ngày không vào web -> 30 túi thức ăn + 60 cà rốt + 25 đồ chơi!
        const updatedUser: User = {
          ...user,
          carrots: user.carrots + 60,
          foodBags: user.foodBags + 30,
          toys: user.toys + 25,
          lastLoginDate: todayStr,
        };
        setUser(updatedUser);
        setCheckInModal({
          type: 'welcome_back',
          carrots: 60,
          foodBags: 30,
          toys: 25,
        });
        audioEngine.playSlotWinSound();
      } else if (daysDiff >= 1 || !lastLogin) {
        // Daily Check-In Bonus: +15 cà rốt, +5 túi thức ăn, +5 đồ chơi!
        const updatedUser: User = {
          ...user,
          carrots: user.carrots + 15,
          foodBags: user.foodBags + 5,
          toys: user.toys + 5,
          lastLoginDate: todayStr,
        };
        setUser(updatedUser);
        setCheckInModal({
          type: 'daily',
          carrots: 15,
          foodBags: 5,
          toys: 5,
        });
        audioEngine.playChimeSound();
      }
    }
  }, [user.id, user.lastLoginDate]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleAuthSuccess = (newUser: User, isNewRegistration: boolean) => {
    setUser(newUser);
    if (isNewRegistration) {
      // Add a celebration welcome announcement
      const welcomeAnn: Announcement = {
        id: 'ann-reg-' + Date.now(),
        title: `Chào mừng ${newUser.name} gia nhập la Lapine!`,
        content: `Chúc mừng bạn đã nhận thành công: 1 Bé Thỏ đặc biệt (${newUser.rabbits[0]?.name}), 20 túi thức ăn, 20 củ cà rốt và 10 đồ chơi! Hãy ghé thăm Chuồng Thỏ và ghé Tiệm Bách Hóa sắm thêm đồ nhé!`,
        date: new Date().toLocaleDateString('vi-VN'),
        read: false,
        priority: 'important',
      };
      setAnnouncements((prev) => [welcomeAnn, ...prev]);
    }
  };

  const handleLogout = () => {
    setUser(INITIAL_USER);
  };

  const handleMarkAllAnnouncementsAsRead = () => {
    setAnnouncements((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const handleToggleAnnouncementRead = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
  };

  const handleAddAnnouncement = (title: string, content: string) => {
    const newAnn: Announcement = {
      id: 'ann-' + Date.now(),
      title,
      content,
      date: new Date().toLocaleDateString('vi-VN'),
      read: false,
      priority: 'important',
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const handleStartChatFromProfile = (bot: CharacterBot) => {
    setSelectedProfileBot(null);
    setActiveChatBot(bot);
  };

  const handleAgeConfirm = () => {
    setIsAgeVerified(true);
    try {
      sessionStorage.setItem('lalapine_age_verified', 'true');
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500 relative selection:bg-sky-400 selection:text-white">
      {/* 
        Aesthetic Pixel Art Cute Bunny Wallpapers:
        - Light mode: cute retro 16-bit pixel pastel baby blue meadow with starflowers & bunnies under crescent moon
        - Dark mode: cute deep midnight indigo starry sky with glowing pixel stars & pixel crescent moon
      */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Light theme aesthetic pixel background */}
        <img
          src="/src/assets/images/pixel_home_pastel_1790622475023.jpg"
          alt="la Lapine aesthetic pastel pixel wallpaper"
          referrerPolicy="no-referrer"
          style={{ imageRendering: 'pixelated' }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            isDarkMode ? 'opacity-0' : 'opacity-85'
          }`}
        />
        {/* Dark theme aesthetic pixel background */}
        <img
          src="/src/assets/images/pixel_home_dark_1790622502810.jpg"
          alt="la Lapine deep night starry pixel wallpaper"
          referrerPolicy="no-referrer"
          style={{ imageRendering: 'pixelated' }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            isDarkMode ? 'opacity-90' : 'opacity-0'
          }`}
        />
        {/* Delicate tonal translucent overlay for optimal contrast */}
        <div className="absolute inset-0 bg-[#f0f9ff]/45 dark:bg-[#070d18]/55" />
      </div>

      {/* Gentle Fullscreen Snowfall Effect Overlay */}
      <SnowfallOverlay />

      {/* Mandatory First-Access Age Gate Screen if not yet verified */}
      {!isAgeVerified ? (
        <AgeGateScreen onConfirm={handleAgeConfirm} />
      ) : (
        <>
          {/* Top Navigation Bar with la Lapine Logo, Daily Quests, Notifications */}
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            user={user}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenRandomBot={() => setIsRandomBotOpen(true)}
            onOpenShop={() => setIsShopOpen(true)}
            onOpenDailyQuests={() => setIsDailyQuestOpen(true)}
            announcements={announcements}
          />

          {/* Main Content Area */}
          <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
            {activeTab === 'bots' && (
              <BotShowcase
                bots={bots}
                onSelectBot={(bot) => setSelectedProfileBot(bot)}
                onOpenSlotMachine={() => setIsRandomBotOpen(true)}
              />
            )}

            {activeTab === 'hutch' && (
              <RabbitHutch
                user={user}
                onUpdateUser={handleUpdateUser}
                onGoToMeadow={() => setActiveTab('meadow')}
                onGoToShop={() => setIsShopOpen(true)}
                onOpenAuth={() => setIsAuthModalOpen(true)}
              />
            )}

            {activeTab === 'meadow' && (
              <PublicMeadow
                user={user}
                onUpdateUser={handleUpdateUser}
              />
            )}

            {activeTab === 'community' && (
              <CommunityBoard
                currentUser={user}
              />
            )}
          </main>

          {/* Floating Vinyl Music Player at Bottom-Left */}
          <MusicPlayer />

          {/* Floating Notification Dock at Bottom-Right */}
          <FloatingNotificationDock
            announcements={announcements}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onToggleRead={handleToggleAnnouncementRead}
          />

          {/* Floating Back To Top Button */}
          <BackToTop />

          {/* Shop Pop-up Modal */}
          {isShopOpen && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Cửa Hàng la Lapine"
              className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-in fade-in"
              onClick={(e) => {
                if (e.target === e.currentTarget) setIsShopOpen(false);
              }}
            >
              <div className="relative w-full max-w-5xl my-auto animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl">
                <Shop
                  user={user}
                  onUpdateUser={handleUpdateUser}
                  onGoToHutch={() => {
                    setIsShopOpen(false);
                    setActiveTab('hutch');
                  }}
                  onClose={() => setIsShopOpen(false)}
                />
              </div>
            </div>
          )}

          {/* Modals & Dialogs */}
          <RandomBotModal
            isOpen={isRandomBotOpen}
            onClose={() => setIsRandomBotOpen(false)}
            bots={bots}
            onSelectBot={(bot) => setSelectedProfileBot(bot)}
          />

          <BotProfileModal
            bot={selectedProfileBot}
            onClose={() => setSelectedProfileBot(null)}
            onStartChat={handleStartChatFromProfile}
          />

          <BotChatModal
            bot={activeChatBot}
            onClose={() => setActiveChatBot(null)}
          />

          <NotificationModal
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            announcements={announcements}
            onMarkAllAsRead={handleMarkAllAnnouncementsAsRead}
            onToggleRead={handleToggleAnnouncementRead}
            onAddAnnouncement={handleAddAnnouncement}
          />

          <GoogleAuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            currentUser={user}
            onAuthSuccess={handleAuthSuccess}
            onLogout={handleLogout}
          />

          {/* Daily Quests Modal */}
          {isDailyQuestOpen && (
            <DailyQuestModal
              user={user}
              onUpdateUser={handleUpdateUser}
              onClose={() => setIsDailyQuestOpen(false)}
              onNavigateTab={(tab) => {
                setIsDailyQuestOpen(false);
                setActiveTab(tab);
              }}
            />
          )}

          {/* Daily Check-In & Welcome Back Reward Modal */}
          {checkInModal && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in"
            >
              <div className="relative w-full max-w-md glass-panel pixel-box rounded-3xl p-6 sm:p-8 text-center space-y-4 border-2 border-sky-400 shadow-2xl text-slate-900 dark:text-white my-auto">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-amber-300 via-sky-300 to-indigo-400 flex items-center justify-center text-3xl shadow-lg animate-bounce border-2 border-white">
                  {checkInModal.type === 'welcome_back' ? '🎁' : '⭐'}
                </div>

                <div className="space-y-1">
                  <h3 className="font-display font-black text-2xl text-slate-900 dark:text-white">
                    {checkInModal.type === 'welcome_back'
                      ? 'Quà Trở Lại Đặc Biệt! 💖'
                      : 'Điểm Danh Mỗi Ngày! 🌟'}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {checkInModal.type === 'welcome_back'
                      ? 'Cảm ơn bạn đã quay trở lại sau 3 ngày! Nhận ngay phần quà hỗ trợ đặc biệt:'
                      : 'Chúc mừng bạn đăng nhập hôm nay! Nhận phần thưởng điểm danh:'}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-sky-50 dark:bg-slate-900 border border-sky-200 dark:border-sky-800">
                  <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-xs font-bold flex flex-col items-center">
                    <span className="text-lg">🥕</span>
                    <span>+{checkInModal.carrots} Cà rốt</span>
                  </div>
                  <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-900 dark:text-sky-200 text-xs font-bold flex flex-col items-center">
                    <span className="text-lg">🌾</span>
                    <span>+{checkInModal.foodBags} Thức ăn</span>
                  </div>
                  <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-900 dark:text-pink-200 text-xs font-bold flex flex-col items-center">
                    <span className="text-lg">🧸</span>
                    <span>+{checkInModal.toys} Đồ chơi</span>
                  </div>
                </div>

                <button
                  onClick={() => setCheckInModal(null)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-extrabold text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer border-2 border-white/40"
                >
                  Cảm Ơn & Nhận Quà 🌸
                </button>
              </div>
            </div>
          )}

          {/* Aesthetic Footer with la Lapine Logo */}
          <footer className="relative z-10 border-t border-sky-200/60 dark:border-sky-900/40 glass-panel py-6 px-4 mt-12 text-center text-xs text-slate-600 dark:text-slate-400 bg-white/60 dark:bg-slate-950/60">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <LalapineLogo className="w-5 h-5" />
                <span className="font-display font-bold text-slate-900 dark:text-slate-100">
                  la Lapine
                </span>
                <span aria-hidden="true">·</span>
                <span>Trại Thỏ & Cánh Đồng Thỏ Thơ Mộng</span>
              </div>
              <div className="flex items-center gap-1 text-[11px]">
                <span>Được tạo tác với tình yêu loài thỏ & giai điệu lofi êm đềm</span>
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-current ml-0.5" />
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
