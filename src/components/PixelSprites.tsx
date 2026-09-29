import React from 'react';
import { BunnyStage, BunnyEarType, BunnyPattern, BunnyWearable, FloatingEmote } from '../types';

interface PixelBunnyProps {
  furColor?: string;
  accentColor?: string;
  state?: 'idle' | 'eating' | 'bathing' | 'happy' | 'sleeping' | 'hopping' | 'running' | 'jumping' | 'petted' | 'interacting' | 'loving' | 'sniffing' | 'grooming';
  stage?: BunnyStage;
  earType?: BunnyEarType;
  pattern?: BunnyPattern;
  equippedWearables?: BunnyWearable[];
  currentEmote?: FloatingEmote | null;
  className?: string;
  size?: number;
}

export const FloatingEmoteBubble: React.FC<{
  emote: FloatingEmote;
  className?: string;
}> = ({ emote, className = '' }) => {
  return (
    <div
      key={emote.id}
      className={`absolute -top-9 left-1/2 -translate-x-1/2 z-40 pointer-events-none animate-bounce flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 border-2 border-sky-400 dark:border-sky-500 text-sky-950 dark:text-sky-100 font-extrabold text-[11px] font-mono shadow-lg whitespace-nowrap drop-shadow-md select-none ${className}`}
      style={{
        animationDuration: '1.8s',
      }}
    >
      {emote.icon && <span className="text-xs">{emote.icon}</span>}
      <span>{emote.text}</span>
    </div>
  );
};

