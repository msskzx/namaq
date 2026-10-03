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
      },
      virtues: [
        { value: 'من السابقين الأولين', claims: ['abu-ubaydah/virtues'] },
        { value: 'أمين هذه الأمة', speaker: { name: 'النبي' }, claims: ['abu-ubaydah/virtues'] },
      ],
      titles: [
        { title: 't1', claims: ['abu-ubaydah/titles'] },
        { title: 't2', claims: ['abu-ubaydah/titles'] },
      ],
      relations: [
        { type: 'FATHER', to: 'p4', claims: ['abdullah-ibn-suhail-siyar24/father'] },
        { type: 'HUSBAND', to: 'p5', claims: ['abdullah-ibn-suhail-siyar24/father'] },
      ],
    },
    {
      ...basePerson('p2', 'الثاني', 'أبو الثاني'),
      relations: [
        { type: 'WIFE', to: 'p8', claims: ['abdullah-ibn-suhail-siyar24/father'] },
        { type: 'PATERNAL_COUSIN', to: 'p4', claims: ['abdullah-ibn-suhail-siyar24/father'] },
      ],
    },
    {
      ...basePerson('p3', 'الثالث', 'أبو الثالث'),
      relations: [{ type: 'BROTHER', to: 'p8', claims: ['abdullah-ibn-suhail-siyar24/father'] }],
    },
    basePerson('p4', 'الرابع', 'أبو الرابع'),
    basePerson('p5', 'الخامسة', 'أم الخامسة'),
    basePerson('p6', 'السادسة', 'أم السادسة'),
    basePerson('p7', 'السابعة', 'أم السابعة'),
    basePerson('p8', 'الثامن', 'أبو الثامن'),
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
    sex: ['p4', 'p5', 'p6', 'p7'].includes(person.slug) ? 'FEMALE' : 'MALE',
    titles: person.slug === 'p2' ? [{ slug: 't3' }] : person.slug === 'p3' ? [{ slug: 't4' }] : person.slug === 'p8' ? [{ slug: 't5' }] : [],
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

  it('uses titles held by women as distractors for women', async () => {
    const women = ['p1', 'p2', 'p3', 'p4'].map((slug, index) => ({
      ...basePerson(slug, `المرأة ${index + 1}`, `أم ${index + 1}`),
      fields: { sex: { value: 'FEMALE', claims: ['abu-ubaydah/titles'] } },
      titles: [{ title: `t${index + 1}`, claims: ['abu-ubaydah/titles'] }],
      ayat: [],
    }));
    loadCatalog.mockResolvedValue({ people: women, battles: [], events: [], utterances: [] });
    personFindMany.mockResolvedValue([
      ...women.map((person, index) => ({ slug: person.slug, name: person.name, sex: 'FEMALE', titles: [{ slug: `t${index + 1}` }], ayat: [] })),
      { slug: 'p5', name: 'الرجل', sex: 'MALE', titles: [{ slug: 't5' }], ayat: [] },
    ]);

    const question = (await generateQuestionCandidates()).find((item) => item.key === 'PERSON_TITLE:PERSON:p1:titles:t1');

    expect(question?.choices.map((choice) => choice.value).sort()).toEqual(['t1', 't2', 't3', 't4']);
  });

  it('uses women as distractors and feminine wording for a title held by a woman', async () => {
    const women = ['p1', 'p2', 'p3', 'p4'].map((slug, index) => ({
      ...basePerson(slug, `المرأة ${index + 1}`, `أم ${index + 1}`),
      fields: { sex: { value: 'FEMALE', claims: ['abu-ubaydah/titles'] } },
      titles: [{ title: `t${index + 1}`, claims: ['abu-ubaydah/titles'] }],
      ayat: [],
    }));
    loadCatalog.mockResolvedValue({ people: women, battles: [], events: [], utterances: [] });
    personFindMany.mockResolvedValue([
      ...women.map((person, index) => ({ slug: person.slug, name: person.name, sex: 'FEMALE', titles: [{ slug: `t${index + 1}` }], ayat: [] })),
      { slug: 'p5', name: 'الرجل', sex: 'MALE', titles: [], ayat: [] },
    ]);

    const question = (await generateQuestionCandidates()).find((item) => item.key === 'TITLE_HOLDER:TITLE:t1:titles:p1');

    expect(question?.promptArabic).toBe('من حملت لقب «اللقب الأول»؟');
    expect(question?.choices.map((choice) => choice.value).sort()).toEqual(['p1', 'p2', 'p3', 'p4']);
  });

  it('skips companion title assignments in both title directions', async () => {
    loadCatalog.mockResolvedValue({
      people: [{
        ...basePerson('p1', 'الأول', 'أبو الأول'),
        fields: {},
        titles: [{ title: 'companion', claims: ['abu-ubaydah/titles'] }],
        relations: [],
        ayat: [],
      }],
      battles: [],
      events: [],
      utterances: [],
    });
    personFindMany.mockResolvedValue([{ slug: 'p1', name: 'الأول', sex: 'MALE', titles: [], ayat: [] }]);
    titleFindMany.mockResolvedValue([{ slug: 'companion', name: 'صحابي' }]);
    const questions = await generateQuestionCandidates();
    expect(questions.filter((question) => question.family === 'PERSON_TITLE')).toEqual([]);
    expect(questions.filter((question) => question.family === 'TITLE_HOLDER')).toEqual([]);
  });

  it('skips companionship relations', async () => {
    loadCatalog.mockResolvedValue({
      people: [
        {
          ...basePerson('p1', 'الأول', 'أبو الأول'),
          fields: {},
          titles: [],
          relations: [
            { type: 'COMPANION_OF', to: 'p2', claims: ['abdullah-ibn-suhail-siyar24/father'] },
            { type: 'ACCOMPANIED_BY', to: 'p2', claims: ['abdullah-ibn-suhail-siyar24/father'] },
          ],
          ayat: [],
        },
        { ...basePerson('p2', 'الثاني', 'أبو الثاني'), fields: {}, titles: [], relations: [], ayat: [] },
      ],
      battles: [],
      events: [],
      utterances: [],
    });
    personFindMany.mockResolvedValue([
      { slug: 'p1', name: 'الأول', sex: 'MALE', titles: [], ayat: [] },
      { slug: 'p2', name: 'الثاني', sex: 'MALE', titles: [], ayat: [] },
    ]);
    const questions = await generateQuestionCandidates();
    expect(questions.filter((question) => question.family === 'RELATION')).toEqual([]);
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

  it('asks one question per virtue entry, naming the speaker where there is one', async () => {
    const questions = (await generateQuestionCandidates()).filter((question) => question.family === 'VIRTUE_HOLDER');
    expect(questions.map((question) => question.promptArabic).sort()).toEqual([
      'من تصفه المصادر بهذه المنقبة: «من السابقين الأولين»؟',
      'من وصفه النبي بقوله: «أمين هذه الأمة»؟',
    ].sort());
    expect(new Set(questions.map((question) => question.key)).size).toBe(2);
  });

  it('uses feminine Arabic for a female relationship answer', async () => {
    const questions = await generateQuestionCandidates();
    expect(questions.find((question) => question.family === 'RELATION')?.promptArabic).toContain('ابنةً');
  });

  it('fills wife-answer questions with women only', async () => {
    const questions = await generateQuestionCandidates();
    const wife = questions.find((question) => question.family === 'RELATION' && question.correctAnswer === 'p5');
    expect(wife?.promptArabic).toContain('زوجة');
    expect(wife?.choices.map((item) => item.value).sort()).toEqual(['p4', 'p5', 'p6', 'p7']);
  });

  it('fills husband-answer, son and brother questions with men only', async () => {
    const questions = await generateQuestionCandidates();
    for (const answer of ['p8']) {
      const asked = questions.filter((question) => question.family === 'RELATION' && question.correctAnswer === answer);
      expect(asked.length).toBeGreaterThan(0);
      for (const question of asked) {
        expect(question.choices.map((item) => item.value).sort()).toEqual(['p1', 'p2', 'p3', 'p8']);
      }
    }
  });

  it('keeps gender-neutral relationship prompts on the full pool', async () => {
    const questions = await generateQuestionCandidates();
    const cousin = questions.find((question) => question.family === 'RELATION' && question.attribute === 'PATERNAL_COUSIN');
    const values = cousin?.choices.map((item) => item.value) ?? [];
    expect(values).toContain('p4');
    expect(values.some((slug) => ['p1', 'p2', 'p3', 'p8'].includes(slug))).toBe(true);
  });

  it('drops a gender-constrained candidate without same-sex supply', async () => {
    const pair = [
      {
        ...basePerson('s1', 'الزوج', 'أبو الزوج'),
        relations: [{ type: 'HUSBAND', to: 'w1', claims: ['abdullah-ibn-suhail-siyar24/father'] }],
      },
      basePerson('w1', 'الزوجة', 'أم الزوجة'),
    ];
    loadCatalog.mockResolvedValue({ people: pair, battles: [], events: [], utterances: [] });
    personFindMany.mockResolvedValue([
      { slug: 's1', name: 'الزوج', sex: 'MALE', titles: [], ayat: [] },
      { slug: 'w1', name: 'الزوجة', sex: 'FEMALE', titles: [], ayat: [] },
    ]);
    const questions = await generateQuestionCandidates();
    expect(questions.filter((question) => question.family === 'RELATION')).toEqual([]);
  });

  it('keeps battle identity in excused-absence keys even when one person has several', async () => {
    const questions = await generateQuestionCandidates();
    const absenceKeys = questions.filter((question) => question.family === 'EXCUSED_ABSENCE_REASON').map((question) => question.key);
    expect(absenceKeys).toHaveLength(4);
    expect(new Set(absenceKeys).size).toBe(4);
  });
});
