import React, { useState } from 'react';
import { User, ShopItem, Achievement } from '../types';
import { SHOP_ITEMS, INITIAL_ACHIEVEMENTS } from '../data/initialData';
import { audioEngine } from '../utils/audioEngine';
import {
  Sparkles,
  ShoppingBag,
  Utensils,
  Smile,
  Heart,
  Check,
  ArrowRight,
  Award,
  Trophy,
  CheckCircle2,
  Lock,
  History,
  Trash2,
  Clock,
  Calendar,
  X,
  Package,
} from 'lucide-react';

interface ShopProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onGoToHutch?: () => void;
  onClose?: () => void;
}

export interface ShopTransaction {
  id: string;
  itemId: string;
  itemName: string;
  itemIcon: string;
  category: 'premium_food' | 'special_toy';
  costCarrots: number;
  timestamp: string;
  date: string;
}

const TRANSACTIONS_KEY = 'lalapine_shop_transactions_v2';

export const Shop: React.FC<ShopProps> = ({ user, onUpdateUser, onGoToHutch, onClose }) => {
  const [activeMainTab, setActiveMainTab] = useState<'items' | 'inventory' | 'achievements' | 'history'>('items');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'premium_food' | 'special_toy'>('all');
  const [purchaseToast, setPurchaseToast] = useState<string | null>(null);

  // Transaction history state
  const [transactions, setTransactions] = useState<ShopTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(TRANSACTIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'tx-seed-1',
        itemId: 'clover_special',
        itemName: 'Cỏ Ba Lá May Mắn',
        itemIcon: '🍀',
        category: 'premium_food',
        costCarrots: 25,
        timestamp: '10:30',
        date: 'Hôm nay',
      },
    ];
  });

  const inventory = user.inventoryItems || {};
  const unlocked = user.unlockedAchievements || [];

  const filteredItems = SHOP_ITEMS.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const showToast = (msg: string) => {
    setPurchaseToast(msg);
    setTimeout(() => setPurchaseToast(null), 3200);
  };

  const handleBuy = (item: ShopItem) => {
    if (user.carrots < item.priceCarrots) {
      showToast(`Bạn chưa đủ cà rốt để mua ${item.name}! Cần thêm ${item.priceCarrots - user.carrots} 🥕 nữa.`);
      return;
    }

    const currentCount = inventory[item.id] || 0;
    const newInventory = {
      ...inventory,
      [item.id]: currentCount + 1,
    };

    onUpdateUser({
      ...user,
      carrots: user.carrots - item.priceCarrots,
      inventoryItems: newInventory,
    });

    // Record transaction
    const newTx: ShopTransaction = {
      id: 'tx-' + Date.now(),
      itemId: item.id,
      itemName: item.name,
      itemIcon: item.icon,
      category: item.category,
      costCarrots: item.priceCarrots,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('vi-VN'),
    };

    setTransactions((prev) => {
      const updated = [newTx, ...prev];
      try {
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    audioEngine.playCoinSound();
    showToast(`Đã mua thành công 1x ${item.name}! Đã cất vào túi đồ. ✨`);
  };

  const handleClearTransactions = () => {
    setTransactions([]);
    try {
      localStorage.removeItem(TRANSACTIONS_KEY);
    } catch {
      // ignore
    }
  };

  // Helper to compute achievement progress
  const getAchievementProgress = (ach: Achievement) => {
    if (ach.id === 'master_breeder') {
      const current = user.rabbits.length;
      return { current, target: 3, completed: current >= 3 };
    }
    if (ach.id === 'rabbit_whisperer') {
      const current = user.rabbits.length;
      return { current, target: 5, completed: current >= 5 };
    }
    if (ach.id === 'carrot_tycoon') {
      const current = user.carrots;
      return { current, target: 80, completed: current >= 80 };
    }
    if (ach.id === 'shopping_spree') {
      const totalPurchased = Object.values(user.inventoryItems || {}).reduce((a, b) => a + b, 0);
      return { current: totalPurchased, target: 2, completed: totalPurchased >= 2 };
    }
    if (ach.id === 'growth_milestone') {
      const maxLvl = Math.max(...user.rabbits.map((b) => b.level || 1), 1);
      return { current: maxLvl, target: 3, completed: maxLvl >= 3 };
    }
    if (ach.id === 'egg_collector') {
      const hasSpecial = user.rabbits.some(
        (b) => b.rarity === 'hybrid' || b.rarity === 'celestial' || (b.level || 1) >= 4
      );
      return { current: hasSpecial ? 1 : 0, target: 1, completed: hasSpecial };
    }
    return { current: 0, target: ach.targetCount, completed: false };
  };

  const handleClaimAchievement = (ach: Achievement) => {
    if (unlocked.includes(ach.id)) return;

    const newUnlocked = [...unlocked, ach.id];
    onUpdateUser({
      ...user,
      carrots: user.carrots + ach.rewardCarrots,
      unlockedAchievements: newUnlocked,
      equippedBadge: user.equippedBadge || ach.badge,
    });

    audioEngine.playSparkleLevelUpSound();
    showToast(`🎉 Chúc mừng! Bạn đã mở khóa "${ach.title}" và nhận +${ach.rewardCarrots} 🥕 cà rốt!`);
  };

  const handleToggleEquipBadge = (badge: string) => {
    const isEquipped = user.equippedBadge === badge;
    const newBadge = isEquipped ? undefined : badge;

    onUpdateUser({
      ...user,
      equippedBadge: newBadge,
    });

    audioEngine.playPurrSound();
    showToast(isEquipped ? 'Đã gỡ huy hiệu khỏi profile của bạn.' : `Đã gắn huy hiệu "${badge}" lên profile! ✨`);
  };

  const totalCarrotsSpent = transactions.reduce((acc, t) => acc + t.costCarrots, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none relative">
      {/* Toast Notification */}
      {purchaseToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-slate-900/95 text-white text-xs sm:text-sm font-semibold shadow-xl border border-sky-400/50 animate-in fade-in slide-in-from-top-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-300 animate-sparkle" />
          <span>{purchaseToast}</span>
        </div>
      )}

      {/* Shop Header Banner */}
      <div className="relative rounded-3xl glass-panel pixel-box p-6 sm:p-8 shadow-xl overflow-hidden">
        {/* Close Button if opened as Pop-up */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full glass-panel border border-sky-200/80 dark:border-sky-700/60 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors z-20 pixel-tag"
            title="Đóng cửa hàng"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Soft starlight glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 dark:bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
              <ShoppingBag className="w-4 h-4" />
              <span>Tiệm Bách Hóa & Thành Tựu la Lapine</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Cửa Hàng la Lapine
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1 max-w-xl">
              Dùng cà rốt tích lũy để mua sắm vật phẩm đặc biệt, kiểm tra lịch sử mua sắm hoặc hoàn thành các mốc nuôi thỏ để mở khóa huy hiệu profile!
            </p>

            {user.equippedBadge && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-900 dark:text-amber-200 text-xs font-bold border-2 border-amber-400/60 pixel-tag">
                <span>Huy hiệu đang đeo:</span>
                <span className="font-extrabold">{user.equippedBadge}</span>
              </div>
            )}
          </div>

          {/* User Carrot Wallet Card */}
          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-100/95 to-amber-200/90 dark:from-amber-950/80 dark:to-slate-900/90 border-2 border-amber-300 dark:border-amber-700 shadow-md pixel-box">
              <span className="text-2xl animate-bounce">🥕</span>
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-amber-900 dark:text-amber-300 tracking-wider">
                  Ví Cà Rốt Của Bạn
                </div>
                <div className="text-lg sm:text-xl font-bold font-mono text-amber-950 dark:text-amber-200">
                  {user.carrots} Củ
                </div>
              </div>
            </div>

            {onGoToHutch && (
              <button
                onClick={onGoToHutch}
                className="text-xs font-bold text-sky-700 dark:text-sky-300 hover:text-sky-800 dark:hover:text-sky-200 flex items-center gap-1 transition-colors self-start sm:self-end pixel-tag"
              >
                <span>Vào chuồng chăm thỏ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Switcher: Tiệm Bách Hóa vs Hệ Thống Thành Tựu vs Lịch Sử Giao Dịch */}
      <div className="flex items-center gap-2 sm:gap-4 border-b border-sky-200/80 dark:border-sky-800/60 pb-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveMainTab('items')}
          className={`pb-2.5 px-3 text-xs sm:text-sm font-bold transition-all relative flex items-center gap-2 whitespace-nowrap ${
            activeMainTab === 'items'
              ? 'text-sky-600 dark:text-sky-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Cửa Hàng ({SHOP_ITEMS.length})</span>
          {activeMainTab === 'items' && (
            <div className="absolute bottom-0 inset-x-0 h-0.5 bg-sky-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveMainTab('inventory')}
          className={`pb-2.5 px-3 text-xs sm:text-sm font-bold transition-all relative flex items-center gap-2 whitespace-nowrap ${
            activeMainTab === 'inventory'
              ? 'text-pink-600 dark:text-pink-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Package className="w-4 h-4 text-pink-500" />
          <span>Kho Đồ Thỏ</span>
          {activeMainTab === 'inventory' && (
            <div className="absolute bottom-0 inset-x-0 h-0.5 bg-pink-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveMainTab('achievements')}
          className={`pb-2.5 px-3 text-xs sm:text-sm font-bold transition-all relative flex items-center gap-2 whitespace-nowrap ${
            activeMainTab === 'achievements'
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Thành Tựu & Huy Hiệu ({INITIAL_ACHIEVEMENTS.length})</span>
          {activeMainTab === 'achievements' && (
            <div className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveMainTab('history')}
          className={`pb-2.5 px-3 text-xs sm:text-sm font-bold transition-all relative flex items-center gap-2 whitespace-nowrap ${
            activeMainTab === 'history'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <History className="w-4 h-4 text-emerald-500" />
          <span>Lịch Sử Giao Dịch ({transactions.length})</span>
          {activeMainTab === 'history' && (
            <div className="absolute bottom-0 inset-x-0 h-0.5 bg-emerald-500 rounded-full" />
          )}
        </button>
      </div>

      {/* TAB 1: SẢN PHẨM CỬA HÀNG */}
      {activeMainTab === 'items' && (
        <div className="space-y-6">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'glass-panel text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 border border-sky-200/80 dark:border-sky-800/50'
              }`}
            >
              Tất Cả Sản Phẩm ({SHOP_ITEMS.length})
            </button>

            <button
              onClick={() => setSelectedCategory('premium_food')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                selectedCategory === 'premium_food'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'glass-panel text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 border border-sky-200/80 dark:border-sky-800/50'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Thức Ăn Cao Cấp</span>
            </button>

            <button
              onClick={() => setSelectedCategory('special_toy')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                selectedCategory === 'special_toy'
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'glass-panel text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 border border-sky-200/80 dark:border-sky-800/50'
              }`}
            >
              <Smile className="w-3.5 h-3.5" />
              <span>Đồ Chơi Đặc Biệt</span>
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredItems.map((item) => {
              const ownedCount = inventory[item.id] || 0;
              const canAfford = user.carrots >= item.priceCarrots;

              return (
                <div
                  key={item.id}
                  className="glass-panel rounded-2xl border border-sky-200/80 dark:border-sky-800/60 p-4 shadow-md flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-sky-400 dark:hover:border-sky-600 hover:shadow-lg relative overflow-hidden group"
                >
                  {/* Rarity & Category Tag */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                      {item.rarityTag}
                    </span>

                    {ownedCount > 0 && (
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5">
                        <Check className="w-3 h-3" />
                        <span>Có {ownedCount}</span>
                      </span>
                    )}
                  </div>

                  {/* Item Graphic & Title */}
                  <div className="text-center py-3">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-sky-50 dark:bg-slate-800/60 border border-sky-200/80 dark:border-sky-700/60 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mt-2.5">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Stat Boosts Pills */}
                  <div className="space-y-1.5 my-3 pt-2 border-t border-sky-100 dark:border-sky-900/50 text-[11px] font-medium">
                    {item.statBoost.hunger && (
                      <div className="flex items-center justify-between text-amber-800 dark:text-amber-400">
                        <span className="flex items-center gap-1">
                          <Utensils className="w-3 h-3" /> No bụng
                        </span>
                        <span className="font-bold">+{item.statBoost.hunger}%</span>
                      </div>
                    )}
                    {item.statBoost.happiness && (
                      <div className="flex items-center justify-between text-rose-700 dark:text-rose-400">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" /> Vui vẻ
                        </span>
                        <span className="font-bold">+{item.statBoost.happiness}%</span>
                      </div>
                    )}
                    {item.statBoost.hygiene && (
                      <div className="flex items-center justify-between text-sky-700 dark:text-sky-400">
                        <span className="flex items-center gap-1">
                          <span>🫧</span> Sạch sẽ
                        </span>
                        <span className="font-bold">+{item.statBoost.hygiene}%</span>
                      </div>
                    )}
                    {item.statBoost.expBonus && (
                      <div className="flex items-center justify-between text-indigo-700 dark:text-indigo-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Kinh nghiệm
                        </span>
                        <span className="font-bold">+{item.statBoost.expBonus} EXP</span>
                      </div>
                    )}
                  </div>

                  {/* Buy Action */}
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={!canAfford}
                    className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                      canAfford
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white hover:scale-[1.02] active:scale-[0.98]'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <span>{canAfford ? 'Mua với' : 'Cần'}</span>
                    <span className="flex items-center gap-0.5 font-mono text-sm">
                      {item.priceCarrots} 🥕
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: KHO ĐỒ */}
      {activeMainTab === 'inventory' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl glass-panel border border-pink-300/80 dark:border-pink-700/60">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-pink-500" />
              Túi Đồ Của Bé Thỏ
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Nơi lưu trữ tất cả vật phẩm chăm sóc và quà tặng bạn đã sắm cho các bé thỏ của mình.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Cà rốt */}
            <div className="glass-panel p-4 rounded-2xl border border-sky-200 dark:border-sky-800 flex flex-col items-center text-center shadow-sm">
              <span className="text-4xl mb-2 animate-bunny-hop inline-block">🥕</span>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Cà Rốt Tươi</div>
              <div className="text-lg font-black text-amber-600 dark:text-amber-400 mt-1">{user.carrots}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Vật phẩm cơ bản</div>
            </div>

            {/* Túi thức ăn */}
            <div className="glass-panel p-4 rounded-2xl border border-sky-200 dark:border-sky-800 flex flex-col items-center text-center shadow-sm">
              <span className="text-4xl mb-2 animate-bunny-hop inline-block">🌾</span>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Túi Thức Ăn</div>
              <div className="text-lg font-black text-sky-600 dark:text-sky-400 mt-1">{user.foodBags}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Dinh dưỡng dồi dào</div>
            </div>

            {/* Đồ chơi */}
            <div className="glass-panel p-4 rounded-2xl border border-sky-200 dark:border-sky-800 flex flex-col items-center text-center shadow-sm">
              <span className="text-4xl mb-2 animate-bunny-hop inline-block">🧸</span>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Đồ Chơi</div>
              <div className="text-lg font-black text-pink-600 dark:text-pink-400 mt-1">{user.toys}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Tăng độ vui vẻ</div>
            </div>

            {/* Shop items */}
            {SHOP_ITEMS.filter(item => (inventory[item.id] || 0) > 0).map(item => (
              <div key={item.id} className="glass-panel p-4 rounded-2xl border border-sky-200 dark:border-sky-800 flex flex-col items-center text-center shadow-sm group">
                <span className="text-4xl mb-2 group-hover:scale-110 transition-transform inline-block">{item.icon}</span>
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate w-full">{item.name}</div>
                <div className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-1">{inventory[item.id]}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-tighter font-bold">{item.rarityTag}</div>
              </div>
            ))}
          </div>

          {Object.keys(inventory).filter(id => (inventory[id] || 0) > 0).length === 0 && user.carrots === 0 && user.foodBags === 0 && user.toys === 0 && (
            <div className="py-20 text-center glass-panel rounded-3xl border-dashed border-sky-200 dark:border-sky-800">
              <Package className="w-12 h-12 mx-auto text-slate-300 mb-3 opacity-50" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">Túi đồ của bạn đang trống trơn...</p>
              <button onClick={() => setActiveMainTab('items')} className="mt-4 text-sky-600 font-bold text-sm hover:underline">Đi mua sắm ngay →</button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: HỆ THỐNG THÀNH TỰU & HUY HIỆU */}
      {activeMainTab === 'achievements' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl glass-panel border border-amber-300/80 dark:border-amber-700/60 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-amber-500" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Danh Hiệu & Huy Hiệu Profile
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Hoàn thành các điều kiện để nhận cà rốt và bấm "Đeo Huy Hiệu" để hiển thị danh hiệu uy tín bên cạnh tên của bạn trên toàn website!
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                Đã mở khóa: {unlocked.length} / {INITIAL_ACHIEVEMENTS.length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INITIAL_ACHIEVEMENTS.map((ach) => {
              const { current, target, completed } = getAchievementProgress(ach);
              const isClaimed = unlocked.includes(ach.id);
              const isEquipped = user.equippedBadge === ach.badge;
              const progressPct = Math.min(100, Math.round((current / target) * 100));

              return (
                <div
                  key={ach.id}
                  className={`p-5 rounded-2xl glass-panel border transition-all ${
                    isClaimed
                      ? 'border-amber-300/90 dark:border-amber-700/80 bg-amber-50/40 dark:bg-amber-950/20 shadow-sm'
                      : 'border-sky-200/80 dark:border-sky-800/60 opacity-90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-2xl shadow-xs shrink-0">
                        {ach.icon}
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                          {ach.title}
                          {isClaimed && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          )}
                        </h4>
                        <div className="text-xs font-medium text-amber-700 dark:text-amber-300">
                          Huy hiệu: <span className="font-bold">{ach.badge}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">
                        +{ach.rewardCarrots} 🥕
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5">
                    {ach.description}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      <span>Tiến độ: {ach.requirement}</span>
                      <span className="font-mono">
                        {current} / {target}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-sky-100 dark:border-sky-900/40 flex items-center justify-between gap-2">
                    {!isClaimed ? (
                      <button
                        onClick={() => handleClaimAchievement(ach)}
                        disabled={!completed}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          completed
                            ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs hover:scale-105 active:scale-95 animate-pulse'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {completed ? (
                          <>
                            <Trophy className="w-3.5 h-3.5" />
                            <span>Nhận Thưởng (+{ach.rewardCarrots} 🥕)</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>Chưa Đạt Yêu Cầu</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        <span>Đã nhận thưởng</span>
                      </div>
                    )}

                    {isClaimed && (
                      <button
                        onClick={() => handleToggleEquipBadge(ach.badge)}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                          isEquipped
                            ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                            : 'bg-white/80 dark:bg-slate-800/80 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {isEquipped ? '★ Đang Đeo Trên Profile' : 'Đeo Huy Hiệu'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: LỊCH SỬ GIAO DỊCH */}
      {activeMainTab === 'history' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl glass-panel border border-emerald-300/80 dark:border-emerald-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <History className="w-6 h-6 text-emerald-500" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Lịch Sử Mua Sắm Bằng Cà Rốt
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Xem lại tất cả các giao dịch thức ăn cao cấp và đồ chơi bạn đã sắm cho đàn thỏ.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-100/90 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                Đã tiêu dùng: <span className="font-extrabold">{totalCarrotsSpent} 🥕</span>
              </span>

              {transactions.length > 0 && (
                <button
                  onClick={handleClearTransactions}
                  className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors px-2 py-1"
                  title="Xóa lịch sử"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa lịch sử</span>
                </button>
              )}
            </div>
          </div>

          {transactions.length > 0 ? (
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-2xl glass-panel border border-sky-200/80 dark:border-sky-800/60 flex items-center justify-between gap-4 shadow-2xs hover:border-emerald-400 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-700 flex items-center justify-center text-2xl shadow-2xs shrink-0">
                      {tx.itemIcon}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        {tx.itemName}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {tx.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {tx.timestamp}
                        </span>
                        <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-semibold text-[10px]">
                          Hoàn tất
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs sm:text-sm font-extrabold text-rose-600 dark:text-rose-400">
                      -{tx.costCarrots} 🥕
                    </span>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      Đã vào túi đồ
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400 glass-panel rounded-2xl border border-sky-200/60">
              <ShoppingBag className="w-8 h-8 mx-auto text-slate-400 mb-2 opacity-50" />
              <span>Chưa có giao dịch mua sắm nào gần đây. Hãy chọn mua các món ngon cho bé thỏ nhé!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
