import { describe, expect, it } from 'vitest';
import { traitChips, traitSpans } from './tarajimTraits';
import peopleJson from './data/tarajim/people.json';

const sentences = (peopleJson as { appearance?: { text: string }[] }[]).flatMap(person => (person.appearance ?? []).map(fact => fact.text));

const labels = (text: string) => traitSpans(text).map(span => span.label);

describe('a person\'s looks in the book\'s words', () => {
  it('finds the words as printed, vowelled or not, the longer phrase first', () => {
    // Abu Bakr, al-Zuhri's sentence (Siyar, Sira and Caliphs 3/…).
    expect(labels('كان أبو بكر أبيض أصفر لطيفا جعدا مسترق الوركين، لا يثبت إزاره على وركيه')).toEqual(['أبيض', 'أصفر', 'لطيف', 'جعد', 'مسترق الوركين']);
    // Abu Usayd: white of head and beard is one trait, not «أبيض».
    expect(labels('رَأَيْتُ أَبَا أُسَيْدٍ بَعْدَ أَنْ ذَهَب بَصَرُهُ قَصِيْراً، دَحْدَاحاً، أَبْيَضَ الرَّأْسِ وَاللِّحْيَةِ')).toEqual(['قصير', 'دحداح', 'أبيض الرأس واللحية']);
  });

  it('leaves out a word the clause denies, and keeps a denial the book words as a trait', () => {
    // The Prophet ﷺ: «ليس بجعد قطط» says he was neither, so neither is a chip of his.
    const prophet = labels('كان ربعة من القوم، ليس بالطويل البائن، ولا بالقصير، أزهر اللون، ليس بأبيض أمهق، ولا آدم، ليس بجعد قطط، ولا بالسبط');
    expect(prophet).toEqual(['ربعة', 'ليس بالطويل', 'ولا بالقصير', 'أزهر اللون']);
  });

  it('names under a chip only the sayers the book names; an unnamed «وقيل» lights its words but is no second voice', () => {
    const facts = [
      { text: 'كان أبو بكر أبيض أصفر', by: 'الزهري' },
      { text: 'كان أبيض نحيفا', by: undefined },
    ];
    const chips = traitChips(facts, fact => fact.by);
    expect(chips).toEqual([
      { label: 'أبيض', names: ['الزهري'], agreed: false },
      { label: 'أصفر', names: ['الزهري'], agreed: false },
      { label: 'نحيف', names: [], agreed: false },
    ]);
    // Two named sayers giving one word: shown once, with both.
    const two = traitChips([{ text: 'كان طويلا', by: 'عروة' }, { text: 'كان رجلا طويلا', by: 'الذهبي' }], fact => fact.by);
    expect(two).toEqual([{ label: 'طويل', names: ['عروة', 'الذهبي'], agreed: true }]);
  });

  it('finds at least one trait in every appearance sentence of the book that describes a body', () => {
    // Each sentence in the data gives a chip, so no «صفته» card is a bare text with no chips above it.
    const missing = sentences.filter(text => labels(text).length === 0);
    expect(missing).toEqual([]);
  });
});
