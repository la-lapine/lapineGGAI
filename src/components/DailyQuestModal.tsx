import React, { useState, useEffect } from 'react';
import { User, DailyQuest } from '../types';
import { dailyQuestManager } from '../utils/dailyQuestManager';
import { audioEngine } from '../utils/audioEngine';
import {
  PixelCarrot,
  PixelFoodBag,
  PixelToy,
  PixelSparkle,
} from './PixelSprites';
import {
  Sparkles,
  Gift,
  CheckCircle2,
  Clock,
  X,
  Flame,
  Award,
  ChevronRight,
} from 'lucide-react';

interface DailyQuestModalProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onClose: () => void;
  onNavigateTab?: (tab: 'bots' | 'hutch' | 'meadow' | 'community') => void;
}

export const DailyQuestModal: React.FC<DailyQuestModalProps> = ({
  user,
  onUpdateUser,
  onClose,
  onNavigateTab,
}) => {
  const [quests, setQuests] = useState<DailyQuest[]>(() => dailyQuestManager.getQuests());
  const [claimedNotice, setClaimedNotice] = useState<string | null>(null);

  useEffect(() => {
    const unsub = dailyQuestManager.subscribe((next) => {
      setQuests(next);
    });
    return unsub;
  }, []);

  const handleClaim = (quest: DailyQuest) => {
    const res = dailyQuestManager.claim(quest.id, user);
    if (res) {
      onUpdateUser(res.updatedUser);
      audioEngine.playLevelUpSound();
      const rewardText = `+${quest.reward.carrots} Cà Rốt${
        quest.reward.specialItemName ? ` & ${quest.reward.specialItemName}` : ''
      }${quest.reward.foodBags ? ` & +${quest.reward.foodBags} Thức ăn` : ''}${
        quest.reward.toys ? ` & +${quest.reward.toys} Đồ chơi` : ''
      }`;
      setClaimedNotice(`🎉 Đã nhận thưởng nhiệm vụ "${quest.title}": ${rewardText}`);
      setTimeout(() => setClaimedNotice(null), 3500);
    }
  };

  const completedCount = quests.filter((q) => q.completed).length;
  const claimedCount = quests.filter((q) => q.claimed).length;
  const totalQuests = quests.length;
  const progressPercent = Math.round((completedCount / totalQuests) * 100);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Nhiệm Vụ Hằng Ngày"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl glass-panel pixel-box rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-800 dark:text-slate-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-200 dark:from-amber-600 dark:to-yellow-400 flex items-center justify-center text-2xl shadow-md border-2 border-white/60 shrink-0 pixel-box">
            📜
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-sparkle" />
              <span>Nhiệm Vụ Hằng Ngày · Daily Quests</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              Thực Hiện & Nhận Thưởng Cà Rốt
            </h2>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
              Hoàn thành các hoạt động chăm sóc thỏ và khám phá thế giới la Lapine mỗi ngày để nhận quà!
            </p>
          </div>
        </div>

        {/* Daily Progress Bar */}
        <div className="mt-5 p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border-2 border-amber-300/80 dark:border-amber-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pixel-tag">
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between text-xs font-bold text-amber-950 dark:text-amber-200 mb-1.5">
              <span className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-amber-500" />
                Tiến độ hôm nay: {completedCount}/{totalQuests} nhiệm vụ
              </span>
              <span className="font-mono">{progressPercent}%</span>
            </div>
            <div className="w-full bg-amber-200/60 dark:bg-amber-900/60 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 h-full rounded-full transition-all duration-500 shadow-xs"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 shrink-0 self-end sm:self-auto font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Tự động làm mới vào 00:00</span>
          </div>
        </div>

        {/* Claim Notice Toast */}
        {claimedNotice && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{claimedNotice}</span>
          </div>
        )}

        {/* Quest List */}
        <div className="mt-4 space-y-3">
          {quests.map((quest) => {
            const isFinished = quest.completed;
            const isClaimed = quest.claimed;

            return (
              <div
                key={quest.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isClaimed
                    ? 'bg-white/40 dark:bg-slate-900/30 border-slate-200/60 dark:border-slate-800/40 opacity-70'
                    : isFinished
                    ? 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-400/80 dark:border-amber-600 shadow-xs'
                    : 'bg-white/80 dark:bg-slate-900/70 border-sky-200/80 dark:border-sky-800/60 hover:border-sky-400'
                }`}
              >
                {/* Left: Icon & Info */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-xl shrink-0 border border-sky-200 dark:border-sky-800 shadow-2xs">
                    {quest.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {quest.title}
                      </h4>
                      {isClaimed && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          Đã nhận
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">
                      {quest.description}
                    </p>

                    {/* Reward Preview */}
                    <div className="flex items-center gap-2 mt-2 flex-wrap text-[11px] font-bold">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300/60">
                        <PixelCarrot size={14} /> +{quest.reward.carrots} Cà Rốt
                      </span>
                      {quest.reward.specialItemName && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-pink-100 dark:bg-pink-950/80 text-pink-900 dark:text-pink-200 border border-pink-300/60">
                          🎁 {quest.reward.specialItemName}
                        </span>
                      )}
                      {quest.reward.foodBags && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-sky-100 dark:bg-sky-950/80 text-sky-900 dark:text-sky-200 border border-sky-300/60">
                          <PixelFoodBag size={14} /> +{quest.reward.foodBags} Thức Ăn
                        </span>
                      )}
                      {quest.reward.toys && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-200 border border-indigo-300/60">
                          <PixelToy size={14} /> +{quest.reward.toys} Đồ Chơi
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Progress / Action Button */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/50 dark:border-slate-800/50">
                  {/* Progress Counter */}
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                      {quest.currentCount}/{quest.targetCount}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {isFinished ? 'Hoàn thành' : 'Đang tiến hành'}
                    </div>
                  </div>

                  {/* Claim or Go Button */}
                  {isClaimed ? (
                    <button
                      disabled
                      className="px-3.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400 text-xs font-bold cursor-not-allowed flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Xong</span>
                    </button>
                  ) : isFinished ? (
                    <button
                      onClick={() => handleClaim(quest)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 animate-pulse"
                    >
                      <Gift className="w-4 h-4" />
                      <span>Nhận Quà!</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onClose();
                        if (onNavigateTab) {
                          if (quest.category === 'meadow_visit' || quest.category === 'crack_egg') {
                            onNavigateTab('meadow');
                          } else if (quest.category === 'chat_bot') {
                            onNavigateTab('bots');
                          } else {
                            onNavigateTab('hutch');
                          }
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl glass-panel border border-sky-300 dark:border-sky-700 text-xs font-semibold text-sky-700 dark:text-sky-300 hover:bg-sky-100/70 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
                    >
                      <span>Làm ngay</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
