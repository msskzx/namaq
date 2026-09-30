import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadCatalog } from '@/lib/catalog/loadCatalog';
import { legacyUnreviewed, type Provenance } from '@/lib/catalog/types';
import { formatHijriYear } from '@/lib/hijriYear';
import { prisma } from '@/lib/prisma';
import type { GeneratedQuestion, QuestionChoice } from './types';

type CandidateInput = Omit<GeneratedQuestion, 'key' | 'choices' | 'correctAnswer'> & {
  answer: QuestionChoice;
  pool: QuestionChoice[];
  excludedValues?: Iterable<string>;
};

function cited(claims: Provenance, eligible: Set<string>): string[] {
  if (claims === legacyUnreviewed) return [];
  return claims.filter((key) => eligible.has(key));
}

function orderedPool(key: string, choices: QuestionChoice[]) {
  return [...choices].sort((a, b) => {
    const left = createHash('sha256').update(`${key}:${a.value}`).digest('hex');
    const right = createHash('sha256').update(`${key}:${b.value}`).digest('hex');
    return left.localeCompare(right);
  });
}

function candidate(input: CandidateInput): GeneratedQuestion | null {
  const evidence = [...new Set(input.evidence.claimKeys)].sort();
  if (evidence.length === 0) return null;
  const key = [input.family, input.subject?.kind ?? '-', input.subject?.slug ?? '-', input.attribute ?? '-', input.answer.value].join(':');
  const excluded = new Set([input.answer.value, ...(input.excludedValues ?? [])]);
  const distinct = new Map(input.pool.map((item) => [item.value, item]));
  const distractors = orderedPool(key, [...distinct.values()].filter((item) => !excluded.has(item.value))).slice(0, 3);
  if (distractors.length < 3) return null;
  return {
    key,
    family: input.family,
    topic: input.topic,
    subject: input.subject,
    attribute: input.attribute,
    personSlugs: [...new Set(input.personSlugs)].sort(),
    promptArabic: input.promptArabic,
    choices: [input.answer, ...distractors],
    correctAnswer: input.answer.value,
    evidence: { claimKeys: evidence },
  };
}

function mergeCandidates(candidates: GeneratedQuestion[]) {
  const merged = new Map<string, GeneratedQuestion>();
  for (const question of candidates) {
    const existing = merged.get(question.key);
    if (!existing) {
      merged.set(question.key, question);
      continue;
    }
    existing.evidence.claimKeys = [...new Set([...existing.evidence.claimKeys, ...question.evidence.claimKeys])].sort();
  }
  return [...merged.values()];
}

function choice(value: string, labelArabic: string): QuestionChoice {
  return { value, labelArabic };
}

// The sex the answer wording requires, by declared relation type: a fixed sex
// when the prompt names it, ANSWER when the prompt agrees with the answer,
// null when the wording is neutral. See docs/plans/reviewed-quiz-bank.md.
const RELATION_ANSWER_SEX: Record<string, 'MALE' | 'FEMALE' | 'ANSWER' | null> = {
  HUSBAND: 'FEMALE',
  WIFE: 'MALE',
  SON: 'MALE',
  DAUGHTER: 'MALE',
  FATHER: 'ANSWER',
  MOTHER: 'ANSWER',
  BROTHER: 'MALE',
  SISTER: 'FEMALE',
  HALF_BROTHER: 'MALE',
  HALF_SISTER: 'FEMALE',
  GRANDFATHER: 'ANSWER',
  GRANDMOTHER: 'ANSWER',
  GRANDSON: 'ANSWER',
  GRANDDAUGHTER: 'ANSWER',
  MILK_BROTHER: 'MALE',
  MILK_SISTER: 'FEMALE',
  PATERNAL_UNCLE: 'MALE',
  PATERNAL_NEPHEW: 'MALE',
  MATERNAL_UNCLE: 'MALE',
};

