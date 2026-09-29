import React, { useEffect } from 'react';
import { Bunny } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { Sparkles, Trophy, Award, X, ArrowUpRight } from 'lucide-react';

interface LevelUpSparkleModalProps {
  bunny: Bunny | null;
  onClose: () => void;
  bonusCarrots?: number;
  rewardItem?: {
    name: string;
    icon: string;
    description: string;
  } | null;
}

export const LevelUpSparkleModal: React.FC<LevelUpSparkleModalProps> = ({
  bunny,
  onClose,
  bonusCarrots = 20,
  rewardItem,
}) => {
  useEffect(() => {
    if (bunny) {
      audioEngine.playSparkleLevelUpSound();
    }
  }, [bunny]);

  if (!bunny) return null;

  // Title based on level
  const getGrowthTitle = (lvl: number) => {
    if (lvl === 2) return 'Thỏ Khám Phá Nhanh Nhẹn 🐾';
    if (lvl === 3) return 'Thỏ Trưởng Thành Duyên Dáng 🌸';
    if (lvl === 4) return 'Thỏ Tinh Linh Ánh Trăng 🌙';
    if (lvl === 5) return 'Thỏ Vũ Trụ Tinh Tú 🌟';
    return `Thỏ Thần Thoại Vĩnh Cửu Cấp ${lvl} 👑`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300"
    >
      {/* Sparkle particles radiating outward */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[320px] h-[320px] rounded-full bg-sky-400/20 blur-3xl animate-pulse" />
        <span className="absolute top-1/4 left-1/3 text-2xl animate-bounce">✨</span>
        <span className="absolute top-1/3 right-1/4 text-3xl text-amber-300 animate-spin-slow">⭐</span>
        <span className="absolute bottom-1/3 left-1/4 text-2xl text-pink-300 animate-pulse">💖</span>
        <span className="absolute bottom-1/4 right-1/3 text-3xl animate-bounce">✨</span>
      </div>

      <div className="relative w-full max-w-sm glass-panel rounded-3xl border-2 border-sky-300 dark:border-sky-500 shadow-2xl p-6 text-center text-slate-800 dark:text-slate-100 overflow-hidden animate-in zoom-in-90 duration-300">
        {/* Soft rotating starlight sheen */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-sky-300/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Sparkling Trophy Icon */}
        <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-sky-400 p-0.5 shadow-lg flex items-center justify-center mb-4">
          <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-amber-500 animate-bounce" />
          </div>
          <Sparkles className="absolute -top-1.5 -right-1.5 w-5 h-5 text-amber-300 animate-sparkle" />
          <Sparkles className="absolute -bottom-1 -left-1 w-4 h-4 text-sky-400 animate-sparkle" />
        </div>

        {/* Level Up Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Award className="w-3.5 h-3.5" />
          <span>LEVEL UP! THĂNG CẤP</span>
        </div>

        <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          {bunny.name} Đã Lên Cấp {bunny.level}!
        </h3>

        <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mt-1">
          {getGrowthTitle(bunny.level)}
        </p>

        {/* Bunny Avatar snippet */}
        <div className="my-3 py-2.5 px-4 rounded-2xl bg-sky-500/10 dark:bg-sky-400/10 border border-sky-300/40 flex items-center justify-center gap-3">
          <div
            className="w-10 h-10 rounded-xl border border-sky-400 flex items-center justify-center shadow-xs text-xl"
            style={{ backgroundColor: bunny.furColor }}
          >
            🐰
          </div>
          <div className="text-left text-xs">
            <div className="font-bold text-slate-900 dark:text-slate-100">
              Đạt mốc tăng trưởng mới!
            </div>
            <div className="text-slate-600 dark:text-slate-300 text-[11px]">
              Tất cả chỉ số no bụng, vui vẻ được hồi phục tràn đầy.
            </div>
          </div>
        </div>

        {/* Double Bonus Rewards: 20 Carrots + Random Feature Item */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-amber-100/90 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-xs font-bold text-amber-900 dark:text-amber-300">
            <span className="flex items-center gap-1.5">
              <span>🥕</span>
              <span>Cà rốt thưởng cấp:</span>
            </span>
            <span className="text-sm font-extrabold text-amber-700 dark:text-amber-300">
              +{bonusCarrots} Cà rốt
            </span>
          </div>

          {rewardItem && (
            <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-sky-100/90 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-700 text-xs text-left">
              <div className="flex items-center gap-2">
                <span className="text-2xl animate-physics-bounce">{rewardItem.icon}</span>
                <div>
                  <div className="font-bold text-sky-900 dark:text-sky-200">
                    {rewardItem.name}
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-300">
                    {rewardItem.description}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500 text-white shrink-0">
                +1 Túi đồ
              </span>
            </div>
          )}
        </div>

        {/* Confirm Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5"
        >
          <span>Tuyệt Vời & Nhận Thưởng</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
