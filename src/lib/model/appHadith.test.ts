import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { appHadith } from './appHadith';

describe('the phone app hadith', () => {
  it('is the website\'s hadith as they are now (npm run model:app-hadith writes them again)', () => {
    expect(JSON.parse(readFileSync('shared/data/hadith/units.json', 'utf8'))).toEqual(JSON.parse(JSON.stringify(appHadith())));
  });

  it('has the hadith of Jibril in al-Bukhari and in Muslim, each with its isnad', () => {
    const { units } = appHadith();
    for (const id of ['bukhari-jibril', 'muslim-jibril']) {
      const unit = units.find(item => item.id === id)!;
      expect(unit.reports.some(report => report.chain && unit.isnad[report.id].nodes.length > 2)).toBe(true);
    }
  });
});
