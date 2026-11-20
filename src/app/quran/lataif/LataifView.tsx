'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import Reference from '@/components/common/Reference';
import { ShareImageButton } from '@/components/share/ShareImage';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import { TOPICS, topicOf, type LataifReference } from '@shared/quran/lataif';
import { letterDiff, rangeLabel, type ExampleView, type Line, type Step, type TurnView, type Voice } from '@shared/quran/iltifat';
import Card from '@/components/common/Card';
import Chip from '@/components/common/Chip';
import AyahFlow, { AyahWords, TreeText } from '@/components/quran/text/AyahFlow';

/** The app's colours for the three voices (mobile/src/components/Iltifat.tsx). */
export const VOICE_COLOR: Record<Voice, string> = { he: 'var(--home-slot-1)', we: 'var(--home-green)', you: 'var(--home-root)' };
const VOICE_NAME: Record<Voice, string> = { he: 'غيبة', we: 'تكلم', you: 'خطاب' };
const ICON = 'flex size-9 items-center justify-center rounded-full text-[var(--home-muted)] hover:text-[var(--home-accent)] focus-visible:outline-2 focus-visible:outline-[var(--home-accent)]';
const DASH = 'h-0 flex-1 border-t-[1.5px] border-dashed border-[var(--home-rule)]';

function Words({ lines }: { lines: Line[] }) {
  return lines.map((line, i) => (
    <React.Fragment key={i}>
      {i > 0 && ' '}
      {line.words.map((word, k) => (
        <React.Fragment key={k}>
          {k > 0 && ' '}
          {word.voice ? <span style={{ color: VOICE_COLOR[word.voice] }}><AyahWords>{word.text}</AyahWords></span> : <AyahWords>{word.text}</AyahWords>}
        </React.Fragment>
      ))}
      {line.end && <span className="text-[var(--home-amber)]">{' '}{num(line.ayah)}</span>}
    </React.Fragment>
  ));
}

