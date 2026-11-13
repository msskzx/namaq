"use client";

import React from "react";
import useSWR from "swr";
import Button from "@/components/common/Button";
import TreeFilters from "../TreeFilters";
import { scopeSummary } from "@shared/quiz/scopeSummary";
import styles from "@/components/common/PaperPage.module.css";
import { fetcher } from "@/lib/swr";
import { num } from "@shared/quran/arabicNumber";
import { QUIZ_LEAVES, QUIZ_LENGTHS, type QuizLength, type QuizTopic } from "@/lib/quiz/types";
import { QUESTION_SECONDS, TREE_SECONDS, quizQuery, type PartySettings } from "@shared/party/rules";
import { DIFFICULTY_LABELS, DIFFICULTY_NOTES, TOPIC_GROUPS, TOPIC_LABELS } from "../labels";
import { RANGED_TOPICS, SOLO_TOPICS } from "@shared/quiz/settings";
import { DEFAULT_DIFFICULTY, DIFFICULTIES } from "@shared/quiz/difficulty";
import PersonPicker from "../PersonPicker";
import { BranchExplainer } from "../BranchAnswers";

const n = (value: number, ar: boolean) => ar ? num(value) : String(value);
const duration = (seconds: number, ar: boolean) => seconds < 60
  ? (ar ? `${num(seconds)} ث` : `${seconds}s`)
  : (ar ? `${num(seconds / 60)} د` : `${seconds / 60} min`);

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={label} className="mb-4 last:mb-0">
      <p className="mb-1.5 text-sm font-semibold text-[var(--home-ink)]">{label}</p>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

