"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faCircleCheck, faCircleXmark, faCopy, faCrown, faHourglassHalf, faPaperPlane, faPlay, faRightFromBracket, faRotateLeft, faUserCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { renderSVG } from "uqr";
import styles from "@/components/common/PaperPage.module.css";
import Button from "@/components/common/Button";
import LoadingDots from "@/components/common/LoadingDots";
import { useHideFooter } from "@/components/common/AppChrome";
import { useLanguage } from "@/components/language/LanguageContext";
import { num } from "@shared/quran/arabicNumber";
import { emptyBranchAnswers } from "@shared/quiz/score";
import type { QuestionChoice } from "@/lib/quiz/types";
import { leaderboard, NAME_MAX, type ActionError, type PartyQuestion, type PartyView, type PlayerView } from "@shared/party/rules";
import { playerId, saveName, savedName, usePartySocket, type PartyStatus } from "@/lib/party/client";
import { BranchFeedback, BranchInputs } from "../BranchAnswers";
import { CompareFeedback, CompareInputs } from "../CompareAnswers";
import { emptyCompareAnswers } from "@shared/quiz/compareAnswers";
import PartySettingsPanel from "./PartySettings";
import { Eye, Search, Square, SquareCheck } from "lucide-react";
import { canLook, LookButton, LookedNote, LookView } from "@/components/quiz/QuizLook";
import { isRightChoice, orders, PICKS, picksOf, ticks, type QuizLook } from "@shared/quiz/choiceKinds";
import OrderRows from "@/components/common/OrderRows";
import QuestionReview from "../QuestionReview";
import { ChoiceAfter, ChoiceLabel, ChoiceQuran, type ChoiceParts } from "../ChoiceParts";
import AyahFlow, { AyahWords } from "@/components/quran/text/AyahFlow";
import Card from '@/components/common/Card';
import Field from '@/components/common/Field';

type Question = PartyQuestion & ChoiceParts & {
  promptArabic: string;
  choices: QuestionChoice[];
  choiceDetails?: Record<string, { text: string; reference: string }>;
  ayah?: { text: string; reference: string } | null;
  look?: QuizLook;
};

const ERRORS: Record<ActionError, { en: string; ar: string }> = {
  "name-taken": { en: "Someone in this party already has that name.", ar: "في الفريق من يحمل هذا الاسم." },
  "name-empty": { en: "Type a name.", ar: "اكتب اسمًا." },
  started: { en: "This party has already started.", ar: "بدأ هذا الاختبار." },
  removed: { en: "The host removed you from this party.", ar: "أخرجك المضيف من هذا الاختبار." },
  "not-host": { en: "Only the host can do that.", ar: "هذا للمضيف وحده." },
  "not-ready": { en: "Not everyone is ready.", ar: "لم يستعد الجميع." },
  "unknown-player": { en: "Join the party first.", ar: "انضم إلى الفريق أولًا." },
  "wrong-phase": { en: "That isn't possible right now.", ar: "لا يمكن هذا الآن." },
};

export function NameForm({ initial, onSubmit, error, ar, label, nameError }: { initial: string; onSubmit: (name: string) => void; error?: string | null; ar: boolean; label: string; nameError?: boolean }) {
  const [name, setName] = useState(initial);
  // A name error belongs to the name that was sent; editing the name clears it.
  const [sent, setSent] = useState(initial.trim());
  return (
    <form className="flex flex-col gap-2" onSubmit={(event) => {
      event.preventDefault();
      if (!name.trim()) return;
      setSent(name.trim());
      onSubmit(name.trim());
    }}>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-[var(--home-ink)]">{ar ? "اسمك" : "Your name"}</span>
        <Field label={ar ? "اسمك" : "Your name"} value={name} maxLength={NAME_MAX} onChange={(event) => setName(event.target.value)} autoComplete="nickname" className="max-w-xs" />
      </label>
      {error && (!nameError || name.trim() === sent) && <p role="alert" className="text-sm text-[var(--home-accent)]">{error}</p>}
      <Button className="self-start" variant="primary" type="submit" disabled={!name.trim()}>{label}</Button>
    </form>
  );
}

