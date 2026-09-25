const fs = require('fs');

// PATCH APP.TSX
let appCode = fs.readFileSync('src/App.tsx', 'utf-8');

const loadStateEffectTarget = `  // Load saved card data from server on initial mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cardId = urlParams.get('card') || 'latest';`;

const loadStateEffectReplacement = `  // Load saved card data from server on initial mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cardId = urlParams.get('card') || 'latest';

    // 1. Local-First Caching: Instantly load configuration from localStorage
    try {
      const cached = localStorage.getItem(\`pixel_birthday_cache_\${cardId}\`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.name) {
          setBirthdayName(parsed.name);
          setInputName(parsed.name);
          setTempName(parsed.name);
        }
        if (parsed.age) {
          setBirthdayAge(parsed.age);
          setInputAge(parsed.age);
        }
        if (parsed.themeIndex !== undefined) {
          setSelectedThemeIndex(parsed.themeIndex);
        }
        if (parsed.activeMascotId !== undefined) {
          setActiveMascotId(parsed.activeMascotId);
        }
        if (parsed.mascotConfig !== undefined) {
          setMascotConfig(parsed.mascotConfig);
        }
        if (Array.isArray(parsed.wishes) && parsed.wishes.length > 0) {
          setWishesList(parsed.wishes);
        }
      }
    } catch (err) {
      console.warn('Failed to parse local cache', err);
    }
`;

appCode = appCode.replace(loadStateEffectTarget, loadStateEffectReplacement);

const saveStateEffectTarget = `    fetch('/api/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: cardId,
        name: birthdayName,
        age: birthdayAge,
        wishes: wishesList,
        themeIndex: selectedThemeIndex,
        activeMascotId: activeMascotId,
        mascotConfig: mascotConfig
      })
    }).catch(err => console.error('Failed to auto-sync card:', err));`;

const saveStateEffectReplacement = `    const cardPayload = {
      id: cardId,
      name: birthdayName,
      age: birthdayAge,
      wishes: wishesList,
      themeIndex: selectedThemeIndex,
      activeMascotId: activeMascotId,
      mascotConfig: mascotConfig
    };

    // 1. Instantly save to local cache to survive network drops
    try {
      localStorage.setItem(\`pixel_birthday_cache_\${cardId}\`, JSON.stringify(cardPayload));
      localStorage.setItem(\`pixel_birthday_cache_latest\`, JSON.stringify(cardPayload));
    } catch (e) {
      console.error('Failed to update local cache', e);
    }

    // 2. Sync to cloud API
    fetch('/api/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cardPayload)
    }).catch(err => console.error('Failed to auto-sync card:', err));`;

appCode = appCode.replace(saveStateEffectTarget, saveStateEffectReplacement);

const updateCacheOnFetchSuccess = `          if (Array.isArray(data.card.wishes) && data.card.wishes.length > 0) {
            setWishesList(data.card.wishes);
          }
        }`;
const updateCacheOnFetchReplacement = `          if (Array.isArray(data.card.wishes) && data.card.wishes.length > 0) {
            setWishesList(data.card.wishes);
          }
          
          // Update local cache with fresh server data
          try {
            localStorage.setItem(\`pixel_birthday_cache_\${cardId}\`, JSON.stringify(data.card));
          } catch(e) {}
        }`;

appCode = appCode.replace(updateCacheOnFetchSuccess, updateCacheOnFetchReplacement);

fs.writeFileSync('src/App.tsx', appCode);

// PATCH PhotoEnvelope.tsx
let photoCode = fs.readFileSync('src/components/PhotoEnvelope.tsx', 'utf-8');
const oldPhotoSave = `    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
    } catch (e) {
      console.error('Failed to save photos to localStorage:', e);
    }`;

const newPhotoSave = `    const urlParams = new URLSearchParams(window.location.search);
    let cardId = urlParams.get('card') || 'latest';
    
    try {
      localStorage.setItem(\`\${STORAGE_KEY}_\${cardId}\`, JSON.stringify(photos));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(photos)); // fallback for generic
    } catch (e) {
      console.error('Failed to save photos to localStorage:', e);
    }`;

photoCode = photoCode.replace(oldPhotoSave, newPhotoSave);

const oldPhotoLoad = `      const saved = localStorage.getItem(STORAGE_KEY);`;
const newPhotoLoad = `      const urlParams = new URLSearchParams(window.location.search);
      const cardId = urlParams.get('card') || 'latest';
      const saved = localStorage.getItem(\`\${STORAGE_KEY}_\${cardId}\`) || localStorage.getItem(STORAGE_KEY);`;

photoCode = photoCode.replace(oldPhotoLoad, newPhotoLoad);

const oldPhotoFetchUpdate = `        if (data && data.success && data.card && Array.isArray(data.card.photos)) {
          setPhotos(sanitizePhotos(data.card.photos));
        }`;

const newPhotoFetchUpdate = `        if (data && data.success && data.card && Array.isArray(data.card.photos)) {
          const freshPhotos = sanitizePhotos(data.card.photos);
          setPhotos(freshPhotos);
          try {
            localStorage.setItem(\`\${STORAGE_KEY}_\${cardId}\`, JSON.stringify(freshPhotos));
          } catch (e) {}
        }`;
photoCode = photoCode.replace(oldPhotoFetchUpdate, newPhotoFetchUpdate);

const oldPhotoShareSave = `        id: cardId,
        photos: photos
      })
    }).catch(err => console.error('Background card save failed:', err));`;

const newPhotoShareSave = `        id: cardId,
        photos: photos
      })
    }).catch(err => console.error('Background card save failed:', err));
    
    try {
      localStorage.setItem(\`\${STORAGE_KEY}_\${cardId}\`, JSON.stringify(photos));
    } catch (e) {}`;

photoCode = photoCode.replace(oldPhotoShareSave, newPhotoShareSave);

fs.writeFileSync('src/components/PhotoEnvelope.tsx', photoCode);
console.log("Patched App.tsx and PhotoEnvelope.tsx");
