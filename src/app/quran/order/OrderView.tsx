'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faRoute, faTableColumns } from '@fortawesome/free-solid-svg-icons';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { num } from '@/lib/quran/arabicNumber';
import { OPENING_GROUPS, TASBIH_SURAHS } from '@/lib/quran/openings';
import { THEMES, TOPICS_SRC, type ChipView, type HopView } from '@/lib/quran/surahOrder';
import { RAIL_COLORS, RailCell, type RailColor, type RailSpan } from '@/components/quran/Rail';
import { SLOT_COLORS } from '@/components/quran/slotColors';

const PANEL = 'bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-4';
const NOTE = 'text-sm text-gray-600 dark:text-gray-400';

const IDS = Object.keys(THEMES);
const NEUTRAL: RailColor = { bg: 'bg-gray-400', text: 'text-gray-500 dark:text-gray-400', badge: 'border-gray-400 bg-gray-50 dark:bg-gray-900' };
const colorOf = (id: string) => (id === 'oaths' ? NEUTRAL : RAIL_COLORS[IDS.indexOf(id)]);

type Line = HopView['tail'][number];

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

export default function OrderView({ chips, hops }: { chips: ChipView[]; hops: HopView[] }) {
  const spans: RailSpan[] = IDS.map(id => {
    const ns = chips.filter(c => c.topics.some(t => t.theme === id)).map(c => c.number);
    return { id, first: ns[0], last: ns[ns.length - 1], has: new Set(ns) };
  });
  const [on, setOn] = useState<Set<string>>(() => new Set(spans.map(s => s.id)));
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
                  {s.focus && <p className={NOTE}>{`محور السورة: ${s.focus}`}</p>}
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
              <div className="order-first flex shrink-0 gap-0.5 sm:gap-1">
                {active.map(span => <RailCell key={span.id} span={span} n={s.number} color={colorOf(span.id)} label={`الموضوع: ${THEMES[span.id]}`} />)}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
