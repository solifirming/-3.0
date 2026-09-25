/// <reference types="@cloudflare/workers-types" />
/**
 * Cloudflare Pages Function
 * POST /api/cards — 保存/更新生日卡片
 * 数据存储：Cloudflare KV（binding: CARDS）
 */

interface Env {
  CARDS?: KVNamespace;
}

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { headers: CORS_HEADERS });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: Record<string, any>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'invalid json' }), {
      status: 400,
      headers: CORS_HEADERS,
    });
  }

  const {
    id,
    name,
    age,
    photos,
    wishes,
    themeIndex,
    activeMascotId,
    mascotConfig,
    customTitle,
    customParagraphs,
    customSignature,
    customDate,
    customThemeNames,
  } = body;

  const cardId: string = id || `card_${Date.now()}`;

  // 读取已有卡片（合并存储）
  let existingCard: Record<string, any> = {};
  if (env?.CARDS) {
    try {
      const raw = await env.CARDS.get(cardId);
      if (raw) existingCard = JSON.parse(raw);
    } catch {
      /* ignore */
    }
  }

  const cardData = {
    id: cardId,
    name: name !== undefined ? name : (existingCard.name || '最特别的孩子'),
    age: age !== undefined ? age : (existingCard.age || 18),
    photos: photos !== undefined ? photos : (existingCard.photos || []),
    wishes: wishes !== undefined ? wishes : (existingCard.wishes || []),
    themeIndex: themeIndex !== undefined ? themeIndex : (existingCard.themeIndex || 0),
    activeMascotId: activeMascotId !== undefined ? activeMascotId : (existingCard.activeMascotId || null),
    mascotConfig: mascotConfig !== undefined ? mascotConfig : existingCard.mascotConfig,
    customTitle: customTitle !== undefined ? customTitle : existingCard.customTitle,
    customParagraphs: customParagraphs !== undefined ? customParagraphs : existingCard.customParagraphs,
    customSignature: customSignature !== undefined ? customSignature : existingCard.customSignature,
    customDate: customDate !== undefined ? customDate : existingCard.customDate,
    customThemeNames: customThemeNames !== undefined ? customThemeNames : existingCard.customThemeNames,
    updatedAt: Date.now(),
  };

  if (!env?.CARDS) {
    // KV 未绑定时给出明确提示，但返回卡片数据保证前端可用
    return new Response(
      JSON.stringify({
        success: false,
        warning: 'Cloudflare KV 未绑定 CARDS 变量，卡片已在本地持久化。请在 Cloudflare Pages 设置中绑定 KV namespace。',
        id: cardId,
        card: cardData,
      }),
      { headers: CORS_HEADERS }
    );
  }

  try {
    await env.CARDS.put(cardId, JSON.stringify(cardData));
    await env.CARDS.put('latest', JSON.stringify(cardData));
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || 'kv write failed', card: cardData }),
      { status: 500, headers: CORS_HEADERS }
    );
  }

  return new Response(JSON.stringify({ success: true, id: cardId, card: cardData }), {
    headers: CORS_HEADERS,
  });
};
