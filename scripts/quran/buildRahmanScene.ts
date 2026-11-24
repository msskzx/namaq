import { writeFileSync } from 'node:fs';
import { OUT, buildRahmanHadith } from './rahmanScene';

// npm run quran:rahman-scene: the «الرحمن» scene's hadith words from data/hadith/sahih (scripts/quran/rahmanScene.ts).
writeFileSync(OUT, `${JSON.stringify(buildRahmanHadith(), null, 1)}\n`);
console.log(`wrote ${OUT}`);
