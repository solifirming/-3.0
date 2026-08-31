/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { VolumeX, Volume2 } from 'lucide-react';

export interface MusicPlayerRef {
  play: () => void;
  pause: () => void;
  isPlaying: () => boolean;
  playManualNote: (freq: number) => void;
  setVolume: (vol: number) => void;
}

interface MusicPlayerProps {
  isPlayingInitially?: boolean;
  onPlayingStateChange?: (playing: boolean) => void;
}

// Sparkly, dream-like high pitched C Major melody matching happy birthday theme
const melody = [
  // Happy birthday to you
  { freq: 783.99, dur: 0.5 }, // G5
  { freq: 783.99, dur: 0.5 }, // G5
  { freq: 880.00, dur: 1 },   // A5
  { freq: 783.99, dur: 1 },   // G5
  { freq: 1046.50, dur: 1 },  // C6
  { freq: 987.77, dur: 2 },   // B5

  // Happy birthday to you
  { freq: 783.99, dur: 0.5 }, // G5
  { freq: 783.99, dur: 0.5 }, // G5
  { freq: 880.00, dur: 1 },   // A5
  { freq: 783.99, dur: 1 },   // G5
  { freq: 1174.66, dur: 1 },  // D6
  { freq: 1046.50, dur: 2 },  // C6

  // Happy birthday to dear friend
  { freq: 783.99, dur: 0.5 }, // G5
  { freq: 783.99, dur: 0.5 }, // G5
  { freq: 1567.98, dur: 1 },  // G6 (high, extra sparkles!)
  { freq: 1318.51, dur: 1 },  // E6
  { freq: 1046.50, dur: 1 },  // C6
  { freq: 987.77, dur: 1 },   // B5
  { freq: 880.00, dur: 2 },   // A5

  // Happy birthday to you (ending)
  { freq: 1396.91, dur: 0.5 }, // F6
  { freq: 1396.91, dur: 0.5 }, // F6
  { freq: 1318.51, dur: 1 },  // E6
  { freq: 1046.50, dur: 1 },  // C6
  { freq: 1174.66, dur: 1 },  // D6
  { freq: 1046.50, dur: 3 },  // C6

  { freq: 0, dur: 3.5 },       // Magical air delay to let sparkles ring out!
];

const BPM = 125; // Warm, cozy tempo
const beatDuration = 60 / BPM;

