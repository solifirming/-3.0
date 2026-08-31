/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: true, limit: '500mb' }));

const DATA_FILE = path.join(process.cwd(), 'cards_db.json');

function loadCardsDB(): Record<string, any> {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading cards DB:', err);
  }
  return {};
}

function saveCardsDB(db: Record<string, any>) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing cards DB:', err);
  }
}

// API Endpoints
app.post('/api/cards', (req, res) => {
  const { id, name, age, photos, wishes, themeIndex, activeMascotId, mascotConfig, customTitle, customParagraphs, customSignature, customDate, customThemeNames } = req.body;
  const cardId = id || `card_${Date.now()}`;
  const db = loadCardsDB();

  const existingCard = db[cardId] || {};

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
    updatedAt: Date.now()
  };

  db[cardId] = cardData;
  db['latest'] = cardData;
  saveCardsDB(db);

  res.json({ success: true, id: cardId, card: cardData });
});

app.get('/api/cards/latest', (req, res) => {
  const db = loadCardsDB();
  const card = db['latest'] || null;
  res.json({ success: true, card });
});

app.get('/api/cards/:id', (req, res) => {
  const { id } = req.params;
  const db = loadCardsDB();
  const card = db[id] || db['latest'] || null;
  res.json({ success: true, card });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
