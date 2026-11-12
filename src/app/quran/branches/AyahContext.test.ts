import { describe, expect, it } from 'vitest';
import { ayahContexts, sharedByAll } from '@shared/quran/ayahContext';
import { normalizeWord } from '@shared/quran/normalize';
import { loadReaderAyat } from '@/lib/quran/readerAyat';
import { sharedMarks } from './AyahContext';

describe('sharedMarks', () => {
  it('fades words only some rows share, and lights a tapped word in every row that has it', async () => {
    const all = await loadReaderAyat();
    // الأعراف ٨٠ and العنكبوت ٢٨ share «ما سبقكم بها من أحد من العالمين»; النمل ٥٤ does not.
    const [araf, naml, ankabut] = sharedByAll(ayahContexts(all, ['7:80', '27:54', '29:28']));
    const marks = [araf, naml, ankabut].map(context => sharedMarks(context, 'exact', 'root', 0));
    const last = (n: number) => marks[n][[araf, naml, ankabut][n].ayah.words.length - 1];
    expect(last(0)).toMatchObject({ some: true, kind: 'exact' });
    expect(last(2)?.link).toBe(last(0)?.link);
    expect(last(1)).toBeUndefined();
    // Words every row shares stay full colour.
    expect(marks[1][0]).toMatchObject({ kind: 'exact' });
    expect(marks[1][0].some).toBeUndefined();
    const lit = sharedMarks(ankabut, 'exact', 'root', 0, last(0)!.link);
    expect(lit[ankabut.ayah.words.length - 1].lit).toBe(true);
    // Without a step (the ayah before and after), marks stay as they were: every-row words only, nothing to tap.
    expect(Object.values(sharedMarks(araf, 'exact', 'root')).every(mark => !mark.some && !mark.link)).toBe(true);
  });

  it('pairs a particle only where the ayat line up in order, and a rooted word anywhere', async () => {
    const all = await loadReaderAyat();
    const [baqara, nur] = sharedByAll(ayahContexts(all, ['2:106', '24:45']));
    // «ما ننسخ» opens 2:106; the only «ما» in 24:45 sits near its end, out of order: no pair.
    expect(baqara.match!.links![0]).toBeUndefined();
    // «من آية» pairs with «من ماء», not with a later «ومنهم».
    expect(nur.match!.links![4]?.link).toBe(baqara.match!.links![2].link);
    expect(nur.match!.links![11]).toBeUndefined();
    // الأعراف ١١٦ and الشعراء ٤٤ tell «ألقوا» in a different order; rooted words still pair.
    const [araf, shuara] = sharedByAll(ayahContexts(all, ['7:116', '26:44']));
    const alqaw = (context: typeof araf) => Object.entries(context.match!.links!).find(([i]) => normalizeWord(context.ayah.words[+i]).includes('لقوا'))?.[1].link;
    expect(alqaw(araf)).toBeDefined();
    expect(alqaw(araf)).toBe(alqaw(shuara));
  });
});

