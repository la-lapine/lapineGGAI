import React, { useMemo } from 'react';
import { WeatherType } from '../utils/weatherEngine';

interface WeatherOverlayProps {
  weather: WeatherType;
  className?: string;
}

export const WeatherOverlay: React.FC<WeatherOverlayProps> = ({ weather, className = '' }) => {
  // Fireflies particles for evening/night
  const fireflies = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      left: `${(i * 7 + 5) % 95}%`,
      top: `${(i * 13 + 8) % 85}%`,
      size: 4 + (i % 3) * 2,
      duration: 3.5 + (i % 4) * 1.2,
      delay: (i * 0.45) % 3,
      glowColor: i % 2 === 0 ? '#a3e635' : '#38bdf8',
    }));
  }, []);

  // Morning mist particles
  const mistClouds = useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      top: `${15 + i * 18}%`,
      duration: 16 + i * 5,
      delay: i * 2.5,
      opacity: 0.18 + (i % 2) * 0.1,
    }));
  }, []);

  // Rain drops
  const rainDrops = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: `${(i * 4.2 + 2) % 98}%`,
      duration: 0.65 + (i % 3) * 0.15,
      delay: (i * 0.08) % 1.2,
      length: 14 + (i % 4) * 6,
    }));
  }, []);

  // Sun petals / pollen
  const petals = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      left: `${(i * 10 + 3) % 94}%`,
      duration: 7 + (i % 4) * 1.5,
      delay: i * 0.7,
      size: 8 + (i % 3) * 3,
    }));
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-10 select-none ${className}`}>
      {/* 1. MORNING MIST */}
      {weather === 'morning_mist' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-sky-200/25 via-teal-100/10 to-transparent" />
          {mistClouds.map((cloud) => (
            <div
              key={cloud.id}
              className="absolute left-0 right-0 h-16 bg-gradient-to-r from-transparent via-white/35 to-transparent blur-md animate-mist-flow"
              style={{
                top: cloud.top,
                animationDuration: `${cloud.duration}s`,
                animationDelay: `${cloud.delay}s`,
                opacity: cloud.opacity,
              }}
            />
          ))}
          {/* Subtle morning light rays */}
          <div className="absolute -top-20 -left-10 w-96 h-96 bg-gradient-to-br from-amber-200/20 via-sky-100/10 to-transparent rounded-full blur-2xl transform rotate-12" />
        </>
      )}

      {/* 2. SUNNY DAY WITH FLOATING PETALS / POLLEN */}
      {weather === 'sunny_day' && (
        <>
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-300/15 via-sky-300/10 to-transparent rounded-full blur-3xl" />
          {petals.map((petal) => (
            <div
              key={petal.id}
              className="absolute animate-float-petal opacity-70"
              style={{
                left: petal.left,
                top: '-20px',
                animationDuration: `${petal.duration}s`,
                animationDelay: `${petal.delay}s`,
              }}
            >
              <div
                className="rounded-full bg-gradient-to-tr from-yellow-300/80 to-amber-200/90 shadow-2xs transform rotate-45"
                style={{
                  width: `${petal.size}px`,
                  height: `${petal.size * 0.75}px`,
                }}
              />
            </div>
          ))}
        </>
      )}

      {/* 3. SUNSET GLOW */}
      {weather === 'sunset_glow' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/15 via-rose-400/10 to-sky-500/10" />
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-orange-400/20 via-amber-300/10 to-transparent blur-sm" />
          {/* Warm dust motes */}
          {fireflies.slice(0, 8).map((mote) => (
            <div
              key={mote.id}
              className="absolute rounded-full bg-amber-300/80 shadow-xs animate-firefly-glow"
              style={{
                left: mote.left,
                top: mote.top,
                width: `${mote.size}px`,
                height: `${mote.size}px`,
                animationDuration: `${mote.duration}s`,
                animationDelay: `${mote.delay}s`,
                boxShadow: '0 0 10px rgba(251, 191, 36, 0.7)',
              }}
            />
          ))}
        </>
      )}

      {/* 4. EVENING FIREFLIES (Đom Đóm Đêm) */}
      {weather === 'evening_fireflies' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-sky-950/10 to-transparent" />
          {fireflies.map((ff) => (
            <div
              key={ff.id}
              className="absolute rounded-full animate-firefly-glow"
              style={{
                left: ff.left,
                top: ff.top,
                width: `${ff.size}px`,
                height: `${ff.size}px`,
                backgroundColor: ff.glowColor,
                animationDuration: `${ff.duration}s`,
                animationDelay: `${ff.delay}s`,
                boxShadow: `0 0 12px ${ff.glowColor}, 0 0 20px ${ff.glowColor}`,
              }}
            />
          ))}
        </>
      )}

      {/* 5. SPRING RAIN */}
      {weather === 'spring_rain' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/15 via-sky-800/10 to-transparent" />
          {rainDrops.map((drop) => (
            <div
              key={drop.id}
              className="absolute bg-gradient-to-b from-sky-200/80 to-cyan-400/40 w-[1.5px] rounded-full animate-rain-drop"
              style={{
                left: drop.left,
                height: `${drop.length}px`,
                animationDuration: `${drop.duration}s`,
                animationDelay: `${drop.delay}s`,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};
