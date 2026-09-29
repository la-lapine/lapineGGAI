import React, { useState, useRef, useEffect } from 'react';
import { User, Bunny, BunnyCareLog, ShopItem, FloatingEmote, BunnyStage, BunnyEarType, BunnyPattern } from '../types';
import { SHOP_ITEMS, HUTCH_THEMES } from '../data/initialData';
import { audioEngine } from '../utils/audioEngine';
import { LevelUpSparkleModal } from './LevelUpSparkleModal';
import { HutchDecorModal } from './HutchDecorModal';
import { WeatherOverlay } from './WeatherOverlay';
import { ThemePixelRoom } from './ThemePixelRoom';
import { getCurrentTimeWeather, WeatherType, WEATHER_CONFIGS } from '../utils/weatherEngine';
import { dailyQuestManager } from '../utils/dailyQuestManager';
import {
  PixelBunny,
  PixelHeart,
  PixelBubble,
  PixelSparkle,
  PixelCarrot,
  PixelFoodBag,
  PixelToy,
  PixelSoap,
  PixelEgg,
  PixelDecorFlower,
  PixelDecorRug,
  PixelDecorCloudLamp,
  PixelDecorMushroom,
  PixelDecorFairyLights,
  PixelDecorBookshelf,
  PixelDecorCarrotBed,
  PixelDecorCatTree,
  PixelDecorWaterBowl,
  PixelDecorMoonLantern,
  PixelDecorWoodenCastle,
  PixelDecorTeaSet,
} from './PixelSprites';
import {
  Sparkles,
  Heart,
  Utensils,
  Bath,
  Smile,
  History,
  Trash2,
  Clock,
  Award,
  Package,
  ShoppingBag,
  ArrowRight,
  Filter,
  Moon,
  Sun,
  Hand,
  Gift,
  Pencil,
  Check,
  X,
  Palette,
  CloudSun,
} from 'lucide-react';

interface RabbitHutchProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onGoToMeadow: () => void;
  onGoToShop?: () => void;
  onOpenAuth?: () => void;
}

interface BouncingItem {
  id: number;
  icon: string;
  name: string;
  spriteType?: 'carrot' | 'food' | 'toy' | 'soap' | 'egg' | 'shop';
}

const HUTCH_LOGS_KEY = 'lalapine_care_logs_v2';