function Countdown({ deadline, total, offset, ar, big }: { deadline: number; total: number; offset: number; ar: boolean; big?: boolean }) {
  const [now, setNow] = useState(() => Date.now() + offset);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now() + offset), 250);
    return () => clearInterval(timer);
  }, [offset]);
  const left = Math.max(0, Math.ceil((deadline - now) / 1000));
  const text = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
  const urgent = left <= 10;
  const anchor = useRef<HTMLSpanElement>(null);
  const [floating, setFloating] = useState(false);
  useEffect(() => {
    const update = () => setFloating((anchor.current?.getBoundingClientRect().top ?? 0) < 0);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <span ref={anchor} className={`inline-flex shrink-0 justify-end ${big ? "h-20 w-60" : "h-11 w-32"}`}>
      <span role="timer" aria-label={ar ? "الوقت المتبقي" : "Time left"} className={`inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border-2 border-[var(--home-accent)] font-bold ${big ? "w-60 py-3 text-5xl" : "w-32 py-1 text-2xl"} tabular-nums ${urgent ? "bg-[var(--home-action,var(--home-accent))] text-[var(--home-on-action,var(--home-paper))]" : "bg-[var(--home-paper)] text-[var(--home-ink)]"} ${floating ? "fixed inset-x-0 top-[calc(0.75rem+env(safe-area-inset-top)+var(--party-controls-height,0px))] z-40 mx-auto shadow-[0_4px_10px_var(--home-shadow)]" : "relative"}`}>
        <FontAwesomeIcon icon={faHourglassHalf} className={big ? "text-3xl" : "text-lg"} />{ar ? `${num(Math.floor(left / 60))}:${num(left % 60).padStart(2, "٠")}` : text}
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-1">
          <span className={`block h-full transition-[width] duration-300 ease-linear ${urgent ? "bg-[var(--home-on-action,var(--home-paper))]" : "bg-[var(--home-accent)]"}`} style={{ width: `${Math.min(1, Math.max(0, (deadline - now) / total)) * 100}%` }} />
        </span>
      </span>
    </span>
  );
}

