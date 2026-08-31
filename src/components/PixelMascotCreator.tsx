/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, HelpCircle } from 'lucide-react';

export interface MascotConfig {
  style: 'star' | 'cat' | 'slime';
  color: string;
  accessory: 'none' | 'hat' | 'crown' | 'bow';
  expression: 'smile' | 'wink' | 'cute' | 'cool';
  tempo: 'bouncy' | 'sleepy' | 'spin';
}

interface PixelMascotCreatorProps {
  config?: MascotConfig;
  onConfigChange?: (config: MascotConfig) => void;
  birthdayName: string;
  birthdayAge: number;
  playClickSound: () => void;
}

export default function PixelMascotCreator({
  config,
  onConfigChange,
  birthdayName,
  birthdayAge,
  playClickSound
}: PixelMascotCreatorProps) {
  const [style, setStyle] = useState<'star' | 'cat' | 'slime'>(config?.style || 'star');
  const [color, setColor] = useState(config?.color || '#F7D070');
  const [accessory, setAccessory] = useState<'none' | 'hat' | 'crown' | 'bow'>(config?.accessory || 'crown');
  const [expression, setExpression] = useState<'smile' | 'wink' | 'cute' | 'cool'>(config?.expression || 'smile');
  const [tempo, setTempo] = useState<'bouncy' | 'sleepy' | 'spin'>(config?.tempo || 'bouncy');

  // Sync internal state with props if props change from server load
  useEffect(() => {
    if (config) {
      setStyle(config.style);
      setColor(config.color);
      setAccessory(config.accessory);
      setExpression(config.expression);
      setTempo(config.tempo);
    }
  }, [config]);

  // Notify parent of any changes
  useEffect(() => {
    if (onConfigChange) {
      onConfigChange({ style, color, accessory, expression, tempo });
    }
  }, [style, color, accessory, expression, tempo]);
  
  // Local mascot action states
  const [isJumping, setIsJumping] = useState(false);
  const [bubbleText, setBubbleText] = useState('哈喽！大寿星，快来给可爱的我定制新造型吧~');

  // Trigger bouncy jump animation and cute responses
  const handleInteraction = () => {
    if (isJumping) return;
    playClickSound();
    setIsJumping(true);

    const quotes = [
      `祝升级到 Lv.${birthdayAge} 的大寿星 ${birthdayName} 步步生辉！✨`,
      `哼哼，既然你诚心诚意指点了我，我就大发慈悲祝福你吧 🌟`,
      `【像素法则第一条】今天你的快乐值必须永久拉满！💯`,
      `正在读取 ${birthdayName} 的好梦…… 哔哔，已收获开心能量满格！🍀`,
      `哇！你戳疼了我，需要一个热情的草莓熊抱才能原谅、祝你生日快乐！🍰`,
      `Lv.${birthdayAge} 是一座全新的闪耀里程碑，勇敢去探险吧！🚀`
    ];
    setBubbleText(quotes[Math.floor(Math.random() * quotes.length)]);

    setTimeout(() => {
      setIsJumping(false);
    }, 850);
  };

  // Switch responses whenever details change to highlight reactive dynamics!
  useEffect(() => {
    const changeQuotes = {
      star: `哇！我是闪闪发光的璀璨幸运星，亮晶晶照耀着 ${birthdayName} 哦 ⭐`,
      cat: `喵呜~ 像素招财猫已就位，为你招来一整年的平安、金币和惊喜 🐱`,
      slime: `咕噜咕噜…… 暖心史莱姆融化啦，愿为你抵挡生活的所有磨砺 ☁️`
    };
    setBubbleText(changeQuotes[style]);
  }, [style]);

  // Handle color change dynamic effects
  const availableColors = [
    { value: '#F7D070', name: '熠金' },
    { value: '#FF8FA3', name: '甜粉' },
    { value: '#A1E3D8', name: '薄荷' },
    { value: '#C9A9E9', name: '薰衣草' }
  ];

  // Define speed based on tempo or age
  // User says "用户可以通过输入的名字或年龄来改变它的颜色或速度"
  const getSpeedSeconds = () => {
    // Age has a creative scaling effect on our mascot's baseline animation velocity!
    const baseSpeed = tempo === 'spin' ? 4 : tempo === 'sleepy' ? 3.5 : 1.5;
    // Older or younger changes baseline frequency
    const modifier = Math.max(0.4, Math.min(2.0, 18 / birthdayAge));
    return baseSpeed * modifier;
  };

  // Custom Pixel SVG Paths
  // Standard 16x16 grid renderings
  const renderMascotBody = () => {
    if (style === 'star') {
      return (
        <svg viewBox="0 0 16 16" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
          {/* Outlines & fill inside a retro 16x16 grid */}
          {/* Main Body */}
          <path d="M7 1h2v3H7V1zm-1 3H6v1h4V4H6zm-2 1H4v1h8V5H4zm-2 1H2v2h12V6H2zm-1 2H1v2h14V8H1zm1 2h14v1H2v-1zm1 1h12v1H3v-1zm1 1h2v3H4v-3zm8 0h2v3h-2v-3z" fill={color} />
          {/* Eyes & mouth positions based on expressions */}
          {expression === 'smile' && (
            <>
              <rect x="5" y="7" width="2" height="2" fill="#24133c" />
              <rect x="9" y="7" width="2" height="2" fill="#24133c" />
              <rect x="7" y="9" width="2" height="1" fill="#24133c" />
              <rect x="4" y="9" width="1" height="1" fill="#FF8FA3" opacity="0.8" />
              <rect x="11" y="9" width="1" height="1" fill="#FF8FA3" opacity="0.8" />
            </>
          )}
          {expression === 'wink' && (
            <>
              <rect x="5" y="7" width="2" height="2" fill="#24133c" />
              <rect x="9" y="8" width="2" height="1" fill="#24133c" />
              <rect x="7" y="9" width="2" height="1" fill="#24133c" />
              <rect x="4" y="9" width="1" height="1" fill="#FF8FA3" opacity="0.8" />
              <rect x="11" y="9" width="1" height="1" fill="#FF8FA3" opacity="0.8" />
            </>
          )}
          {expression === 'cute' && (
            <>
              <rect x="5" y="7" width="2" height="1" fill="#24133c" />
              <rect x="9" y="7" width="2" height="1" fill="#24133c" />
              <rect x="7" y="9" width="2" height="2" fill="#FF4B72" />
              <rect x="4" y="8" width="1" height="1" fill="#FF8FA3" />
              <rect x="11" y="8" width="1" height="1" fill="#FF8FA3" />
            </>
          )}
          {expression === 'cool' && (
            <>
              {/* Cool sunglasses block */}
              <rect x="4" y="6" width="8" height="2" fill="slate-900" />
              <rect x="5" y="8" width="2" height="1" fill="slate-900" />
              <rect x="9" y="8" width="2" height="1" fill="slate-900" />
              <rect x="7" y="8" width="2" height="1" fill="#F7D070" />
            </>
          )}
        </svg>
      );
    } else if (style === 'cat') {
      return (
        <svg viewBox="0 0 16 16" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
          {/* Cozy Cat Ears */}
          <path d="M2 2h3v3H2V2zm9 0h3v3h-3V2z" fill="#3a1a54" />
          <path d="M3 3h1v2H3V3zm9 0h1v2h-1V3z" fill="#FFA4C2" />
          {/* Cat Round Head */}
          <rect x="2" y="5" width="12" height="9" fill={color} />
          {/* Tiny Cute Paws */}
          <rect x="4" y="14" width="2" height="1" fill="#FFE8F5" />
          <rect x="10" y="14" width="2" height="1" fill="#FFE8F5" />
          
          {/* Facial features */}
          {expression === 'smile' || expression === 'cool' ? (
            <>
              <rect x="4" y="8" width="2" height="2" fill="#24133c" />
              <rect x="10" y="8" width="2" height="2" fill="#24133c" />
              <rect x="7" y="9" width="2" height="1" fill="#FF4B72" />
              {/* Whiskers */}
              <rect x="1" y="9" width="2" height="1" fill="#24133c" opacity="0.4" />
              <rect x="13" y="9" width="2" height="1" fill="#24133c" opacity="0.4" />
            </>
          ) : expression === 'wink' ? (
            <>
              <rect x="4" y="8" width="2" height="2" fill="#24133c" />
              <rect x="10" y="9" width="2" height="1" fill="#24133c" />
              <rect x="7" y="10" width="2" height="1" fill="#24133c" />
              <rect x="3" y="10" width="1" height="1" fill="#FFA4C2" />
              <rect x="12" y="10" width="1" height="1" fill="#FFA4C2" />
            </>
          ) : (
            <>
              <circle cx="5" cy="9" r="1" fill="#24133c" />
              <circle cx="11" cy="9" r="1" fill="#24133c" />
              <rect x="6.5" y="10" width="3" height="1" fill="#FF4B72" />
              <rect x="3" y="10" width="1" height="1" fill="#FFA4C2" />
              <rect x="12" y="10" width="1" height="1" fill="#FFA4C2" />
            </>
          )}
        </svg>
      );
    } else {
      // Slime Option
      return (
        <svg viewBox="0 0 16 16" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
          {/* Slime Droplet shape */}
          <path d="M7 2h2v2H7V2zm-2 2h6v2H5V4zm-2 2h10v2H3V6zm-1 2h12v6H2V8zm1 6h10v1H3v-1z" fill={color} />
          {/* Highlight spark */}
          <rect x="4" y="7" width="2" height="2" fill="#FFE8F5" opacity="0.7" />
          
          {/* Eyes & Smile */}
          <rect x="5" y="10" width="2" height="2" fill="#24133c" />
          <rect x="9" y="10" width="2" height="2" fill="#24133c" />
          {expression === 'wink' ? (
            <rect x="10" y="10" width="2" height="1" fill="#24133c" />
          ) : null}
          <rect x="7.5" y="11" width="1" height="1" fill="#24133c" />
          <rect x="3.5" y="11" width="1" height="1" fill="#FF8FA3" opacity="0.8" />
          <rect x="11.5" y="11" width="1" height="1" fill="#FF8FA3" opacity="0.8" />
        </svg>
      );
    }
  };

  // Render overlay Accessory
  const renderAccessory = () => {
    if (accessory === 'none') return null;
    if (accessory === 'hat') {
      return (
        <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 w-8 h-8 pointer-events-none z-10 animate-pulse">
          <svg viewBox="0 0 8 8" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
            <path d="M3 0h2v1H3V0zm-1 1h4v2H2V1zm-1 2h6v2H1V3zm-1 2h8v1H0V5z" fill="#FF8FA3" />
            {/* Dots */}
            <rect x="3" y="3" width="1" height="1" fill="#FFE8F5" />
            <rect x="4" y="4" width="1" height="1" fill="#60e1d5" />
            <rect x="2" y="4" width="1" height="1" fill="#FFE8F5" />
            {/* Top pompom */}
            <rect x="3.5" y="0" width="1" height="1" fill="#F7D070" />
          </svg>
        </div>
      );
    } else if (accessory === 'crown') {
      return (
        <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 w-10 h-7 pointer-events-none z-10">
          <svg viewBox="0 0 10 7" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
            <path d="M0 1h2v2H0V1zm4 0h2v2H4V1zm4 0h2v2H8V1zm1 2h1v3H9V3zm-2 1h1v2H7V4zm-2-1h2v3H5V3zm-2 1h1v2H3V4zm-2-1h1v3H1V3zm0 3h8v1H1V6z" fill="#F7D070" />
            {/* Crown gems */}
            <rect x="1" y="2" width="1" height="1" fill="#FF4B72" />
            <rect x="5" y="2" width="1" height="1" fill="#3ca8fe" />
            <rect x="9" y="2" width="1" height="1" fill="#FF4B72" />
          </svg>
        </div>
      );
    } else {
      // Bow ribbon
      return (
        <div className="absolute top-[-2px] left-[15%] w-7 h-7 pointer-events-none z-10">
          <svg viewBox="0 0 8 8" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
            <path d="M1 2h2v2H1V2zm4 0h2v2H5V2zm-1 2h2v1H4V4zm-2 1h1v2H2V5zm4 0h1v2H6V5z" fill="#eb2f06" />
            <rect x="3" y="3" width="2" height="2" fill="#f5cd79" />
          </svg>
        </div>
      );
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* 1. Interactive Mascot Sandbox Arena */}
      <div className="relative w-full aspect-square bg-[#1b082b] border-4 border-[#FFE8F5] overflow-hidden flex flex-col items-center justify-center p-4">
        {/* Retro Grid Lines Background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(#C9A9E9 1.5px, transparent 1.5px)',
          backgroundSize: '12px 12px'
        }} />

        {/* Dynamic Speech bubble */}
        <div className="absolute top-3 left-4 right-4 min-h-[38px] bg-[#33184a] border-2 border-[#FFE8F5] p-1.5 px-2.5 text-[9.5px] text-[#FFE8F5] leading-normal flex items-center justify-center text-center shadow-md select-none">
          <span className="font-pixel text-[#FFE8F5]">{bubbleText}</span>
          <div className="absolute left-[30%] -bottom-1.5 w-2 h-2 bg-[#33184a] border-r-2 border-b-2 border-[#FFE8F5]" style={{ transform: 'rotate(45deg)' }} />
        </div>

        {/* Ambient Orbiting Ring & Particles */}
        <div className="absolute w-28 h-28 border-2 border-dashed border-[#F5C6EA]/30 rounded-full animate-spin-slow pointer-events-none" />

        {/* Mascot Wrapper */}
        <motion.div
          animate={isJumping ? {
            y: [-10, -56, 0],
            scaleX: [1, 0.8, 1.1, 1],
            scaleY: [1, 1.25, 0.9, 1]
          } : tempo === 'spin' ? {
            rotate: [0, 360],
            y: [-1, 2, -1]
          } : tempo === 'sleepy' ? {
            scale: [1, 1.04, 1],
            y: [0, 3, 0]
          } : {
            y: [-4, 4, -4],
            scaleY: [1, 0.96, 1.02, 1]
          }}
          transition={{
            duration: isJumping ? 0.85 : getSpeedSeconds(),
            ease: isJumping ? 'easeOut' : 'easeInOut',
            repeat: isJumping ? 0 : Infinity
          }}
          onClick={handleInteraction}
          className="relative w-24 h-24 cursor-pointer hover:scale-105 transition-transform active:scale-95 z-10 flex items-center justify-center"
        >
          {renderAccessory()}
          {renderMascotBody()}
          
          {/* Float sparkles backing */}
          <div className="absolute -bottom-3 w-16 h-2.5 bg-black/40 blur-sm rounded-full pointer-events-none" />
        </motion.div>

        {/* Instruction overlay */}
        <div className="absolute bottom-2 left-0 right-0 text-center select-none pointer-events-none">
          <span className="text-[7.5px] text-[#C9A9E9] tracking-widest uppercase animate-pulse">
            ✦ TAP MASCOT TO PLAY & CHAT ✦
          </span>
        </div>
      </div>

      {/* 2. Style-Option Controller Panels */}
      <div className="flex flex-col gap-2 bg-[#140621]/80 border-2 border-[#C9A9E9]/40 p-2.5 max-sm:p-2 text-[10px]">
        {/* Style selection */}
        <div className="flex items-center justify-between gap-1 border-b border-dashed border-[#7B5EA7]/40 pb-1.5">
          <span className="text-[#C9A9E9] shrink-0">形象 款式:</span>
          <div className="flex flex-wrap gap-1 justify-end">
            {(['star', 'cat', 'slime'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => { playClickSound(); setStyle(s); }}
                className={`px-1.5 py-0.5 border cursor-pointer ${
                  style === s ? 'bg-[#FF8FA3] text-white border-[#FFE8F5]' : 'bg-black/20 text-[#C9A9E9] border-[#C9A9E9]/30 hover:text-white'
                }`}
              >
                {s === 'star' ? '星⭐' : s === 'cat' ? '喵🐱' : '嘟☁️'}
              </button>
            ))}
          </div>
        </div>

        {/* Color Palette Selection */}
        <div className="flex items-center justify-between gap-1 border-b border-dashed border-[#7B5EA7]/40 pb-1.5">
          <span className="text-[#C9A9E9] shrink-0">体色 染料:</span>
          <div className="flex flex-wrap gap-1.5 justify-end">
            {availableColors.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => { playClickSound(); setColor(c.value); }}
                className={`w-4 h-4 border cursor-pointer relative flex items-center justify-center`}
                style={{ backgroundColor: c.value }}
                title={c.name}
              >
                {color === c.value && (
                  <span className="w-1.5 h-1.5 bg-slate-900 rounded-none" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Accessory Selection */}
        <div className="flex items-center justify-between gap-1 border-b border-dashed border-[#7B5EA7]/40 pb-1.5">
          <span className="text-[#C9A9E9] shrink-0">头部 配饰:</span>
          <div className="flex flex-wrap gap-1 justify-end">
            {(['crown', 'hat', 'bow', 'none'] as const).map((acc) => (
              <button
                key={acc}
                type="button"
                onClick={() => { playClickSound(); setAccessory(acc); }}
                className={`px-1 py-0.5 border cursor-pointer text-[9px] ${
                  accessory === acc ? 'bg-[#FF8FA3] text-white border-[#FFE8F5]' : 'bg-black/20 text-[#C9A9E9] border-[#C9A9E9]/30 hover:text-white'
                }`}
              >
                {acc === 'crown' ? '皇冠' : acc === 'hat' ? '派对帽' : acc === 'bow' ? '蝴蝶结' : '无'}
              </button>
            ))}
          </div>
        </div>

        {/* Expression Switch */}
        <div className="flex items-center justify-between gap-1 border-b border-dashed border-[#7B5EA7]/40 pb-1.5">
          <span className="text-[#C9A9E9] shrink-0">面部 表情:</span>
          <div className="flex flex-wrap gap-1 justify-end">
            {(['smile', 'wink', 'cute', 'cool'] as const).map((expr) => (
              <button
                key={expr}
                type="button"
                onClick={() => { playClickSound(); setExpression(expr); }}
                className={`px-1 py-0.5 border cursor-pointer text-[9px] ${
                  expression === expr ? 'bg-[#FF8FA3] text-white border-[#FFE8F5]' : 'bg-black/20 text-[#C9A9E9] border-[#C9A9E9]/30 hover:text-white'
                }`}
              >
                {expr === 'smile' ? '微笑' : expr === 'wink' ? '眨眼' : expr === 'cute' ? '可爱' : '酷'}
              </button>
            ))}
          </div>
        </div>

        {/* Tempo animation style selection */}
        <div className="flex items-center justify-between gap-1">
          <span className="text-[#C9A9E9] shrink-0">律动 特效:</span>
          <div className="flex flex-wrap gap-1 justify-end">
            {(['bouncy', 'sleepy', 'spin'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { playClickSound(); setTempo(t); }}
                className={`px-1 py-0.5 border cursor-pointer text-[9px] ${
                  tempo === t ? 'bg-[#FF8FA3] text-white border-[#FFE8F5]' : 'bg-black/20 text-[#C9A9E9] border-[#C9A9E9]/30 hover:text-white'
                }`}
              >
                {t === 'bouncy' ? '极跃' : t === 'sleepy' ? '微息' : '狂旋'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
