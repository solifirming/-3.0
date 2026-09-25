const fs = require('fs');
const file = fs.readFileSync('src/App.tsx', 'utf-8');

// The effect we need to move
const effectRegex = /\/\/ Save state to server on user change\n\s*useEffect\(\(\) => \{[\s\S]*?\}\)\.catch\(err => console\.error\('Failed to auto-sync card:', err\)\);\n\s*\}, \[birthdayName, birthdayAge, wishesList, selectedThemeIndex, activeMascotId, mascotConfig\]\);\n/;
const effectMatch = file.match(effectRegex);

if (!effectMatch) {
  console.log("Could not find the effect block");
  process.exit(1);
}

const effectStr = effectMatch[0];

// Remove the effect from its current location
let newFile = file.replace(effectStr, "");

// Find a good place to insert it (after all state declarations, for example before "const handleSaveName")
const insertAnchor = "  // Handles custom mascot interaction";
newFile = newFile.replace(insertAnchor, effectStr + "\n  " + insertAnchor);

fs.writeFileSync('src/App.tsx', newFile);
console.log("Fixed lint issues in App.tsx");
