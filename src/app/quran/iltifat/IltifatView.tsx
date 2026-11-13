'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Send } from 'lucide-react';
import { SettingsHelp } from '@/components/common/SettingsHelp';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import { letterDiff, rangeLabel, shareText, type ExampleView, type Line, type Step, type TurnView, type Voice } from '@shared/quran/iltifat';

/** The app's colours for the three voices (mobile/src/components/Iltifat.tsx). */
export const VOICE_COLOR: Record<Voice, string> = { he: 'var(--home-slot-1)', we: 'var(--home-green)', you: 'var(--home-root)' };
const VOICE_NAME: Record<Voice, string> = { he: 'غيبة', we: 'تكلم', you: 'خطاب' };
const ICON = 'flex size-9 items-center justify-center rounded-full text-[var(--home-muted)] hover:text-[var(--home-accent)] focus-visible:outline-2 focus-visible:outline-[var(--home-accent)]';
const QURAN = 'font-quran text-[1.45rem] leading-[2.1] text-[var(--home-ink)]';

function Words({ lines }: { lines: Line[] }) {
  return lines.map((line, i) => (
    <React.Fragment key={i}>
      {i > 0 && ' '}
      {line.words.map((word, k) => (
        <React.Fragment key={k}>
          {k > 0 && ' '}
          {word.voice ? <span style={{ color: VOICE_COLOR[word.voice] }}>{mushafText(word.text)}</span> : mushafText(word.text)}
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
      <p className={`${QURAN} rounded-[var(--card-radius)] border-[1.5px] border-[var(--home-rule)] px-3 py-1 text-center`}>{mushafText(trunk)}</p>
      <svg aria-hidden viewBox="0 0 320 22" preserveAspectRatio="none" className="h-6 w-full fill-none stroke-[var(--home-rule)] [stroke-width:1.5]">
        <path d="M160 0 V8 Q160 12 150 12 H90 Q80 12 80 22 M160 8 Q160 12 170 12 H230 Q240 12 240 22" vectorEffect="non-scaling-stroke" />
      </svg>
      <ul className="grid grid-cols-2 gap-3">
        {leaves.map((leaf, i) => (
          <li key={leaf.ayah} className="flex flex-col items-center rounded-[var(--card-radius)] border-[1.5px] border-[var(--home-rule)] px-2 py-1">
            <span className="font-quran text-2xl leading-[2] text-[var(--home-ink)]">{parts[i][0]}<span className="text-[var(--home-accent)]">{parts[i][1]}</span>{parts[i][2]}</span>
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
          <p key={i} className="flex items-center gap-2 text-sm text-[var(--home-muted)] before:flex-1 before:border-t-[1.5px] before:border-dashed before:border-[var(--home-rule)] after:flex-1 after:border-t-[1.5px] after:border-dashed after:border-[var(--home-rule)]">{turn.cut}</p>
        );
        if ('narration' in turn) return <p key={i} className={`${QURAN} text-center text-[var(--home-muted)]`}><Words lines={turn.narration} /></p>;
        return (
          <figure key={i} className={`max-w-[88%] rounded-[var(--card-radius)] bg-[var(--home-paper)] px-3 pt-1.5 pb-1 ${turn.side === 'start' ? 'self-start rounded-ss-[4px]' : 'self-end rounded-se-[4px]'}`}
            style={turn.said ? { boxShadow: `inset 0 0 0 1.5px ${VOICE_COLOR[turn.voice]}` } : undefined}>
            <figcaption className="text-sm" style={{ color: VOICE_COLOR[turn.voice] }}>{turn.who}</figcaption>
            <p className={QURAN}><Words lines={turn.lines} /></p>
          </figure>
        );
      })}
    </div>
  );
}

async function share(view: ExampleView) {
  const text = mushafText(shareText(view));
  try {
    if (navigator.share) await navigator.share({ text });
    else await navigator.clipboard.writeText(text);
  } catch {}
}

function ExampleCard({ view }: { view: ExampleView }) {
  const title = `${view.name} ${rangeLabel(view)}`;
  return (
    <article id={view.key} aria-label={title} className="flex scroll-mt-20 flex-col gap-2.5 rounded-[var(--card-radius)] bg-[var(--home-card)] px-4 pt-3.5 pb-1.5">
      <h2 className="text-base text-[var(--home-muted)]">{title}</h2>
      {view.kind === 'strip' && <>
        <Strip steps={view.steps} />
        <p className={`${QURAN} text-justify [text-align-last:right]`}><Words lines={view.lines} /></p>
      </>}
      {view.kind === 'tree' && <Tree trunk={view.trunk} leaves={view.leaves} />}
      {view.kind === 'dialog' && <Dialog turns={view.turns} />}
      <div className="flex gap-1">
        <Link href={`/quran/read/ayah/${view.surah}/${view.from}`} aria-label={`افتح ${title} في المصحف`} title="افتح في المصحف" className={ICON}><BookOpen size={20} strokeWidth={1.6} aria-hidden /></Link>
        <button type="button" onClick={() => void share(view)} aria-label={`شارك ${title}`} title="شارك" className={ICON}><Send size={20} strokeWidth={1.6} aria-hidden /></button>
      </div>
    </article>
  );
}

/** What the help icon opens: what iltifat is, the colours, and where each example comes from. */
export function IltifatHelp({ views }: { views: ExampleView[] }) {
  return (
    <div className="flex flex-col gap-3">
      <p>انتقال الكلام من غيبة إلى خطاب أو تكلم، أو من أحدها إلى غيره، والمتحدَّث عنه واحد.</p>
      <ul className="flex flex-wrap gap-x-4" aria-label="ألوان الضمائر">
        {(['he', 'we', 'you'] as Voice[]).map(voice => (
          <li key={voice} style={{ color: VOICE_COLOR[voice] }}>{{ he: 'هو', we: 'نحن، أنا', you: 'أنت' }[voice]}: {VOICE_NAME[voice]}</li>
        ))}
      </ul>
      <ul className="flex flex-col gap-1 text-sm text-[var(--home-muted)]" aria-label="المصادر">
        {views.map(view => <li key={view.key}>{view.name} {rangeLabel(view)}: {view.source}</li>)}
      </ul>
      <p className="text-sm text-[var(--home-muted)]">النص برواية حفص. لم يراجع هذه الأمثلة أحد من أهل العلم.</p>
    </div>
  );
}

export default function IltifatView({ views }: { views: ExampleView[] }) {
  return (
    <>
      <SettingsHelp label="ما الالتفات؟"><IltifatHelp views={views} /></SettingsHelp>
      <div className="flex flex-col gap-3">
        {views.map(view => <ExampleCard key={view.key} view={view} />)}
      </div>
    </>
  );
}