export const RabbitHutch: React.FC<RabbitHutchProps> = ({
  user,
  onUpdateUser,
  onGoToMeadow,
  onGoToShop,
  onOpenAuth,
}) => {
  const [selectedBunnyIndex, setSelectedBunnyIndex] = useState(0);
  const [currentAction, setCurrentAction] = useState<'idle' | 'eating' | 'bathing' | 'happy'>('idle');
  const [isPetting, setIsPetting] = useState(false);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const [levelUpBunny, setLevelUpBunny] = useState<Bunny | null>(null);
  const [levelUpReward, setLevelUpReward] = useState<{
    name: string;
    icon: string;
    description: string;
  } | null>(null);
  const [isCelebratingLevelUp, setIsCelebratingLevelUp] = useState(false);
  const [isDecorModalOpen, setIsDecorModalOpen] = useState(false);
  const [currentEmote, setCurrentEmote] = useState<FloatingEmote | null>(null);

  const triggerFloatingEmote = (text: string, icon?: string) => {
    const emote: FloatingEmote = {
      id: `emote-${Date.now()}-${Math.random()}`,
      text,
      icon,
      timestamp: Date.now(),
    };
    setCurrentEmote(emote);
    setTimeout(() => {
      setCurrentEmote((prev) => (prev?.id === emote.id ? null : prev));
    }, 2400);
  };

  // Weather state (starts with current real-world time weather)
  const [currentWeather, setCurrentWeather] = useState<WeatherType>(() => getCurrentTimeWeather());
  const [isAutoWeather, setIsAutoWeather] = useState(true);

  // Status Filter State: 'all' | 'hungry' | 'dirty' | 'sleeping'
  const [statusFilter, setStatusFilter] = useState<'all' | 'hungry' | 'dirty' | 'sleeping'>('all');

  // Pet Renaming State
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameInput, setRenameInput] = useState('');

  // Physics bouncing item animation state
  const [bouncingItem, setBouncingItem] = useState<BouncingItem | null>(null);
  const [isDragOverHutch, setIsDragOverHutch] = useState(false);
  const hutchContainerRef = useRef<HTMLDivElement>(null);

  // Click effects state
  const [clickEffects, setClickEffects] = useState<{ id: number; x: number; y: number; type: 'heart' | 'sparkle' }[]>([]);

  // Random idle animation
  useEffect(() => {
    if (user.id === 'guest-rabbit-traveler') return;
    const interval = setInterval(() => {
      const rand = Math.random();
      if (rand < 0.3 && currentAction === 'idle') {
        const states: ('idle' | 'happy' | 'hopping' | 'loving')[] = ['happy', 'hopping', 'loving'];
        const newState = states[Math.floor(Math.random() * states.length)];
        setCurrentAction(newState as any);
        setTimeout(() => setCurrentAction('idle'), 2000);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [currentAction, user.id]);

  // Check hourly weather if auto mode is on
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
    setFeedbackText(`Thời tiết: ${WEATHER_CONFIGS[types[nextIdx]].name} ${WEATHER_CONFIGS[types[nextIdx]].icon}`);
    setTimeout(() => setFeedbackText(null), 2500);
  };

  // Care logs state
  const [careLogs, setCareLogs] = useState<BunnyCareLog[]>(() => {
    try {
      const saved = localStorage.getItem(HUTCH_LOGS_KEY);
      if (saved) {
        const parsed: BunnyCareLog[] = JSON.parse(saved);
        // Ensure every loaded log has a guaranteed unique ID
        return parsed.map((item, idx) => ({
          ...item,
          id: item.id ? `${item.id}-${idx}` : `log-${Date.now()}-${idx}`,
        }));
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'log-default-1',
        bunnyName: user.rabbits[0]?.name || 'Bé Thỏ',
        action: 'pet',
        message: `Bạn đã xoa đầu nựng yêu ${user.rabbits[0]?.name || 'bé thỏ'}`,
        timestamp: 'Hôm nay, 10:15',
      },
      {
        id: 'log-default-2',
        bunnyName: user.rabbits[0]?.name || 'Bé Thỏ',
        action: 'feed',
        message: `Bạn đã cho ${user.rabbits[0]?.name || 'bé thỏ'} ăn cà rốt tươi ngon (+25 no bụng)`,
        timestamp: 'Hôm nay, 09:30',
      },
    ];
  });

  const activeBunny: Bunny = user.rabbits[selectedBunnyIndex] || user.rabbits[0] || {
    id: 'default-bunny',
    name: 'Bé Thỏ',
    colorName: 'Bạch Tuyết',
    furColor: '#ffffff',
    accentColor: '#38bdf8',
    rarity: 'standard',
    hunger: 80,
    happiness: 80,
    hygiene: 80,
    level: 1,
    exp: 0,
    maxExp: 100,
    x: 50,
    y: 50,
    dx: 0,
    dy: 0,
    isOwner: true,
    ownerName: 'Bạn',
    state: 'idle',
    personality: 'Thích được chăm sóc',
  };

  // Filter rabbits according to status dropdown
  const filteredRabbits = user.rabbits.filter((b) => {
    if (statusFilter === 'hungry') return b.hunger < 50;
    if (statusFilter === 'dirty') return b.hygiene < 50;
    if (statusFilter === 'sleeping') return b.state === 'sleeping';
    return true;
  });

  // Status counts for badge indicators
  const hungryCount = user.rabbits.filter((b) => b.hunger < 50).length;
  const dirtyCount = user.rabbits.filter((b) => b.hygiene < 50).length;
  const sleepingCount = user.rabbits.filter((b) => b.state === 'sleeping').length;

  const addLog = (action: 'feed' | 'bathe' | 'pet', message: string, bunnyName: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const uniqueSuffix = Math.random().toString(36).substring(2, 9);
    const newLog: BunnyCareLog = {
      id: `log-${Date.now()}-${uniqueSuffix}`,
      bunnyName,
      action,
      message,
      timestamp: `Hôm nay, ${timeStr}`,
    };
    setCareLogs((prev) => {
      const updated = [newLog, ...prev.slice(0, 24)];
      try {
        localStorage.setItem(HUTCH_LOGS_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const clearLogs = () => {
    setCareLogs([]);
    try {
      localStorage.removeItem(HUTCH_LOGS_KEY);
    } catch {
      // ignore
    }
  };

  const showToast = (msg: string) => {
    setFeedbackText(msg);
    setTimeout(() => {
      setFeedbackText(null);
    }, 2800);
  };

  // Pet Renaming Handlers
  const handleStartRename = () => {
    setRenameInput(activeBunny.name);
    setIsRenaming(true);
  };

  const handleSaveRename = () => {
    const trimmed = renameInput.trim();
    if (!trimmed) {
      showToast('Tên của bé thỏ không được để trống!');
      return;
    }
    const oldName = activeBunny.name;
    const updatedBunny = { ...activeBunny, name: trimmed };
    const updatedRabbits = [...user.rabbits];
    updatedRabbits[selectedBunnyIndex] = updatedBunny;
    onUpdateUser({ ...user, rabbits: updatedRabbits });
    setIsRenaming(false);
    audioEngine.playChimeSound();
    showToast(`Đã đổi tên bé thỏ thành "${trimmed}"! ✨`);
    addLog('pet', `Bạn đã đổi tên bé thỏ từ "${oldName}" thành "${trimmed}"`, trimmed);
  };

  // Trigger bouncing physics animation when food/toy is dropped or clicked
  const triggerBouncingPhysics = (
    icon: string,
    name: string,
    onFinish: () => void,
    spriteType?: 'carrot' | 'food' | 'toy' | 'soap' | 'egg' | 'shop'
  ) => {
    const bounceId = Date.now();
    setBouncingItem({ id: bounceId, icon, name, spriteType });
    setTimeout(() => {
      onFinish();
      setTimeout(() => {
        setBouncingItem((current) => (current?.id === bounceId ? null : current));
      }, 300);
    }, 850);
  };

  // Helper for applying EXP, Level Up with exact requirement: 20 carrots + random feature item
  const applyExpAndState = (
    bunny: Bunny,
    expGain: number,
    statUpdates: Partial<Bunny>,
    currentUserState: User,
    logMsg: string,
    actionType: 'feed' | 'bathe' | 'pet'
  ) => {
    const currentLvl = bunny.level || 1;
    const currentExp = bunny.exp || 0;
    const currentMaxExp = bunny.maxExp || 100;

    const totalExp = currentExp + expGain;
    let newLevel = currentLvl;
    let remainingExp = totalExp;
    let maxExp = currentMaxExp;
    let didLevelUp = false;

    while (remainingExp >= maxExp) {
      didLevelUp = true;
      newLevel += 1;
      remainingExp -= maxExp;
      maxExp = Math.round(maxExp * 1.5);
    }

    // Interaction Limit Check
    const today = new Date().toLocaleDateString('vi-VN');
    let interactionsToday = currentUserState.interactionsToday || 0;
    if (currentUserState.lastInteractionDate !== today) {
      interactionsToday = 0;
    }

    if (interactionsToday >= 15) {
      showToast('Hôm nay bạn đã đạt giới hạn 15 lượt tương tác!');
      return;
    }

    interactionsToday += 1;

    // Exact requested rule: 20 carrots per level
    const levelsGained = newLevel - currentLvl;
    const bonusCarrots = didLevelUp ? levelsGained * 20 : 0;

    let levelRewardItem: { name: string; icon: string; description: string } | null = null;
    let nextInventory = { ...(currentUserState.inventoryItems || {}) };
    let nextFoodBags = currentUserState.foodBags;
    let nextToys = currentUserState.toys;

    if (didLevelUp) {
      // Pick a random reward for features
      const rewardPool = [
        ...SHOP_ITEMS.map((item) => ({
          type: 'shop_item' as const,
          shopItem: item,
          name: item.name,
          icon: item.icon,
          description: `Vật phẩm cao cấp: ${item.description}`,
        })),
        {
          type: 'food_pack' as const,
          name: 'Gói Cỏ Mầm Thơm 🌾',
          icon: '🌾',
          description: '+10 Túi thức ăn cao cấp cho thỏ',
        },
        {
          type: 'toy_pack' as const,
          name: 'Hộp Đồ Chơi Len Dạ Quang 🧸',
          icon: '🧸',
          description: '+10 Quả bóng đồ chơi tương tác',
        },
      ];

      const chosen = rewardPool[Math.floor(Math.random() * rewardPool.length)];
      levelRewardItem = {
        name: chosen.name,
        icon: chosen.icon,
        description: chosen.description,
      };

      if (chosen.type === 'shop_item') {
        const id = chosen.shopItem.id;
        nextInventory[id] = (nextInventory[id] || 0) + 1;
      } else if (chosen.type === 'food_pack') {
        nextFoodBags += 10;
      } else if (chosen.type === 'toy_pack') {
        nextToys += 10;
      }
    }

    const computedStage: BunnyStage =
      newLevel >= 50 ? 'adult' : newLevel >= 25 ? 'juvenile' : 'baby';

    const updatedBunny: Bunny = {
      ...bunny,
      ...statUpdates,
      level: newLevel,
      stage: computedStage,
      exp: remainingExp,
      maxExp: maxExp,
      // Fully restore status meters on level up!
      hunger: didLevelUp ? 100 : statUpdates.hunger ?? bunny.hunger,
      happiness: didLevelUp ? 100 : statUpdates.happiness ?? bunny.happiness,
      hygiene: didLevelUp ? 100 : statUpdates.hygiene ?? bunny.hygiene,
    };

    const updatedRabbits = [...currentUserState.rabbits];
    updatedRabbits[selectedBunnyIndex] = updatedBunny;

    const updatedUser: User = {
      ...currentUserState,
      carrots: currentUserState.carrots + bonusCarrots,
      foodBags: nextFoodBags,
      toys: nextToys,
      inventoryItems: nextInventory,
      rabbits: updatedRabbits,
      interactionsToday,
      lastInteractionDate: today,
    };

    onUpdateUser(updatedUser);
    addLog(actionType, logMsg, bunny.name);

    if (didLevelUp) {
      setLevelUpReward(levelRewardItem);
      setLevelUpBunny(updatedBunny);
      setIsCelebratingLevelUp(true);
      setTimeout(() => setIsCelebratingLevelUp(false), 5500);
      audioEngine.playSparkleLevelUpSound();
      addLog(
        'pet',
        `🎉 Thỏ ${bunny.name} đã thăng cấp lên Cấp ${newLevel}! Nhận thưởng +${bonusCarrots} 🥕 và ${levelRewardItem?.name}`,
        bunny.name
      );
    }
  };

  // 1. Cho ăn (Feed standard)
  const handleFeed = () => {
    if (!activeBunny) return;
    if (user.carrots <= 0 && user.foodBags <= 0) {
      showToast('Bạn đã hết củ cà rốt và túi thức ăn rồi!');
      return;
    }

    const useCarrot = user.carrots > 0;
    const newCarrots = useCarrot ? user.carrots - 1 : user.carrots;
    const newFoodBags = !useCarrot ? user.foodBags - 1 : user.foodBags;

    const newHunger = Math.min(100, activeBunny.hunger + 25);
    const newHappiness = Math.min(100, activeBunny.happiness + 15);

    triggerBouncingPhysics(
      useCarrot ? '🥕' : '🌾',
      useCarrot ? 'Cà rốt tươi' : 'Cỏ tươi',
      () => {
        setCurrentAction('eating');
        audioEngine.playCrunchSound();
        triggerFloatingEmote('Yummy! 🥕', '😋');
        dailyQuestManager.progress('feed', 1);

        const intermediateUser: User = {
          ...user,
          carrots: newCarrots,
          foodBags: newFoodBags,
        };

        const logText = `Bạn đã cho thỏ ${activeBunny.name} ăn (${useCarrot ? '1 Cà rốt' : '1 Túi thức ăn'}) (+25 no, +20 EXP)`;
        showToast(`${activeBunny.name} vừa được ăn no nê! (+25 no bụng, +20 EXP) 🥕`);

        applyExpAndState(
          activeBunny,
          20,
          { hunger: newHunger, happiness: newHappiness, state: 'eating' },
          intermediateUser,
          logText,
          'feed'
        );

        setTimeout(() => {
          setCurrentAction('idle');
        }, 2000);
      },
      useCarrot ? 'carrot' : 'food'
    );
  };

  // 2. Tắm rửa (Bathe)
  const handleBathe = () => {
    if (!activeBunny) return;

    const newHygiene = Math.min(100, activeBunny.hygiene + 30);
    const newHappiness = Math.min(100, activeBunny.happiness + 10);

    triggerBouncingPhysics(
      '🫧',
      'Bọt thơm',
      () => {
        setCurrentAction('bathing');
        audioEngine.playBubbleSound();
        triggerFloatingEmote('Sạch sẽ thơm mát! 🫧', '✨');
        dailyQuestManager.progress('bathe', 1);

        const logText = `Thỏ ${activeBunny.name} đã được tắm rửa bọt thơm mát (+30 sạch sẽ, +25 EXP)`;
        showToast(`${activeBunny.name} vừa được tắm bọt thơm tho! (+30 sạch sẽ, +25 EXP) 🫧`);

        applyExpAndState(
          activeBunny,
          25,
          { hygiene: newHygiene, happiness: newHappiness, state: 'bathing' },
          user,
          logText,
          'bathe'
        );

        setTimeout(() => {
          setCurrentAction('idle');
        }, 2200);
      },
      'soap'
    );
  };

  // 3. Xoa đầu (Pet head)
  const handlePetHead = (e?: React.MouseEvent) => {
    if (!activeBunny) return;

    if (e) {
      const rect = hutchContainerRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();
        const type = Math.random() > 0.5 ? 'heart' : 'sparkle';
        setClickEffects((prev) => [...prev, { id, x, y, type }]);
        setTimeout(() => {
          setClickEffects((prev) => prev.filter((eff) => eff.id !== id));
        }, 1000);
      }
    }

    setIsPetting(true);
    setCurrentAction('happy');
    audioEngine.playPurrSound();
    triggerFloatingEmote('Purr~ Nựng yêu! 💕', '🥰');
    dailyQuestManager.progress('pet', 1);

    const newHappiness = Math.min(100, activeBunny.happiness + 20);
    const logText = `Bạn đã xoa đầu và cưng nựng thỏ ${activeBunny.name} (+20 vui vẻ, +20 EXP)`;
    showToast(`${activeBunny.name} lim dim đôi mắt và thích thú khi bạn xoa đầu! (+20 EXP) 💕`);

    applyExpAndState(
      activeBunny,
      20,
      { happiness: newHappiness, state: 'happy' },
      user,
      logText,
      'pet'
    );

    setTimeout(() => {
      setIsPetting(false);
      setCurrentAction('idle');
    }, 2000);
  };

  // 4. Chơi đồ chơi (Play Toy)
  const handlePlayToy = () => {
    if (!activeBunny) return;
    if (user.toys <= 0) {
      showToast('Bạn đã hết đồ chơi trong túi rồi!');
      return;
    }

    const newToys = user.toys - 1;
    const newHappiness = Math.min(100, activeBunny.happiness + 25);

    triggerBouncingPhysics(
      '🧸',
      'Bóng len',
      () => {
        setCurrentAction('happy');
        audioEngine.playSlotTickSound();
        triggerFloatingEmote('Hop hop! Vui quá xá! 🎈', '🐾');
        dailyQuestManager.progress('play_toy', 1);

        const intermediateUser: User = {
          ...user,
          toys: newToys,
        };

        const logText = `Bạn đã chơi quả bóng len cùng thỏ ${activeBunny.name} (+25 vui vẻ, +25 EXP)`;
        showToast(`${activeBunny.name} vui sướng đuổi theo quả bóng len! (+25 EXP) 🧸✨`);

        applyExpAndState(
          activeBunny,
          25,
          { happiness: newHappiness, state: 'happy' },
          intermediateUser,
          logText,
          'pet'
        );

        setTimeout(() => {
          setCurrentAction('idle');
        }, 2000);
      },
      'toy'
    );
  };

  // 5. Sử dụng vật phẩm mua từ Cửa Hàng (Shop Items)
  const handleUseShopItem = (item: ShopItem) => {
    const inv = user.inventoryItems || {};
    const count = inv[item.id] || 0;
    if (count <= 0) return;

    const newInventory = {
      ...inv,
      [item.id]: count - 1,
    };

    const intermediateUser: User = {
      ...user,
      inventoryItems: newInventory,
    };

    const newHunger = Math.min(100, activeBunny.hunger + (item.statBoost.hunger || 0));
    const newHappiness = Math.min(100, activeBunny.happiness + (item.statBoost.happiness || 0));
    const newHygiene = Math.min(100, activeBunny.hygiene + (item.statBoost.hygiene || 0));
    const expAdd = item.statBoost.expBonus || 30;

    triggerBouncingPhysics(item.icon, item.name, () => {
      audioEngine.playSparkleLevelUpSound();
      const logText = `Bạn đã dùng ${item.name} cho thỏ ${activeBunny.name} (+${expAdd} EXP)`;
      showToast(`${activeBunny.name} rất vui sướng khi nhận được ${item.name}! (+${expAdd} EXP) ✨`);

      applyExpAndState(
        activeBunny,
        expAdd,
        {
          hunger: newHunger,
          happiness: newHappiness,
          hygiene: newHygiene,
          state: item.category === 'premium_food' ? 'eating' : 'happy',
        },
        intermediateUser,
        logText,
        item.category === 'premium_food' ? 'feed' : 'pet'
      );

      setTimeout(() => {
        setCurrentAction('idle');
      }, 2200);
    });
  };

  // 6. Cho thỏ đi ngủ / Đánh thức dậy (Toggle Sleep state)
  const handleToggleSleep = () => {
    if (!activeBunny) return;
    const isSleeping = activeBunny.state === 'sleeping';
    const newState = isSleeping ? 'idle' : 'sleeping';
    const msg = isSleeping
      ? `Bé ${activeBunny.name} đã thức giấc, vươn vai sảng khoái! ☀️`
      : `Bé ${activeBunny.name} đã cuộn tròn đi ngủ ngon lành zZ (+15 hồi sức)`;

    const updatedBunny: Bunny = {
      ...activeBunny,
      state: newState,
      happiness: isSleeping ? activeBunny.happiness : Math.min(100, activeBunny.happiness + 15),
    };

    const updatedRabbits = [...user.rabbits];
    updatedRabbits[selectedBunnyIndex] = updatedBunny;

    onUpdateUser({
      ...user,
      rabbits: updatedRabbits,
    });

    audioEngine.playPurrSound();
    triggerFloatingEmote(isSleeping ? 'Chào buổi sáng! ☀️' : 'Zzz... Ngon giấc~ 🌙', isSleeping ? '🐇' : '💤');
    showToast(msg);
    addLog('pet', msg, activeBunny.name);
  };

  // Drag and Drop handlers for the Hutch pen
  const handleDragOverHutch = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDragOverHutch) setIsDragOverHutch(true);
  };

  const handleDragLeaveHutch = () => {
    setIsDragOverHutch(false);
  };

  const handleDropOnHutch = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverHutch(false);
    const dataStr = e.dataTransfer.getData('application/json');
    if (!dataStr) return;

    try {
      const data = JSON.parse(dataStr);
      if (data.type === 'feed') {
        handleFeed();
      } else if (data.type === 'bath') {
        handleBathe();
      } else if (data.type === 'toy') {
        handlePlayToy();
      } else if (data.type === 'shop_item') {
        const item = SHOP_ITEMS.find((s) => s.id === data.itemId);
        if (item) handleUseShopItem(item);
      }
    } catch {
      // ignore
    }
  };

  const inventory = user.inventoryItems || {};
  const ownedShopItems = SHOP_ITEMS.filter((item) => (inventory[item.id] || 0) > 0);
  const expPercentage = Math.min(100, Math.round(((activeBunny.exp || 0) / (activeBunny.maxExp || 100)) * 100));

    const isBunnySleeping = activeBunny.state === 'sleeping' && currentAction === 'idle';
    const currentTheme =
      HUTCH_THEMES.find((t) => t.id === (user.hutchTheme || 'theme_sakura')) || HUTCH_THEMES[0];
    const equippedDecors = user.equippedDecors || [];

    const isGuest = user.id === 'guest-rabbit-traveler';

    if (isGuest) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] glass-panel rounded-3xl p-8 text-center space-y-4">
          <div className="w-24 h-24 bg-sky-100 dark:bg-sky-950 rounded-full flex items-center justify-center text-4xl animate-bunny-hop">
            🐇
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Chưa Có Bé Thỏ Nào</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-md">
            Hiện bạn chưa có bé thỏ nào để chăm sóc. Vui lòng đăng nhập để nhận bé thỏ đầu tiên và bắt đầu hành trình của mình!
          </p>
          <button
            onClick={onOpenAuth}
            className="px-8 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            Đăng Nhập Ngay
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6 max-w-4xl mx-auto select-none">
        {/* Top Bar: Status Filter Dropdown & Bunny Switcher */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 glass-panel pixel-box rounded-2xl p-4 shadow-sm">
          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Lọc theo trạng thái:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setStatusFilter(val);
                  // Auto sync selected bunny to first match if current doesn't match
                  const matches = user.rabbits.filter((b) => {
                    if (val === 'hungry') return b.hunger < 50;
                    if (val === 'dirty') return b.hygiene < 50;
                    if (val === 'sleeping') return b.state === 'sleeping';
                    return true;
                  });
                  if (matches.length > 0 && !matches.some((b) => b.id === activeBunny.id)) {
                    const targetIdx = user.rabbits.findIndex((b) => b.id === matches[0].id);
                    if (targetIdx !== -1) setSelectedBunnyIndex(targetIdx);
                  }
                }}
                className="mt-0.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/95 dark:bg-slate-900/90 border-2 border-sky-300 dark:border-sky-700 text-slate-900 dark:text-slate-100 shadow-2xs focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all cursor-pointer"
              >
                <option value="all">🌟 Tất cả trạng thái ({user.rabbits.length})</option>
                <option value="hungry">🥕 Đang đói ({hungryCount})</option>
                <option value="dirty">🫧 Cần tắm ({dirtyCount})</option>
                <option value="sleeping">💤 Đang ngủ ({sleepingCount})</option>
              </select>
            </div>
          </div>

          {/* Bunny switcher list */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none flex-1">
            {filteredRabbits.length > 0 ? (
              filteredRabbits.map((bunny) => {
                const originalIndex = user.rabbits.findIndex((b) => b.id === bunny.id);
                const isSelected = originalIndex === selectedBunnyIndex;
                return (
                  <button
                    key={bunny.id}
                    onClick={() => {
                      setSelectedBunnyIndex(originalIndex);
                      setIsRenaming(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 pixel-tag transition-all whitespace-nowrap ${
                      isSelected
                        ? 'bg-sky-500 text-white shadow-xs font-bold scale-105 border-2 border-sky-600'
                        : 'bg-white/90 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 border-2 border-sky-200/80 dark:border-sky-800/60'
                    }`}
                  >
                    <PixelBunny
                      size={22}
                      furColor={bunny.furColor}
                      accentColor={bunny.accentColor}
                      state={bunny.state as any}
                      className="shrink-0 drop-shadow-2xs"
                    />
                    <span>{bunny.name}</span>
                    <span className="text-[10px] opacity-80">Lv.{bunny.level || 1}</span>
                    {bunny.hunger < 50 && (
                      <span title="Đang đói">
                        <PixelCarrot size={14} className="shrink-0 inline-block" />
                      </span>
                    )}
                    {bunny.hygiene < 50 && (
                      <span title="Cần tắm">
                        <PixelSoap size={14} className="shrink-0 inline-block" />
                      </span>
                    )}
                    {bunny.state === 'sleeping' && <span title="Đang ngủ">💤</span>}
                  </button>
                );
              })
            ) : (
              <div className="text-xs text-slate-500 italic py-1">
                Không có bé thỏ nào đang ở trạng thái này.
              </div>
            )}
          </div>

          {/* Inventory Counts */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 justify-end shrink-0">
            <div className="flex items-center gap-1.5 bg-amber-100/90 dark:bg-amber-950/60 px-2.5 py-1.5 rounded-xl border-2 border-amber-300 dark:border-amber-800 shadow-2xs">
              <PixelCarrot size={18} className="shrink-0" />
              <span>{user.carrots} Cà rốt</span>
            </div>
            <div className="flex items-center gap-1.5 bg-sky-100/90 dark:bg-sky-950/60 px-2.5 py-1.5 rounded-xl border-2 border-sky-300 dark:border-sky-800 shadow-2xs">
              <PixelFoodBag size={18} className="shrink-0" />
              <span>{user.foodBags} Thức ăn</span>
            </div>
            <div className="flex items-center gap-1.5 bg-pink-100/90 dark:bg-pink-950/60 px-2.5 py-1.5 rounded-xl border-2 border-pink-300 dark:border-pink-800 shadow-2xs">
              <PixelToy size={18} className="shrink-0" />
              <span>{user.toys} Đồ chơi</span>
            </div>
          </div>
        </div>

        {/* Top Control Dashboard: Stats, Actions & Controls (All located outside/above the Hutch room) */}
        <div className="glass-panel pixel-box rounded-3xl p-5 shadow-lg space-y-4">
          {/* Header Info & Quick Navigation */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-3 border-b border-sky-200/60 dark:border-sky-800/50">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
                <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-sparkle" />
                <span>Bảng Điều Khiển Chuồng Thỏ · {currentTheme.name}</span>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap mt-1">
                {isRenaming ? (
                  <div className="flex items-center gap-1.5 py-0.5">
                    <input
                      type="text"
                      value={renameInput}
                      onChange={(e) => setRenameInput(e.target.value)}
                      maxLength={20}
                      autoFocus
                      className="px-2.5 py-1 rounded-xl text-base font-bold bg-white dark:bg-slate-900 border-2 border-sky-400 text-slate-900 dark:text-white focus:outline-none shadow-xs"
                      placeholder="Tên mới cho bé thỏ..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveRename();
                        if (e.key === 'Escape') setIsRenaming(false);
                      }}
                    />
                    <button
                      onClick={handleSaveRename}
                      className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xs transition-transform hover:scale-105"
                      title="Lưu tên mới"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsRenaming(false)}
                      className="p-1.5 rounded-lg bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 text-slate-700 dark:text-slate-200 transition-colors"
                      title="Hủy"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {activeBunny.name}
                    </h2>
                    <button
                      onClick={handleStartRename}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 dark:hover:text-sky-300 hover:bg-sky-100/60 dark:hover:bg-slate-800 transition-colors"
                      title="Đổi tên bé thỏ này"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* EXP Bar under name */}
                <div className="w-48 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-sky-200 dark:border-sky-800 mt-1">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-amber-300 transition-all duration-700"
                    style={{ width: `${expPercentage}%` }}
                  />
                </div>

                {/* Level Badge & Stage */}
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-800 dark:text-amber-300 border border-amber-400/50 font-bold">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Cấp {activeBunny.level || 1}</span>
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 font-medium border border-sky-200 dark:border-sky-800">
                  {activeBunny.stage === 'baby' ? '🍼 Em Bé' : activeBunny.stage === 'adult' ? '👑 Trưởng Thành' : '🐇 Vừa'} · {activeBunny.colorName}
                </span>
                {isBunnySleeping && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                    <Moon className="w-3 h-3 text-indigo-500" />
                    <span>Đang ngủ ngon zZ</span>
                  </span>
                )}
              </div>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Weather Switcher Pill */}
              <button
                onClick={cycleWeather}
                className="px-2.5 py-1.5 rounded-xl border-2 border-sky-300 dark:border-sky-700 bg-sky-100/90 dark:bg-sky-950/70 hover:bg-sky-200 text-sky-900 dark:text-sky-100 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 pixel-tag"
                title="Bấm để chuyển thời tiết"
              >
                <span className="text-sm">{WEATHER_CONFIGS[currentWeather].icon}</span>
                <span className="hidden sm:inline">{WEATHER_CONFIGS[currentWeather].name}</span>
              </button>

              {/* Decor & Theme Customization Button */}
              <button
                onClick={() => setIsDecorModalOpen(true)}
                className="px-2.5 py-1.5 rounded-xl border-2 border-pink-300/90 dark:border-pink-700 bg-pink-100/90 dark:bg-pink-950/70 hover:bg-pink-200 text-pink-950 dark:text-pink-100 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 pixel-tag"
                title="Đổi màu nền, dáng thỏ, màu sắc và phụ kiện"
              >
                <Palette className="w-3.5 h-3.5 text-pink-600 dark:text-pink-300" />
                <span>Trang Trí Thỏ & Nền 🎨</span>
              </button>

              <button
                onClick={handleToggleSleep}
                className={`px-2.5 py-1.5 rounded-xl border-2 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 pixel-tag ${
                  isBunnySleeping
                    ? 'bg-amber-100 dark:bg-amber-950/70 border-amber-300 text-amber-900 dark:text-amber-100'
                    : 'bg-indigo-100/80 dark:bg-indigo-950/60 border-indigo-300 text-indigo-900 dark:text-indigo-100 hover:bg-indigo-200'
                }`}
                title={isBunnySleeping ? 'Đánh thức bé dậy' : 'Cho bé thỏ đi ngủ nghỉ ngơi'}
              >
                {isBunnySleeping ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Thức Dậy ☀️</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Đi Ngủ 💤</span>
                  </>
                )}
              </button>

              {onGoToShop && (
                <button
                  onClick={onGoToShop}
                  className="px-3 py-1.5 rounded-xl border-2 border-amber-400 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 pixel-tag"
                  title="Mở Cửa Hàng Bách Hóa"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-white" />
                  <span>Cửa Hàng</span>
                </button>
              )}

              <button
                onClick={onGoToMeadow}
                className="px-3 py-1.5 rounded-xl glass-panel border-2 border-sky-300 dark:border-sky-600 text-xs font-bold text-sky-900 dark:text-sky-200 hover:bg-sky-100 dark:hover:bg-slate-800 transition-colors shrink-0 shadow-xs pixel-tag"
              >
                Đồng Cỏ →
              </button>
            </div>
          </div>

          {/* 3 Core Interactive Action Buttons - Prominent & Compact on Top Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={handleFeed}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5 pixel-btn"
            >
              <Utensils className="w-4 h-4" />
              <span>Cho Ăn (Cà rốt/Cỏ)</span>
            </button>

            <button
              onClick={handleBathe}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5 pixel-btn"
            >
              <Bath className="w-4 h-4" />
              <span>Tắm Rửa Bọt Thơm</span>
            </button>

            <button
              onClick={handlePetHead}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600 text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5 pixel-btn"
            >
              <Smile className="w-4 h-4" />
              <span>Xoa Đầu & Nựng Yêu</span>
            </button>

            <button
              onClick={handlePlayToy}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5 pixel-btn"
            >
              <Heart className="w-4 h-4" />
              <span>Chơi Bóng Len</span>
            </button>
          </div>

          {/* Status Bars & EXP Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
            {/* Hunger Bar */}
            <div className="glass-panel pixel-panel p-2.5 rounded-2xl bg-white/70 dark:bg-slate-900/60">
              <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                <span className="flex items-center gap-1">
                  <Utensils className="w-3 h-3 text-amber-500" />
                  Độ No Bụng
                </span>
                <span className="font-mono">{activeBunny.hunger}%</span>
              </div>
              <div className="w-full bg-slate-200/80 dark:bg-slate-800 rounded-full h-2 overflow-hidden border border-amber-200/50 dark:border-amber-900/50">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${activeBunny.hunger}%` }}
                />
              </div>
            </div>

            {/* Happiness Bar */}
            <div className="glass-panel pixel-panel p-2.5 rounded-2xl bg-white/70 dark:bg-slate-900/60">
              <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-500" />
                  Độ Vui Vẻ
                </span>
                <span className="font-mono">{activeBunny.happiness}%</span>
              </div>
              <div className="w-full bg-slate-200/80 dark:bg-slate-800 rounded-full h-2 overflow-hidden border border-rose-200/50 dark:border-rose-900/50">
                <div
                  className="bg-rose-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${activeBunny.happiness}%` }}
                />
              </div>
            </div>

            {/* Hygiene Bar */}
            <div className="glass-panel pixel-panel p-2.5 rounded-2xl bg-white/70 dark:bg-slate-900/60">
              <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                <span className="flex items-center gap-1">
                  <Bath className="w-3 h-3 text-sky-500" />
                  Độ Sạch Sẽ
                </span>
                <span className="font-mono">{activeBunny.hygiene}%</span>
              </div>
              <div className="w-full bg-slate-200/80 dark:bg-slate-800 rounded-full h-2 overflow-hidden border border-sky-200/50 dark:border-sky-900/50">
                <div
                  className="bg-sky-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${activeBunny.hygiene}%` }}
                />
              </div>
            </div>

            {/* EXP Bar */}
            <div className="glass-panel pixel-panel p-2.5 rounded-2xl bg-white/70 dark:bg-slate-900/60">
              <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  Kinh Nghiệm (EXP)
                </span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">{expPercentage}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden border border-sky-200/50 dark:border-sky-800/40">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-sky-400 to-amber-300 h-full rounded-full transition-all duration-500"
                  style={{ width: `${expPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Hutch Room Container - PURE SCENIC VIEWPORT (Free of intrusive buttons) */}
        <div
          ref={hutchContainerRef}
          onDragOver={handleDragOverHutch}
          onDragLeave={handleDragLeaveHutch}
          onDrop={handleDropOnHutch}
          className={`relative rounded-3xl glass-panel pixel-box border-2 transition-all duration-300 p-5 sm:p-7 shadow-2xl overflow-hidden min-h-[500px] flex flex-col justify-between ${
            isDragOverHutch
              ? 'border-dashed border-sky-500 ring-4 ring-sky-400/30 scale-[1.01]'
              : currentTheme.borderColor
          }`}
        >
          {/* Dynamic Theme Pixel Art Room Background */}
          <ThemePixelRoom themeId={currentTheme.id} className="z-0 opacity-90 dark:opacity-80" />

          {/* Dynamic Weather Overlay (Morning mist, fireflies, rain, sunlight) */}
          <WeatherOverlay weather={currentWeather} className="z-10 rounded-3xl" />

          {/* Click Effects (Hearts & Sparkles) */}
          {clickEffects.map((eff) => (
            <div
              key={eff.id}
              className="absolute z-50 pointer-events-none animate-out fade-out zoom-out duration-1000 fill-mode-forwards"
              style={{ left: eff.x, top: eff.y }}
            >
              {eff.type === 'heart' ? (
                <PixelHeart size={32} className="text-rose-500" />
              ) : (
                <PixelSparkle size={32} className="text-amber-400" />
              )}
            </div>
          ))}

          {/* Drag Over Hint Overlay */}
          {isDragOverHutch && (
            <div className="absolute inset-0 bg-sky-400/15 backdrop-blur-[2px] z-30 flex flex-col items-center justify-center pointer-events-none animate-in fade-in duration-200">
              <div className="px-5 py-2.5 rounded-2xl glass-panel border-2 border-sky-400 text-sky-900 dark:text-sky-100 font-bold text-sm shadow-xl flex items-center gap-2 animate-bounce">
                <Sparkles className="w-5 h-5 text-sky-500 animate-spin-slow" />
                <span>Thả thực phẩm hoặc đồ chơi vào đây cho bé thỏ! 🐰✨</span>
              </div>
            </div>
          )}

          {/* Room Ambient Label */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 px-3 py-1 rounded-full bg-white/70 dark:bg-slate-900/70 border border-sky-200 dark:border-sky-800 shadow-2xs">
              🌸 Không gian: {currentTheme.name}
            </span>
            <span className="text-xs font-medium italic text-slate-700 dark:text-slate-300">
              "{activeBunny.personality}"
            </span>
          </div>

          {/* Central Stage: Animated Pixel-Art Rabbit Character & Physics Bouncing Item Effect */}
          <div className="relative z-10 my-8 flex flex-col items-center justify-center">
            {/* Toast feedback pill */}
            {feedbackText && (
              <div className="absolute -top-12 px-4 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-medium shadow-md animate-bounce z-20 border border-sky-400/50">
                {feedbackText}
              </div>
            )}

            {/* Clean & Simple Level-Up Toast Banner */}
            {isCelebratingLevelUp && (
              <div className="absolute -top-14 z-40 pointer-events-none flex flex-col items-center justify-center animate-in zoom-in-95 duration-200">
                <div className="px-4 py-2 rounded-2xl bg-sky-500 text-white font-extrabold text-xs sm:text-sm shadow-lg border-2 border-sky-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>⭐ Lên Cấp {activeBunny.level}! (+20 Cà rốt)</span>
                </div>
              </div>
            )}

            {/* Physics Bouncing Item Falling from above onto Bunny with Pixel Art Sprites */}
            {bouncingItem && (
              <div className="absolute -top-14 z-30 pointer-events-none flex flex-col items-center animate-physics-bounce">
                {bouncingItem.spriteType === 'carrot' ? (
                  <PixelCarrot size={52} className="filter drop-shadow-xl" />
                ) : bouncingItem.spriteType === 'food' ? (
                  <PixelFoodBag size={52} className="filter drop-shadow-xl" />
                ) : bouncingItem.spriteType === 'toy' ? (
                  <PixelToy size={52} className="filter drop-shadow-xl" />
                ) : bouncingItem.spriteType === 'soap' ? (
                  <PixelSoap size={52} className="filter drop-shadow-xl" />
                ) : bouncingItem.spriteType === 'egg' ? (
                  <PixelEgg size={52} />
                ) : (
                  <span className="text-4xl filter drop-shadow-xl">{bouncingItem.icon}</span>
                )}
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-900/90 text-white shadow-xs mt-1 border border-sky-300/40 whitespace-nowrap">
                  {bouncingItem.name}
                </span>
              </div>
            )}

            {/* Interactive Bunny Avatar Stage */}
            <div
              onClick={(e) => {
                handlePetHead(e);
                triggerFloatingEmote('Binky! Nhảy cẫng~ ✨', '🐰');
              }}
              title="Bấm hoặc xoa đầu để nựng bé thỏ!"
              className="group relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center cursor-pointer select-none transition-transform hover:scale-105 active:scale-95"
            >
              {/* Soft nest glow */}
              <div className="absolute inset-x-4 bottom-2 h-14 bg-sky-400/25 dark:bg-sky-400/15 rounded-full blur-md z-0" />

              {/* Pixel Bubble animations if bathing */}
              {currentAction === 'bathing' && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
                  <span className="absolute -top-4 left-6 animate-bounce">
                    <PixelBubble size={32} />
                  </span>
                  <span className="absolute top-6 right-6 animate-pulse">
                    <PixelBubble size={24} />
                  </span>
                  <span className="absolute bottom-6 left-8 animate-ping">
                    <PixelBubble size={20} />
                  </span>
                  <span className="absolute top-2 right-14 animate-bounce">
                    <PixelBubble size={28} />
                  </span>
                </div>
              )}

              {/* Pixel Heart bursts and Sparkles if happy or eating */}
              {(currentAction === 'happy' || currentAction === 'eating' || isPetting) && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
                  <span className="absolute -top-6 right-8 animate-bounce">
                    <PixelHeart size={36} />
                  </span>
                  <span className="absolute top-2 left-6 animate-pulse">
                    <PixelSparkle size={26} color="#fbbf24" />
                  </span>
                  <span className="absolute -top-2 left-14 animate-bounce">
                    <PixelHeart size={24} />
                  </span>
                  <span className="absolute top-10 right-4 animate-sparkle">
                    <PixelSparkle size={22} color="#f472b6" />
                  </span>
                </div>
              )}

              {/* Retro Pixel-Art Bunny Sprite with Stages, Ears, Patterns, and Floating Emote */}
              <div
                className={`relative z-10 drop-shadow-xl transition-transform ${
                  currentAction === 'eating'
                    ? 'animate-bounce'
                    : currentAction === 'happy' || isPetting
                    ? 'scale-105'
                    : isBunnySleeping
                    ? 'scale-95'
                    : 'animate-bunny-hop'
                }`}
              >
                <PixelBunny
                  size={activeBunny.stage === 'baby' ? 120 : activeBunny.stage === 'adult' ? 160 : 144}
                  furColor={activeBunny.furColor}
                  accentColor={activeBunny.accentColor}
                  state={isBunnySleeping ? 'sleeping' : currentAction}
                  stage={activeBunny.stage || 'juvenile'}
                  earType={activeBunny.earType || 'upright'}
                  pattern={activeBunny.pattern || 'solid'}
                  equippedWearables={activeBunny.equippedWearables}
                  currentEmote={currentEmote}
                />
              </div>
            </div>

            <span className="text-xs text-slate-700 dark:text-slate-300 mt-2 font-bold px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 shadow-2xs">
              (Bấm vào bé thỏ để nựng & tương tác binky 💕)
            </span>
          </div>

          <div />
        </div>

      {/* Interactive Physics Drag & Drop Tray for Food & Toys */}
      <div className="glass-panel pixel-box rounded-2xl p-4 sm:p-5 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hand className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Khay Kéo Thả Vật Phẩm & Đồ Chơi (Hiệu Ứng Bouncing Vật Lý)
            </h3>
          </div>
          <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium hidden sm:inline">
            (Kéo thả hoặc bấm trực tiếp để ném nảy vào chuồng)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {/* Draggable Carrot */}
          <div
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/json', JSON.stringify({ type: 'feed' }));
            }}
            onClick={handleFeed}
            className="p-3 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border-2 border-amber-300/90 dark:border-amber-700 hover:border-amber-500 flex items-center gap-3 cursor-grab active:cursor-grabbing hover:scale-105 transition-all shadow-xs group pixel-tag"
            title="Kéo thả vào chuồng để thỏ ăn với hiệu ứng nảy vật lý!"
          >
            <PixelCarrot size={38} className="group-hover:scale-110 transition-transform shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Cà Rốt Tươi
              </div>
              <div className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold">
                Còn: {user.carrots} củ
              </div>
            </div>
          </div>

          {/* Draggable Food Bag */}
          <div
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/json', JSON.stringify({ type: 'feed' }));
            }}
            onClick={handleFeed}
            className="p-3 rounded-2xl bg-sky-50/90 dark:bg-sky-950/40 border-2 border-sky-300/90 dark:border-sky-700 hover:border-sky-500 flex items-center gap-3 cursor-grab active:cursor-grabbing hover:scale-105 transition-all shadow-xs group pixel-tag"
            title="Kéo thả vào chuồng để thỏ ăn với hiệu ứng nảy vật lý!"
          >
            <PixelFoodBag size={38} className="group-hover:scale-110 transition-transform shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Túi Cỏ Thơm
              </div>
              <div className="text-[10px] text-sky-700 dark:text-sky-300 font-semibold">
                Còn: {user.foodBags} túi
              </div>
            </div>
          </div>

          {/* Draggable Toy Ball */}
          <div
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/json', JSON.stringify({ type: 'toy' }));
            }}
            onClick={handlePlayToy}
            className="p-3 rounded-2xl bg-pink-50/90 dark:bg-pink-950/40 border-2 border-pink-300/90 dark:border-pink-700 hover:border-pink-500 flex items-center gap-3 cursor-grab active:cursor-grabbing hover:scale-105 transition-all shadow-xs group pixel-tag"
            title="Kéo thả bóng len vào chuồng cho thỏ nhảy đùa!"
          >
            <PixelToy size={38} className="group-hover:scale-110 transition-transform shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Bóng Đồ Chơi
              </div>
              <div className="text-[10px] text-pink-700 dark:text-pink-300 font-semibold">
                Còn: {user.toys} cái
              </div>
            </div>
          </div>

          {/* Draggable Bubble Sponge */}
          <div
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/json', JSON.stringify({ type: 'bath' }));
            }}
            onClick={handleBathe}
            className="p-3 rounded-2xl bg-cyan-50/90 dark:bg-cyan-950/40 border-2 border-cyan-300/90 dark:border-cyan-700 hover:border-cyan-500 flex items-center gap-3 cursor-grab active:cursor-grabbing hover:scale-105 transition-all shadow-xs group pixel-tag"
            title="Kéo thả bọt xà phòng vào chuồng để tắm mát cho thỏ!"
          >
            <PixelSoap size={38} className="group-hover:scale-110 transition-transform shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Bọt Tắm Thơm
              </div>
              <div className="text-[10px] text-cyan-700 dark:text-cyan-300 font-semibold">
                Vô hạn 🫧
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Special Shop Inventory Drawer: Purchased Items with Drag-and-Drop */}
      <div className="glass-panel pixel-box rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-sky-100 dark:border-sky-900/40">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Túi Đồ Cao Cấp & Đồ Chơi Đặc Biệt
            </h3>
          </div>
          {onGoToShop && (
            <button
              onClick={onGoToShop}
              className="text-xs text-sky-600 dark:text-sky-400 font-bold hover:underline flex items-center gap-1"
            >
              <span>Mua thêm ở Cửa Hàng</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {ownedShopItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {ownedShopItems.map((item) => {
              const qty = inventory[item.id] || 0;
              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData(
                      'application/json',
                      JSON.stringify({ type: 'shop_item', itemId: item.id })
                    );
                  }}
                  className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/70 border-2 border-sky-200/90 dark:border-sky-800/80 flex flex-col justify-between gap-2 shadow-2xs hover:border-sky-400 transition-colors cursor-grab active:cursor-grabbing pixel-tag"
                  title="Kéo thả vào chuồng hoặc bấm để dùng cho thỏ!"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl animate-float-toy">{item.icon}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        Có sẵn: {qty}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUseShopItem(item)}
                    className="w-full py-1.5 px-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold text-[11px] transition-colors shadow-2xs pixel-btn"
                  >
                    Dùng cho thỏ (+{item.statBoost.expBonus} EXP)
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-4 text-center text-xs text-slate-600 dark:text-slate-300 flex flex-col items-center justify-center gap-2">
            <span>Bạn chưa có món ăn cao cấp hay đồ chơi đặc biệt nào trong túi.</span>
            {onGoToShop && (
              <button
                onClick={onGoToShop}
                className="px-3.5 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-900 dark:text-amber-100 font-bold border-2 border-amber-300 dark:border-amber-700 transition-colors pixel-tag"
              >
                Ghé Tiệm Bách Hóa Sắm Đồ 🥕
              </button>
            )}
          </div>
        )}
      </div>

      {/* Care History Log */}
      <div className="glass-panel pixel-box rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-sky-100 dark:border-sky-900/40">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Nhật Ký Chăm Sóc Đàn Thỏ
            </h3>
          </div>
          {careLogs.length > 0 && (
            <button
              onClick={clearLogs}
              className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors"
              title="Xóa lịch sử nhật ký"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa nhật ký</span>
            </button>
          )}
        </div>

        {careLogs.length > 0 ? (
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {careLogs.map((log, idx) => (
              <div
                key={`${log.id || 'log'}-${idx}`}
                className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-sky-100 dark:border-sky-900/30 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="shrink-0">
                    {log.action === 'feed' ? (
                      <PixelCarrot size={16} />
                    ) : log.action === 'bathe' ? (
                      <PixelSoap size={16} />
                    ) : (
                      <PixelHeart size={16} />
                    )}
                  </span>
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {log.message}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 whitespace-nowrap shrink-0">
                  <Clock className="w-3 h-3" />
                  <span>{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-xs text-slate-500 dark:text-slate-400">
            Chưa có nhật ký chăm sóc nào gần đây.
          </div>
        )}
      </div>

      {/* Sparkling Level Up Modal Pop-up with 20 Carrots & Random Feature Item */}
      {levelUpBunny && (
        <LevelUpSparkleModal
          bunny={levelUpBunny}
          onClose={() => {
            setLevelUpBunny(null);
            setLevelUpReward(null);
          }}
          bonusCarrots={20}
          rewardItem={levelUpReward}
        />
      )}

      {/* Hutch Decor & Theme Customization Modal */}
      <HutchDecorModal
        isOpen={isDecorModalOpen}
        onClose={() => setIsDecorModalOpen(false)}
        user={user}
        onUpdateUser={onUpdateUser}
        selectedBunnyIndex={selectedBunnyIndex}
      />
    </div>
  );
};
