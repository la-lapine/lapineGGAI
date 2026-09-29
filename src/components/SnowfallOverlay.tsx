import React, { useEffect, useRef } from 'react';

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speed: number;
  wind: number;
  opacity: number;
  sway: number;
  swaySpeed: number;
  isStar: boolean;
}

export const SnowfallOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const snowflakeCount = Math.floor(Math.min(width, 1400) / 18);
    const snowflakes: Snowflake[] = [];

    for (let i = 0; i < snowflakeCount; i++) {
      snowflakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.8,
        speed: Math.random() * 0.7 + 0.4,
        wind: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.55 + 0.25,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.02 + 0.008,
        isStar: Math.random() < 0.18, // some particles are sparkling 4-point stars
      });
    }

    const drawStar = (cx: number, cy: number, r: number, opacity: number) => {
      ctx.save();
      ctx.fillStyle = `rgba(224, 242, 254, ${opacity})`;
      ctx.beginPath();
      ctx.moveTo(cx, cy - r * 1.5);
      ctx.quadraticCurveTo(cx, cy, cx + r * 1.5, cy);
      ctx.quadraticCurveTo(cx, cy, cx, cy + r * 1.5);
      ctx.quadraticCurveTo(cx, cy, cx - r * 1.5, cy);
      ctx.quadraticCurveTo(cx, cy, cx, cy - r * 1.5);
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < snowflakes.length; i++) {
        const flake = snowflakes[i];
        flake.sway += flake.swaySpeed;
        flake.y += flake.speed;
        flake.x += flake.wind + Math.sin(flake.sway) * 0.45;

        // Wrap around bottom
        if (flake.y > height + 10) {
          flake.y = -10;
          flake.x = Math.random() * width;
        }

        // Wrap around sides
        if (flake.x > width + 10) {
          flake.x = -10;
        } else if (flake.x < -10) {
          flake.x = width + 10;
        }

        if (flake.isStar) {
          drawStar(flake.x, flake.y, flake.radius * 1.2, flake.opacity);
        } else {
          ctx.beginPath();
          ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(240, 249, 255, ${flake.opacity})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(186, 230, 253, 0.4)';
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 select-none"
      aria-hidden="true"
    />
  );
};
