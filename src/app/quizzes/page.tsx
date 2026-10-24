"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  faPaperPlane,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import styles from "@/components/common/PaperPage.module.css";
import NumberInput from "@/components/common/NumberInput";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import Button from "@/components/common/Button";
import QuizReferenceDialog from "@/components/common/QuizReferenceDialog";
import { useLanguage } from "@/components/language/LanguageContext";
import { parseQuizTopics } from "@/lib/quiz/topics";
import { fetcher } from "@/lib/swr";
import type { QuestionChoice, QuestionFamily, QuizLength, QuizTopic } from "@/lib/quiz/types";
import type { QuizReference } from "@/lib/quiz/quizReference";
import { DEFAULT_LEAVES, parseLeaves, QUIZ_LEAVES } from "@/lib/quiz/types";
import { num } from "@/lib/quran/arabicNumber";
import type { BranchAnswer, BranchQuestion } from "@/lib/quiz/branchQuestions";
import { parseJuzRange } from "@/lib/quran/juz";
import type { Branch, Variant } from "@/lib/quran/branches";
import { BranchFeedback, BranchInputs, BranchPreview, branchesCorrect, emptyBranchAnswers } from "./BranchAnswers";

interface QuizQuestionView {
  key: string;
  family: QuestionFamily | BranchQuestion["family"];
  promptArabic: string;
  choices: QuestionChoice[];
  phrase?: string;
  branches?: BranchAnswer[];
  tree?: Branch;
  variants?: Variant[];
  asked?: number[];
  ayah?: { text: string; reference: string } | null;
  choiceDetails: Record<string, { text: string; reference: string }>;
  correctAnswer: string;
  evidence: { reference: QuizReference | null };
}

const TOPIC_LABELS: Record<QuizTopic, { en: string; ar: string }> = {
  PEOPLE: { en: "People", ar: "أشخاص" },
  BATTLES: { en: "Battles", ar: "معارك" },
  RELATIONSHIPS: { en: "Relationships", ar: "علاقات" },
  AYAT: { en: "Revealed about whom", ar: "في من نزلت" },
  EVENTS: { en: "Events", ar: "أحداث" },
  PERSON_CIRCLE: { en: "A person's circle", ar: "دائرة شخص" },
  BRANCHES: { en: "Shared openings", ar: "فواتح الآيات" },
};

const TOPIC_GROUPS: { en: string; ar: string; topics: QuizTopic[] }[] = [
  { en: "Quran", ar: "القرآن", topics: ["BRANCHES", "AYAT"] },
  { en: "Seerah and biographies", ar: "السيرة والتراجم", topics: ["PEOPLE", "BATTLES", "RELATIONSHIPS", "EVENTS", "PERSON_CIRCLE"] },
];

const LEAF_LEVELS: Record<number, { en: string; ar: string }> = {
  3: { en: "easy", ar: "سهل" },
  6: { en: "hard", ar: "صعب" },
};

function AskedAyah({ ayah }: { ayah: { text: string; reference: string } }) {
  return (
    <blockquote dir="rtl" lang="ar" className="mb-4 border-s-2 border-[var(--home-accent)] ps-4">
      <p className="font-arabic text-xl leading-loose text-[var(--home-ink)]">{ayah.text}</p>
      <p className="text-sm text-[var(--home-muted)]">{ayah.reference}</p>
    </blockquote>
  );
}

