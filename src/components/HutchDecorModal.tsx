import React, { useState } from 'react';
import { User, HutchThemeItem, Bunny, BunnyStage, BunnyEarType, BunnyPattern } from '../types';
import { HUTCH_THEMES } from '../data/initialData';
import { audioEngine } from '../utils/audioEngine';
import {
  PixelCarrot,
  PixelSparkle,
  PixelBunny,
} from './PixelSprites';
import { Sparkles, X, Check, Palette, Rabbit, Scissors } from 'lucide-react';

interface HutchDecorModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  selectedBunnyIndex: number;
}

export const HutchDecorModal: React.FC<HutchDecorModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  selectedBunnyIndex,
}) => {
  const [activeTab, setActiveTab] = useState<'themes' | 'bunny'>('bunny');
  const [purchaseNotice, setPurchaseNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeBunny = user.rabbits[selectedBunnyIndex];
  const currentThemeId = user.hutchTheme || 'theme_sakura';
  const unlockedThemes = user.unlockedThemes || ['theme_sakura'];

  const handleSelectTheme = (theme: HutchThemeItem) => {
    const isUnlocked = unlockedThemes.includes(theme.id);
    if (isUnlocked) {
      onUpdateUser({
        ...user,
        hutchTheme: theme.id,
      });
      audioEngine.playChimeSound();
      showNotice(`Đã đổi phông nền sang "${theme.name}"! 🌸`);
    } else {
      if (user.carrots < theme.priceCarrots) {
        audioEngine.playThudSound();
        showNotice(`Bạn cần thêm ${theme.priceCarrots - user.carrots} 🥕 cà rốt để mở khóa phông nền này!`);
        return;
      }

      const updatedUser: User = {
        ...user,
        carrots: user.carrots - theme.priceCarrots,
        hutchTheme: theme.id,
        unlockedThemes: [...unlockedThemes, theme.id],
      };
      onUpdateUser(updatedUser);
      audioEngine.playCoinSound();
      showNotice(`🎉 Đã mở khóa và trang trí phông nền "${theme.name}" (-${theme.priceCarrots} 🥕)!`);
    }
  };

  const showNotice = (msg: string) => {
    setPurchaseNotice(msg);
    setTimeout(() => {
      setPurchaseNotice(null);
    }, 3200);
  };

  if (!activeBunny) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Trang Trí Chuồng & Thỏ"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl glass-panel pixel-box rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-800 dark:text-slate-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 mb-5 pr-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-400 to-sky-300 dark:from-pink-600 dark:to-sky-500 flex items-center justify-center text-2xl shadow-md border-2 border-white/60 shrink-0 pixel-box">
              🎨
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-300">
                <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-sparkle" />
                <span>Trang Trí & Phông Cách Thỏ</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                Trang Trí la Lapine
              </h2>
            </div>
          </div>

          {/* User Carrots Balance */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100/90 dark:bg-amber-950/70 border-2 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 font-bold text-xs shrink-0 shadow-2xs pixel-tag">
            <PixelCarrot size={20} className="shrink-0" />
            <span>{user.carrots} Cà Rốt</span>
          </div>
        </div>

        {/* Notice Banner */}
        {purchaseNotice && (
          <div className="mb-4 px-4 py-2 rounded-xl bg-slate-900/95 text-white text-xs font-bold text-center border-2 border-pink-400/80 shadow-md animate-bounce pixel-tag">
            {purchaseNotice}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border-2 border-pink-200 dark:border-pink-900/50 mb-5">
          <button
            onClick={() => setActiveTab('bunny')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'bunny'
                ? 'bg-white dark:bg-slate-800 text-pink-600 dark:text-pink-300 shadow-xs border-2 border-pink-300/80 dark:border-pink-700/60 pixel-tag'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Rabbit className="w-4 h-4" />
            <span>Dáng & Màu Thỏ 🐇</span>
          </button>
          <button
            onClick={() => setActiveTab('themes')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'themes'
                ? 'bg-white dark:bg-slate-800 text-pink-600 dark:text-pink-300 shadow-xs border-2 border-pink-300/80 dark:border-pink-700/60 pixel-tag'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Màu Nền & Phông Nền ({HUTCH_THEMES.length})</span>
          </button>
        </div>

        {/* Tab: Bunny Customization */}
        {activeTab === 'bunny' && (
          <div className="space-y-6">
            {/* Growth Stage Selector */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Giai Đoạn Tăng Trưởng:
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'baby', name: '🍼 Em Bé', desc: 'Cấp 1' },
                  { id: 'juvenile', name: '🐇 Thỏ Vừa', desc: 'Cấp 25' },
                  { id: 'adult', name: '👑 Trưởng Thành', desc: 'Cấp 50' },
                ].map((st) => {
                  const isLocked = (st.id === 'juvenile' && activeBunny.level < 25) || (st.id === 'adult' && activeBunny.level < 50);
                  return (
                    <button
                      key={st.id}
                      disabled={isLocked}
                      onClick={() => {
                        const updated = [...user.rabbits];
                        updated[selectedBunnyIndex] = {
                          ...activeBunny,
                          stage: st.id as BunnyStage,
                        };
                        onUpdateUser({ ...user, rabbits: updated });
                        audioEngine.playSparkleLevelUpSound();
                      }}
                      className={`p-3 rounded-2xl border-2 text-center transition-all ${
                        activeBunny.stage === st.id
                          ? 'border-pink-500 bg-pink-100/90 dark:bg-pink-950/80 font-bold shadow-md'
                          : isLocked 
                            ? 'opacity-50 cursor-not-allowed border-slate-200 bg-slate-100'
                            : 'border-sky-200/80 dark:border-sky-800 bg-white/80 dark:bg-slate-900/60 hover:border-sky-400'
                      }`}
                    >
                      <div className="text-sm font-extrabold">{st.name}</div>
                      <div className="text-[10px] mt-0.5">{isLocked ? `Khóa (Cần Lv.${st.desc.split(' ')[1]})` : st.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fur Color Palette */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Màu Lông ({activeBunny.colorName}):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { name: 'Bạch Tuyết', furColor: '#ffffff', accentColor: '#38bdf8' },
                  { name: 'Trà Sữa', furColor: '#fef3c7', accentColor: '#d97706' },
                  { name: 'Tinh Tú', furColor: '#312e81', accentColor: '#a855f7' },
                  { name: 'Matcha', furColor: '#dcfce7', accentColor: '#22c55e' },
                  { name: 'Hồng Đào', furColor: '#fce7f3', accentColor: '#ec4899' },
                  { name: 'Vàng Mật', furColor: '#fef9c3', accentColor: '#eab308' },
                  { name: 'Đen Nhung', furColor: '#1e293b', accentColor: '#38bdf8' },
                  { name: 'Mây Bạc', furColor: '#e0f2fe', accentColor: '#06b6d4' },
                ].map((palette) => (
                  <button
                    key={palette.name}
                    onClick={() => {
                      const updated = [...user.rabbits];
                      updated[selectedBunnyIndex] = {
                        ...activeBunny,
                        furColor: palette.furColor,
                        accentColor: palette.accentColor,
                        colorName: palette.name,
                      };
                      onUpdateUser({ ...user, rabbits: updated });
                      audioEngine.playChimeSound();
                    }}
                    className={`p-2 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                      activeBunny.furColor === palette.furColor
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-950 font-bold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 hover:border-sky-300'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full border border-slate-300 shadow-2xs"
                      style={{ backgroundColor: palette.furColor }}
                    />
                    <div className="text-[10px] font-bold truncate w-full text-center">{palette.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Ear & Pattern */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-extrabold">Kiểu Tai:</label>
                <select
                  value={activeBunny.earType || 'upright'}
                  onChange={(e) => {
                    const updated = [...user.rabbits];
                    updated[selectedBunnyIndex] = {
                      ...activeBunny,
                      earType: e.target.value as BunnyEarType,
                    };
                    onUpdateUser({ ...user, rabbits: updated });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border-2 border-sky-300 text-xs font-bold"
                >
                  <option value="upright">🐰 Tai Vểnh</option>
                  <option value="lop">🌾 Tai Cụp</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-extrabold">Họa Tiết:</label>
                <select
                  value={activeBunny.pattern || 'solid'}
                  onChange={(e) => {
                    const updated = [...user.rabbits];
                    updated[selectedBunnyIndex] = {
                      ...activeBunny,
                      pattern: e.target.value as BunnyPattern,
                    };
                    onUpdateUser({ ...user, rabbits: updated });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border-2 border-sky-300 text-xs font-bold"
                >
                  <option value="solid">⚪ Thuần Sắc</option>
                  <option value="starry">🌟 Tinh Tú</option>
                  <option value="dutch">🎭 Dutch</option>
                  <option value="spotted">🐆 Đốm</option>
                </select>
              </div>
            </div>

            {/* Wearables */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider">Phụ Kiện:</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'crown', icon: '👑' },
                  { id: 'party_hat', icon: '🎉' },
                  { id: 'pink_bow', icon: '🎀' },
                  { id: 'cool_glasses', icon: '🕶️' },
                  { id: 'red_scarf', icon: '🧣' },
                  { id: 'angel_wings', icon: '🪽' },
                  { id: 'bell_collar', icon: '🔔' },
                ].map((w) => {
                  const isEquipped = (activeBunny.equippedWearables || []).includes(w.id as any);
                  return (
                    <button
                      key={w.id}
                      onClick={() => {
                        const current = activeBunny.equippedWearables || [];
                        const updated = isEquipped ? current.filter(x => x !== w.id) : [...current, w.id as any];
                        const updatedRabbits = [...user.rabbits];
                        updatedRabbits[selectedBunnyIndex] = { ...activeBunny, equippedWearables: updated };
                        onUpdateUser({ ...user, rabbits: updatedRabbits });
                        audioEngine.playChimeSound();
                      }}
                      className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-xl transition-all ${
                        isEquipped ? 'border-pink-500 bg-pink-50 dark:bg-pink-950' : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {w.icon}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Wallpapers */}
        {activeTab === 'themes' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {HUTCH_THEMES.map((theme) => {
              const isSelected = currentThemeId === theme.id;
              const isUnlocked = unlockedThemes.includes(theme.id);
              return (
                <div
                  key={theme.id}
                  className={`rounded-2xl p-4 border-2 transition-all flex flex-col justify-between gap-3 ${
                    isSelected ? 'border-pink-500 bg-pink-50 dark:bg-slate-900' : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${theme.bgGradientLight} border-2 border-slate-300 shrink-0`} />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs sm:text-sm truncate">{theme.name}</h4>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{theme.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold">
                      {isUnlocked ? 'Đã sở hữu' : `${theme.priceCarrots} 🥕`}
                    </span>
                    <button
                      onClick={() => handleSelectTheme(theme)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold ${
                        isSelected ? 'bg-slate-200 text-slate-500' : 'bg-pink-500 text-white'
                      }`}
                    >
                      {isSelected ? 'Đang Dùng' : isUnlocked ? 'Dùng' : 'Mở Khóa'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-sky-500 text-white font-bold text-sm shadow-md"
          >
            Hoàn Tất
          </button>
        </div>
      </div>
    </div>
  );
};
