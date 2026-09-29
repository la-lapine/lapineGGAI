import { DailyQuest, User } from '../types';

const DAILY_QUESTS_STORAGE_KEY = 'lalapine_daily_quests_v1';
const QUESTS_LAST_DATE_KEY = 'lalapine_quests_date_v1';

export const INITIAL_DAILY_QUESTS: DailyQuest[] = [
  {
    id: 'quest_bathe_1',
    title: 'Tắm Rửa Bọt Thơm',
    description: 'Tắm cho bé thỏ 1 lần để giữ bộ lông sạch sẽ và thơm mát.',
    category: 'bathe',
    icon: '🫧',
    targetCount: 1,
    currentCount: 0,
    completed: false,
    claimed: false,
    reward: {
      carrots: 15,
      foodBags: 5,
    },
  },
  {
    id: 'quest_feed_2',
    title: 'Bữa Ăn Ngọt Ngào',
    description: 'Cho các bé thỏ ăn 2 lần bằng cà rốt hoặc cỏ tươi.',
    category: 'feed',
    icon: '🥕',
    targetCount: 2,
    currentCount: 0,
    completed: false,
    claimed: false,
    reward: {
      carrots: 20,
      specialItemName: 'Dâu Tây Mọng Nước 🍓',
      specialItemId: 'item-1',
    },
  },
  {
    id: 'quest_pet_2',
    title: 'Vuốt Ve Yêu Thương',
    description: 'Xoa đầu và nựng yêu các bé thỏ 2 lần.',
    category: 'pet',
    icon: '💕',
    targetCount: 2,
    currentCount: 0,
    completed: false,
    claimed: false,
    reward: {
      carrots: 15,
      toys: 5,
    },
  },
  {
    id: 'quest_meadow_1',
    title: 'Khám Phá Đồng Cỏ Rộng Lớn',
    description: 'Ghé thăm và dạo chơi tại Đồng Cỏ Thỏ Tự Do.',
    category: 'meadow_visit',
    icon: '🌿',
    targetCount: 1,
    currentCount: 0,
    completed: false,
    claimed: false,
    reward: {
      carrots: 25,
      specialItemName: 'Cỏ Bốn Lá May Mắn 🍀',
      specialItemId: 'item-2',
    },
  },
  {
    id: 'quest_chat_1',
    title: 'Trò Chuyện Cùng Trại Thỏ',
    description: 'Gửi ít nhất 1 tin nhắn tâm sự với bất kỳ bé thỏ AI nào.',
    category: 'chat_bot',
    icon: '💬',
    targetCount: 1,
    currentCount: 0,
    completed: false,
    claimed: false,
    reward: {
      carrots: 20,
      foodBags: 5,
    },
  },
  {
    id: 'quest_crack_egg_1',
    title: 'Đập Vỏ Trứng Kỳ Diệu',
    description: 'Tìm và đập vỡ 1 quả Trứng Rơi tại Cánh Đồng Thỏ.',
    category: 'crack_egg',
    icon: '🐣',
    targetCount: 1,
    currentCount: 0,
    completed: false,
    claimed: false,
    reward: {
      carrots: 30,
      specialItemName: 'Bánh Quy Ngôi Sao 🍪',
      specialItemId: 'item-4',
    },
  },
];

type QuestListener = (quests: DailyQuest[]) => void;

class DailyQuestManager {
  private quests: DailyQuest[] = [];
  private listeners: Set<QuestListener> = new Set();

  constructor() {
    this.init();
  }

  private getTodayString(): string {
    return new Date().toISOString().split('T')[0];
  }

  private init() {
    const today = this.getTodayString();
    const lastDate = localStorage.getItem(QUESTS_LAST_DATE_KEY);
    const saved = localStorage.getItem(DAILY_QUESTS_STORAGE_KEY);

    if (lastDate !== today || !saved) {
      // New day or first time: reset quests
      this.quests = JSON.parse(JSON.stringify(INITIAL_DAILY_QUESTS));
      localStorage.setItem(QUESTS_LAST_DATE_KEY, today);
      this.save();
    } else {
      try {
        const parsed = JSON.parse(saved);
        // Merge with initial templates in case new quests were added
        this.quests = INITIAL_DAILY_QUESTS.map((tpl) => {
          const found = parsed.find((p: DailyQuest) => p.id === tpl.id);
          return found || tpl;
        });
      } catch {
        this.quests = JSON.parse(JSON.stringify(INITIAL_DAILY_QUESTS));
        this.save();
      }
    }
  }

  private save() {
    try {
      localStorage.setItem(DAILY_QUESTS_STORAGE_KEY, JSON.stringify(this.quests));
    } catch {
      // ignore
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach((fn) => fn([...this.quests]));
  }

  public subscribe(listener: QuestListener): () => void {
    this.listeners.add(listener);
    listener([...this.quests]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getQuests(): DailyQuest[] {
    return [...this.quests];
  }

  public getUnclaimedCompletedCount(): number {
    return this.quests.filter((q) => q.completed && !q.claimed).length;
  }

  public progress(category: DailyQuest['category'], amount: number = 1): { completedNow: DailyQuest[] } {
    let changed = false;
    const completedNow: DailyQuest[] = [];

    this.quests = this.quests.map((q) => {
      if (q.category === category && !q.completed) {
        const nextCount = Math.min(q.targetCount, q.currentCount + amount);
        const isNowCompleted = nextCount >= q.targetCount;
        if (nextCount !== q.currentCount || isNowCompleted !== q.completed) {
          changed = true;
          if (isNowCompleted && !q.completed) {
            completedNow.push({ ...q, currentCount: nextCount, completed: true });
          }
          return {
            ...q,
            currentCount: nextCount,
            completed: isNowCompleted,
          };
        }
      }
      return q;
    });

    if (changed) {
      this.save();
    }

    return { completedNow };
  }

  public claim(questId: string, currentUser: User): { updatedUser: User; claimedQuest: DailyQuest } | null {
    const questIndex = this.quests.findIndex((q) => q.id === questId);
    if (questIndex === -1) return null;

    const quest = this.quests[questIndex];
    if (!quest.completed || quest.claimed) return null;

    this.quests[questIndex] = {
      ...quest,
      claimed: true,
    };
    this.save();

    // Grant rewards to user
    const reward = quest.reward;
    const nextInventory = { ...(currentUser.inventoryItems || {}) };
    if (reward.specialItemId) {
      nextInventory[reward.specialItemId] = (nextInventory[reward.specialItemId] || 0) + 1;
    }

    const updatedUser: User = {
      ...currentUser,
      carrots: currentUser.carrots + (reward.carrots || 0),
      foodBags: currentUser.foodBags + (reward.foodBags || 0),
      toys: currentUser.toys + (reward.toys || 0),
      inventoryItems: nextInventory,
    };

    return {
      updatedUser,
      claimedQuest: quest,
    };
  }
}

export const dailyQuestManager = new DailyQuestManager();
