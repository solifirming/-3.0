const fs = require('fs');
const file = fs.readFileSync('src/components/PixelMascotCreator.tsx', 'utf-8');

let newFile = file.replace(
  "interface PixelMascotCreatorProps {",
  `export interface MascotConfig {
  style: 'star' | 'cat' | 'slime';
  color: string;
  accessory: 'none' | 'hat' | 'crown' | 'bow';
  expression: 'smile' | 'wink' | 'cute' | 'cool';
  tempo: 'bouncy' | 'sleepy' | 'spin';
}

interface PixelMascotCreatorProps {
  config?: MascotConfig;
  onConfigChange?: (config: MascotConfig) => void;`
);

newFile = newFile.replace(
  "export default function PixelMascotCreator({",
  `export default function PixelMascotCreator({
  config,
  onConfigChange,`
);

const stateBlock = `  const [style, setStyle] = useState<'star' | 'cat' | 'slime'>('star');
  const [color, setColor] = useState('#F7D070'); // Gold Yellow, Sunset Pink, Mint Green, Mystic Purple
  const [accessory, setAccessory] = useState<'none' | 'hat' | 'crown' | 'bow'>('crown');
  const [expression, setExpression] = useState<'smile' | 'wink' | 'cute' | 'cool'>('smile');
  const [tempo, setTempo] = useState<'bouncy' | 'sleepy' | 'spin'>('bouncy');`;

const newStateBlock = `  const [style, setStyle] = useState<'star' | 'cat' | 'slime'>(config?.style || 'star');
  const [color, setColor] = useState(config?.color || '#F7D070');
  const [accessory, setAccessory] = useState<'none' | 'hat' | 'crown' | 'bow'>(config?.accessory || 'crown');
  const [expression, setExpression] = useState<'smile' | 'wink' | 'cute' | 'cool'>(config?.expression || 'smile');
  const [tempo, setTempo] = useState<'bouncy' | 'sleepy' | 'spin'>(config?.tempo || 'bouncy');

  // Sync internal state with props if props change from server load
  useEffect(() => {
    if (config) {
      setStyle(config.style);
      setColor(config.color);
      setAccessory(config.accessory);
      setExpression(config.expression);
      setTempo(config.tempo);
    }
  }, [config]);

  // Notify parent of any changes
  useEffect(() => {
    if (onConfigChange) {
      onConfigChange({ style, color, accessory, expression, tempo });
    }
  }, [style, color, accessory, expression, tempo]);`;

newFile = newFile.replace(stateBlock, newStateBlock);

fs.writeFileSync('src/components/PixelMascotCreator.tsx', newFile);
console.log("Patched PixelMascotCreator.tsx");
