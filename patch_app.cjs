const fs = require('fs');
const file = fs.readFileSync('src/App.tsx', 'utf-8');

let newFile = file.replace(
  "import PixelMascotCreator from './components/PixelMascotCreator';",
  "import PixelMascotCreator, { MascotConfig } from './components/PixelMascotCreator';"
);

newFile = newFile.replace(
  "const [activeMascotId, setActiveMascotId] = useState<string | null>(null);",
  "const [activeMascotId, setActiveMascotId] = useState<string | null>(null);\n  const [mascotConfig, setMascotConfig] = useState<MascotConfig | null>(null);"
);

newFile = newFile.replace(
  "if (data.card.activeMascotId !== undefined) {\n            setActiveMascotId(data.card.activeMascotId);\n          }",
  "if (data.card.activeMascotId !== undefined) {\n            setActiveMascotId(data.card.activeMascotId);\n          }\n          if (data.card.mascotConfig !== undefined) {\n            setMascotConfig(data.card.mascotConfig);\n          }"
);

newFile = newFile.replace(
  "themeIndex: selectedThemeIndex,\n        activeMascotId: activeMascotId",
  "themeIndex: selectedThemeIndex,\n        activeMascotId: activeMascotId,\n        mascotConfig: mascotConfig"
);

newFile = newFile.replace(
  "  }, [birthdayName, birthdayAge, wishesList, selectedThemeIndex, activeMascotId]);",
  "  }, [birthdayName, birthdayAge, wishesList, selectedThemeIndex, activeMascotId, mascotConfig]);"
);

newFile = newFile.replace(
  "<PixelMascotCreator\n                birthdayName={birthdayName}\n                birthdayAge={birthdayAge}\n                playClickSound={playClickSound}\n              />",
  `<PixelMascotCreator
                birthdayName={birthdayName}
                birthdayAge={birthdayAge}
                playClickSound={playClickSound}
                config={mascotConfig || undefined}
                onConfigChange={(newConfig) => setMascotConfig(newConfig)}
              />`
);

fs.writeFileSync('src/App.tsx', newFile);
console.log("Patched App.tsx");
