'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faRoute, faTableColumns } from '@fortawesome/free-solid-svg-icons';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { num } from '@/lib/quran/arabicNumber';
import { OPENING_GROUPS, TASBIH_SURAHS } from '@/lib/quran/openings';
import { THEMES, TOPICS_SRC, type ChipView, type HopView } from '@/lib/quran/surahOrder';
import { SLOT_COLORS } from '@/components/quran/slotColors';

const PANEL = 'bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-4';
const NOTE = 'text-sm text-gray-600 dark:text-gray-400';
const DOT_Y = 31;

const COLORS = [
  { bg: 'bg-sky-500', text: 'text-sky-600 dark:text-sky-400', badge: 'border-sky-500 bg-sky-50 dark:bg-sky-950' },
  { bg: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400', badge: 'border-rose-500 bg-rose-50 dark:bg-rose-950' },
  { bg: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', badge: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950' },
  { bg: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', badge: 'border-amber-500 bg-amber-50 dark:bg-amber-950' },
  { bg: 'bg-violet-500', text: 'text-violet-600 dark:text-violet-400', badge: 'border-violet-500 bg-violet-50 dark:bg-violet-950' },
  { bg: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400', badge: 'border-orange-500 bg-orange-50 dark:bg-orange-950' },
  { bg: 'bg-teal-500', text: 'text-teal-600 dark:text-teal-400', badge: 'border-teal-500 bg-teal-50 dark:bg-teal-950' },
  { bg: 'bg-fuchsia-500', text: 'text-fuchsia-600 dark:text-fuchsia-400', badge: 'border-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-950' },
  { bg: 'bg-lime-500', text: 'text-lime-600 dark:text-lime-400', badge: 'border-lime-500 bg-lime-50 dark:bg-lime-950' },
  { bg: 'bg-indigo-500', text: 'text-indigo-600 dark:text-indigo-400', badge: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950' },
  { bg: 'bg-cyan-500', text: 'text-cyan-600 dark:text-cyan-400', badge: 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950' },
  { bg: 'bg-pink-500', text: 'text-pink-600 dark:text-pink-400', badge: 'border-pink-500 bg-pink-50 dark:bg-pink-950' },
];
const IDS = Object.keys(THEMES);
const colorOf = (id: string) => COLORS[IDS.indexOf(id)];

type Line = HopView['tail'][number];
type Span = { id: string; first: number; last: number; has: Set<number> };

function Words({ line }: { line: Line }) {
  return line.text.split(' ').map((word, i) => (
    <React.Fragment key={i}>
      {i > 0 && ' '}
      {line.slots && i in line.slots ? <mark className={`bg-transparent ${SLOT_COLORS[line.slots[i] % SLOT_COLORS.length]}`}>{word}</mark> : word}
    </React.Fragment>
  ));
}

function Side({ title, lines }: { title: string; lines: Line[] }) {
  return (
    <div>
      <h3 className={`${NOTE} mb-1`}>{title}</h3>
      {lines.map(l => (
        <p key={l.ayah} className="text-2xl leading-[2.2] font-arabic">
          <span className="text-sm text-amber-600 dark:text-amber-400 me-2">{num(l.ayah)}</span>
          <Words line={l} />
        </p>
      ))}
    </div>
  );
}

function Link({ item: { hop, tail, head, words, common } }: { item: HopView }) {
  return (
    <details id={`hop-${hop.from}`} className="my-2">
      <summary className="cursor-pointer text-amber-600 dark:text-amber-400 flex items-center gap-2">
        <FontAwesomeIcon icon={faArrowDown} aria-hidden />
        <span>الصلة بما بعدها</span>
      </summary>
      <div className={`${PANEL} mt-2`}>
        <h3 className={`${NOTE} mb-1`}>الموضوعات</h3>
        <p className="mb-2">{hop.topicLink}</p>
        {common.length > 0 && (
          <ul className="flex flex-wrap gap-1 mb-3" aria-label="موضوعات مشتركة مع التالية">
            {common.map(id => <li key={id}><Badge text={THEMES[id]} size="sm" color="amber" /></li>)}
          </ul>
        )}
        <h3 className={`${NOTE} mb-1`}>آخر السورة وأول التالية</h3>
        <p className="mb-3">{hop.note}</p>
        {words.length > 0 && <p className={`${NOTE} mb-3`}>{`كلمات مشتركة: ${words.join('، ')}`}</p>}
        <div className="grid md:grid-cols-2 gap-x-4">
          <Side title="آخر السورة" lines={tail} />
          <Side title="أول التالية" lines={head} />
        </div>
        {hop.src.length > 0 ? (
          <ul className={NOTE} aria-label="المصادر">
            {hop.src.map(s => (
              <li key={s.url}>
                <a className="underline" href={s.url} target="_blank" rel="noreferrer">{s.title}</a>
              </li>
            ))}
          </ul>
        ) : (
          <p className={NOTE}>بلا مصدر</p>
        )}
      </div>
    </details>
  );
}

function RailCell({ span, n }: { span: Span; n: number }) {
  const { id, first, last, has } = span;
  const color = colorOf(id);
  return (
    <span data-rail-cell={id} className="relative self-stretch w-2.5 sm:w-3.5 shrink-0">
      {n > first && n < last && <span className={`absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 ${color.bg}`} />}
      {n === first && n < last && <span className={`absolute bottom-0 left-1/2 w-0.5 -translate-x-1/2 ${color.bg}`} style={{ top: DOT_Y }} />}
      {n === last && n > first && <span className={`absolute top-0 left-1/2 w-0.5 -translate-x-1/2 ${color.bg}`} style={{ height: DOT_Y }} />}
      {has.has(n) && (
        <span data-dot={id} className={`absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full ${color.bg}`} style={{ top: DOT_Y - 5 }}>
          <span className="sr-only">{`الموضوع: ${THEMES[id]}`}</span>
        </span>
      )}
      {n === last && (
        <FontAwesomeIcon icon={faArrowDown} data-arrow={id} aria-hidden className={`absolute left-1/2 -translate-x-1/2 text-[9px] ${color.text}`} style={{ top: DOT_Y + 6 }} />
      )}
    </span>
  );
}

export default function OrderView({ chips, hops }: { chips: ChipView[]; hops: HopView[] }) {
  const spans: Span[] = IDS.map(id => {
    const ns = chips.filter(c => c.topics.some(t => t.theme === id)).map(c => c.number);
    return { id, first: ns[0], last: ns[ns.length - 1], has: new Set(ns) };
  });
  const [on, setOn] = useState<Set<string>>(() => new Set([...spans].sort((a, b) => b.has.size - a.has.size).slice(0, 4).map(s => s.id)));
  const toggle = (id: string) => setOn(prev => {
    const next = new Set(prev);
    if (!next.delete(id)) next.add(id);
    return next;
  });
  const active = spans.filter(s => on.has(s.id));
  return (
    <div className="flex flex-col gap-3">
      <p className={NOTE}>
        {'كل خط ملوّن يصل السور التي تتناول موضوعًا واحدًا: نقطة عند كل سورة تحمله، وسهم عند آخر سورة تحمله. اختر المواضيع التي تريد تتبعها. موضوعات كل سورة من قراءتنا لنصها، و«محور السورة» من '}
        <a className="underline" href={TOPICS_SRC.url} target="_blank" rel="noreferrer">{TOPICS_SRC.title}</a>
        {'. اضغط «الصلة بما بعدها» تحت كل سورة لترى موضوعاتها المشتركة مع التالية وآخر آياتها وأول آيات التالية. «بلا مصدر» تعني أن الربط قراءة لنص السورتين لم تُنسب إلى كتاب.'}
      </p>
      <ul className="flex flex-wrap gap-2" aria-label="المواضيع">
        {spans.map(s => (
          <li key={s.id}>
            <Button size="sm" active={on.has(s.id)} aria-pressed={on.has(s.id)} onClick={() => toggle(s.id)}>
              <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${colorOf(s.id).bg}`} />
              <FontAwesomeIcon icon={faRoute} aria-hidden />
              {THEMES[s.id]}
            </Button>
          </li>
        ))}
      </ul>
      <ol className="flex flex-col" aria-label="ترتيب السور">
        {chips.map(s => {
          const hop = hops.find(h => h.hop.from === s.number);
          const like = (OPENING_GROUPS.find(g => g.includes(s.number)) ?? []).filter(n => n !== s.number);
          return (
            <li key={s.number} className="flex gap-1">
              <div className="flex shrink-0 gap-0.5 sm:gap-1">
                {active.map(span => <RailCell key={span.id} span={span} n={s.number} />)}
              </div>
              <div className="min-w-0 flex-1 pb-2">
                <div className={`${PANEL} flex flex-col gap-2`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl">{`${num(s.number)} ${s.plain}`}</h2>
                    {like.length > 0 && (
                      <Button size="sm" variant="outline" href="/quran/openings">
                        <FontAwesomeIcon icon={faTableColumns} />
                        {TASBIH_SURAHS.includes(s.number) ? 'افتتاحها بالتسبيح كالمسبّحات' : `افتتاحها كافتتاح ${like.map(n => num(n)).join(' و')}`}
                      </Button>
                    )}
                  </div>
                  <p className={NOTE}>{`محور السورة: ${s.focus}`}</p>
                  <ul className="flex flex-wrap gap-1" aria-label={`موضوعات ${s.plain}`}>
                    {s.topics.map(t => (
                      <li key={t.theme}>
                        <Badge text={t.detail} size="sm" color="" className={colorOf(t.theme).badge} />
                      </li>
                    ))}
                  </ul>
                </div>
                {hop && <Link item={hop} />}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