/** The host edits the party's quiz here; everyone else reads the same settings. */
export default function PartySettingsPanel({ settings, editable, onChange, ar }: { settings: PartySettings; editable: boolean; onChange: (change: Partial<PartySettings>) => void; ar: boolean }) {
  const branches = settings.topics.includes("BRANCHES");
  const ranged = settings.topics.some((topic) => RANGED_TOPICS.includes(topic));
  const others = settings.topics.some((topic) => topic !== "BRANCHES");
  const ready = settings.topics.length > 0 && (!settings.topics.includes("PERSON_CIRCLE") || settings.person);
  const scope = new URLSearchParams(quizQuery(settings));
  scope.delete("length");
  scope.delete("leaves");
  scope.delete("difficulty");
  const { data: availability } = useSWR<{ available: number; lengths: QuizLength[] }>(editable && ready ? `/api/quiz/availability?${scope}` : null, fetcher);
  const toggle = (topic: QuizTopic) => onChange({ topics: settings.topics.includes(topic) ? settings.topics.filter((item) => item !== topic) : [...settings.topics, topic] });

  if (!editable) {
    const rows: [string, string][] = [
      [ar ? "المواضيع" : "Topics", settings.topics.map((topic) => TOPIC_LABELS[topic][ar ? "ar" : "en"]).join(ar ? "، " : ", ") || "—"],
      [ar ? "عدد الأسئلة" : "Questions", n(settings.length, ar)],
      ...(ranged ? [
        [branches ? (ar ? "الأشجار" : "Trees") : (ar ? "النطاق" : "Range"), scopeSummary(settings, ar, branches)] as [string, string],
        [ar ? "الصعوبة" : "Difficulty", DIFFICULTY_LABELS[settings.difficulty ?? DEFAULT_DIFFICULTY][ar ? "ar" : "en"]] as [string, string],
      ] : []),
      ...(branches ? [
        [ar ? "الإجابات في كل شجرة" : "Answers per tree", n(settings.leaves, ar)] as [string, string],
        [ar ? "وقت سؤال الشجرة" : "Time per tree", duration(settings.treeSeconds, ar)] as [string, string],
      ] : []),
      ...(others ? [[ar ? "وقت السؤال" : "Time per question", duration(settings.seconds, ar)] as [string, string]] : []),
    ];
    return (
      <section className={styles.panel} aria-label={ar ? "إعدادات الاختبار" : "Quiz settings"}>
        <h2 className="mb-1 text-lg font-semibold">{ar ? "إعدادات الاختبار" : "Quiz settings"}</h2>
        <p className="mb-3 text-sm text-[var(--home-muted)]">{ar ? "يختارها المضيف." : "The host chooses these."}</p>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
          {rows.map(([label, value]) => <React.Fragment key={label}><dt className="text-[var(--home-muted)]">{label}</dt><dd className="text-[var(--home-ink)]">{value}</dd></React.Fragment>)}
        </dl>
        {branches && <div className="mt-4 border-t border-[var(--home-rule)] pt-4"><BranchExplainer leaves={settings.leaves} ar={ar} /></div>}
      </section>
    );
  }

  return (
    <section className={styles.panel} aria-label={ar ? "إعدادات الاختبار" : "Quiz settings"}>
      <h2 className="mb-3 text-lg font-semibold">{ar ? "إعدادات الاختبار" : "Quiz settings"}</h2>
      {TOPIC_GROUPS.map((group) => (
        <Row key={group.en} label={group[ar ? "ar" : "en"]}>
          {group.topics.filter((topic) => !SOLO_TOPICS.includes(topic)).map((topic) => (
            <Button key={topic} active={settings.topics.includes(topic)} aria-pressed={settings.topics.includes(topic)} onClick={() => toggle(topic)}>
              {TOPIC_LABELS[topic][ar ? "ar" : "en"]}
            </Button>
          ))}
        </Row>
      ))}
      {settings.topics.includes("PERSON_CIRCLE") && <div className="mb-4"><PersonPicker person={settings.person} ar={ar} onCommit={(person) => onChange({ person: person ?? "" })} /></div>}
      {ranged && (
        <>
          <div className="mb-4 flex flex-wrap items-start gap-x-6 gap-y-4">
            <div className="min-w-0 basis-full">
              <TreeFilters savedOnly={false} trees={branches} choice={{ range: settings.juzFrom === 1 && settings.juzTo === 30 ? null : { from: settings.juzFrom, to: settings.juzTo }, filters: settings.filters ?? {}, saved: false }}
                onChange={({ range, filters }) => onChange({ juzFrom: range?.from ?? 1, juzTo: range?.to ?? 30, filters })} />
            </div>
          <Row label={ar ? "الصعوبة" : "Difficulty"}>
            {DIFFICULTIES.map((value) => <Button key={value} active={(settings.difficulty ?? DEFAULT_DIFFICULTY) === value} aria-pressed={(settings.difficulty ?? DEFAULT_DIFFICULTY) === value} onClick={() => onChange({ difficulty: value })}>{DIFFICULTY_LABELS[value][ar ? "ar" : "en"]}</Button>)}
            {settings.topics.flatMap((topic) => DIFFICULTY_NOTES[topic] ? [<p key={topic} className="basis-full text-sm text-[var(--home-muted)]">{DIFFICULTY_NOTES[topic]![ar ? "ar" : "en"]}</p>] : [])}
          </Row>
          {branches && <Row label={ar ? "عدد الإجابات في كل شجرة" : "Answers per tree"}>
            {QUIZ_LEAVES.map((value) => (
              <Button key={value} size="icon" className="min-w-10 justify-center" active={settings.leaves === value} aria-pressed={settings.leaves === value} onClick={() => onChange({ leaves: value })}>{n(value, ar)}</Button>
            ))}
          </Row>}
          </div>
          {branches && <>
            <div className="mb-4"><BranchExplainer leaves={settings.leaves} ar={ar} /></div>
            <Row label={ar ? "وقت سؤال الشجرة" : "Time per tree"}>
              {TREE_SECONDS.map((value) => <Button key={value} active={settings.treeSeconds === value} aria-pressed={settings.treeSeconds === value} onClick={() => onChange({ treeSeconds: value })}>{duration(value, ar)}</Button>)}
            </Row>
          </>}
        </>
      )}
      {others && (
        <Row label={ar ? "وقت السؤال" : "Time per question"}>
          {QUESTION_SECONDS.map((value) => <Button key={value} active={settings.seconds === value} aria-pressed={settings.seconds === value} onClick={() => onChange({ seconds: value })}>{duration(value, ar)}</Button>)}
        </Row>
      )}
      <Row label={ar ? "عدد الأسئلة" : "Questions"}>
        {QUIZ_LENGTHS.map((value) => {
          const allowed = !availability || availability.lengths.includes(value);
          return <Button key={value} className="min-w-10" active={settings.length === value} aria-pressed={settings.length === value} disabled={!allowed} onClick={() => onChange({ length: value })}>{n(value, ar)}</Button>;
        })}
        {availability && <span className="text-sm text-[var(--home-muted)]">{ar ? `${num(availability.available)} سؤالًا متاحًا` : `${availability.available} questions available`}</span>}
      </Row>
    </section>
  );
}
