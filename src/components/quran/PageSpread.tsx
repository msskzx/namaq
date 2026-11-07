import React, { Fragment } from 'react';
import MushafText from '@/components/common/MushafText';
import { num } from '@/lib/quran/arabicNumber';
import styles from './PageSpread.module.css';

/** `link` names the matched pair a word belongs to; `lit` shows it while its pair is selected. */
export type SpreadMark = { kind: 'exact' | 'root' | 'related'; slot?: number; title?: string; link?: string; lit?: boolean };
export type SpreadAyah = { number: number; words: string[]; marks?: Record<number, SpreadMark>; wordKey?: string; current?: boolean; bare?: boolean };
export type SpreadPage = { title: string; subtitle?: string; label?: string; rows: SpreadAyah[][]; footer?: React.ReactNode; action?: React.ReactNode };

const markClass = (mark: SpreadMark) => [mark.kind === 'root' && styles.root, mark.kind === 'related' && styles.related, mark.slot && styles[`slot${((mark.slot - 1) % 4) + 1}`], mark.link && styles.linkable, mark.lit && styles.lit].filter(Boolean).join(' ') || undefined;

function Ayah({ ayah }: { ayah: SpreadAyah }) {
  const last = ayah.words.length - 1;
  return ayah.words.map((word, index) => {
    const mark = ayah.marks?.[index];
    const wordText = mark ? <mark className={markClass(mark)} title={mark.title} data-link={mark.link} data-lit={mark.lit || undefined}><MushafText>{word}</MushafText></mark> : <MushafText>{word}</MushafText>;
    const text = ayah.wordKey
      ? <span data-word-position={`${ayah.wordKey}:${index}`}>{wordText}</span>
      : wordText;
    return <Fragment key={index}>{index > 0 && ' '}{index === last && !ayah.bare ? <span className={styles.verseEnd}>{text}{' '}<span className={styles.verseSeal}>{num(ayah.number)}</span></span> : text}</Fragment>;
  });
}

export function MatchLegend({ exact, root }: { exact?: string; root?: string }) {
  return (
    <p className={styles.legend}>
      {exact && <span><mark>{exact}</mark></span>}
      {root && <span><mark className={styles.root}>{root}</mark></span>}
    </p>
  );
}

export default function PageSpread({ pages, ruled = false, stackOnMobile = false, compact = false }: { pages: (SpreadPage | null)[]; ruled?: boolean; stackOnMobile?: boolean; compact?: boolean }) {
  const rows = Math.max(...pages.map(page => page?.rows.length ?? 0));
  return (
    <div className={`${styles.spread} ${ruled ? styles.ruled : ''} ${stackOnMobile ? styles.stackOnMobile : ''} ${compact ? styles.compact : ''}`} dir="rtl">
      {pages.map((page, k) => !page ? <div key={k} /> : (
        <article key={k} className={styles.page} style={{ gridRow: `span ${rows + (page.footer ? 2 : 1)}` }} aria-label={page.label ?? page.title}>
          <header className={page.action ? styles.withAction : undefined}><h3>{page.title}</h3>{page.subtitle && <p dir="auto">{page.subtitle}</p>}{page.action && <span className={styles.action}>{page.action}</span>}</header>
          <div className={styles.lines} lang="ar">
            {Array.from({ length: rows }, (_, row) => (
              <p key={row} data-current={page.rows[row]?.some(ayah => ayah.current) || undefined}>{(page.rows[row] ?? []).map((ayah, i) => <Fragment key={ayah.number}>{i > 0 && ' '}<Ayah ayah={ayah} /></Fragment>)}</p>
            ))}
          </div>
          {page.footer}
        </article>
      ))}
    </div>
  );
}
