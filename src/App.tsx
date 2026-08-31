/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  RotateCcw, 
  ChevronRight, 
  Camera, 
  Heart, 
  Flame, 
  Gift,
  Plus,
  Minus,
  Smile,
  Cake,
  Edit2,
  Share2,
  X,
  Check,
  Copy
} from 'lucide-react';
import CanvasEffects from './components/CanvasEffects';
import Envelope from './components/Envelope';
import PhotoEnvelope from './components/PhotoEnvelope';
import MusicPlayer, { MusicPlayerRef } from './components/MusicPlayer';
import PixelMascotCreator, { MascotConfig } from './components/PixelMascotCreator';
import { BLESSING_THEMES, DEFAULT_BIRTHDAY_IMAGE, CLICK_SOUND_URL, DEFAULT_MEMORY_PHOTOS } from './data';

interface IntroStar {
  id: number;
  initialX: number;
  initialY: number;
  targetX: number;
  targetY: number;
}

export default function App() {
  const [introSequence, setIntroSequence] = useState(true);
  const [currentPage, setCurrentPage] = useState<'envelope' | 'celebration'>('envelope');
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);
  
  // Custom Controls for canvas elements
  const [enableFireworks, setEnableFireworks] = useState(true);
  const [enablePetals, setEnablePetals] = useState(true);

  // Letter Pagination states
  const [currentPageOfLetter, setCurrentPageOfLetter] = useState(0);

  // Wishing dynamic properties
  const [floatingWishText, setFloatingWishText] = useState('');
  const [wishSuccessModal, setWishSuccessModal] = useState<{ isOpen: boolean; wishText: string }>({
    isOpen: false,
    wishText: '',
  });

  // Personalized configuration parameters
  const [birthdayName, setBirthdayName] = useState('最特别的孩子');
  const [birthdayAge, setBirthdayAge] = useState(18);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('最特别的孩子');

  const isFirstRender = useRef(true);
  const hasFetchedInitialData = useRef(false);

  // Load saved card data from server on initial mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cardId = urlParams.get('card') || 'latest';

    // 1. Local-First Caching: Instantly load configuration from localStorage
    try {
      const cached = localStorage.getItem(`pixel_birthday_cache_${cardId}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.name) {
          setBirthdayName(parsed.name);
          setInputName(parsed.name);
          setTempName(parsed.name);
        }
        if (parsed.age) {
          setBirthdayAge(parsed.age);
          setInputAge(parsed.age);
        }
        if (parsed.themeIndex !== undefined) {
          setSelectedThemeIndex(parsed.themeIndex);
        }
        if (parsed.activeMascotId !== undefined) {
          setActiveMascotId(parsed.activeMascotId);
        }
        if (parsed.mascotConfig !== undefined) {
          setMascotConfig(parsed.mascotConfig);
        }
        if (parsed.customTitle !== undefined) setCustomTitle(parsed.customTitle);
        if (parsed.customParagraphs !== undefined) setCustomParagraphs(parsed.customParagraphs);
        if (parsed.customSignature !== undefined) setCustomSignature(parsed.customSignature);
        if (parsed.customDate !== undefined) setCustomDate(parsed.customDate);
        if (parsed.customThemeNames !== undefined) setCustomThemeNames(parsed.customThemeNames);
        if (Array.isArray(parsed.wishes) && parsed.wishes.length > 0) {
          setWishesList(parsed.wishes);
        }
      }
    } catch (err) {
      console.warn('Failed to parse local cache', err);
    }


    fetch(`/api/cards/${cardId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.success && data.card) {
          if (data.card.name) {
            setBirthdayName(data.card.name);
            setInputName(data.card.name);
            setTempName(data.card.name);
          }
          if (data.card.age) {
            setBirthdayAge(data.card.age);
            setInputAge(data.card.age);
          }
          if (data.card.themeIndex !== undefined) {
            setSelectedThemeIndex(data.card.themeIndex);
          }
          if (data.card.activeMascotId !== undefined) {
            setActiveMascotId(data.card.activeMascotId);
          }
          if (data.card.mascotConfig !== undefined) {
            setMascotConfig(data.card.mascotConfig);
          }
          if (data.card.customTitle !== undefined) setCustomTitle(data.card.customTitle);
          if (data.card.customParagraphs !== undefined) setCustomParagraphs(data.card.customParagraphs);
          if (data.card.customSignature !== undefined) setCustomSignature(data.card.customSignature);
          if (data.card.customDate !== undefined) setCustomDate(data.card.customDate);
          if (data.card.customThemeNames !== undefined) setCustomThemeNames(data.card.customThemeNames);
          if (Array.isArray(data.card.wishes) && data.card.wishes.length > 0) {
            setWishesList(data.card.wishes);
          }
          
          // Update local cache with fresh server data
          try {
            localStorage.setItem(`pixel_birthday_cache_${cardId}`, JSON.stringify(data.card));
          } catch(e) {}
        }
      })
      .catch(err => console.log('Notice: using default initial parameters', err))
      .finally(() => {
        hasFetchedInitialData.current = true;
      });
  }, []);

  
  // Intro Landing Page customized Inputs & Retro loading states
  const [inputName, setInputName] = useState('最特别的孩子');
  const [inputAge, setInputAge] = useState(18);
  const [loadingPhase, setLoadingPhase] = useState<'idle' | 'loading' | 'done'>('idle');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMsg, setLoadingMsg] = useState('🌟 寻找宇宙中的完美像素因子...');

  // Interactive Mascot bubble message state
  const [mascotBubble, setMascotBubble] = useState('');
  const [activeMascotId, setActiveMascotId] = useState<string | null>(null);
  const [mascotConfig, setMascotConfig] = useState<MascotConfig | null>(null);

  // Custom letter texts
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customParagraphs, setCustomParagraphs] = useState<string[]>([]);
  const [customSignature, setCustomSignature] = useState<string>('');
  const [customDate, setCustomDate] = useState<string>('');
  const [customThemeNames, setCustomThemeNames] = useState<string[]>([]);
  const [isEditingLetter, setIsEditingLetter] = useState(false);
  const [isEditingThemes, setIsEditingThemes] = useState(false);
  const [editTitleInput, setEditTitleInput] = useState('');
  const [editParasInput, setEditParasInput] = useState('');
  const [editSigInput, setEditSigInput] = useState('');
  const [editDateInput, setEditDateInput] = useState('');

  // Share Modal State
  const [shareModal, setShareModal] = useState<{ isOpen: boolean; url: string; copied: boolean }>({
    isOpen: false,
    url: '',
    copied: false
  });
  
  const isSharedView = new URLSearchParams(window.location.search).get('shared') === '1';

  // Making individual wishes variables
  const [userWish, setUserWish] = useState('');
  const [wishesList, setWishesList] = useState<string[]>([]);
  const [isCandleLit, setIsCandleLit] = useState(true);
  const [wishNotification, setWishNotification] = useState('');

  // Audio references and controls
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const musicRef = useRef<MusicPlayerRef | null>(null);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);

  const activeTheme = BLESSING_THEMES[selectedThemeIndex] || BLESSING_THEMES[0];

  // --- Typewriter State Machine ---
  const [typedTitle, setTypedTitle] = useState('');
  const [typedParagraphs, setTypedParagraphs] = useState<string[]>([]);
  const [typedSignature, setTypedSignature] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typewriterTrigger, setTypewriterTrigger] = useState(0);

  // Auto-generate star points for gathering intro animation
  const [introStars, setIntroStars] = useState<IntroStar[]>([]);

  // Setup initial random coords for intro star gathering
  useEffect(() => {
    const list: IntroStar[] = [];
    const totalStars = 28;
    for (let i = 0; i < totalStars; i++) {
      const angle = (i / totalStars) * Math.PI * 2;
      const rx = 150;
      const ry = 90;
      
      list.push({
        id: i,
        initialX: Math.cos(angle) * 380 + (Math.random() * 80 - 40),
        initialY: Math.sin(angle) * 380 + (Math.random() * 80 - 40),
        targetX: Math.cos(angle) * rx,
        targetY: Math.sin(angle) * ry,
      });
    }
    setIntroStars(list);
  }, []);

  // Simulate gorgeous pixel retro loading sequence when loadingPhase becomes 'loading'
  useEffect(() => {
    if (loadingPhase !== 'loading') return;
    
    setLoadingProgress(0);
    const progressMsgs = [
      `🌟 正在寻找星空中属于大寿星【${birthdayName}】的完美像素因子...`,
      `📡 连接星轨传送信道，提取第 ${birthdayAge} 岁专属好运辐射量...`,
      `👾 正在调制星愿软泥，注入超级可爱的萌宠像素基因因子...`,
      `🎂 调试魔法蜡烛、配置温馨火光与无限快乐参数...`,
      `✉ 封存绝密璀璨祝福信件，已由像素诸神打上水晶封签...`,
      `✨ 像素星空传送阵组装完毕！向着温暖星轨全速载入中... 🚀`
    ];
    
    let currentPercent = 0;
    const interval = setInterval(() => {
      currentPercent += Math.floor(Math.random() * 8) + 4;
      if (currentPercent >= 100) {
        currentPercent = 100;
        clearInterval(interval);
        setTimeout(() => {
          setLoadingPhase('done');
          // Start actual introduction flow and show envelope screen!
          setIntroSequence(false);
          if (musicRef.current) {
            musicRef.current.play();
          }
        }, 800);
      }
      
      setLoadingProgress(currentPercent);
      // Change progress description strings dynamically based on current percent progress
      const index = Math.min(progressMsgs.length - 1, Math.floor((currentPercent / 100) * progressMsgs.length));
      setLoadingMsg(progressMsgs[index]);
    }, 110);
    
    return () => clearInterval(interval);
  }, [loadingPhase, birthdayName, birthdayAge]);

  // Play retro click SFX
  const playClickSound = () => {
    if (!clickAudioRef.current) {
      clickAudioRef.current = new Audio(CLICK_SOUND_URL);
      clickAudioRef.current.volume = 0.35;
    }
    clickAudioRef.current.currentTime = 0;
    clickAudioRef.current.play().catch(() => {});
  };

  const handleShareLink = () => {
    playClickSound();
    
    const urlParams = new URLSearchParams(window.location.search);
    let cardId = urlParams.get('card');
    if (!cardId) {
      cardId = `card_${Date.now()}`;
      try {
        window.history.replaceState({}, '', `?card=${cardId}`);
      } catch (err) {}
    }
    
    const shareUrl = `${window.location.origin}${window.location.pathname}?card=${cardId}&shared=1`;

    let isCopied = false;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        navigator.clipboard.writeText(shareUrl);
        isCopied = true;
      } catch (err) {
        console.warn('Clipboard write failed:', err);
      }
    }

    setShareModal({ isOpen: true, url: shareUrl, copied: isCopied });

    const cardPayload = {
      id: cardId,
      name: birthdayName,
      age: birthdayAge,
      wishes: wishesList,
      themeIndex: selectedThemeIndex,
      activeMascotId,
      mascotConfig,
      customTitle,
      customParagraphs,
      customSignature,
      customDate,
      customThemeNames
    };
    
    try {
      localStorage.setItem(`pixel_birthday_cache_${cardId}`, JSON.stringify(cardPayload));
      localStorage.setItem(`pixel_birthday_cache_latest`, JSON.stringify(cardPayload));
    } catch(e) {}

    fetch('/api/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cardPayload)
    }).catch(err => console.error('Failed to auto-sync card:', err));
  };

  const handleStartIntro = () => {
    playClickSound();
    setIntroSequence(false);
    if (musicRef.current) {
      musicRef.current.play();
    }
  };

  const handleOpenEnvelope = () => {
    playClickSound();
    if (musicRef.current) {
      musicRef.current.play();
    }
    setCurrentPage('celebration');
  };

  // Dynamically personalize typewriter messages using state name
  const getPersonalizedTitle = () => {
    return (customTitle || activeTheme.title).replace('最特别的你', birthdayName);
  };

  const getPersonalizedParagraphs = () => {
    const paras = customParagraphs.length > 0 ? customParagraphs : activeTheme.paragraphs;
    return paras.map(para => 
      para.replace('最特别的你', birthdayName)
          .replace('你的一岁', `你的 ${birthdayAge} 岁生命关卡`)
          .replace('新的一岁', `新的一岁 (${birthdayAge}岁)`)
    );
  };

  const getPersonalizedSignature = () => {
    return customSignature || activeTheme.signature;
  };

  // Run typewriter animation sequence
  useEffect(() => {
    if (currentPage !== 'celebration') return;

    setIsTyping(true);
    setTypedTitle('');
    setTypedParagraphs([]);
    setTypedSignature('');

    let active = true;
    const speed = 45; // Super snappy for smooth game-like dialog transitions!

    const typeWriter = async () => {
      const personalizedTitle = getPersonalizedTitle();
      const personalizedParagraphs = getPersonalizedParagraphs();

      if (currentPageOfLetter === 0) {
        // Page 1 Typewriter Flow:
        // 1. Type Title
        for (let i = 0; i <= personalizedTitle.length; i++) {
          if (!active) return;
          setTypedTitle(personalizedTitle.substring(0, i));
          await new Promise((res) => setTimeout(res, speed));
        }
        await new Promise((res) => setTimeout(res, 150));

        // 2. Type Paragraphs [0, 1, 2]
        const pageParas = personalizedParagraphs.slice(0, 3);
        for (let pIndex = 0; pIndex < pageParas.length; pIndex++) {
          const fullPara = pageParas[pIndex];
          if (!fullPara) continue;
          setTypedParagraphs((prev) => [...prev, '']);
          
          for (let i = 0; i <= fullPara.length; i++) {
            if (!active) return;
            setTypedParagraphs((prev) => {
              const next = [...prev];
              next[pIndex] = fullPara.substring(0, i);
              return next;
            });
            await new Promise((res) => setTimeout(res, speed * 0.7));
          }
          await new Promise((res) => setTimeout(res, 150));
        }
      } else {
        // Page 2 Typewriter Flow (Index 1):
        // Instant render title for screen continuity
        setTypedTitle(personalizedTitle);

        // Type Paragraphs [3, 4, 5]
        const pageParas = personalizedParagraphs.slice(3, 6);
        for (let pIndex = 0; pIndex < pageParas.length; pIndex++) {
          const fullPara = pageParas[pIndex];
          if (!fullPara) continue;
          setTypedParagraphs((prev) => [...prev, '']);
          
          for (let i = 0; i <= fullPara.length; i++) {
            if (!active) return;
            setTypedParagraphs((prev) => {
              const next = [...prev];
              next[pIndex] = fullPara.substring(0, i);
              return next;
            });
            await new Promise((res) => setTimeout(res, speed * 0.7));
          }
          await new Promise((res) => setTimeout(res, 150));
        }

        // Type Signature
        const personalizedSignature = getPersonalizedSignature();
        for (let i = 0; i <= personalizedSignature.length; i++) {
          if (!active) return;
          setTypedSignature(personalizedSignature.substring(0, i));
          await new Promise((res) => setTimeout(res, speed * 0.8));
        }
      }

      setIsTyping(false);
    };

    typeWriter();

    return () => {
      active = false;
    };
  }, [currentPage, selectedThemeIndex, birthdayName, birthdayAge, currentPageOfLetter, typewriterTrigger]);

  const handleSkipTyping = () => {
    playClickSound();
    const personalizedTitle = getPersonalizedTitle();
    const personalizedParagraphs = getPersonalizedParagraphs();
    
    if (currentPageOfLetter === 0) {
      setTypedTitle(personalizedTitle);
      setTypedParagraphs(personalizedParagraphs.slice(0, 3));
      setTypedSignature('');
    } else {
      setTypedTitle(personalizedTitle);
      setTypedParagraphs(personalizedParagraphs.slice(3, 6));
      setTypedSignature(getPersonalizedSignature());
    }
    setIsTyping(false);
  };

  const handleRestartTyping = () => {
    playClickSound();
    setTypedTitle('');
    setTypedParagraphs([]);
    setTypedSignature('');
    setTypewriterTrigger((prev) => prev + 1);
  };

  const handleMakeWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userWish.trim()) return;

    const currentSubmittedWish = userWish.trim();
    playClickSound();
    
    // Clear the text-input
    setUserWish('');

    // Trigger sweet float state
    setFloatingWishText(currentSubmittedWish);
    setWishNotification(''); // clear previous status

    // Simulated float sequence
    setTimeout(() => {
      // Add wish to history list
      setWishesList((prev) => [currentSubmittedWish, ...prev]);
      
      // Temporarily blow out candle flame for magic effect!
      setIsCandleLit(false);

      // Open pixel modal dialog box
      setWishSuccessModal({
        isOpen: true,
        wishText: currentSubmittedWish
      });

      // Clear floating text State
      setFloatingWishText('');

      // Auto-enable fireworks
      setEnableFireworks(true);
    }, 1200);
  };

