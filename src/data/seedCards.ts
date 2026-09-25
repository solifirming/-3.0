import rawCards from './seedCards.json';

export const SEED_CARDS: Record<string, any> = rawCards || {};

export function getSeedCard(cardId: string): any {
  if (!cardId) return null;
  return SEED_CARDS[cardId] || SEED_CARDS['latest'] || null;
}