export const PixelBunny: React.FC<PixelBunnyProps> = ({
  furColor = '#ffffff',
  accentColor = '#38bdf8',
  state = 'idle',
  stage = 'juvenile',
  earType = 'upright',
  pattern = 'solid',
  equippedWearables = [],
  currentEmote = null,
  className = '',
  size = 54,
}) => {
  const isSleeping = state === 'sleeping';
  const isHappy = state === 'happy' || state === 'loving' || state === 'petted';
  const isEating = state === 'eating';
  const isRunning = state === 'running' || state === 'hopping';
  const isJumping = state === 'jumping';
  const isInteracting = state === 'interacting';
  const isSniffing = state === 'sniffing';
  const isGrooming = state === 'grooming';
  const isBaby = stage === 'baby';
  const isAdult = stage === 'adult';

  // Base scale adjustment if size not overridden explicitly
  const effectiveSize = size || (isBaby ? 42 : isAdult ? 64 : 54);

  // Dynamic animation style based on pet action
  const getAnimationClass = () => {
    if (isSleeping) return 'opacity-90';
    if (isEating) return 'animate-bounce';
    if (isJumping) return 'animate-bounce -translate-y-2 scale-110';
    if (isInteracting) return 'animate-bounce scale-110';
    if (isSniffing) return 'animate-pulse scale-95';
    if (isGrooming) return 'animate-bounce';
    if (isHappy) return 'animate-pulse scale-105';
    if (isRunning) return 'animate-bunny-hop';
    return 'animate-bunny-hop';
  };

  return (
    <div
      className={`relative inline-block select-none ${getAnimationClass()} ${className}`}
      style={{ width: effectiveSize, height: effectiveSize }}
    >
      {/* Floating temporary emote popup if active */}
      {currentEmote && <FloatingEmoteBubble emote={currentEmote} />}

      {/* State Particle Overlays */}
      {/* 1. Eating Particles: Carrot crumbs */}
      {isEating && (
        <div className="absolute -top-1 -right-1 pointer-events-none z-20 flex gap-0.5 animate-ping">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 block" />
          <span className="w-1 h-1 rounded-full bg-orange-400 block" />
        </div>
      )}

      {/* 2. Jumping / Interacting Particles: Sparkles & Stars */}
      {(isJumping || isInteracting) && (
        <div className="absolute inset-x-0 -top-3 pointer-events-none z-20 flex justify-between px-1 animate-pulse">
          <PixelSparkle size={14} color="#facc15" />
          <PixelSparkle size={14} color="#38bdf8" />
        </div>
      )}

      {/* 3. Petted / Happy Particles: Floating Hearts */}
      {isHappy && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 pointer-events-none z-20 animate-bounce">
          <PixelHeart size={16} />
        </div>
      )}

      <svg
        viewBox="0 0 24 24"
        width={effectiveSize}
        height={effectiveSize}
        shapeRendering="crispEdges"
        className="w-full h-full drop-shadow-md transition-transform"
      >
        {/* Shadow under bunny */}
        <rect x={isBaby ? '6' : '4'} y="21" width={isBaby ? '12' : '16'} height="2" fill="#000000" opacity="0.18" />

        {/* EARS */}
        {earType === 'lop' ? (
          // Floppy lop ears hanging down
          <g>
            <rect x="3" y="9" width="3" height="7" fill={furColor} />
            <rect x="4" y="10" width="1" height="5" fill="#f472b6" />
            <rect x="2" y="9" width="1" height="6" fill={accentColor} opacity="0.6" />
            <rect x="18" y="9" width="3" height="7" fill={furColor} />
            <rect x="19" y="10" width="1" height="5" fill="#f472b6" />
            <rect x="21" y="9" width="1" height="6" fill={accentColor} opacity="0.6" />
          </g>
        ) : isBaby ? (
          // Baby tiny cute short ears
          <g>
            <rect x="7" y="3" width="3" height="4" fill={furColor} />
            <rect x="8" y="4" width="1" height="2" fill="#f472b6" />
            <rect x="6" y="3" width="1" height="4" fill={accentColor} opacity="0.5" />
            <rect x="14" y="3" width="3" height="4" fill={furColor} />
            <rect x="15" y="4" width="1" height="2" fill="#f472b6" />
            <rect x="17" y="3" width="1" height="4" fill={accentColor} opacity="0.5" />
          </g>
        ) : (
          // Upright / Adult majestic ears
          <g>
            {/* Left ear */}
            <rect x="6" y={isAdult ? '1' : '2'} width="3" height={isAdult ? '7' : '6'} fill={furColor} />
            <rect x="7" y={isAdult ? '2' : '3'} width="1" height={isAdult ? '5' : '4'} fill="#f472b6" />
            <rect x="5" y={isAdult ? '1' : '2'} width="1" height={isAdult ? '7' : '6'} fill={accentColor} opacity="0.6" />
            <rect x="6" y={isAdult ? '0' : '1'} width="3" height="1" fill={accentColor} opacity="0.6" />
            <rect x="9" y={isAdult ? '1' : '2'} width="1" height={isAdult ? '7' : '6'} fill={accentColor} opacity="0.6" />

            {/* Right ear */}
            <rect x="15" y={isAdult ? '1' : '2'} width="3" height={isAdult ? '7' : '6'} fill={furColor} />
            <rect x="16" y={isAdult ? '2' : '3'} width="1" height={isAdult ? '5' : '4'} fill="#f472b6" />
            <rect x="14" y={isAdult ? '1' : '2'} width="1" height={isAdult ? '7' : '6'} fill={accentColor} opacity="0.6" />
            <rect x="15" y={isAdult ? '0' : '1'} width="3" height="1" fill={accentColor} opacity="0.6" />
            <rect x="18" y={isAdult ? '1' : '2'} width="1" height={isAdult ? '7' : '6'} fill={accentColor} opacity="0.6" />
          </g>
        )}

        {/* HEAD */}
        <rect x={isBaby ? '6' : '5'} y={isBaby ? '6' : '7'} width={isBaby ? '12' : '14'} height={isBaby ? '9' : '8'} fill={furColor} />
        {/* Head outline accents */}
        <rect x={isBaby ? '5' : '4'} y={isBaby ? '7' : '8'} width="1" height={isBaby ? '7' : '6'} fill={accentColor} opacity="0.7" />
        <rect x={isBaby ? '18' : '19'} y={isBaby ? '7' : '8'} width="1" height={isBaby ? '7' : '6'} fill={accentColor} opacity="0.7" />
        <rect x="6" y={isBaby ? '5' : '6'} width="12" height="1" fill={accentColor} opacity="0.5" />

        {/* PATTERN ON HEAD: Dutch mask or Starry spots */}
        {pattern === 'dutch' && (
          <g>
            <rect x="5" y="7" width="4" height="8" fill="#475569" opacity="0.85" />
            <rect x="15" y="7" width="4" height="8" fill="#475569" opacity="0.85" />
          </g>
        )}
        {pattern === 'spotted' && (
          <g>
            <rect x="6" y="8" width="2" height="2" fill={accentColor} opacity="0.75" />
            <rect x="16" y="9" width="2" height="1" fill={accentColor} opacity="0.75" />
            <rect x="8" y="15" width="2" height="2" fill={accentColor} opacity="0.75" />
          </g>
        )}
        {pattern === 'starry' && (
          <g>
            <rect x="7" y="7" width="1" height="1" fill="#facc15" />
            <rect x="16" y="8" width="1" height="1" fill="#facc15" />
            <rect x="11" y="16" width="1" height="1" fill="#facc15" />
          </g>
        )}

        {/* BODY */}
        <rect x={isBaby ? '6' : '4'} y={isBaby ? '14' : '14'} width={isBaby ? '12' : '16'} height={isBaby ? '6' : '6'} fill={furColor} />
        {/* Tail */}
        <rect x="2" y={isBaby ? '15' : '16'} width={isAdult ? '3' : '2'} height={isAdult ? '4' : '3'} fill="#ffffff" stroke={accentColor} strokeWidth="0.5" />

        {/* Adult Regal Collar / Fluffy Chest */}
        {isAdult && (
          <g>
            <rect x="9" y="13" width="6" height="2" fill="#ffffff" />
            <rect x="11" y="15" width="2" height="1" fill="#facc15" />
            {/* Adult Mini Crown / Tiara */}
            <rect x="10" y="5" width="4" height="2" fill="#facc15" />
            <rect x="9" y="4" width="1" height="2" fill="#eab308" />
            <rect x="12" y="3" width="1" height="2" fill="#eab308" />
            <rect x="14" y="4" width="1" height="2" fill="#eab308" />
          </g>
        )}

        {/* Baby Pacifier or Head Flower */}
        {isBaby && (
          <g>
            {/* Tiny pink bow or flower */}
            <rect x="6" y="5" width="2" height="2" fill="#f43f5e" />
            <rect x="7" y="5" width="1" height="1" fill="#fde047" />
          </g>
        )}

        {/* BODY OUTLINE */}
        <rect x="3" y="15" width="1" height="4" fill={accentColor} opacity="0.7" />
        <rect x="20" y="15" width="1" height="4" fill={accentColor} opacity="0.7" />
        <rect x="5" y="20" width="14" height="1" fill={accentColor} opacity="0.7" />

        {/* PAWS */}
        <rect x="6" y="19" width="3" height="2" fill={furColor} />
        <rect x="15" y="19" width="3" height="2" fill={furColor} />
        <rect x="7" y="20" width="1" height="1" fill={accentColor} opacity="0.8" />
        <rect x="16" y="20" width="1" height="1" fill={accentColor} opacity="0.8" />

        {/* EYES */}
        {isSleeping ? (
          // Sleeping eyes: horizontal bars
          <g>
            <rect x="7" y="10" width="3" height="1" fill="#0f172a" />
            <rect x="14" y="10" width="3" height="1" fill="#0f172a" />
          </g>
        ) : isHappy ? (
          // Happy curved pixel eyes ^ ^
          <g>
            <rect x="7" y="10" width="1" height="1" fill="#0f172a" />
            <rect x="8" y="9" width="1" height="1" fill="#0f172a" />
            <rect x="9" y="10" width="1" height="1" fill="#0f172a" />

            <rect x="14" y="10" width="1" height="1" fill="#0f172a" />
            <rect x="15" y="9" width="1" height="1" fill="#0f172a" />
            <rect x="16" y="10" width="1" height="1" fill="#0f172a" />
          </g>
        ) : isBaby ? (
          // Baby big round starry eyes
          <g>
            <rect x="7" y="8" width="3" height="3" fill="#0f172a" />
            <rect x="7" y="8" width="1" height="2" fill="#ffffff" />
            <rect x="8" y="10" width="1" height="1" fill="#bae6fd" />
            <rect x="14" y="8" width="3" height="3" fill="#0f172a" />
            <rect x="14" y="8" width="1" height="2" fill="#ffffff" />
            <rect x="15" y="10" width="1" height="1" fill="#bae6fd" />
          </g>
        ) : (
          // Normal pixel eyes with highlight
          <g>
            <rect x="7" y="9" width="2" height="2" fill="#0f172a" />
            <rect x="7" y="9" width="1" height="1" fill="#ffffff" />
            <rect x="15" y="9" width="2" height="2" fill="#0f172a" />
            <rect x="15" y="9" width="1" height="1" fill="#ffffff" />
          </g>
        )}

        {/* BLUSH CHEEKS */}
        <rect x={isBaby ? '4' : '5'} y="11" width={isBaby ? '3' : '2'} height="1" fill="#f472b6" opacity={isBaby ? '0.95' : '0.8'} />
        <rect x={isBaby ? '17' : '17'} y="11" width={isBaby ? '3' : '2'} height="1" fill="#f472b6" opacity={isBaby ? '0.95' : '0.8'} />

        {/* NOSE */}
        <rect x="11" y={isSniffing ? "12" : "11"} width="2" height="1" fill="#f43f5e" className={isSniffing ? "animate-pulse" : ""} />

        {/* MOUTH / EATING CARROT PIXEL */}
        {isEating ? (
          // Pixel carrot munching
          <g>
            <rect x="11" y="13" width="3" height="2" fill="#f97316" />
            <rect x="14" y="12" width="2" height="1" fill="#22c55e" />
          </g>
        ) : (
          <rect x="11" y="12" width="2" height="1" fill="#0f172a" opacity="0.6" />
        )}

        {/* ================= EQUIPPED WEARABLES / CLOTHING ================= */}
        {/* 1. Back Layer Wearables: Angel Wings & Hero Cape */}
        {equippedWearables?.includes('angel_wings') && (
          <g opacity="0.95">
            <rect x="0" y="11" width="4" height="6" fill="#ffffff" />
            <rect x="1" y="12" width="2" height="4" fill="#bae6fd" />
            <rect x="20" y="11" width="4" height="6" fill="#ffffff" />
            <rect x="21" y="12" width="2" height="4" fill="#bae6fd" />
          </g>
        )}
        {equippedWearables?.includes('hero_cape') && (
          <g>
            <rect x="3" y="15" width="2" height="7" fill="#ef4444" />
            <rect x="19" y="15" width="2" height="7" fill="#ef4444" />
            <rect x="5" y="18" width="14" height="4" fill="#dc2626" />
          </g>
        )}

        {/* 2. Neck Layer Wearables: Scarf & Bell Collar */}
        {equippedWearables?.includes('red_scarf') && (
          <g>
            <rect x="5" y="13" width="14" height="2" fill="#ef4444" />
            <rect x="15" y="15" width="3" height="4" fill="#dc2626" />
          </g>
        )}
        {equippedWearables?.includes('bell_collar') && (
          <g>
            <rect x="6" y="13" width="12" height="1" fill="#dc2626" />
            <rect x="11" y="14" width="2" height="2" fill="#facc15" />
            <rect x="11" y="15" width="2" height="1" fill="#eab308" />
          </g>
        )}

        {/* 3. Eye Layer Wearables: Cool Sunglasses */}
        {equippedWearables?.includes('cool_glasses') && (
          <g>
            <rect x="6" y="8" width="5" height="3" fill="#0f172a" />
            <rect x="13" y="8" width="5" height="3" fill="#0f172a" />
            <rect x="11" y="9" width="2" height="1" fill="#0f172a" />
            <rect x="7" y="8" width="1" height="1" fill="#ffffff" />
            <rect x="14" y="8" width="1" height="1" fill="#ffffff" />
          </g>
        )}

        {/* 5. Full Body Clothing Wearables: Sailor Suit, Kimono, Overalls, Sweater, Detective Coat */}
        {equippedWearables?.includes('sailor_suit') && (
          <g>
            <rect x="5" y="14" width="14" height="5" fill="#0284c7" />
            <rect x="8" y="14" width="8" height="2" fill="#ffffff" />
            <rect x="11" y="15" width="2" height="2" fill="#ef4444" />
          </g>
        )}
        {equippedWearables?.includes('kimono') && (
          <g>
            <rect x="5" y="14" width="14" height="6" fill="#f472b6" />
            <rect x="6" y="16" width="12" height="2" fill="#fde047" />
            <rect x="10" y="15" width="4" height="3" fill="#ec4899" />
          </g>
        )}
        {equippedWearables?.includes('overalls') && (
          <g>
            <rect x="5" y="15" width="14" height="5" fill="#f97316" />
            <rect x="7" y="13" width="2" height="3" fill="#ea580c" />
            <rect x="15" y="13" width="2" height="3" fill="#ea580c" />
            <rect x="11" y="16" width="2" height="2" fill="#22c55e" />
          </g>
        )}
        {equippedWearables?.includes('cozy_sweater') && (
          <g>
            <rect x="4" y="14" width="16" height="6" fill="#dc2626" />
            <rect x="5" y="15" width="14" height="1" fill="#ffffff" />
            <rect x="8" y="17" width="2" height="1" fill="#ffffff" />
            <rect x="14" y="17" width="2" height="1" fill="#ffffff" />
          </g>
        )}
        {equippedWearables?.includes('detective_coat') && (
          <g>
            <rect x="4" y="14" width="16" height="6" fill="#78350f" />
            <rect x="6" y="14" width="12" height="2" fill="#92400e" />
            <rect x="9" y="16" width="1" height="1" fill="#facc15" />
            <rect x="14" y="16" width="1" height="1" fill="#facc15" />
            <rect x="9" y="18" width="1" height="1" fill="#facc15" />
            <rect x="14" y="18" width="1" height="1" fill="#facc15" />
          </g>
        )}
        {equippedWearables?.includes('crown') && (
          <g>
            <rect x="9" y="2" width="6" height="3" fill="#facc15" />
            <rect x="8" y="1" width="2" height="2" fill="#eab308" />
            <rect x="11" y="0" width="2" height="2" fill="#facc15" />
            <rect x="14" y="1" width="2" height="2" fill="#eab308" />
            <rect x="11" y="2" width="2" height="1" fill="#ef4444" />
          </g>
        )}
        {equippedWearables?.includes('party_hat') && (
          <g>
            <polygon points="12,1 8,7 16,7" fill="#ec4899" />
            <line x1="8" y1="5" x2="16" y2="5" stroke="#fde047" strokeWidth="1" />
            <circle cx="12" cy="1" r="1.5" fill="#facc15" />
          </g>
        )}
        {equippedWearables?.includes('pink_bow') && (
          <g>
            <rect x="4" y="4" width="2" height="2" fill="#ec4899" />
            <rect x="7" y="4" width="2" height="2" fill="#ec4899" />
            <rect x="6" y="4" width="1" height="2" fill="#ffffff" />
          </g>
        )}
        {equippedWearables?.includes('straw_hat') && (
          <g>
            <rect x="4" y="5" width="16" height="2" fill="#fde047" />
            <rect x="7" y="2" width="10" height="3" fill="#facc15" />
            <rect x="7" y="4" width="10" height="1" fill="#0284c7" />
          </g>
        )}
        {equippedWearables?.includes('wizard_hat') && (
          <g>
            <polygon points="12,0 7,6 17,6" fill="#6b21a8" />
            <rect x="5" y="6" width="14" height="2" fill="#581c87" />
            <rect x="11" y="3" width="1" height="1" fill="#facc15" />
          </g>
        )}
      </svg>

      {/* Floating Zzz when sleeping */}
      {isSleeping && !currentEmote && (
        <div className="absolute -top-3 right-0 text-[10px] font-bold font-mono text-indigo-400 animate-pulse pointer-events-none">
          zZ
        </div>
      )}
    </div>
  );
};

