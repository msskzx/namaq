import { describe, expect, it } from 'vitest';
import { HARAKAT } from './span';
import { hadithView, listUnits } from './hadithView';

describe('hadithView (the Jibril fixtures)', () => {
  it('lists the three units', () => {
    expect(listUnits().map((u) => u.id).sort()).toEqual(['bukhari-jibril', 'fath-iman-50', 'muslim-jibril']);
  });

  it('gives Bukhari 50 five links and the conversation', () => {
    const view = hadithView('bukhari-jibril')!;
    const [hadith] = view.reports;
    expect(hadith.chain!.links).toHaveLength(5);
    expect(hadith.chain!.links.map((l) => ('text' in l ? l.text : ''))).toEqual([
      'حَدَّثَنَا مُسَدَّدٌ',
      'قَالَ حَدَّثَنَا إِسْمَاعِيلُ بْنُ إِبْرَاهِيمَ',
      'أَخْبَرَنَا أَبُو حَيَّانَ التَّيْمِيُّ',
      'عَنْ أَبِي زُرْعَةَ',
      'عَنْ أَبِي هُرَيْرَةَ',
    ]);
    const lines = hadith.scenes[0].lines;
    expect(lines.filter((l) => l.kind === 'turn').map((l) => l.speaker)).toEqual([
      'جِبْرِيلُ', 'النَّبِيُّ', 'جِبْرِيلُ', 'النَّبِيُّ', 'جِبْرِيلُ', 'النَّبِيُّ',
      'جِبْرِيلُ', 'النَّبِيُّ', 'النَّبِيُّ', 'النَّبِيُّ',
    ]);
    expect(lines[0]).toMatchObject({ kind: 'narration', speaker: 'أَبِي هُرَيْرَةَ' });
    expect(lines[0].text.endsWith('فَقَالَ')).toBe(true);
    expect(lines[1]).toMatchObject({ kind: 'turn', text: 'مَا الإِيمَانُ' });
    expect(lines[2]).toMatchObject({ kind: 'narration', speaker: 'أَبِي هُرَيْرَةَ', text: 'قَالَ' });
    expect(lines[3].text).toMatch(/^الإِيمَانُ.*الْبَعْثِ\.$/);
    expect(lines.some((l) => /["“”]/.test(l.text))).toBe(false);
    expect(hadith.fullText!.startsWith('حَدَّثَنَا مُسَدَّدٌ')).toBe(true);
    expect(hadith.fullText!.endsWith('دِينَهُمْ ".')).toBe(true);
    const matn = view.reports[0].statements[0];
    const joined = lines.map((l) => l.text).join(' ').replace(/\s+/g, ' ');
    const bare = (t: string) => t.replace(/\s*["“”]\s*/g, ' ').replace(/\s+([.،])/g, '$1').trim();
    expect(bare(joined).includes(bare(matn.replace(/\s+/g, ' ')))).toBe(true);
    expect(view.explainedBy.map((e) => e.unit)).toEqual(['fath-iman-50']);
    expect(view.explainedBy[0].texts[0]).toBeTruthy();
  });

  it('gives Muslim two branches under a tahwil, and a second scene inside a turn', () => {
    const [hadith] = hadithView('muslim-jibril')!.reports;
    expect(hadith.chain!.branches).toHaveLength(2);
    expect(hadith.chain!.tahwil).toBeTruthy();
    expect(hadith.scenes[1].inTurn).toBe('o3');
  });

  it('links the commentary back to the hadith it explains', () => {
    expect(hadithView('fath-iman-50')!.explains[0].unit).toBe('bukhari-jibril');
  });

  it('gives the commentary its own words', () => {
    expect(hadithView('fath-iman-50')!.reports[0].statements[0].replace(HARAKAT, '')).toContain('البصري');
  });

  it('names the speaker an approved inference identifies', () => {
    const lines = hadithView('muslim-jibril')!.reports[0].scenes[0].lines;
    const answer = lines.find((l) => l.kind === 'turn' && l.text.startsWith('فَإِذَا لَقِيتَ'));
    expect(answer?.speaker).toContain('عُمَرَ');
  });

  it('loses no word of either hadith across its scenes', () => {
    const words = (t: string) => t.replace(/["“”.،-]/g, ' ').split(/\s+/).filter(Boolean);
    for (const unit of ['bukhari-jibril', 'muslim-jibril']) {
      const [report] = hadithView(unit)!.reports;
      const shown = words(report.scenes.flatMap((sc) => sc.lines.map((l) => l.text)).join(' '));
      const full = words(report.fullText!);
      expect(shown).toEqual(full.slice(full.length - shown.length));
      expect(shown.length).toBeGreaterThan(full.length - 40);
    }
  });

  it('ends the first Muslim scene on the son\'s qala and opens the nested story at baynama', () => {
    const [report] = hadithView('muslim-jibril')!.reports;
    const last = report.scenes[0].lines.at(-1)!;
    expect(last.speaker).toContain('عُمَرَ بْنِ الْخَطَّابِ');
    expect(last.text.endsWith('عُمَرُ بْنُ الْخَطَّابِ قَالَ')).toBe(true);
    expect(report.scenes[1].lines[0].text.startsWith('بَيْنَمَا')).toBe(true);
  });

  it('gives the commentary page its notes, the narrator each is about, and the hadith it explains', () => {
    const view = hadithView('fath-iman-50')!;
    expect(view.notes[0].narrator).toContain('إِسْمَاعِيلُ');
    expect(view.explains[0]).toMatchObject({ unit: 'bukhari-jibril', book: 'صحيح البخاري' });
  });

  it('returns null for an unknown unit', () => {
    expect(hadithView('nope')).toBeNull();
  });
});
