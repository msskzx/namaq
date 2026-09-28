import { NextResponse } from 'next/server';
import type { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { ayahDetails } from '@/lib/quiz/ayahDetails';
import { selectQuizReference } from '@/lib/quiz/quizReference';
import { QUESTION_FAMILIES, QUESTION_STATUSES } from '@/lib/quiz/types';

const PAGE_SIZE = 50;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') ?? '1');
  const status = searchParams.get('status');
  const topic = searchParams.get('topic');
  const family = searchParams.get('family');
  const search = searchParams.get('search')?.trim();
  const incomplete = searchParams.get('incomplete') === '1';
  if (!Number.isInteger(page) || page < 1) return NextResponse.json({ error: 'Invalid page' }, { status: 400 });
  if (status && !QUESTION_STATUSES.includes(status as (typeof QUESTION_STATUSES)[number])) return NextResponse.json({ error: 'Unknown status' }, { status: 400 });
  if (family && !QUESTION_FAMILIES.includes(family as (typeof QUESTION_FAMILIES)[number])) return NextResponse.json({ error: 'Unknown family' }, { status: 400 });

  const where: Prisma.QuizQuestionWhereInput = {
    ...(status ? { status: status as Prisma.QuizQuestionWhereInput['status'] } : {}),
    ...(topic ? { topic } : {}),
    ...(family ? { family } : {}),
    ...(incomplete ? { generatedPromptArabic: '' } : {}),
    ...(search ? {
      AND: [{ OR: [
        { key: { contains: search, mode: 'insensitive' } },
        { generatedPromptArabic: { contains: search, mode: 'insensitive' } },
        { promptArabicOverride: { contains: search, mode: 'insensitive' } },
      ] }],
    } : {}),
  };
  const [total, questions] = await Promise.all([
    prisma.quizQuestion.count({ where }),
    prisma.quizQuestion.findMany({ where, orderBy: [{ status: 'asc' }, { key: 'asc' }], skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
  ]);
  const claimKeys = [...new Set(questions.flatMap((question) => {
    const evidence = question.evidence as { claimKeys?: string[] };
    return evidence.claimKeys ?? [];
  }))];
  const claims = claimKeys.length > 0 ? await prisma.historicalClaim.findMany({
    where: { authoringKey: { in: claimKeys } },
    select: {
      authoringKey: true,
      citations: {
        select: {
          subjectKind: true,
          subjectSlug: true,
          excerptArabic: true,
          pageReference: true,
          source: { select: { title: true } },
          passage: { select: { anchor: true, page: { select: { accountId: true, sequence: true } } } },
        },
      },
    },
  }) : [];
  const details = await ayahDetails(questions.map((question) => ({
    family: question.family,
    choices: question.choices as { value: string }[],
  })));
  return NextResponse.json({
    questions: questions.map((question) => {
      const evidence = question.evidence as { claimKeys?: string[] };
      const keys = evidence.claimKeys ?? [];
      const choices = question.choices as { value: string }[];
      return {
        ...question,
        choiceDetails: Object.fromEntries(
          choices.map((choice) => [choice.value, details.get(choice.value)]).filter((entry) => entry[1]),
        ),
        evidence: { claimKeys: keys, reference: selectQuizReference(keys, claims) },
      };
    }),
    pagination: {
      page,
      limit: PAGE_SIZE,
      total,
      totalPages: Math.ceil(total / PAGE_SIZE),
      hasNextPage: page * PAGE_SIZE < total,
      hasPreviousPage: page > 1,
    },
  });
}
