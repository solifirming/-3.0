/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

// 1. Photo 1: Chapter 22 Pixel Poster
export function Photo1Chapter22() {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full object-cover select-none">
      <defs>
        <linearGradient id="p1-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFA6C9" />
          <stop offset="50%" stopColor="#FFF3B0" />
          <stop offset="100%" stopColor="#B3F6D4" />
        </linearGradient>
        <linearGradient id="p1-text" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF280" />
          <stop offset="100%" stopColor="#FF6B97" />
        </linearGradient>
        <filter id="p1-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="1" floodColor="#9C27B0" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Background */}
      <rect width="400" height="400" fill="url(#p1-bg)" />

      {/* Confetti & Sparkles */}
      <g fill="#FFF" opacity="0.8">
        <circle cx="50" cy="50" r="3" />
        <circle cx="350" cy="60" r="4" />
        <circle cx="80" cy="120" r="2" />
        <circle cx="320" cy="140" r="3" />
        <circle cx="40" cy="280" r="3" />
        <circle cx="360" cy="290" r="2" />
      </g>
      <g fill="#FF4081">
        <rect x="70" y="40" width="6" height="6" rx="1" transform="rotate(15 70 40)" />
        <rect x="310" y="80" width="8" height="8" rx="1" transform="rotate(-20 310 80)" />
        <rect x="40" y="180" width="7" height="7" rx="1" transform="rotate(30 40 180)" />
        <rect x="340" y="220" width="6" height="6" rx="1" transform="rotate(-15 340 220)" />
      </g>

      {/* Balloons */}
      {/* Left Yellow Balloon */}
      <g transform="translate(60, 160)">
        <path d="M 0 -25 C -20 -25, -25 0, 0 20 C 25 0, 20 -25, 0 -25 Z" fill="#FFD54F" stroke="#F57F17" strokeWidth="2" />
        <circle cx="-6" cy="-10" r="4" fill="#FFF" opacity="0.6" />
        <path d="M 0 20 L -5 35 Q 0 45 5 60" fill="none" stroke="#F57F17" strokeWidth="2" strokeDasharray="3 2" />
      </g>
      {/* Right Pink Balloon */}
      <g transform="translate(340, 170)">
        <path d="M 0 -25 C -20 -25, -25 0, 0 20 C 25 0, 20 -25, 0 -25 Z" fill="#FF6090" stroke="#C2185B" strokeWidth="2" />
        <circle cx="-6" cy="-10" r="4" fill="#FFF" opacity="0.6" />
        <path d="M 0 20 L 5 35 Q 0 45 -5 60" fill="none" stroke="#C2185B" strokeWidth="2" strokeDasharray="3 2" />
      </g>

      {/* Title Text "Chapter 22" */}
      <g textAnchor="middle" filter="url(#p1-shadow)">
        <text x="200" y="115" fontFamily="'Courier New', monospace, sans-serif" fontWeight="900" fontSize="42" fill="none" stroke="#5D1049" strokeWidth="8" strokeLinejoin="round">
          Chapter 22
        </text>
        <text x="200" y="115" fontFamily="'Courier New', monospace, sans-serif" fontWeight="900" fontSize="42" fill="url(#p1-text)">
          Chapter 22
        </text>
      </g>

      {/* Gift Boxes */}
      {/* Left Gift Box */}
      <g transform="translate(100, 235)">
        <rect x="-22" y="-15" width="44" height="35" fill="#FF80AB" stroke="#C2185B" strokeWidth="2" />
        <rect x="-25" y="-22" width="50" height="10" fill="#FF4081" stroke="#C2185B" strokeWidth="2" />
        {/* Ribbon */}
        <rect x="-5" y="-22" width="10" height="42" fill="#B3E5FC" />
        <path d="M -12 -28 C -15 -38, -2 -35, -2 -22 Z" fill="#81D4FA" stroke="#0288D1" strokeWidth="1.5" />
        <path d="M 12 -28 C 15 -38, 2 -35, 2 -22 Z" fill="#81D4FA" stroke="#0288D1" strokeWidth="1.5" />
      </g>
      {/* Right Gift Box */}
      <g transform="translate(300, 240)">
        <rect x="-22" y="-15" width="44" height="35" fill="#FF80AB" stroke="#C2185B" strokeWidth="2" />
        <rect x="-25" y="-22" width="50" height="10" fill="#FF4081" stroke="#C2185B" strokeWidth="2" />
        {/* Ribbon */}
        <rect x="-5" y="-22" width="10" height="42" fill="#FFF59D" />
        <path d="M -12 -28 C -15 -38, -2 -35, -2 -22 Z" fill="#FFEE58" stroke="#FBC02D" strokeWidth="1.5" />
        <path d="M 12 -28 C 15 -38, 2 -35, 2 -22 Z" fill="#FFEE58" stroke="#FBC02D" strokeWidth="1.5" />
      </g>

      {/* Birthday Cake */}
      <g transform="translate(200, 255)">
        {/* Cake Stand / Plate */}
        <ellipse cx="0" cy="32" rx="70" ry="12" fill="#FFF" stroke="#E0E0E0" strokeWidth="3" />
        
        {/* Bottom Tier */}
        <rect x="-50" y="0" width="100" height="30" fill="#FFF" stroke="#D81B60" strokeWidth="2" rx="2" />
        <path d="M -50 0 Q -37 10 -25 0 Q -12 10 0 0 Q 12 10 25 0 Q 37 10 50 0 L 50 12 L -50 12 Z" fill="#FF80AB" />
        {/* Cherry dots on bottom tier */}
        <circle cx="-35" cy="20" r="3" fill="#E91E63" />
        <circle cx="-15" cy="20" r="3" fill="#E91E63" />
        <circle cx="5" cy="20" r="3" fill="#E91E63" />
        <circle cx="25" cy="20" r="3" fill="#E91E63" />

        {/* Top Tier */}
        <rect x="-35" y="-25" width="70" height="26" fill="#FFF" stroke="#D81B60" strokeWidth="2" rx="2" />
        <path d="M -35 -25 Q -23 -17 -12 -25 Q 0 -17 12 -25 Q 23 -17 35 -25 L 35 -15 L -35 -15 Z" fill="#FF80AB" />

        {/* Candles */}
        {/* Candle 1 */}
        <g transform="translate(-18, -25)">
          <rect x="-3" y="-18" width="6" height="18" fill="#FFF" stroke="#E91E63" strokeWidth="1" />
          <path d="M -3 -12 L 3 -10 M -3 -6 L 3 -4" stroke="#FF4081" strokeWidth="1.5" />
          <line x1="0" y1="-18" x2="0" y2="-22" stroke="#333" strokeWidth="1" />
          {/* Flame */}
          <path d="M 0 -22 C -4 -26, 0 -32, 0 -32 C 0 -32, 4 -26, 0 -22 Z" fill="#FFC107" />
          <circle cx="0" cy="-25" r="1.5" fill="#FF5722" />
        </g>
        {/* Candle 2 (Center) */}
        <g transform="translate(0, -25)">
          <rect x="-3" y="-22" width="6" height="22" fill="#FFF" stroke="#9C27B0" strokeWidth="1" />
          <path d="M -3 -16 L 3 -14 M -3 -8 L 3 -6" stroke="#AB47BC" strokeWidth="1.5" />
          <line x1="0" y1="-22" x2="0" y2="-26" stroke="#333" strokeWidth="1" />
          {/* Flame */}
          <path d="M 0 -26 C -4 -30, 0 -36, 0 -36 C 0 -36, 4 -30, 0 -26 Z" fill="#FFC107" />
          <circle cx="0" cy="-29" r="1.5" fill="#FF5722" />
        </g>
        {/* Candle 3 */}
        <g transform="translate(18, -25)">
          <rect x="-3" y="-18" width="6" height="18" fill="#FFF" stroke="#E91E63" strokeWidth="1" />
          <path d="M -3 -12 L 3 -10 M -3 -6 L 3 -4" stroke="#FF4081" strokeWidth="1.5" />
          <line x1="0" y1="-18" x2="0" y2="-22" stroke="#333" strokeWidth="1" />
          {/* Flame */}
          <path d="M 0 -22 C -4 -26, 0 -32, 0 -32 C 0 -32, 4 -26, 0 -22 Z" fill="#FFC107" />
          <circle cx="0" cy="-25" r="1.5" fill="#FF5722" />
        </g>
      </g>

      {/* Banner at bottom "Happy Birthday" */}
      <g transform="translate(200, 335)">
        {/* Banner Tails */}
        <path d="M -130 5 L -150 -10 L -130 -25 L -110 -25 L -110 5 Z" fill="#FF4081" stroke="#880E4F" strokeWidth="2" />
        <path d="M 130 5 L 150 -10 L 130 -25 L 110 -25 L 110 5 Z" fill="#FF4081" stroke="#880E4F" strokeWidth="2" />

        {/* Main Banner */}
        <rect x="-115" y="-28" width="230" height="34" fill="#FFE082" stroke="#880E4F" strokeWidth="2" rx="4" />
        <text x="0" y="-5" fontFamily="'Courier New', monospace, sans-serif" fontWeight="bold" fontSize="20" fill="#880E4F" textAnchor="middle" letterSpacing="1">
          Happy Birthday
        </text>
      </g>
    </svg>
  );
}

