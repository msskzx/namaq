"use client";

import React, { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faBook,
  faBookQuran,
  faCalendarAlt,
  faCircle,
  faCircleCheck,
  faCircleQuestion,
  faCircleXmark,
  faLink,
  faListOl,
  faPaperPlane,
  faRotateLeft,
  faShieldAlt,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import Button from "@/components/common/Button";
import { useLanguage } from "@/components/language/LanguageContext";
import { fetcher } from "@/lib/swr";
import type { QuestionChoice, QuestionFamily, QuizLength, QuizTopic } from "@/lib/quiz/types";
import { QUIZ_TOPICS } from "@/lib/quiz/types";

interface QuizQuestionView {
  key: string;
  family: QuestionFamily;
  promptArabic: string;
  choices: QuestionChoice[];
  correctAnswer: string;
  evidence: { readerUrls: string[] };
}

const TOPIC_ICONS: Record<QuizTopic, typeof faBook> = {
  PEOPLE: faUserGroup,
  BATTLES: faShieldAlt,
  RELATIONSHIPS: faLink,
  AYAT: faBookQuran,
  EVENTS: faCalendarAlt,
  PERSON_CIRCLE: faUserGroup,
};

const TOPIC_LABELS: Record<QuizTopic, { en: string; ar: string }> = {
  PEOPLE: { en: "People", ar: "أشخاص" },
  BATTLES: { en: "Battles", ar: "معارك" },
  RELATIONSHIPS: { en: "Relationships", ar: "علاقات" },
  AYAT: { en: "Ayat", ar: "آيات" },
  EVENTS: { en: "Events", ar: "أحداث" },
  PERSON_CIRCLE: { en: "A person's circle", ar: "دائرة شخص" },
};

export default function QuizzesPage() {
  const { language } = useLanguage();
  const ar = language === "ar";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") as QuizTopic | null;
  const length = Number(searchParams.get("length")) as QuizLength | 0;
  const person = searchParams.get("person") ?? "";
  const canCheckAvailability = Boolean(topic && (topic !== "PERSON_CIRCLE" || person));
  const availabilityQuery = canCheckAvailability
    ? `/api/quiz/availability?topic=${topic}${person ? `&person=${encodeURIComponent(person)}` : ""}`
    : null;
  const { data: availability } = useSWR<{ available: number; lengths: QuizLength[] }>(availabilityQuery, fetcher);
  const started = Boolean(topic && length && availability?.lengths.includes(length) && (topic !== "PERSON_CIRCLE" || person));
  const query = started
    ? `/api/quiz?topic=${topic}&length=${length}${person ? `&person=${encodeURIComponent(person)}` : ""}`
    : null;
  const { data, error, isLoading } = useSWR<{ questions: QuizQuestionView[] }>(query, fetcher);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [personInput, setPersonInput] = useState(person);

  const setParam = useCallback((changes: Record<string, string | undefined>) => {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    router.push(`${pathname}?${next.toString()}`);
  }, [pathname, router, searchParams]);

  const reset = useCallback(() => {
    setCurrent(0);
    setAnswers({});
    setSubmitted(false);
    router.push(pathname);
  }, [pathname, router]);

  const questions = useMemo(() => data?.questions ?? [], [data]);
  const score = useMemo(() => questions.filter((question, index) => answers[index] === question.correctAnswer).length, [questions, answers]);
  const answerLabel = (question: QuizQuestionView, value: string | undefined) =>
    question.choices.find((choice) => choice.value === value)?.labelArabic;

  if (!started) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="container mx-auto max-w-2xl px-4 py-8" dir={ar ? "rtl" : "ltr"}>
          <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">{ar ? "اختبار" : "Quiz"}</h1>
          <fieldset className="mb-6 flex flex-wrap gap-2">
            <legend className="mb-2 w-full text-sm font-semibold text-gray-700 dark:text-gray-300">{ar ? "الموضوع" : "Topic"}</legend>
            {QUIZ_TOPICS.map((value) => (
              <Button key={value} variant="outline" active={topic === value} onClick={() => setParam({ topic: value, length: undefined, person: value === "PERSON_CIRCLE" ? person : undefined })}>
                <FontAwesomeIcon icon={TOPIC_ICONS[value]} />
                {TOPIC_LABELS[value][ar ? "ar" : "en"]}
              </Button>
            ))}
          </fieldset>
          {topic === "PERSON_CIRCLE" && (
            <label className="mb-6 block">
              <span className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">{ar ? "معرّف الشخص" : "Person slug"}</span>
              <input
                type="text"
                value={personInput}
                onChange={(event) => setPersonInput(event.target.value)}
                onBlur={() => setParam({ person: personInput || undefined, length: undefined })}
                placeholder="abu-ubaydah-ibn-al-jarrah"
                className="w-full rounded border border-amber-400 bg-transparent px-3 py-2 text-gray-900 dark:text-gray-100"
              />
            </label>
          )}
          {availability && (
            <>
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                {ar ? `${availability.available} سؤالًا متاحًا` : `${availability.available} questions available`}
              </p>
              {availability.lengths.length > 0 ? (
                <fieldset className="mb-6 flex flex-wrap gap-2">
                  <legend className="mb-2 w-full text-sm font-semibold text-gray-700 dark:text-gray-300">{ar ? "عدد الأسئلة" : "Length"}</legend>
                  {availability.lengths.map((value) => (
                    <Button key={value} variant="outline" onClick={() => setParam({ length: String(value) })}>
                      <FontAwesomeIcon icon={faListOl} />
                      {value}
                    </Button>
                  ))}
                </fieldset>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">{ar ? "لا توجد خمسة أسئلة معتمدة لهذا الاختيار بعد." : "Fewer than five approved questions are available."}</p>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto max-w-2xl px-4 py-8" dir="rtl">
        {error && <ErrorMessage title={ar ? "تعذر إنشاء الاختبار" : "Failed to build the quiz"} />}
        {isLoading || !data ? (
          <LoadingSpinner fill />
        ) : submitted ? (
          <div>
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">{`النتيجة: ${score} من ${questions.length}`}</h2>
            <ul className="space-y-4">
              {questions.map((question, index) => {
                const given = answers[index];
                const correct = given === question.correctAnswer;
                return (
                  <li key={question.key} className="rounded-lg border border-gray-200 p-4 dark:border-white/10">
                    <p className="mb-3 font-semibold text-gray-900 dark:text-gray-100">{question.promptArabic}</p>
                    <div className="mb-2 flex items-center gap-2">
                      <FontAwesomeIcon icon={correct ? faCircleCheck : faCircleXmark} className={correct ? "text-green-600" : "text-red-500"} />
                      <span>{given ? answerLabel(question, given) : "بدون إجابة"}</span>
                    </div>
                    {!correct && <p className="text-sm text-gray-600 dark:text-gray-400">الصحيح: {answerLabel(question, question.correctAnswer)}</p>}
                    {question.evidence.readerUrls.map((url) => <a key={url} href={url} className="mt-1 block text-sm text-amber-600 hover:underline dark:text-amber-400">المصدر</a>)}
                  </li>
                );
              })}
            </ul>
            <Button className="mt-6" variant="primary" onClick={reset}>
              <FontAwesomeIcon icon={faRotateLeft} />
              {ar ? "اختبار جديد" : "New quiz"}
            </Button>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label={ar ? "الأسئلة" : "Questions"}>
              {questions.map((_, index) => (
                <Button key={index} size="icon" variant="outline" active={index === current} onClick={() => setCurrent(index)} aria-label={ar ? `السؤال ${index + 1}` : `Question ${index + 1}`}>
                  <FontAwesomeIcon icon={faCircleQuestion} />
                  {index + 1}
                </Button>
              ))}
            </div>
            <div className="rounded-lg border border-gray-200 p-6 dark:border-white/10">
              <p className="mb-4 font-semibold text-gray-900 dark:text-gray-100">{questions[current].promptArabic}</p>
              <div className="flex flex-col gap-2">
                {questions[current].choices.map((choice) => (
                  <Button key={choice.value} variant="outline" active={answers[current] === choice.value} onClick={() => setAnswers((previous) => ({ ...previous, [current]: choice.value }))}>
                    <FontAwesomeIcon icon={answers[current] === choice.value ? faCircleCheck : faCircle} />
                    {choice.labelArabic}
                  </Button>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Button variant="outline" disabled={current === 0} onClick={() => setCurrent((value) => Math.max(0, value - 1))}>
                <FontAwesomeIcon icon={ar ? faArrowRight : faArrowLeft} />
                {ar ? "السابق" : "Previous"}
              </Button>
              {current < questions.length - 1 ? (
                <Button variant="outline" onClick={() => setCurrent((value) => Math.min(questions.length - 1, value + 1))}>
                  {ar ? "التالي" : "Next"}
                  <FontAwesomeIcon icon={ar ? faArrowLeft : faArrowRight} />
                </Button>
              ) : (
                <Button variant="primary" onClick={() => setSubmitted(true)}>
                  <FontAwesomeIcon icon={faPaperPlane} />
                  {ar ? "إرسال" : "Submit"}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
