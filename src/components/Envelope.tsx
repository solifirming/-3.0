/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface EnvelopeProps {
  onOpen: () => void;
}

export default function Envelope({ onOpen }: EnvelopeProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenClick = () => {
    setIsOpening(true);
    // Let the flap fold animation play before fading out the full envelope screen
    setTimeout(() => {
      onOpen();
    }, 1300);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full px-4 select-none z-10 overflow-hidden">
      
      {/* Retro Pixel Star cluster container for dynamic background shine */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-[280px] sm:w-80 h-64 sm:h-80 bg-gradient-to-tr from-[#F5C6EA]/10 to-[#7B5EA7]/20 rounded-none blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-48 sm:w-56 h-48 sm:h-56 bg-gradient-to-tr from-[#C9A9E9]/10 to-amber-500/10 rounded-none blur-2xl -z-10 pointer-events-none" />

      {/* Retro Pixel Birthday Cake & Balloon Corner Decorations */}
      <div className="absolute top-4 left-3 flex items-end gap-2 opacity-80 pointer-events-none sm:top-10 sm:left-14 sm:gap-3">
        {/* Pixel Balloon (Red & Yellow) */}
        <div className="flex flex-col items-center animate-balloon-1">
          <div className="w-5 h-6 sm:w-6 sm:h-7" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='14' viewBox='0 0 12 14'%3E%3Cpath d='M3 0h6v1H3zm-2 1h10v1H1zm-1 2h12v6H0zm1 6h10v1H1zm2 1h6v1H3zm2 1h2v1H5zm1 1v1h1v-1z' fill='%23FF8FA3'/%3E%3Cpath d='M2 3h2v1H2zm0 2h3v1H2z' fill='%23FFE8F5'/%3E%3C/svg%3E")`,
            imageRendering: 'pixelated',
            width: '18px',
            height: '21px'
          }} />
          <div className="w-0.5 h-4 sm:h-6 bg-[#C9A9E9]/60" />
        </div>
        {/* Pixel Cute Star Starlet */}
        <div className="flex flex-col items-center animate-pixel-wiggle pb-1">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-no-repeat bg-center" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath d='M3 0h2v1H3zm-1 1h4v1H2zm-2 2h8v2H0zm2 2h4v1H2zm1 1h2v1H3zm-1-4h1v1H2zm3 0h1v1H5z' fill='%23F7D070'/%3E%3C/svg%3E")`,
            imageRendering: 'pixelated',
            width: '16px',
            height: '16px'
          }} />
        </div>
      </div>

      <div className="absolute bottom-4 right-3 flex items-end gap-2 opacity-80 pointer-events-none sm:bottom-10 sm:right-14 sm:gap-3">
        {/* Pixel Cupcake / Sparkler */}
        <div className="flex flex-col items-center animate-pixel-bounce pb-1">
          <div className="w-5 h-5 sm:w-6 sm:h-6" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M4 0h4v1H4zm-1 1h6v1H3zm-2 2h10v3H1zm1 3h8v1H2zm-1 1h10v3H1z' fill='%23F5C6EA'/%3E%3Cpath d='M3 6h6v5H3z' fill='%23FFB7D5'/%3E%3Cpath d='M5 2h2v4H5z' fill='%23F7D070'/%3E%3Cpath d='M5 0h2v1H5z' fill='%23FFE8F5'/%3E%3C/svg%3E")`,
            imageRendering: 'pixelated',
            width: '18px',
            height: '18px'
          }} />
        </div>
        {/* Pixel Balloon (Minty Green) */}
        <div className="flex flex-col items-center animate-balloon-2">
          <div className="w-5 h-6 sm:w-6 sm:h-7" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='14' viewBox='0 0 12 14'%3E%3Cpath d='M3 0h6v1H3zm-2 1h10v1H1zm-1 2h12v6H0zm1 6h10v1H1zm2 1h6v1H3zm2 1h2v1H5zm1 1v1h1v-1z' fill='%23A1E3D8'/%3E%3Cpath d='M2 3h2v1H2zm0 2h3v1H2z' fill='%23FFE8F5'/%3E%3C/svg%3E")`,
            imageRendering: 'pixelated',
            width: '18px',
            height: '21px'
          }} />
          <div className="w-0.5 h-4 sm:h-6 bg-[#C9A9E9]/60" />
        </div>
      </div>

      {/* Greeting Title Card */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8 max-w-xs"
      >
        <div className="inline-block px-3 py-1 mb-3 text-[10px] tracking-widest text-[#F5C6EA] bg-[#7B5EA7]/40 border-2 border-[#C9A9E9]/40 rounded-none font-mono uppercase shadow-sm">
          LEVEL UP! +1 YEAR
        </div>
        
        {/* Pixel title with pink stroke glow */}
        <h1 className="text-2xl font-pixel font-bold tracking-wider text-[#FFE8F5] drop-shadow-pixel-glow uppercase mb-2">
          收到了神秘信件
        </h1>
        <p className="text-xs text-[#C9A9E9] font-pixel leading-relaxed px-4">
          你收到了一份来自像素星空的包裹，点按打开你的专属信笺
        </p>
      </motion.div>

      {/* Main Pixel-Art Envelope Component */}
      <motion.div
        animate={isOpening ? { scale: [1, 1.04, 0.9], opacity: [1, 1, 0] } : {}}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        whileTap={{ scale: 0.98 }}
        onClick={!isOpening ? handleOpenClick : undefined}
        className="relative w-full max-w-[320px] h-48 sm:h-52 bg-[#331c4f] pixel-border-retro rounded-none flex items-center justify-center cursor-pointer overflow-hidden group"
        style={{ borderColor: '#FFE8F5' }}
      >
        {/* Interior background paper texture */}
        <div className="absolute inset-1 bg-[#472a6b]" />

        {/* Diagonal folder lines using high-fidelity pixel blocks */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
          
          {/* Top Tri-flap flap fold */}
          <motion.div
            animate={isOpening ? { rotateX: 180, originY: '0%', opacity: 0 } : {}}
            transition={{ duration: 0.6, ease: 'easeIn' }}
            className="absolute top-0 left-0 w-full h-1/2 bg-[#52337a] border-b-4 border-[#FFE8F5]"
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
              zIndex: 3,
            }}
          />

          {/* Left Flap */}
          <div
            className="absolute top-0 left-0 w-1/2 h-full bg-[#3c225a] border-r-2 border-[#7B5EA7]/30"
            style={{
              clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)',
              zIndex: 1,
            }}
          />

          {/* Right Flap */}
          <div
            className="absolute top-0 right-0 w-1/2 h-full bg-[#3c225a] border-l-2 border-[#7B5EA7]/30"
            style={{
              clipPath: 'polygon(100% 0%, 0% 50%, 100% 100%)',
              zIndex: 1,
            }}
          />

          {/* Bottom Flap */}
          <div
            className="absolute bottom-0 left-0 w-full h-2/3 bg-[#422662] border-t-2 border-[#FFE8F5]/20"
            style={{
              clipPath: 'polygon(0% 100%, 100% 100%, 50% 0%)',
              zIndex: 2,
            }}
          />
        </div>

        {/* 8-Bit Wax Seal heart stamp in the absolute center */}
        <motion.div
          animate={isOpening ? { scale: [1, 1.25, 0], opacity: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative flex items-center justify-center w-14 h-14 bg-[#F7D070] border-4 border-[#FFE8F5] z-20 shadow-md group-hover:scale-105 transition-transform duration-200"
          style={{ 
            boxShadow: '0 4px 0 #7B5EA7, inset -2px -2px 0px rgba(0,0,0,0.2)',
          }}
        >
          {/* Inner dotted border */}
          <div className="absolute inset-0.5 border-2 border-dashed border-[#FFE8F5]/30 pointer-events-none" />

          {/* 8-bit Heart layout inside gold seal */}
          <svg 
            className="w-7 h-7 text-[#7B5EA7] fill-current animate-pulse" 
            viewBox="0 0 8 8"
          >
            {/* 8-bit clean heart shape pixels */}
            <path d="M1 2h2v1H1V2zm4 0h2v1H5V2zm-5 1h8v1H0V3zm0 1h8v1H0V4zm1 1h6v1H1V5zm2 1h4v1H3V6zm1 1h2v1H4V7z" />
          </svg>
        </motion.div>

        {/* Envelope address text label */}
        <div className="absolute bottom-3 left-4 right-4 text-center z-20 pointer-events-none">
          <span className="text-[10px] tracking-[0.1em] font-mono font-bold text-[#FFE8F5] uppercase opacity-75 group-hover:opacity-100 transition-opacity">
            ✦ CLICK TO OPEN ✦
          </span>
        </div>
      </motion.div>

      {/* Footer hint with bouncy pixel wiggle animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-8 flex flex-col items-center gap-1.5 cursor-pointer animate-pixel-wiggle"
        onClick={!isOpening ? handleOpenClick : undefined}
      >
        <div className="flex items-center gap-2">
          <span className="text-amber-300 text-xs shadow-glow">✦</span>
          <span className="text-xs font-pixel tracking-widest text-[#F5C6EA] text-center font-bold">
            点击解锁你的专属惊喜
          </span>
          <span className="text-amber-300 text-xs shadow-glow">✦</span>
        </div>
        <span className="text-[9px] font-mono text-[#C9A9E9]/70 uppercase tracking-widest leading-none">
          - press button to play -
        </span>
      </motion.div>
    </div>
  );
}
