"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import useSWR from "swr";
import { usePathname, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faBookOpen,
  faCircle,
  faCircleHalfStroke,
  faCircleCheck,
  faCircleQuestion,
  faCircleXmark,
  faPaperPlane,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import styles from "@/components/common/PaperPage.module.css";
import NumberInput from "@/components/common/NumberInput";
import TreeFilters from "./TreeFilters";
import { QUIZ_CATEGORIES, quizFilters, SCOPE_KEYS, treeScopeParams } from "@shared/quiz/scopeParams";
import { readBookmarks, serverBookmarks, subscribeBookmarks } from "@shared/bookmarks";
import { isCompareBookmark } from "@shared/compareBookmarks";
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
import { num } from "@shared/quran/arabicNumber";
import type { BranchAnswer, BranchQuestion } from "@shared/quiz/branchQuestions";
import { parseJuzRange } from "@shared/quran/juz";
import type { Branch, Variant } from "@shared/quran/branches";
import { BranchExplainer, BranchFeedback, BranchInputs } from "./BranchAnswers";
import { LEAF_LEVELS, TOPIC_GROUPS, TOPIC_LABELS } from "./labels";
import { mushafText } from '@shared/quran/mushafText';
import PersonPicker from "./PersonPicker";
import { readRun, writeRun, type SoloRun } from "./soloRun";
import QuestionReview from "./QuestionReview";
import { branchesCorrect, emptyBranchAnswers, questionPoints } from "@shared/quiz/score";
import { useNavigatingRouter } from '@/components/common/NavigationLoader';
import { useHideFooter } from '@/components/common/AppChrome';
import Link from "next/link";
import { Eye, EyeOff, LogOut, RotateCcw, User, Users } from "lucide-react";

/** /quizzes with no settings: pick solo or party first, then that mode's settings. */
function QuizModes({ ar }: { ar: boolean }) {
  const modes = [
    { href: "/quizzes?topic=BRANCHES", Icon: User, title: ar ? "اختبار فردي" : "Solo quiz",
      text: ar ? "أجب عن أسئلة في آيات القرآن، ثم راجع الإجابة والآيات المرتبطة بها." : "Answer questions on the ayat of the Quran, then review the answer and its ayat." },
    { href: "/quizzes/party", Icon: Users, title: ar ? "اختبار جماعي" : "Party quiz",
      text: ar ? "ابدأ اختبارًا جماعيًا وشارك رقمه، أو انضم إلى غيرك من هاتفك." : "Start a party and share its number, or join others from your phone." },
    { href: "/quran/read/recite", Icon: EyeOff, title: ar ? "تسميع" : "Recite",
      text: ar ? "تُخفى الآيات في المصحف، وتُظهرها واحدة واحدة وأنت تسمّع، وتعلّم ما نسيته لتراجعه." : "The ayat are hidden in the mushaf; reveal them one by one as you recite, and mark what you forgot to review it." },
  ];
  return (
    <div className={styles.page}>
      <nav className="mx-auto grid max-w-3xl gap-4 px-4 py-8 sm:grid-cols-2 lg:max-w-5xl lg:grid-cols-3" dir={ar ? "rtl" : "ltr"} aria-label={ar ? "نوع الاختبار" : "Quiz mode"}>
        {modes.map(({ href, Icon, title, text }) => (
          <Link key={href} href={href}
            className={`${styles.panel} flex flex-col items-start gap-2 text-[var(--home-ink)] transition-colors hover:bg-[var(--home-paper-deep)] active:scale-[0.98]`}>
            <Icon className="size-12 text-[var(--home-accent)]" strokeWidth={1.5} aria-hidden />
            <span className="text-xl font-bold">{title}</span>
            <span className="text-[var(--home-muted)]">{text}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

type QuizData = { questions: QuizQuestionView[]; surahNames?: Record<number, string> };

interface QuizQuestionView {
  key: string;
  family: QuestionFamily | BranchQuestion["family"];
  promptArabic: string;
  choices: QuestionChoice[];
  phrase?: string;
  branches?: BranchAnswer[];
  tree?: Branch;
  variants?: Variant[];
  prefixes?: Variant[];
  asked?: number[];
  ayah?: { text: string; reference: string } | null;
  choiceDetails: Record<string, { text: string; reference: string }>;
  correctAnswer: string;
  evidence: { reference: QuizReference | null };
}

function AskedAyah({ ayah }: { ayah: { text: string; reference: string } }) {
  return (
    <blockquote dir="rtl" lang="ar" className="mb-4 border-s-2 border-[var(--home-accent)] ps-4">
      <p className="font-quran text-xl leading-loose text-[var(--home-ink)]">{mushafText(ayah.text)}</p>
      <p className="text-sm text-[var(--home-muted)]">{ayah.reference}</p>
    </blockquote>
  );
}

export default function QuizzesPage() {
  const { language } = useLanguage();
  const ar = language === "ar";
  const router = useNavigatingRouter();
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
  // The branches page's filters for the trees; saved only sends this browser's saved trees.
  const treeFilters = useMemo(() => quizFilters(topics.includes("BRANCHES") ? Object.fromEntries(searchParams) : {}), [topics, searchParams]);
  const savedOnly = topics.includes("BRANCHES") && searchParams.get("saved") === "1";
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks, serverBookmarks);
  const liveSaved = useMemo(() => bookmarks.filter((item) => !isCompareBookmark(item)).map((item) => item.id), [bookmarks]);
  // Saving a tree during the quiz must not start a new one, so the saved trees are fixed once a quiz is chosen.
  const savedSnapshot = useRef(liveSaved);
  if (!length || savedSnapshot.current.length === 0) savedSnapshot.current = liveSaved;
  const savedIds = savedOnly ? savedSnapshot.current : undefined;
  const filterQuery = treeScopeParams({ filters: treeFilters, saved: savedIds }).map(([key, value]) => `&${key}=${encodeURIComponent(value)}`).join("");
  const scopeQuery = `${person ? `&person=${encodeURIComponent(person)}` : ""}${juzFrom ? `&juzFrom=${encodeURIComponent(juzFrom)}` : ""}${juzTo ? `&juzTo=${encodeURIComponent(juzTo)}` : ""}${filterQuery}`;
  const canCheckAvailability = Boolean(topics.length && (!topics.includes("PERSON_CIRCLE") || person));
  const availabilityQuery = canCheckAvailability
    ? `/api/quiz/availability?${topicQuery}${scopeQuery}`
    : null;
  const { data: availability } = useSWR<{ available: number; lengths: QuizLength[] }>(availabilityQuery, fetcher);
  // undefined until this browser's unfinished quiz is read, so a quiz it holds is not fetched anew first.
  // It is read again on every URL change, so Back or a tab link never offers a run that has since moved on or ended.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [stored, setStored] = useState<SoloRun<QuizData> | null | undefined>(undefined);
  const [readFor, setReadFor] = useState<string | null>(null);
  const search = searchParams.toString();
  if (mounted && readFor !== search) {
    setReadFor(search);
    setStored(readRun<QuizData>());
  }
  const restored = stored && stored.search === search ? stored : null;
  const started = Boolean(topics.length && length && stored !== undefined && (restored || availability?.lengths.includes(length)) && (!topics.includes("PERSON_CIRCLE") || person));
  const query = started && !restored
    ? `/api/quiz?${topicQuery}&length=${length}${scopeQuery}${topics.includes("BRANCHES") ? `&leaves=${leaves}` : ""}`
    : null;
  const { data: fetched, error, isLoading: fetching } = useSWR<QuizData>(query, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  });
  const data = restored?.data ?? fetched;
  const isLoading = !restored && fetching;
  useHideFooter(started);
  const [chosenLength, setChosenLength] = useState(5);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [typed, setTyped] = useState<Record<number, string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [referenceIndex, setReferenceIndex] = useState<number | null>(null);
  // The quiz whose answers the state holds, and so may save; none while leaving it for the setup.
  const [owner, setOwner] = useState<string | null>(null);
  const [leavingFrom, setLeavingFrom] = useState<string | null>(null);
  if (leavingFrom !== null && leavingFrom !== search) setLeavingFrom(null);
  if (owner !== null && owner !== search) setOwner(null);
  else if (owner === null && started && search !== leavingFrom) {
    if (restored) {
      setOwner(search);
      setCurrent(Math.min(restored.current, restored.data.questions.length - 1));
      setAnswers(restored.answers);
      setTyped(restored.typed);
    } else if (fetched?.questions.length) setOwner(search);
  }

  useEffect(() => {
    setCurrent(0);
    setAnswers({});
    setTyped({});
    setSubmitted(false);
    setReviewing(false);
    setReferenceIndex(null);
  }, [query]);
  // Every step of an unfinished quiz is kept; Submit lets it go.
  useEffect(() => {
    if (owner !== search || submitted || !data?.questions.length) return;
    writeRun({ search, data, current, answers, typed });
  }, [owner, search, data, current, answers, typed, submitted]);

  const pendingParams = useRef(searchParams.toString());
  useEffect(() => { pendingParams.current = searchParams.toString(); }, [searchParams]);

  const setParam = useCallback((changes: Record<string, string | undefined>) => {
    const next = new URLSearchParams(pendingParams.current);
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    pendingParams.current = next.toString();
    router.push(`${pathname}?${next.toString()}`, { scroll: Boolean(changes.length) });
  }, [pathname, router]);

  const reset = useCallback(() => {
    setCurrent(0);
    setAnswers({});
    setTyped({});
    setSubmitted(false);
    setReviewing(false);
    setReferenceIndex(null);
    // The cleared state belongs to no quiz: an unfinished one stays saved as it was, and the setup offers it.
    setOwner(null);
    setLeavingFrom(search);
    router.push(`${pathname}?${topicQuery || "solo=1"}`);
  }, [pathname, router, topicQuery, search]);

  const questions = useMemo(() => data?.questions ?? [], [data]);
  const leave = () => { writeRun(null); setStored(null); };
  const points = useMemo(() => questions.map((question, index) => questionPoints(question, question.tree ? typed[index] : answers[index])), [questions, answers, typed]);
  const score = points.reduce((sum, point) => sum + point.earned, 0);
  const total = points.reduce((sum, point) => sum + point.total, 0);
  const percent = total === 0 ? 0 : Math.round((score / total) * 100);
  const passed = total > 0 && score / total >= 0.5;
  const questionState = (index: number) => {
    const given = answers[index];
    if (given === undefined) return 'unanswered' as const;
    if (given === questions[index].correctAnswer) return 'correct' as const;
    // A tree with some of its asked leaves right is partly solved, not wrong.
    return questions[index].tree && points[index].earned > 0 ? 'partial' as const : 'incorrect' as const;
  };
  const stateLabel = (state: ReturnType<typeof questionState>) =>
    ar ? ({ correct: 'صحيح', partial: 'صحيح جزئيًا', incorrect: 'خطأ', unanswered: 'بدون إجابة' } as const)[state]
      : ({ correct: 'correct', partial: 'partly correct', incorrect: 'incorrect', unanswered: 'unanswered' } as const)[state];
  const answerContent = (question: QuizQuestionView, value: string | undefined) => {
    const choice = question.choices.find((item) => item.value === value);
    if (!choice) return null;
    const detail = question.choiceDetails?.[choice.value];
    if (!detail) return choice.labelArabic;
    return <span><span className="block font-quran leading-relaxed">{mushafText(detail.text)}</span><span className="text-xs text-[var(--home-muted)]">{detail.reference}</span></span>;
  };

  if (!searchParams.get("topic") && !searchParams.get("solo")) return <QuizModes ar={ar} />;

  if (!started) {
    const hasBranches = topics.includes("BRANCHES");
    const toggleTopic = (value: QuizTopic) => setParam({
      topic: topics.includes(value) ? topics.filter((item) => item !== value).join(",") || undefined : [...topics, value].join(","),
      solo: topics.length === 1 && topics[0] === value ? "1" : undefined,
      length: undefined,
      person: value === "PERSON_CIRCLE" || topics.includes("PERSON_CIRCLE") ? person || undefined : undefined,
    });
    return (
      <div className={styles.page}>
        <div className="mx-auto max-w-3xl px-4 py-8" dir={ar ? "rtl" : "ltr"}>
          {stored && <section className={`mb-6 flex flex-col gap-3 border-[var(--home-accent)] ${styles.panel}`} aria-label={ar ? "اختبار لم تُنهه" : "Unfinished quiz"}>
            <p>{ar ? `لديك اختبار لم تُنهه، وصلت فيه إلى السؤال ${num(stored.current + 1)} من ${num(stored.data.questions.length)}.` : `You have an unfinished quiz, at question ${stored.current + 1} of ${stored.data.questions.length}.`}</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" href={`${pathname}?${stored.search}`}><FontAwesomeIcon icon={ar ? faArrowLeft : faArrowRight} />{ar ? "أكمله" : "Continue it"}</Button>
              <Button onClick={leave}>{ar ? "اتركه" : "Leave it"}</Button>
            </div>
          </section>}
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
            {topics.includes("PERSON_CIRCLE") && <PersonPicker person={person} ar={ar} onCommit={(slug) => setParam({ person: slug, length: undefined })} />}
          </fieldset>
          {hasBranches && (
            <fieldset className={`mb-6 min-w-0 ${styles.panel}`}>
              <legend className="mb-2 text-sm font-semibold text-[var(--home-ink)]">{ar ? "متشابهات القرآن" : "Phrase trees"}</legend>
              <div className="mb-5 flex flex-wrap items-start gap-x-6 gap-y-4">
                <div className="min-w-0 basis-full">
                  <TreeFilters choice={{ range: juz, filters: treeFilters, saved: savedOnly }} onChange={({ range, filters, saved }) => setParam({
                    juzFrom: range ? String(range.from) : undefined, juzTo: range ? String(range.to) : undefined,
                    ...Object.fromEntries(SCOPE_KEYS.map((key) => [key, key === "categories" && filters[key] === QUIZ_CATEGORIES ? undefined : filters[key] || undefined])),
                    saved: saved ? "1" : undefined, length: undefined,
                  })} />
                </div>
              <div role="group" aria-labelledby="quiz-leaves">
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
              </div>
              <BranchExplainer leaves={leaves} ar={ar} />
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
                    min={availability.lengths[0]} max={availability.lengths[availability.lengths.length - 1]} step={5} steppers={false}
                    onChange={setChosenLength} />
                  <Button variant="primary" onClick={() => { leave(); setParam({ length: String(availability.lengths.includes(chosenLength as QuizLength) ? chosenLength : availability.lengths[0]) }); }}>
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
            <h2 className="mb-2 text-xl font-bold text-[var(--home-ink)]">{ar ? `النتيجة: ${score} من ${total} (${percent}٪)` : `Score: ${score} / ${total} (${percent}%)`}</h2>
            <p className={`mb-4 flex items-center gap-2 font-semibold ${passed ? 'text-[var(--home-green)]' : 'text-[var(--home-accent)]'}`}>
              <FontAwesomeIcon icon={passed ? faCircleCheck : faCircleXmark} />
              {ar ? (passed ? 'ناجح' : 'راسب') : passed ? 'Passed' : 'Not passed'}
            </p>
            <Button className="mb-4" aria-expanded={reviewing} onClick={() => setReviewing(value => !value)}><Eye size={16} aria-hidden />{reviewing ? (ar ? "العودة للنتيجة" : "Back to results") : (ar ? "مراجعة الأسئلة" : "Review questions")}</Button>
            {reviewing && <QuestionReview entries={questions.map((question, index) => ({ question, answer: question.tree ? typed[index] ?? null : answers[index] ?? null, result: points[index] }))} names={data.surahNames ?? {}} ar={ar} />}
            <Button className="mt-6" variant="primary" onClick={reset}>
              <FontAwesomeIcon icon={faRotateLeft} />
              {ar ? "اختبار جديد" : "New quiz"}
            </Button>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => { setCurrent(0); setAnswers({}); setTyped({}); setReferenceIndex(null); }}><RotateCcw size={16} aria-hidden />{ar ? "ابدأ من جديد" : "Start over"}</Button>
              <Button size="sm" onClick={reset}><LogOut size={16} aria-hidden />{ar ? "الخروج للإعدادات" : "Exit to setup"}</Button>
            </div>
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
                      icon={state === 'correct' ? faCircleCheck : state === 'partial' ? faCircleHalfStroke : state === 'incorrect' ? faCircleXmark : faCircleQuestion}
                      className={index === current ? undefined : state === 'correct' ? 'text-[var(--home-green)]' : state === 'partial' ? 'text-[var(--home-slot-4)]' : state === 'incorrect' ? 'text-[var(--home-accent)]' : undefined}
                    />
                    {index + 1}
                  </Button>
                );
              })}
            </div>
            <div className={styles.panel}>
              <p dir="rtl" lang="ar" className={`mb-4 ${questions[current].tree ? "text-base leading-relaxed" : "text-xl leading-loose font-semibold"}`}>{questions[current].promptArabic}</p>
              {questions[current].ayah && <AskedAyah ayah={questions[current].ayah} />}
              {questions[current].branches ? (
                answers[current] !== undefined ? (
                  <BranchFeedback key={questions[current].key} question={questions[current]} names={data?.surahNames ?? {}} typed={typed[current] ?? emptyBranchAnswers(questions[current])} ar={ar} />
                ) : (
                  <BranchInputs key={questions[current].key}
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
                        className={locked && isAnswer && !isGiven ? 'text-[var(--home-green)]' : undefined}
                      />
                      {answerContent(questions[current], choice.value)}
                      {locked && isAnswer ? <span className={`text-xs font-semibold ${isGiven ? '' : 'text-[var(--home-green)]'}`}>{ar ? 'صحيح' : 'Correct'}</span> : null}
                      {locked && isGiven && !isAnswer ? <span className="text-xs font-semibold">{ar ? 'خطأ' : 'Incorrect'}</span> : null}
                    </Button>
                  );
                })}
              </div>}
              {answers[current] === undefined && <Button className="mt-3" size="sm" onClick={() => {
                if (questions[current].tree) setTyped(previous => ({ ...previous, [current]: emptyBranchAnswers(questions[current]) }));
                setAnswers(previous => ({ ...previous, [current]: "" }));
              }}><Eye size={16} aria-hidden />{ar ? "إظهار الإجابة" : "Show answer"}</Button>}
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
                  writeRun(null);
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
