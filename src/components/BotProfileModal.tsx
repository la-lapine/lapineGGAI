import React, { useState } from 'react';
import { CharacterBot } from '../types';
import { PixelRabbitIcon, PixelLockIcon, PixelHeart, PixelSparkle } from './PixelSprites';
import { X, MessageSquare, BookOpen, Volume2, Shield, ChevronDown, ChevronUp, Heart } from 'lucide-react';

interface BotProfileModalProps {
  bot: CharacterBot | null;
  onClose: () => void;
  onStartChat: (bot: CharacterBot) => void;
}

type AccordionSection = 'info' | 'plot' | 'firstMessage' | null;

export const BotProfileModal: React.FC<BotProfileModalProps> = ({
  bot,
  onClose,
  onStartChat,
}) => {
  const [expandedSection, setExpandedSection] = useState<AccordionSection>(null);

  if (!bot) return null;

  const isLocked = bot.isLinkLocked || bot.category === 'mat_trang';

  const toggleSection = (section: AccordionSection) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel pixel-box rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-800 dark:text-slate-100">
        {/* Close / Exit Button */}
        <button
          onClick={onClose}
          aria-label="Đóng hồ sơ"
          className="absolute top-5 right-5 p-2 rounded-full glass-panel border border-sky-300 dark:border-sky-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-sky-200 dark:border-sky-900/40">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden shadow-md border-2 border-sky-400 dark:border-sky-500 shrink-0">
            <img
              src={bot.avatar}
              alt={bot.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {isLocked && (
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center gap-1 shadow-md">
                <PixelLockIcon size={12} />
                <span>Khóa Link</span>
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {bot.name}
            </h2>

            <p className="text-sm font-bold text-sky-600 dark:text-sky-400 mt-0.5">
              {bot.subtitle}
            </p>

            {/* Unboxed tags with dot separators */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-500 dark:text-slate-400 mt-3">
              {bot.tags.map((tag, idx) => (
                <React.Fragment key={tag}>
                  {idx > 0 && <span aria-hidden="true">·</span>}
                  <span className="font-bold">{tag}</span>
                </React.Fragment>
              ))}
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-center sm:justify-start gap-4 mt-4 text-xs text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1 font-mono font-bold">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                {bot.likes} Yêu thích
              </span>
              <span className="flex items-center gap-1 font-mono font-bold">
                <MessageSquare className="w-3.5 h-3.5 text-sky-500" />
                {bot.chatCount} Lượt chat
              </span>
            </div>
          </div>
        </div>

        {/* Profile Content Accordion */}
        <div className="py-6 space-y-3.5">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 italic">
            * Bấm vào từng mục bên dưới để mở rộng xem chi tiết:
          </div>

          {/* 1. Thân phận & Tính cách */}
          <div className="rounded-2xl border-2 border-sky-300/80 dark:border-sky-800/80 overflow-hidden bg-white/80 dark:bg-slate-900/80 shadow-xs">
            <button
              onClick={() => toggleSection('info')}
              className="w-full px-5 py-3.5 flex items-center justify-between font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:bg-sky-50/50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-sky-500 shrink-0" />
                <span>1. Thân Phận, Tính Cách & Giọng Nói</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-normal">
                  {expandedSection === 'info' ? 'Thu gọn' : 'Xem thông tin'}
                </span>
                {expandedSection === 'info' ? (
                  <ChevronUp className="w-4 h-4 text-sky-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>

            {expandedSection === 'info' && (
              <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-800 dark:text-slate-100 border-t border-sky-100 dark:border-sky-800/30 animate-in fade-in duration-200 space-y-3">
                <p className="leading-relaxed font-medium">{bot.description}</p>
                <div className="p-3 rounded-xl bg-sky-50/80 dark:bg-slate-950/80 border border-sky-200 dark:border-sky-800 text-xs space-y-1">
                  <p><strong>Tính cách:</strong> {bot.personality}</p>
                  <p><strong>Giọng nói:</strong> {bot.voiceHint}</p>
                </div>
              </div>
            )}
          </div>

          {/* 2. Cốt truyện */}
          <div className="rounded-2xl border-2 border-sky-300/80 dark:border-sky-800/80 overflow-hidden bg-white/80 dark:bg-slate-900/80 shadow-xs">
            <button
              onClick={() => toggleSection('plot')}
              className="w-full px-5 py-3.5 flex items-center justify-between font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:bg-sky-50/50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-500 shrink-0" />
                <span>2. Bối Cảnh & Cốt Truyện Ban Đầu (Plot)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-normal">
                  {expandedSection === 'plot' ? 'Thu gọn' : 'Xem cốt truyện'}
                </span>
                {expandedSection === 'plot' ? (
                  <ChevronUp className="w-4 h-4 text-sky-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>

            {expandedSection === 'plot' && (
              <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-800 dark:text-slate-100 border-t border-sky-100 dark:border-sky-800/30 animate-in fade-in duration-200">
                <p className="leading-relaxed font-medium p-3 rounded-xl bg-sky-50/80 dark:bg-slate-950/80 border border-sky-200 dark:border-sky-800">
                  {bot.plot}
                </p>
              </div>
            )}
          </div>

          {/* 3. First Message */}
          <div className="rounded-2xl border-2 border-sky-300/80 dark:border-sky-800/80 overflow-hidden bg-white/80 dark:bg-slate-900/80 shadow-xs">
            <button
              onClick={() => toggleSection('firstMessage')}
              className="w-full px-5 py-3.5 flex items-center justify-between font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:bg-sky-50/50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-500 shrink-0" />
                <span>3. Tin Nhắn Mở Đầu (First Message)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-normal">
                  {expandedSection === 'firstMessage' ? 'Thu gọn' : 'Xem tin nhắn'}
                </span>
                {expandedSection === 'firstMessage' ? (
                  <ChevronUp className="w-4 h-4 text-sky-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>

            {expandedSection === 'firstMessage' && (
              <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-800 dark:text-slate-100 border-t border-sky-100 dark:border-sky-800/30 animate-in fade-in duration-200">
                <div className="p-4 rounded-xl bg-gradient-to-br from-sky-100/80 to-white/90 dark:from-sky-950/60 dark:to-slate-900/60 border border-sky-200/90 dark:border-sky-800/70 leading-relaxed font-medium">
                  {bot.firstMessage}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-sky-200/60 dark:border-sky-800/40 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs sm:text-sm transition-colors"
          >
            Đóng
          </button>

          {isLocked ? (
            <div className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500/20 border-2 border-amber-400 text-amber-700 dark:text-amber-300 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2">
              <PixelLockIcon size={16} />
              <span>Thỏ Mặt Trăng (Khóa Link Trò Chuyện)</span>
            </div>
          ) : (
            <button
              onClick={() => onStartChat(bot)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              Trò chuyện với {bot.name}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
