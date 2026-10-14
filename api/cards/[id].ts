import { readCard, validId, prepareResponse, fail, type ApiRequest, type ApiResponse } from '../../lib/cardStore.js';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  prepareResponse(res);
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: '不支持的请求方法' });
  const candidate = req.query?.id;
  const id = Array.isArray(candidate) ? candidate[0] : candidate;
  if (!validId(id)) return res.status(400).json({ success: false, error: '卡片标识无效' });
  try { return res.status(200).json({ success: true, card: await readCard(id) }); }
  catch (error) { return fail(res, error); }
}
