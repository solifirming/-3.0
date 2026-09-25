import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PixelBirthdayCakeProps {
  isLit: boolean;
  onBlowout: () => void;
  birthdayName?: string;
}

export const PixelBirthdayCake: React.FC<PixelBirthdayCakeProps> = ({
  isLit,
  onBlowout,
  birthdayName = '寿星'
}) => {
  return (
    <div 
      className="relative flex flex-col items-center select-none cursor-pointer group"
      onClick={onBlowout}
      title={isLit ? "点击吹熄蛋糕蜡烛许愿" : "蜡烛已吹熄"}
    >
      <svg
        viewBox="0 0 160 116"
        className="w-48 sm:w-56 h-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
        style={{ shapeRendering: 'crispEdges' }}
      >
        <defs>
          {/* Subtle glow filter for flame */}
          <filter id="pixel-flame-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#F7D070" floodOpacity="0.8" />
          </filter>
        </defs>

        {/* ================= 1. CAKE STAND / PEDESTAL ================= */}
        {/* Pedestal Bottom Base */}
        <rect x="52" y="110" width="56" height="4" fill="#5E3B85" stroke="#FFE8F5" strokeWidth="1" />
        <rect x="54" y="111" width="52" height="2" fill="#7B5EA7" />
        <rect x="54" y="110" width="52" height="1" fill="#C9A9E9" />

        {/* Pedestal Column */}
        <rect x="64" y="104" width="32" height="6" fill="#4B2C6E" />
        <rect x="66" y="104" width="28" height="6" fill="#6B4895" />
        <rect x="70" y="104" width="4" height="6" fill="#C9A9E9" opacity="0.6" />

        {/* Platter Top Plate */}
        <rect x="10" y="98" width="140" height="6" fill="#5E3B85" stroke="#FFE8F5" strokeWidth="1" />
        <rect x="12" y="99" width="136" height="4" fill="#7B5EA7" />
        <rect x="12" y="98" width="136" height="1" fill="#FFE8F5" />
        {/* Platter shine */}
        <rect x="20" y="99" width="24" height="1" fill="#FFF" />
        <rect x="50" y="99" width="12" height="1" fill="#FFF" />

        {/* ================= 2. CAKE BOTTOM TIER ================= */}
        {/* Bottom tier shadow on platter */}
        <rect x="22" y="97" width="116" height="2" fill="#3D1D5A" opacity="0.4" />

        {/* Bottom Tier Main Sponge (Strawberry Pink with shading) */}
        <rect x="20" y="68" width="120" height="30" fill="#FF8FA3" stroke="#FFE8F5" strokeWidth="1" />
        {/* Darker shadow on right and bottom */}
        <rect x="130" y="69" width="9" height="28" fill="#E86E85" />
        <rect x="21" y="93" width="118" height="4" fill="#E86E85" />

        {/* Bottom Tier Cream Filling Ribbon (Middle layer) */}
        <rect x="21" y="80" width="118" height="4" fill="#FFE8F5" />
        <rect x="21" y="81" width="118" height="2" fill="#FFFDF0" />

        {/* Bottom Tier Cream Frosting Drips (Top of Tier 2) */}
        <rect x="19" y="67" width="122" height="6" fill="#FFE8F5" />
        <rect x="20" y="66" width="120" height="2" fill="#FFFDF0" />
        {/* Scalloped dripping drops */}
        <rect x="26" y="73" width="6" height="4" fill="#FFE8F5" />
        <rect x="27" y="77" width="4" height="2" fill="#FFE8F5" />
        
        <rect x="42" y="73" width="8" height="3" fill="#FFE8F5" />
        
        <rect x="62" y="73" width="6" height="5" fill="#FFE8F5" />
        <rect x="63" y="78" width="4" height="2" fill="#FFE8F5" />
        
        <rect x="88" y="73" width="8" height="4" fill="#FFE8F5" />
        <rect x="89" y="77" width="6" height="2" fill="#FFE8F5" />
        
        <rect x="110" y="73" width="6" height="5" fill="#FFE8F5" />
        <rect x="111" y="78" width="4" height="2" fill="#FFE8F5" />

        <rect x="126" y="73" width="8" height="3" fill="#FFE8F5" />

        {/* Bottom Tier Piped Cream Rosettes at Base */}
        {[24, 38, 52, 66, 80, 94, 108, 122].map((x) => (
          <g key={`rosette-b-${x}`}>
            <rect x={x} y="92" width="8" height="5" fill="#FFE8F5" stroke="#FF8FA3" strokeWidth="0.5" />
            <rect x={x + 2} y="91" width="4" height="2" fill="#FFFDF0" />
            <rect x={x + 3} y="94" width="2" height="2" fill="#FF8FA3" />
          </g>
        ))}

        {/* Center Star / Heart Badge on Bottom Tier */}
        <g transform="translate(74, 82)">
          <rect x="0" y="2" width="12" height="8" fill="#F7D070" stroke="#FFE8F5" strokeWidth="0.8" />
          <rect x="2" y="0" width="8" height="12" fill="#F7D070" stroke="#FFE8F5" strokeWidth="0.8" />
          <rect x="4" y="4" width="4" height="4" fill="#FFF" />
        </g>

        {/* Colorful Sprinkles on Bottom Tier */}
        <rect x="32" y="86" width="3" height="2" fill="#F7D070" />
        <rect x="50" y="87" width="2" height="3" fill="#7BE3D5" />
        <rect x="68" y="88" width="3" height="2" fill="#A8D8EA" />
        <rect x="98" y="86" width="2" height="3" fill="#F7D070" />
        <rect x="118" y="87" width="3" height="2" fill="#7BE3D5" />

        {/* ================= 3. CAKE TOP TIER ================= */}
        {/* Top Tier Shadow on Tier 2 */}
        <rect x="42" y="66" width="76" height="3" fill="#D65B77" opacity="0.4" />

        {/* Top Tier Main Sponge */}
        <rect x="42" y="42" width="76" height="25" fill="#FF9EAA" stroke="#FFE8F5" strokeWidth="1" />
        {/* Darker shadow on right */}
        <rect x="110" y="43" width="7" height="23" fill="#E86E85" />
        <rect x="43" y="63" width="74" height="3" fill="#E86E85" />

        {/* Top Tier Cream Ribbon */}
        <rect x="43" y="52" width="74" height="3" fill="#FFE8F5" />
        <rect x="43" y="53" width="74" height="1" fill="#FFFDF0" />

        {/* Top Tier Cream Frosting Top & Drips */}
        <rect x="40" y="40" width="80" height="6" fill="#FFE8F5" />
        <rect x="41" y="39" width="78" height="2" fill="#FFFDF0" />
        {/* Drips */}
        <rect x="46" y="46" width="5" height="4" fill="#FFE8F5" />
        <rect x="47" y="50" width="3" height="2" fill="#FFE8F5" />

        <rect x="58" y="46" width="6" height="3" fill="#FFE8F5" />

        <rect x="76" y="46" width="6" height="5" fill="#FFE8F5" />
        <rect x="77" y="51" width="4" height="2" fill="#FFE8F5" />

        <rect x="94" y="46" width="6" height="4" fill="#FFE8F5" />
        <rect x="95" y="50" width="4" height="2" fill="#FFE8F5" />

        <rect x="108" y="46" width="5" height="3" fill="#FFE8F5" />

        {/* Piped Cream Rosettes at Base of Top Tier */}
        {[44, 56, 68, 80, 92, 104].map((x) => (
          <g key={`rosette-t-${x}`}>
            <rect x={x} y="64" width="7" height="4" fill="#FFE8F5" stroke="#FF8FA3" strokeWidth="0.5" />
            <rect x={x + 2} y="63" width="3" height="2" fill="#FFFDF0" />
          </g>
        ))}

        {/* Colorful Sprinkles on Top Tier */}
        <rect x="52" y="57" width="3" height="2" fill="#F7D070" />
        <rect x="68" y="58" width="2" height="3" fill="#7BE3D5" />
        <rect x="88" y="57" width="3" height="2" fill="#A8D8EA" />
        <rect x="102" y="58" width="2" height="2" fill="#FFF" />

        {/* ================= 4. CAKE TOPPING (STRAWBERRIES & CREAM) ================= */}
        {/* Left Strawberry */}
        <g transform="translate(56, 33)">
          {/* Green leaf/cap */}
          <rect x="3" y="0" width="6" height="2" fill="#48BB78" />
          <rect x="5" y="-1" width="2" height="2" fill="#38A169" />
          <rect x="1" y="1" width="2" height="2" fill="#48BB78" />
          <rect x="9" y="1" width="2" height="2" fill="#48BB78" />
          {/* Strawberry body */}
          <rect x="2" y="2" width="8" height="5" fill="#FF2E63" stroke="#FFE8F5" strokeWidth="0.5" />
          <rect x="3" y="7" width="6" height="2" fill="#FF2E63" />
          <rect x="4" y="9" width="4" height="1" fill="#FF2E63" />
          {/* Seeds and highlight */}
          <rect x="4" y="3" width="1" height="1" fill="#FFF" />
          <rect x="7" y="4" width="1" height="1" fill="#F7D070" />
          <rect x="5" y="6" width="1" height="1" fill="#F7D070" />
        </g>

        {/* Right Strawberry */}
        <g transform="translate(92, 33)">
          {/* Green leaf/cap */}
          <rect x="3" y="0" width="6" height="2" fill="#48BB78" />
          <rect x="5" y="-1" width="2" height="2" fill="#38A169" />
          <rect x="1" y="1" width="2" height="2" fill="#48BB78" />
          <rect x="9" y="1" width="2" height="2" fill="#48BB78" />
          {/* Strawberry body */}
          <rect x="2" y="2" width="8" height="5" fill="#FF2E63" stroke="#FFE8F5" strokeWidth="0.5" />
          <rect x="3" y="7" width="6" height="2" fill="#FF2E63" />
          <rect x="4" y="9" width="4" height="1" fill="#FF2E63" />
          {/* Seeds and highlight */}
          <rect x="4" y="3" width="1" height="1" fill="#FFF" />
          <rect x="7" y="4" width="1" height="1" fill="#F7D070" />
          <rect x="5" y="6" width="1" height="1" fill="#F7D070" />
        </g>

        {/* Whipped Cream Puffs on Top Rim */}
        <g transform="translate(42, 36)">
          <rect x="0" y="2" width="6" height="4" fill="#FFE8F5" />
          <rect x="1" y="0" width="4" height="3" fill="#FFFDF0" />
        </g>
        <g transform="translate(112, 36)">
          <rect x="0" y="2" width="6" height="4" fill="#FFE8F5" />
          <rect x="1" y="0" width="4" height="3" fill="#FFFDF0" />
        </g>

        {/* Whipped Cream Base around Candle */}
        <rect x="72" y="38" width="16" height="5" fill="#FFE8F5" stroke="#FF8FA3" strokeWidth="0.5" />
        <rect x="74" y="36" width="12" height="3" fill="#FFFDF0" />
        <rect x="76" y="35" width="8" height="2" fill="#FFF" />

        {/* ================= 5. CANDLE & WICK ================= */}
        {/* Candle Body (Inserted into cake) */}
        <g id="candle-stick">
          {/* Candle Outline/Body */}
          <rect x="76" y="20" width="8" height="18" fill="#FF8FA3" stroke="#FFE8F5" strokeWidth="1" />
          {/* Diagonal White/Cream Stripes */}
          <polygon points="76,22 84,20 84,23 76,25" fill="#FFE8F5" />
          <polygon points="76,28 84,26 84,29 76,31" fill="#FFE8F5" />
          <polygon points="76,34 84,32 84,35 76,37" fill="#FFE8F5" />
          {/* Candle Highlight */}
          <rect x="77" y="21" width="1" height="16" fill="#FFF" opacity="0.6" />
        </g>

        {/* Candle Wick */}
        <rect x="79" y="16" width="2" height="4" fill="#2E1B27" />

        {/* ================= 6. INTERACTIVE FLAME / SMOKE ================= */}
        {isLit ? (
          /* Glowing Pixel Flame with Lively Flicker Animation */
          <motion.g 
            id="candle-flame" 
            filter="url(#pixel-flame-glow)"
            animate={{ 
              scale: [1, 1.18, 0.95, 1.12, 1],
              y: [0, -1.5, 0.5, -1, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 1.1,
              ease: "easeInOut"
            }}
            style={{ transformOrigin: '80px 16px' }}
          >
            {/* Outer Flame (Golden Yellow) */}
            <path
              d="M 80 2 
                 L 86 8 
                 L 87 13 
                 L 84 16 
                 L 76 16 
                 L 73 13 
                 L 74 8 Z"
              fill="#F7D070"
              stroke="#FFE8F5"
              strokeWidth="1"
            />
            {/* Inner Flame Core (Bright Orange / Coral) */}
            <path
              d="M 80 6 
                 L 83 10 
                 L 83 14 
                 L 77 14 
                 L 77 10 Z"
              fill="#FF8A5B"
            />
            {/* Core White Spark */}
            <rect x="79" y="9" width="2" height="4" fill="#FFF" />
          </motion.g>
        ) : (
          /* Blown Out Smoke Particles Rising */
          <motion.g 
            id="smoke-particles"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: [0, 0.9, 0.7, 0], y: [-2, -8, -14, -20] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeOut" }}
            style={{ transformOrigin: '80px 14px' }}
          >
            {/* Smoke wisp 1 */}
            <rect x="79" y="12" width="3" height="3" fill="#D4C2E2" />
            <rect x="82" y="9" width="3" height="3" fill="#EADCF5" />
            {/* Smoke wisp 2 */}
            <rect x="76" y="6" width="4" height="3" fill="#D4C2E2" />
            <rect x="80" y="3" width="3" height="3" fill="#EADCF5" />
            {/* Smoke wisp 3 */}
            <rect x="78" y="0" width="2" height="2" fill="#FFE8F5" opacity="0.6" />
          </motion.g>
        )}
      </svg>

      {/* Floating Status / Action Cue */}
      <AnimatePresence>
        {!isLit && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-2 bg-[#FF8FA3] border-2 border-white px-2 py-0.5 text-[#24133c] text-[9px] font-pixel font-bold shadow-md animate-pixel-blink"
          >
            💨 烛火吹熄！愿望成真 ✨
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default PixelBirthdayCake;
