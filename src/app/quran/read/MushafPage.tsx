'use client';

import React, { Fragment, useLayoutEffect, useMemo, useRef } from 'react';
import { pageGroups, type MushafPage as MushafPageData } from '@shared/quran/readerPage';
import { isSajda, juzName, quarterLabel } from '@shared/quran/mushafMarks';
import { num } from '@shared/quran/arabicNumber';
import { plainName } from '@shared/quran/normalize';
import styles from './Mushaf.module.css';

const BASMALA = 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ';
/** The end-of-ayah ornament with no number in it (U+06DD in the Hafs font). */
const EMPTY_END = '\u06DD';
const GAP = 0.2;
const SQUEEZE = 0.9;
const STRETCH = 1.15;
/** A full page has 15 lines; a surah title or basmala takes one of them, even on the short opening pages. */
const ONE_LINE = 'calc(100% / 15)';

function fit(body: HTMLElement, centred: boolean) {
  body.style.fontSize = '100px';
  const lines = [...body.querySelectorAll<HTMLElement>('[data-line]')];
  lines.forEach(line => {
    line.style.width = '';
    line.style.transform = '';
  });
  const natural = lines.map(line => {
    const words = [...line.children] as HTMLElement[];
    return Math.max(1, words.reduce((sum, word) => sum + word.offsetWidth, 0) + (words.length - 1) * GAP * 100);
  });
  const width = body.clientWidth;
  const sorted = [...natural].sort((a, b) => a - b);
  const typical = sorted[Math.floor(sorted.length * 0.6)] ?? 1;
  const size = Math.max(1, Math.min((100 * width) / typical, (100 * width) / (Math.max(...natural, 1) * (centred ? 1 : SQUEEZE)), (body.clientHeight / Math.max(1, body.children.length)) * 0.72));
  body.style.fontSize = `${size}px`;
  body.style.setProperty('--one-line', `${body.clientHeight / 15}px`);
  lines.forEach((line, at) => {
    const drawn = (natural[at] * size) / 100;
    const centre = centred || drawn < width * 0.7;
    line.toggleAttribute('data-centred', centre);
    if (centre) return;
    const scale = Math.min(STRETCH, Math.max(SQUEEZE, width / drawn));
    line.style.width = `${width / scale}px`;
    line.style.transform = `scaleX(${scale})`;
  });
}

