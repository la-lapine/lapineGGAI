import React, { useState } from 'react';
import { Announcement } from '../types';
import { PixelBell, PixelSparkle } from './PixelSprites';
import { X, ChevronUp, Bell, ArrowRight } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface FloatingNotificationDockProps {
  announcements: Announcement[];
  onOpenNotifications: () => void;
  onToggleRead: (id: string) => void;
}

export const FloatingNotificationDock: React.FC<FloatingNotificationDockProps> = ({
  announcements,
  onOpenNotifications,
  onToggleRead,
}) => {
  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const unreadList = announcements.filter((a) => !a.read);
  const unreadCount = unreadList.length;
  const latestUnread = unreadList[0] || announcements[0];

  const handleTogglePreview = () => {
    audioEngine.playChimeSound();
    setIsOpenPreview((prev) => !prev);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 select-none pointer-events-auto">
      {/* Quick Preview Pop-up Drawer */}
      {isOpenPreview && latestUnread && (
        <div className="w-80 sm:w-96 glass-panel rounded-3xl p-4 border-2 border-pink-300/80 dark:border-indigo-800/80 shadow-2xl animate-in zoom-in-95 duration-200 text-slate-800 dark:text-slate-100">
          <div className="flex items-center justify-between pb-2 border-b border-pink-200/60 dark:border-indigo-900/50">
            <div className="flex items-center gap-2">
              <PixelBell size={18} />
              <span className="font-bold text-xs uppercase tracking-wider text-pink-600 dark:text-pink-300">
                Thông Báo Mới Nhất
              </span>
            </div>
            <button
              onClick={() => setIsOpenPreview(false)}
              className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-2.5 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                {latestUnread.title}
              </h4>
              <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">
                {latestUnread.date}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
              {latestUnread.content}
            </p>
          </div>

          <div className="pt-2 border-t border-pink-100 dark:border-indigo-950/60 flex items-center justify-between gap-2">
            {!latestUnread.read ? (
              <button
                onClick={() => onToggleRead(latestUnread.id)}
                className="text-[11px] text-pink-600 dark:text-pink-400 font-semibold hover:underline"
              >
                Đánh dấu đã đọc
              </button>
            ) : (
              <span className="text-[11px] text-slate-400 font-medium">Đã đọc</span>
            )}

            <button
              onClick={() => {
                setIsOpenPreview(false);
                onOpenNotifications();
              }}
              className="px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-xs"
            >
              <span>Xem Tất Cả ({announcements.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Pill Dock Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleTogglePreview}
          aria-label="Hộp thư thông báo nhanh"
          title="Thông Báo Mới · Nhấp để xem nhanh"
          className="group flex items-center gap-2 px-3.5 py-2.5 rounded-2xl glass-panel border-2 border-pink-300/90 dark:border-indigo-700/80 bg-white/90 dark:bg-[#181528]/90 text-slate-800 dark:text-slate-100 font-bold text-xs shadow-xl transition-all hover:scale-105 active:scale-95 hover:border-pink-400"
        >
          <div className="relative">
            <PixelBell size={20} className="shrink-0" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
            )}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white dark:border-slate-900" />
            )}
          </div>

          <div className="flex flex-col text-left">
            <span className="text-[10px] text-pink-600 dark:text-pink-300 uppercase tracking-wider font-extrabold flex items-center gap-1">
              Thông Báo
              <PixelSparkle size={10} color="#f472b6" />
            </span>
            <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
              {unreadCount > 0 ? `${unreadCount} tin mới` : 'Hộp thư'}
            </span>
          </div>

          <ChevronUp
            className={`w-4 h-4 text-slate-400 transition-transform ${
              isOpenPreview ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>
    </div>
  );
};
