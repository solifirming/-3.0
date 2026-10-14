export type Card = Record<string, any>;
export type ApiRequest = { method?: string; body?: unknown; query?: Record<string, string | string[] | undefined>; headers?: Record<string, string | string[] | undefined> };
export type ApiResponse = { status(code: number): ApiResponse; setHeader(name: string, value: string): void; json(value: unknown): void };
export const MAX_CARD_BYTES = 900_000;
const prefix = 'birthday-v3:card:';
export const validId = (id: unknown): id is string => typeof id === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(id);

export class StorageError extends Error {
  constructor(message: string, public status = 503) { super(message); }
}

async function redis(commands: unknown[], transaction = false): Promise<any> {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new StorageError('云端数据库尚未配置，请连接 Redis 后重新部署');
  let endpoint: URL;
  try { endpoint = new URL(url); } catch { throw new StorageError('云端数据库配置无效'); }
  if (endpoint.protocol !== 'https:') throw new StorageError('云端数据库配置无效');
  endpoint.pathname = transaction ? '/multi-exec' : '/';
  endpoint.search = '';
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(commands), signal: AbortSignal.timeout(15000), cache: 'no-store',
    });
  } catch { throw new StorageError('云端数据库暂时不可用，请稍后重试'); }
  if (!response.ok) throw new StorageError('云端数据库访问失败，请检查连接配置');
  let result: any;
  try { result = await response.json(); } catch { throw new StorageError('云端数据库返回无效响应'); }
  if (transaction) {
    if (!Array.isArray(result) || result.length !== commands.length || result.some(item => item?.error || item?.result !== 'OK'))
      throw new StorageError('云端数据库未确认保存成功');
    return result;
  }
  if (!result || result.error || !Object.prototype.hasOwnProperty.call(result, 'result'))
    throw new StorageError('云端数据库读取失败');
  return result.result;
}

export async function readCard(id: string): Promise<Card | null> {
  const raw = await redis(['GET', prefix + id]);
  if (raw === null) return null;
  let value: any;
  try { value = typeof raw === 'string' ? JSON.parse(raw) : raw; }
  catch { value = raw; }
  // 最近卡片只保存指针，避免事务中重复发送整份照片；兼容历史整卡数据。
  if (id === 'latest' && validId(value) && value !== 'latest') return readCard(value);
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new StorageError('云端卡片数据无效');
  return value;
}

export async function writeCard(card: Card): Promise<void> {
  const serialized = JSON.stringify(card);
  if (Buffer.byteLength(serialized, 'utf8') > MAX_CARD_BYTES) throw new StorageError('照片总大小超出限制，请压缩图片后重试', 413);
  await redis([['SET', prefix + card.id, serialized], ['SET', prefix + 'latest', card.id]], true);
}

export function prepareResponse(res: ApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');
}
export function fail(res: ApiResponse, error: unknown) {
  const known = error instanceof StorageError;
  return res.status(known ? error.status : 500).json({ success: false, error: known ? error.message : '卡片保存或读取失败，请重试' });
}
