'use client';

import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { pageGroups, type MushafPage as MushafPageData } from '@/lib/quran/readerPage';
import { isSajda, juzName, quarterLabel } from '@/lib/quran/mushafMarks';
import { num } from '@/lib/quran/arabicNumber';
import { plainName } from '@/lib/quran/normalize';
import styles from './Mushaf.module.css';

const BASMALA = 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ';
const GAP = 0.2;
const SQUEEZE = 0.9;
const STRETCH = 1.15;

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
}: {
  page: number;
  data: MushafPageData;
  names: Record<number, string>;
  top?: number;
  mark?: { surah: number; ayah: number };
}) {
  const body = useRef<HTMLDivElement>(null);
  const lines = useMemo(() => pageGroups(data.items, top), [data, top]);
  const first = data.items[0];
  const current = first && 'surah' in first ? first.surah : top;
  const marked = (surah?: number, ayah?: number) => !!mark && surah === mark.surah && ayah === mark.ayah;
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
      {badges.some(list => list.length > 0) && (
        <div className={styles.strip}>
          {badges.flat().map(label => (
            <span key={label.join()} className={`${styles.badge} ${label[0] === 'سجدة' ? styles.sajda : ''}`}>
              {label.join(' ')}
            </span>
          ))}
        </div>
      )}
      <div className={styles.head}>
        <span>الجزء {juzName(data.juz)}</span>
        <span>{current && names[current] ? plainName(names[current]) : ''}</span>
      </div>
      <div className={styles.frame}>
        <div ref={body} className={styles.body} style={{ gridTemplateRows: `repeat(${data.items.length}, minmax(0, 1fr))` }}>
          {data.items.map((item, index) => (
            <div key={index} className={`${styles.row} ${'surah' in item ? styles.titleRow : ''}`}>
              {'surah' in item ? (
                <h2 className={styles.title}>{names[item.surah]}</h2>
              ) : 'basmala' in item ? (
                <p className={styles.basmala}>{BASMALA}</p>
              ) : (
                <p data-line className={styles.line}>
                  {lines[index]?.map((group, at) => {
                    const on = marked(group.surah, group.ayah);
                    return (
                      <span key={at} data-marked={on || undefined} className={on ? styles.marked : undefined}>
                        {group.word}
                        {group.marks.map(end => (
                          <span key={end} className={`${styles.end} ${marked(group.surah, end) ? styles.endMarked : ''}`}>
                            {group.word ? ' ' : ''}
                            {num(end)}
                          </span>
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
