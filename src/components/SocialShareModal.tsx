import React, { useState, useRef, useEffect } from 'react';
import { User, Bunny } from '../types';
import { audioEngine } from '../utils/audioEngine';
import {
  PixelCarrot,
  PixelSparkle,
  PixelHeart,
} from './PixelSprites';
import {
  X,
  Share2,
  Download,
  Copy,
  Check,
  Twitter,
  Facebook,
  Send,
  Sparkles,
  QrCode,
  Image as ImageIcon,
} from 'lucide-react';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  selectedBunny?: Bunny | null;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  user,
  selectedBunny,
}) => {
  const [shareTarget, setShareTarget] = useState<'bunny' | 'hutch'>(
    selectedBunny ? 'bunny' : 'hutch'
  );
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeBunny = selectedBunny || user.rabbits[0];

  useEffect(() => {
    if (isOpen) {
      generateShareCard();
    }
  }, [isOpen, shareTarget, activeBunny, user]);

  if (!isOpen) return null;

  const generateShareCard = () => {
    setIsGenerating(true);
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background Sky Blue Gradient
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, '#0c4a6e');
    gradient.addColorStop(0.5, '#075985');
    gradient.addColorStop(1, '#0369a1');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Grid / Pixel Decorative Overlay
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 1200; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 630);
      ctx.stroke();
    }
    for (let y = 0; y < 630; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1200, y);
      ctx.stroke();
    }

    // Inner Card Container
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.roundRect?.(40, 40, 1120, 550, 32);
    ctx.fill();

    // Border
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 8;
    ctx.roundRect?.(40, 40, 1120, 550, 32);
    ctx.stroke();

    // Top Header Badge
    ctx.fillStyle = '#0284c7';
    ctx.roundRect?.(80, 70, 340, 48, 14);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('🐰 la Lapine Usagi Realm', 105, 102);

    // Owner info
    ctx.fillStyle = '#64748b';
    ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`Chủ nhân: ${user.name || 'Người lữ hành'}`, 1110, 102);
    ctx.textAlign = 'left';

    if (shareTarget === 'bunny' && activeBunny) {
      // Draw Bunny Avatar Frame
      ctx.fillStyle = '#e0f2fe';
      ctx.roundRect?.(80, 150, 320, 380, 24);
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 4;
      ctx.roundRect?.(80, 150, 320, 380, 24);
      ctx.stroke();

      // Bunny Title & Level
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 44px "Playfair Display", Georgia, serif';
      ctx.fillText(activeBunny.name, 440, 210);

      // Level pill
      ctx.fillStyle = '#0284c7';
      ctx.roundRect?.(440, 235, 130, 36, 12);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`Cấp ${activeBunny.level || 1}`, 465, 260);

      // Rarity pill
      ctx.fillStyle = '#f59e0b';
      ctx.roundRect?.(585, 235, 160, 36, 12);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillText('✨ Thỏ Quý Tộc', 600, 260);

      // Stats boxes
      const stats = [
        { label: 'Độ No Bụng', val: `${activeBunny.hunger}%`, icon: '🥕', color: '#f59e0b' },
        { label: 'Độ Vui Vẻ', val: `${activeBunny.happiness}%`, icon: '💖', color: '#ec4899' },
        { label: 'Độ Sạch Sẽ', val: `${activeBunny.hygiene}%`, icon: '🫧', color: '#0284c7' },
      ];

      stats.forEach((st, idx) => {
        const topY = 300 + idx * 70;
        ctx.fillStyle = '#f8fafc';
        ctx.roundRect?.(440, topY, 670, 56, 14);
        ctx.fill();
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.roundRect?.(440, topY, 670, 56, 14);
        ctx.stroke();

        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(`${st.icon} ${st.label}`, 465, topY + 36);

        ctx.fillStyle = st.color;
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(st.val, 1080, topY + 36);
        ctx.textAlign = 'left';
      });

      // Bottom Watermark
      ctx.fillStyle = '#64748b';
      ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('✨ Khám phá và nuôi dưỡng thú cưng kỳ diệu tại la Lapine', 440, 535);

      // Bunny Illustration on Left Frame
      ctx.fillStyle = '#0284c7';
      ctx.font = 'bold 84px serif';
      ctx.textAlign = 'center';
      ctx.fillText('🐇', 240, 350);
      ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#0369a1';
      ctx.fillText(activeBunny.name, 240, 420);
      ctx.textAlign = 'left';
    } else {
      // Hutch Sanctuary Share View
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 44px "Playfair Display", Georgia, serif';
      ctx.fillText(`Trang Trại Thỏ · ${user.name}`, 80, 195);

      ctx.fillStyle = '#475569';
      ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Vương quốc thỏ thần tiên với đàn thỏ đáng yêu và chuồng ấm cúng!', 80, 235);

      // 4 Key Highlight Cards
      const highlights = [
        { label: 'Số lượng thỏ nuôi', val: `${user.rabbits.length} Bé thỏ`, icon: '🐰' },
        { label: 'Kho Cà Rốt tích lũy', val: `${user.carrots} Củ 🥕`, icon: '🥕' },
        { label: 'Màu nền chuồng thỏ', val: 'Sakura / Sky Blue', icon: '🎨' },
        { label: 'Huy hiệu danh dự', val: user.equippedBadge || '✨ Người Bạn Của Thỏ', icon: '🏆' },
      ];

      highlights.forEach((hl, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const cardX = 80 + col * 520;
        const cardY = 270 + row * 115;

        ctx.fillStyle = '#f0f9ff';
        ctx.roundRect?.(cardX, cardY, 495, 95, 18);
        ctx.fill();
        ctx.strokeStyle = '#bae6fd';
        ctx.lineWidth = 3;
        ctx.roundRect?.(cardX, cardY, 495, 95, 18);
        ctx.stroke();

        ctx.fillStyle = '#0284c7';
        ctx.font = 'bold 36px serif';
        ctx.fillText(hl.icon, cardX + 25, cardY + 60);

        ctx.fillStyle = '#64748b';
        ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(hl.label, cardX + 85, cardY + 40);

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(hl.val, cardX + 85, cardY + 72);
      });

      // Bottom Watermark
      ctx.fillStyle = '#0284c7';
      ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('🌸 lalapine.world · Thú cưng Pixel & Bạn đồng hành AI', 80, 535);
    }

    const dataUrl = canvas.toDataURL('image/png');
    setPreviewDataUrl(dataUrl);
    setIsGenerating(false);
  };

  const handleDownloadImage = () => {
    if (!previewDataUrl) return;
    const a = document.createElement('a');
    a.href = previewDataUrl;
    a.download = `lalapine-${shareTarget}-${Date.now()}.png`;
    a.click();
    audioEngine.playCoinSound();
  };

  const getShareUrl = () => window.location.href;

  const getShareText = () => {
    if (shareTarget === 'bunny' && activeBunny) {
      return `🐰 Hãy ngắm bé thỏ ${activeBunny.name} (Cấp ${activeBunny.level || 1}) đáng yêu của mình trong la Lapine nhé! 💕`;
    }
    return `🏰 Ghé thăm trang trại chuồng thỏ la Lapine của ${user.name} với ${user.rabbits.length} bé thỏ xinh xắn! ✨🥕`;
  };

  const handleCopyLink = () => {
    const text = `${getShareText()}\n${getShareUrl()}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    audioEngine.playChimeSound();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(getShareText());
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(getShareText());
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Chia Sẻ Trang Trại & Thỏ Cưng"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl glass-panel pixel-box rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-900 dark:text-slate-100 max-h-[92vh] overflow-y-auto animate-in zoom-in-95">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-cyan-200 dark:from-sky-600 dark:to-cyan-400 flex items-center justify-center text-2xl shadow-md border-2 border-white/60 shrink-0 pixel-box">
            📤
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
              <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-sparkle" />
              <span>Khoe Thú Cưng & Chia Sẻ Trang Trại</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              Chia Sẻ Lên Mạng Xã Hội
            </h2>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
              Tạo ảnh thẻ khoe thú cưng hoặc trang trại thỏ độc nhất của bạn để chia sẻ cùng bạn bè!
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-sky-50 dark:bg-slate-900/70 border-2 border-sky-200 dark:border-sky-800 mb-4">
          <button
            onClick={() => setShareTarget('bunny')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              shareTarget === 'bunny'
                ? 'bg-sky-500 text-white shadow-xs pixel-tag'
                : 'text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-300'
            }`}
          >
            <span>🐇 Khoe Thỏ Cưng ({activeBunny.name})</span>
          </button>
          <button
            onClick={() => setShareTarget('hutch')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              shareTarget === 'hutch'
                ? 'bg-sky-500 text-white shadow-xs pixel-tag'
                : 'text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-300'
            }`}
          >
            <span>🏰 Khoe Toàn Chuồng Thỏ</span>
          </button>
        </div>

        {/* Live Card Preview Box */}
        <div className="relative rounded-2xl border-2 border-sky-300/80 dark:border-sky-700/80 overflow-hidden shadow-md bg-slate-900 mb-4 group">
          {previewDataUrl ? (
            <img
              src={previewDataUrl}
              alt="Share Preview"
              className="w-full h-auto object-cover rounded-xl"
            />
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-400 text-xs">
              Đang tạo ảnh preview...
            </div>
          )}
          <div className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-xs text-[11px] font-bold text-sky-300 border border-sky-400/40">
            HD Preview
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Direct Download & Copy Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={handleDownloadImage}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 pixel-btn"
            >
              <Download className="w-4 h-4" />
              <span>Tải Ảnh Preview HD (.PNG)</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border-2 border-sky-200 dark:border-sky-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 pixel-btn"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Đã Sao Chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-sky-500" />
                  <span>Sao Chép Link & Lời Giới Thiệu</span>
                </>
              )}
            </button>
          </div>

          {/* Social Platform Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleShareTwitter}
              className="flex-1 py-2 px-3 rounded-xl bg-[#0f1419] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs pixel-btn"
            >
              <Twitter className="w-3.5 h-3.5" />
              <span>X / Twitter</span>
            </button>
            <button
              onClick={handleShareFacebook}
              className="flex-1 py-2 px-3 rounded-xl bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs pixel-btn"
            >
              <Facebook className="w-3.5 h-3.5" />
              <span>Facebook</span>
            </button>
            <button
              onClick={handleShareTelegram}
              className="flex-1 py-2 px-3 rounded-xl bg-[#229ed9] hover:bg-[#1f8ec4] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs pixel-btn"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
