/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BlessingTheme } from './types';

export const BLESSING_THEMES: BlessingTheme[] = [
  {
    id: 'warm-heart',
    name: '温暖港湾',
    title: '致最亲爱、最特别的你 🌸',
    paragraphs: [
      '岁月的画笔，又在你的生命里悄然添上一抹温暖缤纷的色彩。',
      '愿你未来的日子里，所有的付出都会有甜美的收获与回响；',
      '愿你前行的每一个转角，都充满明媚的阳光和小确幸的快乐。',
      '在这个为你亮起生日星光的日子里，请放下所有生活的疲惫，',
      '尽情享受这份被爱、欢笑、甜点和惊喜包围的温暖时光。',
      '生日快乐！愿你此生无忧，所求皆所愿，所行皆坦途。'
    ],
    signature: '你挚爱的伙伴与朋友'
  },
  {
    id: 'star-dream',
    name: '璀璨星愿',
    title: '海风与漫天繁星的歌 🌌',
    paragraphs: [
      '悠长的风吹过蔚蓝海岛，漫天闪烁的星星在向你轻声歌唱。',
      '时光就像一颗神奇的种子，每一天都在你心田开出治愈快乐的小花。',
      '在新的一岁里，不需要总去拼命迎合世界，只管舒服快乐地做回自己。',
      '愿你不仅在今天，更在未来的每个清晨黄昏、四季交替之中，',
      '都能遇上让你发自内心微笑的风景，和简单、纯粹、温暖的人。',
      '愿你的生活永远有浪漫的事情发生，步履轻盈，快乐永伴。'
    ],
    signature: '来自云端的暖心来信'
  },
  {
    id: 'level-up',
    name: '星河极光',
    title: '恭喜升级！开启全新关卡 🚀',
    paragraphs: [
      '叮咚！伴随新一岁钟声敲响，你已完美解锁新一年度的成长增益！',
      '生命就像是一场奇妙的旅程，新的一页在向你闪烁，写满无限可能。',
      '愿你拥有一颗总是不觉疲倦的赤子之心，永远饱含探索世界的热望；',
      '愿你面对每一次挑战都能保持微笑，收获满格的快乐与无尽的动力。',
      '去追逐爱和梦想吧！去拥抱更广阔的原野，去活得自由而绚烂。',
      '生日快乐！愿你勇敢大步向前，沿途鲜花盛开，前路无限光明。'
    ],
    signature: '守护你的温馨星光'
  }
];

// Beautiful high-quality celebratory CDN image (cute pixel birthday cake)
export const DEFAULT_BIRTHDAY_IMAGE = 'https://images.unsplash.com/photo-1513201099495-a6998e4d1f2e?w=800&auto=format&fit=crop&q=80';

// Royalty free retro gaming/lofi/acoustic happy birthday tracker sound URLs
export const BACKGROUND_MUSIC_URL = 'https://pub-c5e31b5cdafb419a991161d10c2771a0.r2.dev/happy-birthday-piano.mp3';
export const CLICK_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav';

// 相片信封默认留空，由用户批量添加。
export const DEFAULT_MEMORY_PHOTOS = [];
