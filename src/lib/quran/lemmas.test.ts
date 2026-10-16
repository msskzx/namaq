import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import built from '@/app/quran/lemmas.json';
import { countLemmas, fromBuckwalter } from './lemmas';

const MORPHOLOGY = join(__dirname, '../../../data/quran/quranic-corpus-morphology-0.4.txt');

describe('fromBuckwalter', () => {
  it('writes the corpus transliteration in Arabic, marks included', () => {
    expect(fromBuckwalter('{ll~ah')).toBe('ٱللَّه');
    expect(fromBuckwalter('r~aHoma`n')).toBe('رَّحْمَٰن');
    expect(fromBuckwalter('EalaY`')).toBe('عَلَىٰ');
    expect(fromBuckwalter("<in~")).toBe('إِنّ');
    expect(fromBuckwalter('rHm')).toBe('رحم');
  });
});

describe('countLemmas', () => {
  const lines = [
    '# header',
    'LOCATION\tFORM\tTAG\tFEATURES',
    '(1:1:1:1)\tbi\tP\tPREFIX|bi+',
    '(1:1:1:2)\tsomi\tN\tSTEM|POS:N|LEM:{som|ROOT:smw|M|GEN',
    '(1:1:2:1)\t{ll~ahi\tPN\tSTEM|POS:PN|LEM:{ll~ah|ROOT:Alh|GEN',
    '(1:2:2:1)\tli\tP\tPREFIX|l:P+',
    '(1:2:2:2)\tl~ahi\tPN\tSTEM|POS:PN|LEM:{ll~ah|ROOT:Alh|GEN',
    '(2:1:1:1)\tAl^m^\tINL\tSTEM|POS:INL',
    '(2:23:5:1)\tm~i\tP\tSTEM|POS:P|LEM:min',
    '(2:23:5:2)\tm~aA\tREL\tSTEM|POS:REL|LEM:maA',
    '(2:61:3:1)\tmaE2\tN\tSTEM|POS:N|LEM:maE2|ROOT:mEw',
  ];
  const result = countLemmas(lines.join('\r\n'));

  it('counts every stem under its lemma, one count per part of a word, by count then lemma', () => {
    expect(result.lemmas).toEqual([
      ['ٱللَّه', 2, 'اله'],
      ['مَا', 1, ''],
      ['مَع', 1, 'معو'],
      ['مِن', 1, ''],
      ['ٱسْم', 1, 'سمو'],
    ]);
  });

  it('counts the words the corpus gives no lemma', () => {
    expect(result.unlemmatized).toBe(1);
  });

  it('matches the committed JSON, with the name Allah 2,699 times', () => {
    const fromFile = countLemmas(readFileSync(MORPHOLOGY, 'utf8'));
    expect(fromFile).toEqual({ lemmas: built.lemmas, unlemmatized: built.unlemmatized });
    expect(fromFile.lemmas.find(([lemma]) => lemma === 'ٱللَّه')?.[1]).toBe(2699);
    expect(built.notice).toMatch(/Quranic Arabic Corpus \(morphology, version 0\.4\)/);
  });
});
