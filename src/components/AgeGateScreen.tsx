import React, { useState } from 'react';
import { ShieldAlert, Check, ArrowRight } from 'lucide-react';

interface AgeGateScreenProps {
  onConfirm: () => void;
}

export const AgeGateScreen: React.FC<AgeGateScreenProps> = ({ onConfirm }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [declined, setDeclined] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto selection:bg-sky-400 selection:text-white">
      {/* Background with ethereal aesthetic vintage image and soft blur */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src="/src/assets/images/lapine_aesthetic_dark_1790621488800.jpg"
          alt="la Lapine aesthetic backdrop"
          className="w-full h-full object-cover filter blur-[2px] scale-105"
        />
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
      </div>

      {/* Main Compact Age Verification Card */}
      <div className="relative z-10 max-w-md w-full glass-panel rounded-3xl border-2 border-sky-400/60 p-4 sm:p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-300 my-auto">
        {/* Top Title */}
        <div className="text-center mb-3">
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white">
            la Lapine
          </h1>
        </div>

        {/* CẢNH BÁO Frame with Sky Blue / Cyan Border */}
        <div className="rounded-2xl bg-slate-900/90 border-2 border-sky-400/60 p-3.5 sm:p-4 mb-4 shadow-inner space-y-2.5">
          <div className="flex items-center gap-2 text-sky-300 pb-2 border-b border-sky-400/30">
            <ShieldAlert className="w-4 h-4 shrink-0 text-sky-400" />
            <h2 className="font-display font-extrabold text-sm sm:text-base tracking-wider uppercase text-sky-300">
              CẢNH BÁO
            </h2>
          </div>

          <div className="text-xs text-slate-200 leading-relaxed space-y-2 font-normal">
            <p className="italic text-slate-300">
              Trước khi truy cập, bồ vui lòng chú ý những điều sau:
            </p>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-sky-900/60 space-y-1.5 text-[11px] sm:text-xs">
              <p>
                <strong className="text-rose-300 font-bold">Nội dung 18+:</strong>{' '}
                Ở đây đa phần các char sẽ thiên NSFW, côn trùng, nội dung không phù hợp với trẻ vị thành niên.
              </p>
              <p>
                <strong className="text-sky-300 font-bold">Về Lapine:</strong>{' '}
                Tui tam quan bình thường, không lệch lạc, không bình thường hóa - cổ xúy những gì mà mình viết. Mọi thứ ở đây chỉ là sản phẩm của sự tưởng tượng.
              </p>
            </div>

            <p className="text-slate-300 text-[11px] sm:text-xs">
              Bồ vui lòng xác minh bản thân trên 18 tuổi. Trong trường hợp bồ cố chấp vào đây thì tui xin miễn trừ trách nhiệm với hành động của bồ.
            </p>
          </div>
        </div>

        {/* Checkbox confirmation */}
        <div className="mb-4">
          <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-sky-950/50 border border-sky-400/40 hover:border-sky-400/80 transition-all cursor-pointer select-none">
            <div className="relative flex items-center justify-center mt-0.5 shrink-0">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => {
                  setIsChecked(e.target.checked);
                  if (e.target.checked) setDeclined(false);
                }}
                className="peer sr-only"
              />
              <div
                className={`w-4.5 h-4.5 rounded-lg border flex items-center justify-center transition-colors ${
                  isChecked
                    ? 'bg-sky-500 border-sky-400 text-white'
                    : 'bg-slate-800/80 border-slate-600 text-transparent'
                }`}
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            </div>
            <span className="text-xs text-slate-200 font-medium leading-snug">
              Tôi xác nhận mình đã <strong className="text-sky-300 font-bold">đủ 18 tuổi trở lên</strong> và đồng ý với các lưu ý miễn trừ trách nhiệm trên.
            </span>
          </label>
        </div>

        {/* Action Button: ONLY appears when checked */}
        {isChecked ? (
          <button
            onClick={onConfirm}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 border border-white/40"
          >
            <span>Xác Nhận Đủ 18+ & Vào Đồng Cỏ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="text-center">
            <button
              onClick={() => setDeclined(true)}
              className="text-xs text-slate-400 hover:text-rose-300 underline font-medium transition-colors"
            >
              Tôi chưa đủ 18 tuổi (Thoát khỏi trang)
            </button>
          </div>
        )}

        {declined && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs text-center font-bold animate-in fade-in duration-200">
            Cảm ơn bồ! Vui lòng quay lại khi bồ đủ 18 tuổi nhé! 🌸
          </div>
        )}
      </div>
    </div>
  );
};
