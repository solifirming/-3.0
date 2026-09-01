/// <reference types="@cloudflare/workers-types" />
/**
 * Cloudflare Pages Function
 * POST /api/cards — 保存/更新生日卡片（替代原 express server.ts 端点）
 * 数据存储：Cloudflare KV（binding: CARDS）
 */

interface Env {
  CARDS: KVNamespace;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: Record<string, any>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'invalid json' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
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

  // 读取已有卡片（合并存储，与原 server.ts 行为一致）
  let existingCard: Record<string, any> = {};
  try {
    const raw = await env.CARDS.get(cardId);
    if (raw) existingCard = JSON.parse(raw);
  } catch {
    /* ignore */
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

  try {
    await env.CARDS.put(cardId, JSON.stringify(cardData));
    await env.CARDS.put('latest', JSON.stringify(cardData));
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: 'kv write failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true, id: cardId, card: cardData }), {
    headers: { 'Content-Type': 'application/json' },
  });
};