function relationPrompt(type: string, name: string, answerSex: string | null) {
  const prompts: Record<string, string> = {
    FATHER: `أي من هؤلاء كان ${answerSex === 'FEMALE' ? 'ابنةً' : 'ابنًا'} لـ«${name}»؟`,
    MOTHER: `أي من هؤلاء كان ${answerSex === 'FEMALE' ? 'ابنةً' : 'ابنًا'} لـ«${name}»؟`,
    HUSBAND: `من كانت زوجة «${name}»؟`,
    WIFE: `من كان زوج «${name}»؟`,
    SON: `من ${answerSex === 'FEMALE' ? 'كانت والدة' : 'كان والد'} «${name}»؟`,
    DAUGHTER: `من ${answerSex === 'FEMALE' ? 'كانت والدة' : 'كان والد'} «${name}»؟`,
    BROTHER: `أي من هؤلاء كان أخًا لـ«${name}»؟`,
    SISTER: `أي من هؤلاء كان أختًا لـ«${name}»؟`,
    HALF_BROTHER: `أي من هؤلاء كان أخًا غير شقيق لـ«${name}»؟`,
    HALF_SISTER: `أي من هؤلاء كان أختًا غير شقيقة لـ«${name}»؟`,
    GRANDFATHER: `أي من هؤلاء كان ${answerSex === 'FEMALE' ? 'حفيدةً' : 'حفيدًا'} لـ«${name}»؟`,
    GRANDMOTHER: `أي من هؤلاء كان ${answerSex === 'FEMALE' ? 'حفيدةً' : 'حفيدًا'} لـ«${name}»؟`,
    GRANDSON: `من ${answerSex === 'FEMALE' ? 'كانت جدة' : 'كان جد'} «${name}»؟`,
    GRANDDAUGHTER: `من ${answerSex === 'FEMALE' ? 'كانت جدة' : 'كان جد'} «${name}»؟`,
    MAWLA: `من ارتبط بـ«${name}» بعلاقة الولاء؟`,
    PATRON: `من كان مولى «${name}»؟`,
    PACT_BROTHER: `من آخى النبي بينه وبين «${name}»؟`,
    CALLED_TO_ISLAM: `من أسلم بدعوة «${name}»؟`,
    ANSWERED_CALL_OF: `على يد من أسلم «${name}»؟`,
    COMPANION_OF: `من النبي الذي صحبه «${name}»؟`,
    PATERNAL_UNCLE: `أي من هؤلاء كان «${name}» عمًّا له؟`,
    PATERNAL_NEPHEW: `من كان عم «${name}»؟`,
    MATERNAL_UNCLE: `أي من هؤلاء كان «${name}» خالًا له؟`,
    PATERNAL_COUSIN: `من كان ابن عم «${name}» أو ابنة عمه؟`,
    MATERNAL_COUSIN: `من كان ابن خال «${name}» أو ابنة خاله؟`,
    MILK_BROTHER: `من كان أخًا لـ«${name}» من الرضاعة؟`,
    MILK_SISTER: `من كانت أختًا لـ«${name}» من الرضاعة؟`,
  };
  return prompts[type] ?? `من ارتبط بـ«${name}» بعلاقة «${type}»؟`;
}

function eligibleClaimKeys() {
  const keys = new Set<string>();
  for (const dir of readdirSync('data/history/batches')) {
    const path = join('data/history/batches', dir, 'batch.json');
    const batch = JSON.parse(readFileSync(path, 'utf8')) as {
      claims: { key: string; disputed?: boolean; citations?: unknown[] }[];
    };
    for (const claim of batch.claims) {
      if (!claim.disputed && (claim.citations?.length ?? 0) > 0) keys.add(claim.key);
    }
  }
  return keys;
}

