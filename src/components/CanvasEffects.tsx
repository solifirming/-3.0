/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { TwinkleStar, Petal, FireworkParticle, FireworkRocket } from '../types';

interface CanvasEffectsProps {
  enableFireworks: boolean;
  enablePetals: boolean;
}

export default function CanvasEffects({ enableFireworks, enablePetals }: CanvasEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // We do NOT want anti-aliasing for nice sharp pixel rendering!
    ctx.imageSmoothingEnabled = false;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Align to dpr for perfect pixel-art layouts without fuzzy scaling
    const dpr = window.devicePixelRatio || 1;
    // For pixel art, we can actually scale the canvas down slightly to make pixels bigger & more retro!
    // Scaling by dpr is for crisp graphics; to make retro blocks feel authentic, we can render on a lower-res buffer.
    // Let's use a base scale or render blocky pixel sizes directly! This runs lightning fast too on mobile.
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: entryWidth, height: entryHeight } = entry.contentRect;
        width = entryWidth;
        height = entryHeight;
        canvas.width = entryWidth * dpr;
        canvas.height = entryHeight * dpr;
        ctx.scale(dpr, dpr);
        initStars();
        initPetals();
      }
    });

    resizeObserver.observe(canvas.parentElement || document.body);

    const stars: TwinkleStar[] = [];
    const petals: Petal[] = [];
    const rockets: FireworkRocket[] = [];
    const fragments: FireworkParticle[] = [];

    // Initialize retro stars
    const initStars = () => {
      stars.length = 0;
      // Dense but retro space
      const count = Math.min(80, Math.floor((width * height) / 9500));
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.85,
          size: Math.random() > 0.65 ? 3 : 1, // 1x1 pixel or 3x3 cross pixel
          opacity: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.015 + 0.005,
          increasing: Math.random() > 0.5,
        });
      }
    };

    // Initialize falling pixel petals/cherry blossoms
    const initPetals = () => {
      petals.length = 0;
      if (!enablePetals) return;
      const count = 28;
      // Animal Crossing pastel cherry blossom & star token colors
      const petalColors = [
        '#F5C6EA', // Pastel warm pink
        '#C9A9E9', // Lavender purple
        '#FFE8F5', // Cream blossom pink
        '#FFB7D5', // Sakura pink
        '#A1E3D8', // Mint green accent
      ];
      for (let i = 0; i < count; i++) {
        petals.push({
          x: Math.random() * width,
          y: Math.random() * height - height, // start above the fold
          size: Math.floor(Math.random() * 3) * 2 + 5, // size: 5, 7, 9 (odd numbers look great in squares)
          opacity: Math.random() * 0.4 + 0.6,
          speedX: Math.random() * 0.8 - 0.4,
          speedY: Math.random() * 0.6 + 0.5, // slow, cozy drift
          angle: Math.random() * Math.PI * 2,
          spinSpeed: (Math.random() * 0.02 - 0.01) * Math.PI,
          color: petalColors[Math.floor(Math.random() * petalColors.length)],
        });
      }
    };

    initStars();
    initPetals();

    const launchFirework = (startX: number, targetX?: number, targetHeight?: number) => {
      if (!enableFireworks) return;
      const finalX = targetX ?? startX;
      // Launch target heights
      const targetY = targetHeight ?? (Math.random() * height * 0.3 + height * 0.15);
      const fireworkColors = [
        '#F5C6EA', // Soft pink
        '#FFE8F5', // Sweet cream white
        '#C9A9E9', // Bright lavender purple
        '#7B5EA7', // Rich violet
        '#F7D070', // Starry gold
        '#A1E3D8', // Minty pixel green
        '#FF8FA3', // Strawberry pink
      ];
      const color = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];

      rockets.push({
        x: Math.floor(finalX),
        y: height - 10,
        targetY: Math.floor(targetY),
        vy: -(Math.random() * 4 + 7), // Cozy velocity
        color: color,
        exploded: false,
      });
    };

    const explodeFirework = (x: number, y: number, color: string) => {
      const pCount = Math.floor(Math.random() * 20) + 32; // Cozy block count
      const baseAngle = Math.random() * Math.PI;

      for (let i = 0; i < pCount; i++) {
        const angle = baseAngle + (i * ((Math.PI * 2) / pCount)) + (Math.random() * 0.2 - 0.1);
        const speed = Math.random() * 2.8 + 1.0;
        
        // Square particle configs
        fragments.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: color,
          alpha: 1.0,
          decay: Math.random() * 0.018 + 0.012, // Dreamy pixel fade out
          gravity: 0.05, // Gravitational pull on chunks
          size: Math.random() > 0.5 ? 4 : 2, // 4x4 or 2x2 blocks
        });
      }

      // Secondary white core burst
      if (Math.random() > 0.4) {
        const whiteCoreCount = 12;
        for (let i = 0; i < whiteCoreCount; i++) {
          const angle = (i * ((Math.PI * 2) / whiteCoreCount));
          const speed = 0.8;
          fragments.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: '#FFE8F5', // Creamy white
            alpha: 1.0,
            decay: 0.025,
            gravity: 0.03,
            size: 3, // 3x3 block
          });
        }
      }
    };

    let autoLaunchTimer = 0;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, input, textarea, select, a, [role="button"], label, form')) {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      launchFirework(clickX, clickX, clickY);
    };

    const handleGlobalTouch = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const target = e.target as HTMLElement;
      if (target.closest('button, input, textarea, select, a, [role="button"], label, form')) {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const clickX = touch.clientX - rect.left;
      const clickY = touch.clientY - rect.top;
      launchFirework(clickX, clickX, clickY);
    };

    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('touchstart', handleGlobalTouch, { passive: true });

    // Tick loops
    const tick = () => {
      // Retro trail: instead of completely clearing, render an opaque dark retro purple layer
      ctx.fillStyle = 'rgba(26, 15, 43, 0.22)';
      ctx.fillRect(0, 0, width, height);

      // 1. Draw Starry Sky Background with Pixel Star blocks
      // Stars twinkle
      stars.forEach((star) => {
        if (star.increasing) {
          star.opacity += star.speed;
          if (star.opacity >= 0.95) star.increasing = false;
        } else {
          star.opacity -= star.speed;
          if (star.opacity <= 0.15) star.increasing = true;
        }

        const px = Math.floor(star.x);
        const py = Math.floor(star.y);
        ctx.fillStyle = `rgba(255, 232, 245, ${star.opacity})`;

        if (star.size > 1) {
          // Exquisite 8-bit star cross sprite:
          //    ■
          //  ■ ■ ■
          //    ■
          ctx.fillRect(px, py, 3, 3);
          ctx.fillRect(px - 3, py, 3, 3);
          ctx.fillRect(px + 3, py, 3, 3);
          ctx.fillRect(px, py - 3, 3, 3);
          ctx.fillRect(px, py + 3, 3, 3);
        } else {
          // 2x2 discrete single pixel
          ctx.fillRect(px, py, 2, 2);
        }
      });

      // 2. Falling Pixel Cherry Blossom Sakura Blossoms / Leaves
      if (enablePetals) {
        petals.forEach((p) => {
          p.y += p.speedY;
          p.x += Math.sin(p.angle) * 0.4 + p.speedX;
          p.angle += p.spinSpeed;

          // Out-of-bounds loops
          if (p.y > height + 10) {
            p.y = -10;
            p.x = Math.random() * width;
          }
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;

          const px = Math.floor(p.x);
          const py = Math.floor(p.y);
          const size = Math.floor(p.size);

          ctx.fillStyle = p.color;
          // Draw neat pixelated tile block or angled square for petals
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(Math.floor(p.angle * 4) / 4); // snap rotation to feel retro/pixelated!
          
          // Pixelated cross star/diamond or box
          ctx.fillRect(-Math.floor(size / 2), -Math.floor(size / 2), size, size);
          // Highlight pixel
          ctx.fillStyle = '#FFE8F5';
          ctx.fillRect(-Math.floor(size / 2) + 1, -Math.floor(size / 2) + 1, 2, 2);
          
          ctx.restore();
        });
      }

      // 3. Pixel Rocket pathing
      if (enableFireworks) {
        for (let i = rockets.length - 1; i >= 0; i--) {
          const r = rockets[i];
          r.y += r.vy;

          const rx = Math.floor(r.x);
          const ry = Math.floor(r.y);

          // Draw blocky pixel rocket
          ctx.fillStyle = r.color;
          ctx.fillRect(rx - 2, ry - 2, 5, 5); // 5x5 rocket head
          
          // Draw a blocky core white spark
          ctx.fillStyle = '#FFE8F5';
          ctx.fillRect(rx - 1, ry - 1, 3, 3);

          // Trail sparks (descending square blocks)
          if (Math.random() > 0.3) {
            ctx.fillStyle = 'rgba(255, 232, 245, 0.7)';
            ctx.fillRect(rx - 1, ry + 4, 3, 3);
            ctx.fillRect(rx - 1, ry + 9, 2, 2);
          }

          if (r.y <= r.targetY || r.vy >= 0) {
            explodeFirework(rx, ry, r.color);
            rockets.splice(i, 1);
          }
        }

        // 4. Pixel Splinters
        for (let i = fragments.length - 1; i >= 0; i--) {
          const f = fragments[i];
          f.x += f.vx;
          f.y += f.vy;
          f.vy += f.gravity;
          f.alpha -= f.decay;

          if (f.alpha <= 0) {
            fragments.splice(i, 1);
            continue;
          }

          const fx = Math.floor(f.x);
          const fy = Math.floor(f.y);
          const size = Math.floor(f.size);

          ctx.fillStyle = f.color;
          ctx.save();
          ctx.globalAlpha = Math.floor(f.alpha * 5) / 5; // step-based transparent alpha
          
          ctx.fillRect(fx, fy, size, size);
          
          // Draw tiny light sparkle at center
          if (size > 2) {
            ctx.fillStyle = '#FFE8F5';
            ctx.fillRect(fx + 1, fy + 1, 1, 1);
          }
          ctx.restore();
        }

        // 5. Automatic launcher logic
        autoLaunchTimer++;
        if (autoLaunchTimer > 210) { // launch a rocket every 3.5 seconds
          launchFirework(Math.random() * (width * 0.7) + (width * 0.15));
          autoLaunchTimer = 0;
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('touchstart', handleGlobalTouch);
    };
  }, [enableFireworks, enablePetals]);

  return (
    <canvas
      ref={canvasRef}
      id="background-canvas"
      className="absolute top-0 left-0 w-full h-full block z-0 pointer-events-none"
      style={{ touchAction: 'none' }}
    />
  );
}
