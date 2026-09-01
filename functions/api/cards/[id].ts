/// <reference types="@cloudflare/workers-types" />
/**
 * Cloudflare Pages Function
 * GET /api/cards/:id — 按卡片 ID 读取（找不到时回退到底 latest）
 */

interface Env {
  CARDS: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  const id = String((params as any).id || '');
  let card: any = null;
  try {
    let raw = await env.CARDS.get(id);
    if (!raw) raw = await env.CARDS.get('latest');
    if (raw) card = JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return new Response(JSON.stringify({ success: true, card }), {
    headers: { 'Content-Type': 'application/json' },
  });
};