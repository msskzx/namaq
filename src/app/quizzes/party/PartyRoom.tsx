"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faCircle, faCircleCheck, faCircleXmark, faCopy, faCrown, faHourglassHalf, faPlay, faRightFromBracket, faRotateLeft, faUserCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { renderSVG } from "uqr";
import styles from "@/components/common/PaperPage.module.css";
import Button from "@/components/common/Button";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import QuizReferenceDialog from "@/components/common/QuizReferenceDialog";
import type { QuizReference } from "@/lib/quiz/quizReference";
import { useHideFooter } from "@/components/common/AppChrome";
import { useLanguage } from "@/components/language/LanguageContext";
import { num } from "@/lib/quran/arabicNumber";
import { parseJuzRange } from "@/lib/quran/juz";
import { emptyBranchAnswers } from "@/lib/quiz/score";
import type { QuestionChoice } from "@/lib/quiz/types";
import { leaderboard, NAME_MAX, type ActionError, type PartyQuestion, type PartyView, type PlayerView } from "@/lib/party/rules";
import { playerId, saveName, savedName, usePartySocket, type PartyStatus } from "@/lib/party/client";
import { BranchFeedback, BranchInputs } from "../BranchAnswers";
import PartySettingsPanel from "./PartySettings";

type Question = PartyQuestion & {
  promptArabic: string;
  choices: QuestionChoice[];
  choiceDetails?: Record<string, { text: string; reference: string }>;
  ayah?: { text: string; reference: string } | null;
  evidence?: { reference: QuizReference | null };
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

export function NameForm({ initial, onSubmit, error, ar, label }: { initial: string; onSubmit: (name: string) => void; error?: string | null; ar: boolean; label: string }) {
  const [name, setName] = useState(initial);
  return (
    <form className="flex flex-col gap-2" onSubmit={(event) => {
      event.preventDefault();
      if (name.trim()) onSubmit(name.trim());
    }}>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-[var(--home-ink)]">{ar ? "اسمك" : "Your name"}</span>
        <input value={name} maxLength={NAME_MAX} onChange={(event) => setName(event.target.value)} autoComplete="nickname"
          className="w-full max-w-xs rounded border border-[var(--home-rule)] bg-transparent px-3 py-2 text-[var(--home-ink)]" />
      </label>
      {error && <p role="alert" className="text-sm text-[var(--home-accent)]">{error}</p>}
      <Button className="self-start" variant="primary" type="submit" disabled={!name.trim()}>{label}</Button>
    </form>
  );
}

function Countdown({ deadline, offset, ar }: { deadline: number; offset: number; ar: boolean }) {
  const [now, setNow] = useState(() => Date.now() + offset);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now() + offset), 250);
    return () => clearInterval(timer);
  }, [offset]);
  const left = Math.max(0, Math.ceil((deadline - now) / 1000));
  const text = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
  return <span role="timer" aria-label={ar ? "الوقت المتبقي" : "Time left"} className={`inline-flex items-center gap-2 font-semibold tabular-nums ${left <= 10 ? "text-[var(--home-accent)]" : "text-[var(--home-ink)]"}`}>
    <FontAwesomeIcon icon={faHourglassHalf} />{ar ? `${num(Math.floor(left / 60))}:${num(left % 60).padStart(2, "٠")}` : text}
  </span>;
}