function Leaderboard({ players, you, ar, final, answering }: { players: PlayerView[]; you: string; ar: boolean; final?: boolean; answering?: boolean }) {
  const ranked = leaderboard(players);
  const top = Math.max(1, ...ranked.map((player) => player.score));
  return (
    <Card as="section" className="p-[clamp(1rem,3vw,2rem)]" aria-label={ar ? "الترتيب" : "Leaderboard"}>
      <h2 className="mb-3 text-lg font-semibold">{final ? (ar ? "الترتيب النهائي" : "Final leaderboard") : (ar ? "الترتيب" : "Leaderboard")}</h2>
      <ol className="flex flex-col gap-1.5">
        {ranked.map((player) => {
          const rank = ranked.findIndex((other) => other.score === player.score) + 1;
          return (
            <li key={player.id} data-player={player.name} className={`flex items-center gap-3 rounded-sm px-2 py-1.5 ${player.id === you ? "bg-[var(--home-paper-deep)]" : ""}`}>
              <span className={`inline-flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${rank === 1 ? "bg-[color-mix(in_srgb,var(--home-green)_15%,var(--home-paper))] text-[var(--home-green)]" : "border border-[var(--home-rule)] text-[var(--home-muted)]"}`}>{ar ? num(rank) : rank}</span>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-[var(--home-ink)]">{player.name}</span>
                  {answering && (player.submitted
                    ? <span data-status="answered" className="text-sm text-[var(--home-green)]"><FontAwesomeIcon icon={faCircleCheck} /><span className="sr-only">{ar ? "أجاب" : "Answered"}</span></span>
                    : <span data-status="answering" className="inline-flex items-center gap-1 pt-1">{[0, 1, 2].map((dot) => <span key={dot} aria-hidden className="animate-typing-dot size-2 rounded-full bg-[var(--home-muted)]" style={{ animationDelay: `${dot * 0.15}s` }} />)}<span className="sr-only">{ar ? "يكتب" : "Still answering"}</span></span>)}
                </span>
                <span aria-hidden data-bar className="flex h-2 overflow-hidden rounded-full bg-[var(--home-rule)]">
                  <span className={`bg-[var(--home-green)] transition-[width] duration-700 ${final ? "" : "opacity-50"}`} style={{ width: `${((player.score - (final ? 0 : player.earned ?? 0)) / top) * 100}%` }} />
                  {!final && !!player.earned && <span className={`${player.looked ? "bg-[var(--home-amber)]" : "bg-[var(--home-green)]"} transition-[width] duration-700`} style={{ width: `${(player.earned / top) * 100}%` }} />}
                </span>
              </span>
              {/* Who looked the answer up shows only once it is revealed: the magnifier, and its points in amber (the app's leaderboard). */}
              {player.earned !== null && !final && player.looked && <Search size={14} className="shrink-0 text-[var(--home-amber)]" aria-label={ar ? "بحث عن الجواب" : "Looked it up"} />}
              {player.earned !== null && !final && <span dir="ltr" className={`text-sm tabular-nums ${!player.earned ? "text-[var(--home-muted)]" : player.looked ? "text-[var(--home-amber)]" : "text-[var(--home-green)]"}`}>+{ar ? num(player.earned) : player.earned}</span>}
              <span className="w-10 text-end font-semibold tabular-nums">{ar ? num(player.score) : player.score}</span>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

function Share({ code, ar }: { code: string; ar: boolean }) {
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState("");
  useEffect(() => setLink(`${window.location.origin}/quizzes/party/${code}`), [code]);
  const qr = useMemo(() => link ? renderSVG(link, { border: 1, whiteColor: "var(--home-paper)", blackColor: "var(--home-ink)" }) : "", [link]);
  return (
    <Card as="section" className="flex flex-wrap items-center gap-5 p-[clamp(1rem,3vw,2rem)]" aria-label={ar ? "ادعُ الآخرين" : "Invite others"}>
      {qr && <div aria-hidden className="size-32 shrink-0 [&>svg]:size-full" dangerouslySetInnerHTML={{ __html: qr }} />}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-[var(--home-muted)]">{ar ? "رقم الاختبار" : "Party number"}</p>
        <p dir="ltr" className="text-4xl font-bold tracking-[0.2em] text-[var(--home-ink)] tabular-nums" data-code>{code}</p>
        <Button className="self-start" size="sm" onClick={async () => {
          try {
            if (navigator.share) await navigator.share({ url: link, title: ar ? "اختبار جماعي في نمق" : "Namaq party quiz" });
            else {
              await navigator.clipboard.writeText(link);
              setCopied(true);
            }
          } catch {}
        }}><FontAwesomeIcon icon={faCopy} />{copied ? (ar ? "نُسخ الرابط" : "Link copied") : (ar ? "شارك الرابط" : "Share the link")}</Button>
      </div>
    </Card>
  );
}

function Lobby({ view, send, error, ar }: { view: PartyView; send: ReturnType<typeof usePartySocket>["send"]; error: ActionError | null; ar: boolean }) {
  const isHost = view.you === view.hostId;
  const me = view.players.find((player) => player.id === view.you);
  const others = view.players.filter((player) => player.id !== view.hostId);
  const readyCount = others.filter((player) => player.ready).length;
  const [confirming, setConfirming] = useState(false);
  useEffect(() => { if (error === "not-ready") setConfirming(true); }, [error]);
  useEffect(() => { if (readyCount === others.length) setConfirming(false); }, [readyCount, others.length]);
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <div className="flex flex-col gap-5">
        <Share code={view.code} ar={ar} />
        <Card as="section" className="p-[clamp(1rem,3vw,2rem)]" aria-label={ar ? "اللاعبون" : "Players"}>
          <h2 className="mb-3 text-lg font-semibold">{ar ? `اللاعبون (${num(view.players.length)})` : `Players (${view.players.length})`}</h2>
          <ul className="flex flex-col gap-1.5">
            {view.players.map((player) => (
              <li key={player.id} data-player={player.name} className={`flex items-center gap-3 ${player.connected ? "" : "opacity-50"}`}>
                <FontAwesomeIcon icon={player.id === view.hostId ? faCrown : player.ready ? faCircleCheck : faCircle}
                  className={player.id === view.hostId ? "text-[var(--home-accent)]" : player.ready ? "text-[var(--home-green)]" : "text-[var(--home-rule)]"} />
                <span className="min-w-0 flex-1 truncate">{player.name}{player.id === view.you && <span className="ms-1 text-sm text-[var(--home-muted)]">{ar ? "(أنت)" : "(you)"}</span>}</span>
                <span className="text-sm text-[var(--home-muted)]">{player.id === view.hostId ? (ar ? "المضيف" : "Host") : !player.connected ? (ar ? "غائب" : "Away") : player.ready ? (ar ? "مستعد" : "Ready") : (ar ? "ينتظر" : "Not ready")}</span>
                {isHost && player.id !== view.hostId && (
                  <Button size="icon" variant="ghost" aria-label={ar ? `أخرج ${player.name}` : `Remove ${player.name}`} onClick={() => send({ type: "remove", target: player.id })}><FontAwesomeIcon icon={faXmark} /></Button>
                )}
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <div className="flex flex-col gap-5">
        <PartySettingsPanel settings={view.settings} editable={isHost} ar={ar} onChange={(settings) => send({ type: "settings", settings })} />
        {view.error && <p role="alert" className="text-[var(--home-accent)]">{view.error === "Not enough approved questions" ? (ar ? "لا توجد أسئلة كافية لهذه الإعدادات." : "There aren't enough questions for these settings.") : (ar ? "تعذر إنشاء الاختبار." : "Failed to build the quiz.")}</p>}
        {isHost ? (
          confirming ? (
            <Card role="alertdialog" aria-label={ar ? "تأكيد البدء" : "Confirm start"} className="flex flex-col gap-3 p-[clamp(1rem,3vw,2rem)]">
              <p>{ar ? `استعد ${num(readyCount)} من ${num(others.length)}. أتبدأ الآن؟` : `${readyCount} of ${others.length} players are ready. Start anyway?`}</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary" onClick={() => { setConfirming(false); send({ type: "start", early: true }); }}><FontAwesomeIcon icon={faPlay} />{ar ? "ابدأ الآن" : "Start anyway"}</Button>
                <Button onClick={() => setConfirming(false)}>{ar ? "انتظر" : "Wait"}</Button>
              </div>
            </Card>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" disabled={!view.settings.topics.length} onClick={() => send({ type: "start" })}><FontAwesomeIcon icon={faPlay} />{ar ? "ابدأ الاختبار" : "Start the quiz"}</Button>
              <span className="text-sm text-[var(--home-muted)]">{ar ? `استعد ${num(readyCount)} من ${num(others.length)}` : `${readyCount} of ${others.length} ready`}</span>
            </div>
          )
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <Button variant={me?.ready ? "outline" : "primary"} aria-pressed={Boolean(me?.ready)} onClick={() => send({ type: "ready", ready: !me?.ready })}>
              <FontAwesomeIcon icon={faUserCheck} />{me?.ready ? (ar ? "لست مستعدًا" : "Not ready") : (ar ? "أنا مستعد" : "I'm ready")}
            </Button>
            <span className="text-sm text-[var(--home-muted)]">{me?.ready ? (ar ? "ينتظر المضيف ليبدأ." : "Waiting for the host to start.") : (ar ? "اضغط حين تستعد." : "Press when you're ready.")}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ChoiceText({ question, value, answered }: { question: Question; value: string; answered: boolean }) {
  const choice = question.choices.find((item) => item.value === value);
  const detail = question.choiceDetails?.[value];
  if (!choice) return null;
  if (!detail) return <ChoiceLabel question={question} value={value} label={choice.labelArabic} answered={answered} />;
  return <span className="w-full"><AyahFlow><AyahWords>{detail.text}</AyahWords></AyahFlow><span className="text-xs text-[var(--home-muted)]">{detail.reference}</span></span>;
}

function QuestionStage({ view, send, offset, ar }: { view: PartyView; send: ReturnType<typeof usePartySocket>["send"]; offset: number; ar: boolean }) {
  const question = view.question as Question;
  const revealed = view.phase === "reveal";
  const [typed, setTyped] = useState<string[]>(() => question.compare ? emptyCompareAnswers(question) : emptyBranchAnswers(question));
  // What is typed goes to the party as it is typed, so the time running out grades it as sent (owner, 2026-11-21).
  const draftTyped = (next: string[]) => { setTyped(next); send({ type: "draft", answer: next }); };
  const sent = view.answer !== null;
  const waiting = view.players.filter((player) => !player.submitted);
  const isHost = view.you === view.hostId;
  const last = view.index + 1 >= view.total;
  const total = (question.tree || question.compare || question.write ? view.settings.treeSeconds : view.settings.seconds) * 1000;
  // A recited ayah: each word goes as a draft, the last as the answer, sent again if the connection dropped it.
  const finished = useRef<string[] | null>(null);
  useEffect(() => {
    if (finished.current && view.phase === "question" && view.answer === null) send({ type: "submit", answer: finished.current });
  }, [view, send]);
  const write = (answer: string[], done: boolean) => {
    if (done) finished.current = answer;
    send({ type: done ? "submit" : "draft", answer });
  };
  // A party counts a look before the answer is sent: a right answer after it earns LOOKED_POINTS (shared/quiz/score.ts).
  const look = () => { if (!view.looked) send({ type: "look" }); };
  const lookable = !question.tree && !question.compare && canLook(question.look);
  if (!revealed && sent) return (
    <div className="flex flex-col gap-5">
      <p className="sr-only" aria-live="polite">{ar
        ? `أُرسلت إجابتك. لم يجب بعد: ${waiting.map((player) => player.name).join("، ")}.`
        : `Your answer is in. Still answering: ${waiting.map((player) => player.name).join(", ")}.`}</p>
      {view.deadline !== null && <div className="flex justify-center py-6"><Countdown big deadline={view.deadline} total={total} offset={offset} ar={ar} /></div>}
      {/* Looking once the answer is sent is for learning: it costs nothing. */}
      {lookable && <LookButton look={question.look!} />}
      <Leaderboard players={view.players} you={view.you} ar={ar} answering />
    </div>
  );
  return (
    <div className="flex flex-col gap-5">
      {!revealed && view.deadline !== null && <div className="flex justify-center"><Countdown deadline={view.deadline} total={total} offset={offset} ar={ar} /></div>}
      <Card className="p-[clamp(1rem,3vw,2rem)]">
        <p dir="rtl" lang="ar" className={`mb-4 ${question.tree || question.compare ? "text-base leading-relaxed" : "text-xl leading-loose font-semibold"}`}>{question.promptArabic}</p>
        {question.ayah && (
          <blockquote dir="rtl" lang="ar" className="mb-4 border-s-2 border-[var(--home-accent)] ps-4">
            <AyahFlow className="text-[var(--home-ink)]"><AyahWords>{question.ayah.text}</AyahWords></AyahFlow>
            <p className="text-sm text-[var(--home-muted)]">{question.ayah.reference}</p>
          </blockquote>
        )}
        <ChoiceQuran question={question} given={revealed && typeof view.answer === "string" ? view.answer : undefined} revealed ar={ar}
          pen={view.settings.pen} onWrite={write} written={revealed ? (Array.isArray(view.answer) ? view.answer : null) : undefined} />
        {question.compare ? (
          revealed ? <CompareFeedback question={question} typed={Array.isArray(view.answer) ? view.answer : []} ar={ar} />
            : <CompareInputs question={question} typed={typed} onChange={draftTyped} onCheck={() => send({ type: "submit", answer: typed })} ar={ar} />
        ) : question.tree ? (
          revealed ? <BranchFeedback question={question} typed={Array.isArray(view.answer) ? view.answer : emptyBranchAnswers(question)} names={view.surahNames} ar={ar} />
            : <BranchInputs question={question} typed={typed} onChange={draftTyped} onCheck={() => send({ type: "submit", answer: typed })} ar={ar} />
        ) : question.write ? null : orders(question) ? (
          <OrderRows key={question.key} question={question} given={revealed ? (typeof view.answer === "string" ? view.answer : "") : undefined} sent={sent} ar={ar}
            onAnswer={(answer) => send({ type: "submit", answer })} onDraft={(answer) => send({ type: "draft", answer })} />
        ) : ticks(question) ? (
          <Ticks key={question.key} question={question} answer={typeof view.answer === "string" ? view.answer : null} revealed={revealed} sent={sent} ar={ar}
            onSend={(answer) => send({ type: "submit", answer })} onDraft={(answer) => send({ type: "draft", answer })} />
        ) : (
          <div className="flex flex-col gap-2">
            {question.choices.map((choice) => {
              const given = view.answer === choice.value;
              const right = revealed && choice.value === question.correctAnswer;
              const wrong = revealed && given && !right;
              return (
                <Button key={choice.value} variant="outline" active={given && !revealed} disabled={(sent || revealed) && !given && !right}
                  className={`justify-start text-start ${right ? "border-[var(--home-green)]" : ""}`}
                  onClick={() => { if (!sent && !revealed) send({ type: "submit", answer: choice.value }); }}>
                  <FontAwesomeIcon icon={right ? faCircleCheck : wrong ? faCircleXmark : given ? faCircleCheck : faCircle} className={right ? "text-[var(--home-green)]" : wrong ? "text-[var(--home-accent)]" : undefined} />
                  <ChoiceText question={question} value={choice.value} answered={revealed} />
                  {right && <span className="text-xs font-semibold text-[var(--home-green)]">{ar ? "صحيح" : "Correct"}</span>}
                  {wrong && <span className="text-xs font-semibold text-[var(--home-accent)]">{ar ? "إجابتك" : "Your answer"}</span>}
                </Button>
              );
            })}
            {!sent && !revealed && <Button className="self-start" onClick={() => send({ type: "submit", answer: "" })}><FontAwesomeIcon icon={faPaperPlane} />{ar ? "أرسل بلا إجابة" : "Send with no answer"}</Button>}
          </div>
        )}
        {!revealed && lookable && <>
          {view.looked && <LookedNote />}
          <LookButton look={question.look!} onLook={look} costs={!view.looked}
            top={view.deadline !== null ? <Countdown deadline={view.deadline} total={total} offset={offset} ar={ar} /> : undefined} />
        </>}
        {revealed && view.result && (
          <p className="mt-4 font-semibold" data-result>{question.compare
            ? (ar ? `${num(view.result.earned)} من ${num(view.result.total)} فراغات` : `${view.result.earned} of ${view.result.total} blanks`)
            : question.tree
            ? (ar ? `${num(view.result.earned)} من ${num(view.result.total)} أطراف` : `${view.result.earned} of ${view.result.total} leaves`)
            : question.write
            ? (ar ? `${num(view.result.earned)} من ${num(view.result.total)} كلمات` : `${view.result.earned} of ${view.result.total} words`)
            : view.answer === null ? (ar ? "لم تجب في الوقت." : "No answer in time.") : view.answer === "" ? (ar ? "لم تجب." : "No answer.")
            : orders(question) ? (ar ? `${num(view.result.earned)} من ${num(view.result.total)} في مكانها` : `${view.result.earned} of ${view.result.total} in place`)
            : ticks(question) ? (ar ? `${num(view.result.earned)} من ${num(view.result.total)} صحيحة` : `${view.result.earned} of ${view.result.total} right`)
            : view.result.earned ? (ar ? "إجابة صحيحة" : "Correct") : (ar ? "إجابة خاطئة" : "Incorrect")}</p>
        )}
        {revealed && view.answer !== null && view.answer !== "" && !question.tree && !question.compare && !question.write && <ChoiceAfter question={question} given={view.answer as string} ar={ar}
          surahName={(value) => question.choices.find((choice) => choice.value === value)?.labelArabic} />}
        {revealed && (view.answer === null || view.answer === "" || question.write) && !question.tree && !question.compare && <ChoiceAfter question={question} ar={ar} />}
        {/* After the reveal, everyone sees the view it is looked up in, the answer lit (owner, 2026-11-19). */}
        {revealed && lookable && <div className="mt-4"><LookView look={question.look!} shown /></div>}
      </Card>
      {revealed && (
        <>
          <Leaderboard players={view.players} you={view.you} ar={ar} />
          {isHost
            ? <Button className="self-start" variant="primary" onClick={() => send({ type: "next" })}><FontAwesomeIcon icon={faPlay} />{last ? (ar ? "الترتيب النهائي" : "Final results") : (ar ? "السؤال التالي" : "Next question")}</Button>
            : <p className="text-sm text-[var(--home-muted)]">{ar ? "ينتظر المضيف ليكمل." : "Waiting for the host to go on."}</p>}
        </>
      )}
    </div>
  );
}

function Notice({ status, ar }: { status: PartyStatus | "started"; ar: boolean }) {
  const text = status === "missing" ? (ar ? "لا يوجد اختبار بهذا الرقم، أو انتهى." : "There's no party with this number, or it has ended.")
    : status === "started" ? (ar ? "بدأ هذا الاختبار، فلا يمكن الانضمام إليه الآن." : "This party has already started, so it can't take new players.")
    : (ar ? "أخرجك المضيف من هذا الاختبار." : "The host removed you from this party.");
  return <div className="flex flex-col items-start gap-4"><p>{text}</p><Button variant="primary" href="/quizzes/party"><FontAwesomeIcon icon={faRotateLeft} />{ar ? "اختبار جماعي جديد" : "New party quiz"}</Button></div>;
}

function FinalResults({ view, send, ar }: { view: PartyView; send: ReturnType<typeof usePartySocket>["send"]; ar: boolean }) {
  const [reviewing, setReviewing] = useState(false);
  return <div className="flex flex-col gap-5">
    <Leaderboard players={view.players} you={view.you} ar={ar} final />
    {!!view.review?.length && <Button className="self-start" aria-expanded={reviewing} onClick={() => setReviewing(value => !value)}><Eye size={16} aria-hidden />{reviewing ? (ar ? "العودة للترتيب" : "Back to leaderboard") : (ar ? "مراجعة الأسئلة" : "Review questions")}</Button>}
    {reviewing && <QuestionReview entries={(view.review ?? []).map(entry => ({ ...entry, question: entry.question as Question }))} names={view.surahNames} ar={ar} />}
    {view.you === view.hostId && <Button className="self-start" variant="primary" onClick={() => send({ type: "again" })}><FontAwesomeIcon icon={faRotateLeft} />{ar ? "اختبار آخر بالفريق نفسه" : "Play again with this party"}</Button>}
  </div>;
}

export default function PartyRoom({ code }: { code: string }) {
  const { language } = useLanguage();
  const ar = language === "ar";
  const [id, setId] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  useEffect(() => {
    setId(playerId());
    setName(savedName() || null);
  }, []);
  const { view, error, status, send, offset } = usePartySocket(code, id, name);
  useHideFooter(true);
  const joined = view !== null && view.players.some((player) => player.id === view.you);
  const nameError = !joined && error && ["name-taken", "name-empty"].includes(error) ? ERRORS[error][ar ? "ar" : "en"] : null;

  let body: React.ReactNode;
  if (status === "missing" || status === "removed") body = <Notice status={status} ar={ar} />;
  else if (!joined && error === "started") body = <Notice status="started" ar={ar} />;
  else if (id && (!name || nameError)) body = <NameForm initial={name ?? ""} error={nameError} ar={ar} label={ar ? "انضم" : "Join"} nameError onSubmit={(value) => { saveName(value); setName(value); }} />;
  else if (!view) body = <LoadingDots fill="page" />;
  else if (view.phase === "lobby") body = <Lobby view={view} send={send} error={error} ar={ar} />;
  else if (view.phase === "loading") body = <div className="flex flex-col items-center gap-3"><LoadingDots fill /><p className="text-[var(--home-muted)]">{ar ? "تُجهَّز الأسئلة…" : "Getting the questions ready…"}</p></div>;
  else if (view.phase === "final") body = <FinalResults view={view} send={send} ar={ar} />;
  else body = <QuestionStage key={view.question?.key} view={view} send={send} offset={offset} ar={ar} />;

  return (
    <div className={styles.page}>
      <div className="mx-auto max-w-5xl px-4 pt-3 pb-8" dir={ar ? "rtl" : "ltr"}>
        <header className="mb-6 flex min-h-9 flex-wrap items-center justify-between gap-3 border-b border-[var(--home-rule)] pb-3 pe-14">
          <h1 className="sr-only">{ar ? `الاختبار ${code}` : `Party ${code}`}</h1>
          {view && (view.phase === "question" || view.phase === "reveal") ? <p className="text-sm text-[var(--home-muted)]">{ar ? `السؤال ${num(view.index + 1)} من ${num(view.total)}` : `Question ${view.index + 1} of ${view.total}`}</p> : <span />}
          <div className="flex items-center gap-3">
            {(status === "connecting" || status === "closed") && view && <span role="status" className="text-sm text-[var(--home-muted)]">{ar ? "يعيد الاتصال…" : "Reconnecting…"}</span>}
            {joined && <Button size="sm" variant="ghost" href="/quizzes/party" onClick={() => send({ type: "leave" })}><FontAwesomeIcon icon={faRightFromBracket} />{ar ? "غادر" : "Leave"}</Button>}
          </div>
        </header>
        {joined && error && !["not-ready", "name-taken", "name-empty"].includes(error) && <p role="alert" className="mb-4 text-sm text-[var(--home-accent)]">{ERRORS[error][ar ? "ar" : "en"]}</p>}
        {body}
      </div>
    </div>
  );
}

/**
 * A question of several right choices in a party (the app's QuizChoice): tick each that holds and send; once revealed, the
 * right ones ticked green, a wrong one ticked red, a right one left unticked amber «فاتك» (owner, 2026-11-19).
 */
function Ticks({ question, answer, revealed, sent, ar, onSend, onDraft }: {
  question: { choices: { value: string; labelArabic: string }[]; correctAnswer: string; correctAnswers?: string[] };
  answer: string | null; revealed: boolean; sent: boolean; ar: boolean; onSend: (answer: string) => void;
  /** Each tick goes to the party as a draft, so what is ticked when time runs out is graded (rules.ts reveal). */
  onDraft: (answer: string) => void;
}) {
  const [ticked, setTicked] = useState<string[]>([]);
  const joined = (values: string[]) => question.choices.map(choice => choice.value).filter(value => values.includes(value)).join(PICKS);
  const picks = revealed || sent ? picksOf(answer ?? undefined) : ticked;
  return (
    <div className="flex flex-col gap-2">
      {question.choices.map((choice) => {
        const given = picks.includes(choice.value);
        const isRight = revealed && isRightChoice(question, choice.value);
        const missed = isRight && !given;
        const wrong = revealed && given && !isRight;
        const color = isRight && given ? "var(--home-green)" : missed ? "var(--home-amber)" : wrong || given ? "var(--home-accent)" : undefined;
        return (
          <Button key={choice.value} variant="outline" role="checkbox" aria-checked={given} className="justify-start text-start"
            style={color ? { borderColor: color, color, borderStyle: missed ? "dashed" : "solid" } : undefined}
            onClick={() => {
              if (sent || revealed) return;
              const next = ticked.includes(choice.value) ? ticked.filter(value => value !== choice.value) : [...ticked, choice.value];
              setTicked(next);
              onDraft(joined(next));
            }}>
            {given ? <SquareCheck size={18} aria-hidden /> : <Square size={18} aria-hidden />}
            <span>{choice.labelArabic}</span>
            {missed && <span className="text-xs font-semibold">{ar ? "فاتك" : "Missed"}</span>}
          </Button>
        );
      })}
      {!sent && !revealed && <div className="flex flex-wrap gap-2">
        <Button variant="primary" onClick={() => onSend(joined(ticked))}>
          <FontAwesomeIcon icon={faPaperPlane} />{ar ? "أرسل" : "Send"}</Button>
        <Button onClick={() => onSend("")}><FontAwesomeIcon icon={faPaperPlane} />{ar ? "أرسل بلا إجابة" : "Send with no answer"}</Button>
      </div>}
    </div>
  );
}

