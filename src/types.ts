/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Blessing package content
export interface BlessingTheme {
  id: string;
  name: string;
  title: string;
  paragraphs: string[];
  signature: string;
}

// Canvas particle systems
export interface MemoryPhoto {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  date?: string;
  description?: string;
  isCustomCover?: boolean;
}

export interface TwinkleStar {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  increasing: boolean;
}

export interface Petal {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  angle: number;
  spinSpeed: number;
  color: string;
}

export interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  decay: number;
  gravity: number;
  size: number;
}

export interface FireworkRocket {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  color: string;
  exploded: boolean;
}
