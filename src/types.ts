export type BunnyStage = 'baby' | 'juvenile' | 'adult';
export type BunnyEarType = 'upright' | 'lop' | 'fluffy';
export type BunnyPattern = 'solid' | 'spotted' | 'dutch' | 'starry' | 'cotton_candy';
export type BunnyWearable =
  | 'crown'          // Vương miện hoàng gia
  | 'party_hat'      // Mũ sinh nhật vui vẻ
  | 'pink_bow'       // Nơ hồng xinh xắn
  | 'cool_glasses'   // Kính râm cực ngầu
  | 'red_scarf'      // Khăn quàng đỏ
  | 'angel_wings'    // Cánh thiên thần
  | 'hero_cape'      // Áo choàng siêu nhân
  | 'bell_collar'    // Vòng cổ chuông vàng
  | 'straw_hat'      // Mũ rơm dã ngoại
  | 'wizard_hat'     // Mũ phù thủy
  | 'sailor_suit'    // Áo thủy thủ xinh xắn
  | 'kimono'         // Kimono hoa đào
  | 'overalls'       // Quần yếm cà rốt
  | 'cozy_sweater'   // Áo len giáng sinh
  | 'detective_coat'; // Áo măng tô thám tử

export interface FloatingEmote {
  id: string;
  text: string;
  icon?: string;
  timestamp: number;
}

export interface Bunny {
  id: string;
  name: string;
  colorName: string;
  furColor: string; // CSS color
  accentColor: string;
  rarity: 'standard' | 'hybrid' | 'rare' | 'celestial';
  stage?: BunnyStage; // 'baby' (em bé), 'juvenile' (vừa), 'adult' (trưởng thành)
  earType?: BunnyEarType;
  pattern?: BunnyPattern;
  equippedWearables?: BunnyWearable[]; // Trang phục & Phụ kiện gắn trên người pet
  hunger: number; // 0 - 100
  happiness: number; // 0 - 100
  hygiene: number; // 0 - 100
  level: number; // 1, 2, 3...
  exp: number; // 0 - maxExp
  maxExp: number; // e.g. 100
  x: number; // 5 - 90 %
  y: number; // 10 - 85 %
  dx: number;
  dy: number;
  isOwner: boolean;
  ownerName: string;
  state: 'idle' | 'eating' | 'bathing' | 'happy' | 'hopping' | 'running' | 'jumping' | 'petted' | 'interacting' | 'loving' | 'sleeping' | 'sniffing' | 'grooming';
  personality: string;
  currentEmote?: FloatingEmote | null;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  priceCarrots: number;
  category: 'premium_food' | 'special_toy';
  statBoost: {
    hunger?: number;
    happiness?: number;
    hygiene?: number;
    expBonus?: number;
  };
  rarityTag: string;
}

export interface HutchThemeItem {
  id: string;
  name: string;
  description: string;
  priceCarrots: number;
  bgGradientLight: string;
  bgGradientDark: string;
  accentColor: string;
  borderColor: string;
  pattern: 'hearts' | 'stars' | 'plaid' | 'wood' | 'dots' | 'floral' | 'tatami' | 'ice' | 'candy' | 'pastoral';
  wallpaperTexture?: string; // rich pixel wallpaper illustration URL or SVG style
  sceneryType?: 'sakura_garden' | 'nordic_cabin' | 'matcha_tea' | 'galaxy_observatory' | 'sunset_farm' | 'daisy_greenhouse' | 'candy_wonderland' | 'crystal_palace';
}

export interface HutchDecorItem {
  id: string;
  name: string;
  description: string;
  priceCarrots: number;
  type: 'flower' | 'rug' | 'cloud_lamp' | 'mushroom' | 'fairy_lights' | 'bookshelf' | 'carrot_bed' | 'cat_tree' | 'water_bowl' | 'moon_lantern' | 'wooden_castle' | 'tea_set';
  slot: 'top_roof' | 'left_wall' | 'right_wall' | 'floor_center' | 'floor_left' | 'floor_right';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  carrots: number;
  foodBags: number;
  toys: number;
  inventoryItems?: Record<string, number>; // item_id -> quantity
  rabbits: Bunny[];
  equippedBadge?: string; // e.g. "👑 Bậc Thầy Nuôi Thỏ"
  unlockedAchievements?: string[]; // list of achievement ids
  hutchTheme?: string;
  unlockedThemes?: string[];
  equippedDecors?: string[];
  unlockedDecors?: string[];
  registeredAt: string;
  lastLoginDate: string;
  interactionsToday?: number;
  lastInteractionDate?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge: string;
  requirement: string;
  targetCount: number;
  rewardCarrots: number;
}

export interface BunnyCareLog {
  id: string;
  bunnyName: string;
  action: 'feed' | 'bathe' | 'pet';
  message: string;
  timestamp: string;
}

export interface TopicComment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
  likes: number;
}

export interface CommunityTopic {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorAvatar?: string;
  category: 'feedback' | 'character_idea' | 'rabbit_care' | 'general';
  likes: number;
  comments: TopicComment[];
  createdAt: string;
  pinned?: boolean;
}

export interface CharacterBot {
  id: string;
  name: string;
  subtitle: string;
  avatar: string;
  tags: string[];
  description: string;
  plot: string;
  firstMessage: string;
  personality: string;
  voiceHint: string;
  likes: number;
  chatCount: number;
  category?: 'mup_sua' | 'ky_tich' | 'mat_trang';
  isLinkLocked?: boolean; // Thỏ Mặt Trăng: Khóa link, chỉ cho phép xem thông tin, plot, first message
  externalChatUrl?: string;
  createdAt?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  read: boolean;
  priority: 'normal' | 'important' | 'event';
}

export interface AudioTrack {
  id: string | number;
  title: string;
  artist: string;
  duration?: number; // in seconds
  description?: string;
  bpm?: number;
  scale?: string;
  audioUrl?: string;
}

export interface EggDrop {
  id: string;
  x: number;
  y: number;
  parentNames: [string, string];
  createdAt: number;
  variant?: number;
}

export type RewardTier =
  | { type: 'hybrid_bunny'; name: string; bunny: Bunny }
  | { type: 'standard_bunny'; name: string; bunny: Bunny }
  | { type: 'items_100'; name: string; food: number; carrots: number; toys: number }
  | { type: 'items_50'; name: string; food: number; carrots: number; toys: number }
  | { type: 'items_25'; name: string; food: number; carrots: number; toys: number }
  | { type: 'items_15'; name: string; food: number; carrots: number; toys: number };

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  category: 'bathe' | 'feed' | 'pet' | 'play_toy' | 'meadow_visit' | 'chat_bot' | 'crack_egg';
  icon: string;
  targetCount: number;
  currentCount: number;
  completed: boolean;
  claimed: boolean;
  reward: {
    carrots: number;
    foodBags?: number;
    toys?: number;
    specialItemName?: string;
    specialItemId?: string;
  };
}

