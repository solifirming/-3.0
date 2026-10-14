import { get, put } from '@vercel/blob';

type Options = { access: 'private'; useCache?: boolean; contentType?: string; allowOverwrite?: boolean };
export type BlobClient = {
  get(path: string, options: Options): Promise<{ stream: ReadableStream | null } | null>;
  put(path: string, content: string, options: Options): Promise<unknown>;
};
const pathFor = (id: string) => `birthday-v3/cards/${id}.json`;

// 注入客户端用于验证真实读写顺序和缓存策略，不需要连接生产存储。
export function createBlobStorage(client: BlobClient = { get, put }) {
  const read = async (id: string): Promise<Record<string, any> | null> => {
    const blob = await client.get(pathFor(id), { access: 'private', useCache: false });
    if (!blob) return null;
    if (!blob.stream) throw new Error('存储读取没有返回完整内容');
    const value = JSON.parse(await new Response(blob.stream).text());
    if (id === 'latest' && typeof value?.cardId === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(value.cardId) && value.cardId !== 'latest')
      return read(value.cardId);
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('存储卡片格式无效');
    return value;
  };
  const write = async (card: Record<string, any>) => {
    const options: Options = { access: 'private', contentType: 'application/json', allowOverwrite: true };
    await client.put(pathFor(card.id), JSON.stringify(card), options);
    await client.put(pathFor('latest'), JSON.stringify({ cardId: card.id }), options);
  };
  return { read, write };
}
