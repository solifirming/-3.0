const fs = require('fs');
let code = fs.readFileSync('src/components/PhotoEnvelope.tsx', 'utf-8');

const target = `    const urlParams = new URLSearchParams(window.location.search);
    let cardId = urlParams.get('card') || 'latest';
    
    try {
      localStorage.setItem(\`\${STORAGE_KEY}_\${cardId}\`, JSON.stringify(photos));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(photos)); // fallback for generic
    } catch (e) {
      console.error('Failed to save photos to localStorage:', e);
    }

    const urlParams = new URLSearchParams(window.location.search);
    let cardId = urlParams.get('card');
    if (!cardId) {
      cardId = \`card_\${Date.now()}\`;
      try {
        window.history.replaceState({}, '', \`?card=\${cardId}\`);
      } catch (err) {}
    }`;

const fixed = `    const urlParams = new URLSearchParams(window.location.search);
    let cardId = urlParams.get('card');
    if (!cardId) {
      cardId = \`card_\${Date.now()}\`;
      try {
        window.history.replaceState({}, '', \`?card=\${cardId}\`);
      } catch (err) {}
    }
    
    try {
      localStorage.setItem(\`\${STORAGE_KEY}_\${cardId}\`, JSON.stringify(photos));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(photos)); // fallback for generic
    } catch (e) {
      console.error('Failed to save photos to localStorage:', e);
    }`;

if (code.includes("const urlParams = new URLSearchParams(window.location.search);")) {
    code = code.replace(target, fixed);
    fs.writeFileSync('src/components/PhotoEnvelope.tsx', code);
    console.log("Fixed PhotoEnvelope.tsx");
}
