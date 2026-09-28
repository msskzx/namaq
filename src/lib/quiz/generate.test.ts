import { beforeEach, describe, expect, it, vi } from 'vitest';

const { loadCatalog, personFindMany, titleFindMany } = vi.hoisted(() => ({ loadCatalog: vi.fn(), personFindMany: vi.fn(), titleFindMany: vi.fn() }));
vi.mock('@/lib/catalog/loadCatalog', () => ({ loadCatalog }));
vi.mock('@/lib/prisma', () => ({ prisma: { person: { findMany: personFindMany }, title: { findMany: titleFindMany } } }));

import { generateQuestionCandidates } from './generate';

const basePerson = (slug: string, name: string, kunya: string) => ({
  kind: 'PERSON', slug, name, hasProfile: true,
  fields: { kunya: { value: kunya, claims: ['abu-ubaydah/kunya'] } },
  titles: [], relations: [], ayat: [{ surah: 1, ayah: Number(slug.slice(1)), claims: ['awf/ayah-al-fath'] }],
});

beforeEach(() => {
  vi.clearAllMocks();
  const people = [
    {
      ...basePerson('p1', 'الأول', 'أبو الأول'),
      fields: {
        kunya: { value: 'أبو الأول', claims: ['abu-ubaydah/kunya'] },
        virtues: { value: 'من السابقين الأولين', claims: ['abu-ubaydah/virtues'] },
      },
      titles: [
        { title: 't1', claims: ['abu-ubaydah/titles'] },
        { title: 't2', claims: ['abu-ubaydah/titles'] },
      ],
      relations: [{ type: 'FATHER', to: 'p4', claims: ['abdullah-ibn-suhail-siyar24/father'] }],
    },
    basePerson('p2', 'الثاني', 'أبو الثاني'),
    basePerson('p3', 'الثالث', 'أبو الثالث'),
    basePerson('p4', 'الرابع', 'أبو الرابع'),
  ];
  const battles = [1, 2, 3, 4].map((year) => ({
    kind: 'BATTLE',
    slug: `battle-${year}`,
    name: `المعركة ${year}`,
    fields: { hijriYear: { value: year, claims: ['sira/badr-ula'] } },
    participants: [{
      person: 'p1',
      isMuslim: true,
      relation: 'ABSENT_FROM',
      status: ['ABSENT_EXCUSED'],
      summary: { value: `العذر ${year}`, claims: ['saeed-ibn-zaid/badr-absent'] },
      claims: ['saeed-ibn-zaid/badr-absent'],
    }],
  }));
  const events = [1, 2, 3, 4].map((year) => ({
    kind: 'EVENT',
    slug: `event-${year}`,
    name: `الحدث ${year}`,
    type: 'OTHER',
    fields: { hijriYear: { value: year, claims: ['sira/isra-year'] } },
    people: [],
  }));
  loadCatalog.mockResolvedValue({ people, battles, events, utterances: [] });
  personFindMany.mockResolvedValue(people.map((person) => ({
    slug: person.slug,
    name: person.name,
    sex: person.slug === 'p4' ? 'FEMALE' : 'MALE',
    titles: [],
    ayat: [],
  })));
  titleFindMany.mockResolvedValue([
    { slug: 't1', name: 'اللقب الأول' },
    { slug: 't2', name: 'اللقب الثاني' },
    { slug: 't3', name: 'اللقب الثالث' },
    { slug: 't4', name: 'اللقب الرابع' },
    { slug: 't5', name: 'اللقب الخامس' },
  ]);
});

describe('question candidate generation', () => {
  it('enumerates every evidenced title assignment when one person has several titles', async () => {
    const questions = await generateQuestionCandidates();
    expect(questions.filter((question) => question.family === 'PERSON_TITLE')).toHaveLength(2);
    expect(questions.filter((question) => question.family === 'TITLE_HOLDER')).toHaveLength(2);
  });

  it('creates complete Arabic questions with stable semantic keys', async () => {
    const questions = await generateQuestionCandidates();
    const kunya = questions.find((question) => question.family === 'KUNYA');
    expect(kunya).toMatchObject({ topic: 'PEOPLE', promptArabic: 'ما كنية الأول؟', evidence: { claimKeys: ['abu-ubaydah/kunya'] } });
    expect(kunya?.choices).toHaveLength(4);
    expect(kunya?.key).toBe('KUNYA:PERSON:p1:kunya:أبو الأول');
  });

  it('generates every agreed family from cited catalog values', async () => {
    const questions = await generateQuestionCandidates();
    expect(new Set(questions.map((question) => question.family))).toEqual(new Set([
      'KUNYA',
      'PERSON_TITLE',
      'TITLE_HOLDER',
      'VIRTUE_HOLDER',
      'RELATION',
      'AYAH_LINK',
      'BATTLE_HIJRI_YEAR',
      'EXCUSED_ABSENCE_REASON',
      'EVENT_HIJRI_YEAR',
    ]));
  });

  it('uses feminine Arabic for a female relationship answer', async () => {
    const questions = await generateQuestionCandidates();
    expect(questions.find((question) => question.family === 'RELATION')?.promptArabic).toContain('ابنةً');
  });

  it('keeps battle identity in excused-absence keys even when one person has several', async () => {
    const questions = await generateQuestionCandidates();
    const absenceKeys = questions.filter((question) => question.family === 'EXCUSED_ABSENCE_REASON').map((question) => question.key);
    expect(absenceKeys).toHaveLength(4);
    expect(new Set(absenceKeys).size).toBe(4);
  });
});
