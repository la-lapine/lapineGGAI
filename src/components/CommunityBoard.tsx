import React, { useState } from 'react';
import { User, CommunityTopic, TopicComment } from '../types';
import { audioEngine } from '../utils/audioEngine';
import {
  MessageSquare,
  Sparkles,
  Heart,
  Send,
  Pin,
  PlusCircle,
  Clock,
  Filter,
  User as UserIcon,
  Smile,
  CheckCircle2,
} from 'lucide-react';

interface CommunityBoardProps {
  currentUser: User;
}

const TOPICS_STORAGE_KEY = 'usagi_realm_community_topics_v1';

const INITIAL_TOPICS: CommunityTopic[] = [];

export const CommunityBoard: React.FC<CommunityBoardProps> = ({ currentUser }) => {
  const [topics, setTopics] = useState<CommunityTopic[]>(() => {
    try {
      const saved = localStorage.getItem(TOPICS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_TOPICS;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreatingTopic, setIsCreatingTopic] = useState<boolean>(false);
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);

  // Form states for new topic
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'feedback' | 'character_idea' | 'rabbit_care' | 'general'>('character_idea');
  const [newContent, setNewContent] = useState('');
  const [newAuthorName, setNewAuthorName] = useState(currentUser.name);

  // Form state for comment
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [likedTopics, setLikedTopics] = useState<Record<string, boolean>>({});

  const saveTopics = (updated: CommunityTopic[]) => {
    setTopics(updated);
    try {
      localStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newTopic: CommunityTopic = {
      id: 'topic-' + Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      content: newContent.trim(),
      authorName: newAuthorName.trim() || currentUser.name || 'Người Yêu Thỏ',
      likes: 1,
      pinned: false,
      createdAt: new Date().toLocaleDateString('vi-VN'),
      comments: [],
    };

    const updated = [newTopic, ...topics];
    saveTopics(updated);

    setNewTitle('');
    setNewContent('');
    setIsCreatingTopic(false);
    audioEngine.playSlotWinSound();
  };

  const handleToggleLikeTopic = (topicId: string) => {
    const isLiked = likedTopics[topicId];
    setLikedTopics((prev) => ({ ...prev, [topicId]: !isLiked }));
    audioEngine.playPurrSound();

    const updated = topics.map((t) => {
      if (t.id === topicId) {
        return {
          ...t,
          likes: isLiked ? Math.max(0, t.likes - 1) : t.likes + 1,
        };
      }
      return t;
    });
    saveTopics(updated);
  };

  const handleAddComment = (topicId: string) => {
    const text = commentInputs[topicId];
    if (!text || !text.trim()) return;

    const newComment: TopicComment = {
      id: 'c-' + Date.now(),
      authorName: currentUser.name || 'Khách Lữ Hành',
      content: text.trim(),
      timestamp: `Hôm nay, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      likes: 0,
    };

    const updated = topics.map((t) => {
      if (t.id === topicId) {
        return {
          ...t,
          comments: [...t.comments, newComment],
        };
      }
      return t;
    });

    saveTopics(updated);
    setCommentInputs((prev) => ({ ...prev, [topicId]: '' }));
    audioEngine.playPurrSound();
  };

  const filteredTopics = topics.filter((t) => {
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  const getCategoryBadge = (cat: CommunityTopic['category']) => {
    switch (cat) {
      case 'character_idea':
        return { label: 'Ý Tưởng Bot', color: 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200' };
      case 'rabbit_care':
        return { label: 'Trại Thỏ & Khoe Thỏ', color: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200' };
      case 'feedback':
        return { label: 'Góp Ý & Báo Lỗi', color: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200' };
      default:
        return { label: 'Thảo Luận Chung', color: 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200' };
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Board Header & Create CTA */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-sky-300/80 dark:border-sky-800/60 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-sky-900 dark:text-sky-300 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-sparkle" />
            Cộng Đồng & Diễn Đàn Giao Lưu
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
            Góc Thảo Luận & Góp Ý Usagi
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1 max-w-xl leading-relaxed">
            Nơi chia sẻ cảm nghĩ, đóng góp ý tưởng nhân vật bot mới, trao đổi kinh nghiệm chăm sóc thỏ và tương tác cùng các thành viên khác!
          </p>
        </div>

        <button
          onClick={() => setIsCreatingTopic(!isCreatingTopic)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 shrink-0 pixel-btn"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{isCreatingTopic ? 'Đóng khung đăng' : 'Đăng Topic Mới'}</span>
        </button>
      </div>

      {/* New Topic Creation Box */}
      {isCreatingTopic && (
        <form
          onSubmit={handleCreateTopic}
          className="glass-panel rounded-3xl p-6 border-2 border-sky-300/80 dark:border-sky-600/80 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex items-center justify-between border-b border-sky-200/60 dark:border-sky-800/50 pb-3">
            <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>✍️ Tạo Chủ Đề Thảo Luận Mới</span>
            </h3>
            <span className="text-xs text-sky-600 dark:text-sky-400">
              Đăng dưới tên: <strong>{currentUser.name}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Tiêu đề chủ đề:
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Ý tưởng bot Thỏ Cung Đình, Khoe thỏ con mới nở..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-panel border border-sky-200 dark:border-sky-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Phân loại (Category):
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl glass-panel border border-sky-200 dark:border-sky-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400/50"
              >
                <option value="character_idea">Ý tưởng Bot mới</option>
                <option value="rabbit_care">Trại thỏ & Đồng cỏ</option>
                <option value="feedback">Góp ý & Báo lỗi</option>
                <option value="general">Thảo luận tự do</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Nội dung chi tiết:
            </label>
            <textarea
              required
              rows={4}
              placeholder="Chia sẻ câu chuyện, ý tưởng kịch bản bot, cảm nhận hoặc feedback của bạn..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl glass-panel border border-sky-200 dark:border-sky-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400/50"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreatingTopic(false)}
              className="px-4 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Đăng Lên Diễn Đàn
            </button>
          </div>
        </form>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          Chủ đề:
        </span>
        {[
          { id: 'all', label: 'Tất cả chủ đề' },
          { id: 'character_idea', label: '💡 Ý Tưởng Bot' },
          { id: 'rabbit_care', label: '🐰 Trại Thỏ' },
          { id: 'feedback', label: '💌 Góp Ý' },
          { id: 'general', label: '💬 Thảo Luận Chung' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-sky-500 text-white shadow-xs font-semibold'
                : 'glass-panel text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-300 border border-sky-200/50 dark:border-sky-800/40'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Topics Stream */}
      <div className="space-y-4">
        {filteredTopics.map((topic) => {
          const badge = getCategoryBadge(topic.category);
          const isExpanded = expandedTopicId === topic.id;
          const isLiked = likedTopics[topic.id];

          return (
            <div
              key={topic.id}
              className={`rounded-3xl glass-panel p-5 sm:p-6 border transition-all duration-300 shadow-sm hover:shadow-md ${
                topic.pinned
                  ? 'border-sky-400/80 dark:border-sky-500/70 bg-gradient-to-br from-sky-50/70 via-white/80 to-sky-100/60 dark:from-sky-950/40 dark:via-slate-900/60 dark:to-slate-900/80'
                  : 'border-sky-200/60 dark:border-sky-800/40'
              }`}
            >
              {/* Topic Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    {topic.pinned && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-300/50 text-[10px] font-bold uppercase tracking-wider">
                        <Pin className="w-3 h-3 fill-current" />
                        Ghim bởi Creator
                      </span>
                    )}
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>

                  <h3 className="font-display text-base sm:text-lg font-extrabold text-slate-950 dark:text-white leading-snug">
                    {topic.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-700 dark:text-slate-300 font-mono font-bold shrink-0">
                  <Clock className="w-3 h-3 text-sky-600" />
                  <span>{topic.createdAt}</span>
                </div>
              </div>

              {/* Author Row */}
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="w-5 h-5 rounded-full bg-sky-200 dark:bg-sky-900 flex items-center justify-center text-[10px] text-sky-950 dark:text-sky-100 font-extrabold">
                  {topic.authorName.charAt(0)}
                </div>
                <span className="font-extrabold text-slate-900 dark:text-slate-100">
                  {topic.authorName}
                </span>
              </div>

              {/* Topic Content */}
              <div className="mt-3 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed whitespace-pre-wrap">
                {topic.content}
              </div>

              {/* Bottom Actions Row */}
              <div className="mt-4 pt-3 border-t border-sky-100 dark:border-sky-900/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleToggleLikeTopic(topic.id)}
                    className={`flex items-center gap-1.5 transition-colors font-medium ${
                      isLiked
                        ? 'text-rose-500 font-bold'
                        : 'text-slate-500 hover:text-rose-500 dark:text-slate-400'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{topic.likes} Thích</span>
                  </button>

                  <button
                    onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                    className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 hover:underline font-medium"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{topic.comments.length} Bình luận</span>
                  </button>
                </div>

                <button
                  onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                  className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-semibold"
                >
                  {isExpanded ? 'Thu gọn' : 'Xem & Thảo luận →'}
                </button>
              </div>

              {/* Expanded Comments Thread */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-sky-200/50 dark:border-sky-800/40 space-y-3 animate-in fade-in">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Bình luận ({topic.comments.length})
                  </div>

                  {/* Comments list */}
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {topic.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="p-3 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-sky-100 dark:border-sky-900/30 text-xs"
                      >
                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {comment.authorName}
                          </span>
                          <span className="font-mono">{comment.timestamp}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    ))}

                    {topic.comments.length === 0 && (
                      <div className="py-3 text-center text-xs text-slate-400 italic">
                        Chưa có bình luận nào. Hãy là người đầu tiên để lại ý kiến nhé!
                      </div>
                    )}
                  </div>

                  {/* Add Comment Input Bar */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      placeholder={`Viết phản hồi với tư cách ${currentUser.name}...`}
                      value={commentInputs[topic.id] || ''}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({ ...prev, [topic.id]: e.target.value }))
                      }
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment(topic.id)}
                      className="flex-1 px-3.5 py-2 rounded-xl glass-panel border border-sky-200 dark:border-sky-800 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                    />
                    <button
                      onClick={() => handleAddComment(topic.id)}
                      disabled={!commentInputs[topic.id]?.trim()}
                      className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-1 shadow-xs transition-colors shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredTopics.length === 0 && (
          <div className="text-center py-16 glass-panel rounded-3xl border border-sky-200/50 p-8">
            <span className="text-3xl mb-2 inline-block">🐰💬</span>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Chưa có chủ đề nào trong mục này
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Hãy bấm "Đăng Topic Mới" để mở đầu cuộc thảo luận đầu tiên nhé!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
