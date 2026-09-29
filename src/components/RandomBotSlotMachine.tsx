import React, { useState, useEffect, useRef } from 'react';
import { CharacterBot } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { Sparkles, Dices, MessageSquare, ArrowRight, X } from 'lucide-react';

interface RandomBotSlotMachineProps {
  bots: CharacterBot[];
  onSelectBot: (bot: CharacterBot) => void;
  onClose?: () => void;
}

export const RandomBotSlotMachine: React.FC<RandomBotSlotMachineProps> = ({
  bots,
  onSelectBot,
  onClose,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [winnerBot, setWinnerBot] = useState<CharacterBot | null>(null);
  const timerRef = useRef<number | null>(null);

  const startSpin = () => {
    if (isSpinning || bots.length === 0) return;
    setIsSpinning(true);
    setWinnerBot(null);

    let speed = 40; // initial fast speed in ms
    let iterations = 0;
    const totalIterations = 35 + Math.floor(Math.random() * 15);

    const step = () => {
      setCurrentIdx((prev) => (prev + 1) % bots.length);
      audioEngine.playSlotTickSound();
      iterations++;

      if (iterations < totalIterations) {
        if (iterations > totalIterations - 12) {
          speed += 28; // decelerate smoothly
        }
        timerRef.current = window.setTimeout(step, speed);
      } else {
        // Final winner landed
        setIsSpinning(false);
        const finalWinner = bots[(currentIdx + 1) % bots.length];
        setWinnerBot(finalWinner);
        audioEngine.playSlotWinSound();
      }
    };

    timerRef.current = window.setTimeout(step, speed);
  };

  // Automatically start spinning immediately on mount as requested
  useEffect(() => {
    const autoTimer = window.setTimeout(() => {
      startSpin();
    }, 50);

    return () => {
      clearTimeout(autoTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const displayBot = winnerBot || bots[currentIdx] || bots[0];

  return (
    <div className="relative rounded-3xl glass-panel border border-sky-300/40 dark:border-sky-800/40 p-6 sm:p-10 shadow-xl overflow-hidden max-w-2xl mx-auto text-slate-800 dark:text-slate-100">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full glass-panel border border-sky-200/50 dark:border-sky-800/40 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Header */}
      <div className="text-center max-w-md mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100/70 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-sky-200/50">
          <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-sparkle" />
          Match Thỏ Ngẫu Nhiên
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Nhân Duyên Trại Thỏ Hôm Nay
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
          Guồng quay số phận đang tự động quay để chọn ra người bạn thỏ đồng hành hợp duyên nhất với bạn hôm nay!
        </p>
      </div>

      {/* Casino Slot Machine Reel - Clean Borderless Design */}
      <div className="my-8 flex flex-col items-center">
        {/* Seamless borderless reel container */}
        <div className="relative w-full max-w-sm h-64 sm:h-72 overflow-hidden flex flex-col items-center justify-center">
          {/* Subtle top and bottom shadow masks to simulate cylindrical reel curve */}
          <div className="absolute top-0 inset-x-0 h-14 bg-gradient-to-b from-[#f0f9ff]/90 dark:from-[#070d18]/90 to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-[#f0f9ff]/90 dark:from-[#070d18]/90 to-transparent z-10 pointer-events-none" />

          {/* Center Reel Window */}
          <div
            className={`w-full flex flex-col items-center transition-all duration-100 ${
              isSpinning ? 'scale-95 blur-[0.4px]' : 'scale-100'
            }`}
          >
            {/* Bot Avatar Reel */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden shadow-lg border-2 border-white/60 dark:border-sky-500/40">
              <img
                src={displayBot.avatar}
                alt={displayBot.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {winnerBot && (
                <div className="absolute inset-0 bg-sky-400/20 mix-blend-overlay animate-pulse" />
              )}
            </div>

            {/* Bot Info */}
            <div className="mt-4 text-center">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {displayBot.name}
              </h3>
              <p className="text-xs font-medium text-sky-600 dark:text-sky-300 mt-0.5">
                {displayBot.subtitle}
              </p>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                {displayBot.tags.slice(0, 3).map((tag, idx) => (
                  <React.Fragment key={tag}>
                    {idx > 0 && <span aria-hidden="true">·</span>}
                    <span>{tag}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Spin Lever / Button */}
        <div className="mt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={startSpin}
            disabled={isSpinning}
            className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-sky-600 to-sky-500 hover:from-sky-600 hover:to-sky-700 disabled:opacity-60 text-white font-bold text-sm shadow-lg hover:shadow-sky-400/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <Dices className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'Đang quay số phận...' : 'Match Lại Lượt Mới 🎰'}</span>
          </button>

          {winnerBot && (
            <button
              onClick={() => onSelectBot(winnerBot)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl glass-panel border border-sky-300 dark:border-sky-600 text-sky-700 dark:text-sky-200 font-semibold text-sm hover:bg-sky-100/50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 animate-bounce"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Gặp Gỡ {winnerBot.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