function Leaderboard({ players, you, ar, final }: { players: PlayerView[]; you: string; ar: boolean; final?: boolean }) {
  const ranked = leaderboard(players);
  const top = Math.max(1, ...ranked.map((player) => player.score));
  return (
    <section className={styles.panel} aria-label={ar ? "الترتيب" : "Leaderboard"}>
      <h2 className="mb-3 text-lg font-semibold">{final ? (ar ? "الترتيب النهائي" : "Final leaderboard") : (ar ? "الترتيب" : "Leaderboard")}</h2>
      <ol className="flex flex-col gap-1.5">
        {ranked.map((player) => {
          const rank = ranked.findIndex((other) => other.score === player.score) + 1;
          return (
            <li key={player.id} data-player={player.name} className={`flex items-center gap-3 rounded-sm px-2 py-1.5 ${player.id === you ? "bg-[var(--home-paper-deep)]" : ""}`}>
              <span className={`inline-flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${rank === 1 ? "bg-[var(--home-accent)] text-[var(--home-paper)]" : "border border-[var(--home-rule)] text-[var(--home-muted)]"}`}>{ar ? num(rank) : rank}</span>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="truncate text-[var(--home-ink)]">{player.name}</span>
                <span aria-hidden data-bar className="flex h-2 overflow-hidden rounded-full bg-[var(--home-rule)]">
                  <span className="bg-[var(--home-accent)] transition-[width] duration-700" style={{ width: `${((player.score - (final ? 0 : player.earned ?? 0)) / top) * 100}%` }} />
                  {!final && !!player.earned && <span className="bg-[var(--home-green)] transition-[width] duration-700" style={{ width: `${(player.earned / top) * 100}%` }} />}
                </span>
              </span>
              {player.earned !== null && !final && <span dir="ltr" className={`text-sm tabular-nums ${player.earned ? "text-[var(--home-green)]" : "text-[var(--home-muted)]"}`}>+{ar ? num(player.earned) : player.earned}</span>}
              <span className="w-10 text-end font-semibold tabular-nums">{ar ? num(player.score) : player.score}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Share({ code, ar }: { code: string; ar: boolean }) {
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState("");
  useEffect(() => setLink(`${window.location.origin}/quizzes/party/${code}`), [code]);
  const qr = useMemo(() => link ? renderSVG(link, { border: 1, whiteColor: "var(--home-paper)", blackColor: "var(--home-ink)" }) : "", [link]);
  return (
    <section className={`${styles.panel} flex flex-wrap items-center gap-5`} aria-label={ar ? "ادعُ الآخرين" : "Invite others"}>
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
    </section>
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
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <div className="flex flex-col gap-5">
        <Share code={view.code} ar={ar} />
        <section className={styles.panel} aria-label={ar ? "اللاعبون" : "Players"}>
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
        </section>
      </div>
      <div className="flex flex-col gap-5">
        <PartySettingsPanel settings={view.settings} editable={isHost} ar={ar} onChange={(settings) => send({ type: "settings", settings })} />
        {view.error && <p role="alert" className="text-[var(--home-accent)]">{view.error === "Not enough approved questions" ? (ar ? "لا توجد أسئلة كافية لهذه الإعدادات." : "There aren't enough questions for these settings.") : (ar ? "تعذر إنشاء الاختبار." : "Failed to build the quiz.")}</p>}
        {isHost ? (
          confirming ? (
            <div role="alertdialog" aria-label={ar ? "تأكيد البدء" : "Confirm start"} className={`${styles.panel} flex flex-col gap-3`}>
              <p>{ar ? `استعد ${num(readyCount)} من ${num(others.length)}. أتبدأ الآن؟` : `${readyCount} of ${others.length} players are ready. Start anyway?`}</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary" onClick={() => { setConfirming(false); send({ type: "start", early: true }); }}><FontAwesomeIcon icon={faPlay} />{ar ? "ابدأ الآن" : "Start anyway"}</Button>
                <Button onClick={() => setConfirming(false)}>{ar ? "انتظر" : "Wait"}</Button>
              </div>
            </div>
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

function ChoiceText({ question, value }: { question: Question; value: string }) {
  const choice = question.choices.find((item) => item.value === value);
  const detail = question.choiceDetails?.[value];
  if (!choice) return null;
  if (!detail) return <>{choice.labelArabic}</>;
  return <span><span className="block leading-relaxed">{detail.text}</span><span className="text-xs text-[var(--home-muted)]">{detail.reference}</span></span>;
}

function QuestionStage({ view, send, offset, ar }: { view: PartyView; send: ReturnType<typeof usePartySocket>["send"]; offset: number; ar: boolean }) {
  const question = view.question as Question;
  const revealed = view.phase === "reveal";
  const [typed, setTyped] = useState<string[]>(() => emptyBranchAnswers(question));
  const [source, setSource] = useState(false);
  const sent = view.answer !== null;
  const waiting = view.players.filter((player) => !player.submitted);
  const juz = parseJuzRange(String(view.settings.juzFrom), String(view.settings.juzTo));
  const isHost = view.you === view.hostId;
  const last = view.index + 1 >= view.total;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--home-muted)]">{ar ? `السؤال ${num(view.index + 1)} من ${num(view.total)}` : `Question ${view.index + 1} of ${view.total}`}</p>
        {!revealed && view.deadline !== null && <Countdown deadline={view.deadline} offset={offset} ar={ar} />}
      </div>
      <div className={styles.panel}>
        <p dir="rtl" lang="ar" className={`mb-4 ${question.tree ? "text-base leading-relaxed" : "text-xl leading-loose font-semibold"}`}>{question.promptArabic}</p>
        {question.ayah && (
          <blockquote dir="rtl" lang="ar" className="mb-4 border-s-2 border-[var(--home-accent)] ps-4">
            <p className="font-arabic text-xl leading-loose text-[var(--home-ink)]">{question.ayah.text}</p>
            <p className="text-sm text-[var(--home-muted)]">{question.ayah.reference}</p>
          </blockquote>
        )}
        {question.tree ? (
          revealed ? <BranchFeedback question={question} typed={Array.isArray(view.answer) ? view.answer : emptyBranchAnswers(question)} names={view.surahNames} juz={juz} ar={ar} />
            : sent ? <p className="text-[var(--home-muted)]">{ar ? "أُرسلت إجابتك." : "Your answer is in."}</p>
            : <BranchInputs question={question} typed={typed} onChange={setTyped} onCheck={() => send({ type: "submit", answer: typed })} ar={ar} />
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
                  <ChoiceText question={question} value={choice.value} />
                  {right && <span className="text-xs font-semibold text-[var(--home-green)]">{ar ? "صحيح" : "Correct"}</span>}
                  {wrong && <span className="text-xs font-semibold text-[var(--home-accent)]">{ar ? "إجابتك" : "Your answer"}</span>}
                </Button>
              );
            })}
          </div>
        )}
        {revealed && view.result && (
          <p className="mt-4 font-semibold" data-result>{question.tree
            ? (ar ? `${num(view.result.earned)} من ${num(view.result.total)} أطراف` : `${view.result.earned} of ${view.result.total} leaves`)
            : view.answer === null ? (ar ? "لم تجب في الوقت." : "No answer in time.") : view.result.earned ? (ar ? "إجابة صحيحة" : "Correct") : (ar ? "إجابة خاطئة" : "Incorrect")}</p>
        )}
        {revealed && question.evidence?.reference && (
          <Button className="mt-3" size="sm" variant="outline" onClick={() => setSource(true)}><FontAwesomeIcon icon={faBookOpen} />{ar ? "المصدر" : "Source"}</Button>
        )}
        <QuizReferenceDialog reference={source ? question.evidence?.reference ?? null : null} onClose={() => setSource(false)} />
      </div>
      {!revealed && sent && (
        <p className="text-sm text-[var(--home-muted)]" aria-live="polite">{ar
          ? `ننتظر ${waiting.map((player) => player.name).join("، ")}.`
          : `Waiting for ${waiting.map((player) => player.name).join(", ")}.`}</p>
      )}
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
  else if (id && (!name || nameError)) body = <NameForm initial={name ?? ""} error={nameError} ar={ar} label={ar ? "انضم" : "Join"} onSubmit={(value) => { saveName(value); setName(value); }} />;
  else if (!view) body = <LoadingSpinner fill />;
  else if (view.phase === "lobby") body = <Lobby view={view} send={send} error={error} ar={ar} />;
  else if (view.phase === "loading") body = <div className="flex flex-col items-center gap-3"><LoadingSpinner /><p className="text-[var(--home-muted)]">{ar ? "تُجهَّز الأسئلة…" : "Getting the questions ready…"}</p></div>;
  else if (view.phase === "final") body = (
    <div className="flex flex-col gap-5">
      <Leaderboard players={view.players} you={view.you} ar={ar} final />
      {view.you === view.hostId && <Button className="self-start" variant="primary" onClick={() => send({ type: "again" })}><FontAwesomeIcon icon={faRotateLeft} />{ar ? "اختبار آخر بالفريق نفسه" : "Play again with this party"}</Button>}
    </div>
  );
  else body = <QuestionStage key={view.question?.key} view={view} send={send} offset={offset} ar={ar} />;

  return (
    <div className={styles.page}>
      <div className="mx-auto max-w-5xl px-4 py-8" dir={ar ? "rtl" : "ltr"}>
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--home-rule)] pb-4">
          <div>
            <p className="text-[0.9375rem] text-[var(--home-accent)]">{ar ? "نمق · اختبار جماعي" : "Namaq · Party quiz"}</p>
            <h1 className="text-2xl font-bold">{ar ? `الاختبار ${code}` : `Party ${code}`}</h1>
          </div>
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
