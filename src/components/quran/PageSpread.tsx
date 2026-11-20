import React, { Fragment } from 'react';
import MushafText from '@/components/common/MushafText';
import Rope from '@/components/common/Rope';
import { num } from '@shared/quran/arabicNumber';
import styles from './PageSpread.module.css';
import { LEGEND_SOURCE, MARK_LEGEND } from '@shared/quran/wordMatch';
import { QuranWord } from '@/components/quran/text/AyahFlow';

/** `link` names the matched pair a word belongs to; `lit` shows it while its pair is selected. */
/** `some`: a word only some of the rows share, drawn faded. */
export type SpreadMark = { kind: 'exact' | 'written' | 'root' | 'related'; slot?: number; title?: string; link?: string; lit?: boolean; some?: boolean };
/** `muted`: an ayah shown only for context (the ayah before or after), drawn quieter. */
export type SpreadAyah = { number: number; words: string[]; marks?: Record<number, SpreadMark>; wordKey?: string; current?: boolean; bare?: boolean; reading?: number; muted?: boolean;
  /** The studio's growing ayah: only its first `shown` words show, the rest keep their place unseen. */
  shown?: number };
/** `empty`: what a row this page has no ayat for says, so the gap reads as the text's own and not a failed load. `heads`: a control sitting on a row's top rule, and `ruleLabels` a name in the rule's middle. `bare`: a folded row, showing only those. */
export type RowHead = React.ReactNode | undefined;
export type SpreadPage = { title: string; subtitle?: string; label?: string; rows: SpreadAyah[][]; empty?: string; heads?: RowHead[]; ruleLabels?: (string | undefined)[]; bare?: boolean[]; gaps?: boolean; gapsLabel?: string; footer?: React.ReactNode; action?: React.ReactNode; pick?: { selected: number; labels: string[]; onPick: (row: number) => void } };

const markClass = (mark: SpreadMark) => [mark.kind === 'written' && styles.written, mark.kind === 'root' && styles.root, mark.kind === 'related' && styles.related, mark.some && styles.some, mark.slot && styles[`slot${((mark.slot - 1) % 4) + 1}`], mark.link && styles.linkable, mark.lit && styles.lit].filter(Boolean).join(' ') || undefined;

function Ayah({ ayah }: { ayah: SpreadAyah }) {
  const last = ayah.words.length - 1;
  return ayah.words.map((word, index) => {
    const mark = ayah.marks?.[index];
    const reading = index === ayah.reading;
    const wordText = mark
      ? <mark className={[markClass(mark), reading && styles.reading].filter(Boolean).join(' ') || undefined} title={mark.title} data-link={mark.link} data-lit={mark.lit || undefined} data-reading={reading || undefined}><MushafText>{word}</MushafText></mark>
      : reading ? <span className={styles.reading} data-reading><MushafText>{word}</MushafText></span> : <MushafText>{word}</MushafText>;
    const unseen = ayah.shown !== undefined && index >= ayah.shown;
    const text = ayah.wordKey
      ? <span data-word-position={`${ayah.wordKey}:${index}`} className={unseen ? styles.unseen : undefined}>{wordText}</span>
      : unseen ? <span className={styles.unseen}>{wordText}</span> : wordText;
    return <Fragment key={index}>{index > 0 && ' '}{index === last && !ayah.bare ? <span className={styles.verseEnd}>{text}{' '}<span className={`${styles.verseSeal} ${unseen ? styles.unseen : ''}`}>{num(ayah.number)}</span></span> : text}</Fragment>;
  });
}

/** With `gaps`, a row whose ayat skip part of the surah opens each unbroken stretch on a dotted line naming its ayat; a row under its own rule (`onRule`) always names its first stretch on that rule. */
function RowAyat({ ayat, gaps = false, onRule = false, label = '' }: { ayat: SpreadAyah[]; gaps?: boolean; onRule?: boolean; label?: string }) {
  const starts = ayat.flatMap((ayah, i) => (i === 0 || ayah.number !== ayat[i - 1].number + 1 ? [i] : []));
  const broken = gaps && starts.length > 1;
  return ayat.map((ayah, i) => {
    const run = starts.indexOf(i);
    const last = run >= 0 ? ayat[(starts[run + 1] ?? ayat.length) - 1].number : 0;
    return <Fragment key={ayah.number}>
      {(broken && run >= 0) || (onRule && run === 0) ? <span role="separator" aria-label={`${label} ${num(ayah.number)}${last > ayah.number ? `–${num(last)}` : ''}`.trim()} className={run > 0 ? styles.gap : onRule ? styles.gapOnRule : `${styles.gap} ${styles.gapFirst}`}>{num(ayah.number)}{last > ayah.number ? `–${num(last)}` : ''}</span> : i > 0 && ' '}
      {ayah.muted ? <span className={styles.mutedAyah}><Ayah ayah={ayah} /></span> : <Ayah ayah={ayah} />}
    </Fragment>;
  });
}

