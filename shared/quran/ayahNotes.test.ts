import { describe, expect, it } from 'vitest';
import itqan from '../data/quran/itqanBalagha';
import surahs from '../data/quran/surahs.json';
import { allAyat, AYAH_NOTES, balaghaNote, ayahNoteAt, ayahNoteKind, itqanSureAyat, withoutOpeningQuote } from './ayahNotes';
import { singleAyahPassages, tafsirSadiOf } from './tafsirSadiData';
import { qiraatAyat, qiraatOf } from './qiraatData';
import { itqanAt } from './itqanBalagha';

describe('ayah notes', () => {
  it('turns through the four kinds, one a batch, and starts a day one kind on', () => {
    expect([0, 1, 2, 3].map(slot => ayahNoteKind(10, slot))).toEqual(expect.arrayContaining([...AYAH_NOTES]));
    expect(ayahNoteKind(11, 0)).toBe(ayahNoteKind(10, 1));
  });

  it('picks an ayah inside the list, the same all day, another in the next batch of the kind', () => {
    const at = ayahNoteAt(580, 400, 0);
    expect(at).toBeGreaterThanOrEqual(0);
    expect(at).toBeLessThan(580);
    expect(ayahNoteAt(580, 400, 0)).toBe(at);
    expect(ayahNoteAt(580, 400, 4)).not.toBe(at);
    expect(ayahNoteAt(0, 400, 0)).toBe(-1);
    expect(ayahNoteAt(580, -5, 3)).toBeGreaterThanOrEqual(0);
  });

  it('lists the ayat with a passage of their own, each explained alone', () => {
    const keys = singleAyahPassages();
    expect(keys.length).toBeGreaterThan(500);
    for (const key of keys) { const passage = tafsirSadiOf(key)!; expect([passage.from, passage.to]).toEqual([Number(key.split(':')[1]), Number(key.split(':')[1])]); }
    expect(keys).not.toContain('2:219');
  });

  it('drops the quote a passage opens with, and only that', () => {
    expect(withoutOpeningQuote('﴿إِنْ يَنْصُرْكُمُ اللَّهُ﴾.\nأي: إن يمددكم ﴿فلا غالب لكم﴾')).toBe('أي: إن يمددكم ﴿فلا غالب لكم﴾');
    expect(withoutOpeningQuote('أي: ﴿فلا﴾')).toBe('أي: ﴿فلا﴾');
  });

  it('keeps only the balagha ayat al-Suyuti surely names', () => {
    const keys = itqanSureAyat(itqan);
    expect(keys.length).toBeGreaterThan(50);
    for (const key of keys) expect(itqanAt(itqan, key).some(paragraph => paragraph.places === 1)).toBe(true);
  });

  it('shows the first paragraph surely on the ayah, under his heading or else the kind of device', () => {
    const key = itqanSureAyat(itqan)[0];
    const note = balaghaNote(itqanAt(itqan, key))!;
    const first = itqanAt(itqan, key).find(paragraph => paragraph.places === 1)!;
    expect(note).toEqual({ text: first.text, heading: first.heading || first.kind });
    expect(balaghaNote([])).toBeNull();
    expect(balaghaNote([{ ...first, places: 3 }])).toBeNull();
  });

  it('lists the readings ayat and every ayah', () => {
    expect(qiraatAyat().every(key => qiraatOf(key).length > 0)).toBe(true);
    expect(allAyat(surahs.map(surah => surah.numberOfAyat))).toHaveLength(6236);
  });
});
