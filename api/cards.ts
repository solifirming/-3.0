import { readCard, writeCard, validId, MAX_CARD_BYTES, prepareResponse, fail, StorageError, type ApiRequest, type ApiResponse } from '../lib/cardStore.js';

const fields = ['name', 'age', 'photos', 'wishes', 'themeIndex', 'activeMascotId', 'mascotConfig', 'customTitle', 'customParagraphs', 'customSignature', 'customDate', 'customThemeNames'];
export default async function handler(req: ApiRequest, res: ApiResponse) {
  prepareResponse(res);
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: '不支持的请求方法' });
  try {
    let input = req.body;
    if (typeof input === 'string') {
      if (Buffer.byteLength(input, 'utf8') > MAX_CARD_BYTES) throw new StorageError('照片总大小超出限制，请压缩图片后重试', 413);
      try { input = JSON.parse(input); } catch { throw new StorageError('卡片数据格式无效', 400); }
    }
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new StorageError('卡片数据格式无效', 400);
    const data = input as Record<string, unknown>;
    if (!validId(data.id) || data.id === 'latest') throw new StorageError('卡片标识无效', 400);
    if (data.photos !== undefined && (!Array.isArray(data.photos) || data.photos.some(photo => !photo || typeof photo !== 'object' || typeof photo.url !== 'string')))
      throw new StorageError('照片数据格式无效', 400);
    if (Buffer.byteLength(JSON.stringify(data), 'utf8') > MAX_CARD_BYTES) throw new StorageError('照片总大小超出限制，请压缩图片后重试', 413);
    const existing = await readCard(data.id) || {};
    const patch = Object.fromEntries(fields.filter(field => Object.prototype.hasOwnProperty.call(data, field)).map(field => [field, data[field]]));
    const card = { ...existing, ...patch, id: data.id, updatedAt: Date.now() };
    await writeCard(card);
    return res.status(200).json({ success: true, id: data.id, card });
  } catch (error) { return fail(res, error); }
}
