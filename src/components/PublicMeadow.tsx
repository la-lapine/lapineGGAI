import React, { useState, useEffect, useRef } from 'react';
import { User, Bunny, EggDrop, RewardTier } from '../types';
import { BUNNY_BREED_PRESETS, INITIAL_COMMUNITY_BUNNIES } from '../data/initialData';
import { audioEngine } from '../utils/audioEngine';
import { dailyQuestManager } from '../utils/dailyQuestManager';
import { getCurrentTimeWeather, WeatherType, WEATHER_CONFIGS } from '../utils/weatherEngine';
import { WeatherOverlay } from './WeatherOverlay';
import { PixelBunny, PixelEgg, PixelCarrot, PixelFoodBag, PixelToy, PixelHeart, PixelSparkle } from './PixelSprites';
import {
  Sparkles,
  Heart,
  Utensils,
  Smile,
  Gamepad2,
  X,
  Gift,
  AlertCircle,
  Compass,
  Navigation,
  CloudSun,
} from 'lucide-react';

interface PublicMeadowProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

export const PublicMeadow: React.FC<PublicMeadowProps> = ({
  user,
  onUpdateUser,
}) => {
  // Weather state (starts with current real-world time weather)
  const [currentWeather, setCurrentWeather] = useState<WeatherType>(() => getCurrentTimeWeather());
  const [isAutoWeather, setIsAutoWeather] = useState(true);

  // Combine user bunnies + community bunnies
  const [bunnies, setBunnies] = useState<Bunny[]>(() => {
    const userBunniesWithOwner = user.rabbits.map((b) => ({
      ...b,
      isOwner: true,
      ownerName: user.name,
      x: b.x || 30 + Math.random() * 40,
      y: b.y || 30 + Math.random() * 40,
      dx: (Math.random() - 0.5) * 0.25,
      dy: (Math.random() - 0.5) * 0.25,
    }));
    return [...userBunniesWithOwner, ...INITIAL_COMMUNITY_BUNNIES];
  });

  const [eggs, setEggs] = useState<EggDrop[]>([]);
  const [selectedBunny, setSelectedBunny] = useState<Bunny | null>(null);
  const [eggHatchReward, setEggHatchReward] = useState<RewardTier | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [clickEffects, setClickEffects] = useState<{ id: number; x: number; y: number; type: 'heart' | 'sparkle' }[]>([]);

  const lastContactTimeRef = useRef<number>(Date.now());
  const meadowScrollRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Weather real-time hourly check if auto-weather is on
  useEffect(() => {
    if (!isAutoWeather) return;
    const interval = setInterval(() => {
      setCurrentWeather(getCurrentTimeWeather());
    }, 60000);
    return () => clearInterval(interval);
  }, [isAutoWeather]);

  const cycleWeather = () => {
    const types: WeatherType[] = ['morning_mist', 'sunny_day', 'sunset_glow', 'evening_fireflies', 'spring_rain'];
    const nextIdx = (types.indexOf(currentWeather) + 1) % types.length;
    setIsAutoWeather(false);
    setCurrentWeather(types[nextIdx]);
    audioEngine.playChimeSound();
    showToast(`Đã chuyển thời tiết sang: ${WEATHER_CONFIGS[types[nextIdx]].name} ${WEATHER_CONFIGS[types[nextIdx]].icon}`);
  };

  // On mount: trigger daily quest for meadow visit and auto-center viewport
  useEffect(() => {
    dailyQuestManager.progress('meadow_visit', 1);

    const timer = setTimeout(() => {
      if (meadowScrollRef.current) {
        const el = meadowScrollRef.current;
        el.scrollLeft = (1800 - el.clientWidth) / 2;
        el.scrollTop = (1500 - el.clientHeight) / 2;
      }
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  const scrollToLandmark = (x: number, y: number) => {
    if (meadowScrollRef.current) {
      const el = meadowScrollRef.current;
      const targetLeft = x - el.clientWidth / 2;
      const targetTop = y - el.clientHeight / 2;
      el.scrollTo({
        left: Math.max(0, targetLeft),
        top: Math.max(0, targetTop),
        behavior: 'smooth',
      });
    }
  };

  // Movement & Collision detection loop
  useEffect(() => {
    const interval = window.setInterval(() => {
      setBunnies((prevBunnies) => {
        const nextBunnies = prevBunnies.map((b) => {
          let nx = b.x + b.dx;
          let ny = b.y + b.dy;
          let ndx = b.dx;
          let ndy = b.dy;

          // Bounce off meadow edges
          if (nx < 5) {
            nx = 5;
            ndx = Math.abs(ndx);
          } else if (nx > 95) {
            nx = 95;
            ndx = -Math.abs(ndx);
          }

          if (ny < 8) {
            ny = 8;
            ndy = Math.abs(ndy);
          } else if (ny > 92) {
            ny = 92;
            ndy = -Math.abs(ndy);
          }

          // Random slight redirection or idle transition
          if (Math.random() < 0.05) {
            ndx += (Math.random() - 0.5) * 0.1;
            ndy += (Math.random() - 0.5) * 0.1;
          }

          let nstate = b.state;
          if (Math.random() < 0.01 && (b.state === 'hopping' || b.state === 'idle')) {
            const idles: any[] = ['sniffing', 'grooming', 'idle'];
            nstate = idles[Math.floor(Math.random() * idles.length)];
          } else if (Math.random() < 0.05 && (b.state === 'sniffing' || b.state === 'grooming')) {
            nstate = 'hopping';
          }

          return {
            ...b,
            x: nx,
            y: ny,
            dx: ndx,
            dy: ndy,
            state: nstate as any,
          };
        });

        // Check for contacts between any two bunnies
        const now = Date.now();
        if (now - lastContactTimeRef.current > 4000) {
          for (let i = 0; i < nextBunnies.length; i++) {
            for (let j = i + 1; j < nextBunnies.length; j++) {
              const b1 = nextBunnies[i];
              const b2 = nextBunnies[j];
              const dist = Math.hypot(b1.x - b2.x, b1.y - b2.y);

              // If within 7% distance, they encounter and interact with each other!
              if (dist < 7) {
                lastContactTimeRef.current = now;

                const interactionEmotes = ['Bffs! 💕', 'Binky! 🐇', 'Hello friend! 🌸', 'Head bump! ✨', 'Hug! ❤️'];
                const emoteText = interactionEmotes[Math.floor(Math.random() * interactionEmotes.length)];

                nextBunnies[i] = {
                  ...b1,
                  state: 'interacting',
                  currentEmote: { id: 'int-1-' + now, text: emoteText, icon: '✨', timestamp: now },
                };
                nextBunnies[j] = {
                  ...b2,
                  state: 'interacting',
                  currentEmote: { id: 'int-2-' + now, text: emoteText, icon: '🌸', timestamp: now },
                };

                // Chance to drop an egg: 15% per encounter
                if (Math.random() < 0.15) {
                  const newEgg: EggDrop = {
                    id: 'egg-' + now,
                    x: (b1.x + b2.x) / 2,
                    y: (b1.y + b2.y) / 2,
                    parentNames: [b1.name, b2.name],
                    createdAt: now,
                    variant: Math.floor(Math.random() * 10),
                  };
                  setEggs((prev) => [...prev.slice(-4), newEgg]); // Keep max 5 eggs on meadow
                  audioEngine.playSlotWinSound();
                  showToast(
                    `✨ ${b1.name} và ${b2.name} vừa nhảy múa giao lưu và làm rơi 1 quả Trứng Pixel Độc Bản (15%)!`
                  );
                }
                break;
              }
            }
          }
        }

        return nextBunnies;
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  // Helper: 15% chance to drop egg on interaction
  const tryInteractionEggDrop = (bunny: Bunny) => {
    if (Math.random() < 0.15) {
      const now = Date.now();
      const newEgg: EggDrop = {
        id: 'egg-' + now,
        x: Math.max(8, Math.min(92, bunny.x + (Math.random() - 0.5) * 8)),
        y: Math.max(10, Math.min(90, bunny.y + (Math.random() - 0.5) * 8)),
        parentNames: [bunny.name, user.name],
        createdAt: now,
        variant: Math.floor(Math.random() * 10),
      };
      setEggs((prev) => [...prev.slice(-4), newEgg]);
      audioEngine.playSlotWinSound();
      setTimeout(() => {
        showToast(`🥚 May mắn tuyệt vời! Tương tác làm rơi ra 1 quả Trứng Pixel đa sắc độc bản (15%)! Hãy bấm để đập trứng!`);
      }, 500);
    }
  };

  // Helper to trigger pet animation and emote on meadow
  const triggerMeadowBunnyAnimation = (bunnyId: string, state: any, emoteText: string, icon: string) => {
    const now = Date.now();
    setBunnies((prev) =>
      prev.map((b) =>
        b.id === bunnyId
          ? {
              ...b,
              state,
              currentEmote: { id: 'act-' + now, text: emoteText, icon, timestamp: now },
            }
          : b
      )
    );

    // Reset state after animation duration
    setTimeout(() => {
      setBunnies((prev) =>
        prev.map((b) => (b.id === bunnyId ? { ...b, state: 'hopping' } : b))
      );
    }, 2500);
  };

  // Interact with bunny on meadow
  const handleInteractionLimit = () => {
    const today = new Date().toLocaleDateString('vi-VN');
    let interactionsToday = user.interactionsToday || 0;
    if (user.lastInteractionDate !== today) {
      interactionsToday = 0;
    }

    if (interactionsToday >= 15) {
      showToast('Hôm nay bạn đã đạt giới hạn 15 lượt tương tác!');
      return null;
    }
    return interactionsToday + 1;
  };

  const handleFeedMeadowBunny = (bunny: Bunny) => {
    const nextInteractions = handleInteractionLimit();
    if (nextInteractions === null) return;

    if (user.carrots <= 0 && user.foodBags <= 0) {
      showToast('Bạn đã hết củ cà rốt và túi thức ăn rồi!');
      return;
    }
    const newCarrots = user.carrots > 0 ? user.carrots - 1 : user.carrots;
    const newFoodBags = user.carrots <= 0 ? user.foodBags - 1 : user.foodBags;

    onUpdateUser({
      ...user,
      carrots: newCarrots,
      foodBags: newFoodBags,
      interactionsToday: nextInteractions,
      lastInteractionDate: new Date().toLocaleDateString('vi-VN'),
    });

    audioEngine.playCrunchSound();
    triggerMeadowBunnyAnimation(bunny.id, 'eating', 'Yummy! 🥕', '😋');
    showToast(`Bạn đã tặng thức ăn thơm ngon cho ${bunny.name} của ${bunny.ownerName}! 🥕💕`);
    tryInteractionEggDrop(bunny);
  };

  const handlePetMeadowBunny = (bunny: Bunny) => {
    const nextInteractions = handleInteractionLimit();
    if (nextInteractions === null) return;

    onUpdateUser({
      ...user,
      interactionsToday: nextInteractions,
      lastInteractionDate: new Date().toLocaleDateString('vi-VN'),
    });

    audioEngine.playPurrSound();
    triggerMeadowBunnyAnimation(bunny.id, 'petted', 'Purr~ ❤️', '🥰');
    showToast(`Bạn vừa vuốt ve và xoa đầu ${bunny.name}. Bé lim dim mắt cực kỳ thích thú! ✨`);
    tryInteractionEggDrop(bunny);
  };

  const handlePlayMeadowBunny = (bunny: Bunny) => {
    const nextInteractions = handleInteractionLimit();
    if (nextInteractions === null) return;

    if (user.toys <= 0) {
      showToast('Bạn đã hết đồ chơi rồi!');
      return;
    }
    onUpdateUser({
      ...user,
      toys: user.toys - 1,
      interactionsToday: nextInteractions,
      lastInteractionDate: new Date().toLocaleDateString('vi-VN'),
    });
    audioEngine.playSlotTickSound();
    triggerMeadowBunnyAnimation(bunny.id, 'jumping', 'High Hop! 🐰', '🌟');
    showToast(`Bạn dùng quả bóng len chơi đùa cùng ${bunny.name}! Bé nhảy cẫng lên mừng rỡ! 🧸`);
    tryInteractionEggDrop(bunny);
  };

  // Hatch Egg Mechanism with exact requested probabilities:
  // - 1%: Thỏ lai (hybrid)
  // - 5%: Thỏ thường (standard)
  // - 10%: 100 túi thức ăn + 100 cà rốt + 100 đồ chơi
  // - 20%: 50 túi thức ăn + 50 cà rốt + 50 đồ chơi
  // - 50%: 25 túi thức ăn + 25 cà rốt + 25 đồ chơi
  // - 100%: 15 túi thức ăn + 15 cà rốt + 15 đồ chơi (floor)
  const handleCrackEgg = (egg: EggDrop) => {
    audioEngine.playEggCrackSound();
    setEggs((prev) => prev.filter((e) => e.id !== egg.id));

    const roll = Math.random() * 100; // 0 to 100
    let reward: RewardTier;

    if (roll < 1.0) {
      // 1% Hybrid Bunny
      const hybridPreset = BUNNY_BREED_PRESETS.find((p) => p.rarity === 'hybrid') || BUNNY_BREED_PRESETS[5];
      const newBunny: Bunny = {
        id: 'bunny-hybrid-' + Date.now(),
        name: 'Thỏ Lai ' + ['Tinh Tú', 'Ánh Bạc', 'Dạ Quang', 'Huyền Vân'][Math.floor(Math.random() * 4)],
        colorName: hybridPreset.colorName,
        furColor: hybridPreset.furColor,
        accentColor: hybridPreset.accentColor,
        rarity: 'hybrid',
        hunger: 100,
        happiness: 100,
        hygiene: 100,
        level: 1,
        exp: 0,
        maxExp: 100,
        x: 50,
        y: 50,
        dx: 0.1,
        dy: 0.1,
        isOwner: true,
        ownerName: user.name,
        state: 'idle',
        personality: hybridPreset.personality,
      };
      reward = { type: 'hybrid_bunny', name: 'Thỏ Lai Quý Hiếm (Tỉ lệ 1%)', bunny: newBunny };
      onUpdateUser({
        ...user,
        rabbits: [...user.rabbits, newBunny],
      });
    } else if (roll < 6.0) {
      // 5% Standard Bunny (1% to 6%)
      const standardPresets = BUNNY_BREED_PRESETS.filter((p) => p.rarity === 'standard');
      const randomPreset = standardPresets[Math.floor(Math.random() * standardPresets.length)];
      const newBunny: Bunny = {
        id: 'bunny-std-' + Date.now(),
        name: 'Bé ' + ['Bông', 'Mây', 'Bơ', 'Trà', 'Sữa'][Math.floor(Math.random() * 5)],
        colorName: randomPreset.colorName,
        furColor: randomPreset.furColor,
        accentColor: randomPreset.accentColor,
        rarity: 'standard',
        hunger: 90,
        happiness: 95,
        hygiene: 90,
        level: 1,
        exp: 0,
        maxExp: 100,
        x: 45,
        y: 45,
        dx: -0.1,
        dy: 0.1,
        isOwner: true,
        ownerName: user.name,
        state: 'idle',
        personality: randomPreset.personality,
      };
      reward = { type: 'standard_bunny', name: 'Thỏ Thường Mới (Tỉ lệ 5%)', bunny: newBunny };
      onUpdateUser({
        ...user,
        rabbits: [...user.rabbits, newBunny],
      });
    } else if (roll < 16.0) {
      // 10% (6% to 16%) 100 items
      reward = {
        type: 'items_100',
        name: 'Gói Đại Phú Hào: 100 Thức Ăn + 100 Cà Rốt + 100 Đồ Chơi (Tỉ lệ 10%)',
        food: 100,
        carrots: 100,
        toys: 100,
      };
      onUpdateUser({
        ...user,
        foodBags: user.foodBags + 100,
        carrots: user.carrots + 100,
        toys: user.toys + 100,
      });
    } else if (roll < 36.0) {
      // 20% (16% to 36%) 50 items
      reward = {
        type: 'items_50',
        name: 'Gói Thịnh Vượng: 50 Thức Ăn + 50 Cà Rốt + 50 Đồ Chơi (Tỉ lệ 20%)',
        food: 50,
        carrots: 50,
        toys: 50,
      };
      onUpdateUser({
        ...user,
        foodBags: user.foodBags + 50,
        carrots: user.carrots + 50,
        toys: user.toys + 50,
      });
    } else if (roll < 86.0) {
      // 50% (36% to 86%) 25 items
      reward = {
        type: 'items_25',
        name: 'Gói May Mắn: 25 Thức Ăn + 25 Cà Rốt + 25 Đồ Chơi (Tỉ lệ 50%)',
        food: 25,
        carrots: 25,
        toys: 25,
      };
      onUpdateUser({
        ...user,
        foodBags: user.foodBags + 25,
        carrots: user.carrots + 25,
        toys: user.toys + 25,
      });
    } else {
      // 100% floor guaranteed (86% to 100%)
      reward = {
        type: 'items_15',
        name: 'Gói Đồng Cỏ: 15 Thức Ăn + 15 Cà Rốt + 15 Đồ Chơi (Đảm bảo 100%)',
        food: 15,
        carrots: 15,
        toys: 15,
      };
      onUpdateUser({
        ...user,
        foodBags: user.foodBags + 15,
        carrots: user.carrots + 15,
        toys: user.toys + 15,
      });
    }

    setEggHatchReward(reward);
    dailyQuestManager.progress('crack_egg', 1);
  };

  return (
    <div className="space-y-4">
      {/* Meadow Header & Rules info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel pixel-box rounded-2xl p-5 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
            <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-sparkle" />
            Đồng Cỏ Thỏ Tự Do & Giao Lưu Cộng Đồng
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Cánh Đồng Thỏ Đa Sắc Màu (Bản Đồ Mở Rộng)
          </h2>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-1 max-w-xl">
            Cuộn chuột hoặc kéo rê để khám phá toàn cảnh cánh đồng rộng lớn 1800x1500px! Khi 2 bé thỏ chạm vào nhau sẽ có cơ hội rơi ra Trứng Thần Bí.
          </p>
        </div>

        {/* Right side: Weather Switcher & User Inventory Counter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 shrink-0">
          {/* Weather Widget Pill */}
          <button
            onClick={cycleWeather}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-100/90 dark:bg-sky-950/70 hover:bg-sky-200 dark:hover:bg-sky-900 text-sky-900 dark:text-sky-100 border-2 border-sky-300 dark:border-sky-700 text-xs font-bold transition-all hover:scale-105 shadow-2xs pixel-tag"
            title="Bấm để đổi hiệu ứng thời tiết (Sương mai, Nắng, Hoàng hôn, Đom đóm đêm, Mưa rào)"
          >
            <span className="text-base">{WEATHER_CONFIGS[currentWeather].icon}</span>
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-wider text-sky-700 dark:text-sky-300 font-extrabold">
                {isAutoWeather ? 'Thời Tiết Tự Động' : 'Thời Tiết'}
              </div>
              <div className="font-bold">{WEATHER_CONFIGS[currentWeather].name}</div>
            </div>
          </button>

          {/* User Inventory Counter */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 shrink-0">
            <span className="flex items-center gap-1 bg-amber-100/90 dark:bg-amber-950/60 px-2.5 py-1.5 rounded-xl border-2 border-amber-300 dark:border-amber-800 shadow-2xs">
              <PixelCarrot size={16} className="shrink-0" />
              <span>{user.carrots} Cà rốt</span>
            </span>
            <span className="flex items-center gap-1 bg-sky-100/90 dark:bg-sky-950/60 px-2.5 py-1.5 rounded-xl border-2 border-sky-300 dark:border-sky-800 shadow-2xs">
              <PixelFoodBag size={16} className="shrink-0" />
              <span>{user.foodBags} Thức ăn</span>
            </span>
            <span className="flex items-center gap-1 bg-pink-100/90 dark:bg-pink-950/60 px-2.5 py-1.5 rounded-xl border-2 border-pink-300 dark:border-pink-800 shadow-2xs">
              <PixelToy size={16} className="shrink-0" />
              <span>{user.toys} Đồ chơi</span>
            </span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Landmark Jump Bar */}
      <div className="glass-panel pixel-box p-2.5 rounded-2xl flex items-center justify-between gap-2 overflow-x-auto scrollbar-none text-xs">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-800 dark:text-sky-300 shrink-0 pl-1">
          <Compass className="w-4 h-4 text-sky-500 animate-spin-slow" />
          <span className="hidden sm:inline">Di chuyển nhanh:</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => scrollToLandmark(900, 750)}
            className="px-2.5 py-1 rounded-xl bg-indigo-100/90 dark:bg-indigo-950/70 hover:bg-indigo-200 dark:hover:bg-indigo-900 border-2 border-indigo-300 dark:border-indigo-700 text-indigo-950 dark:text-indigo-100 font-bold transition-all hover:scale-105 pixel-tag"
          >
            🌟 Cây Đại Thụ (Tâm)
          </button>
          <button
            onClick={() => scrollToLandmark(1450, 250)}
            className="px-2.5 py-1 rounded-xl bg-sky-100/90 dark:bg-sky-950/70 hover:bg-sky-200 dark:hover:bg-sky-900 border-2 border-sky-300 dark:border-sky-700 text-sky-950 dark:text-sky-100 font-bold transition-all hover:scale-105 pixel-tag"
          >
            🌊 Hồ Tinh Linh
          </button>
          <button
            onClick={() => scrollToLandmark(280, 1250)}
            className="px-2.5 py-1 rounded-xl bg-amber-100/90 dark:bg-amber-950/70 hover:bg-amber-200 dark:hover:bg-amber-900 border-2 border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-100 font-bold transition-all hover:scale-105 pixel-tag"
          >
            🥕 Vườn Cà Rốt
          </button>
          <button
            onClick={() => scrollToLandmark(1500, 1250)}
            className="px-2.5 py-1 rounded-xl bg-emerald-100/90 dark:bg-emerald-950/70 hover:bg-emerald-200 dark:hover:bg-emerald-900 border-2 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100 font-bold transition-all hover:scale-105 pixel-tag"
          >
            🍀 Thảm Cỏ May Mắn
          </button>
          <button
            onClick={() => scrollToLandmark(250, 250)}
            className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-2 border-slate-300 dark:border-slate-700 text-slate-950 dark:text-slate-100 font-bold transition-all hover:scale-105 pixel-tag"
          >
            🪧 Cổng Trại Thỏ
          </button>
        </div>
      </div>

      {/* Main Grassy Meadow Outer Viewport Container with Smooth Scrollbar */}
      <div
        ref={meadowScrollRef}
        className="relative w-full h-[640px] sm:h-[720px] lg:h-[780px] rounded-3xl overflow-auto scroll-smooth shadow-2xl border-2 border-sky-400/80 dark:border-sky-600 select-none bg-[#142616] cursor-grab active:cursor-grabbing pixel-box"
      >
        {/* Expanded Inner 1800x1500px World Map Canvas */}
        <div className="relative w-[1800px] h-[1500px] select-none shrink-0 overflow-hidden">
          {/* Dynamic Weather Overlay (Mist / Fireflies / Rain / Petals) */}
          <WeatherOverlay weather={currentWeather} className="z-20" />
          {/* Top-Down 2D Pixel RPG Meadow Background Pattern */}
          <div className="absolute inset-0 pointer-events-none">
            <img
              src="/src/assets/images/pixel_meadow_topdown_1790621988177.jpg"
              alt="Cánh đồng thỏ pixel art góc nhìn trên xuống"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-90 dark:opacity-85 filter contrast-105"
              style={{ imageRendering: 'pixelated' }}
            />
            {/* Soft vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-sky-950/30" />
          </div>

          {/* Top-Down Pixel RPG Landmarks on Expanded Meadow */}
          {/* Landmark 1: Top-Left Signpost */}
          <div className="absolute top-16 left-20 pointer-events-none px-4 py-2 rounded-2xl bg-slate-900/90 text-xs font-bold text-amber-300 border border-amber-400/50 shadow-xl flex items-center gap-2 z-10 backdrop-blur-xs">
            <span className="text-base">🪧</span>
            <span>Cổng Vào Trại Thỏ la Lapine</span>
          </div>

          {/* Landmark 2: Top-Right Pixel Pond */}
          <div className="absolute top-16 right-24 pointer-events-none px-4 py-2 rounded-2xl bg-sky-950/90 text-xs font-bold text-sky-300 border border-sky-400/50 shadow-xl flex items-center gap-2 z-10 backdrop-blur-xs">
            <span className="text-base animate-pulse">🌊</span>
            <span>Hồ Nước Tinh Linh Xanh Biếc</span>
          </div>

          {/* Landmark 3: Center Ancient Sanctuary Shrine */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none px-5 py-2.5 rounded-3xl bg-indigo-950/90 text-xs font-bold text-indigo-200 border-2 border-indigo-400/60 shadow-2xl flex items-center gap-2 z-10 backdrop-blur-xs">
            <span className="text-lg animate-spin-slow">🌟</span>
            <span>Cây Đại Thụ Nguyện Ước Cổ Đại</span>
          </div>

          {/* Landmark 4: Bottom-Left Carrot Patch */}
          <div className="absolute bottom-16 left-20 pointer-events-none px-4 py-2 rounded-2xl bg-amber-950/90 text-xs font-bold text-amber-300 border border-amber-500/50 shadow-xl flex items-center gap-2 z-10 backdrop-blur-xs">
            <span className="text-base">🥕</span>
            <span>Vườn Cà Rốt Tươi Trĩu Củ</span>
          </div>

          {/* Landmark 5: Bottom-Right Clover Patch */}
          <div className="absolute bottom-16 right-24 pointer-events-none px-4 py-2 rounded-2xl bg-emerald-950/90 text-xs font-bold text-emerald-300 border border-emerald-400/50 shadow-xl flex items-center gap-2 z-10 backdrop-blur-xs">
            <span className="text-base">🍀</span>
            <span>Thảm Cỏ May Mắn 4 Lá</span>
          </div>

          {/* Gentle floating pixel sparkles around the expanded map */}
          <div className="absolute top-24 inset-x-24 flex justify-between pointer-events-none opacity-80">
            <span className="text-lg text-yellow-200 animate-sparkle">✨</span>
            <span className="text-base text-sky-200 animate-pulse">⭐</span>
            <span className="text-lg text-pink-200 animate-sparkle">✨</span>
            <span className="text-base text-amber-200 animate-pulse">⭐</span>
          </div>
          <div className="absolute bottom-32 inset-x-32 flex justify-between pointer-events-none opacity-80">
            <span className="text-base text-emerald-200 animate-pulse">⭐</span>
            <span className="text-lg text-yellow-200 animate-sparkle">✨</span>
            <span className="text-base text-cyan-200 animate-pulse">⭐</span>
            <span className="text-lg text-rose-200 animate-sparkle">✨</span>
          </div>

          {/* Toast alert on top of meadow */}
          {toastMessage && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-2xl glass-panel border-2 border-sky-400 text-xs font-bold text-slate-900 dark:text-white shadow-2xl z-40 max-w-md text-center animate-bounce">
              {toastMessage}
            </div>
          )}

          {/* Dropped Magical Pixel Eggs with Random Color Patterns */}
          {clickEffects.map((eff) => (
            <div
              key={eff.id}
              className="absolute z-50 pointer-events-none animate-out fade-out zoom-out duration-1000 fill-mode-forwards"
              style={{ left: `${eff.x}%`, top: `${eff.y}%` }}
            >
              {eff.type === 'heart' ? (
                <PixelHeart size={32} className="text-rose-500" />
              ) : (
                <PixelSparkle size={32} className="text-amber-400" />
              )}
            </div>
          ))}

          {eggs.map((egg) => (
            <div
              key={egg.id}
              onClick={() => handleCrackEgg(egg)}
              style={{ left: `${egg.x}%`, top: `${egg.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group hover:scale-125 transition-transform"
              title="Trứng Thỏ Kỳ Diệu Pixel! Bấm để đập trứng nhận thưởng!"
            >
              <div className="relative flex flex-col items-center">
                <PixelEgg size={52} variant={egg.variant ?? 0} />
                <div className="px-2.5 py-0.5 rounded-full bg-slate-900/90 text-[10px] text-amber-300 font-bold tracking-tight whitespace-nowrap shadow-xs mt-0.5 border border-amber-400/40">
                  Đập Trứng!
                </div>
              </div>
            </div>
          ))}

          {/* Roaming Pixel Bunnies across the expanded meadow */}
          {bunnies.map((bunny) => (
            <div
              key={bunny.id}
              onClick={(e) => {
                setSelectedBunny(bunny);
                audioEngine.playPurrSound();

                // Click Effect
                const id = Date.now();
                setClickEffects(prev => [...prev, { id, x: bunny.x, y: bunny.y, type: Math.random() > 0.5 ? 'heart' : 'sparkle' }]);
                setTimeout(() => setClickEffects(prev => prev.filter(eff => eff.id !== id)), 1000);

                // Trigger floating text emote above clicked bunny
                const emotes = ['Hop! Hop! ✨', 'Happy! ❤️', 'Hello~ 🌸', 'Binky! 🐇', 'Yummy! 🥕', 'Zzz... 💤', 'Sniff sniff... 👃', 'Wash wash~ 🧼'];
                const randomEmote = emotes[Math.floor(Math.random() * emotes.length)];
                setBunnies((prev) =>
                  prev.map((b) =>
                    b.id === bunny.id
                      ? {
                          ...b,
                          currentEmote: {
                            id: `m-emote-${Date.now()}`,
                            text: randomEmote,
                            icon: '✨',
                            timestamp: Date.now(),
                          },
                        }
                      : b
                  )
                );
              }}
              style={{
                left: `${bunny.x}%`,
                top: `${bunny.y}%`,
                transform: `translate(-50%, -50%) scaleX(${bunny.dx >= 0 ? 1 : -1})`,
              }}
              className="absolute cursor-pointer transition-all duration-300 z-10 hover:z-20 group"
            >
              <div className="relative flex flex-col items-center">
                {/* Owner & Name Label (Counter-flip to stay readable) */}
                <div
                  style={{ transform: `scaleX(${bunny.dx >= 0 ? 1 : -1})` }}
                  className="mb-1 px-2.5 py-0.5 rounded-full glass-panel border border-sky-300/50 text-[11px] font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1 shadow-xs whitespace-nowrap"
                >
                  {bunny.isOwner && (
                    <span className="text-amber-500 font-bold">★ Bạn:</span>
                  )}
                  <span>{bunny.name}</span>
                  {!bunny.isOwner && (
                    <span className="text-slate-400 font-normal">({bunny.ownerName})</span>
                  )}
                </div>

                {/* Retro Pixel Bunny Character Sprite with Floating Emote Bubble support */}
                <div className="group-hover:scale-115 transition-transform animate-bunny-hop">
                  <PixelBunny
                    size={56}
                    furColor={bunny.furColor}
                    accentColor={bunny.accentColor}
                    state={bunny.state as any}
                    stage={bunny.stage}
                    earType={bunny.earType}
                    pattern={bunny.pattern}
                    equippedWearables={bunny.equippedWearables}
                    currentEmote={bunny.currentEmote}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bunny Interaction Drawer / Modal when clicked */}
      {selectedBunny && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 border border-sky-300 dark:border-sky-700 shadow-2xl text-slate-800 dark:text-slate-100">
            <button
              onClick={() => setSelectedBunny(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div
                className="w-18 h-18 rounded-2xl flex items-center justify-center border-2 border-sky-300 shadow-sm p-1"
                style={{ backgroundColor: selectedBunny.furColor }}
              >
                <PixelBunny
                  size={60}
                  furColor={selectedBunny.furColor}
                  accentColor={selectedBunny.accentColor}
                  state={selectedBunny.state as any}
                  stage={selectedBunny.stage}
                  earType={selectedBunny.earType}
                  pattern={selectedBunny.pattern}
                  equippedWearables={selectedBunny.equippedWearables}
                />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  {selectedBunny.name}
                  {selectedBunny.isOwner && (
                    <span className="text-xs text-amber-500 font-sans font-semibold">
                      (Của bạn)
                    </span>
                  )}
                </h3>
                <p className="text-xs text-sky-600 dark:text-sky-300">
                  Chủ nhân: {selectedBunny.ownerName} · {selectedBunny.colorName}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic">
                  "{selectedBunny.personality}"
                </p>
              </div>
            </div>

            {/* Interaction Buttons */}
            <div className="mt-6 space-y-2">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Tương tác với {selectedBunny.name}:
              </div>
              <button
                onClick={() => handleFeedMeadowBunny(selectedBunny)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-medium text-xs shadow-sm flex items-center justify-center gap-2"
              >
                <Utensils className="w-4 h-4" />
                <span>Cho Ăn (Dùng 1 Cà rốt/Thức ăn)</span>
              </button>

              <button
                onClick={() => handlePetMeadowBunny(selectedBunny)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-medium text-xs shadow-sm flex items-center justify-center gap-2"
              >
                <Smile className="w-4 h-4" />
                <span>Xoa Đầu Nựng Yêu</span>
              </button>

              <button
                onClick={() => handlePlayMeadowBunny(selectedBunny)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white font-medium text-xs shadow-sm flex items-center justify-center gap-2"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Chơi Đồ Chơi (Dùng 1 Đồ chơi)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Egg Hatch Reward Modal */}
      {eggHatchReward && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in"
        >
          <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border-2 border-amber-300 dark:border-amber-500 shadow-2xl text-center text-slate-800 dark:text-slate-100">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-300 to-yellow-100 flex items-center justify-center text-4xl shadow-lg border-2 border-white mb-4 animate-bounce">
              🐣
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 text-xs font-bold uppercase tracking-wider mb-2">
              <Gift className="w-3.5 h-3.5" />
              Đập Trứng Thành Công!
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Phần Thưởng Nhận Được
            </h3>

            <div className="mt-3 p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-amber-200 dark:border-amber-800 text-sm font-semibold text-amber-700 dark:text-amber-300">
              {eggHatchReward.name}
            </div>

            {'bunny' in eggHatchReward && (
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                Bé thỏ mới <strong>{eggHatchReward.bunny.name}</strong> đã được thêm vào đàn thỏ của bạn tại Chuồng Thỏ!
              </p>
            )}

            <button
              onClick={() => setEggHatchReward(null)}
              className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02]"
            >
              Thu Nhận Phần Thưởng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