function Strip({ steps }: { steps: Step[] }) {
  return (
    <ol className="flex items-start" aria-label="ترتيب الضمائر">
      {steps.map((step, i) => (
        <li key={i} className="flex items-start" aria-label={`${step.label}: ${VOICE_NAME[step.voice]}`}>
          {i > 0 && <span aria-hidden className="mt-[0.95rem] h-px w-8 bg-[var(--home-rule)] sm:w-12" />}
          <span className="flex min-w-14 flex-col items-center">
            <span className="rounded-full border-[1.5px] px-3 text-lg leading-[1.8]" style={{ color: VOICE_COLOR[step.voice], borderColor: VOICE_COLOR[step.voice] }}>
              {step.label}{step.count && <span aria-hidden className="ms-1.5 text-[0.6rem] tracking-[2px]">{'●'.repeat(step.count)}</span>}
            </span>
            {(step.at || step.note) && <span className="text-sm text-[var(--home-muted)]">{step.at ? rangeLabel({ from: step.at[0], to: step.at[1] }) : step.note}</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}

function Tree({ trunk, leaves }: { trunk: string; leaves: { ayah: number; who: string; word: string }[] }) {
  const parts = letterDiff(mushafText(leaves[0].word), mushafText(leaves[1].word));
  return (
    <div className="flex flex-col items-stretch">
      <p className="rounded-[var(--card-radius)] border-[1.5px] border-[var(--home-rule)] px-3 py-1 text-center"><TreeText className="text-[var(--home-ink)]">{mushafText(trunk)}</TreeText></p>
      <svg aria-hidden viewBox="0 0 320 22" preserveAspectRatio="none" className="h-6 w-full fill-none stroke-[var(--home-rule)] [stroke-width:1.5]">
        <path d="M160 0 V8 Q160 12 150 12 H90 Q80 12 80 22 M160 8 Q160 12 170 12 H230 Q240 12 240 22" vectorEffect="non-scaling-stroke" />
      </svg>
      <ul className="grid grid-cols-2 gap-3">
        {leaves.map((leaf, i) => (
          <li key={leaf.ayah} className="flex flex-col items-center rounded-[var(--card-radius)] border-[1.5px] border-[var(--home-rule)] px-2 py-1">
            <TreeText className="text-[var(--home-ink)]">{parts[i][0]}<span className="text-[var(--home-accent)]">{parts[i][1]}</span>{parts[i][2]}</TreeText>
            <span className="text-sm text-[var(--home-muted)]">{leaf.who} · {num(leaf.ayah)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Dialog({ turns }: { turns: TurnView[] }) {
  return (
    <div className="flex flex-col gap-2">
      {turns.map((turn, i) => {
        if ('cut' in turn) return (
          <p key={i} className="flex items-center gap-2 text-sm text-[var(--home-muted)]">
            <span aria-hidden className={DASH} />{turn.cut}<span aria-hidden className={DASH} />
          </p>
        );
        if ('narration' in turn) return <AyahFlow key={i} center className="text-[var(--home-muted)]"><Words lines={turn.narration} /></AyahFlow>;
        return (
          <figure key={i} className={`max-w-[88%] rounded-[var(--card-radius)] bg-[var(--home-paper)] px-3 pt-1.5 pb-1 ${turn.side === 'start' ? 'self-start rounded-ss-[4px]' : 'self-end rounded-se-[4px]'}`}
            style={turn.said ? { boxShadow: `inset 0 0 0 1.5px ${VOICE_COLOR[turn.voice]}` } : undefined}>
            <figcaption className="text-sm" style={{ color: VOICE_COLOR[turn.voice] }}>{turn.who}</figcaption>
            <AyahFlow className="text-[var(--home-ink)]"><Words lines={turn.lines} /></AyahFlow>
          </figure>
        );
      })}
    </div>
  );
}

/** An example's picture: the voices' strip over the ayat, the two-word tree, or the dialog (the page's card and the feed's). */
export function ExampleScene({ view }: { view: ExampleView }) {
  return <>
      {view.kind === 'strip' && <>
        <Strip steps={view.steps} />
        <AyahFlow className="text-[var(--home-ink)]"><Words lines={view.lines} /></AyahFlow>
      </>}
      {view.kind === 'tree' && <Tree trunk={view.trunk} leaves={view.leaves} />}
      {view.kind === 'dialog' && <Dialog turns={view.turns} />}
  </>;
}

function ExampleCard({ view }: { view: ExampleView }) {
  const title = `${view.name} ${rangeLabel(view)}`;
  return (
    <Card as="article" id={view.key} data-share-card aria-label={title} className="flex scroll-mt-20 flex-col gap-2.5 px-4 pt-3.5 pb-1.5">
      <h3 className="text-base text-[var(--home-muted)]">{title}</h3>
      <ExampleScene view={view} />
      <div data-share-skip className="flex gap-1">
        <Link href={`/quran/read/ayah/${view.surah}/${view.from}`} aria-label={`افتح ${title} في المصحف`} title="افتح في المصحف" className={ICON}><BookOpen size={20} strokeWidth={1.6} aria-hidden /></Link>
        <ShareImageButton size="icon" iconSize={20} href={`/quran/lataif#${view.key}`} />
      </div>
    </Card>
  );
}

/** The voices' colours, under the topic's name: what each colour on the cards means. */
function Voices() {
  return (
    <ul className="flex flex-wrap gap-x-4 text-sm" aria-label="ألوان الضمائر">
      {(['he', 'we', 'you'] as Voice[]).map(voice => (
        <li key={voice} style={{ color: VOICE_COLOR[voice] }}>{{ he: 'هو', we: 'نحن، أنا', you: 'أنت' }[voice]}: {VOICE_NAME[voice]}</li>
      ))}
    </ul>
  );
}

/**
 * The lata'if page (owner, 2026-11-16): a gallery of curated examples, each card with its own picture, grouped by topic
 * with pills to pick one. Each topic and each card carries its reference (shared/quran/lataif.ts).
 */
export default function LataifView({ views, references }: { views: ExampleView[]; references: Record<string, LataifReference> }) {
  const [topic, setTopic] = useState<string | null>(null);
  return (
    <>
      <div role="tablist" aria-label="الفنون" className="flex flex-wrap gap-2">
        <Chip role="tab" label="الكل" on={topic === null} onClick={() => setTopic(null)} />
        {TOPICS.map(item => <Chip key={item.name} role="tab" label={item.name} on={topic === item.name} onClick={() => setTopic(item.name)} />)}
      </div>
      {TOPICS.filter(item => topic === null || topic === item.name).map(item => (
        <section key={item.name} aria-label={item.name} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl">{item.name}</h2>
            <Voices />
            <Reference title={item.reference.title} quotes={item.reference.quotes} />
          </div>
          {views.filter(view => topicOf(view).name === item.name).map(view => (
            <div key={view.key} className="flex flex-col gap-1.5">
              <ExampleCard view={view} />
              <div className="px-1"><Reference title={references[view.key].title} quotes={references[view.key].quotes} /></div>
            </div>
          ))}
        </section>
      ))}
    </>
  );
}
