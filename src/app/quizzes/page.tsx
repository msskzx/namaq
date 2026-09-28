"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faBookOpen,
  faCircle,
  faCircleCheck,
  faCircleQuestion,
  faCircleXmark,
  faListOl,
  faPaperPlane,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import Button from "@/components/common/Button";
import QuizReferenceDialog from "@/components/common/QuizReferenceDialog";
import SlideSwitch from "@/components/graph/SlideSwitch";
import { useLanguage } from "@/components/language/LanguageContext";
import { parseQuizTopics } from "@/lib/quiz/topics";
import { fetcher } from "@/lib/swr";
import type { QuestionChoice, QuestionFamily, QuizLength, QuizTopic } from "@/lib/quiz/types";
import type { QuizReference } from "@/lib/quiz/quizReference";
import { QUIZ_TOPICS } from "@/lib/quiz/types";

interface QuizQuestionView {
  key: string;
  family: QuestionFamily;
  promptArabic: string;
  choices: QuestionChoice[];
  choiceDetails: Record<string, { text: string; reference: string }>;
  correctAnswer: string;
  evidence: { reference: QuizReference | null };
}

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
  const topics = useMemo(() => parseQuizTopics(searchParams) as QuizTopic[], [searchParams]);
  const length = Number(searchParams.get("length")) as QuizLength | 0;
  const person = searchParams.get("person") ?? "";
  const topicQuery = topics.map((value) => `topic=${encodeURIComponent(value)}`).join("&");
  const canCheckAvailability = Boolean(topics.length && (!topics.includes("PERSON_CIRCLE") || person));
  const availabilityQuery = canCheckAvailability
    ? `/api/quiz/availability?${topicQuery}${person ? `&person=${encodeURIComponent(person)}` : ""}`
    : null;
  const { data: availability } = useSWR<{ available: number; lengths: QuizLength[] }>(availabilityQuery, fetcher);
  const started = Boolean(topics.length && length && availability?.lengths.includes(length) && (!topics.includes("PERSON_CIRCLE") || person));
  const query = started
    ? `/api/quiz?${topicQuery}&length=${length}${person ? `&person=${encodeURIComponent(person)}` : ""}`
    : null;
  const { data, error, isLoading } = useSWR<{ questions: QuizQuestionView[] }>(query, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  });
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [referenceIndex, setReferenceIndex] = useState<number | null>(null);
  const [personInput, setPersonInput] = useState(person);
  const [personSuggestions, setPersonSuggestions] = useState<{ slug: string; name: string; nameTransliterated: string | null }[]>([]);

  useEffect(() => {
    setCurrent(0);
    setAnswers({});
    setSubmitted(false);
    setReferenceIndex(null);
  }, [query]);

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
    setReferenceIndex(null);
    router.push(pathname);
  }, [pathname, router]);

  const questions = useMemo(() => data?.questions ?? [], [data]);
  const score = useMemo(() => questions.filter((question, index) => answers[index] === question.correctAnswer).length, [questions, answers]);
  const percent = questions.length === 0 ? 0 : Math.round((score / questions.length) * 100);
  const passed = questions.length > 0 && score / questions.length >= 0.5;
  const questionState = (index: number) => {
    const given = answers[index];
    if (given === undefined) return 'unanswered' as const;
    return given === questions[index].correctAnswer ? 'correct' as const : 'incorrect' as const;
  };
  const stateLabel = (state: 'correct' | 'incorrect' | 'unanswered') =>
    ar ? ({ correct: 'صحيح', incorrect: 'خطأ', unanswered: 'بدون إجابة' } as const)[state]
      : ({ correct: 'correct', incorrect: 'incorrect', unanswered: 'unanswered' } as const)[state];
  const answerContent = (question: QuizQuestionView, value: string | undefined) => {
    const choice = question.choices.find((item) => item.value === value);
    if (!choice) return null;
    const detail = question.choiceDetails?.[choice.value];
    if (!detail) return choice.labelArabic;
    return <span><span className="block leading-relaxed">{detail.text}</span><span className="text-xs text-gray-500 dark:text-gray-400">{detail.reference}</span></span>;
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="container mx-auto max-w-2xl px-4 py-8" dir={ar ? "rtl" : "ltr"}>
          <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">{ar ? "اختبار" : "Quiz"}</h1>
          <fieldset className="mb-6 flex flex-wrap gap-x-4 gap-y-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
            <legend className="mb-2 w-full text-sm font-semibold text-gray-700 dark:text-gray-300">{ar ? "المواضيع — اختر واحدًا أو أكثر" : "Topics — choose one or more"}</legend>
            {QUIZ_TOPICS.map((value) => (
              <SlideSwitch
                key={value}
                checked={topics.includes(value)}
                onChange={() => setParam({
                  topic: topics.includes(value) ? topics.filter((item) => item !== value).join(",") || undefined : [...topics, value].join(","),
                  length: undefined,
                  person: value === "PERSON_CIRCLE" || topics.includes("PERSON_CIRCLE") ? person || undefined : undefined,
                })}
                label={TOPIC_LABELS[value][ar ? "ar" : "en"]}
              />
            ))}
          </fieldset>
          {topics.includes("PERSON_CIRCLE") && (
            <label className="mb-6 block">
              <span className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">{ar ? "الشخص" : "Person"}</span>
              <input
                type="text"
                value={personInput}
                onChange={async (event) => {
                  const value = event.target.value;
                  setPersonInput(value);
                  if (!value.trim()) {
                    setPersonSuggestions([]);
                    return;
                  }
                  const response = await fetch(`/api/people/suggest?q=${encodeURIComponent(value)}`);
                  if (response.ok) setPersonSuggestions((await response.json()).data ?? []);
                }}
                onBlur={() => setParam({ person: personInput || undefined, length: undefined })}
                list="quiz-people"
                placeholder={ar ? "ابحث عن شخص" : "Search for a person"}
                className="w-full rounded border border-amber-400 bg-transparent px-3 py-2 text-gray-900 dark:text-gray-100"
              />
              <datalist id="quiz-people">
                {personSuggestions.map((suggestion) => <option key={suggestion.slug} value={suggestion.slug}>{suggestion.nameTransliterated ?? suggestion.name}</option>)}
              </datalist>
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
        {error && <><ErrorMessage title={ar ? "تعذر إنشاء الاختبار" : "Failed to build the quiz"} /><Button className="mt-4" variant="outline" onClick={reset}><FontAwesomeIcon icon={faRotateLeft} />{ar ? "العودة للإعداد" : "Back to setup"}</Button></>}
        {isLoading || !data ? (
          <LoadingSpinner fill />
        ) : questions.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400"><p>{ar ? "لا توجد أسئلة كافية لهذا الاختيار." : "Not enough approved questions for this choice."}</p><Button className="mt-4" variant="outline" onClick={reset}><FontAwesomeIcon icon={faRotateLeft} />{ar ? "العودة للإعداد" : "Back to setup"}</Button></div>
        ) : submitted ? (
          <div>
            <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">{ar ? `النتيجة: ${score} من ${questions.length} (${percent}٪)` : `Score: ${score} / ${questions.length} (${percent}%)`}</h2>
            <p className={`mb-4 flex items-center gap-2 font-semibold ${passed ? 'text-green-700 dark:text-green-300' : 'text-red-600 dark:text-red-400'}`}>
              <FontAwesomeIcon icon={passed ? faCircleCheck : faCircleXmark} />
              {ar ? (passed ? 'ناجح' : 'راسب') : passed ? 'Passed' : 'Not passed'}
            </p>
            <ul className="space-y-4">
              {questions.map((question, index) => {
                const given = answers[index];
                const correct = given === question.correctAnswer;
                return (
                  <li key={question.key} className="rounded-lg border border-gray-200 p-4 dark:border-white/10">
                    <p className="mb-3 font-semibold text-gray-900 dark:text-gray-100">{question.promptArabic}</p>
                    <div className="mb-2 flex items-center gap-2">
                      <FontAwesomeIcon icon={correct ? faCircleCheck : faCircleXmark} className={correct ? "text-green-600" : "text-red-500"} />
                      <span>{given ? answerContent(question, given) : ar ? "بدون إجابة" : "No answer"}</span>
                    </div>
                    {!correct && <p className="text-sm text-gray-600 dark:text-gray-400">{ar ? "الصحيح: " : "Correct: "}{answerContent(question, question.correctAnswer)}</p>}
                    {question.evidence.reference && (
                      <Button className="mt-2" size="sm" variant="outline" onClick={() => setReferenceIndex(index)}>
                        <FontAwesomeIcon icon={faBookOpen} />
                        {ar ? "المصدر" : "Source"}
                      </Button>
                    )}
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
              {questions.map((_, index) => {
                const state = questionState(index);
                return (
                  <Button
                    key={index}
                    size="icon"
                    variant="outline"
                    active={index === current}
                    onClick={() => setCurrent(index)}
                    aria-label={`${ar ? `السؤال ${index + 1}` : `Question ${index + 1}`} - ${stateLabel(state)}`}
                  >
                    <FontAwesomeIcon
                      icon={state === 'correct' ? faCircleCheck : state === 'incorrect' ? faCircleXmark : faCircleQuestion}
                      className={state === 'correct' ? 'text-green-600' : state === 'incorrect' ? 'text-red-500' : undefined}
                    />
                    {index + 1}
                  </Button>
                );
              })}
            </div>
            <div className="rounded-lg border border-gray-200 p-6 dark:border-white/10">
              <p className="mb-4 font-semibold text-gray-900 dark:text-gray-100">{questions[current].promptArabic}</p>
              <div className="flex flex-col gap-2">
                {questions[current].choices.map((choice) => {
                  const locked = answers[current] !== undefined;
                  const isAnswer = choice.value === questions[current].correctAnswer;
                  const isGiven = answers[current] === choice.value;
                  return (
                    <Button
                      key={choice.value}
                      variant="outline"
                      active={isGiven}
                      onClick={() => {
                        if (answers[current] !== undefined) return;
                        setAnswers((previous) => ({ ...previous, [current]: choice.value }));
                      }}
                      className={locked && isAnswer ? 'border-green-600 bg-green-50 dark:bg-green-950/30' : locked && isGiven ? 'border-red-500 bg-red-50 dark:bg-red-950/30' : undefined}
                    >
                      <FontAwesomeIcon
                        icon={locked && (isAnswer || isGiven) ? (isAnswer ? faCircleCheck : faCircleXmark) : isGiven ? faCircleCheck : faCircle}
                        className={locked && isAnswer ? 'text-green-600' : locked && isGiven ? 'text-red-500' : undefined}
                      />
                      {answerContent(questions[current], choice.value)}
                      {locked && isAnswer ? <span className="text-xs font-semibold text-green-700 dark:text-green-300">{ar ? 'صحيح' : 'Correct'}</span> : null}
                      {locked && isGiven && !isAnswer ? <span className="text-xs font-semibold text-red-600 dark:text-red-400">{ar ? 'خطأ' : 'Incorrect'}</span> : null}
                    </Button>
                  );
                })}
              </div>
              {answers[current] !== undefined && questions[current].evidence.reference && (
                <Button className="mt-3" size="sm" variant="outline" onClick={() => setReferenceIndex(current)}>
                  <FontAwesomeIcon icon={faBookOpen} />
                  {ar ? "المصدر" : "Source"}
                </Button>
              )}
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
            <QuizReferenceDialog
              reference={referenceIndex !== null ? questions[referenceIndex]?.evidence.reference ?? null : null}
              onClose={() => setReferenceIndex(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
