/// <reference types="@cloudflare/workers-types" />
/**
 * Cloudflare Pages Function
 * GET /api/cards/latest — 读取最新保存的卡片
 */

interface Env {
  CARDS: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  let card: any = null;
  try {
    const raw = await env.CARDS.get('latest');
    if (raw) card = JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return new Response(JSON.stringify({ success: true, card }), {
    headers: { 'Content-Type': 'application/json' },
  });
};