interface PixelEggProps {
  size?: number;
  className?: string;
  onClick?: () => void;
  variant?: number; // 0 to 6 for random colors and shapes
}

const EGG_THEMES = [
  // 0: Sakura Pink Heart
  {
    shellLight: '#fce7f3',
    shellMid: '#fbcfe8',
    shellDark: '#f472b6',
    outline: '#be185d',
    speckleA: '#e11d48',
    speckleB: '#ffffff',
    pattern: 'heart',
  },
  // 1: Golden Sunburst Crown
  {
    shellLight: '#fef9c3',
    shellMid: '#fef08a',
    shellDark: '#facc15',
    outline: '#a16207',
    speckleA: '#ea580c',
    speckleB: '#ffffff',
    pattern: 'crown',
  },
  // 2: Celestial Galaxy Purple
  {
    shellLight: '#f3e8ff',
    shellMid: '#e9d5ff',
    shellDark: '#c084fc',
    outline: '#6b21a8',
    speckleA: '#38bdf8',
    speckleB: '#fef08a',
    pattern: 'star',
  },
  // 3: Mint Clover Green
  {
    shellLight: '#dcfce7',
    shellMid: '#bbf7d0',
    shellDark: '#4ade80',
    outline: '#15803d',
    speckleA: '#166534',
    speckleB: '#ffffff',
    pattern: 'clover',
  },
  // 4: Ocean Aqua Wave
  {
    shellLight: '#e0f2fe',
    shellMid: '#bae6fd',
    shellDark: '#38bdf8',
    outline: '#0369a1',
    speckleA: '#0284c7',
    speckleB: '#ffffff',
    pattern: 'wave',
  },
  // 5: Peach Sunset Stripes
  {
    shellLight: '#ffedd5',
    shellMid: '#fed7aa',
    shellDark: '#fb923c',
    outline: '#c2410c',
    speckleA: '#f43f5e',
    speckleB: '#fde047',
    pattern: 'stripes',
  },
  // 6: Bunny Ear Surprise Egg
  {
    shellLight: '#ffffff',
    shellMid: '#f1f5f9',
    shellDark: '#cbd5e1',
    outline: '#475569',
    speckleA: '#f472b6',
    speckleB: '#38bdf8',
    pattern: 'ears',
  },
  // 7: Rainbow Pastel Polka Dots
  {
    shellLight: '#fef08a',
    shellMid: '#fed7aa',
    shellDark: '#f472b6',
    outline: '#be185d',
    speckleA: '#38bdf8',
    speckleB: '#4ade80',
    pattern: 'polka',
  },
  // 8: Dragon Scale Emerald
  {
    shellLight: '#a7f3d0',
    shellMid: '#34d399',
    shellDark: '#059669',
    outline: '#064e3b',
    speckleA: '#047857',
    speckleB: '#fbbf24',
    pattern: 'dragon',
  },
  // 9: Starlight Neon Crystal
  {
    shellLight: '#ede9fe',
    shellMid: '#c4b5fd',
    shellDark: '#8b5cf6',
    outline: '#5b21b6',
    speckleA: '#f43f5e',
    speckleB: '#38bdf8',
    pattern: 'crystal',
  },
];

