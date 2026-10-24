import { Fragment } from 'react';
import { num } from '@/lib/quran/arabicNumber';
import styles from './PageSpread.module.css';

export type SpreadMark = { kind: 'exact' | 'root' | 'node'; node?: boolean; slot?: number; linked?: boolean; title?: string };
export type SpreadAyah = { number: number; words: string[]; marks?: Record<number, SpreadMark>; current?: boolean };
export type SpreadPage = { title: string; subtitle?: string; label?: string; rows: SpreadAyah[][] };

const markClass = (mark: SpreadMark) => [mark.kind === 'root' && styles.root, mark.kind === 'node' && styles.plain, (mark.node || mark.kind === 'node') && styles.node, mark.slot && styles[`slot${((mark.slot - 1) % 4) + 1}`], mark.linked && styles.linked].filter(Boolean).join(' ') || undefined;

function Ayah({ ayah }: { ayah: SpreadAyah }) {
  const last = ayah.words.length - 1;
  return ayah.words.map((word, index) => {
    const mark = ayah.marks?.[index];
    const text = mark ? <mark className={markClass(mark)} title={mark.title}>{word}</mark> : word;
    return <Fragment key={index}>{index > 0 && ' '}{index === last ? <span className={styles.verseEnd}>{text}{' '}<span className={styles.verseSeal}>{num(ayah.number)}</span></span> : text}</Fragment>;
  });
}

export function MatchLegend({ exact, root }: { exact: string; root: string }) {
  return (
    <p className={styles.legend}>
      <span><mark>{exact}</mark></span>
      <span><mark className={styles.root}>{root}</mark></span>
    </p>
  );
}

export default function PageSpread({ pages, ruled = false }: { pages: (SpreadPage | null)[]; ruled?: boolean }) {
  const rows = Math.max(...pages.map(page => page?.rows.length ?? 0));
  return (
    <div className={`${styles.spread} ${ruled ? styles.ruled : ''}`} dir="rtl">
      {pages.map((page, k) => !page ? <div key={k} /> : (
        <article key={k} className={styles.page} style={{ gridRow: `span ${rows + 1}` }} aria-label={page.label ?? page.title}>
          <header><h3>{page.title}</h3>{page.subtitle && <p dir="auto">{page.subtitle}</p>}</header>
          <div className={styles.lines} lang="ar">
            {Array.from({ length: rows }, (_, row) => (
              <p key={row} data-current={page.rows[row]?.some(ayah => ayah.current) || undefined}>{(page.rows[row] ?? []).map((ayah, i) => <Fragment key={ayah.number}>{i > 0 && ' '}<Ayah ayah={ayah} /></Fragment>)}</p>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
