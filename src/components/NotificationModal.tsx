import React, { useState } from 'react';
import { Announcement } from '../types';
import { X, Bell, ChevronDown, ChevronUp, Send, Sparkles, CheckCheck } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcements: Announcement[];
  onMarkAllAsRead: () => void;
  onToggleRead: (id: string) => void;
  onAddAnnouncement: (title: string, content: string) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  announcements,
  onMarkAllAsRead,
  onToggleRead,
  onAddAnnouncement,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminTitle, setAdminTitle] = useState('');
  const [adminContent, setAdminContent] = useState('');

  if (!isOpen) return null;

  const handleToggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      onToggleRead(id);
    }
  };

  const handleAdminBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminTitle.trim() || !adminContent.trim()) return;
    onAddAnnouncement(adminTitle.trim(), adminContent.trim());
    setAdminTitle('');
    setAdminContent('');
    setShowAdminForm(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in"
    >
      <div className="relative w-full max-w-xl max-h-[85vh] flex flex-col glass-panel pixel-box rounded-3xl shadow-2xl overflow-hidden text-slate-800 dark:text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-sky-200/60 dark:border-sky-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-600 dark:text-sky-300 pixel-tag">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white leading-none">
                Hộp Thư Thông Báo
              </h3>
              <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                Cộng dồn tin tức & sự kiện từ Usagi Realm ({announcements.length})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-bold"
              title="Đánh dấu tất cả đã đọc"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đã đọc hết</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content: Announcements List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-3">
          {announcements.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  item.read
                    ? 'glass-panel border-sky-100 dark:border-sky-900/30 opacity-90'
                    : 'bg-white/80 dark:bg-slate-900/80 border-sky-300/80 dark:border-sky-600/70 shadow-xs'
                }`}
              >
                {/* Collapsed Header: only shows title & date, click to expand */}
                <button
                  onClick={() => handleToggleExpand(item.id)}
                  className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left focus:outline-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    )}
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-mono text-slate-400">
                      {item.date}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Full Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-sky-100/60 dark:border-sky-900/30 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed animate-in fade-in">
                    <p className="whitespace-pre-wrap">{item.content}</p>
                  </div>
                )}
              </div>
            );
          })}

          {announcements.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs">
              Hộp thư hiện chưa có thông báo nào.
            </div>
          )}
        </div>

        {/* Admin Broadcast Section Footer */}
        <div className="p-4 border-t border-sky-200/60 dark:border-sky-800/40 glass-panel">
          {showAdminForm ? (
            <form onSubmit={handleAdminBroadcast} className="space-y-3 animate-in fade-in">
              <div className="text-xs font-semibold text-sky-700 dark:text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Gửi Thông Báo Mới (Admin Broadcast)
              </div>
              <input
                type="text"
                placeholder="Tiêu đề thông báo..."
                value={adminTitle}
                onChange={(e) => setAdminTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-panel border border-sky-200 dark:border-sky-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-400"
              />
              <textarea
                placeholder="Nội dung chi tiết thông báo..."
                rows={3}
                value={adminContent}
                onChange={(e) => setAdminContent(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-panel border border-sky-200 dark:border-sky-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-400"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdminForm(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!adminTitle.trim() || !adminContent.trim()}
                  className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  Phát Thông Báo
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                Bạn là quản trị viên / creator?
              </span>
              <button
                onClick={() => setShowAdminForm(true)}
                className="px-3 py-1.5 rounded-xl border border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-300 font-medium hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors"
              >
                + Phát thông báo mới
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