export const PixelEgg: React.FC<PixelEggProps> = ({
  size = 48,
  className = '',
  onClick,
  variant = 0,
}) => {
  const theme = EGG_THEMES[Math.abs(variant) % EGG_THEMES.length];

  return (
    <div
      onClick={onClick}
      className={`relative inline-block select-none cursor-pointer group ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 20 24"
        width={size}
        height={size}
        shapeRendering="crispEdges"
        className="w-full h-full drop-shadow-md group-hover:scale-115 transition-transform animate-bounce"
      >
        {/* Soft shadow */}
        <rect x="4" y="21" width="12" height="2" fill="#000000" opacity="0.25" />

        {/* Optional Bunny Ears for Variant 6 */}
        {theme.pattern === 'ears' && (
          <g>
            {/* Left ear */}
            <rect x="5" y="0" width="3" height="3" fill="#ffffff" stroke={theme.outline} strokeWidth="0.6" />
            <rect x="6" y="1" width="1" height="2" fill="#f472b6" />
            {/* Right ear */}
            <rect x="12" y="0" width="3" height="3" fill="#ffffff" stroke={theme.outline} strokeWidth="0.6" />
            <rect x="13" y="1" width="1" height="2" fill="#f472b6" />
          </g>
        )}

        {/* Egg Shell Outer Pixels */}
        <rect x="7" y="2" width="6" height="2" fill={theme.shellLight} />
        <rect x="5" y="4" width="10" height="2" fill={theme.shellLight} />
        <rect x="4" y="6" width="12" height="4" fill={theme.shellMid} />
        <rect x="3" y="10" width="14" height="6" fill={theme.shellMid} />
        <rect x="4" y="16" width="12" height="3" fill={theme.shellDark} />
        <rect x="6" y="19" width="8" height="2" fill={theme.shellDark} />

        {/* Egg Shell Shading / Outline */}
        <rect x="6" y="2" width="1" height="2" fill={theme.outline} opacity="0.6" />
        <rect x="13" y="2" width="1" height="2" fill={theme.outline} opacity="0.6" />
        <rect x="4" y="4" width="1" height="2" fill={theme.outline} opacity="0.7" />
        <rect x="15" y="4" width="1" height="2" fill={theme.outline} opacity="0.7" />
        <rect x="3" y="6" width="1" height="10" fill={theme.outline} opacity="0.7" />
        <rect x="16" y="6" width="1" height="10" fill={theme.outline} opacity="0.8" />
        <rect x="4" y="16" width="1" height="3" fill={theme.outline} opacity="0.8" />
        <rect x="15" y="16" width="1" height="3" fill={theme.outline} opacity="0.9" />
        <rect x="5" y="19" width="1" height="2" fill={theme.outline} opacity="0.9" />
        <rect x="14" y="19" width="1" height="2" fill={theme.outline} opacity="0.9" />

        {/* White glossy catchlight */}
        <rect x="6" y="5" width="2" height="3" fill="#ffffff" />
        <rect x="5" y="7" width="1" height="3" fill="#ffffff" />

        {/* Distinctive Pixel Pattern per Variant */}
        {theme.pattern === 'heart' && (
          // Center pixel heart
          <g fill={theme.speckleA}>
            <rect x="8" y="10" width="2" height="1" />
            <rect x="11" y="10" width="2" height="1" />
            <rect x="7" y="11" width="7" height="2" />
            <rect x="8" y="13" width="5" height="1" />
            <rect x="9" y="14" width="3" height="1" />
            <rect x="10" y="15" width="1" height="1" />
          </g>
        )}

        {theme.pattern === 'crown' && (
          // Golden mini crown
          <g fill={theme.speckleA}>
            <rect x="7" y="10" width="1" height="2" />
            <rect x="10" y="9" width="1" height="3" />
            <rect x="13" y="10" width="1" height="2" />
            <rect x="7" y="12" width="7" height="2" />
          </g>
        )}

        {theme.pattern === 'star' && (
          // Galaxy pixel star
          <g fill={theme.speckleB}>
            <rect x="10" y="8" width="1" height="5" />
            <rect x="8" y="10" width="5" height="1" />
            <rect x="6" y="14" width="2" height="2" fill={theme.speckleA} />
            <rect x="13" y="15" width="2" height="2" fill={theme.speckleA} />
          </g>
        )}

        {theme.pattern === 'clover' && (
          // 4-leaf clover cross
          <g fill={theme.speckleA}>
            <rect x="9" y="10" width="3" height="1" />
            <rect x="8" y="11" width="5" height="1" />
            <rect x="9" y="12" width="3" height="1" />
            <rect x="10" y="13" width="1" height="2" />
          </g>
        )}

        {theme.pattern === 'wave' && (
          // Wavy oceanic lines
          <g fill={theme.speckleA}>
            <rect x="5" y="10" width="3" height="1" />
            <rect x="8" y="11" width="4" height="1" />
            <rect x="12" y="10" width="3" height="1" />
            <rect x="5" y="14" width="3" height="1" />
            <rect x="8" y="15" width="4" height="1" />
            <rect x="12" y="14" width="3" height="1" />
          </g>
        )}

        {theme.pattern === 'stripes' && (
          // Candy stripes
          <g>
            <rect x="4" y="9" width="12" height="1" fill={theme.speckleA} />
            <rect x="3" y="12" width="14" height="1" fill={theme.speckleB} />
            <rect x="4" y="15" width="12" height="1" fill={theme.speckleA} />
          </g>
        )}

        {theme.pattern === 'ears' && (
          // Cute bunny face on egg
          <g>
            <rect x="7" y="11" width="2" height="2" fill="#0f172a" />
            <rect x="12" y="11" width="2" height="2" fill="#0f172a" />
            <rect x="10" y="13" width="1" height="1" fill="#f43f5e" />
            <rect x="6" y="13" width="2" height="1" fill="#f472b6" />
            <rect x="13" y="13" width="2" height="1" fill="#f472b6" />
          </g>
        )}

        {theme.pattern === 'polka' && (
          // Playful rainbow polka dots
          <g>
            <rect x="6" y="8" width="2" height="2" fill={theme.speckleA} />
            <rect x="12" y="8" width="2" height="2" fill={theme.speckleB} />
            <rect x="9" y="11" width="2" height="2" fill="#ec4899" />
            <rect x="6" y="14" width="2" height="2" fill={theme.speckleB} />
            <rect x="12" y="14" width="2" height="2" fill={theme.speckleA} />
          </g>
        )}

        {theme.pattern === 'dragon' && (
          // Diamond dragon scales
          <g fill={theme.speckleA}>
            <rect x="9" y="7" width="2" height="2" />
            <rect x="6" y="10" width="2" height="2" />
            <rect x="12" y="10" width="2" height="2" />
            <rect x="9" y="13" width="2" height="2" fill={theme.speckleB} />
            <rect x="6" y="16" width="2" height="2" />
            <rect x="12" y="16" width="2" height="2" />
          </g>
        )}

        {theme.pattern === 'crystal' && (
          // Shining crystal neon shard
          <g>
            <polygon points="10,6 13,11 10,16 7,11" fill={theme.speckleB} opacity="0.9" />
            <polygon points="10,8 12,11 10,14 8,11" fill="#ffffff" />
            <circle cx="10" cy="11" r="1" fill={theme.speckleA} />
          </g>
        )}
      </svg>

      {/* Sparkles around pixel egg */}
      <div className="absolute -top-1 -right-1 text-[11px] animate-ping pointer-events-none">
        ✨
      </div>
      <div className="absolute -bottom-1 -left-1 text-[9px] animate-pulse pointer-events-none">
        ⭐
      </div>
    </div>
  );
};

export const PixelHeart: React.FC<{ size?: number; className?: string }> = ({
  size = 28,
  className = '',
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    shapeRendering="crispEdges"
    className={`inline-block drop-shadow-md select-none ${className}`}
  >
    {/* Dark outline */}
    <rect x="2" y="3" width="4" height="1" fill="#881337" />
    <rect x="10" y="3" width="4" height="1" fill="#881337" />
    <rect x="1" y="4" width="1" height="4" fill="#881337" />
    <rect x="6" y="4" width="4" height="1" fill="#881337" />
    <rect x="14" y="4" width="1" height="4" fill="#881337" />
    <rect x="2" y="8" width="1" height="2" fill="#881337" />
    <rect x="13" y="8" width="1" height="2" fill="#881337" />
    <rect x="3" y="10" width="1" height="2" fill="#881337" />
    <rect x="12" y="10" width="1" height="2" fill="#881337" />
    <rect x="4" y="12" width="2" height="1" fill="#881337" />
    <rect x="10" y="12" width="2" height="1" fill="#881337" />
    <rect x="6" y="13" width="4" height="1" fill="#881337" />
    <rect x="7" y="14" width="2" height="1" fill="#881337" />

    {/* Body Fill */}
    <rect x="2" y="4" width="4" height="4" fill="#f43f5e" />
    <rect x="10" y="4" width="4" height="4" fill="#f43f5e" />
    <rect x="2" y="8" width="12" height="2" fill="#f43f5e" />
    <rect x="3" y="10" width="10" height="2" fill="#f43f5e" />
    <rect x="5" y="12" width="6" height="1" fill="#e11d48" />

    {/* Catchlight */}
    <rect x="3" y="4" width="2" height="2" fill="#ffffff" />
    <rect x="11" y="4" width="1" height="2" fill="#ffffff" />
  </svg>
);

export const PixelBubble: React.FC<{ size?: number; className?: string }> = ({
  size = 28,
  className = '',
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    shapeRendering="crispEdges"
    className={`inline-block drop-shadow-md select-none ${className}`}
  >
    {/* Dark Cyan Outline */}
    <rect x="5" y="1" width="6" height="1" fill="#0284c7" />
    <rect x="3" y="2" width="2" height="1" fill="#0284c7" />
    <rect x="11" y="2" width="2" height="1" fill="#0284c7" />
    <rect x="2" y="3" width="1" height="2" fill="#0284c7" />
    <rect x="13" y="3" width="1" height="2" fill="#0284c7" />
    <rect x="1" y="5" width="1" height="6" fill="#0284c7" />
    <rect x="14" y="5" width="1" height="6" fill="#0284c7" />
    <rect x="2" y="11" width="1" height="2" fill="#0284c7" />
    <rect x="13" y="11" width="1" height="2" fill="#0284c7" />
    <rect x="3" y="13" width="2" height="1" fill="#0284c7" />
    <rect x="11" y="13" width="2" height="1" fill="#0284c7" />
    <rect x="5" y="14" width="6" height="1" fill="#0284c7" />

    {/* Inner Translucent Fill */}
    <rect x="3" y="3" width="10" height="10" fill="#bae6fd" opacity="0.65" />
    <rect x="5" y="2" width="6" height="1" fill="#7dd3fc" opacity="0.75" />
    <rect x="5" y="13" width="6" height="1" fill="#38bdf8" opacity="0.8" />

    {/* Bright Reflection */}
    <rect x="4" y="4" width="3" height="3" fill="#ffffff" />
    <rect x="7" y="4" width="1" height="1" fill="#ffffff" />
    <rect x="4" y="7" width="1" height="1" fill="#ffffff" />
    <rect x="11" y="11" width="2" height="2" fill="#ffffff" opacity="0.8" />
  </svg>
);

export const PixelSparkle: React.FC<{ size?: number; className?: string; color?: string }> = ({
  size = 24,
  className = '',
  color = '#fde047',
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    shapeRendering="crispEdges"
    className={`inline-block drop-shadow-md select-none ${className}`}
  >
    {/* Center 4-point star */}
    <rect x="7" y="1" width="2" height="14" fill={color} />
    <rect x="1" y="7" width="14" height="2" fill={color} />
    <rect x="5" y="5" width="6" height="6" fill={color} />
    {/* Center core highlight */}
    <rect x="7" y="7" width="2" height="2" fill="#ffffff" />
    {/* Mini outer pixel dots */}
    <rect x="3" y="3" width="1" height="1" fill={color} opacity="0.8" />
    <rect x="12" y="3" width="1" height="1" fill={color} opacity="0.8" />
    <rect x="3" y="12" width="1" height="1" fill={color} opacity="0.8" />
    <rect x="12" y="12" width="1" height="1" fill={color} opacity="0.8" />
  </svg>
);

export const PixelCarrot: React.FC<{ size?: number; className?: string }> = ({
  size = 32,
  className = '',
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    shapeRendering="crispEdges"
    className={`inline-block drop-shadow-sm select-none ${className}`}
  >
    {/* Leaf Greens (Top Right) */}
    <rect x="11" y="1" width="2" height="2" fill="#16a34a" />
    <rect x="13" y="0" width="2" height="2" fill="#22c55e" />
    <rect x="10" y="2" width="2" height="2" fill="#15803d" />
    <rect x="13" y="2" width="2" height="2" fill="#4ade80" />
    <rect x="12" y="3" width="1" height="2" fill="#166534" />
    <rect x="9" y="3" width="2" height="1" fill="#22c55e" />

    {/* Carrot Root Outline */}
    <rect x="7" y="3" width="5" height="1" fill="#9a3412" />
    <rect x="6" y="4" width="7" height="1" fill="#9a3412" />
    <rect x="5" y="5" width="8" height="2" fill="#9a3412" />
    <rect x="4" y="7" width="8" height="2" fill="#9a3412" />
    <rect x="3" y="9" width="7" height="2" fill="#9a3412" />
    <rect x="2" y="11" width="6" height="2" fill="#9a3412" />
    <rect x="1" y="13" width="5" height="1" fill="#9a3412" />
    <rect x="1" y="14" width="3" height="1" fill="#9a3412" />
    <rect x="0" y="15" width="2" height="1" fill="#9a3412" />

    {/* Carrot Body Fill (Vibrant Orange) */}
    <rect x="7" y="4" width="5" height="1" fill="#ea580c" />
    <rect x="6" y="5" width="6" height="2" fill="#f97316" />
    <rect x="5" y="7" width="6" height="2" fill="#f97316" />
    <rect x="4" y="9" width="5" height="2" fill="#f97316" />
    <rect x="3" y="11" width="4" height="2" fill="#f97316" />
    <rect x="2" y="13" width="3" height="1" fill="#f97316" />
    <rect x="1" y="14" width="2" height="1" fill="#ea580c" />

    {/* Highlights */}
    <rect x="8" y="5" width="3" height="1" fill="#fed7aa" />
    <rect x="7" y="7" width="3" height="1" fill="#fed7aa" />
    <rect x="5" y="9" width="2" height="1" fill="#fed7aa" />

    {/* Carrot Ridges */}
    <rect x="6" y="6" width="3" height="1" fill="#c2410c" />
    <rect x="5" y="8" width="3" height="1" fill="#c2410c" />
    <rect x="4" y="10" width="3" height="1" fill="#c2410c" />
    <rect x="3" y="12" width="2" height="1" fill="#c2410c" />
  </svg>
);

export const PixelFoodBag: React.FC<{ size?: number; className?: string }> = ({
  size = 32,
  className = '',
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    shapeRendering="crispEdges"
    className={`inline-block drop-shadow-sm select-none ${className}`}
  >
    {/* Wheat Sprouts Poking Out */}
    <rect x="4" y="1" width="2" height="2" fill="#84cc16" />
    <rect x="3" y="2" width="1" height="2" fill="#65a30d" />
    <rect x="10" y="1" width="2" height="2" fill="#eab308" />
    <rect x="11" y="2" width="2" height="2" fill="#ca8a04" />
    <rect x="7" y="0" width="2" height="2" fill="#facc15" />
    <rect x="7" y="2" width="2" height="2" fill="#a16207" />

    {/* Sack Neck / Tied Rope */}
    <rect x="4" y="4" width="8" height="2" fill="#78350f" />
    <rect x="5" y="4" width="6" height="1" fill="#fef08a" />
    <rect x="6" y="5" width="4" height="1" fill="#eab308" />

    {/* Sack Body Outline */}
    <rect x="3" y="6" width="10" height="8" fill="#78350f" />
    <rect x="2" y="7" width="12" height="6" fill="#78350f" />
    <rect x="4" y="14" width="8" height="1" fill="#78350f" />

    {/* Sack Body Fill */}
    <rect x="4" y="6" width="8" height="1" fill="#d97706" />
    <rect x="3" y="7" width="10" height="6" fill="#b45309" />
    <rect x="4" y="7" width="8" height="5" fill="#d97706" />
    <rect x="5" y="8" width="6" height="4" fill="#f59e0b" />

    {/* Sack Stitching / Patch Pattern */}
    <rect x="5" y="9" width="2" height="2" fill="#78350f" opacity="0.6" />
    <rect x="8" y="10" width="3" height="1" fill="#fde68a" />
    <rect x="6" y="12" width="4" height="1" fill="#92400e" />
  </svg>
);

export const PixelToy: React.FC<{ size?: number; className?: string }> = ({
  size = 32,
  className = '',
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    shapeRendering="crispEdges"
    className={`inline-block drop-shadow-sm select-none ${className}`}
  >
    {/* Yarn Ball Outline */}
    <rect x="5" y="2" width="6" height="1" fill="#831843" />
    <rect x="3" y="3" width="10" height="1" fill="#831843" />
    <rect x="2" y="4" width="12" height="8" fill="#831843" />
    <rect x="3" y="12" width="10" height="1" fill="#831843" />
    <rect x="5" y="13" width="6" height="1" fill="#831843" />

    {/* Body Fill (Pastel Rose & Violet) */}
    <rect x="5" y="3" width="6" height="1" fill="#ec4899" />
    <rect x="3" y="4" width="10" height="8" fill="#f472b6" />
    <rect x="5" y="12" width="6" height="1" fill="#db2777" />

    {/* Curved Yarn Strands */}
    <rect x="5" y="4" width="5" height="1" fill="#fbcfe8" />
    <rect x="4" y="5" width="2" height="2" fill="#fbcfe8" />
    <rect x="7" y="6" width="4" height="2" fill="#be185d" />
    <rect x="4" y="8" width="6" height="2" fill="#c084fc" />
    <rect x="8" y="9" width="3" height="2" fill="#a855f7" />
    <rect x="4" y="10" width="4" height="1" fill="#fbcfe8" />

    {/* Trailing Yarn Tail */}
    <rect x="12" y="11" width="3" height="1" fill="#ec4899" />
    <rect x="14" y="12" width="2" height="2" fill="#db2777" />
    <rect x="13" y="14" width="2" height="1" fill="#9d174d" />
  </svg>
);

export const PixelSoap: React.FC<{ size?: number; className?: string }> = ({
  size = 32,
  className = '',
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    shapeRendering="crispEdges"
    className={`inline-block drop-shadow-sm select-none ${className}`}
  >
    {/* Soap bar outline */}
    <rect x="3" y="5" width="10" height="7" fill="#0369a1" />
    <rect x="2" y="6" width="12" height="5" fill="#0369a1" />

    {/* Soap body */}
    <rect x="3" y="6" width="10" height="5" fill="#38bdf8" />
    <rect x="4" y="7" width="8" height="3" fill="#7dd3fc" />
    <rect x="4" y="7" width="5" height="1" fill="#ffffff" />

    {/* Bubbles on top */}
    <rect x="4" y="2" width="3" height="3" fill="#bae6fd" />
    <rect x="5" y="2" width="1" height="1" fill="#ffffff" />
    <rect x="9" y="3" width="2" height="2" fill="#bae6fd" />
    <rect x="10" y="3" width="1" height="1" fill="#ffffff" />
  </svg>
);

// Navigation & Web Pixel Icons
export const PixelHutch: React.FC<{ size?: number; className?: string }> = ({
  size = 20,
  className = '',
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    shapeRendering="crispEdges"
    className={`inline-block select-none ${className}`}
  >
    {/* Roof */}
    <rect x="7" y="1" width="2" height="1" fill="#e11d48" />
    <rect x="5" y="2" width="6" height="1" fill="#f43f5e" />
    <rect x="3" y="3" width="10" height="1" fill="#fb7185" />
    <rect x="1" y="4" width="14" height="2" fill="#fda4af" />
    <rect x="1" y="5" width="14" height="1" fill="#e11d48" />
    {/* Hutch Body */}
    <rect x="2" y="6" width="12" height="8" fill="#fef3c7" />
    <rect x="2" y="6" width="1" height="8" fill="#d97706" />
    <rect x="13" y="6" width="1" height="8" fill="#d97706" />
    <rect x="2" y="14" width="12" height="1" fill="#b45309" />
    {/* Door / Window */}
    <rect x="5" y="8" width="6" height="6" fill="#fbcfe8" />
    <rect x="6" y="9" width="4" height="4" fill="#ffffff" />
    {/* Tiny Heart on Hutch */}
    <rect x="7" y="10" width="2" height="1" fill="#f43f5e" />
    <rect x="7" y="11" width="2" height="1" fill="#e11d48" />
  </svg>
);

export const PixelMeadow: React.FC<{ size?: number; className?: string }> = ({
  size = 20,
  className = '',
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    shapeRendering="crispEdges"
    className={`inline-block select-none ${className}`}
  >
    {/* Hill silhouette */}
    <rect x="0" y="10" width="16" height="5" fill="#4ade80" />
    <rect x="2" y="8" width="12" height="2" fill="#22c55e" />
    <rect x="4" y="6" width="8" height="2" fill="#86efac" />
    <rect x="0" y="15" width="16" height="1" fill="#15803d" />
    {/* Flowers */}
    <rect x="3" y="6" width="2" height="2" fill="#f472b6" />
    <rect x="4" y="7" width="1" height="1" fill="#fef08a" />
    <rect x="11" y="7" width="2" height="2" fill="#fbbf24" />
    <rect x="12" y="8" width="1" height="1" fill="#ffffff" />
    {/* Grass blades */}
    <rect x="7" y="5" width="1" height="3" fill="#16a34a" />
    <rect x="9" y="4" width="1" height="4" fill="#15803d" />
  </svg>
);

export const PixelBot: React.FC<{ size?: number; className?: string }> = ({
  size = 20,
  className = '',
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    shapeRendering="crispEdges"
    className={`inline-block select-none ${className}`}
  >
    {/* Antenna */}
    <rect x="7" y="1" width="2" height="1" fill="#f472b6" />
    <rect x="7" y="2" width="2" height="2" fill="#38bdf8" />
    {/* Head */}
    <rect x="3" y="4" width="10" height="8" fill="#e0f2fe" />
    <rect x="2" y="5" width="12" height="6" fill="#bae6fd" />
    <rect x="3" y="4" width="10" height="1" fill="#0284c7" />
    <rect x="2" y="5" width="1" height="6" fill="#0284c7" />
    <rect x="13" y="5" width="1" height="6" fill="#0284c7" />
    <rect x="3" y="12" width="10" height="1" fill="#0284c7" />
    {/* Ears */}
    <rect x="1" y="7" width="1" height="3" fill="#f472b6" />
    <rect x="14" y="7" width="1" height="3" fill="#f472b6" />
    {/* Eyes */}
    <rect x="5" y="7" width="2" height="2" fill="#0369a1" />
    <rect x="5" y="7" width="1" height="1" fill="#ffffff" />
    <rect x="9" y="7" width="2" height="2" fill="#0369a1" />
    <rect x="9" y="7" width="1" height="1" fill="#ffffff" />
    {/* Cute Mouth */}
    <rect x="7" y="10" width="2" height="1" fill="#f43f5e" />
  </svg>
);

export const PixelCommunity: React.FC<{ size?: number; className?: string }> = ({
  size = 20,
  className = '',
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    shapeRendering="crispEdges"
    className={`inline-block select-none ${className}`}
  >
    {/* Main bubble */}
    <rect x="1" y="2" width="10" height="7" fill="#fbcfe8" />
    <rect x="1" y="2" width="10" height="1" fill="#db2777" />
    <rect x="0" y="3" width="1" height="5" fill="#db2777" />
    <rect x="11" y="3" width="1" height="5" fill="#db2777" />
    <rect x="1" y="9" width="7" height="1" fill="#db2777" />
    <rect x="2" y="10" width="2" height="2" fill="#db2777" />
    {/* Dots inside main */}
    <rect x="3" y="5" width="2" height="1" fill="#be185d" />
    <rect x="6" y="5" width="2" height="1" fill="#be185d" />
    {/* Secondary bubble */}
    <rect x="7" y="7" width="8" height="6" fill="#bae6fd" />
    <rect x="7" y="7" width="8" height="1" fill="#0284c7" />
    <rect x="6" y="8" width="1" height="4" fill="#0284c7" />
    <rect x="15" y="8" width="1" height="4" fill="#0284c7" />
    <rect x="7" y="13" width="8" height="1" fill="#0284c7" />
    <rect x="12" y="14" width="2" height="2" fill="#0284c7" />
  </svg>
);

export const PixelBell: React.FC<{ size?: number; className?: string }> = ({
  size = 18,
  className = '',
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    shapeRendering="crispEdges"
    className={`inline-block select-none ${className}`}
  >
    {/* Top pin */}
    <rect x="7" y="1" width="2" height="2" fill="#f59e0b" />
    {/* Bell dome */}
    <rect x="5" y="3" width="6" height="2" fill="#fbbf24" />
    <rect x="4" y="5" width="8" height="4" fill="#fde68a" />
    <rect x="3" y="9" width="10" height="2" fill="#fbbf24" />
    <rect x="2" y="11" width="12" height="2" fill="#d97706" />
    <rect x="3" y="11" width="10" height="1" fill="#fef3c7" />
    {/* Clapper */}
    <rect x="7" y="13" width="2" height="2" fill="#b45309" />
  </svg>
);

export const PixelSun: React.FC<{ size?: number; className?: string }> = ({
  size = 18,
  className = '',
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    shapeRendering="crispEdges"
    className={`inline-block select-none ${className}`}
  >
    {/* Center Core */}
    <rect x="5" y="5" width="6" height="6" fill="#fbbf24" />
    <rect x="6" y="6" width="4" height="4" fill="#fef08a" />
    {/* Sun Rays */}
    <rect x="7" y="1" width="2" height="2" fill="#f59e0b" />
    <rect x="7" y="13" width="2" height="2" fill="#f59e0b" />
    <rect x="1" y="7" width="2" height="2" fill="#f59e0b" />
    <rect x="13" y="7" width="2" height="2" fill="#f59e0b" />
    <rect x="3" y="3" width="2" height="2" fill="#f59e0b" />
    <rect x="11" y="3" width="2" height="2" fill="#f59e0b" />
    <rect x="3" y="11" width="2" height="2" fill="#f59e0b" />
    <rect x="11" y="11" width="2" height="2" fill="#f59e0b" />
  </svg>
);

export const PixelMoon: React.FC<{ size?: number; className?: string }> = ({
  size = 18,
  className = '',
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    shapeRendering="crispEdges"
    className={`inline-block select-none ${className}`}
  >
    {/* Crescent moon */}
    <rect x="6" y="2" width="4" height="2" fill="#c084fc" />
    <rect x="4" y="4" width="4" height="2" fill="#e9d5ff" />
    <rect x="3" y="6" width="4" height="4" fill="#fae8ff" />
    <rect x="4" y="10" width="4" height="2" fill="#e9d5ff" />
    <rect x="6" y="12" width="4" height="2" fill="#c084fc" />
    {/* Shading */}
    <rect x="8" y="4" width="3" height="8" fill="#a855f7" opacity="0.4" />
    {/* Twinkle Star */}
    <rect x="12" y="4" width="2" height="2" fill="#fde047" />
    <rect x="13" y="3" width="1" height="4" fill="#fde047" />
  </svg>
);

export const PixelUserIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 18,
  className = '',
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    shapeRendering="crispEdges"
    className={`inline-block select-none ${className}`}
  >
    {/* Head */}
    <rect x="5" y="2" width="6" height="5" fill="#fbcfe8" />
    <rect x="6" y="1" width="4" height="1" fill="#f472b6" />
    <rect x="4" y="3" width="1" height="4" fill="#f472b6" />
    <rect x="11" y="3" width="1" height="4" fill="#f472b6" />
    <rect x="6" y="3" width="1" height="1" fill="#831843" />
    <rect x="9" y="3" width="1" height="1" fill="#831843" />
    {/* Body */}
    <rect x="3" y="8" width="10" height="6" fill="#7dd3fc" />
    <rect x="2" y="9" width="12" height="5" fill="#38bdf8" />
    <rect x="4" y="8" width="8" height="2" fill="#bae6fd" />
    <rect x="2" y="14" width="12" height="1" fill="#0284c7" />
  </svg>
);

export const PixelQuestIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 18,
  className = '',
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    shapeRendering="crispEdges"
    className={`inline-block select-none ${className}`}
  >
    {/* Scroll paper */}
    <rect x="3" y="2" width="10" height="12" fill="#fef3c7" />
    <rect x="2" y="3" width="12" height="10" fill="#fde68a" />
    <rect x="3" y="1" width="10" height="1" fill="#d97706" />
    <rect x="3" y="14" width="10" height="1" fill="#d97706" />
    <rect x="1" y="3" width="1" height="10" fill="#b45309" />
    <rect x="14" y="3" width="1" height="10" fill="#b45309" />
    {/* Text lines */}
    <rect x="5" y="5" width="6" height="1" fill="#92400e" />
    <rect x="5" y="7" width="6" height="1" fill="#92400e" />
    <rect x="5" y="9" width="4" height="1" fill="#92400e" />
    {/* Stamp */}
    <rect x="9" y="10" width="3" height="3" fill="#f43f5e" />
    <rect x="10" y="11" width="1" height="1" fill="#ffffff" />
  </svg>
);

export const PixelPencil: React.FC<{ size?: number; className?: string }> = ({
  size = 16,
  className = '',
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    shapeRendering="crispEdges"
    className={`inline-block select-none ${className}`}
  >
    <rect x="12" y="1" width="3" height="3" fill="#f43f5e" />
    <rect x="9" y="4" width="4" height="4" fill="#fbbf24" />
    <rect x="6" y="7" width="4" height="4" fill="#f59e0b" />
    <rect x="3" y="10" width="4" height="4" fill="#d97706" />
    <rect x="1" y="13" width="3" height="3" fill="#fde68a" />
    <rect x="0" y="15" width="1" height="1" fill="#1e293b" />
  </svg>
);

export const PixelPalette: React.FC<{ size?: number; className?: string }> = ({
  size = 18,
  className = '',
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    shapeRendering="crispEdges"
    className={`inline-block select-none ${className}`}
  >
    {/* Palette base */}
    <rect x="3" y="2" width="10" height="12" fill="#fed7aa" />
    <rect x="2" y="3" width="12" height="10" fill="#fde68a" />
    <rect x="3" y="1" width="9" height="1" fill="#b45309" />
    <rect x="1" y="3" width="1" height="10" fill="#b45309" />
    <rect x="14" y="3" width="1" height="9" fill="#b45309" />
    <rect x="3" y="14" width="9" height="1" fill="#b45309" />
    {/* Thumb hole */}
    <rect x="10" y="10" width="2" height="2" fill="#ffffff" />
    {/* Color blobs */}
    <rect x="4" y="3" width="2" height="2" fill="#f43f5e" />
    <rect x="8" y="3" width="2" height="2" fill="#38bdf8" />
    <rect x="11" y="5" width="2" height="2" fill="#4ade80" />
    <rect x="4" y="7" width="2" height="2" fill="#a855f7" />
    <rect x="4" y="11" width="2" height="2" fill="#f97316" />
  </svg>
);

// Hutch Decor Pixel Assets
export const PixelDecorFlower: React.FC<{ size?: number; className?: string }> = ({
  size = 32,
  className = '',
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    shapeRendering="crispEdges"
    className={`inline-block select-none drop-shadow-sm ${className}`}
  >
    {/* Flowers */}
    <rect x="6" y="1" width="4" height="4" fill="#f472b6" />
    <rect x="7" y="2" width="2" height="2" fill="#fde047" />
    <rect x="3" y="3" width="3" height="3" fill="#ec4899" />
    <rect x="4" y="4" width="1" height="1" fill="#ffffff" />
    <rect x="10" y="3" width="3" height="3" fill="#fbcfe8" />
    <rect x="11" y="4" width="1" height="1" fill="#f43f5e" />
    {/* Stems & Leaves */}
    <rect x="7" y="5" width="2" height="4" fill="#22c55e" />
    <rect x="5" y="6" width="2" height="2" fill="#16a34a" />
    <rect x="9" y="7" width="2" height="2" fill="#4ade80" />
    {/* Pot */}
    <rect x="4" y="9" width="8" height="2" fill="#c2410c" />
    <rect x="5" y="11" width="6" height="4" fill="#ea580c" />
    <rect x="6" y="12" width="4" height="2" fill="#fb923c" />
    <rect x="5" y="15" width="6" height="1" fill="#9a3412" />
  </svg>
);

export const PixelDecorRug: React.FC<{ size?: number; className?: string }> = ({
  size = 48,
  className = '',
}) => (
  <svg
    viewBox="0 0 24 12"
    width={size}
    height={size / 2}
    shapeRendering="crispEdges"
    className={`inline-block select-none ${className}`}
  >
    {/* Elliptical cute rug */}
    <rect x="4" y="1" width="16" height="10" fill="#fbcfe8" />
    <rect x="2" y="2" width="20" height="8" fill="#fce7f3" />
    <rect x="1" y="3" width="22" height="6" fill="#fdf2f8" />
    {/* Fringe border */}
    <rect x="3" y="1" width="18" height="1" fill="#f472b6" />
    <rect x="3" y="10" width="18" height="1" fill="#f472b6" />
    <rect x="1" y="4" width="1" height="4" fill="#f472b6" />
    <rect x="22" y="4" width="1" height="4" fill="#f472b6" />
    {/* Inner heart or star pattern */}
    <rect x="9" y="4" width="6" height="4" fill="#bae6fd" />
    <rect x="11" y="5" width="2" height="2" fill="#38bdf8" />
  </svg>
);

export const PixelDecorCloudLamp: React.FC<{ size?: number; className?: string }> = ({
  size = 32,
  className = '',
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    shapeRendering="crispEdges"
    className={`inline-block select-none drop-shadow-md ${className}`}
  >
    {/* Cord */}
    <rect x="7" y="0" width="2" height="4" fill="#94a3b8" />
    {/* Glowing Cloud */}
    <rect x="4" y="4" width="8" height="6" fill="#fef9c3" />
    <rect x="2" y="5" width="12" height="4" fill="#ffffff" />
    <rect x="1" y="6" width="14" height="2" fill="#ffffff" />
    <rect x="3" y="4" width="10" height="6" fill="#fef08a" opacity="0.6" />
    {/* Soft glowing stars dripping */}
    <rect x="4" y="11" width="1" height="2" fill="#facc15" />
    <rect x="8" y="12" width="2" height="2" fill="#fde047" />
    <rect x="12" y="11" width="1" height="3" fill="#facc15" />
  </svg>
);

export const PixelDecorMushroom: React.FC<{ size?: number; className?: string }> = ({
  size = 32,
  className = '',
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    shapeRendering="crispEdges"
    className={`inline-block select-none drop-shadow-sm ${className}`}
  >
    {/* Mushroom cap */}
    <rect x="4" y="2" width="8" height="2" fill="#e11d48" />
    <rect x="2" y="4" width="12" height="4" fill="#f43f5e" />
    <rect x="1" y="7" width="14" height="2" fill="#fb7185" />
    {/* White dots */}
    <rect x="4" y="4" width="2" height="2" fill="#ffffff" />
    <rect x="10" y="4" width="2" height="2" fill="#ffffff" />
    <rect x="7" y="6" width="2" height="2" fill="#ffffff" />
    {/* Stem */}
    <rect x="6" y="9" width="4" height="5" fill="#fef3c7" />
    <rect x="5" y="10" width="6" height="4" fill="#ffedd5" />
    <rect x="5" y="14" width="6" height="1" fill="#fed7aa" />
  </svg>
);

export const PixelDecorFairyLights: React.FC<{ size?: number; className?: string }> = ({
  size = 48,
  className = '',
}) => (
  <svg
    viewBox="0 0 32 8"
    width={size}
    height={size / 4}
    shapeRendering="crispEdges"
    className={`inline-block select-none drop-shadow ${className}`}
  >
    {/* Garland Wire */}
    <rect x="0" y="1" width="6" height="1" fill="#475569" />
    <rect x="6" y="2" width="6" height="1" fill="#475569" />
    <rect x="12" y="3" width="8" height="1" fill="#475569" />
    <rect x="20" y="2" width="6" height="1" fill="#475569" />
    <rect x="26" y="1" width="6" height="1" fill="#475569" />
    {/* Bulbs glowing */}
    <rect x="4" y="2" width="2" height="3" fill="#f43f5e" />
    <rect x="10" y="3" width="2" height="3" fill="#fde047" />
    <rect x="16" y="4" width="2" height="3" fill="#38bdf8" />
    <rect x="22" y="3" width="2" height="3" fill="#4ade80" />
    <rect x="28" y="2" width="2" height="3" fill="#ec4899" />
  </svg>
);

export const PixelDecorBookshelf: React.FC<{ size?: number; className?: string }> = ({
  size = 32,
  className = '',
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    shapeRendering="crispEdges"
    className={`inline-block select-none drop-shadow-sm ${className}`}
  >
    {/* Shelf frame */}
    <rect x="2" y="1" width="12" height="14" fill="#92400e" />
    <rect x="3" y="2" width="10" height="5" fill="#fde68a" />
    <rect x="3" y="8" width="10" height="6" fill="#fde68a" />
    <rect x="2" y="7" width="12" height="1" fill="#78350f" />
    {/* Top shelf books */}
    <rect x="4" y="3" width="2" height="4" fill="#f43f5e" />
    <rect x="6" y="2" width="2" height="5" fill="#38bdf8" />
    <rect x="8" y="4" width="2" height="3" fill="#4ade80" />
    <rect x="10" y="3" width="2" height="4" fill="#c084fc" />
    {/* Bottom shelf books & crystal */}
    <rect x="4" y="9" width="3" height="5" fill="#fb923c" />
    <rect x="7" y="10" width="2" height="4" fill="#e11d48" />
    <rect x="10" y="11" width="2" height="3" fill="#67e8f9" />
  </svg>
);

export const PixelDecorCarrotBed: React.FC<{ size?: number; className?: string }> = ({
  size = 48,
  className = '',
}) => (
  <svg
    viewBox="0 0 24 16"
    width={size}
    height={(size * 2) / 3}
    shapeRendering="crispEdges"
    className={`inline-block select-none drop-shadow-md ${className}`}
  >
    {/* Carrot Cushion Bed */}
    <rect x="2" y="6" width="20" height="8" fill="#f97316" />
    <rect x="4" y="4" width="16" height="3" fill="#ea580c" />
    <rect x="4" y="7" width="16" height="5" fill="#fed7aa" />
    {/* Carrot green leaves pillow */}
    <rect x="1" y="4" width="3" height="2" fill="#22c55e" />
    <rect x="0" y="2" width="3" height="3" fill="#16a34a" />
    <rect x="2" y="1" width="2" height="2" fill="#4ade80" />
    {/* Fluffy quilt fringe */}
    <rect x="3" y="13" width="18" height="2" fill="#fdba74" />
    <rect x="6" y="8" width="4" height="3" fill="#ffffff" opacity="0.8" />
  </svg>
);

export const PixelDecorCatTree: React.FC<{ size?: number; className?: string }> = ({
  size = 48,
  className = '',
}) => (
  <svg
    viewBox="0 0 18 24"
    width={size}
    height={(size * 4) / 3}
    shapeRendering="crispEdges"
    className={`inline-block select-none drop-shadow-md ${className}`}
  >
    {/* Base plate */}
    <rect x="2" y="21" width="14" height="3" fill="#78350f" />
    {/* Main pillar */}
    <rect x="8" y="4" width="3" height="17" fill="#d97706" />
    <rect x="8" y="7" width="3" height="2" fill="#fde68a" />
    <rect x="8" y="13" width="3" height="2" fill="#fde68a" />
    {/* Lower platform */}
    <rect x="2" y="12" width="8" height="2" fill="#fbbf24" />
    <rect x="3" y="11" width="6" height="1" fill="#fef3c7" />
    {/* Top basket perch */}
    <rect x="4" y="2" width="11" height="3" fill="#fbbf24" />
    <rect x="5" y="1" width="9" height="1" fill="#fef3c7" />
    {/* Hanging pompom */}
    <rect x="13" y="6" width="1" height="3" fill="#cbd5e1" />
    <rect x="12" y="9" width="3" height="3" fill="#ec4899" />
  </svg>
);

export const PixelDecorWaterBowl: React.FC<{ size?: number; className?: string }> = ({
  size = 32,
  className = '',
}) => (
  <svg
    viewBox="0 0 16 12"
    width={size}
    height={(size * 3) / 4}
    shapeRendering="crispEdges"
    className={`inline-block select-none drop-shadow-xs ${className}`}
  >
    {/* Ceramic Bowl */}
    <rect x="2" y="4" width="12" height="6" fill="#e0f2fe" />
    <rect x="1" y="3" width="14" height="2" fill="#bae6fd" />
    <rect x="3" y="9" width="10" height="2" fill="#7dd3fc" />
    {/* Water surface sparkling */}
    <rect x="3" y="5" width="10" height="3" fill="#0284c7" />
    <rect x="5" y="5" width="4" height="2" fill="#38bdf8" />
    <rect x="10" y="5" width="2" height="1" fill="#ffffff" />
  </svg>
);

export const PixelDecorMoonLantern: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className = '',
}) => (
  <svg
    viewBox="0 0 16 20"
    width={size}
    height={(size * 5) / 4}
    shapeRendering="crispEdges"
    className={`inline-block select-none drop-shadow-lg animate-pulse ${className}`}
  >
    {/* Cord */}
    <rect x="7" y="0" width="2" height="5" fill="#64748b" />
    {/* Lantern Frame */}
    <rect x="4" y="5" width="8" height="2" fill="#b45309" />
    <rect x="4" y="15" width="8" height="2" fill="#b45309" />
    {/* Crescent Moon inside glowing cage */}
    <rect x="5" y="7" width="6" height="8" fill="#fef08a" opacity="0.9" />
    <rect x="7" y="8" width="4" height="6" fill="#ffffff" />
    <rect x="7" y="9" width="2" height="4" fill="#fde047" />
    {/* Tassel */}
    <rect x="7" y="17" width="2" height="3" fill="#ef4444" />
  </svg>
);

export const PixelDecorWoodenCastle: React.FC<{ size?: number; className?: string }> = ({
  size = 48,
  className = '',
}) => (
  <svg
    viewBox="0 0 24 20"
    width={size}
    height={(size * 5) / 6}
    shapeRendering="crispEdges"
    className={`inline-block select-none drop-shadow-md ${className}`}
  >
    {/* Castle base */}
    <rect x="2" y="6" width="20" height="13" fill="#a16207" />
    <rect x="3" y="7" width="18" height="11" fill="#ca8a04" />
    {/* Left Tower */}
    <rect x="1" y="2" width="5" height="4" fill="#eab308" />
    <rect x="1" y="1" width="2" height="1" fill="#ca8a04" />
    <rect x="4" y="1" width="2" height="1" fill="#ca8a04" />
    {/* Right Tower */}
    <rect x="18" y="2" width="5" height="4" fill="#eab308" />
    <rect x="18" y="1" width="2" height="1" fill="#ca8a04" />
    <rect x="21" y="1" width="2" height="1" fill="#ca8a04" />
    {/* Center Castle Door for bunny */}
    <rect x="9" y="10" width="6" height="8" fill="#451a03" />
    <rect x="10" y="9" width="4" height="1" fill="#451a03" />
    {/* Flag */}
    <rect x="11" y="1" width="1" height="5" fill="#713f12" />
    <rect x="12" y="1" width="4" height="3" fill="#ec4899" />
  </svg>
);

export const PixelDecorTeaSet: React.FC<{ size?: number; className?: string }> = ({
  size = 36,
  className = '',
}) => (
  <svg
    viewBox="0 0 16 12"
    width={size}
    height={(size * 3) / 4}
    shapeRendering="crispEdges"
    className={`inline-block select-none drop-shadow-xs ${className}`}
  >
    {/* Bamboo Tray */}
    <rect x="1" y="9" width="14" height="2" fill="#78350f" />
    {/* Teapot */}
    <rect x="3" y="4" width="6" height="5" fill="#047857" />
    <rect x="4" y="3" width="4" height="1" fill="#059669" />
    <rect x="2" y="5" width="1" height="2" fill="#047857" />
    <rect x="9" y="4" width="2" height="2" fill="#047857" />
    {/* Cup */}
    <rect x="11" y="6" width="3" height="3" fill="#10b981" />
    {/* Steam */}
    <rect x="5" y="1" width="1" height="1" fill="#a7f3d0" />
    <rect x="6" y="0" width="1" height="1" fill="#a7f3d0" />
  </svg>
);

/* ================= STANDALONE PIXEL UI ICONS (Replacing generic icons) ================= */
export const PixelRabbitIcon: React.FC<{ size?: number; className?: string; color?: string }> = ({
  size = 20,
  className = '',
  color = '#38bdf8',
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    shapeRendering="crispEdges"
    className={`inline-block select-none ${className}`}
  >
    {/* Left Ear */}
    <rect x="3" y="1" width="2" height="5" fill="#ffffff" />
    <rect x="4" y="2" width="1" height="3" fill="#f472b6" />
    {/* Right Ear */}
    <rect x="11" y="1" width="2" height="5" fill="#ffffff" />
    <rect x="11" y="2" width="1" height="3" fill="#f472b6" />
    {/* Head Body */}
    <rect x="3" y="6" width="10" height="7" fill="#ffffff" />
    {/* Eyes */}
    <rect x="5" y="8" width="2" height="2" fill="#0f172a" />
    <rect x="5" y="8" width="1" height="1" fill="#ffffff" />
    <rect x="9" y="8" width="2" height="2" fill="#0f172a" />
    <rect x="9" y="8" width="1" height="1" fill="#ffffff" />
    {/* Blush Cheeks */}
    <rect x="3" y="10" width="2" height="1" fill="#f472b6" opacity="0.8" />
    <rect x="11" y="10" width="2" height="1" fill="#f472b6" opacity="0.8" />
    {/* Nose */}
    <rect x="7" y="10" width="2" height="1" fill="#f43f5e" />
    {/* Outline */}
    <rect x="2" y="6" width="1" height="7" fill={color} opacity="0.8" />
    <rect x="13" y="6" width="1" height="7" fill={color} opacity="0.8" />
  </svg>
);

export const PixelLockIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 18,
  className = '',
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    shapeRendering="crispEdges"
    className={`inline-block select-none ${className}`}
  >
    {/* Lock Shackle */}
    <rect x="5" y="2" width="6" height="5" fill="none" stroke="#eab308" strokeWidth="2" />
    {/* Lock Body */}
    <rect x="3" y="6" width="10" height="8" rx="1" fill="#ca8a04" />
    <rect x="4" y="7" width="8" height="6" fill="#facc15" />
    {/* Keyhole */}
    <circle cx="8" cy="9.5" r="1.5" fill="#0f172a" />
    <rect x="7.5" y="10" width="1" height="2" fill="#0f172a" />
  </svg>
);

export const PixelMilkIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 18,
  className = '',
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    shapeRendering="crispEdges"
    className={`inline-block select-none ${className}`}
  >
    {/* Bottle Top */}
    <rect x="6" y="1" width="4" height="2" fill="#38bdf8" />
    <rect x="5" y="3" width="6" height="1" fill="#ffffff" />
    {/* Bottle Body */}
    <rect x="4" y="4" width="8" height="11" fill="#bae6fd" />
    <rect x="5" y="5" width="6" height="9" fill="#ffffff" />
    {/* Strawberry emblem */}
    <rect x="7" y="8" width="2" height="2" fill="#f43f5e" />
  </svg>
);

export const PixelMoonIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 18,
  className = '',
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    shapeRendering="crispEdges"
    className={`inline-block select-none ${className}`}
  >
    <path d="M12,2 C7,2 3,6 3,11 C3,13 4,14.5 5,15 C4,13 4,10 5.5,8 C7,6 10,5 12,5.5 C13,4 12,2 12,2 Z" fill="#fef08a" />
    <circle cx="11" cy="4" r="1" fill="#ffffff" />
  </svg>
);



