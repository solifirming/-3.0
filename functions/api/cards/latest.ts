/// <reference types="@cloudflare/workers-types" />
import seedCards from '../../../src/data/seedCards.json';

/**
 * Cloudflare Pages Function
 * GET /api/cards/latest — 读取最新保存的卡片
 */

interface Env {
  CARDS?: KVNamespace;
}

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { headers: CORS_HEADERS });
};

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  let card: any = null;

  // 1. 先从 Cloudflare KV 读取
  if (env?.CARDS) {
    try {
      const raw = await env.CARDS.get('latest');
      if (raw) card = JSON.parse(raw);
    } catch {
      /* ignore */
    }
  }

  // 2. 如果 KV 中未找到，从打包的初始卡片库读取 fallback
  if (!card) {
    const seeds = (seedCards as Record<string, any>) || {};
    card = seeds['latest'] || Object.values(seeds)[0] || null;
  }

  return new Response(JSON.stringify({ success: true, card }), {
    headers: CORS_HEADERS,
  });
};
