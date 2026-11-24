import { writeFileSync } from 'node:fs';
import source from '../../shared/quran/mutashabih/evidence.json';
import kirmani from '../../shared/data/quran/mutashabihKirmani';
import iskafi from '../../shared/data/quran/mutashabihIskafi';
import zubayr from '../../shared/data/quran/mutashabihZubayr';
import { buildAnswers } from '../../shared/quran/mutashabih/bookAnswer';

/** Each book's answer to every citation of it, for the mutashabih page's «لماذا؟» (shared/quran/mutashabih/bookAnswer.ts). */
const answers = buildAnswers(source.cases, { K: kirmani, I: iskafi, G: zubayr });
writeFileSync('shared/data/quran/mutashabihAnswers.js', `export default JSON.parse(${JSON.stringify(JSON.stringify(answers))});\n`);
writeFileSync('shared/data/quran/mutashabihAnswers.d.ts', `// Generated next to this file by \`npm run quran:mutashabih-answers\`.\nimport type { AnswersData } from '../../quran/mutashabih/bookAnswer';\ndeclare const data: AnswersData;\nexport default data;\n`);
console.log(`${Object.keys(answers).length} answers`);
