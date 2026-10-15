'use client';

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faRoute, faTableColumns, faXmark } from '@fortawesome/free-solid-svg-icons';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { num } from '@/lib/quran/arabicNumber';
import { OPENING_GROUPS, TASBIH_SURAHS } from '@/lib/quran/openings';
import { THEMES, TOPICS_SRC, type ChipView, type HopView, type TopicView } from '@/lib/quran/surahOrder';
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

type ThemeGroup = { id: string; label: string; items: TopicView[] };

function groupByTheme(topics: TopicView[]): ThemeGroup[] {
  const order: string[] = [];
  const groups = new Map<string, ThemeGroup>();
  for (const t of topics) {
    const id = t.themeId ?? t.slug;
    if (!groups.has(id)) {
      order.push(id);
      groups.set(id, { id, label: t.themeId ? THEMES[t.themeId] : t.labelAr, items: [] });
    }
    groups.get(id)!.items.push(t);
  }
  return order.map(id => groups.get(id)!);
}

function TopicOverlay({ surahName, group, onClose }: { surahName: string; group: ThemeGroup | null; onClose: () => void }) {
  useEffect(() => {
    if (!group) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [group, onClose]);

  if (!group) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button type="button" aria-label="إغلاق" onClick={onClose} className="absolute inset-0 cursor-default bg-black/50" />
      <div role="dialog" aria-modal="true" aria-label={group.label} className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-lg border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-black">
        <div className="mb-3 flex items-start justify-between gap-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{group.label}</h2>
          <Button autoFocus size="icon" variant="outline" onClick={onClose} aria-label="إغلاق">
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </div>
        <p className={`${NOTE} mb-3`}>{`${surahName} — ${num(group.items.length)} ${group.items.length === 1 ? 'موضعًا' : 'مواضع'}`}</p>
        <ul className="flex flex-col gap-3">
          {group.items.map(item => (
            <li key={item.slug} className="border-t border-gray-200 pt-2 first:border-0 first:pt-0 dark:border-white/10">
              <p className="text-sm text-amber-600 dark:text-amber-400 mb-1">
                {`${item.labelAr} (${num(item.ayahFrom)}${item.ayahFrom === item.ayahTo ? '' : `-${num(item.ayahTo)}`})`}
              </p>
              <p className="font-arabic text-lg leading-relaxed">{item.excerptAr}</p>
            </li>
          ))}
        </ul>
      </div>
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

export type JuzRange = { min: number; max: number };

const JUZS = [25, 26, 27, 28, 29, 30];
const SURAH_MIN = 41;
const SURAH_MAX = 114;

export default function OrderView({ chips, hops, juzBySurah }: { chips: ChipView[]; hops: HopView[]; juzBySurah: Record<number, JuzRange> }) {
  const [openTopic, setOpenTopic] = useState<{ surah: number; themeId: string } | null>(null);
  const [juzFilter, setJuzFilter] = useState<number | null>(null);
  const [rangeFrom, setRangeFrom] = useState(SURAH_MIN);
  const [rangeTo, setRangeTo] = useState(SURAH_MAX);
  const openChip = openTopic && chips.find(c => c.number === openTopic.surah);
  const openGroup = openChip && openTopic ? groupByTheme(openChip.topics).find(g => g.id === openTopic.themeId) ?? null : null;
  const visibleChips = chips.filter(c => {
    const juz = juzBySurah[c.number];
    const inJuz = juzFilter === null || (juz && juz.min <= juzFilter && juzFilter <= juz.max);
    return inJuz && c.number >= rangeFrom && c.number <= rangeTo;
  });
  const spans: RailSpan[] = IDS.map(id => {
    const ns = visibleChips.filter(c => c.topics.some(t => t.themeId === id)).map(c => c.number);
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
      <div className="flex flex-wrap items-center gap-3" role="group" aria-label="تصفية السور">
        <label className="flex items-center gap-1.5 text-sm">
          الجزء
          <select
            className="rounded border border-gray-300 bg-white px-2 py-1 dark:border-white/10 dark:bg-black"
            value={juzFilter ?? ''}
            onChange={e => setJuzFilter(e.target.value === '' ? null : Number(e.target.value))}
          >
            <option value="">الكل</option>
            {JUZS.map(j => <option key={j} value={j}>{num(j)}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-1.5 text-sm">
          من سورة
          <select
            className="rounded border border-gray-300 bg-white px-2 py-1 dark:border-white/10 dark:bg-black"
            value={rangeFrom}
            onChange={e => setRangeFrom(Math.min(Number(e.target.value), rangeTo))}
          >
            {chips.map(c => <option key={c.number} value={c.number}>{`${num(c.number)} ${c.plain}`}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-1.5 text-sm">
          إلى سورة
          <select
            className="rounded border border-gray-300 bg-white px-2 py-1 dark:border-white/10 dark:bg-black"
            value={rangeTo}
            onChange={e => setRangeTo(Math.max(Number(e.target.value), rangeFrom))}
          >
            {chips.map(c => <option key={c.number} value={c.number}>{`${num(c.number)} ${c.plain}`}</option>)}
          </select>
        </label>
        {(juzFilter !== null || rangeFrom !== SURAH_MIN || rangeTo !== SURAH_MAX) && (
          <Button size="sm" variant="outline" onClick={() => { setJuzFilter(null); setRangeFrom(SURAH_MIN); setRangeTo(SURAH_MAX); }}>
            إلغاء التصفية
          </Button>
        )}
      </div>
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
        {visibleChips.map(s => {
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
                    {groupByTheme(s.topics).map(g => (
                      <li key={g.id}>
                        <Badge
                          text={g.label}
                          size="sm"
                          color=""
                          className={g.id in THEMES ? colorOf(g.id).badge : NEUTRAL.badge}
                          onClick={() => setOpenTopic({ surah: s.number, themeId: g.id })}
                        />
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
      <TopicOverlay surahName={openChip ? `${num(openChip.number)} ${openChip.plain}` : ''} group={openGroup} onClose={() => setOpenTopic(null)} />
    </div>
  );
}
