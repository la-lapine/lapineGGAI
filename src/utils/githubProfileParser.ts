import { CharacterBot } from '../types';
import FALLBACK_PROFILES from '../data/fallback_profiles.json';

/**
 * Default GitHub Raw .txt URL for fetching public profiles directly
 */
export const GITHUB_PROFILES_TXT_URL =
  'https://raw.githubusercontent.com/octocat/Spoon-Knife/main/README.md';

/**
 * Parses raw text content fetched from a GitHub .txt file into an array of CharacterBot profiles.
 */
export function parseGithubTxtProfiles(rawText: string): CharacterBot[] {
  const trimmed = rawText.trim();
  if (!trimmed) return [];

  // Attempt 1: Standard JSON Array or Object
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      const list = Array.isArray(parsed) ? parsed : [parsed];
      return list.map((item, idx) => sanitizeBot(item, idx));
    } catch {
      // Fall through to text block parser
    }
  }

  // Attempt 2: Key-Value text block format separated by --- or [PROFILE]
  // Token efficient for users to paste or host.
  const blocks = trimmed
    .split(/\n\s*---\s*\n|\n\s*\[PROFILE\]\s*\n/i)
    .filter((b) => b.trim().length > 0);

  const results: CharacterBot[] = [];

  blocks.forEach((block, idx) => {
    const lines = block.split('\n');
    const botPartial: Partial<CharacterBot> = {
      id: `github-bot-${Date.now()}-${idx}`,
      tags: [],
      likes: Math.floor(Math.random() * 500) + 1200,
      chatCount: Math.floor(Math.random() * 2000) + 3500,
    };

    lines.forEach((line) => {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) return;

      const key = line.slice(0, colonIndex).trim().toLowerCase();
      const value = line.slice(colonIndex + 1).trim();

      if (!value) return;

      switch (key) {
        case 'name':
        case 'tên':
          botPartial.name = value;
          break;
        case 'subtitle':
        case 'danh xưng':
        case 'tiêu đề':
          botPartial.subtitle = value;
          break;
        case 'avatar':
        case 'hình ảnh':
        case 'ảnh':
          botPartial.avatar = value;
          break;
        case 'tags':
        case 'thẻ':
          botPartial.tags = value.split(',').map((t) => t.trim()).filter(Boolean);
          break;
        case 'description':
        case 'mô tả':
          botPartial.description = value;
          break;
        case 'plot':
        case 'cốt truyện':
          botPartial.plot = value;
          break;
        case 'firstmessage':
        case 'câu mở đầu':
        case 'lời chào':
          botPartial.firstMessage = value;
          break;
        case 'personality':
        case 'tính cách':
          botPartial.personality = value;
          break;
        case 'voicehint':
        case 'giọng nói':
          botPartial.voiceHint = value;
          break;
        case 'category':
        case 'mục':
          if (['mup_sua', 'ky_tich', 'mat_trang'].includes(value)) {
            botPartial.category = value as any;
          }
          break;
        case 'islinklocked':
        case 'khóa link':
          botPartial.isLinkLocked = value === 'true' || value === '1' || value === 'yes';
          break;
      }
    });

    if (botPartial.name) {
      results.push(sanitizeBot(botPartial, idx));
    }
  });

  return results;
}

/**
 * Automatically fetches and loads public profiles from GitHub raw .txt
 */
export async function fetchPublicProfilesFromGithub(
  customUrl?: string
): Promise<CharacterBot[]> {
  const urlToFetch = customUrl || GITHUB_PROFILES_TXT_URL;
  try {
    const res = await fetch(urlToFetch, { cache: 'no-cache' });
    if (res.ok) {
      const text = await res.text();
      const parsed = parseGithubTxtProfiles(text);
      if (parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore error and fall back to local JSON
  }

  // Fallback to embedded profiles from JSON file
  return (FALLBACK_PROFILES as any[]).map((item, idx) => sanitizeBot(item, idx));
}

function sanitizeBot(item: any, idx: number): CharacterBot {
  // Determine category based on item or assign evenly
  const category =
    item.category ||
    (idx % 3 === 0 ? 'mup_sua' : idx % 3 === 1 ? 'ky_tich' : 'mat_trang');

  const isLinkLocked =
    typeof item.isLinkLocked === 'boolean'
      ? item.isLinkLocked
      : category === 'mat_trang';

  return {
    id: item.id || `bot-gh-${Date.now()}-${idx}`,
    name: item.name || `Profile ${idx + 1}`,
    subtitle: item.subtitle || 'Public Profile Thỏ',
    avatar: item.avatar || '/src/assets/images/bot_avatar_astral_1790619389515.jpg',
    tags: Array.isArray(item.tags)
      ? item.tags
      : typeof item.tags === 'string'
      ? item.tags.split(',').map((t: string) => t.trim())
      : ['Fantasy', 'Cozy'],
    description: item.description || 'Public profile được tải từ mã nguồn.',
    plot: item.plot || 'Cốt truyện nhân vật.',
    firstMessage: item.firstMessage || 'Xin chào! Rất vui được gặp bạn.',
    personality: item.personality || 'Thân thiện, hóm hỉnh.',
    voiceHint: item.voiceHint || 'Giọng nói tự nhiên.',
    likes: typeof item.likes === 'number' ? item.likes : 1500,
    chatCount: typeof item.chatCount === 'number' ? item.chatCount : 4500,
    category,
    isLinkLocked,
    externalChatUrl: item.externalChatUrl || '',
  };
}
