"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faCircleCheck,
  faCircleXmark,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import Button from "@/components/common/Button";
import SlideSwitch from "@/components/graph/SlideSwitch";
import { useLanguage } from "@/components/language/LanguageContext";
import { fetcher } from "@/lib/swr";
import { relationPrompt } from "@/lib/quiz/relationPrompt";
import { parseQuizTopics } from "@/lib/quiz/topics";
import { QUIZ_LENGTHS, QUIZ_TOPICS, type QuizLength, type QuizTopic } from "@/lib/quiz/types";

interface DisplayName {
  name: string;
  nameTransliterated: string | null;
}

interface AyahDisplay { text: string; reference: string }

interface QuizQuestionView {
  claimId: string;
  family: string;
  subject: { kind: string; slug: string };
  subjectName: DisplayName | null;
  choices: string[];
  choiceLabels: Record<string, DisplayName>;
  choiceDetails: Record<string, AyahDisplay>;
  attribute: string;
  correctAnswer: string;
  evidence: { readerUrls: string[] };
}

const TOPIC_LABELS: Record<QuizTopic, { en: string; ar: string }> = {
  PEOPLE: { en: "People", ar: "أشخاص" },
  BATTLES: { en: "Battles", ar: "معارك" },
  TITLES: { en: "Titles", ar: "ألقاب" },
  EVENTS: { en: "Events", ar: "أحداث" },
  PERSON_CIRCLE: { en: "A person's circle", ar: "دائرة شخص" },
};

function displayName(name: DisplayName | null | undefined, fallback: string, ar: boolean): string {
  if (!name) return fallback;
  return ar ? name.name : name.nameTransliterated || name.name;
}

function questionPrompt(question: QuizQuestionView, subject: string, ar: boolean): string {
  if (question.family === "RELATION") return relationPrompt(subject, question.attribute, ar ? "ar" : "en");
  const prompts: Record<string, { en: string; ar: string }> = {
    PARTICIPATION: { en: `Which battle did ${subject} participate in?`, ar: `في أي معركة شارك ${subject}؟` },
    TITLE: { en: `Which title did ${subject} hold?`, ar: `ما اللقب الذي حمله ${subject}؟` },
    TITLE_HOLDER: { en: "Who held this title?", ar: "من حمل هذا اللقب؟" },
    NAME: { en: `What was ${subject}'s kunya?`, ar: `ما كنية ${subject}؟` },
    EVENT: { en: "In which year did this event happen?", ar: "في أي سنة وقع هذا الحدث؟" },
    QURAN_LINK: { en: `Which ayah is linked to ${subject}?`, ar: `أي آية ارتبطت بـ${subject}؟` },
  };
  return prompts[question.family]?.[ar ? "ar" : "en"] ?? (ar ? "اختر الإجابة الصحيحة" : "Choose the correct answer");
}

function choiceDisplay(question: QuizQuestionView, choice: string, ar: boolean): React.ReactNode {
  const ayah = question.choiceDetails[choice];
  if (!ayah) return displayName(question.choiceLabels[choice], choice, ar);
  return <span><span className="block leading-relaxed">{ayah.text}</span><span className="text-xs text-gray-500 dark:text-gray-400">{ayah.reference}</span></span>;
}

