'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faBookOpen, faFilter, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import useSWR from 'swr';
import Button from '@/components/common/Button';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import QuizReferenceDialog from '@/components/common/QuizReferenceDialog';
import { useLanguage } from '@/components/language/LanguageContext';
import { QUESTION_FAMILIES, QUESTION_STATUSES } from '@/lib/quiz/types';
import type { QuestionChoice } from '@/lib/quiz/types';
import type { QuizReference } from '@/lib/quiz/quizReference';
import { fetcher } from '@/lib/swr';
import { useState } from 'react';

interface ReviewQuestion {
  key: string;
  fingerprint: string;
  family: string;
  topic: string;
  generatedPromptArabic: string;
  promptArabicOverride: string | null;
  choices: QuestionChoice[];
  choiceDetails: Record<string, { text: string; reference: string }>;
  correctAnswer: string;
  evidence: { claimKeys: string[]; reference: QuizReference | null };
  status: string;
  rejectionReason: string | null;
}

interface ReviewResponse {
  questions: ReviewQuestion[];
  pagination: { page: number; total: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean };
}

const TOPICS = ['PEOPLE', 'BATTLES', 'RELATIONSHIPS', 'AYAT', 'EVENTS'] as const;

export default function QuestionBankReview() {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const { data, error, isLoading } = useSWR<ReviewResponse>(`/api/quiz/questions${query ? `?${query}` : ''}`, fetcher);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    router.replace(`/quizzes/questions?${next.toString()}`);
  };

  const page = data?.pagination.page ?? Number(searchParams.get('page') ?? 1);
  const [reference, setReference] = useState<QuizReference | null>(null);

  const choiceContent = (question: ReviewQuestion, choice: QuestionChoice) => {
    const detail = question.choiceDetails?.[choice.value];
    if (!detail) return choice.labelArabic;
    return <span><span className="block leading-relaxed">{detail.text}</span><span className="text-xs text-gray-500 dark:text-gray-400">{detail.reference}</span></span>;
  };

  return (
    <main className="container mx-auto px-4 py-8" dir={ar ? 'rtl' : 'ltr'}>
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">{ar ? 'بنك أسئلة الاختبار' : 'Quiz question bank'}</h1>
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">{ar ? 'عرض تحريري عام للقراءة فقط.' : 'Public, read-only editorial review.'}</p>
      <div className="mb-6 grid gap-3 md:grid-cols-5">
        <label className="md:col-span-2">
          <span className="mb-1 flex items-center gap-2 text-sm font-semibold"><FontAwesomeIcon icon={faMagnifyingGlass} />{ar ? 'بحث' : 'Search'}</span>
          <input defaultValue={searchParams.get('search') ?? ''} onBlur={(event) => setParam('search', event.target.value.trim())} className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 dark:border-white/20" />
        </label>
        <Filter label={ar ? 'الحالة' : 'Status'} value={searchParams.get('status') ?? ''} values={QUESTION_STATUSES} onChange={(value) => setParam('status', value)} />
        <Filter label={ar ? 'الموضوع' : 'Topic'} value={searchParams.get('topic') ?? ''} values={TOPICS} onChange={(value) => setParam('topic', value)} />
        <Filter label={ar ? 'العائلة' : 'Family'} value={searchParams.get('family') ?? ''} values={QUESTION_FAMILIES} onChange={(value) => setParam('family', value)} />
      </div>
      <label className="mb-6 flex items-center gap-2 text-sm">
        <input type="checkbox" checked={searchParams.get('incomplete') === '1'} onChange={(event) => setParam('incomplete', event.target.checked ? '1' : '')} />
        <FontAwesomeIcon icon={faFilter} />
        {ar ? 'النص العربي الناقص فقط' : 'Incomplete Arabic prompt only'}
      </label>
      {error ? <ErrorMessage title={ar ? 'تعذر تحميل الأسئلة' : 'Failed to load questions'} /> : null}
      {isLoading || !data ? <LoadingSpinner fill /> : (
        <>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{ar ? `${data.pagination.total} سؤالًا` : `${data.pagination.total} questions`}</p>
          <ol className="space-y-5">
            {data.questions.map((question) => {
              const prompt = question.promptArabicOverride ?? question.generatedPromptArabic;
              return (
                <li key={question.key} className="rounded-lg border border-gray-200 p-5 dark:border-white/10">
                  <div className="mb-3 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{question.status}</span><span>{question.topic}</span><span>{question.family}</span>
                  </div>
                  <p className="mb-3 font-semibold" dir="rtl">{prompt}</p>
                  {question.promptArabicOverride && question.promptArabicOverride !== question.generatedPromptArabic ? (
                    <p className="mb-3 text-sm text-gray-500" dir="rtl">المولّد: {question.generatedPromptArabic}</p>
                  ) : null}
                  <ul className="mb-3 grid gap-2 md:grid-cols-2" dir="rtl">
                    {question.choices.map((choice) => (
                      <li key={choice.value} className={`flex items-start justify-between gap-3 rounded border px-3 py-2 ${choice.value === question.correctAnswer ? 'border-green-600 bg-green-50 dark:bg-green-950/30' : 'border-gray-200 dark:border-white/10'}`}>
                        {choiceContent(question, choice)}
                        {choice.value === question.correctAnswer ? <span className="shrink-0 text-xs font-semibold text-green-700 dark:text-green-300">{ar ? 'الإجابة الصحيحة' : 'Correct answer'}</span> : null}
                      </li>
                    ))}
                  </ul>
                  {question.rejectionReason ? <p className="mb-2 text-sm text-red-700 dark:text-red-300">{question.rejectionReason}</p> : null}
                  {question.evidence.reference && (
                    <Button className="mt-2" size="sm" variant="outline" onClick={() => setReference(question.evidence.reference)}>
                      <FontAwesomeIcon icon={faBookOpen} />
                      {ar ? 'المصدر' : 'Source'}
                    </Button>
                  )}
                </li>
              );
            })}
          </ol>
          <div className="mt-6 flex items-center justify-between">
            <Button variant="outline" disabled={!data.pagination.hasPreviousPage} onClick={() => setParam('page', String(page - 1))}>
              <FontAwesomeIcon icon={ar ? faArrowRight : faArrowLeft} />{ar ? 'السابق' : 'Previous'}
            </Button>
            <span>{page} / {Math.max(1, data.pagination.totalPages)}</span>
            <Button variant="outline" disabled={!data.pagination.hasNextPage} onClick={() => setParam('page', String(page + 1))}>
              {ar ? 'التالي' : 'Next'}<FontAwesomeIcon icon={ar ? faArrowLeft : faArrowRight} />
            </Button>
          </div>
          <QuizReferenceDialog reference={reference} onClose={() => setReference(null)} />
        </>
      )}
    </main>
  );
}

function Filter({ label, value, values, onChange }: { label: string; value: string; values: readonly string[]; onChange: (value: string) => void }) {
  return (
    <label>
      <span className="mb-1 block text-sm font-semibold">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded border border-gray-300 bg-white px-3 py-2 dark:border-white/20 dark:bg-black">
        <option value="">All</option>
        {values.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
    </label>
  );
}
