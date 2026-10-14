import { readCard, prepareResponse, fail, type ApiRequest, type ApiResponse } from '../../lib/cardStore.js';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  prepareResponse(res);
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: '不支持的请求方法' });
  try { return res.status(200).json({ success: true, card: await readCard('latest') }); }
  catch (error) { return fail(res, error); }
}