export default function MushafPage({
  page,
  data,
  names,
  top,
  mark,
  hidden,
  next,
  forgot,
  saved,
  titled,
}: {
  page: number;
  data: MushafPageData;
  names: Record<number, string>;
  top?: number;
  mark?: { surah: number; ayah: number };
  /** Recite mode: whether a word is still hidden; `word` counts that ayah's words on this page from 0. */
  hidden?: (key: string, word: number) => boolean;
  /** Recite mode: the ayah the next reveal shows. */
  next?: string | null;
  /** Ayat the reader forgot (highlighted) and saved (ayah number in purple). */
  forgot?: Readonly<Record<string, unknown>>;
  saved?: ReadonlySet<string>;
  /** Surahs whose title (and basmala, 2 steps) are recite steps of their own: they count as the first words of the surah's first ayah. */
  titled?: ReadonlyMap<number, number>;
}) {
  const body = useRef<HTMLDivElement>(null);
  const lines = useMemo(() => pageGroups(data.items, top), [data, top]);
  const first = data.items[0];
  const current = first && 'surah' in first ? first.surah : top;
  const marked = (surah?: number, ayah?: number) => !!mark && surah === mark.surah && ayah === mark.ayah;
  const counts: Record<string, number> = {};
  /** While reciting, a surah's name stays hidden until its first ayah shows, so the reader recalls which surah comes next. */
  // A titled surah's title (and basmala) are the first words of its first ayah, so that ayah's own words count after them.
  titled?.forEach((steps, surah) => { counts[`${surah}:1`] = steps - 1; });
  const surahHidden = (surah: number) => !!titled?.has(surah) && !!hidden?.(`${surah}:1`, 0);
  const basmalaHidden = (surah: number) => titled?.get(surah) === 2 && !!hidden?.(`${surah}:1`, 1);
  /** The surah whose title comes before each item, for its basmala. */
  const surahOf = data.items.map((_, at) => data.items.slice(0, at + 1).reduceRight<number | undefined>((found, item) => found ?? ('surah' in item ? item.surah : undefined), undefined));
  const firstHidden = (surah: number) => surahHidden(surah) || basmalaHidden(surah);
  const badges = data.items.map(item => [...('quarter' in item && item.quarter ? [quarterLabel(item.quarter)] : []), ...('line' in item && isSajda(item.line) ? [['سجدة']] : [])]);
  useLayoutEffect(() => {
    const element = body.current;
    if (!element) return;
    const run = () => fit(element, page <= 2);
    run();
    document.fonts?.ready.then(run);
    const observer = new ResizeObserver(run);
    observer.observe(element);
    return () => observer.disconnect();
  }, [page, data]);
  return (
    <section aria-label={`الصفحة ${num(page)}`} data-side={page % 2 ? 'right' : 'left'} className={styles.page}>
      <div className={styles.head}>
        <span>الجزء {juzName(data.juz)}</span>
        {badges.some(list => list.length > 0) && (
          <div className={styles.strip}>
            {badges.flat().map(label => (
              <span key={label.join()} className={`${styles.badge} ${label[0] === 'سجدة' ? styles.sajda : ''}`}>
                {label.join(' ')}
              </span>
            ))}
          </div>
        )}
        <span className={current && surahHidden(current) ? styles.veiled : undefined}>{current && names[current] ? plainName(names[current]) : ''}</span>
      </div>
      <div className={styles.frame}>
        <div ref={body} className={styles.body} style={{ gridTemplateRows: data.items.map(item => ('line' in item ? 'minmax(0, 1fr)' : ONE_LINE)).join(' ') }}>
          {data.items.map((item, index) => (
            <div key={index} className={`${styles.row} ${'surah' in item ? styles.titleRow : ''}`}>
              {'surah' in item ? (
                <h2 className={[styles.title, surahHidden(item.surah) ? styles.veiled : '', surahHidden(item.surah) && next === `${item.surah}:1` ? styles.upcoming : ''].join(' ').trim()}>{names[item.surah]}</h2>
              ) : 'basmala' in item ? (
                (() => {
                  const surah = surahOf[index];
                  const veil = surah !== undefined && basmalaHidden(surah);
                  return <p className={styles.basmala}><span className={veil ? [styles.veiled, !surahHidden(surah) && next === `${surah}:1` ? styles.upcoming : ''].join(' ').trim() : undefined}>{BASMALA}</span></p>;
                })()
              ) : (
                <p data-line className={styles.line}>
                  {lines[index]?.map((group, at) => {
                    const on = marked(group.surah, group.ayah);
                    const key = `${group.surah}:${group.ayah}`;
                    const word = group.word ? (counts[key] = (counts[key] ?? -1) + 1) : 0;
                    const veiled = !!hidden?.(key, word);
                    const endHidden = (end: number) => !!hidden?.(`${group.surah}:${end}`, Number.MAX_SAFE_INTEGER);
                    return (
                      <span key={at} data-marked={on || undefined} data-ayah={key} data-veiled={veiled || undefined}
                        className={[on ? styles.marked : '', !veiled && forgot?.[key] ? styles.forgot : ''].join(' ').trim() || undefined}>
                        {/* While hidden, the word and its ayah number are separate boxes, so an empty page still shows where each ayah ends. */}
                        {veiled ? <span className={[styles.veiled, next === key && !(group.ayah === 1 && group.surah !== undefined && firstHidden(group.surah)) ? styles.upcoming : ''].join(' ').trim()}>{group.word}</span> : group.word}
                        {group.marks.map(end => (
                          <Fragment key={end}>
                            {group.word ? ' ' : ''}
                            <span data-veiled={endHidden(end) || undefined} className={[styles.end, marked(group.surah, end) ? styles.endMarked : '', !endHidden(end) && saved?.has(`${group.surah}:${end}`) ? styles.saved : ''].join(' ').trim()}>
                              {/* A hidden ayah's end shows the empty ayah ornament, so the reader sees where each ayah ends. */}
                              {endHidden(end) ? EMPTY_END : num(end)}
                            </span>
                          </Fragment>
                        ))}
                      </span>
                    );
                  })}
                </p>
              )}
              {badges[index].map(label => (
                <span key={label.join()} className={`${styles.badge} ${label[0] === 'سجدة' ? styles.sajda : ''}`}>
                  {label.map(part => (
                    <span key={part} className="block">
                      {part}
                    </span>
                  ))}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className={styles.foot}>{num(page)}</div>
      </div>
    </section>
  );
}