export default function QuizzesPage() {
  const { language } = useLanguage();
  const ar = language === "ar";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const topics = useMemo(() => parseQuizTopics(searchParams) as QuizTopic[], [searchParams]);
  const length = Number(searchParams.get("length")) as QuizLength | 0;
  const person = searchParams.get("person") ?? "";
  const juzFrom = topics.includes("BRANCHES") ? searchParams.get("juzFrom") ?? "" : "";
  const juzTo = topics.includes("BRANCHES") ? searchParams.get("juzTo") ?? "" : "";
  const leaves = parseLeaves(searchParams.get("leaves"));
  const juz = useMemo(() => parseJuzRange(juzFrom || null, juzTo || null), [juzFrom, juzTo]);
  const topicQuery = topics.map((value) => `topic=${encodeURIComponent(value)}`).join("&");
  const scopeQuery = `${person ? `&person=${encodeURIComponent(person)}` : ""}${juzFrom ? `&juzFrom=${encodeURIComponent(juzFrom)}` : ""}${juzTo ? `&juzTo=${encodeURIComponent(juzTo)}` : ""}`;
  const canCheckAvailability = Boolean(topics.length && (!topics.includes("PERSON_CIRCLE") || person));
  const availabilityQuery = canCheckAvailability
    ? `/api/quiz/availability?${topicQuery}${scopeQuery}`
    : null;
  const { data: availability } = useSWR<{ available: number; lengths: QuizLength[] }>(availabilityQuery, fetcher);
  const started = Boolean(topics.length && length && availability?.lengths.includes(length) && (!topics.includes("PERSON_CIRCLE") || person));
  const query = started
    ? `/api/quiz?${topicQuery}&length=${length}${scopeQuery}${topics.includes("BRANCHES") ? `&leaves=${leaves}` : ""}`
    : null;
  const { data, error, isLoading } = useSWR<{ questions: QuizQuestionView[]; surahNames?: Record<number, string> }>(query, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  });
  const [chosenLength, setChosenLength] = useState(5);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [typed, setTyped] = useState<Record<number, string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [referenceIndex, setReferenceIndex] = useState<number | null>(null);
  const [personInput, setPersonInput] = useState(person);
  const [personSuggestions, setPersonSuggestions] = useState<{ slug: string; name: string; nameTransliterated: string | null }[]>([]);

  useEffect(() => {
    setCurrent(0);
    setAnswers({});
    setTyped({});
    setSubmitted(false);
    setReferenceIndex(null);
  }, [query]);

  const pendingParams = useRef(searchParams.toString());
  useEffect(() => { pendingParams.current = searchParams.toString(); }, [searchParams]);

  const setParam = useCallback((changes: Record<string, string | undefined>) => {
    const next = new URLSearchParams(pendingParams.current);
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    pendingParams.current = next.toString();
    router.push(`${pathname}?${next.toString()}`);
  }, [pathname, router]);

  const reset = useCallback(() => {
    setCurrent(0);
    setAnswers({});
    setTyped({});
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
    return <span><span className="block leading-relaxed">{detail.text}</span><span className="text-xs text-[var(--home-muted)]">{detail.reference}</span></span>;
  };

  if (!started) {
    const hasBranches = topics.includes("BRANCHES");
    const toggleTopic = (value: QuizTopic) => setParam({
      topic: topics.includes(value) ? topics.filter((item) => item !== value).join(",") || undefined : [...topics, value].join(","),
      length: undefined,
      person: value === "PERSON_CIRCLE" || topics.includes("PERSON_CIRCLE") ? person || undefined : undefined,
    });
    const optionValue = (suggestion: (typeof personSuggestions)[number]) =>
      personSuggestions.filter((other) => other.name === suggestion.name).length > 1 ? `${suggestion.name} (${suggestion.nameTransliterated ?? suggestion.slug})` : suggestion.name;
    const commitPerson = () => {
      const typedName = personInput.trim();
      const match = personSuggestions.find((suggestion) => [optionValue(suggestion), suggestion.slug].includes(typedName));
      setParam({ person: match?.slug ?? (typedName || undefined), length: undefined });
    };
    return (
      <div className={styles.page}>
        <div className="mx-auto max-w-3xl px-4 py-8" dir={ar ? "rtl" : "ltr"}>
          <header className={styles.heading}><p className={styles.eyebrow}>{ar ? "نمق · اختبر معرفتك" : "Namaq · Test your knowledge"}</p><h1>{ar ? "الاختبارات" : "Quizzes"}</h1><p>{ar ? "اختر المواضيع وعدد الأسئلة، ثم ابدأ الاختبار." : "Choose your topics and question count, then start a quiz."}</p></header>
          <fieldset className={`mb-6 min-w-0 ${styles.panel}`}>
            <legend className="mb-2 text-sm font-semibold text-[var(--home-ink)]">{ar ? "المواضيع، اختر واحدًا أو أكثر" : "Topics, choose one or more"}</legend>
            {TOPIC_GROUPS.map((group) => (
              <div key={group.en} className="mb-3 last:mb-0">
                <p className="mb-1.5 text-sm text-[var(--home-muted)]">{group[ar ? "ar" : "en"]}</p>
                <div className="flex flex-wrap gap-2">
                  {group.topics.map((value) => (
                    <Button key={value} active={topics.includes(value)} aria-pressed={topics.includes(value)} onClick={() => toggleTopic(value)}>
                      {TOPIC_LABELS[value][ar ? "ar" : "en"]}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
            {topics.includes("PERSON_CIRCLE") && (
              <label className="mt-4 block">
                <span className="mb-1 block text-sm font-semibold text-[var(--home-ink)]">{ar ? "الشخص" : "Person"}</span>
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
                  onBlur={commitPerson}
                  list="quiz-people"
                  placeholder={ar ? "ابحث عن شخص" : "Search for a person"}
                  className="w-full rounded border border-[var(--home-rule)] bg-transparent px-3 py-2 text-[var(--home-ink)]"
                />
                <datalist id="quiz-people">
                  {personSuggestions.map((suggestion) => <option key={suggestion.slug} value={optionValue(suggestion)}>{suggestion.nameTransliterated ?? suggestion.name}</option>)}
                </datalist>
                <span className="mt-1 block text-xs text-[var(--home-muted)]">{ar ? "تُضاف أسئلة هذا الشخص إلى المواضيع الأخرى المختارة." : "This person's questions are added to the other topics you chose."}</span>
              </label>
            )}
          </fieldset>
          {hasBranches && (
            <fieldset className={`mb-6 min-w-0 ${styles.panel}`}>
              <legend className="mb-2 text-sm font-semibold text-[var(--home-ink)]">{ar ? "فواتح الآيات" : "Shared openings"}</legend>
              <div className="mb-5 flex flex-wrap items-end gap-4">
                {([["juzFrom", juz?.from ?? 1, ar ? "من الجزء" : "From juz'"], ["juzTo", juz?.to ?? 30, ar ? "إلى الجزء" : "To juz'"]] as const).map(([key, value, label]) => (
                  <div key={key} className="flex flex-col gap-1 text-sm text-[var(--home-ink)]">
                    <span>{label}</span>
                    <NumberInput label={label} value={value} min={1} max={30}
                      onChange={(next) => {
                        const other = key === "juzFrom" ? juz?.to ?? 30 : juz?.from ?? 1;
                        const crossed = key === "juzFrom" ? next > other : next < other;
                        setParam({ [key]: String(next), ...(crossed && { [key === "juzFrom" ? "juzTo" : "juzFrom"]: String(next) }), length: undefined });
                      }} />
                  </div>
                ))}
              </div>
              <div role="group" aria-labelledby="quiz-leaves" className="mb-2">
                <p id="quiz-leaves" className="mb-1.5 text-sm font-semibold text-[var(--home-ink)]">{ar ? "عدد الإجابات في كل شجرة" : "Answers per tree"}</p>
                <div className="flex flex-wrap items-start gap-2">
                  {QUIZ_LEAVES.map((value) => (
                    <div key={value} className="flex flex-col items-center gap-0.5">
                      <Button size="icon" className="min-w-10 justify-center" active={leaves === value} aria-pressed={leaves === value}
                        onClick={() => setParam({ leaves: value === DEFAULT_LEAVES ? undefined : String(value) })}>
                        {ar ? num(value) : value}
                      </Button>
                      {LEAF_LEVELS[value] && <span className="text-xs text-[var(--home-muted)]">{LEAF_LEVELS[value][ar ? "ar" : "en"]}</span>}
                    </div>
                  ))}
                </div>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-[var(--home-muted)]">{ar
                ? `تكتب ${num(leaves)} من أطراف الشجرة، ويُعرض باقيها مكتوبًا. الشجرة التي أطرافها أقل تُطلب كل أطرافها.`
                : `You type ${leaves} of the tree's leaves, and the rest of the tree is shown. A tree with fewer leaves asks for all of them.`}</p>
              <BranchPreview leaves={leaves} ar={ar} />
              <dl className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--home-ink)]">
                <div><dt className="inline font-semibold">{ar ? "التصحيح: " : "Grading: "}</dt><dd className="inline">{ar
                  ? "تكفي من كل طرف كلمتاه الأوليان، ويجب أن تصح كل كلمة تكتبها وبترتيبها. اكتب بالإملاء المعتاد لا برسم المصحف، والهمزة على أي كرسي. يُحسب السؤال صحيحًا إذا صحت كل الأطراف المطلوبة، والأطراف المتشابهة في الشكل تقبل أي ترتيب."
                  : "A leaf's first two words are enough, and every word you type must be right and in order. Type ordinary spelling, not the mushaf script; a hamza may sit on any seat. A question is correct when every asked leaf is correct, and leaves of the same shape can go in either order."}</dd></div>
                <div><dt className="inline font-semibold">{ar ? "الزر الملوّن: " : "Coloured button: "}</dt><dd className="inline">{ar
                  ? "يظهر بعد التحقق على عقدة تجمع آيات تختلف كلماتها في علامات الضبط، مثل «إِن» و«إِنْ» أعلاه. اضغطه لترى كل آية في سياقها والكلمات المختلفة بارزة."
                  : "After checking, it marks a node whose ayat differ in the marks of its words, like «إِن» and «إِنْ» above. Press it to see each ayah in context with the differing words highlighted."}</dd></div>
                <div><dt className="inline font-semibold">{ar ? "الكلمة الأولى: " : "First word: "}</dt><dd className="inline">{ar
                  ? "إذا بدأت بعض الآيات بالواو أو الفاء رُسمت كل صيغة وحدها، الخضراء بالواو والبنفسجية بالفاء."
                  : "When some ayat open with و or ف, each spelling is drawn on its own: green with و, purple with ف."}</dd></div>
              </dl>
            </fieldset>
          )}
          {availability && (
            <>
              <p className="mb-3 text-sm text-[var(--home-muted)]">
                {ar ? `${availability.available} سؤالًا متاحًا` : `${availability.available} questions available`}
              </p>
              {availability.lengths.length > 0 ? (
                <fieldset className="mb-6 flex flex-wrap gap-2">
                  <legend className="mb-2 w-full text-sm font-semibold text-[var(--home-ink)]">{ar ? "عدد الأسئلة" : "Length"}</legend>
                  <NumberInput label={ar ? "عدد الأسئلة" : "Question count"}
                    value={availability.lengths.includes(chosenLength as QuizLength) ? chosenLength : availability.lengths[0]}
                    min={availability.lengths[0]} max={availability.lengths[availability.lengths.length - 1]} step={5}
                    onChange={setChosenLength} />
                  <Button variant="primary" onClick={() => setParam({ length: String(availability.lengths.includes(chosenLength as QuizLength) ? chosenLength : availability.lengths[0]) })}>
                    <FontAwesomeIcon icon={ar ? faArrowLeft : faArrowRight} />
                    {ar ? "ابدأ الاختبار" : "Start quiz"}
                  </Button>
                </fieldset>
              ) : (
                <p className="text-[var(--home-muted)]">{ar ? "لا توجد خمسة أسئلة معتمدة لهذا الاختيار بعد." : "Fewer than five approved questions are available."}</p>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="mx-auto max-w-6xl px-4 py-8" dir={ar ? "rtl" : "ltr"}>
        {error && <><ErrorMessage title={ar ? "تعذر إنشاء الاختبار" : "Failed to build the quiz"} /><Button className="mt-4" variant="outline" onClick={reset}><FontAwesomeIcon icon={faRotateLeft} />{ar ? "العودة للإعداد" : "Back to setup"}</Button></>}
        {isLoading || !data ? (
          <LoadingSpinner fill />
        ) : questions.length === 0 ? (
          <div className="text-center text-[var(--home-muted)]"><p>{ar ? "لا توجد أسئلة كافية لهذا الاختيار." : "Not enough approved questions for this choice."}</p><Button className="mt-4" variant="outline" onClick={reset}><FontAwesomeIcon icon={faRotateLeft} />{ar ? "العودة للإعداد" : "Back to setup"}</Button></div>
        ) : submitted ? (
          <div>
            <h2 className="mb-2 text-xl font-bold text-[var(--home-ink)]">{ar ? `النتيجة: ${score} من ${questions.length} (${percent}٪)` : `Score: ${score} / ${questions.length} (${percent}%)`}</h2>
            <p className={`mb-4 flex items-center gap-2 font-semibold ${passed ? 'text-green-700 dark:text-green-300' : 'text-red-600 dark:text-red-400'}`}>
              <FontAwesomeIcon icon={passed ? faCircleCheck : faCircleXmark} />
              {ar ? (passed ? 'ناجح' : 'راسب') : passed ? 'Passed' : 'Not passed'}
            </p>
            <ul className="space-y-4">
              {questions.map((question, index) => {
                const given = answers[index];
                const correct = given === question.correctAnswer;
                return (
                  <li key={question.key} className={styles.panel}>
                    <p className="mb-3 font-semibold text-[var(--home-ink)]">{question.promptArabic}</p>
                    {question.ayah && <AskedAyah ayah={question.ayah} />}
                    {question.branches ? <BranchFeedback question={question} names={data?.surahNames ?? {}} juz={juz} typed={typed[index] ?? emptyBranchAnswers(question)} ar={ar} /> : <><div className="mb-2 flex items-center gap-2">
                      <FontAwesomeIcon icon={correct ? faCircleCheck : faCircleXmark} className={correct ? "text-green-600" : "text-red-500"} />
                      <span>{given ? answerContent(question, given) : ar ? "بدون إجابة" : "No answer"}</span>
                    </div>
                    {!correct && <p className="text-sm text-[var(--home-muted)]">{ar ? "الصحيح: " : "Correct: "}{answerContent(question, question.correctAnswer)}</p>}</>}
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
            <div className={styles.panel}>
              <p dir="rtl" lang="ar" className="mb-4 text-xl leading-loose font-semibold">{questions[current].promptArabic}</p>
              {questions[current].ayah && <AskedAyah ayah={questions[current].ayah} />}
              {questions[current].branches ? (
                answers[current] !== undefined ? (
                  <BranchFeedback question={questions[current]} names={data?.surahNames ?? {}} juz={juz} typed={typed[current] ?? emptyBranchAnswers(questions[current])} ar={ar} />
                ) : (
                  <BranchInputs
                    question={questions[current]}
                    typed={typed[current] ?? emptyBranchAnswers(questions[current])}
                    onChange={(value) => setTyped((previous) => ({ ...previous, [current]: value }))}
                    onCheck={() => {
                      const value = typed[current] ?? emptyBranchAnswers(questions[current]);
                      setAnswers((previous) => ({ ...previous, [current]: branchesCorrect(questions[current], value) ? questions[current].correctAnswer : "" }));
                    }}
                    ar={ar}
                  />
                )
              ) : <div className="flex flex-col gap-2">
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
              </div>}
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
                <Button variant="primary" onClick={() => {
                  setAnswers((previous) => ({
                    ...Object.fromEntries(Object.entries(typed).map(([index, value]) => [index, branchesCorrect(questions[Number(index)], value) ? questions[Number(index)].correctAnswer : ""])),
                    ...previous,
                  }));
                  setSubmitted(true);
                }}>
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