// 2. Photo 2: Snow Girl (飘雪微醺 ❄️)
export function Photo2SnowGirl() {
  return (
    <svg viewBox="0 0 400 520" className="w-full h-full object-cover select-none">
      <defs>
        <linearGradient id="p2-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2A2F45" />
          <stop offset="60%" stopColor="#4A5270" />
          <stop offset="100%" stopColor="#7B83A0" />
        </linearGradient>
        <linearGradient id="p2-coat" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF8F6" />
          <stop offset="100%" stopColor="#E0D7D5" />
        </linearGradient>
      </defs>

      {/* Night Winter Background */}
      <rect width="400" height="520" fill="url(#p2-bg)" />

      {/* Ground snow blur */}
      <ellipse cx="200" cy="500" rx="250" ry="80" fill="#E2E8F0" opacity="0.4" />

      {/* Background People / City lights bokeh */}
      <g opacity="0.3">
        <circle cx="60" cy="80" r="25" fill="#FDE047" />
        <circle cx="340" cy="100" r="35" fill="#FDE047" />
        <rect x="20" y="70" width="30" height="60" fill="#FF80AB" rx="10" />
        <rect x="330" y="60" width="40" height="80" fill="#81D4FA" rx="10" />
      </g>

      {/* Main Girl Illustration (High Angle View) */}
      {/* Down Coat Body */}
      <path d="M 90 330 C 90 280, 130 250, 200 250 C 270 250, 310 280, 310 330 L 340 520 L 60 520 Z" fill="url(#p2-coat)" />
      
      {/* Coat Zipper / Folds */}
      <path d="M 200 280 L 200 520" stroke="#CBD5E1" strokeWidth="3" strokeDasharray="6 4" />

      {/* Green Plaid Scarf */}
      {/* Scarf Loop Around Neck */}
      <path d="M 120 220 C 120 190, 280 190, 280 220 C 280 270, 120 270, 120 220 Z" fill="#3B6E4A" stroke="#1E3A25" strokeWidth="2" />
      {/* Scarf Patterns (Checkered Lines) */}
      <path d="M 140 200 Q 200 260 260 200 M 150 220 Q 200 270 250 220" stroke="#86EFAC" strokeWidth="4" opacity="0.7" fill="none" />
      <path d="M 170 200 L 170 260 M 230 200 L 230 260" stroke="#14532D" strokeWidth="4" opacity="0.8" fill="none" />

      {/* Scarf Hanging Tail */}
      <path d="M 170 240 L 195 420 L 245 410 L 220 240 Z" fill="#3B6E4A" stroke="#1E3A25" strokeWidth="2" />
      <path d="M 180 260 L 200 415 M 210 260 L 225 412" stroke="#86EFAC" strokeWidth="3" opacity="0.7" />

      {/* Head & Face */}
      {/* Hair Back */}
      <path d="M 110 130 C 100 220, 110 300, 130 330 C 270 330, 290 220, 290 130 C 290 60, 110 60, 110 130 Z" fill="#1A1821" />

      {/* Face Skin */}
      <path d="M 135 130 C 135 220, 265 220, 265 130 C 265 90, 135 90, 135 130 Z" fill="#FFF2EC" />

      {/* Rosy Cheeks */}
      <ellipse cx="160" cy="165" rx="16" ry="10" fill="#FF80AB" opacity="0.45" />
      <ellipse cx="240" cy="165" rx="16" ry="10" fill="#FF80AB" opacity="0.45" />

      {/* Smiling Closed Eyes (^ ^) */}
      <path d="M 155 145 Q 170 132 185 145" fill="none" stroke="#2D1520" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 215 145 Q 230 132 245 145" fill="none" stroke="#2D1520" strokeWidth="3.5" strokeLinecap="round" />

      {/* Sweet Lip Smile */}
      <path d="M 185 178 Q 200 192 215 178" fill="#E11D48" stroke="#9F1239" strokeWidth="1.5" />

      {/* Hair Bangs & Front Strands */}
      <path d="M 115 120 C 140 150, 165 130, 185 100 C 195 140, 225 140, 285 120 C 270 80, 130 70, 115 120 Z" fill="#262230" />
      {/* Side hair strands framing face */}
      <path d="M 125 110 C 120 180, 135 240, 150 270" stroke="#1A1821" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M 275 110 C 280 180, 265 240, 250 270" stroke="#1A1821" strokeWidth="12" strokeLinecap="round" fill="none" />

      {/* Hands holding pink phone / plush item */}
      <g transform="translate(260, 360)">
        {/* Hand */}
        <path d="M -20 20 C -10 0, 10 -10, 20 10 C 25 25, 10 35, -10 30 Z" fill="#FFE4D6" />
        {/* Cute Pink Keychains / Plush */}
        <circle cx="15" cy="30" r="12" fill="#FFB6C1" />
        <circle cx="28" cy="40" r="10" fill="#FFC0CB" />
      </g>

      {/* Falling Snowflakes Overlay */}
      <g fill="#FFF">
        <circle cx="150" cy="90" r="4" opacity="0.9" />
        <circle cx="170" cy="115" r="5" opacity="0.95" /> {/* Snowflake on hair! */}
        <circle cx="230" cy="100" r="3" opacity="0.9" />
        <circle cx="250" cy="120" r="4" opacity="0.9" /> {/* Snowflake on hair! */}
        <circle cx="130" cy="160" r="3" />
        <circle cx="270" cy="170" r="3.5" />
        <circle cx="190" cy="210" r="4" opacity="0.9" />
        <circle cx="80" cy="220" r="5" />
        <circle cx="320" cy="250" r="4" />
        <circle cx="110" cy="340" r="6" opacity="0.8" />
        <circle cx="290" cy="370" r="5" opacity="0.8" />
        <circle cx="200" cy="450" r="4" opacity="0.8" />
        <circle cx="50" cy="420" r="5" opacity="0.8" />
        <circle cx="350" cy="460" r="4" opacity="0.8" />
      </g>
    </svg>
  );
}