// Save state to server on user change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Protect against race condition: don't sync back if we haven't loaded the initial data yet!
    if (!hasFetchedInitialData.current || isSharedView) {
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    let cardId = urlParams.get('card');
    if (!cardId) {
      cardId = `card_${Date.now()}`;
      try {
        window.history.replaceState({}, '', `?card=${cardId}`);
      } catch (err) {}
    }

    const cardPayload = {
      id: cardId,
      name: birthdayName,
      age: birthdayAge,
      wishes: wishesList,
      themeIndex: selectedThemeIndex,
      activeMascotId: activeMascotId,
      mascotConfig: mascotConfig,
      customTitle,
      customParagraphs,
      customSignature,
      customDate,
      customThemeNames
    };

    // 1. Instantly save to local cache to survive network drops
    try {
      localStorage.setItem(`pixel_birthday_cache_${cardId}`, JSON.stringify(cardPayload));
      localStorage.setItem(`pixel_birthday_cache_latest`, JSON.stringify(cardPayload));
    } catch (e) {
      console.error('Failed to update local cache', e);
    }

    // 2. Sync to cloud API
    fetch('/api/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cardPayload)
    }).catch(err => console.error('Failed to auto-sync card:', err));
  }, [birthdayName, birthdayAge, wishesList, selectedThemeIndex, activeMascotId, mascotConfig, customTitle, customParagraphs, customSignature, customDate, customThemeNames]);

    // Handles custom mascot interaction
  const triggerMascotPhrase = (id: string, phrase: string) => {
    playClickSound();
    setActiveMascotId(id);
    setMascotBubble(phrase);
    setTimeout(() => {
      setActiveMascotId(null);
      setMascotBubble('');
    }, 4500);
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    if (tempName.trim()) {
      setBirthdayName(tempName.trim());
      setIsEditingName(false);
    }
  };

  const renderParagraphWithHighlights = (text: string) => {
    const wordsToHighlight = [
      '生日快乐', '收获', '幸运', '生日大吉', '希望', 
      '惊喜', '礼物', '温暖', '快乐', '梦想', '浪漫', 
      '闪烁', '关卡', '生命', '成长', '勇敢'
    ];
    let elements: React.ReactNode[] = [text];

    wordsToHighlight.forEach((word) => {
      elements = elements.flatMap((el) => {
        if (typeof el !== 'string') return el;
        const parts = el.split(word);
        if (parts.length === 1) return el;
        
        const next: React.ReactNode[] = [];
        parts.forEach((part, index) => {
          next.push(part);
          if (index < parts.length - 1) {
            next.push(
              <span key={word + index} className="blink-text-highlight font-bold font-pixel px-0.5 text-[#F7D070]">
                {word}
              </span>
            );
          }
        });
        return next;
      });
    });

    return elements;
  };

  return (
    <div className="relative min-h-screen w-full overflow-y-auto bg-gradient-to-b from-[#2E184A] via-[#5C2E75] to-[#25103d] text-[#FFE8F5] flex flex-col items-center select-none font-pixel pb-16">
      
      {/* Background canvas elements with pixelated options */}
      <CanvasEffects enableFireworks={enableFireworks} enablePetals={enablePetals} />

      {/* Persistent global retro acoustic player */}
      <MusicPlayer ref={musicRef} isPlayingInitially={true} onPlayingStateChange={(playing) => setIsMusicPlaying(playing)} />

      {/* Floating Decorative Balloons on Desktop Views */}
      <div className="hidden lg:block absolute left-10 top-24 pointer-events-none z-10 animate-balloon-1">
        <div className="flex flex-col items-center">
          <div className="w-12 h-14" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='14' viewBox='0 0 12 14'%3E%3Cpath d='M3 0h6v1H3zm-2 1h10v1H1zm-1 2h12v6H0zm1 6h10v1H1zm2 1h6v1H3zm2 1h2v1H5zm1 1v1h1v-1z' fill='%23F5C6EA'/%3E%3Cpath d='M2 3h2v1H2zm0 2h3v1H2z' fill='%23FFE8F5'/%3E%3C/svg%3E")`,
            imageRendering: 'pixelated', width: '32px', height: '38px'
          }} />
          <div className="w-0.5 h-12 bg-[#C9A9E9]/40" />
        </div>
      </div>
      <div className="hidden lg:block absolute right-12 top-32 pointer-events-none z-10 animate-balloon-2">
        <div className="flex flex-col items-center">
          <div className="w-12 h-14" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='14' viewBox='0 0 12 14'%3E%3Cpath d='M3 0h6v1H3zm-2 1h10v1H1zm-1 2h12v6H0zm1 6h10v1H1zm2 1h6v1H3zm2 1h2v1H5zm1 1v1h1v-1z' fill='%23F7D070'/%3E%3Cpath d='M2 3h2v1H2zm0 2h3v1H2z' fill='%23FFE8F5'/%3E%3C/svg%3E")`,
            imageRendering: 'pixelated', width: '30px', height: '36px'
          }} />
          <div className="w-0.5 h-16 bg-[#C9A9E9]/40" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* Intro sequence: Star gathering scene / configuration gate & loading simulation */}
        {introSequence ? (
          loadingPhase === 'loading' ? (
            <motion.div
              key="loading-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 w-full h-full bg-[#1e0e2d] z-50 flex flex-col items-center justify-center p-4 overflow-hidden"
            >
              {/* Retro pixel grid decoration */}
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(#FFE8F5 1px, transparent 1px)',
                backgroundSize: '16px 16px'
              }} />

              {/* The Retro Pixel Loading Box */}
              <div className="w-full max-w-sm bg-[#1b082b] border-4 border-[#FFE8F5] p-5 sm:p-6 flex flex-col items-center gap-5 relative shadow-inner">
                {/* Vintage system stamp */}
                <div className="absolute -top-3.5 left-4 px-2 py-0.5 bg-[#F7D070] border-2 border-[#FFE8F5] text-[9.5px] text-[#24133c] font-bold">
                  📡 SYSTEM LOADING...
                </div>

                {/* Animated mascot symbol frame */}
                <div className="w-16 h-16 relative flex items-center justify-center animate-bounce mt-2">
                  <svg viewBox="0 0 16 16" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
                    {/* Retro floating heart symbol */}
                    <path d="M4 1h3v1H4V1zm5 0h3v1H9V1zM2 3h12v1H2V3zm0 3h12v1H2V6zM3 9h10v1H3V9zm2 3h6v1H5v-1zm2 2h2v1H7v-1z" fill="#FF8FA3" />
                  </svg>
                </div>

                {/* Micro Percentage display */}
                <div className="text-xl font-bold font-pixel text-[#FFE8F5] tracking-tight text-center select-none">
                  {loadingProgress}% COMPLETE
                </div>

                {/* Retro Solid Brick Progress Bar Indicator */}
                <div className="w-full h-6 border-2 border-[#FFE8F5] bg-black/45 flex items-center p-0.5 relative rounded-none">
                  <div 
                    className="h-full bg-gradient-to-r from-[#FF8FA3] to-[#F7D070] transition-all duration-100 ease-out"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>

                {/* Diagnostics Status message box */}
                <div className="text-center h-12 flex items-center justify-center px-1">
                  <p className="text-[10px] leading-relaxed text-[#C9A9E9] font-pixel animate-pulse">
                    {loadingMsg}
                  </p>
                </div>

                {/* Vintage Diagnostic telemetry lines */}
                <div className="w-full border-t border-dashed border-[#7B5EA7]/30 pt-2 flex justify-between text-[7px] text-[#C9A9E9]/45 select-none font-mono uppercase">
                  <span>TRANSFERS: {Math.floor(loadingProgress * 2.56)} / 256 SECTORS</span>
                  <span>RATE: 104.2 KB/S</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="intro-screen"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="fixed inset-0 w-full h-full bg-[#1e0e2d] z-50 flex flex-col items-center justify-center p-4 overflow-y-auto"
            >
              {/* Retro pixel grid decoration */}
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(#FFE8F5 1px, transparent 1px)',
                backgroundSize: '16px 16px'
              }} />

              {/* Decorative gathering star group on top */}
              <div className="relative w-full max-w-xs h-36 flex items-center justify-center select-none pointer-events-none scale-90 sm:scale-100 mb-1">
                {introStars.map((star) => (
                  <motion.div
                    key={star.id}
                    initial={{ x: star.initialX, y: star.initialY, scale: 0 }}
                    animate={{ x: star.targetX, y: star.targetY, scale: 1 }}
                    transition={{ duration: 1.6, type: 'spring', stiffness: 50 }}
                    className="absolute w-2.5 h-2.5 bg-[#F7D070]"
                    style={{
                      boxShadow: '0 0 6px #FFE8F5',
                      imageRendering: 'pixelated'
                    }}
                  />
                ))}

                {/* Glowing retro banner inside star orbit */}
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="text-center z-10 p-4 bg-[#3a1a54] border-4 border-[#FFE8F5] max-w-xs"
                >
                  <h1 className="text-[12px] font-english text-[#FFE8F5] tracking-widest leading-none select-none animate-pulse mb-1 font-bold" style={{ textShadow: '2px 2px 0 #7B5EA7' }}>
                    HAPPY BIRTHDAY
                  </h1>
                  <p className="text-[8.5px] text-[#F5C6EA] font-sans font-bold tracking-tight">星夜暖光生日礼即将送达</p>
                </motion.div>
              </div>

              {/* Dynamic Interactive Input Setup Frame Container */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="w-full max-w-sm bg-[#27103a] border-4 border-[#FFE8F5] p-5 sm:p-6 flex flex-col gap-4 relative shadow-2xl z-20"
                style={{
                  boxShadow: '0 8px 0 rgba(0,0,0,0.5)'
                }}
              >
                {/* Station tab tag */}
                <div className="absolute -top-3.5 left-4 px-2 py-0.5 bg-[#FF8FA3] border-2 border-[#FFE8F5] text-[9px] tracking-widest text-[#FFE8F5] font-bold">
                  ✦ CONFIG STATION ✦
                </div>

                <div className="text-center border-b border-dashed border-[#7B5EA7]/30 pb-2">
                  <p className="text-[10px] text-[#F7D070] font-bold leading-none">【 录入寿星讯息 ∙ 降落星空门扉 】</p>
                </div>

                <div className="flex flex-col gap-3.5 text-xs text-[#FFE8F5]/90">
                  {/* 1. Name Input Control */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-[#C9A9E9] text-left font-bold">
                      寿星尊称 Name (例如：特别的你 / 亲爱的糖糖):
                    </label>
                    <input
                      type="text"
                      maxLength={11}
                      placeholder="最特别的孩子"
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                      className="w-full bg-black/35 border-2 border-[#FFE8F5] text-[#FFE8F5] text-[11px] px-3 py-2 placeholder-[#FFE8F5]/30 focus:outline-none focus:border-[#FF8FA3] transition-colors"
                    />
                  </div>

                  {/* 2. Age Input/Count Control */}
                  <div className="flex flex-col gap-1.5 col-span-1">
                    <label className="text-[9px] text-[#C9A9E9] text-left font-bold">
                      年龄等级 Level (新的一岁等级):
                    </label>
                    <div className="flex items-center justify-between border-2 border-[#FFE8F5] bg-black/35 p-1 px-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          playClickSound();
                          setInputAge(prev => Math.max(1, prev - 1));
                        }}
                        className="w-7 h-7 border-2 border-[#FFE8F5] bg-[#7B5EA7]/40 hover:bg-[#7B5EA7] text-[#FFE8F5] text-xs font-bold font-pixel flex items-center justify-center cursor-pointer transition-all"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[#FFE8F5] text-[11.5px] font-bold tracking-wide">
                        LEVEL {inputAge} 岁
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          playClickSound();
                          setInputAge(prev => Math.min(120, prev + 1));
                        }}
                        className="w-7 h-7 border-2 border-[#FFE8F5] bg-[#7B5EA7]/40 hover:bg-[#7B5EA7] text-[#FFE8F5] text-xs font-bold font-pixel flex items-center justify-center cursor-pointer transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Launch Submit button */}
                <button
                  type="button"
                  onClick={() => {
                    const finalName = inputName.trim() ? inputName.trim() : '最特别的孩子';
                    setBirthdayName(finalName);
                    setTempName(finalName);
                    setBirthdayAge(inputAge);
                    
                    playClickSound();
                    if (musicRef.current) {
                      musicRef.current.play();
                    }
                    setLoadingPhase('loading');
                  }}
                  className="mt-2 w-full py-3.5 bg-[#FF8FA3] border-4 border-[#FFE8F5] text-[#24133c] text-xs uppercase tracking-widest font-bold cursor-pointer hover:bg-white hover:text-black hover:border-white transition-all active:translate-y-1 shadow-md"
                  style={{
                    boxShadow: '0 4px 0 #7B5EA7'
                  }}
                >
                  🚀 PRESS START TO PLAY 🚀
                </button>
              </motion.div>

              <span className="text-[8px] font-mono text-stone-500 mt-6 tracking-widest select-none pointer-events-none">© 2026 PIXEL STAR STUDIOS</span>
            </motion.div>
          )
        ) : currentPage === 'envelope' ? (
          <motion.div
            key="page-envelope"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full flex justify-center items-center h-screen z-10"
          >
            <Envelope onOpen={handleOpenEnvelope} />
          </motion.div>
        ) : (
          <motion.div
            key="page-celebration"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="relative w-full max-w-md px-4 sm:px-5 py-6 sm:py-8 mt-8 sm:mt-12 mb-16 z-10 flex flex-col items-center gap-5 sm:gap-6"
          >
            {/* Header branding */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center flex flex-col items-center w-full"
            >
              <div className="flex items-center justify-center gap-2 text-[#FFE8F5] text-[9px] tracking-widest font-english mb-1 font-bold">
                <span className="text-[#F7D070] animate-pulse">✦</span>
                HOLIDAY CELEBRATION
                <span className="text-[#F7D070] animate-pulse">✦</span>
              </div>
              <div className="px-3.5 py-1.5 bg-[#FF8FA3]/50 border-2 border-[#FFE8F5] rounded-none shadow-sm flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#85E3A1] rounded-none animate-ping" />
                <span className="text-xs font-pixel tracking-wide text-[#FFE8F5] font-bold">专属生日庆典 已经开幕</span>
              </div>
            </motion.div>

            {/* Customizer Panel - HIGHEST APPLICABILITY FOR CUSTOM BIRTHDAY INFO */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-[#1F092E]/90 border-4 border-[#FFE8F5] p-4 flex flex-col gap-3 shadow-md"
              style={{
                boxShadow: '0 4px 0 rgba(0,0,0,0.3)'
              }}
            >
              <div className="flex items-center gap-1.5 justify-between">
                <div className="flex items-center gap-1.5">
                  <Smile className="w-4 h-4 text-[#F7D070]" />
                  <span className="text-[11px] font-bold text-[#FFE8F5]">定制你的专属寿星 (CUSTOMIZE)</span>
                </div>
                <span className="text-[8px] text-[#F5C6EA] tracking-widest">STEP 1</span>
              </div>

              <div className="grid grid-cols-1 min-[370px]:grid-cols-2 gap-3 mt-1 text-xs">
                {/* 1. Name Customizer */}
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-[#C9A9E9]">寿星尊称 Name:</span>
                  {isEditingName ? (
                    <form onSubmit={handleSaveName} className="flex gap-1">
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        maxLength={11}
                        className="w-full bg-black/40 border border-[#F5C6EA] text-[#FFE8F5] text-[10px] px-1.5 py-1 focus:outline-none"
                      />
                      <button type="submit" className="bg-[#7B5EA7] text-white px-2 py-0.5 text-[9px] border border-[#FFE8F5]">OK</button>
                    </form>
                  ) : (
                    <div 
                      onClick={() => {
                        playClickSound();
                        setIsEditingName(true);
                      }}
                      className="bg-[#2a133c] hover:bg-[#341b48] border border-[#C9A9E9]/40 p-1.5 px-2 text-[#FFE8F5] text-[10.5px] flex items-center justify-between cursor-pointer"
                    >
                      <span>{birthdayName}</span>
                      <Edit2 className="w-3 h-3 text-[#F5C6EA]" />
                    </div>
                  )}
                </div>

                {/* 2. Age Slider/Counter */}
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-[#C9A9E9]">年龄等级 Level:</span>
                  <div className="flex items-center gap-1 bg-[#2a133c] border border-[#C9A9E9]/40 p-1 justify-between">
                    <button 
                      onClick={() => {
                        playClickSound();
                        setBirthdayAge(prev => Math.max(1, prev - 1));
                      }}
                      className="px-1.5 py-0.5 bg-black/30 hover:bg-black/50 text-[#F5C6EA] rounded-none text-[10px] font-bold"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-[#FFE8F5] text-[10.5px] font-bold">{birthdayAge} 岁</span>
                    <button 
                      onClick={() => {
                        playClickSound();
                        setBirthdayAge(prev => Math.min(120, prev + 1));
                      }}
                      className="px-1.5 py-0.5 bg-black/30 hover:bg-black/50 text-[#F5C6EA] rounded-none text-[10px] font-bold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Polaroid Photo Frame */}
            <motion.div
              initial={{ opacity: 0, rotate: -2 }}
              animate={{ opacity: 1, rotate: -0.5 }}
              transition={{ duration: 0.7, delay: 0.1, type: 'spring' }}
              className="relative w-full bg-[#1F092E]/90 p-3 sm:p-4 pt-4 pb-6 sm:pb-8 border-4 border-[#FFE8F5] flex flex-col gap-3 transform-gpu hover:rotate-0 hover:scale-[1.02] duration-300 shadow-md"
              style={{
                boxShadow: '0 5px 0 rgba(0,0,0,0.3)',
              }}
            >
              {/* Custom Level Stamp Sticker */}
              <div className="absolute -top-3.5 right-4 px-2 py-1 bg-[#F7D070] border-2 border-[#FFE8F5] text-[9px] text-slate-900 font-bold tracking-wider z-20">
                LEVEL: {birthdayAge}
              </div>

              {/* Pixel tape pin top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-4 bg-[#FF8FA3] border-2 border-[#FFE8F5] rounded-none skew-x-12" />

              {/* Interactive Generator option creator */}
              <PixelMascotCreator
                birthdayName={birthdayName}
                birthdayAge={birthdayAge}
                playClickSound={playClickSound}
                config={mascotConfig || undefined}
                onConfigChange={(newConfig) => setMascotConfig(newConfig)}
              />

              {/* Captions */}
              <div className="text-center font-pixel text-xs text-[#FFE8F5]/80 tracking-wider font-bold select-none leading-relaxed px-1 flex flex-col items-center justify-center border-t border-dashed border-[#7B5EA7]/30 pt-2">
                <span className="text-[12px] text-[#F7D070]">【{birthdayName}】</span>
                <span className="text-[10px] text-[#FFE8F5]/75">✦ 愿你星河璀璨，前路漫烂，岁月尽欢 ✦</span>
              </div>
            </motion.div>

            {/* Mascot Squad Area - STUNNING NEW ADDITION */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full bg-[#180826]/85 border-4 border-[#FFE8F5] p-3 flex flex-col gap-2 relative"
            >
              {/* Mascot Bubble Speech Indicator */}
              <div className="text-[8px] text-[#C9A9E9] tracking-widest font-english">MASCOT SQUAD (点击寿星萌宠有惊喜)</div>
              
              <div className="flex justify-around items-end pt-2 min-h-[70px] relative">
                {/* Mascot 1: Teddy Bear */}
                <div className="relative flex flex-col items-center">
                  <AnimatePresence>
                    {activeMascotId === 'bear' && mascotBubble && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 5 }}
                        className="absolute bottom-full mb-3.5 left-1/2 -translate-x-[35%] sm:-translate-x-1/2 bg-[#33184a] border-2 border-[#FFE8F5] px-2.5 py-1.5 rounded-none text-[9.5px] leading-relaxed w-[145px] sm:w-[165px] text-left text-[#F7D070] shadow-lg z-30 pointer-events-none"
                      >
                        {mascotBubble}
                        <div className="absolute left-[35%] sm:left-1/2 -bottom-[5px] -translate-x-1/2 w-2 h-2 bg-[#33184a] border-r-2 border-b-2 border-[#FFE8F5]" style={{ transform: 'rotate(45deg)' }} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <button
                    type="button"
                    onClick={() => {
                      triggerMascotPhrase('bear', `🧸 小熊皮皮祝 ${birthdayName} 新的一岁快快乐乐，心想事成！`);
                      if (musicRef.current) musicRef.current.playManualNote(783.99);
                    }}
                    className={`flex flex-col items-center gap-1 cursor-pointer transition-transform duration-100 ${
                      activeMascotId === 'bear' ? 'animate-pixel-bounce' : 'hover:-translate-y-1'
                    }`}
                  >
                    <svg viewBox="0 0 16 16" className="w-12 h-12">
                      <rect x="3" y="4" width="2" height="2" fill="#a0522d" />
                      <rect x="11" y="4" width="2" height="2" fill="#a0522d" />
                      <rect x="4" y="5" width="8" height="9" fill="#cd853f" />
                      <rect x="4" y="5" width="1" height="1" fill="#ffa07a" />
                      <rect x="11" y="5" width="1" height="1" fill="#ffa07a" />
                      <rect x="6" y="8" width="1" height="1" fill="#000" />
                      <rect x="9" y="8" width="1" height="1" fill="#000" />
                      <rect x="7" y="10" width="2" height="1" fill="#ffa07a" />
                      <rect x="8" y="10" width="1" height="1" fill="#000" />
                      <rect x="5" y="9" width="1" height="1" fill="#ff69b4" />
                      <rect x="10" y="9" width="1" height="1" fill="#ff69b4" />
                    </svg>
                    <span className="text-[8px] px-1 bg-black/40 text-stone-300">皮皮 bear</span>
                  </button>
                </div>

                {/* Mascot 2: Sweet Rabbit */}
                <div className="relative flex flex-col items-center">
                  <AnimatePresence>
                    {activeMascotId === 'bunny' && mascotBubble && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 5 }}
                        className="absolute bottom-full mb-3.5 left-1/2 -translate-x-1/2 bg-[#33184a] border-2 border-[#FFE8F5] px-2.5 py-1.5 rounded-none text-[9.5px] leading-relaxed w-[145px] sm:w-[165px] text-left text-[#F7D070] shadow-lg z-30 pointer-events-none"
                      >
                        {mascotBubble}
                        <div className="absolute left-1/2 -bottom-[5px] -translate-x-1/2 w-2 h-2 bg-[#33184a] border-r-2 border-b-2 border-[#FFE8F5]" style={{ transform: 'rotate(45deg)' }} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <button
                    type="button"
                    onClick={() => {
                      triggerMascotPhrase('bunny', `🐰 兔兔米米给你递上精心烘焙的香甜草莓大布丁 🍰！`);
                      if (musicRef.current) musicRef.current.playManualNote(1046.50);
                    }}
                    className={`flex flex-col items-center gap-1 cursor-pointer transition-transform duration-100 ${
                      activeMascotId === 'bunny' ? 'animate-pixel-bounce' : 'hover:-translate-y-1'
                    }`}
                  >
                    <svg viewBox="0 0 16 16" className="w-12 h-12">
                      <rect x="4" y="1" width="2" height="5" fill="#fbc5db" />
                      <rect x="10" y="1" width="2" height="5" fill="#fbc5db" />
                      <rect x="4" y="2" width="1" height="3" fill="#ff9ebb" />
                      <rect x="11" y="2" width="1" height="3" fill="#ff9ebb" />
                      <rect x="3" y="6" width="10" height="8" fill="#ffe3ee" />
                      <rect x="5" y="9" width="1" height="1" fill="#e25d80" />
                      <rect x="10" y="9" width="1" height="1" fill="#e25d80" />
                      <rect x="4" y="10" width="1" height="1" fill="#ffa4c2" />
                      <rect x="11" y="10" width="1" height="1" fill="#ffa4c2" />
                      <rect x="7" y="10" width="2" height="1" fill="#ff6ca1" />
                    </svg>
                    <span className="text-[8px] px-1 bg-black/40 text-stone-300">米米 bunny</span>
                  </button>
                </div>

                {/* Mascot 3: Yellow Chick */}
                <div className="relative flex flex-col items-center">
                  <AnimatePresence>
                    {activeMascotId === 'chick' && mascotBubble && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 5 }}
                        className="absolute bottom-full mb-3.5 left-1/2 -translate-x-[65%] sm:-translate-x-1/2 bg-[#33184a] border-2 border-[#FFE8F5] px-2.5 py-1.5 rounded-none text-[9.5px] leading-relaxed w-[145px] sm:w-[165px] text-left text-[#F7D070] shadow-lg z-30 pointer-events-none"
                      >
                        {mascotBubble}
                        <div className="absolute left-[65%] sm:left-1/2 -bottom-[5px] -translate-x-1/2 w-2 h-2 bg-[#33184a] border-r-2 border-b-2 border-[#FFE8F5]" style={{ transform: 'rotate(45deg)' }} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <button
                    type="button"
                    onClick={() => {
                      triggerMascotPhrase('chick', `🐥 叽叽小七发来全天候快乐电波，向着幸福全速进发！`);
                      if (musicRef.current) musicRef.current.playManualNote(1318.51);
                    }}
                    className={`flex flex-col items-center gap-1 cursor-pointer transition-transform duration-100 ${
                      activeMascotId === 'chick' ? 'animate-pixel-bounce' : 'hover:-translate-y-1'
                    }`}
                  >
                    <svg viewBox="0 0 16 16" className="w-12 h-12">
                      <rect x="7" y="2" width="2" height="2" fill="#f7b731" />
                      <rect x="3" y="4" width="10" height="9" fill="#fed330" />
                      <rect x="4" y="8" width="1" height="1" fill="#eb3b5a" />
                      <rect x="11" y="8" width="1" height="1" fill="#eb3b5a" />
                      <rect x="5" y="7" width="1" height="1" fill="#2d3436" />
                      <rect x="10" y="7" width="1" height="1" fill="#2d3436" />
                      <rect x="7" y="8" width="2" height="2" fill="#fd9644" />
                      <rect x="5" y="13" width="2" height="1" fill="#fa8231" />
                      <rect x="9" y="13" width="2" height="1" fill="#fa8231" />
                    </svg>
                    <span className="text-[8px] px-1 bg-black/40 text-stone-300">小七 chick</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* 🌠 Pixel Crystal Music Box (晶莹水晶八音盒) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="w-full bg-[#1e072a]/95 border-4 border-[#FFE8F5] p-4 flex flex-col gap-3 relative shadow-md"
              style={{
                boxShadow: '0 4px 0 rgba(0,0,0,0.3)',
              }}
            >
              {/* Ribbon header */}
              <div className="flex items-center gap-1.5 justify-between border-b border-dashed border-[#7B5EA7]/30 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#F7D070] animate-pulse">🌠</span>
                  <span className="text-[11px] font-bold text-[#FFE8F5] tracking-wide font-pixel">水晶星愿八音盒 (MUSIC BOX)</span>
                </div>
                <div className="flex gap-[1.5px]">
                  <span className="w-2.5 h-2.5 bg-pink-500 rounded-none" />
                  <span className="w-2.5 h-2.5 bg-purple-500 rounded-none" />
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-none" />
                </div>
              </div>

              {/* Player deck layout */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center py-1">
                {/* 1. Spinning Vinyl disc block */}
                <div className="sm:col-span-4 flex flex-col items-center justify-center gap-1.5">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    {/* The physical music box brass cylinder or vinyl record */}
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r from-yellow-700 via-[#1b0a23] to-yellow-600 border-2 border-amber-300 flex items-center justify-center shadow-lg ${
                      isMusicPlaying ? 'animate-spin-slow' : ''
                    }`}>
                      <div className="w-8 h-8 rounded-full bg-pink-900 border border-pink-400 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-yellow-300" />
                      </div>
                    </div>
                    {/* Floating sparkling note indicator */}
                    {isMusicPlaying && (
                      <motion.span
                        animate={{ y: [-10, -25], x: [0, 8], opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeOut' }}
                        className="absolute text-xs text-[#F7D070] select-none pointer-events-none"
                      >
                        🎵
                      </motion.span>
                    )}
                  </div>
                  <span className="text-[8.5px] text-[#C9A9E9] tracking-widest font-pixel">
                    {isMusicPlaying ? "正在演奏中..." : "八音盒未启动"}
                  </span>
                </div>

                {/* 2. Controls & Vol slider */}
                <div className="sm:col-span-8 flex flex-col gap-2">
                  <div className="flex gap-2 w-full justify-center sm:justify-start">
                    {/* Play Toggle Button */}
                    <button
                      onClick={() => {
                        playClickSound();
                        if (musicRef.current) {
                          if (isMusicPlaying) {
                            musicRef.current.pause();
                            setIsMusicPlaying(false);
                          } else {
                            musicRef.current.play();
                            setIsMusicPlaying(true);
                          }
                        }
                      }}
                      className={`text-[10px] px-3 py-1.5 border-2 border-[#FFE8F5] font-pixel font-bold flex items-center gap-1 cursor-pointer transition-all active:translate-y-0.5 ${
                        isMusicPlaying
                          ? 'bg-[#FF8FA3] text-[#11071c]'
                          : 'bg-[#7B5EA7] text-[#FFE8F5] hover:bg-[#8d71b9]'
                      }`}
                    >
                      {isMusicPlaying ? "⏸  停止背景声音" : "▶  开启背景声音"}
                    </button>

                    {/* Quick Star Chimes Volume */}
                    <div className="flex items-center gap-1 bg-black/40 border border-[#C9A9E9]/40 px-2 py-0.5 text-[9px] text-[#FFE8F5]">
                      <span className="text-[#C9A9E9] scale-90">音量:</span>
                      <button
                        onClick={() => {
                          playClickSound();
                          if (musicRef.current) {
                            musicRef.current.setVolume(0.12);
                          }
                        }}
                        className="px-1 text-[#F5C6EA] hover:text-[#FFE8F5] font-pixel bg-[#7B5EA7]/20 border border-[#7B5EA7]/40 text-[8px]"
                        title="较弱"
                      >
                        弱
                      </button>
                      <button
                        onClick={() => {
                          playClickSound();
                          if (musicRef.current) {
                            musicRef.current.setVolume(0.25);
                          }
                        }}
                        className="px-1 text-[#F5C6EA] hover:text-[#FFE8F5] font-pixel bg-[#7B5EA7]/40 border border-[#FFE8F5]/30 text-[8px]"
                        title="中等"
                      >
                        中
                      </button>
                      <button
                        onClick={() => {
                          playClickSound();
                          if (musicRef.current) {
                            musicRef.current.setVolume(0.48);
                          }
                        }}
                        className="px-1 text-white hover:text-white font-pixel bg-[#FF8FA3]/80 border border-[#FFE8F5]/30 text-[8px]"
                        title="明亮"
                      >
                        强
                      </button>
                    </div>
                  </div>

                  <p className="text-[9px] text-[#C9A9E9] leading-relaxed text-center sm:text-left font-pixel">
                    💡 提示：高品质 8 音盒完全利用 Web Audio API 纯物理合成。如果未听到声音，轻按上方【播放音乐】或下方的【彩色音铃】即可激活通道！
                  </p>
                </div>
              </div>

              {/* 3. Interactive Piano Bells (琴键/音铃) */}
              <div className="flex flex-col gap-1.5 mt-1 border-t border-dashed border-[#7B5EA7]/30 pt-2 pb-1">
                <span className="text-[9px] text-[#F7D070] tracking-wide font-pixel text-center sm:text-left">
                  🎹 璀璨互动：请敲击下方琴键，定制属于你的晶莹祝福回响！
                </span>

                <div className="grid grid-cols-7 gap-1.5 mt-1">
                  {[
                    { note: "G5", freq: 783.99, color: "bg-[#7B5EA7]" },
                    { note: "A5", freq: 880.00, color: "bg-[#8D6CAB]" },
                    { note: "B5", freq: 987.77, color: "bg-[#9E7DBC]" },
                    { note: "C6", freq: 1046.50, color: "bg-[#B08ECD]" },
                    { note: "D6", freq: 1174.66, color: "bg-[#C19FDE]" },
                    { note: "E6", freq: 1318.51, color: "bg-[#D2B0EE]" },
                    { note: "G6", freq: 1567.98, color: "bg-[#FF8FA3]" },
                  ].map((bell) => (
                    <button
                      key={bell.note}
                      onClick={() => {
                        if (musicRef.current) {
                          musicRef.current.playManualNote(bell.freq);
                        }
                      }}
                      className={`relative flex flex-col items-center justify-center py-2.5 border border-[#FFE8F5]/45 text-white font-pixel font-bold rounded-none ${bell.color} cursor-pointer hover:brightness-110 active:scale-95 active:border-yellow-250 transition-all shadow-sm`}
                    >
                      {/* Bell ornament graphic inside */}
                      <span className="text-[9.5px] tracking-tighter">{bell.note}</span>
                      <span className="text-[8px] scale-90 opacity-80 text-amber-200 mt-0.5">🔔</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Theme switcher triggers */}
            <div className="w-full flex justify-between bg-[#11071c]/75 p-1.5 border-4 border-[#FFE8F5] shadow-inner font-pixel overflow-x-auto whitespace-nowrap relative">
              {!isSharedView && (
                <button
                  onClick={() => {
                    playClickSound();
                    setIsEditingThemes(!isEditingThemes);
                  }}
                  className="absolute -top-6 right-0 text-[10px] text-[#FF8FA3] hover:text-white flex items-center gap-1 font-bold z-20 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" /> {isEditingThemes ? '完成编辑' : '编辑按钮'}
                </button>
              )}
              {BLESSING_THEMES.map((theme, idx) => (
                isEditingThemes ? (
                  <input
                    key={theme.id}
                    type="text"
                    value={customThemeNames[idx] || theme.name}
                    onChange={(e) => {
                       const newNames = [...customThemeNames];
                       if (newNames.length === 0) {
                         BLESSING_THEMES.forEach((t, i) => newNames[i] = t.name);
                       }
                       newNames[idx] = e.target.value;
                       setCustomThemeNames(newNames);
                    }}
                    className={`px-2 py-1 w-24 text-[10.5px] tracking-wider font-bold transition-all text-center focus:outline-none ${
                      selectedThemeIndex === idx
                        ? 'bg-[#FF8FA3] text-[#FFE8F5] border-2 border-[#FFE8F5]'
                        : 'bg-black/50 text-[#C9A9E9] border border-[#7B5EA7]'
                    }`}
                  />
                ) : (
                  <button
                    key={theme.id}
                    onClick={() => {
                      playClickSound();
                      setSelectedThemeIndex(idx);
                    }}
                    className={`px-3 py-2 text-[10.5px] tracking-wider font-bold transition-all duration-150 cursor-pointer ${
                      selectedThemeIndex === idx
                        ? 'bg-[#FF8FA3] text-[#FFE8F5] border-2 border-[#FFE8F5]'
                        : 'text-[#C9A9E9] hover:text-[#FFE8F5]'
                    }`}
                  >
                    {customThemeNames[idx] || theme.name}
                  </button>
                )
              ))}
            </div>

            {/* Typewriter text bubble layout */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative w-full bg-[#200B36]/90 border-4 border-[#FFE8F5] rounded-none p-4 sm:p-5 pt-6 sm:pt-6 flex flex-col gap-4 min-h-[300px]"
              style={{
                boxShadow: '0 5px 0 rgba(0,0,0,0.3)',
              }}
            >
              {/* Custom retro ribbon tag */}
              <div className="absolute -top-3.5 left-4 px-2.5 py-0.5 bg-[#FF8FA3] border-2 border-[#FFE8F5] text-[9px] tracking-widest text-[#FFE8F5] font-bold uppercase animate-pulse">
                HAPPY BIRTHDAY LETTER
              </div>

              {/* Title Section */}
              <div className="mt-2 text-center">
                {isEditingLetter ? (
                  <input
                    type="text"
                    value={editTitleInput}
                    onChange={(e) => setEditTitleInput(e.target.value)}
                    className="w-full bg-black/40 border border-[#F5C6EA] text-[#FFE8F5] text-base px-2 py-1 focus:outline-none text-center font-pixel font-bold tracking-widest uppercase mb-1"
                    placeholder="输入祝福标题"
                  />
                ) : (
                  <h3 className={`text-base font-pixel font-bold text-[#FFE8F5] tracking-widest p-1 drop-shadow-pixel-glow uppercase ${isTyping && typedTitle.length < getPersonalizedTitle().length ? 'typing-cursor' : ''}`}>
                    {typedTitle}
                  </h3>
                )}
                <div className="w-full border-t-2 border-dotted border-[#F7D070]/60 mt-1" />
              </div>

              {/* Message text content */}
              <div className="flex flex-col gap-4 my-1.5 font-pixel leading-[1.8] text-[12px] text-[#FFE8F5]/90">
                {isEditingLetter ? (
                  <textarea
                    value={editParasInput}
                    onChange={(e) => setEditParasInput(e.target.value)}
                    className="w-full bg-black/40 border border-[#F5C6EA] text-[#FFE8F5] text-[12px] p-2 focus:outline-none min-h-[200px]"
                    placeholder="请输入祝福段落，使用回车空行分隔不同段落..."
                  />
                ) : (
                  typedParagraphs.map((para, pIdx) => {
                    const pageParas = getPersonalizedParagraphs().slice(currentPageOfLetter === 0 ? 0 : 3, currentPageOfLetter === 0 ? 3 : 6);
                    const currentFullParaGroup = pageParas[pIdx];
                    const isCurrentActiveLine = isTyping && pIdx === typedParagraphs.length - 1;
                    return (
                      <p
                        key={pIdx}
                        className={`text-[#FFF2B2] drop-shadow-[0_1.5px_0_rgba(17,7,28,0.95)] font-medium ${isCurrentActiveLine && para.length < (currentFullParaGroup?.length || 0) ? 'typing-cursor' : ''}`}
                      >
                        {renderParagraphWithHighlights(para)}
                      </p>
                    );
                  })
                )}
              </div>

              {/* Page indicator pagination controls */}
              <div className="flex justify-center items-center gap-1.5 mt-2 py-1.5 bg-black/20 border border-dashed border-[#7B5EA7]/30 select-none">
                <button
                  type="button"
                  disabled={currentPageOfLetter === 0}
                  onClick={() => {
                    playClickSound();
                    setCurrentPageOfLetter(0);
                    setTypewriterTrigger(prev => prev + 1);
                  }}
                  className={`px-2 py-1 text-[9px] border font-bold font-pixel cursor-pointer transition-colors ${
                    currentPageOfLetter === 0
                      ? 'bg-black/30 text-[#FFE8F5]/20 border-[#FFE8F5]/10 cursor-not-allowed'
                      : 'bg-[#7B5EA7] text-[#FFE8F5] border-[#FFE8F5] hover:bg-[#8e6fc2]'
                  }`}
                >
                  ◀ 上一页 (PREV)
                </button>
                <span className="text-[10px] text-[#FFE6A1] font-bold tracking-wider px-3 select-none">
                  第 {currentPageOfLetter + 1} / 2 页
                </span>
                <button
                  type="button"
                  disabled={currentPageOfLetter === 1}
                  onClick={() => {
                    playClickSound();
                    setCurrentPageOfLetter(1);
                    setTypewriterTrigger(prev => prev + 1);
                  }}
                  className={`px-2 py-1 text-[9px] border font-bold font-pixel cursor-pointer transition-colors ${
                    currentPageOfLetter === 1
                      ? 'bg-black/30 text-[#FFE8F5]/20 border-[#FFE8F5]/10 cursor-not-allowed'
                      : 'bg-[#7B5EA7] text-[#FFE8F5] border-[#FFE8F5] hover:bg-[#8e6fc2]'
                  }`}
                >
                  下一页 (NEXT) ▶
                </button>
              </div>

              {/* Author signature details */}
              {isEditingLetter ? (
                <div className="self-end text-right mt-2 mr-1 border-t-2 border-dashed border-[#7B5EA7]/50 pt-2 w-[70%]">
                  <input
                    type="text"
                    value={editSigInput}
                    onChange={(e) => setEditSigInput(e.target.value)}
                    className="w-full bg-black/40 border border-[#F5C6EA] text-[#FFE8F5] text-[11px] px-2 py-1 focus:outline-none text-right font-pixel font-bold tracking-wide"
                    placeholder="输入署名"
                  />
                  <input
                    type="text"
                    value={editDateInput}
                    onChange={(e) => setEditDateInput(e.target.value)}
                    className="w-full bg-black/40 border border-[#F5C6EA] text-[#C9A9E9] text-[8px] px-2 py-1 focus:outline-none text-right font-english tracking-widest mt-1 uppercase"
                    placeholder="输入日期 (例如 2026.08.30)"
                  />
                </div>
              ) : typedSignature ? (
                <div className="self-end text-right mt-2 mr-1 border-t-2 border-dashed border-[#7B5EA7]/50 pt-2 w-[70%]">
                  <span className={`text-[11px] font-bold tracking-wide text-[#F7D070] block ${isTyping && typedSignature.length < getPersonalizedSignature().length ? 'typing-cursor' : ''}`}>
                    —— {typedSignature}
                  </span>
                  <span className="text-[8px] font-english text-[#C9A9E9]/70 uppercase tracking-widest mt-0.5 block leading-relaxed">
                    {customDate || new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')}
                  </span>
                </div>
              ) : null}

              {/* Utility hotkeys */}
              <div className="flex flex-wrap items-center justify-between border-t-2 border-dotted border-[#7B5EA7]/30 pt-3.5 mt-auto text-[10px] text-[#C9A9E9] gap-2">
                {!isEditingLetter && (
                  <>
                    <button
                      onClick={handleRestartTyping}
                      className="flex items-center gap-1 hover:text-[#FFE8F5] transition-colors cursor-pointer group"
                    >
                      <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                      <span>重新放映 (REPLAY)</span>
                    </button>

                    {isTyping && (
                      <button
                        onClick={handleSkipTyping}
                        className="flex items-center gap-1 hover:text-[#FFE8F5] transition-colors cursor-pointer animate-pulse font-bold"
                      >
                        <span>快速跳过 (SKIP)</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    
                    {!isSharedView && (
                      <button
                        onClick={() => {
                          playClickSound();
                          setEditTitleInput(customTitle || activeTheme.title);
                          setEditParasInput(getPersonalizedParagraphs().join('\n\n'));
                          setEditSigInput(customSignature || activeTheme.signature);
                          setEditDateInput(customDate || new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.'));
                          setIsEditingLetter(true);
                        }}
                        className="flex items-center gap-1 hover:text-[#FFE8F5] transition-colors cursor-pointer font-bold text-[#FF8FA3]"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>编辑文案 (EDIT)</span>
                      </button>
                    )}
                  </>
                )}
                
                {isEditingLetter && (
                  <div className="w-full flex justify-between">
                    <button
                      onClick={() => {
                        playClickSound();
                        setIsEditingLetter(false);
                      }}
                      className="px-3 py-1.5 bg-black/50 border border-[#FFE8F5] hover:bg-black/80 text-[#FFE8F5] cursor-pointer"
                    >
                      取消 (CANCEL)
                    </button>
                    <button
                      onClick={() => {
                        playClickSound();
                        setCustomTitle(editTitleInput);
                        setCustomParagraphs(editParasInput.split('\n\n').filter(p => p.trim()));
                        setCustomSignature(editSigInput);
                        setCustomDate(editDateInput);
                        setIsEditingLetter(false);
                        setTypewriterTrigger(prev => prev + 1); // replay to show changes
                      }}
                      className="px-4 py-1.5 bg-[#FF8FA3] border-2 border-[#FFE8F5] text-[#24133c] font-bold hover:bg-white cursor-pointer shadow-sm"
                    >
                      保存并放映 (SAVE)
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Interactive Photo Envelope Reveal (相片回忆信封) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="w-full"
            >
              <PhotoEnvelope
                birthdayName={birthdayName}
                birthdayAge={birthdayAge}
                initialPhotos={DEFAULT_MEMORY_PHOTOS}
                playClickSound={playClickSound}
                wishesList={wishesList}
                selectedThemeIndex={selectedThemeIndex}
              />
            </motion.div>

            {/* Interactive Candle Pond Widget (星空许愿烛) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full bg-[#200A38]/90 border-4 border-[#FFE8F5] p-3.5 sm:p-5 flex flex-col gap-4 shadow-md"
              style={{
                boxShadow: '0 5px 0 rgba(0,0,0,0.3)',
              }}
            >
              <div className="flex items-center gap-2">
                <div className="p-1 px-1.5 bg-[#FF8FA3]/40 border-2 border-[#FFE8F5] text-[#F7D070]">
                  <Gift className="w-4 h-4 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-xs font-pixel font-bold text-[#FFE8F5]">
                    秘密星心许愿池 (Wishing Well)
                  </h4>
                  <p className="text-[10px] text-[#C9A9E9]">向粉紫像素星河许个愿，烛火吹熄后即会出发</p>
                </div>
              </div>

              {/* Retro candle animation and blowout controls */}
              <div className="flex justify-center items-center py-2.5 relative border-2 border-dashed border-[#7B5EA7]/40 bg-black/30 p-2">
                <div className="flex flex-col items-center">
                  
                  {/* Floating Pixel Star Wish Text Animation */}
                  <AnimatePresence>
                    {floatingWishText && (
                      <motion.div
                        initial={{ y: 20, scale: 0.8, opacity: 0 }}
                        animate={{ y: -70, scale: [1, 1.15, 0.9], opacity: [0, 1, 1, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="absolute bottom-12 text-center flex flex-col items-center pointer-events-none z-30"
                      >
                        <div className="text-[10px] bg-[#FF8FA3] border-2 border-white px-2 py-0.5 text-[#24133c] font-bold font-pixel whitespace-nowrap shadow-md">
                          ⭐ {floatingWishText} ⭐
                        </div>
                        <div className="w-1.5 h-1.5 bg-[#FF8FA3] border border-white transform rotate-45 mt-0.5" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Glowing blocky pixel flame */}
                  <AnimatePresence>
                    {isCandleLit ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [1, 1.2, 1] }}
                        exit={{ scale: 0, y: -6, opacity: 0 }}
                        transition={{ repeat: isCandleLit ? Infinity : 0, duration: 1.0 }}
                        className="w-5 h-6 bg-[#F7D070] border-2 border-[#FFE8F5] cursor-pointer flex items-center justify-center shadow-[0_0_12px_#F7D070] z-10"
                        style={{
                          clipPath: 'polygon(50% 0%, 100% 40%, 80% 100%, 20% 100%, 0% 40%)',
                          imageRendering: 'pixelated'
                        }}
                        title="点击吹灭火苗"
                        onClick={() => {
                          playClickSound();
                          setIsCandleLit(false);
                          setWishNotification(`💨 呼…… 愿望伴随着烛光，在寿星【${birthdayName}】的心田里悄然成真！`);
                          setTimeout(() => {
                            setIsCandleLit(true);
                            setWishNotification('');
                          }, 5500);
                        }}
                      />
                    ) : (
                      <div className="h-6 flex items-center justify-center z-10">
                        <span className="text-[9px] text-[#F5C6EA] animate-pixel-blink font-bold tracking-widest font-english">SUCCESS!</span>
                      </div>
                    )}
                  </AnimatePresence>
                  
                  {/* Candle wick */}
                  <div className="w-1 h-2 bg-stone-700" />
                  
                  {/* Candle column */}
                  <div className="w-6 h-10 bg-[#FF8FA3] border-2 border-[#FFE8F5] relative flex flex-col justify-between py-1 overflow-hidden" 
                       style={{ boxShadow: 'inset -2px 0 0 rgba(0,0,0,0.2)' }}>
                    <div className="w-full h-0.5 bg-[#FFE8F5]/40" />
                    <Heart className="w-2.5 h-2.5 text-[#FFE8F5] self-center animate-pulse" />
                    <div className="w-full h-0.5 bg-black/15" />
                  </div>

                  {/* Candle stand plate */}
                  <div className="w-14 h-2 bg-[#7B5EA7] border-2 border-[#FFE8F5] rounded-none shadow" />
                </div>

                {isCandleLit && (
                  <div className="absolute right-3 top-3 text-[8px] text-[#F7D070] bg-[#7B5EA7]/30 px-1.5 py-0.5 border border-[#C9A9E9]/40 flex items-center gap-1 leading-none">
                    <span className="animate-ping font-bold">●</span>
                    <span>可点击吹熄</span>
                  </div>
                )}
              </div>

              {/* Wish Inputs */}
              <form onSubmit={handleMakeWish} className="flex flex-col min-[390px]:flex-row gap-2">
                <input
                  type="text"
                  placeholder="写下你心中的一个愿望..."
                  value={userWish}
                  onChange={(e) => setUserWish(e.target.value)}
                  maxLength={50}
                  className="flex-1 bg-[#11071c] border-2 border-[#C9A9E9] text-[#FFE8F5] text-[11px] rounded-none px-3 py-2 sm:py-2.5 focus:outline-none focus:border-[#F5C6EA] placeholder-[#C9A9E9]/40 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!userWish.trim()}
                  className={`px-3 py-2 sm:px-4 sm:py-2 text-[11px] font-bold border-2 transition-all duration-150 cursor-pointer whitespace-nowrap ${
                    userWish.trim()
                      ? 'bg-[#FF8FA3] border-[#FFE8F5] text-[#24133c] shadow-md hover:scale-[1.02] active:translate-y-0.5'
                      : 'bg-stone-900 border-[#C9A9E9]/20 text-stone-600 cursor-not-allowed'
                  }`}
                  style={{
                    boxShadow: userWish.trim() ? '0 3px 0 #7B5EA7' : 'none'
                  }}
                >
                  寄托愿望
                </button>
              </form>

              {/* Success Notification */}
              {wishNotification && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-[10.5px] text-center text-[#F7D070] bg-[#7B5EA7]/20 py-2 px-3 border-2 border-dotted border-[#F7D070]/60 leading-relaxed font-bold"
                >
                  {wishNotification}
                </motion.div>
              )}

              {/* Wish History tracker */}
              {wishesList.length > 0 && (
                <div className="flex flex-col gap-1.5 border-t-2 border-dotted border-[#7B5EA7]/30 pt-3">
                  <div className="text-[8px] text-[#C9A9E9] uppercase tracking-widest font-english">Wish Pool ({wishesList.length})</div>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pt-1">
                    {wishesList.map((wish, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-[10px] px-2.5 py-1 bg-[#7B5EA7]/30 border-2 border-[#C9A9E9]/30 text-[#FFE8F5]/90 flex items-center gap-1.5"
                      >
                        <span>{wish}</span>
                        <button 
                          type="button"
                          onClick={() => {
                            playClickSound();
                            setWishesList(prev => prev.filter((_, i) => i !== index));
                          }}
                          className="w-4 h-4 rounded-none bg-black/20 flex items-center justify-center hover:bg-red-500/30 text-stone-400 hover:text-white leading-none text-[8px]"
                          title="Remove wish"
                        >
                          ×
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Atmosphere custom control dashboard panels */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-full bg-[#11071c]/60 border-4 border-[#FFE8F5] p-4 flex flex-col gap-3"
              style={{
                boxShadow: '0 6px 0 rgba(0,0,0,0.3)',
              }}
            >
              <div className="text-[8px] text-[#C9A9E9] tracking-widest font-english font-bold">ATMOSPHERE CONTROLS</div>
              
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2 text-stone-200">
                  <span className={`${enableFireworks ? 'text-[#FF8FA3] animate-ping' : 'text-stone-600'}`}>■</span>
                  画布像素烟火 (Pixel Fireworks)
                </span>
                <button
                  onClick={() => {
                    playClickSound();
                    setEnableFireworks(!enableFireworks);
                  }}
                  className={`w-11 h-6 rounded-none relative flex items-center transition-colors duration-150 border-2 border-[#FFE8F5] cursor-pointer ${
                    enableFireworks ? 'bg-[#7B5EA7]' : 'bg-black/30'
                  }`}
                >
                  <span
                    className={`w-4 h-4 bg-[#FFE8F5] transform transition-transform duration-150 absolute ${
                      enableFireworks ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2 text-stone-200">
                  <span className={`${enablePetals ? 'text-[#85E3A1] animate-ping' : 'text-stone-600'}`}>■</span>
                  星空飘落粒子 (Drifting Sakura)
                </span>
                <button
                  onClick={() => {
                    playClickSound();
                    setEnablePetals(!enablePetals);
                  }}
                  className={`w-11 h-6 rounded-none relative flex items-center transition-colors duration-150 border-2 border-[#FFE8F5] cursor-pointer ${
                    enablePetals ? 'bg-[#7B5EA7]' : 'bg-black/30'
                  }`}
                >
                  <span
                    className={`w-4 h-4 bg-[#FFE8F5] transform transition-transform duration-150 absolute ${
                      enablePetals ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              <div className="text-[9px] text-[#C9A9E9]/60 leading-relaxed text-center italic mt-1 font-light border-t-2 border-dotted border-[#7B5EA7]/30 pt-2 font-pixel">
                * 玩家小提示：用手指或滑鼠划过夜空、寿星照片、或者萌宠可以燃起大波彩色烟火哦 ✨
              </div>
            </motion.div>

            {/* Generate Custom Site Button */}
            {!isSharedView && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="w-full mt-2 flex justify-center"
              >
                <button
                  type="button"
                  onClick={handleShareLink}
                  className="w-full py-4 bg-[#FF8FA3] border-4 border-[#FFE8F5] text-[#24133c] text-sm font-pixel font-bold tracking-wider hover:bg-white active:scale-[0.98] active:translate-y-1 cursor-pointer shadow-lg flex items-center justify-center gap-2 transition-transform duration-75 touch-manipulation select-none"
                  style={{ boxShadow: '0 6px 0 #7B5EA7' }}
                >
                  <Share2 className="w-5 h-5" />
                  <span>生成并复制专属分享链接 (SHARE LINK)</span>
                </button>
              </motion.div>
            )}

            {/* Aesthetic bottom retro footer credits */}
            <div className="text-center text-[9px] text-[#C9A9E9] tracking-widest flex flex-col items-center justify-center gap-2 pt-3 border-t-2 border-dotted border-[#7B5EA7]/20 mt-3 leading-normal font-mono font-bold">
              <div className="flex items-center justify-center gap-1.5 uppercase">
                <span>愿你今夜被像素星辰温柔拥抱</span>
                <span>•</span>
                <span>HAPPY BIRTHDAY</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-[8.5px] text-[#FFB7D5] font-pixel tracking-wide normal-case mt-0.5 opacity-90">
                <span>✨ 慢奏次元song</span>
                <span className="opacity-40">•</span>
                <span>小红书：19817126719a ✨</span>
              </div>
            </div>

            {/* Retro Pixel Modal Echo Popup Box */}
            <AnimatePresence>
              {wishSuccessModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="w-full max-w-sm bg-[#2c1342] border-4 border-[#FF8FA3] p-5 text-center shadow-2xl relative"
                    style={{ boxShadow: '0 8px 0 rgba(0,0,0,0.5)' }}
                  >
                    {/* Retro sparkles decor */}
                    <div className="absolute -top-4 -left-4 w-8 h-8 pointer-events-none text-[#F7D070] animate-bounce">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-8 h-8 pointer-events-none text-[#F7D070] animate-bounce delay-150">
                      <Sparkles className="w-6 h-6" />
                    </div>

                    {/* Modal Header */}
                    <div className="inline-block px-3 py-1 bg-[#F7D070] border-2 border-[#FFE8F5] text-[10px] text-[#24133c] font-pixel font-bold mb-3">
                      【 像素神明的回响 】
                    </div>

                    {/* Modal content */}
                    <p className="text-xs text-[#FFE8F5] leading-relaxed mb-4 font-pixel">
                      叮咚！仙女和像素诸神已经收到你的祈愿：
                    </p>
                    <div className="bg-[#190726] border-2 border-dashed border-[#C9A9E9] p-3 mb-5 text-[11px] text-[#FFB7D5] font-pixel font-bold leading-relaxed whitespace-normal break-all">
                      “ {wishSuccessModal.wishText} ”
                    </div>
                    <p className="text-[10px] text-[#C9A9E9]/90 mb-6 font-pixel leading-relaxed">
                      你的心愿已封存入像素星河，在新的一岁里它们终将汇成璀璨银河、默默守护着你！✨
                    </p>

                    {/* Close button */}
                    <button
                      onClick={() => {
                        playClickSound();
                        setWishSuccessModal({ isOpen: false, wishText: '' });
                        // Re-light candle after exit
                        setTimeout(() => {
                          setIsCandleLit(true);
                        }, 500);
                      }}
                      className="w-full py-2 bg-[#FF8FA3] border-2 border-[#FFE8F5] text-[#24133c] text-xs font-bold font-pixel cursor-pointer hover:bg-white hover:text-black active:translate-y-0.5 shadow-md"
                      style={{ boxShadow: '0 3px 0 #7B5EA7' }}
                    >
                      心领神会 (CLOSE)
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
            {/* Share Modal Box */}
            <AnimatePresence>
              {shareModal.isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="w-full max-w-sm bg-[#2c1342] border-4 border-[#FF8FA3] p-5 text-center shadow-2xl relative flex flex-col gap-3"
                    style={{ boxShadow: '0 8px 0 rgba(0,0,0,0.5)' }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setShareModal(prev => ({ ...prev, isOpen: false }));
                      }}
                      className="absolute top-2.5 right-2.5 p-1 bg-[#FF8FA3] border border-white text-black hover:bg-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    <div className="inline-block px-3 py-1 bg-[#F7D070] border-2 border-[#FFE8F5] text-[10px] text-[#24133c] font-pixel font-bold mt-2 mx-auto">
                      ✨ 专属生日网页链接已生成 ✨
                    </div>

                    <p className="text-xs text-[#FFE8F5] font-pixel leading-relaxed">
                      {shareModal.copied 
                        ? "已成功将包含你定制照片和文字的专属链接复制到剪贴板！" 
                        : "专属链接已生成，请手动复制下方网址："}
                    </p>

                    <div className="w-full bg-[#190726] border-2 border-dashed border-[#C9A9E9] p-2 text-[10px] text-[#FFB7D5] font-mono break-all select-all">
                      {shareModal.url}
                    </div>

                    <p className="text-[10px] text-[#C9A9E9] font-pixel leading-relaxed text-left">
                      发送此链接给寿星或朋友，对方在任何手机/电脑浏览器打开，都会直接显示你修改并上传的所有回忆照片与定制文字！新网页只可查看，不再显示编辑功能。❤️
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        if (navigator.clipboard && navigator.clipboard.writeText) {
                          navigator.clipboard.writeText(shareModal.url);
                          setShareModal(prev => ({ ...prev, copied: true }));
                        }
                      }}
                      className="w-full py-2.5 mt-2 bg-[#FF8FA3] border-2 border-[#FFE8F5] text-[#24133c] text-xs font-bold font-pixel cursor-pointer hover:bg-white active:translate-y-0.5 shadow-md flex items-center justify-center gap-1.5"
                      style={{ boxShadow: '0 4px 0 #7B5EA7' }}
                    >
                      {shareModal.copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{shareModal.copied ? "已复制！可以粘贴发送了" : "点击复制专属链接"}</span>
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
