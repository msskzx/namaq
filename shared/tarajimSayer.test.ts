import { describe, expect, it } from 'vitest';
import { namePieces, saidBy, sayerAt, virtueGroups, type PersonFact } from './tarajim';

const fact = (by: string[], more: Partial<PersonFact> = {}) => ({ id: 'x', text: 'x', refs: [], by, ...more }) as PersonFact;

describe('sayer lines', () => {
  it('names who says it before the quote, a kunya after «قال» in the nominative and after «عند» in the genitive', () => {
    expect(saidBy(fact(['أبي هريرة']))).toBe('قال أبو هريرة:');
    expect(saidBy(fact(['محمد ﷺ']))).toBe('قال النبي ﷺ:');
    expect(sayerAt(fact(['أبو نعيم الأصبهاني']))).toBe('عند أبي نعيم الأصبهاني');
    expect(sayerAt(fact(['أبو عبيد', 'شباب']))).toBe('عند أبي عبيد، شباب');
  });

  it('says «قالت» for a woman, «قيل» for an unnamed view, and nothing for the author\'s own words', () => {
    expect(saidBy(fact(['عائشة']))).toBe('قالت عائشة:');
    expect(saidBy(fact(['أم سلمة']))).toBe('قالت أم سلمة:');
    expect(saidBy(fact(['أم خالد بنت خالد بن سعيد']))).toBe('قالت أم خالد بنت خالد بن سعيد:');
    expect(saidBy(fact(['أنس']))).toBe('قال أنس:');
    expect(saidBy(fact([], { anonymous: true }))).toBe('قيل:');
    expect(saidBy(fact([]))).toBeUndefined();
  });
});

describe('virtues by who says them', () => {
  it('puts the book\'s own words first, then the Prophet\'s ﷺ, then each sayer once, under one name', () => {
    const facts = [
      fact([], { text: 'أول من آمن من الرجال' }),
      fact(['عمر بن الخطاب'], { text: 'سيدنا' }),
      fact(['محمد ﷺ'], { text: 'خليلا' }),
      fact(['علي بن أبي طالب'], { text: 'خير هذه الأمة' }),
      fact(['محمد ﷺ'], { text: 'صاحبي' }),
      fact(['علي'], { text: 'المصاحف' }),
    ];
    const groups = virtueGroups(facts);
    expect(groups.map(g => g.by)).toEqual([undefined, 'قال النبي ﷺ:', 'قال عمر بن الخطاب:', 'قال علي بن أبي طالب:']);
    expect(groups[1].items.map(item => item.fact.text)).toEqual(['خليلا', 'صاحبي']);
    expect(groups[3].items.map(item => item.at)).toEqual([3, 5]);
  });
});

describe('his names in a text', () => {
  const marked = (text: string, names: string[]) => namePieces(text, names).filter(piece => piece.name).map(piece => piece.text);
  it('finds a kunya in any case, with or without short vowels, and not inside another word', () => {
    expect(marked('لا تبقين في المسجد خوخة إلا خوخة أبي بكر', ['أبو بكر'])).toEqual(['أبي بكر']);
    expect(marked('ويأبي الله والمؤمنون إلا أبا بكر', ['أبو بكر'])).toEqual(['أبا بكر']);
    expect(marked('وَكَانَ أَبُو بَكْرَةَ مِنْ فُقَهَاءِ الصَّحَابَةِ', ['أبو بكرة'])).toEqual(['أَبُو بَكْرَةَ']);
    expect(marked('خير هذه الأمة بعد نبيها أبو بكر، وعمر', ['أبو بكر', 'عمر'])).toEqual(['أبو بكر', 'عمر']);
    expect(marked('عمرو بن العاص', ['عمر'])).toEqual([]);
  });
  it('gives the whole text back in order', () => {
    const text = 'إن لم تجديني فأتي أبا بكر';
    expect(namePieces(text, ['أبو بكر']).map(piece => piece.text).join('')).toBe(text);
  });
});
