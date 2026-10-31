"use client";

import React from "react";
import useSWR from "swr";
import Button from "@/components/common/Button";
import NumberInput from "@/components/common/NumberInput";
import styles from "@/components/common/PaperPage.module.css";
import { fetcher } from "@/lib/swr";
import { num } from "@/lib/quran/arabicNumber";
import { QUIZ_LEAVES, QUIZ_LENGTHS, type QuizLength, type QuizTopic } from "@/lib/quiz/types";
import { QUESTION_SECONDS, TREE_SECONDS, quizQuery, type PartySettings } from "@/lib/party/rules";
import { LEAF_LEVELS, TOPIC_GROUPS, TOPIC_LABELS } from "../labels";
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
  const others = settings.topics.some((topic) => topic !== "BRANCHES");
  const ready = settings.topics.length > 0 && (!settings.topics.includes("PERSON_CIRCLE") || settings.person);
  const scope = new URLSearchParams(quizQuery(settings));
  scope.delete("length");
  scope.delete("leaves");
  const { data: availability } = useSWR<{ available: number; lengths: QuizLength[] }>(editable && ready ? `/api/quiz/availability?${scope}` : null, fetcher);
  const toggle = (topic: QuizTopic) => onChange({ topics: settings.topics.includes(topic) ? settings.topics.filter((item) => item !== topic) : [...settings.topics, topic] });

  if (!editable) {
    const rows: [string, string][] = [
      [ar ? "المواضيع" : "Topics", settings.topics.map((topic) => TOPIC_LABELS[topic][ar ? "ar" : "en"]).join(ar ? "، " : ", ") || "—"],
      [ar ? "عدد الأسئلة" : "Questions", n(settings.length, ar)],
      ...(branches ? [
        [ar ? "الأجزاء" : "Juz'", ar ? `${num(settings.juzFrom)} إلى ${num(settings.juzTo)}` : `${settings.juzFrom} to ${settings.juzTo}`] as [string, string],
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
          {group.topics.map((topic) => (
            <Button key={topic} active={settings.topics.includes(topic)} aria-pressed={settings.topics.includes(topic)} onClick={() => toggle(topic)}>
              {TOPIC_LABELS[topic][ar ? "ar" : "en"]}
            </Button>
          ))}
        </Row>
      ))}
      {settings.topics.includes("PERSON_CIRCLE") && <div className="mb-4"><PersonPicker person={settings.person} ar={ar} onCommit={(person) => onChange({ person: person ?? "" })} /></div>}
      {branches && (
        <>
          <div className="mb-4 flex flex-wrap items-start gap-x-6 gap-y-4">
            {([["juzFrom", settings.juzFrom, ar ? "من الجزء" : "From juz'"], ["juzTo", settings.juzTo, ar ? "إلى الجزء" : "To juz'"]] as const).map(([key, value, label]) => (
              <div key={key} className="flex flex-col gap-1 text-sm text-[var(--home-ink)]">
                <span>{label}</span>
                <NumberInput label={label} value={value} min={1} max={30} steppers={false} onChange={(next) => onChange({ [key]: next })} />
              </div>
            ))}
          <Row label={ar ? "عدد الإجابات في كل شجرة" : "Answers per tree"}>
            {QUIZ_LEAVES.map((value) => (
              <div key={value} className="flex flex-col items-center gap-0.5">
                <Button size="icon" className="min-w-10 justify-center" active={settings.leaves === value} aria-pressed={settings.leaves === value} onClick={() => onChange({ leaves: value })}>{n(value, ar)}</Button>
                {LEAF_LEVELS[value] && <span className="text-xs text-[var(--home-muted)]">{LEAF_LEVELS[value][ar ? "ar" : "en"]}</span>}
              </div>
            ))}
          </Row>
          </div>
          <div className="mb-4"><BranchExplainer leaves={settings.leaves} ar={ar} /></div>
          <Row label={ar ? "وقت سؤال الشجرة" : "Time per tree"}>
            {TREE_SECONDS.map((value) => <Button key={value} active={settings.treeSeconds === value} aria-pressed={settings.treeSeconds === value} onClick={() => onChange({ treeSeconds: value })}>{duration(value, ar)}</Button>)}
          </Row>
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
