import React, { useState, useRef, useEffect } from 'react';
import { CharacterBot, ChatMessage } from '../types';
import { X, Send, Sparkles, RefreshCw, Heart } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { dailyQuestManager } from '../utils/dailyQuestManager';

interface BotChatModalProps {
  bot: CharacterBot | null;
  onClose: () => void;
}

export const BotChatModal: React.FC<BotChatModalProps> = ({ bot, onClose }) => {
  if (!bot) return null;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'bot',
      content: bot.firstMessage,
      timestamp: 'Vừa xong',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [likeCount, setLikeCount] = useState(bot.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      content: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    audioEngine.playPurrSound();
    dailyQuestManager.progress('chat_bot', 1);

    // Generate responsive in-character reply
    setTimeout(() => {
      const botResponse = generateInCharacterReply(bot, userMsg.content, messages.length);
      const replyMsg: ChatMessage = {
        id: 'msg-reply-' + Date.now(),
        sender: 'bot',
        content: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, replyMsg]);
      setIsTyping(false);
      audioEngine.playPurrSound();
    }, 1200);
  };

  const generateInCharacterReply = (character: CharacterBot, query: string, msgCount: number): string => {
    const q = query.toLowerCase();

    if (character.id === 'bot-lumiere') {
      if (q.includes('tai') || q.includes('chạm') || q.includes('xoa')) {
        return '*Lumière giật thót lùi lại một bước, hai vành tai thỏ đỏ ửng như quả mâm xôi chín* "Đ-Đã bảo là không được sờ tai ta cơ mà! Ngươi... ngươi to gan thật đấy! Nhưng mà... tay ngươi ấm thật... hừ, chỉ được 10 giây thôi đấy nhé!"';
      }
      if (q.includes('ăn') || q.includes('cà rốt') || q.includes('đói') || q.includes('bánh')) {
        return '*Lumière khoanh tay quay mặt đi, nhưng khóe mắt liếc sang* "Bánh ngọt sao? Ta là hoàng tử, không ăn đồ tạp nham đâu... Ợ... nhưng mùi bánh thơm quá. Thôi được rồi, vì ngươi nài nỉ nên ta ăn một miếng nhỏ coi như ban ơn cho ngươi."';
      }
      if (msgCount > 3) {
        return '*Lumière gãi nhẹ chóp mũi, ánh mắt dịu lại* "Này... ngươi không thấy một hoàng tử ngã xuống cỏ như ta phiền phức sao? Ở bên ngươi... ta thấy bình yên hơn cả lúc ở trong cung điện lạnh lẽo ấy."';
      }
      return '*Lumière khẽ chỉnh lại chiếc áo choàng chỉ bạc* "Ngươi nói năng thú vị đấy. Được rồi, ta cho phép ngươi trò chuyện cùng ta thêm một chút. Mau kể ta nghe về đồng cỏ thỏ này đi!"';
    }

    if (character.id === 'bot-sylvie') {
      if (q.includes('sách') || q.includes('truyện') || q.includes('đọc')) {
        return '*Sylvie mỉm cười đẩy gọng kính vàng, lấy xuống một cuốn sách phủ bụi vàng lấp lánh* "Cậu cũng thích sách sao? Trong cuốn thần thoại này có ghi chép về loài thỏ ánh trăng từng thắp sáng cả bầu trời đêm. Để tớ lật trang này cho cậu xem nhé..."';
      }
      if (q.includes('trà') || q.includes('uống') || q.includes('ấm')) {
        return '*Sylvie rót một tách trà hoa cúc nghi ngút khói đưa cho bạn* "Uống chậm thôi kẻo bỏng nhé. Trà này tớ hái từ hoa cúc sương mai trên đồng cỏ đấy, uống vào sẽ xua tan mọi mỏi mệt trong lòng cậu."';
      }
      return '*Sylvie nghiêng đầu nhìn bạn với ánh mắt chan chứa sự dịu dàng* "Tớ rất thích nghe giọng nói của cậu. Giữa căn hầm sách im lìm này, sự hiện diện của cậu làm mọi câu chữ như bừng sáng lên vậy."';
    }

    if (character.id === 'bot-kuro') {
      if (q.includes('sợ') || q.includes('nguy hiểm') || q.includes('bảo vệ')) {
        return '*Kuro đặt tay lên chuôi kiếm, đứng chắn trước mặt bạn* "Đừng sợ. Chừng nào tôi còn đứng ở đây, không một ngọn gió độc hay con quái vật nào được phép chạm vào cậu."';
      }
      return '*Kuro liếc nhìn bạn, thở dài bất đắc dĩ nhưng ánh mắt vẫn luôn quan sát xung quanh* "Cậu nói nhiều thật đấy. Nhưng... cứ tiếp tục đi, để tôi biết cậu vẫn an toàn và không bị lạc mất."';
    }

    if (character.id === 'bot-mimi') {
      if (q.includes('bánh') || q.includes('ngọt') || q.includes('ngon')) {
        return '*Mimi nhảy cẫng lên vỗ tay bôm bốp* "Thật sao?! Cậu thấy ngon thật sao?! Ôi tớ hạnh phúc muốn xỉu luôn! Để tớ gói thêm một hộp bánh quy hoa bướm cho cậu mang về ăn dằn bụng nha!"';
      }
      return '*Mimi chớp chớp mắt to tròn, hai tai thỏ lúc lắc* "Cậu biết không, bí quyết làm bánh ngon nhất của tớ chính là nghĩ về nụ cười của cậu lúc ăn đấy! Hi hi, cậu ăn nhiều vào cho mau lớn nha!"';
    }

    // Default friendly response
    return `*${character.name} khẽ nghiêng đầu mỉm cười ấm áp* "Thật vui vì được trò chuyện cùng cậu. Ở Usagi Realm này, mỗi lời nói của cậu đều quý giá như ánh sao băng vậy!"`;
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'msg-init-' + Date.now(),
        sender: 'bot',
        content: bot.firstMessage,
        timestamp: 'Vừa xong',
      },
    ]);
  };

  const handleToggleLike = () => {
    if (hasLiked) {
      setLikeCount((c) => c - 1);
      setHasLiked(false);
    } else {
      setLikeCount((c) => c + 1);
      setHasLiked(true);
      audioEngine.playPurrSound();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in"
    >
      <div className="relative w-full max-w-2xl h-[92vh] sm:h-[85vh] flex flex-col glass-panel pixel-box rounded-3xl shadow-2xl overflow-hidden text-slate-800 dark:text-slate-100">
        {/* Chat Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-pink-200/60 dark:border-purple-900/40 flex items-center justify-between gap-3 bg-white/50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl overflow-hidden border-2 border-pink-400 dark:border-purple-500 shrink-0">
              <img
                src={bot.avatar}
                alt={bot.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-900" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-none">
                  {bot.name}
                </h3>
                <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-sparkle" />
              </div>
              <p className="text-xs text-pink-600 dark:text-purple-300 font-bold truncate max-w-[200px] sm:max-w-xs mt-0.5">
                {bot.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handleToggleLike}
              className={`p-2 rounded-xl transition-colors ${
                hasLiked
                  ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                  : 'text-slate-500 hover:text-rose-500 dark:text-slate-400'
              }`}
              title="Yêu thích bot"
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleResetChat}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-sky-100/50 dark:hover:bg-slate-800 transition-colors"
              title="Bắt đầu lại cuộc trò chuyện"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-sky-100/50 dark:hover:bg-slate-800 transition-colors"
              title="Thoát trò chuyện"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-sky-50/20 via-transparent to-sky-50/30 dark:from-slate-950/20 dark:to-slate-950/40">
          {/* Bot intro chip banner */}
          <div className="text-center pb-2">
            <div className="inline-block px-3 py-1 rounded-full bg-sky-200/50 dark:bg-sky-900/40 text-[11px] font-medium text-sky-800 dark:text-sky-200 border border-sky-300/40">
              Bạn đang ở trong không gian kịch bản cùng {bot.name}
            </div>
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'bot' && (
                <div className="w-7 h-7 rounded-xl overflow-hidden shrink-0 border border-sky-200 dark:border-sky-700">
                  <img
                    src={bot.avatar}
                    alt={bot.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div
                className={`max-w-[82%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-tr from-sky-500 to-sky-600 text-white rounded-br-xs'
                    : 'glass-panel border border-sky-200/80 dark:border-sky-800/60 text-slate-800 dark:text-slate-100 rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div
                  className={`text-[10px] mt-1 text-right font-mono ${
                    msg.sender === 'user' ? 'text-sky-100' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-sky-600 dark:text-sky-300 italic pl-10">
              <span className="inline-block animate-bounce">🐰</span>
              <span>{bot.name} đang suy nghĩ lời đáp...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-sky-200/60 dark:border-sky-800/40 glass-panel">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Nhập tin nhắn để tương tác với ${bot.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl glass-panel border border-sky-200/80 dark:border-sky-800/60 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 disabled:opacity-50 text-white font-medium text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Gửi</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
