import { MemoryPhoto } from './types';

const presetIds = new Set(['chapter-22', 'photo-snow', 'photo-bookstore', 'photo-cake', 'photo-lights']);

// 清除旧版预设相片，保留用户替换过的图片；空数组始终代表没有照片。
export function normalizePhotos(value: unknown): MemoryPhoto[] {
  if (!Array.isArray(value)) return [];
  return value.filter((photo): photo is MemoryPhoto => {
    if (!photo || typeof photo !== 'object' || typeof photo.url !== 'string') return false;
    return !(presetIds.has(photo.id) && (!photo.url || photo.url.startsWith('https://images.unsplash.com/')));
  });
}
