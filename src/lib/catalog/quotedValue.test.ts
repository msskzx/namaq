import { describe, expect, it } from 'vitest';
import { cleanPassage, joinAtSeams, matchQuotedValue } from './quotedValue';

const heading = '٣ - الزُّبَيْرُ بنُ العَوَّامِ بنِ خُوَيْلِدِ بنِ أَسَدِ بنِ عَبْدِ العُزَّى * (ع)';
const continuation = 'ابْنِ قُصَيِّ بنِ كِلاَبِ بنِ مُرَّةَ بنِ كَعْبِ بنِ لُؤَيِّ بنِ غَالِبٍ.';
const seamed =
  'الزُّبَيْرُ بنُ العَوَّامِ بنِ خُوَيْلِدِ بنِ أَسَدِ بنِ عَبْدِ العُزَّى بنِ قُصَيِّ بنِ كِلاَبِ بنِ مُرَّةَ بنِ كَعْبِ بنِ لُؤَيِّ بنِ غَالِبٍ';

describe('cleanPassage', () => {
  it('drops the entry number and the collection marks', () => {
    expect(cleanPassage(heading)).toBe('الزُّبَيْرُ بنُ العَوَّامِ بنِ خُوَيْلِدِ بنِ أَسَدِ بنِ عَبْدِ العُزَّى');
  });

  it('drops footnote markers and keeps ordinary parentheses', () => {
    expect(cleanPassage('قَالَ (١) : (لِكُلِّ نَبِيٍّ حَوَارِيٌّ)')).toBe('قَالَ : (لِكُلِّ نَبِيٍّ حَوَارِيٌّ)');
  });
});

describe('joinAtSeams', () => {
  it('writes a sentence-initial ابْنِ as بنِ where one passage runs into the next', () => {
    expect(joinAtSeams([heading, continuation])).toContain('عَبْدِ العُزَّى بنِ قُصَيِّ');
  });
});

describe('closing full stops', () => {
  const headingWithCode = '١ - أَبُو عُبَيْدَةَ بنُ الجَرَّاحِ عَامِرُ بنُ عَبْدِ اللهِ * (م، ق) .';
  const next = 'ابْنِ الجَرَّاحِ بنِ هِلاَلِ بنِ أُهَيْبِ.';

  it('drops the heading full stop left behind by the collection marks at a seam', () => {
    expect(matchQuotedValue('عَامِرُ بنُ عَبْدِ اللهِ بنِ الجَرَّاحِ بنِ هِلاَلِ', [[headingWithCode, next]])).toEqual({ ok: true });
  });

  it('accepts a seam-joined value that also keeps the closing full stop of the last passage', () => {
    expect(
      matchQuotedValue('عَامِرُ بنُ عَبْدِ اللهِ بنِ الجَرَّاحِ بنِ هِلاَلِ بنِ أُهَيْبِ.', [[headingWithCode, next, 'جُمْلَةٌ أُخْرَى.']]),
    ).toEqual({ ok: true });
  });

  it('accepts a value that keeps the full stop between two paragraphs', () => {
    expect(matchQuotedValue('جُمْلَةٌ أُولَى. جُمْلَةٌ ثَانِيَةٌ.', [['جُمْلَةٌ أُولَى.', 'جُمْلَةٌ ثَانِيَةٌ.']])).toEqual({ ok: true });
  });

  it('still accepts a clip that keeps a closing full stop inside one passage', () => {
    expect(matchQuotedValue('ابْنِ الجَرَّاحِ بنِ هِلاَلِ بنِ أُهَيْبِ.', [[headingWithCode, next]])).toEqual({ ok: true });
  });
});

describe('matchQuotedValue', () => {
  it('accepts a value joined across a seam with the seam edit and no closing full stop', () => {
    expect(matchQuotedValue(seamed, [[heading, continuation]])).toEqual({ ok: true });
  });

  it('rejects the seam kept as printed', () => {
    expect(matchQuotedValue(seamed.replace('العُزَّى بنِ قُصَيِّ', 'العُزَّى ابْنِ قُصَيِّ'), [[heading, continuation]])).toMatchObject({
      ok: false,
    });
  });

  it('accepts a literal clip of one passage, including a printed ابْنِ', () => {
    expect(matchQuotedValue('ابْنِ قُصَيِّ بنِ كِلاَبِ', [[continuation]])).toEqual({ ok: true });
  });

  it('accepts a value composed from two cited pages and rejects one that reorders words', () => {
    const pageOne = ['كَانَ رَجُلاً طَوِيْلاً.'];
    const pageTwo = ['وَكَانَ يَخْضِبُ بِالحِنَّاءِ.'];
    expect(matchQuotedValue('كَانَ رَجُلاً طَوِيْلاً. وَكَانَ يَخْضِبُ', [pageOne, pageTwo])).toEqual({ ok: true });
    expect(matchQuotedValue('طَوِيْلاً رَجُلاً كَانَ وَكَانَ يَخْضِبُ', [pageOne, pageTwo])).toMatchObject({ ok: false });
  });

  it('rejects a value with its vowel marks removed', () => {
    expect(matchQuotedValue('الزبير بن العوام', [[heading, continuation]])).toMatchObject({ ok: false });
  });

  it('rejects a respelled or reordered value and reports where it diverges', () => {
    const result = matchQuotedValue('الزُّبَيْرُ بْنُ العَوَّامِ', [[heading, continuation]]);
    expect(result).toMatchObject({ ok: false, reason: 'diverges' });
    expect(result.ok === false && result.matched.startsWith('الزُّبَيْرُ ')).toBe(true);
  });

  it('accepts the known name as a clip of the heading', () => {
    expect(matchQuotedValue('الزُّبَيْرُ بنُ العَوَّامِ', [[heading]])).toEqual({ ok: true });
  });
});
