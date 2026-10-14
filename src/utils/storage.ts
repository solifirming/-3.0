/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const DB_NAME = 'PixelBirthdayDB';
const DB_VERSION = 1;
const STORE_NAME = 'cards';
const localWrites = new Map<string, Promise<void>>();

function openDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      let finished = false;
      const finish = (db: IDBDatabase | null) => {
        if (finished) { db?.close(); return; }
        finished = true; clearTimeout(timer); resolve(db);
      };
      const timer = setTimeout(() => finish(null), 1500);
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => finish(request.result);
      request.onblocked = () => finish(null);
      request.onerror = () => {
        console.warn('IndexedDB open error, falling back to localStorage');
        finish(null);
      };
    } catch {
      resolve(null);
    }
  });
}

/**
 * Save card data to IndexedDB with localStorage fallback
 */
export function saveCardToLocal(cardId: string, data: any): Promise<void> {
  // 捕获不可变快照并串行写入，避免较慢的旧 IndexedDB 写入覆盖新照片。
  const snapshot = JSON.parse(JSON.stringify(data));
  const previous = localWrites.get(cardId) || Promise.resolve();
  const job = previous.catch(() => {}).then(() => writeLocalSnapshot(cardId, snapshot));
  localWrites.set(cardId, job);
  void job.finally(() => { if (localWrites.get(cardId) === job) localWrites.delete(cardId); }).catch(() => {});
  return job;
}

async function writeLocalSnapshot(cardId: string, data: any): Promise<void> {
  // 1. Save to IndexedDB (supports large base64 images without 5MB quota errors)
  try {
    const db = await openDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(data, cardId);
      store.put(data, 'latest');
      await new Promise<void>((res) => {
        tx.oncomplete = () => res();
        tx.onerror = () => res();
      });
      db.close();
    }
  } catch (err) {
    console.warn('本机备份写入失败');
  }

  // 2. Also save to localStorage as quick fallback
  try {
    localStorage.setItem(`pixel_birthday_cache_${cardId}`, JSON.stringify(data));
    localStorage.setItem('pixel_birthday_cache_latest', JSON.stringify(data));
  } catch (e) {
    // 配额不足不能伪造空相册，也不能覆盖仍可恢复的旧备份。
    console.warn('浏览器缓存空间不足，保留已有备份');
  }
}

/**
 * Load card data from IndexedDB or localStorage
 */
export async function loadCardFromLocal(cardId: string): Promise<any | null> {
  if (!cardId) return null;

  // 1. Try IndexedDB first (most complete, contains full photos)
  try {
    const db = await openDB();
    if (db) {
      const card = await new Promise<any>((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(cardId);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
      if (card) { db.close(); return card; }

      // Only fallback to 'latest' if cardId itself was 'latest'
      if (cardId === 'latest') {
        const latest = await new Promise<any>((resolve) => {
          const tx = db.transaction(STORE_NAME, 'readonly');
          const store = tx.objectStore(STORE_NAME);
          const req = store.get('latest');
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => resolve(null);
        });
        if (latest) { db.close(); return latest; }
      }
      db.close();
    }
  } catch (err) {
    console.warn('IndexedDB read error:', err);
  }

  // 2. Fallback to localStorage for this specific cardId
  try {
    const saved = localStorage.getItem(`pixel_birthday_cache_${cardId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return { photos: parsed };
      }
      return parsed;
    }
    if (cardId === 'latest') {
      const latestSaved = localStorage.getItem('pixel_birthday_cache_latest');
      if (latestSaved) {
        return JSON.parse(latestSaved);
      }
    }
  } catch (e) {
    console.warn('localStorage read error:', e);
  }

  return null;
}

/**
 * Compress uploaded image file to lightweight Base64 JPEG
 */
export function compressImageFile(file: File, maxDim = 720, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = () => reject(new Error('Image decode error'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('File read error'));
    reader.readAsDataURL(file);
  });
}