function QuizzesPage() {
  const { language } = useLanguage();
  const ar = language === "ar";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const topics = useMemo(() => parseQuizTopics(searchParams), [searchParams]);
  const length = Number(searchParams.get("length")) as QuizLength | 0;
  const person = searchParams.get("person") ?? "";
  const started = Boolean(topics.length && length && (!topics.includes("PERSON_CIRCLE") || person));

  const query = started ? `/api/quiz?${topics.map((value) => `topic=${encodeURIComponent(value)}`).join("&")}&length=${length}${person ? `&person=${encodeURIComponent(person)}` : ""}` : null;
  const { data, error, isLoading } = useSWR<{ questions: QuizQuestionView[] }>(query, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [personInput, setPersonInput] = useState("");
  const [personSuggestions, setPersonSuggestions] = useState<{ slug: string; name: string; nameTransliterated: string | null }[]>([]);

  useEffect(() => {
    setCurrent(0);
    setAnswers({});
    setSubmitted(false);
  }, [query]);

  const setParam = useCallback(
    (changes: Record<string, string | undefined>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(changes)) {
        if (value) next.set(key, value);
        else next.delete(key);
      }
      router.push(`${pathname}?${next.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const reset = useCallback(() => {
    setCurrent(0);
    setAnswers({});
    setSubmitted(false);
    router.push(pathname);
  }, [pathname, router]);

  const questions = useMemo(() => data?.questions ?? [], [data]);
  const score = useMemo(
    () => questions.filter((q, i) => answers[i] === q.correctAnswer).length,
    [questions, answers],
  );

  if (!started) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="container mx-auto max-w-2xl px-4 py-8" dir={ar ? "rtl" : "ltr"}>
          <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
            {ar ? "اختبار" : "Quiz"}
          </h1>

          <fieldset className="mb-6 flex flex-wrap gap-x-4 gap-y-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
            <legend className="mb-2 w-full text-sm font-semibold text-gray-700 dark:text-gray-300">
              {ar ? "المواضيع — اختر واحدًا أو أكثر" : "Topics — choose one or more"}
            </legend>
            {QUIZ_TOPICS.map((value) => (
              <SlideSwitch
                key={value}
                checked={topics.includes(value)}
                onChange={() => setParam({ topic: topics.includes(value) ? topics.filter((item) => item !== value).join(",") || undefined : [...topics, value].join(",") })}
                label={TOPIC_LABELS[value][ar ? "ar" : "en"]}
              />
            ))}
          </fieldset>

          {topics.includes("PERSON_CIRCLE") && (
            <label className="mb-6 block">
              <span className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {ar ? "الشخص" : "Person"}
              </span>
              <input
                type="text"
                value={personInput}
                onChange={async (event) => {
                  const value = event.target.value;
                  setPersonInput(value);
                  if (!value.trim()) return setPersonSuggestions([]);
                  const response = await fetch(`/api/people/suggest?q=${encodeURIComponent(value)}`);
                  if (response.ok) setPersonSuggestions((await response.json()).data ?? []);
                }}
                onBlur={() => setParam({ person: personInput || undefined })}
                list="quiz-people"
                placeholder={ar ? "ابحث عن شخص" : "Search for a person"}
                className="w-full rounded border border-amber-400 bg-transparent px-3 py-2 text-gray-900 dark:text-gray-100"
              />
              <datalist id="quiz-people">
                {personSuggestions.map((suggestion) => <option key={suggestion.slug} value={suggestion.slug}>{suggestion.nameTransliterated ?? suggestion.name}</option>)}
              </datalist>
            </label>
          )}

          <fieldset className="mb-6 flex flex-wrap gap-2">
            <legend className="mb-2 w-full text-sm font-semibold text-gray-700 dark:text-gray-300">
              {ar ? "عدد الأسئلة" : "Length"}
            </legend>
            {QUIZ_LENGTHS.map((value) => (
              <Button key={value} variant="outline" active={length === value} onClick={() => setParam({ length: String(value) })}>
                {value}
              </Button>
            ))}
          </fieldset>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto max-w-2xl px-4 py-8" dir={ar ? "rtl" : "ltr"}>
        {error && <><ErrorMessage title={ar ? "تعذر إنشاء الاختبار" : "Failed to build the quiz"} /><Button className="mt-4" variant="outline" onClick={reset}>{ar ? "العودة للإعداد" : "Back to setup"}</Button></>}
        {isLoading || !data ? (
          <LoadingSpinner fill />
        ) : questions.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400"><p>{ar ? "لا توجد أسئلة كافية لهذا الاختيار." : "Not enough eligible claims for this choice."}</p><Button className="mt-4" variant="outline" onClick={reset}>{ar ? "العودة للإعداد" : "Back to setup"}</Button></div>
        ) : submitted ? (
          <div>
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
              {ar ? `النتيجة: ${score} من ${questions.length}` : `Score: ${score} / ${questions.length}`}
            </h2>
            <ul className="space-y-4">
              {questions.map((question, index) => {
                const given = answers[index];
                const correct = given === question.correctAnswer;
                return (
                  <li key={question.claimId} className="rounded-lg border border-gray-200 p-4 dark:border-white/10">
                    <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">{questionPrompt(question, displayName(question.subjectName, question.subject.slug, ar), ar)}</p>
                    <div className="mb-2 flex items-center gap-2">
                      <FontAwesomeIcon icon={correct ? faCircleCheck : faCircleXmark} className={correct ? "text-green-600" : "text-red-500"} />
                      <span className="font-semibold">
                        {given ? choiceDisplay(question, given, ar) : ar ? "بدون إجابة" : "No answer"}
                      </span>
                    </div>
                    {!correct && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {ar ? "الصحيح: " : "Correct: "}
                        {choiceDisplay(question, question.correctAnswer, ar)}
                      </p>
                    )}
                    {question.evidence.readerUrls.map((url) => (
                      <a key={url} href={url} className="mt-1 block text-sm text-amber-600 hover:underline dark:text-amber-400">
                        {ar ? "المصدر" : "Evidence"}
                      </a>
                    ))}
                  </li>
                );
              })}
            </ul>
            <Button className="mt-6" variant="primary" onClick={reset}>
              {ar ? "اختبار جديد" : "New quiz"}
            </Button>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label={ar ? "الأسئلة" : "Questions"}>
              {questions.map((_, index) => (
                <Button
                  key={index}
                  size="icon"
                  variant="outline"
                  active={index === current}
                  onClick={() => setCurrent(index)}
                  aria-label={ar ? `السؤال ${index + 1}` : `Question ${index + 1}`}
                  className={answers[index] ? "border-amber-500" : ""}
                >
                  {index + 1}
                </Button>
              ))}
            </div>

            <div className="rounded-lg border border-gray-200 p-6 dark:border-white/10">
              <p className="mb-4 font-semibold text-gray-900 dark:text-gray-100">
                {questionPrompt(questions[current], displayName(questions[current].subjectName, questions[current].subject.slug, ar), ar)}
              </p>
              <div className="flex flex-col gap-2">
                {questions[current].choices.map((choice) => (
                  <Button
                    key={choice}
                    variant="outline"
                    active={answers[current] === choice}
                    onClick={() => setAnswers((prev) => ({ ...prev, [current]: choice }))}
                  >
                    {choiceDisplay(questions[current], choice, ar)}
                  </Button>
                ))}
              </div>
            </div>
            <Button className="mt-3 w-full" variant="primary" onClick={() => setSubmitted(true)}>
              <FontAwesomeIcon icon={faPaperPlane} />
              {ar ? "إنهاء الاختبار" : "Submit quiz"}
            </Button>

            <div className="mt-4 flex items-center justify-between">
              <Button
                variant="outline"
                disabled={current === 0}
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              >
                <FontAwesomeIcon icon={ar ? faArrowRight : faArrowLeft} />
                {ar ? "السابق" : "Previous"}
              </Button>
              {current < questions.length - 1 ? (
                <Button variant="outline" onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}>
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

export default QuizzesPage;
