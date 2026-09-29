import React, { useState } from 'react';
import { User, Bunny } from '../types';
import { BUNNY_BREED_PRESETS } from '../data/initialData';
import { X, Gift, Check, Sparkles, LogOut } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onAuthSuccess: (user: User, isNewRegistration: boolean) => void;
  onLogout: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
  onLogout,
}) => {
  const [customName, setCustomName] = useState(
    currentUser.email !== 'traveler@usagi.realm' ? currentUser.name : ''
  );
  const [customEmail, setCustomEmail] = useState(
    currentUser.email !== 'traveler@usagi.realm' ? currentUser.email : ''
  );
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const isLoggedIn = currentUser.email !== 'traveler@usagi.realm';

  const handleGoogleSignIn = (isSignUp: boolean) => {
    setIsLoading(true);
    audioEngine.playSlotTickSound();

    setTimeout(() => {
      setIsLoading(false);
      const name = customName.trim() || 'Người Dùng Google ' + Math.floor(100 + Math.random() * 900);
      const email = customEmail.trim() || `user.${Date.now().toString().slice(-4)}@gmail.com`;

      if (isSignUp) {
        // First-time registration rewards: 1 random bunny, 20 food, 20 carrots, 10 toys
        const preset = BUNNY_BREED_PRESETS[Math.floor(Math.random() * BUNNY_BREED_PRESETS.length)];
        const welcomeBunny: Bunny = {
          id: 'bunny-' + Date.now(),
          name: 'Bé ' + ['Mochi', 'Mây', 'Bông', 'Kẹo', 'Nắng'][Math.floor(Math.random() * 5)],
          colorName: preset.colorName,
          furColor: preset.furColor,
          accentColor: preset.accentColor,
          rarity: preset.rarity,
          hunger: 100,
          happiness: 100,
          hygiene: 100,
          level: 1,
          exp: 0,
          maxExp: 100,
          x: 50,
          y: 50,
          dx: 0.1,
          dy: 0.1,
          isOwner: true,
          ownerName: name,
          state: 'happy',
          personality: preset.personality,
        };

        const newUser: User = {
          id: 'user-google-' + Date.now(),
          name,
          email,
          avatar: '/src/assets/images/rabbit_avatar_mascot_1790619378795.jpg',
          carrots: 20,
          foodBags: 20,
          toys: 10,
          rabbits: [welcomeBunny],
          registeredAt: new Date().toLocaleDateString('vi-VN'),
          lastLoginDate: new Date().toLocaleDateString('vi-VN'),
        };

        audioEngine.playSlotWinSound();
        onAuthSuccess(newUser, true);
      } else {
        // Daily login bonus: +10 carrots, +5 toys
        const updatedUser: User = {
          ...currentUser,
          name,
          email,
          carrots: currentUser.carrots + 10,
          toys: currentUser.toys + 5,
          lastLoginDate: new Date().toLocaleDateString('vi-VN'),
        };

        audioEngine.playSlotWinSound();
        onAuthSuccess(updatedUser, false);
      }
      onClose();
    }, 1000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in"
    >
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-sky-300/60 dark:border-sky-700/50 shadow-2xl text-slate-800 dark:text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white shadow-md border border-slate-200 flex items-center justify-center mb-3">
            {/* Google G Logo SVG */}
            <svg className="w-8 h-8" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {isLoggedIn ? 'Tài Khoản Của Bạn' : 'Đăng Nhập / Đăng Ký'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Đăng nhập qua Google để lưu trữ dữ liệu thỏ và nhận quà tặng đặc biệt!
          </p>
        </div>

        {/* Gift Highlights Banner */}
        <div className="my-5 p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-sky-50 dark:from-slate-900 dark:to-sky-950/40 border border-amber-200/80 dark:border-amber-800/60 text-xs">
          <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-1.5">
            <Gift className="w-4 h-4" />
            Đặc quyền nhận quà hấp dẫn:
          </div>
          <ul className="space-y-1 text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
            <li className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
              <span>
                <strong>Đăng ký lần đầu:</strong> Tặng 1 Bé Thỏ ngẫu nhiên + 20 túi thức ăn + 20 củ cà rốt + 10 đồ chơi!
              </span>
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="w-3 h-3 text-sky-500 shrink-0" />
              <span>
                <strong>Mỗi lần đăng nhập:</strong> Tặng ngay 10 củ cà rốt + 5 đồ chơi!
              </span>
            </li>
          </ul>
        </div>

        {isLoggedIn ? (
          /* Logged In Info View */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl glass-panel border border-sky-200 dark:border-sky-800 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-sky-200 shrink-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900 dark:text-white truncate flex items-center gap-1.5 flex-wrap">
                  <span>{currentUser.name}</span>
                  {currentUser.equippedBadge && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-800 dark:text-amber-300 text-[10px] font-bold border border-amber-400/50">
                      {currentUser.equippedBadge}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {currentUser.email}
                </div>
                <div className="text-[11px] text-sky-600 dark:text-sky-400 mt-1">
                  Đang sở hữu {currentUser.rabbits.length} bé thỏ
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleGoogleSignIn(false)}
                disabled={isLoading}
                className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium text-xs shadow-sm transition-colors"
              >
                Nhận Điểm Danh Hôm Nay (+10 🥕, +5 🧸)
              </button>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="px-4 py-2.5 rounded-xl border border-rose-300 dark:border-rose-700 text-rose-600 dark:text-rose-400 font-medium text-xs hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Đăng xuất
              </button>
            </div>
          </div>
        ) : (
          /* Sign-in / Sign-up Form View */
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Tên hiển thị (Tùy chọn)
              </label>
              <input
                type="text"
                placeholder="Nhập tên hoặc biệt danh của bạn..."
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-sky-200 dark:border-sky-800 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Gmail (Tùy chọn)
              </label>
              <input
                type="email"
                placeholder="your.email@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-sky-200 dark:border-sky-800 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50"
              />
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => handleGoogleSignIn(true)}
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>🐰</span>
                <span>
                  {isLoading ? 'Đang kết nối Google...' : 'Đăng Ký Mới Qua Google (Nhận Gói Tân Thủ)'}
                </span>
              </button>

              <button
                onClick={() => handleGoogleSignIn(false)}
                disabled={isLoading}
                className="w-full py-2.5 rounded-2xl border border-sky-200 dark:border-sky-800 hover:bg-sky-50 dark:hover:bg-slate-800 text-sky-700 dark:text-sky-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Đã có tài khoản? Đăng nhập Google (+10 🥕, +5 🧸)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