export async function generateQuestionCandidates(): Promise<GeneratedQuestion[]> {
  const [catalog, dbPeople, dbTitles] = await Promise.all([
    loadCatalog(),
    prisma.person.findMany({
      select: {
        slug: true,
        name: true,
        sex: true,
        titles: { select: { slug: true } },
        ayat: { select: { number: true, surah: { select: { number: true } } } },
      },
    }),
    prisma.title.findMany({ select: { slug: true, name: true } }),
  ]);
  const eligible = eligibleClaimKeys();
  const peopleBySlug = new Map(dbPeople.map((person) => [person.slug, person]));
  for (const person of catalog.people) {
    const stored = peopleBySlug.get(person.slug);
    if (!stored) {
      peopleBySlug.set(person.slug, { slug: person.slug, name: person.name, sex: person.fields.sex?.value ?? null, titles: [], ayat: [] });
    } else if (!stored.sex && person.fields.sex?.value) {
      stored.sex = person.fields.sex.value;
    }
  }
  const personChoices = [...peopleBySlug.values()].map((person) => choice(person.slug, person.name));
  const titleBySlug = new Map(dbTitles.map((title) => [title.slug, title]));
  const titleChoices = dbTitles.map((title) => choice(title.slug, title.name));
  const catalogTitlesByPerson = new Map(catalog.people.map((person) => [person.slug, new Set(person.titles.map((title) => title.title))]));
  const catalogAyatByPerson = new Map(catalog.people.map((person) => [person.slug, new Set((person.ayat ?? []).map((ayah) => `${ayah.surah}:${ayah.ayah}`))]));
  const candidates: GeneratedQuestion[] = [];
  const add = (value: GeneratedQuestion | null) => value && candidates.push(value);
  const eligibleKunyas = catalog.people.flatMap((person) => {
    const field = person.fields.kunya;
    return field && cited(field.claims, eligible).length > 0 ? [choice(field.value, field.value)] : [];
  });
  const ayahPool = catalog.people.flatMap((person) =>
    (person.ayat ?? []).flatMap((ayah) => cited(ayah.claims, eligible).length > 0
      ? [choice(`${ayah.surah}:${ayah.ayah}`, `${ayah.surah}:${ayah.ayah}`)]
      : []),
  );

  for (const person of catalog.people) {
    const dbPerson = peopleBySlug.get(person.slug);
    if (!dbPerson) continue;
    const kunya = person.fields.kunya;
    if (kunya) {
      add(candidate({
        family: 'KUNYA', topic: 'PEOPLE', subject: { kind: 'PERSON', slug: person.slug }, attribute: 'kunya',
        personSlugs: [person.slug], promptArabic: `ما كنية ${person.name}؟`, answer: choice(kunya.value, kunya.value),
        pool: eligibleKunyas, evidence: { claimKeys: cited(kunya.claims, eligible) },
      }));
    }

    const virtues = person.fields.virtues;
    if (virtues) {
      add(candidate({
        family: 'VIRTUE_HOLDER', topic: 'PEOPLE', subject: { kind: 'PERSON', slug: person.slug }, attribute: 'virtues',
        personSlugs: [person.slug], promptArabic: `من تصفه المصادر بهذه المنقبة: «${virtues.value}»؟`,
        answer: choice(person.slug, person.name), pool: personChoices, evidence: { claimKeys: cited(virtues.claims, eligible) },
      }));
    }

    const heldTitles = new Set([...dbPerson.titles.map((title) => title.slug), ...(catalogTitlesByPerson.get(person.slug) ?? [])]);
    for (const assignment of person.titles) {
      if (assignment.title === 'companion') continue;
      const title = titleBySlug.get(assignment.title);
      if (!title) continue;
      const evidence = { claimKeys: cited(assignment.claims, eligible) };
      add(candidate({
        family: 'PERSON_TITLE', topic: 'PEOPLE', subject: { kind: 'PERSON', slug: person.slug }, attribute: 'titles',
        personSlugs: [person.slug], promptArabic: `أي لقب ${dbPerson.sex === 'FEMALE' ? 'عُرفت' : 'عُرف'} به ${person.name}؟`,
        answer: choice(title.slug, title.name), pool: titleChoices, excludedValues: heldTitles, evidence,
      }));
      const holders = new Set([...peopleBySlug.values()].filter((other) =>
        other.titles.some((held) => held.slug === title.slug) || catalogTitlesByPerson.get(other.slug)?.has(title.slug),
      ).map((other) => other.slug));
      add(candidate({
        family: 'TITLE_HOLDER', topic: 'PEOPLE', subject: { kind: 'TITLE', slug: title.slug }, attribute: 'titles',
        personSlugs: [person.slug], promptArabic: `من حمل لقب «${title.name}»؟`, answer: choice(person.slug, person.name),
        pool: personChoices, excludedValues: holders, evidence,
      }));
    }

    const linkedAyat = new Set([...dbPerson.ayat.map((ayah) => `${ayah.surah.number}:${ayah.number}`), ...(catalogAyatByPerson.get(person.slug) ?? [])]);
    for (const ayah of person.ayat ?? []) {
      const value = `${ayah.surah}:${ayah.ayah}`;
      add(candidate({
        family: 'AYAH_LINK', topic: 'AYAT', subject: { kind: 'PERSON', slug: person.slug }, attribute: 'ayat',
        personSlugs: [person.slug], promptArabic: `أي آية ربطتها المصادر بسيرة «${person.name}»؟`, answer: choice(value, value),
        pool: ayahPool, excludedValues: linkedAyat, evidence: { claimKeys: cited(ayah.claims, eligible) },
      }));
    }

    for (const relation of person.relations) {
      if (relation.type === 'COMPANION_OF' || relation.type === 'ACCOMPANIED_BY') continue;
      const answer = peopleBySlug.get(relation.to);
      if (!answer) continue;
      const trueTargets = new Set(person.relations.filter((other) => other.type === relation.type).map((other) => other.to));
      const role = RELATION_ANSWER_SEX[relation.type] ?? null;
      const expected = role === 'ANSWER' ? answer.sex : role;
      if (expected !== 'MALE' && expected !== 'FEMALE') {
        add(candidate({
          family: 'RELATION', topic: 'RELATIONSHIPS', subject: { kind: 'PERSON', slug: person.slug }, attribute: relation.type,
          personSlugs: [person.slug, relation.to], promptArabic: relationPrompt(relation.type, person.name, answer.sex),
          answer: choice(answer.slug, answer.name), pool: personChoices, excludedValues: trueTargets,
          evidence: { claimKeys: cited(relation.claims, eligible) },
        }));
        continue;
      }
      if (answer.sex !== expected) continue;
      const pool = personChoices.filter((item) => peopleBySlug.get(item.value)?.sex === expected);
      add(candidate({
        family: 'RELATION', topic: 'RELATIONSHIPS', subject: { kind: 'PERSON', slug: person.slug }, attribute: relation.type,
        personSlugs: [person.slug, relation.to], promptArabic: relationPrompt(relation.type, person.name, answer.sex),
        answer: choice(answer.slug, answer.name), pool, excludedValues: trueTargets,
        evidence: { claimKeys: cited(relation.claims, eligible) },
      }));
    }
  }

  const battleYears = catalog.battles.flatMap((battle) => battle.fields?.hijriYear
    ? [choice(String(battle.fields.hijriYear.value), formatHijriYear(battle.fields.hijriYear.value, 'ar'))]
    : []);
  const absenceReasons = catalog.battles.flatMap((battle) => battle.participants.flatMap((participation) =>
    participation.relation === 'ABSENT_FROM' && participation.status?.includes('ABSENT_EXCUSED') && participation.summary
      ? [choice(participation.summary.value, participation.summary.value)]
      : [],
  ));
  for (const battle of catalog.battles) {
    const year = battle.fields?.hijriYear;
    if (year) {
      add(candidate({
        family: 'BATTLE_HIJRI_YEAR', topic: 'BATTLES', subject: { kind: 'BATTLE', slug: battle.slug }, attribute: 'hijriYear',
        personSlugs: [], promptArabic: `في أي سنة هجرية وقع الحدث المعروف بـ«${battle.name}»؟`, answer: choice(String(year.value), formatHijriYear(year.value, 'ar')),
        pool: battleYears, evidence: { claimKeys: cited(year.claims, eligible) },
      }));
    }
    for (const participation of battle.participants) {
      if (participation.relation !== 'ABSENT_FROM' || !participation.status?.includes('ABSENT_EXCUSED') || !participation.summary) continue;
      const person = peopleBySlug.get(participation.person);
      if (!person) continue;
      add(candidate({
        family: 'EXCUSED_ABSENCE_REASON', topic: 'BATTLES', subject: { kind: 'BATTLE', slug: battle.slug }, attribute: person.slug,
        personSlugs: [person.slug], promptArabic: `لماذا ${person.sex === 'FEMALE' ? 'غابت' : 'غاب'} ${person.name} عن ${battle.name}؟`,
        answer: choice(participation.summary.value, participation.summary.value), pool: absenceReasons,
        evidence: { claimKeys: cited(participation.summary.claims, eligible) },
      }));
    }
  }

  const eventYears = catalog.events.flatMap((event) => event.fields.hijriYear
    ? [choice(String(event.fields.hijriYear.value), formatHijriYear(event.fields.hijriYear.value, 'ar'))]
    : []);
  for (const event of catalog.events) {
    const year = event.fields.hijriYear;
    if (!year) continue;
    add(candidate({
      family: 'EVENT_HIJRI_YEAR', topic: 'EVENTS', subject: { kind: 'EVENT', slug: event.slug }, attribute: 'hijriYear',
      personSlugs: [], promptArabic: `في أي سنة هجرية وقع حدث «${event.name}»؟`, answer: choice(String(year.value), formatHijriYear(year.value, 'ar')),
      pool: eventYears, evidence: { claimKeys: cited(year.claims, eligible) },
    }));
  }

  return mergeCandidates(candidates);
}