// 3. Photo 3: Bookstore Girl (静谧书香 📚)
export function Photo3BookstoreGirl() {
  return (
    <svg viewBox="0 0 400 520" className="w-full h-full object-cover select-none">
      <defs>
        <linearGradient id="p3-bg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3E2723" />
          <stop offset="100%" stopColor="#5D4037" />
        </linearGradient>
        <linearGradient id="p3-warm-light" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE082" opacity="0.3" />
          <stop offset="100%" stopColor="#3E2723" opacity="0" />
        </linearGradient>
      </defs>

      {/* Bookstore Interior Background */}
      <rect width="400" height="520" fill="url(#p3-bg)" />

      {/* Bookshelf Grids in Background */}
      <g stroke="#2C1B18" strokeWidth="4">
        {/* Horizontal Shelves */}
        <line x1="80" y1="90" x2="400" y2="90" />
        <line x1="80" y1="180" x2="400" y2="180" />
        <line x1="80" y1="270" x2="400" y2="270" />
        <line x1="80" y1="360" x2="400" y2="360" />
        {/* Vertical Dividers */}
        <line x1="180" y1="0" x2="180" y2="360" />
        <line x1="280" y1="0" x2="280" y2="360" />
      </g>

      {/* Books Spines on Shelves */}
      {/* Row 1 Books */}
      <g>
        <rect x="90" y="20" width="12" height="68" fill="#E53935" />
        <rect x="103" y="15" width="15" height="73" fill="#1E88E5" />
        <rect x="119" y="25" width="10" height="63" fill="#FDD835" />
        <rect x="130" y="10" width="18" height="78" fill="#43A047" />
        <rect x="149" y="22" width="14" height="66" fill="#8E24AA" />

        <rect x="190" y="110" width="16" height="68" fill="#FB8C00" />
        <rect x="207" y="105" width="12" height="73" fill="#00ACC1" />
        <rect x="220" y="115" width="20" height="63" fill="#D81B60" />

        <rect x="290" y="200" width="15" height="68" fill="#3949AB" />
        <rect x="306" y="195" width="18" height="73" fill="#7CB342" />
        <rect x="325" y="205" width="14" height="63" fill="#F4511E" />
      </g>

      {/* Warm Ambient Lamp Lighting Overlay */}
      <rect width="400" height="520" fill="url(#p3-warm-light)" pointerEvents="none" />

      {/* Main Girl Side Profile */}
      {/* Hair Back */}
      <path d="M 210 50 C 130 90, 160 300, 240 520 L 400 520 L 400 50 Z" fill="#1A1821" />

      {/* Side Face Profile */}
      <path d="M 270 120 C 260 145, 260 160, 268 175 C 272 182, 265 190, 275 195 C 285 200, 295 215, 305 220 L 350 200 C 330 140, 310 100, 270 120 Z" fill="#FFF0E6" />

      {/* Eye looking down at book */}
      <path d="M 272 155 Q 278 160 282 154" stroke="#2D1520" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Eyelash */}
      <line x1="270" y1="154" x2="274" y2="152" stroke="#2D1520" strokeWidth="1.5" />

      {/* Lips */}
      <path d="M 268 185 Q 273 187 270 190" stroke="#C2185B" strokeWidth="2" fill="none" />

      {/* Hair Bangs & Hair Accessory */}
      <path d="M 240 60 C 210 120, 250 180, 270 130 C 290 80, 260 50, 240 60 Z" fill="#262230" />
      {/* Flower Hair Clip */}
      <circle cx="340" cy="100" r="12" fill="#FF80AB" />
      <circle cx="340" cy="100" r="5" fill="#FFF59D" />

      {/* Green Plaid Scarf */}
      <path d="M 220 220 C 200 250, 310 320, 350 250 C 370 220, 250 190, 220 220 Z" fill="#3B6E4A" stroke="#1E3A25" strokeWidth="2" />
      <path d="M 230 240 Q 280 280 330 240" stroke="#86EFAC" strokeWidth="4" opacity="0.8" fill="none" />

      {/* Opened Art Book Held in Hands */}
      <g transform="translate(10, 220) rotate(-15)">
        {/* Book Cover Back */}
        <path d="M 20 180 L 170 100 L 320 185 L 165 260 Z" fill="#1565C0" stroke="#0D47A1" strokeWidth="3" />

        {/* Opened White Pages */}
        <path d="M 30 175 L 165 105 L 165 245 L 30 175 Z" fill="#FFFDE7" stroke="#E0E0E0" strokeWidth="1" />
        <path d="M 165 105 L 310 180 L 165 245 Z" fill="#FFFDE7" stroke="#E0E0E0" strokeWidth="1" />

        {/* Painting on Left Page (Van Gogh Landscape Style) */}
        <g transform="translate(50, 130) scale(0.8)">
          <rect width="110" height="90" fill="#E0F7FA" stroke="#00838F" strokeWidth="1" />
          {/* Yellow Swirling Sky */}
          <path d="M 0 20 Q 50 0 110 30 L 110 0 L 0 0 Z" fill="#FFF176" />
          <path d="M 20 10 C 40 -5, 70 25, 90 10" fill="none" stroke="#FBC02D" strokeWidth="3" />
          {/* Blue Hills */}
          <path d="M 0 60 Q 60 30 110 50 L 110 90 L 0 90 Z" fill="#1976D2" />
          {/* Green Cypress Tree */}
          <path d="M 20 90 C 10 50, 30 30, 35 90 Z" fill="#2E7D32" />
        </g>
      </g>
    </svg>
  );
}

