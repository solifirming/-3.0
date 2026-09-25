/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import seedCardsData from './seedCards.json';

export function getSeedCard(cardId: string): any {
  if (!cardId) return null;
  const db = seedCardsData as Record<string, any>;
  return db[cardId] || db['latest'] || null;
}
