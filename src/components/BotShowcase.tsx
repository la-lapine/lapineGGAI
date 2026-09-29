import React, { useState } from 'react';
import { CharacterBot } from '../types';
import {
  PixelRabbitIcon,
  PixelSparkle,
  PixelMilkIcon,
  PixelMoonIcon,
  PixelLockIcon,
  PixelHeart,
} from './PixelSprites';
import { Search, X, MessageCircle, Heart, ChevronUp, ChevronDown } from 'lucide-react';

interface BotShowcaseProps {
  bots: CharacterBot[];
  onSelectBot: (bot: CharacterBot) => void;
  onOpenSlotMachine?: () => void;
}

export const BotShowcase: React.FC<BotShowcaseProps> = ({
  bots,
  onSelectBot,
  onOpenSlotMachine,
}) => {
  const [activeCategory, setActiveCategory] = useState<'mup_sua' | 'ky_tich' | 'mat_trang'>('mup_sua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);

  // Extract all unique tags across all bots for tag filter bar
  const allTags = Array.from(
    new Set(bots.flatMap((b) => b.tags || []))
  ).filter(Boolean);

  // Filter bots by selected category tab, tag filter & search query
  const categoryBots = bots.filter((bot) => {
    const cat = bot.category || 'mup_sua';
    return cat === activeCategory;
  });

  const filteredBots = categoryBots.filter((bot) => {
    const matchesTag = !selectedTag || bot.tags.includes(selectedTag);

    const matchesSearch =
      bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTag && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* TRẠI THỎ CATEGORY NAVIGATION TABS */}
      <div className="glass-panel pixel-box rounded-3xl p-3 sm:p-4 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* 3 Categories: Thỏ Múp Sữa | Thỏ Kỳ Tích | Thỏ Mặt Trăng */}
        <div className="grid grid-cols-3 gap-2 flex-1">
          <button
            onClick={() => setActiveCategory('mup_sua')}
            className={`py-3 px-3.5 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer pixel-tag ${
              activeCategory === 'mup_sua'
                ? 'bg-sky-500 text-white shadow-md scale-[1.02] border-2 border-sky-300'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 hover:bg-sky-100 dark:hover:bg-slate-800 border-2 border-sky-200/80 dark:border-sky-800/80'
            }`}
          >
            <PixelMilkIcon size={18} />
            <span className="truncate">Thỏ Múp Sữa</span>
          </button>

          <button
            onClick={() => setActiveCategory('ky_tich')}
            className={`py-3 px-3.5 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer pixel-tag ${
              activeCategory === 'ky_tich'
                ? 'bg-sky-500 text-white shadow-md scale-[1.02] border-2 border-sky-300'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 hover:bg-sky-100 dark:hover:bg-slate-800 border-2 border-sky-200/80 dark:border-sky-800/80'
            }`}
          >
            <PixelSparkle size={18} color="#facc15" />
            <span className="truncate">Thỏ Kỳ Tích</span>
          </button>

          <button
            onClick={() => setActiveCategory('mat_trang')}
            className={`py-3 px-3.5 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer pixel-tag ${
              activeCategory === 'mat_trang'
                ? 'bg-sky-500 text-white shadow-md scale-[1.02] border-2 border-sky-300'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 hover:bg-sky-100 dark:hover:bg-slate-800 border-2 border-sky-200/80 dark:border-sky-800/80'
            }`}
          >
            <PixelMoonIcon size={18} />
            <span className="truncate">Thỏ Mặt Trăng</span>
          </button>
        </div>

        {/* Category Description Banner */}
        <div className="px-3.5 py-2 rounded-2xl bg-sky-50 dark:bg-slate-900 border border-sky-200 dark:border-sky-800 text-[11px] font-bold text-sky-900 dark:text-sky-200 flex items-center gap-2 shrink-0">
          <PixelRabbitIcon size={16} />
          <span>
            {activeCategory === 'mup_sua' && '🍼 Các bot mới vừa ra mắt gần đây nhất'}
            {activeCategory === 'ky_tich' && '✨ Các bot đã tải lên sau 1 tuần (đạt cột mốc kỳ tích)'}
            {activeCategory === 'mat_trang' && '🌙 Bot chưa có link (Trạng thái khóa link, chỉ xem thông tin/plot)'}
          </span>
        </div>
      </div>

      {/* SEARCH BAR & TAG FILTER BAR */}
      <div className="glass-panel pixel-box rounded-3xl p-4 sm:p-5 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-4.5 h-4.5 text-sky-600 dark:text-sky-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm thỏ theo tên, tính cách, từ khóa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white/95 dark:bg-slate-900/90 border-2 border-sky-300 dark:border-sky-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white placeholder-slate-500 shadow-xs focus:outline-none focus:ring-4 focus:ring-sky-400/20 focus:border-sky-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                title="Xóa tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {onOpenSlotMachine && (
            <button
              onClick={onOpenSlotMachine}
              className="py-3 px-4.5 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shrink-0 border-2 border-white/50 pixel-tag cursor-pointer"
              title="Match Thỏ Ngẫu Nhiên"
            >
              <span className="text-base animate-pulse">🎰</span>
              <span>Match Thỏ</span>
            </button>
          )}
        </div>

        {/* Interactive Expandable/Collapsible Tags Filter Bar */}
        {allTags.length > 0 && (
          <div className="pt-2.5 border-t border-sky-200/60 dark:border-sky-800/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <span>🏷️</span>
                <span>Thẻ tags ({allTags.length}):</span>
              </span>
              {allTags.length > 6 && (
                <button
                  onClick={() => setIsTagsExpanded((prev) => !prev)}
                  className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {isTagsExpanded ? (
                    <>
                      <span>Thu gọn</span>
                      <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <span>Xem tất cả ({allTags.length})</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              )}
            </div>

            <div
              className={`flex flex-wrap items-center gap-1.5 transition-all ${
                isTagsExpanded ? 'max-h-96' : 'max-h-24 overflow-hidden'
              }`}
            >
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedTag === null
                    ? 'bg-sky-500 text-white shadow-xs scale-[1.03]'
                    : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-sky-100 dark:hover:bg-slate-700 border border-sky-200/60 dark:border-sky-800/60'
                }`}
              >
                Tất cả
              </button>
              {(isTagsExpanded ? allTags : allTags.slice(0, 10)).map((tag) => {
                const isSelected = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(isSelected ? null : tag)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500 text-white shadow-xs scale-[1.03]'
                        : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-sky-100 dark:hover:bg-slate-700 border border-sky-200/60 dark:border-sky-800/60'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* BOT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBots.map((bot) => {
          const isLocked = bot.isLinkLocked || activeCategory === 'mat_trang';
          return (
            <div
              key={bot.id}
              onClick={() => onSelectBot(bot)}
              className="group relative rounded-3xl glass-panel pixel-box p-5 shadow-md bot-card-glow flex flex-col justify-between overflow-hidden bg-white/90 dark:bg-[#0f172a]/90 cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelectBot(bot)}
            >
              {/* Corner Starlight Sparkle */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                <PixelSparkle size={16} color="#38bdf8" className="animate-sparkle" />
              </div>

              {/* Locked Badge Ribbon for Thỏ Mặt Trăng */}
              {isLocked && (
                <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-amber-500/90 text-slate-950 font-black text-[10px] flex items-center gap-1 shadow-md border border-amber-300">
                  <PixelLockIcon size={12} />
                  <span>Khóa Link</span>
                </div>
              )}

              <div className="relative z-10">
                {/* Card Header: Avatar & Info */}
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-sky-300/90 dark:border-sky-600/80 bg-sky-100 dark:bg-slate-800 shadow-xs group-hover:border-sky-500 transition-colors">
                    <img
                      src={bot.avatar}
                      alt={bot.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1 left-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-900 block" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white truncate group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors">
                      {bot.name}
                    </h3>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-1">
                      {bot.subtitle}
                    </p>

                    {/* Dot-separated Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-800 dark:text-slate-200 mt-2 font-medium">
                      {bot.tags.slice(0, 3).map((tag, idx) => (
                        <React.Fragment key={tag}>
                          {idx > 0 && <span aria-hidden="true">·</span>}
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            {tag}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bot Short Bio */}
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-3 line-clamp-2 leading-relaxed">
                  {bot.description}
                </p>
              </div>

              {/* Card Footer: Stats & Action CTA */}
              <div className="relative z-10 pt-4 mt-4 border-t border-sky-100 dark:border-sky-900/50 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 font-semibold">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-slate-900 dark:text-slate-100 font-mono font-bold">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    {bot.likes}
                  </span>
                  <span className="flex items-center gap-1 text-slate-900 dark:text-slate-100 font-mono font-bold">
                    <MessageCircle className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    {bot.chatCount}
                  </span>
                </div>

                {isLocked ? (
                  <span className="text-amber-600 dark:text-amber-400 font-extrabold flex items-center gap-1">
                    <PixelLockIcon size={13} />
                    <span>Xem Plot/Thông tin</span>
                  </span>
                ) : (
                  <span className="text-sky-600 dark:text-sky-300 font-extrabold group-hover:underline flex items-center gap-1">
                    <span>Trò chuyện</span>
                    <span>→</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State when Category matches no bots */}
      {filteredBots.length === 0 && (
        <div className="text-center py-12 glass-panel pixel-box rounded-3xl p-8 space-y-3 max-w-md mx-auto">
          <div className="w-12 h-12 mx-auto rounded-full bg-sky-100 dark:bg-slate-800 flex items-center justify-center text-2xl">
            <PixelRabbitIcon size={28} />
          </div>
          <h4 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100">
            Chưa có thỏ nào trong mục này
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            Thử chuyển sang mục khác hoặc tìm kiếm với từ khóa khác nhé!
          </p>
        </div>
      )}
    </div>
  );
};