// 4. Photo 4: Strawberry Cake Girl (草莓甜心 🍰)
export function Photo4StrawberryGirl() {
  return (
    <svg viewBox="0 0 400 520" className="w-full h-full object-cover select-none">
      <defs>
        <linearGradient id="p4-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
      </defs>

      {/* Interior Room Background */}
      <rect width="400" height="520" fill="url(#p4-bg)" />

      {/* Table in foreground */}
      <path d="M 0 380 L 400 340 L 400 520 L 0 520 Z" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />

      {/* Flower Bouquet on right side of table */}
      <g transform="translate(320, 260)">
        {/* Bouquet Wrapping Paper */}
        <path d="M -40 120 L 30 120 L 50 -40 L -60 -40 Z" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
        {/* Ribbon Bow */}
        <path d="M -15 40 C -30 20, -5 10, -5 40 Z" fill="#FFF" />
        <path d="M 5 40 C 20 20, -5 10, -5 40 Z" fill="#FFF" />
        {/* White Roses in bouquet */}
        <circle cx="-20" cy="-50" r="18" fill="#FFF" stroke="#E2E8F0" strokeWidth="2" />
        <circle cx="10" cy="-60" r="22" fill="#FFF" stroke="#E2E8F0" strokeWidth="2" />
        <circle cx="-10" cy="-80" r="16" fill="#FFF" stroke="#E2E8F0" strokeWidth="2" />
      </g>

      {/* Main Girl Illustration */}
      {/* Black Strap Dress Body */}
      <path d="M 120 300 L 150 250 L 250 250 L 280 300 L 310 520 L 90 520 Z" fill="#18181B" />
      {/* Spaghetti Straps */}
      <line x1="165" y1="250" x2="160" y2="200" stroke="#18181B" strokeWidth="3" />
      <line x1="235" y1="250" x2="240" y2="200" stroke="#18181B" strokeWidth="3" />

      {/* Neck & Shoulders */}
      <path d="M 160 200 L 170 170 C 170 170, 200 180, 230 170 L 240 200 Z" fill="#FFF0E6" />
      {/* Collarbone details */}
      <path d="M 175 210 Q 195 218 200 215 M 205 215 Q 210 218 225 210" stroke="#E4A88C" strokeWidth="2" fill="none" opacity="0.6" />

      {/* Hair Back */}
      <path d="M 110 100 C 100 200, 110 260, 140 300 C 260 300, 290 200, 290 100 C 290 30, 110 30, 110 100 Z" fill="#1A1821" />

      {/* Head & Face Skin */}
      <path d="M 140 100 C 140 190, 260 190, 260 100 C 260 60, 140 60, 140 100 Z" fill="#FFF0E6" />

      {/* Left Eye: Winking! (>) */}
      <path d="M 160 115 L 180 123 L 160 131" fill="none" stroke="#2D1520" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Right Eye: Open with pupil looking forward */}
      <ellipse cx="230" cy="123" rx="10" ry="12" fill="#2D1520" />
      <circle cx="227" cy="119" r="4" fill="#FFF" />

      {/* Cheeks */}
      <ellipse cx="165" cy="138" rx="12" ry="8" fill="#FF80AB" opacity="0.4" />
      <ellipse cx="235" cy="138" rx="12" ry="8" fill="#FF80AB" opacity="0.4" />

      {/* Cute Smile */}
      <path d="M 185 152 Q 200 165 215 152" stroke="#E11D48" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Hair Bangs */}
      <path d="M 130 90 C 160 120, 180 110, 200 80 C 220 110, 240 120, 270 90 C 250 50, 150 50, 130 90 Z" fill="#262230" />

      {/* Left Arm Raised Holding Fork with Strawberry over Winking Eye */}
      <path d="M 110 320 C 80 240, 110 160, 145 135" stroke="#FFF0E6" strokeWidth="22" strokeLinecap="round" fill="none" />
      {/* Hand */}
      <circle cx="148" cy="130" r="12" fill="#FFF0E6" />

      {/* Fork */}
      <line x1="148" y1="130" x2="165" y2="125" stroke="#94A3B8" strokeWidth="3" />
      
      {/* Strawberry on Fork */}
      <g transform="translate(170, 122) rotate(20)">
        <path d="M 0 -12 C -12 -12, -15 5, 0 16 C 15 5, 12 -12, 0 -12 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
        {/* Green Leaf Stem */}
        <path d="M -6 -12 Q 0 -18 6 -12 L 0 -8 Z" fill="#22C55E" />
        {/* Seeds */}
        <circle cx="-4" cy="-2" r="1" fill="#FEF08A" />
        <circle cx="4" cy="-2" r="1" fill="#FEF08A" />
        <circle cx="0" cy="5" r="1" fill="#FEF08A" />
      </g>

      {/* Right Arm Holding Plate with Cake */}
      <path d="M 270 300 C 290 350, 260 390, 230 390" stroke="#FFF0E6" strokeWidth="22" strokeLinecap="round" fill="none" />
      <circle cx="225" cy="390" r="12" fill="#FFF0E6" />

      {/* Plate & Slice of Cake */}
      <g transform="translate(225, 395)">
        <ellipse cx="0" cy="10" rx="35" ry="10" fill="#FFF" stroke="#CBD5E1" strokeWidth="2" />
        {/* Triangular Slice of Cake */}
        <path d="M -20 5 L 0 -25 L 20 5 Z" fill="#FFF" stroke="#FF80AB" strokeWidth="1.5" />
        <path d="M -20 5 L 20 5 L 20 12 L -20 12 Z" fill="#FF80AB" />
        {/* Strawberry on top */}
        <circle cx="0" cy="-25" r="5" fill="#EF4444" />
      </g>
    </svg>
  );
}

