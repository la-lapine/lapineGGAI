import React from 'react';

interface ThemePixelRoomProps {
  themeId: string;
  className?: string;
}

export const ThemePixelRoom: React.FC<ThemePixelRoomProps> = ({
  themeId,
  className = '',
}) => {
  // Select authentic pixel room artwork background image per theme
  const getBackgroundImage = () => {
    switch (themeId) {
      case 'theme_sakura':
      case 'theme_daisy':
      case 'theme_candy':
        return '/src/assets/images/pixel_home_pastel_1790622475023.jpg';
      case 'theme_midnight':
      case 'theme_crystal_palace':
        return '/src/assets/images/pixel_home_dark_1790622502810.jpg';
      case 'theme_matcha':
        return '/src/assets/images/hutch_pixel_room_1790620160646.jpg';
      case 'theme_cozy_wood':
      case 'theme_sunset':
      default:
        return '/src/assets/images/pixel_hutch_interior_1790622488842.jpg';
    }
  };

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      style={{ imageRendering: 'pixelated' }}
    >
      {/* 1. Base Authentic 16-Bit Pixel Art Room Backdrop Image */}
      <img
        src={getBackgroundImage()}
        alt="Room Pixel Background"
        referrerPolicy="no-referrer"
        style={{ imageRendering: 'pixelated' }}
        className="w-full h-full object-cover transition-opacity duration-700 opacity-90 dark:opacity-85"
      />

      {/* 2. Theme Specific Atmospheric Lighting & Pixel Graphic Overlays */}
      <svg
        viewBox="0 0 320 200"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full object-cover z-10"
        shapeRendering="crispEdges"
      >
        {/* ================= 1. THEME SAKURA (Vườn Hoa Anh Đào) ================= */}
        {themeId === 'theme_sakura' && (
          <g>
            {/* Soft Pink Sakura Vignette */}
            <rect x="0" y="0" width="320" height="200" fill="#f472b6" opacity="0.15" />

            {/* Shoji Paper Lattice Side Panels */}
            <g opacity="0.4">
              <rect x="8" y="8" width="50" height="110" fill="#ffffff" rx="2" />
              <rect x="8" y="8" width="50" height="110" fill="none" stroke="#be185d" strokeWidth="2" />
              <line x1="33" y1="8" x2="33" y2="118" stroke="#be185d" strokeWidth="1.5" />
              <line x1="8" y1="40" x2="58" y2="40" stroke="#be185d" strokeWidth="1.5" />
              <line x1="8" y1="75" x2="58" y2="75" stroke="#be185d" strokeWidth="1.5" />

              <rect x="262" y="8" width="50" height="110" fill="#ffffff" rx="2" />
              <rect x="262" y="8" width="50" height="110" fill="none" stroke="#be185d" strokeWidth="2" />
              <line x1="287" y1="8" x2="287" y2="118" stroke="#be185d" strokeWidth="1.5" />
              <line x1="262" y1="40" x2="312" y2="40" stroke="#be185d" strokeWidth="1.5" />
              <line x1="262" y1="75" x2="312" y2="75" stroke="#be185d" strokeWidth="1.5" />
            </g>

            {/* Floating Sakura Petals Accent Pixels */}
            <rect x="110" y="45" width="4" height="4" fill="#f472b6" className="animate-pulse" />
            <rect x="145" y="70" width="5" height="5" fill="#fb7185" />
            <rect x="190" y="35" width="4" height="4" fill="#f472b6" className="animate-pulse" />
            <rect x="220" y="80" width="6" height="4" fill="#fce7f3" />
            <rect x="80" y="90" width="5" height="5" fill="#f472b6" />
          </g>
        )}

        {/* ================= 2. THEME COZY WOOD (Nhà Gỗ Lò Sưởi) ================= */}
        {themeId === 'theme_cozy_wood' && (
          <g>
            {/* Warm Fireplace Warmth Tint */}
            <rect x="0" y="0" width="320" height="200" fill="#78350f" opacity="0.12" />

            {/* Glowing Fireplace Embers Accent */}
            <circle cx="270" cy="110" r="18" fill="#f97316" opacity="0.25" className="animate-pulse" />
            <circle cx="270" cy="110" r="10" fill="#facc15" opacity="0.3" />

            {/* Flying Fire Sparks */}
            <rect x="265" y="95" width="2" height="2" fill="#fef08a" className="animate-ping" />
            <rect x="278" y="98" width="2" height="2" fill="#f97316" />
            <rect x="260" y="102" width="2" height="2" fill="#fef08a" />
          </g>
        )}

        {/* ================= 3. THEME MATCHA (Trà Xanh Zen) ================= */}
        {themeId === 'theme_matcha' && (
          <g>
            {/* Zen Matcha Green Atmosphere */}
            <rect x="0" y="0" width="320" height="200" fill="#15803d" opacity="0.1" />

            {/* Bamboo Blind Top Trim */}
            <rect x="0" y="0" width="320" height="18" fill="#a16207" opacity="0.8" />
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={i} x1="0" y1={i * 2 + 2} x2="320" y2={i * 2 + 2} stroke="#fef08a" strokeWidth="1" opacity="0.5" />
            ))}

            {/* Steaming Tea Cup Icon Accent */}
            <g opacity="0.85">
              <rect x="280" y="125" width="16" height="12" rx="2" fill="#15803d" />
              <path d="M284,122 Q286,116 284,112 M288,122 Q290,116 288,112" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.7" className="animate-pulse" />
            </g>
          </g>
        )}

        {/* ================= 4. THEME MIDNIGHT (Cung Điện Tinh Tú) ================= */}
        {themeId === 'theme_midnight' && (
          <g>
            {/* Deep Cosmic Starlight Tint */}
            <rect x="0" y="0" width="320" height="200" fill="#0369a1" opacity="0.15" />

            {/* Observatory Glass Arch Lines */}
            <path d="M 40,0 Q 160,80 280,0" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.5" />
            <line x1="160" y1="0" x2="160" y2="40" stroke="#38bdf8" strokeWidth="1.5" opacity="0.5" />

            {/* Twinkling Shooting Stars */}
            <circle cx="80" cy="30" r="2" fill="#fef08a" className="animate-ping" />
            <circle cx="220" cy="20" r="2.5" fill="#ffffff" className="animate-ping" />
            <circle cx="150" cy="45" r="1.5" fill="#38bdf8" />
            <circle cx="280" cy="35" r="2" fill="#fef08a" />
          </g>
        )}

        {/* ================= 5. THEME SUNSET (Hoàng Hôn Trang Trại) ================= */}
        {themeId === 'theme_sunset' && (
          <g>
            {/* Golden Sunset Glow Gradient Overlay */}
            <rect x="0" y="0" width="320" height="200" fill="#c2410c" opacity="0.18" />
            <circle cx="160" cy="50" r="35" fill="#fde047" opacity="0.25" />

            {/* Warm Dust Particles in Sunset Ray */}
            <circle cx="120" cy="60" r="1.5" fill="#fef08a" className="animate-pulse" />
            <circle cx="180" cy="75" r="2" fill="#fdba74" />
            <circle cx="210" cy="45" r="1.5" fill="#fef08a" className="animate-pulse" />
          </g>
        )}

        {/* ================= 6. THEME DAISY (Vườn Cúc Dại) ================= */}
        {themeId === 'theme_daisy' && (
          <g>
            {/* Botanical Greenhouse Tint */}
            <rect x="0" y="0" width="320" height="200" fill="#16a34a" opacity="0.1" />

            {/* Daisy Flower Pixel Accents */}
            <g opacity="0.85">
              {/* Daisy 1 */}
              <circle cx="15" cy="25" r="5" fill="#ffffff" />
              <circle cx="15" cy="25" r="2.5" fill="#facc15" />

              {/* Daisy 2 */}
              <circle cx="305" cy="25" r="5" fill="#ffffff" />
              <circle cx="305" cy="25" r="2.5" fill="#facc15" />

              {/* Vine Leaves */}
              <path d="M0,0 Q15,15 30,0" fill="none" stroke="#22c55e" strokeWidth="2" />
              <path d="M290,0 Q305,15 320,0" fill="none" stroke="#22c55e" strokeWidth="2" />
            </g>
          </g>
        )}

        {/* ================= 7. THEME CANDY (Vương Quốc Kẹo Bông) ================= */}
        {themeId === 'theme_candy' && (
          <g>
            {/* Sweet Strawberry Pink Glow */}
            <rect x="0" y="0" width="320" height="200" fill="#ec4899" opacity="0.12" />

            {/* Candy Cane Stripe Pillars Left & Right */}
            <g opacity="0.7">
              <rect x="0" y="0" width="10" height="200" fill="#f43f5e" />
              {Array.from({ length: 10 }).map((_, i) => (
                <rect key={i} x="0" y={i * 20} width="10" height="8" fill="#ffffff" />
              ))}

              <rect x="310" y="0" width="10" height="200" fill="#f43f5e" />
              {Array.from({ length: 10 }).map((_, i) => (
                <rect key={i} x="310" y={i * 20} width="10" height="8" fill="#ffffff" />
              ))}
            </g>
          </g>
        )}

        {/* ================= 8. THEME CRYSTAL PALACE (Cung Điện Pha Lê) ================= */}
        {themeId === 'theme_crystal_palace' && (
          <g>
            {/* Glowing Icy Blue Atmosphere */}
            <rect x="0" y="0" width="320" height="200" fill="#0284c7" opacity="0.18" />

            {/* Crystal Chandelier at Top Center */}
            <g opacity="0.85">
              <polygon points="160,0 150,25 170,25" fill="#38bdf8" />
              <polygon points="160,25 145,50 175,50" fill="#7dd3fc" />
              <polygon points="160,50 155,65 165,65" fill="#bae6fd" />
              <circle cx="135" cy="35" r="2" fill="#ffffff" className="animate-ping" />
              <circle cx="185" cy="35" r="2" fill="#ffffff" className="animate-ping" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