const MusicPlayer = forwardRef<MusicPlayerRef, MusicPlayerProps>(({ isPlayingInitially = false, onPlayingStateChange }, ref) => {
  const [isPlayingState, setIsPlayingState] = useState(false);
  
  // Web Audio Context refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const effectsInletRef = useRef<GainNode | null>(null);
  const masterVolumeGainNodeRef = useRef<GainNode | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const noteIndexRef = useRef<number>(0);
  const schedulerTimerIdRef = useRef<any>(null);
  const isPlayingRef = useRef<boolean>(false);
  const currentVolumeRef = useRef<number>(0.45);

  // Sync state helper
  const updatePlayingState = (state: boolean) => {
    setIsPlayingState(state);
    isPlayingRef.current = state;
    if (onPlayingStateChange) {
      onPlayingStateChange(state);
    }
  };

  const initAudioContext = () => {
    if (typeof window === 'undefined') return;
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        effectsInletRef.current = null;
        masterVolumeGainNodeRef.current = null;
        
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;
        setupEffectsGraph(ctx);
      }
    }
  };

  // Setup master echo delay path with beautiful, direct projection
  const setupEffectsGraph = (ctx: AudioContext) => {
    if (effectsInletRef.current) return;

    // Master volume to keep overall sound warm and controlled
    const masterVolume = ctx.createGain();
    masterVolume.gain.setValueAtTime(currentVolumeRef.current, ctx.currentTime);
    masterVolumeGainNodeRef.current = masterVolume;

    // Direct path input node
    const inputBus = ctx.createGain();
    inputBus.gain.setValueAtTime(1.0, ctx.currentTime);

    // Route directly to masterVolume to ensure a clean, crisp chime sound with no overlapping echoes or feedback
    inputBus.connect(masterVolume);
    
    // Low-pass filter to smooth out any potential high chirp harshness
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(2800, ctx.currentTime); // Keeps sweet chiming sparkles, removes raw synthesizer hiss

    masterVolume.connect(lowpass);
    lowpass.connect(ctx.destination);

    effectsInletRef.current = inputBus;
  };

  // Sound generator for custom physical bell-like crystalloid chimes without scary organ fifths
  const playStarChime = (ctx: AudioContext, freq: number, duration: number, startTime: number) => {
    if (freq === 0 || !effectsInletRef.current) return;

    try {
      // 1. Fundamental warm core (pure sweet sinusoidal bell)
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      // 2. Sparkly octave (gives physical bell structure)
      const oscTwinkle1 = ctx.createOscillator();
      oscTwinkle1.type = 'sine';
      oscTwinkle1.frequency.setValueAtTime(freq * 2.0, startTime);

      // 3. Ultra-dainty super octave (stardust sparkle overlay)
      const oscTwinkle2 = ctx.createOscillator();
      oscTwinkle2.type = 'sine';
      oscTwinkle2.frequency.setValueAtTime(freq * 4.0, startTime);

      const gainCore = ctx.createGain();
      const gainTwinkle1 = ctx.createGain();
      const gainTwinkle2 = ctx.createGain();

      // Envelopes: Instant safe strike attack with smooth exponential ring-out
      gainCore.gain.setValueAtTime(0.40, startTime);
      gainCore.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      gainTwinkle1.gain.setValueAtTime(0.18, startTime);
      gainTwinkle1.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.55);

      gainTwinkle2.gain.setValueAtTime(0.10, startTime);
      gainTwinkle2.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.35);

      // Connections
      osc.connect(gainCore);
      oscTwinkle1.connect(gainTwinkle1);
      oscTwinkle2.connect(gainTwinkle2);

      gainCore.connect(effectsInletRef.current);
      gainTwinkle1.connect(effectsInletRef.current);
      gainTwinkle2.connect(effectsInletRef.current);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);

      oscTwinkle1.start(startTime);
      oscTwinkle1.stop(startTime + duration * 0.55 + 0.1);

      oscTwinkle2.start(startTime);
      oscTwinkle2.stop(startTime + duration * 0.35 + 0.1);
    } catch (err) {
      console.warn('Synth glitch safe-catch:', err);
    }
  };

  const startSequencer = () => {
    initAudioContext();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    // Fix: Ensure we clear any existing timer FIRST, so starting it multiple times doesn't freeze or lock up the scheduler!
    if (schedulerTimerIdRef.current) {
      clearTimeout(schedulerTimerIdRef.current);
      schedulerTimerIdRef.current = null;
    }

    const run = () => {
      // Start scheduling cursor from the relative current moment
      nextNoteTimeRef.current = ctx.currentTime + 0.05;
      
      const scheduleNextNotes = () => {
        const currentCtx = audioCtxRef.current;
        if (!currentCtx || currentCtx.state === 'closed' || !isPlayingRef.current) return;

        while (nextNoteTimeRef.current < currentCtx.currentTime + 0.22) {
          if (nextNoteTimeRef.current < currentCtx.currentTime) {
            nextNoteTimeRef.current = currentCtx.currentTime;
          }

          const currentNote = melody[noteIndexRef.current];
          const noteDuration = currentNote.dur * beatDuration;
          
          playStarChime(currentCtx, currentNote.freq, noteDuration - 0.015, nextNoteTimeRef.current);
          
          nextNoteTimeRef.current += noteDuration;
          noteIndexRef.current = (noteIndexRef.current + 1) % melody.length;
        }
        
        // Loop scheduler every 50ms
        schedulerTimerIdRef.current = setTimeout(scheduleNextNotes, 50);
      };

      updatePlayingState(true);
      scheduleNextNotes();
    };

    if (ctx.state === 'suspended') {
      ctx.resume()
        .then(() => {
          run();
        })
        .catch((err) => {
          console.warn('Context resume failed:', err);
          run();
        });
    } else {
      run();
    }
  };

  const stopSequencer = () => {
    if (schedulerTimerIdRef.current) {
      clearTimeout(schedulerTimerIdRef.current);
      schedulerTimerIdRef.current = null;
    }
    updatePlayingState(false);
  };

  // Expose play/pause & interactive note chimes safely
  useImperativeHandle(ref, () => ({
    play: () => {
      startSequencer();
    },
    pause: () => {
      stopSequencer();
    },
    isPlaying: () => {
      return isPlayingRef.current;
    },
    setVolume: (vol: number) => {
      currentVolumeRef.current = vol;
      if (masterVolumeGainNodeRef.current && audioCtxRef.current) {
        masterVolumeGainNodeRef.current.gain.setValueAtTime(vol, audioCtxRef.current.currentTime);
      }
    },
    playManualNote: (freq: number) => {
      // Allow plucking customized bells manually!
      initAudioContext();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const trigger = () => {
        playStarChime(ctx, freq, 1.8, ctx.currentTime);
      };

      if (ctx.state === 'suspended') {
        ctx.resume().then(trigger).catch(trigger);
      } else {
        trigger();
      }
    }
  }));

  // Touch/Click autoplay fallback trigger
  useEffect(() => {
    if (isPlayingInitially) {
      const handlePreGesture = () => {
        startSequencer();
        window.removeEventListener('click', handlePreGesture);
        window.removeEventListener('keydown', handlePreGesture);
      };
      
      window.addEventListener('click', handlePreGesture);
      window.addEventListener('keydown', handlePreGesture);
      
      try {
        startSequencer();
      } catch (err) {
        console.log('Autoplay deferred until user interacts');
      }

      return () => {
        window.removeEventListener('click', handlePreGesture);
        window.removeEventListener('keydown', handlePreGesture);
      };
    }
  }, [isPlayingInitially]);

  // Clean-up
  useEffect(() => {
    return () => {
      if (schedulerTimerIdRef.current) {
        clearTimeout(schedulerTimerIdRef.current);
        schedulerTimerIdRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      effectsInletRef.current = null;
      masterVolumeGainNodeRef.current = null;
    };
  }, []);

  const handleTogglePlay = () => {
    if (isPlayingState) {
      stopSequencer();
    } else {
      startSequencer();
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[99] flex items-center gap-2 select-none">
      {/* Visualizer Waves */}
      {isPlayingState && (
        <div className="flex items-end gap-[2px] h-4 px-2 bg-black/30 backdrop-blur-md rounded-full border border-pink-500/10 py-1">
          <span className="w-[2px] h-full bg-pink-400 rounded-full animate-audio-bar-1 origin-bottom" />
          <span className="w-[2px] h-full bg-pink-400 rounded-full animate-audio-bar-2 origin-bottom [animation-delay:0.15s]" />
          <span className="w-[2px] h-full bg-violet-400 rounded-full animate-audio-bar-3 origin-bottom [animation-delay:0.3s]" />
          <span className="w-[2px] h-full bg-violet-400 rounded-full animate-audio-bar-4 origin-bottom [animation-delay:0.45s]" />
        </div>
      )}

      {/* Spinning Cozy Chime Star Button */}
      <button
        onClick={handleTogglePlay}
        className="relative flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-r from-violet-900/60 to-pink-900/60 border border-pink-500/30 text-pink-200 hover:text-white shadow-[0_4px_12px_rgba(219,112,147,0.25)] hover:border-pink-400/50 backdrop-blur-md active:scale-95 transition-all duration-300 group cursor-pointer overflow-hidden"
        title={isPlayingState ? '暂停背景音乐' : '播放背景音乐'}
        aria-label={isPlayingState ? 'Pause background music' : 'Play background music'}
      >
        <div className="absolute inset-2 rounded-full border border-pink-500/10" />
        <div className="absolute inset-4 rounded-full border border-pink-500/5" />

        <div className={`relative ${isPlayingState ? 'animate-spin-slow' : ''}`}>
          {isPlayingState ? (
            <Volume2 className="w-5 h-5 text-pink-300 drop-shadow-sm group-hover:scale-105 transition-transform animate-pulse" />
          ) : (
            <VolumeX className="w-5 h-5 text-pink-400/80 group-hover:scale-105 transition-transform" />
          )}
        </div>
      </button>
    </div>
  );
});

MusicPlayer.displayName = 'MusicPlayer';

export default MusicPlayer;