// 5. Photo 5: Night Lights Girl (璀璨星光 ✨)
export function Photo5NightLightsGirl() {
  return (
    <svg viewBox="0 0 400 520" className="w-full h-full object-cover select-none">
      <defs>
        <linearGradient id="p5-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E1B4B" />
          <stop offset="50%" stopColor="#312E81" />
          <stop offset="100%" stopColor="#4338CA" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Dark Night City Background */}
      <rect width="400" height="520" fill="url(#p5-bg)" />

      {/* Glowing City Bokeh Orbs & Lights */}
      <g filter="url(#glow)" opacity="0.65">
        <circle cx="80" cy="90" r="28" fill="#FDE047" />
        <circle cx="120" cy="60" r="16" fill="#FF80AB" />
        <circle cx="320" cy="110" r="35" fill="#38BDF8" />
        <circle cx="280" cy="70" r="22" fill="#FDE047" />
        <circle cx="50" cy="220" r="40" fill="#F43F5E" opacity="0.4" />
        <circle cx="350" cy="240" r="30" fill="#A855F7" opacity="0.5" />
      </g>

      {/* Light Flares / Starbursts */}
      <g stroke="#FFF" strokeWidth="2" opacity="0.9" filter="url(#glow)">
        <line x1="80" y1="70" x2="80" y2="110" />
        <line x1="60" y1="90" x2="100" y2="90" />
        
        <line x1="280" y1="55" x2="280" y2="85" />
        <line x1="265" y1="70" x2="295" y2="70" />
      </g>

      {/* Main Girl Illustration */}
      {/* Pink Puffer Jacket Body */}
      <path d="M 80 320 C 80 260, 130 240, 200 240 C 270 240, 320 260, 320 320 L 350 520 L 50 520 Z" fill="#F472B6" />
      {/* Puffer Horizontal Stitching Lines */}
      <path d="M 85 360 Q 200 380 315 360 M 70 420 Q 200 440 330 420 M 60 480 Q 200 500 340 480" stroke="#DB2777" strokeWidth="4" fill="none" opacity="0.6" />

      {/* Green Scarf */}
      <path d="M 130 220 C 130 190, 270 190, 270 220 C 270 260, 130 260, 130 220 Z" fill="#15803D" />

      {/* Hair Back */}
      <path d="M 110 110 C 100 200, 110 260, 130 300 C 270 300, 290 200, 290 110 C 290 40, 110 40, 110 110 Z" fill="#1A1821" />

      {/* Face Skin */}
      <path d="M 140 110 C 140 195, 260 195, 260 110 C 260 70, 140 70, 140 110 Z" fill="#FFF0E6" />

      {/* Left Eye (Looking brightly) */}
      <ellipse cx="170" cy="130" rx="9" ry="11" fill="#2D1520" />
      <circle cx="167" cy="126" r="3.5" fill="#FFF" />

      {/* Right Eye: Framed by hand making OK sign! */}
      <ellipse cx="230" cy="130" rx="9" ry="11" fill="#2D1520" />
      <circle cx="227" cy="126" r="3.5" fill="#FFF" />

      {/* Cheeks */}
      <ellipse cx="165" cy="142" rx="12" ry="8" fill="#FF80AB" opacity="0.45" />
      <ellipse cx="235" cy="142" rx="12" ry="8" fill="#FF80AB" opacity="0.45" />

      {/* Sweet Smile */}
      <path d="M 185 158 Q 200 170 215 158" stroke="#E11D48" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Hair Bangs */}
      <path d="M 130 100 C 160 130, 180 120, 200 90 C 220 120, 240 130, 270 100 C 250 60, 150 60, 130 100 Z" fill="#262230" />

      {/* Arm & Hand Making OK Sign / Circle over Right Eye 👌 */}
      <g transform="translate(230, 130)">
        {/* Puffer Sleeve Foreground */}
        <path d="M -30 120 C 10 70, 30 30, 10 -10" stroke="#F472B6" strokeWidth="36" strokeLinecap="round" fill="none" />
        
        {/* Hand in front of face */}
        {/* Circle Finger (Thumb + Index touching) */}
        <circle cx="0" cy="0" r="18" fill="none" stroke="#FFF0E6" strokeWidth="12" />
        {/* Other 3 fingers raised upwards */}
        <path d="M 15 -10 L 25 -25 M 10 -18 L 18 -32 M 2 -20 L 8 -35" stroke="#FFF0E6" strokeWidth="8" strokeLinecap="round" />
      </g>
    </svg>
  );
}