/** The colour of each likeness (MARK_LEGEND) under the colour setting, with the kind of difference the books name for it. */
export function MatchLegend({ ar, extra }: { ar: boolean; extra?: React.ReactNode }) {
  return (
    <div className={styles.legend}>
      <ul>
        {MARK_LEGEND.map(item => (
          <li key={item.kind}>
            {item.kind === 'plain' ? <QuranWord className={styles.legendWord}>{item.word}</QuranWord> : <mark className={`${styles[item.kind] ?? ''} ${styles.legendWord}`}><QuranWord>{item.word}</QuranWord></mark>}
            <span>{ar ? item.ar : item.en}</span>
          </li>
        ))}
        {extra}
      </ul>
      <p>{ar ? LEGEND_SOURCE.ar : LEGEND_SOURCE.en}</p>
    </div>
  );
}

export default function PageSpread({ pages, ruled = false, stackOnMobile = false, compact = false, single = false, fillReading = false }: { pages: (SpreadPage | null)[]; ruled?: boolean; stackOnMobile?: boolean; compact?: boolean; single?: boolean;
  /** The word read is filled with the highlight (the matrix's read-along), not underlined (compare's). */
  fillReading?: boolean }) {
  const rows = Math.max(...pages.map(page => page?.rows.length ?? 0));
  // Beside a stack of rows to pick from, the other side is one cell, so a long ayah does not push the stack's rows apart.
  const stacked = pages.some(page => page?.pick);
  return (
    <div className={`${styles.spread} ${ruled ? styles.ruled : ''} ${stackOnMobile ? styles.stackOnMobile : ''} ${compact ? styles.compact : ''} ${single ? styles.single : ''} ${fillReading ? styles.fillReading : ''}`} dir="rtl">
      {pages.map((page, k) => !page ? <div key={k} /> : (
        <article key={k} className={styles.page} style={{ gridRow: `span ${rows + (page.footer ? 2 : 1)}` }} aria-label={page.label ?? page.title}>
          <header className={page.action ? styles.withAction : undefined}><h3>{page.title}</h3>{page.subtitle && <p dir="auto">{page.subtitle}</p>}{page.action && <span className={styles.action}>{page.action}</span>}</header>
          <div className={styles.lines} lang="ar">
            {Array.from({ length: stacked && !page.pick ? 1 : rows }, (_, row) => {
              const onRule = ruled && (row > 0 || compact);
              const silent = page.empty && page.rows[row]?.length === 0 && !page.bare?.[row];
              return <p key={row} style={stacked && !page.pick ? { gridRow: `span ${rows}` } : undefined} className={[page.pick && row > 0 && page.rows[row] ? styles.pickDivider : silent ? styles.emptyCell : undefined, page.heads?.[row] && styles.headed].filter(Boolean).join(' ') || undefined} data-current={page.rows[row]?.some(ayah => ayah.current) || undefined}>
                {page.heads?.[row] && <span className={styles.rowHead}>{page.heads[row]}</span>}
                {page.ruleLabels?.[row] && <span aria-hidden className={styles.gapOnRule}>{page.ruleLabels[row]}</span>}
                {page.pick && page.rows[row]
                  ? <button type="button" data-tap-through className={styles.pick} aria-pressed={page.pick.selected === row} onClick={() => page.pick!.onPick(row)}><span className="sr-only">{page.pick.labels[row]}: </span><RowAyat ayat={page.rows[row]} gaps={page.gaps} onRule={onRule} label={page.gapsLabel} /></button>
                  : page.bare?.[row] ? null
                  : silent ? <span className={styles.emptyRow}><Rope className={styles.rope} />{page.empty}<Rope className={styles.rope} /></span> : <RowAyat ayat={page.rows[row] ?? []} gaps={page.gaps} onRule={onRule} label={page.gapsLabel} />}
              </p>;
            })}
          </div>
          {page.footer}
        </article>
      ))}
    </div>
  );
}
