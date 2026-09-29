import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Cuộn về đầu trang"
      className="fixed bottom-6 right-6 z-40 p-3 sm:p-3.5 rounded-2xl glass-panel border border-sky-300 dark:border-sky-600 text-sky-700 dark:text-sky-300 hover:text-white hover:bg-sky-500 dark:hover:bg-sky-600 shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 group animate-in fade-in slide-in-from-bottom-4"
    >
      <div className="relative flex flex-col items-center">
        {/* Little cute rabbit ears on top of arrow */}
        <span className="text-[10px] -mt-1 group-hover:scale-110 transition-transform">
          🐰
        </span>
        <ArrowUp className="w-4 h-4 mt-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </button>
  );
};
