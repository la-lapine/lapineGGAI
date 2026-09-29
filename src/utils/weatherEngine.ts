export type WeatherType = 'morning_mist' | 'sunny_day' | 'sunset_glow' | 'evening_fireflies' | 'spring_rain';

export interface WeatherInfo {
  type: WeatherType;
  name: string;
  icon: string;
  description: string;
  ambientClassLight: string;
  ambientClassDark: string;
}

export const WEATHER_CONFIGS: Record<WeatherType, WeatherInfo> = {
  morning_mist: {
    type: 'morning_mist',
    name: 'Sương Mai Sớm',
    icon: '🌫️',
    description: 'Làn sương sớm bồng bềnh và những tia nắng bình minh dịu mát',
    ambientClassLight: 'from-sky-100/40 via-teal-50/20 to-indigo-100/30',
    ambientClassDark: 'from-slate-900/40 via-cyan-950/20 to-slate-900/30',
  },
  sunny_day: {
    type: 'sunny_day',
    name: 'Nắng Ban Ngày',
    icon: '☀️',
    description: 'Ánh nắng chan hòa rực rỡ bên những cánh hoa cúc bay bay',
    ambientClassLight: 'from-sky-100/30 via-amber-50/15 to-blue-50/20',
    ambientClassDark: 'from-sky-950/30 via-slate-900/20 to-slate-900/30',
  },
  sunset_glow: {
    type: 'sunset_glow',
    name: 'Hoàng Hôn Rực Rỡ',
    icon: '🌅',
    description: 'Ánh ráng chiều hổ phách êm đềm và làn gió chiều ấm áp',
    ambientClassLight: 'from-orange-100/35 via-amber-50/25 to-rose-50/20',
    ambientClassDark: 'from-amber-950/40 via-rose-950/20 to-slate-900/40',
  },
  evening_fireflies: {
    type: 'evening_fireflies',
    name: 'Đom Đóm Đêm Trăng',
    icon: '✨',
    description: 'Bầy đom đóm dạ quang lấp lánh bay lượn trong đêm thanh bình',
    ambientClassLight: 'from-indigo-100/40 via-sky-50/20 to-blue-100/30',
    ambientClassDark: 'from-indigo-950/50 via-slate-900/40 to-sky-950/50',
  },
  spring_rain: {
    type: 'spring_rain',
    name: 'Mưa Rào Dịu Êm',
    icon: '🌧️',
    description: 'Cơn mưa rào xuân tươi mát tưới xanh thảm cỏ đồng quê',
    ambientClassLight: 'from-cyan-100/45 via-sky-50/30 to-blue-100/40',
    ambientClassDark: 'from-cyan-950/50 via-slate-900/40 to-blue-950/50',
  },
};

/**
 * Computes current weather based on real-world local hour (0-23)
 */
export function getCurrentTimeWeather(): WeatherType {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 9) {
    return 'morning_mist';
  } else if (hour >= 9 && hour < 17) {
    return 'sunny_day';
  } else if (hour >= 17 && hour < 20) {
    return 'sunset_glow';
  } else {
    return 'evening_fireflies';
  }
}
