'use client';

import React, { useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faList } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/common/Button';
import { pageGroups, type ReaderPageData } from '@/lib/quran/readerPage';
import { num } from '@/lib/quran/arabicNumber';
import { plainName } from '@/lib/quran/normalize';
import { useLanguage } from '@/components/language/LanguageContext';
import styles from '@/components/homepage/Home.module.css';
import FitLines from './FitLines';
import JumpForm from './JumpForm';

const BASMALA = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

const hasBasmala = (surah: number) => surah !== 1 && surah !== 9;

const MARK =
  'mx-1 inline-flex h-[2.4em] w-[2.4em] items-center justify-center rounded-full border border-[var(--home-rule)] align-middle text-[0.5em] text-[var(--home-muted)]';

export default function ReaderView({
  page,
  data,
  names,
  top,
  mark,
  fontClass,
}: {
  page: number;
  data: ReaderPageData;
  names: Record<number, string>;
  top?: number;
  mark?: { surah: number; ayah: number };
  fontClass?: string;
}) {
  const { language, languageLoaded } = useLanguage();
  const ar = !languageLoaded || language === 'ar';
  const small = page <= 2;
  const opens = 'surah' in (data.items[0] ?? {});
  const current = opens ? (data.items[0] as { surah: number }).surah : top;
  const title = current && names[current] ? plainName(names[current]).replace(/^سورة\s*/, '') : '';
  const lines = useMemo(() => pageGroups(data.items, top), [data, top]);
  const marked = (surah?: number, ayah?: number) => !!mark && surah === mark.surah && ayah === mark.ayah;
  useEffect(() => {
    document.querySelector('[data-marked]')?.scrollIntoView?.({ block: 'center' });
  }, [mark?.surah, mark?.ayah]);
  return (
    <div dir={ar ? 'rtl' : 'ltr'} lang={ar ? 'ar' : 'en'} className={`${styles.page} ${fontClass ?? ''} max-w-3xl mx-auto px-4 py-6`}>
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--home-muted)]">
          {ar ? 'برواية حفص' : 'In the reading of Hafs'}
        </p>
        <JumpForm />
      </header>
      <article dir="rtl" lang="ar">
        <section
          aria-label={ar ? `الصفحة ${num(page)}` : `Page ${page}`}
          className={`[container-type:inline-size] border-4 border-double border-[var(--home-rule)] bg-[var(--home-paper-deep)] px-5 pt-3 pb-3 ${
            small ? 'mx-auto max-w-md rounded-[2rem]' : ''
          }`}
        >
          <div className="mb-2 flex justify-between border-b border-[var(--home-rule)] pb-1 text-sm text-[var(--home-muted)]">
            <span>{title}</span>
            <span>الجزء {num(data.juz)}</span>
          </div>
          <FitLines key={page}>
            {data.items.map((item, index) =>
              'surah' in item ? (
                <div key={index} className="my-2 border-y border-[var(--home-rule)] py-1 text-center">
                  <h2 className="text-xl text-[var(--home-accent)]">{names[item.surah]}</h2>
                  {hasBasmala(item.surah) && <p className="text-2xl leading-loose">{BASMALA}</p>}
                </div>
              ) : (
                <p
                  key={index}
                  data-line
                  className={`flex whitespace-nowrap leading-[2.2] ${
                    small || item.short ? 'justify-center gap-x-[0.4em]' : 'justify-between'
                  }`}
                >
                  {lines[index]?.map((group, at) => {
                    const on = marked(group.surah, group.ayah);
                    return (
                      <span key={at} data-marked={on || undefined} className={on ? 'text-[var(--home-accent)]' : undefined}>
                        {group.word}
                        {group.marks.map((end) => (
                          <span
                            key={end}
                            className={`${MARK} ${marked(group.surah, end) ? 'bg-[var(--home-accent)] text-[var(--home-paper)]!' : ''}`}
                          >
                            {num(end)}
                          </span>
                        ))}
                      </span>
                    );
                  })}
                </p>
              ),
            )}
          </FitLines>
          <p className="mt-3 border-t border-[var(--home-rule)] pt-2 text-center text-sm text-[var(--home-muted)]">
            {num(page)}
          </p>
        </section>
      </article>
      <nav
        aria-label={ar ? 'التنقل بين الصفحات' : 'Page navigation'}
        className="mt-4 flex flex-wrap items-center justify-center gap-3"
      >
        {page > 1 && (
          <Button size="sm" href={`/quran/read/${page - 1}`}>
            <FontAwesomeIcon icon={ar ? faArrowRight : faArrowLeft} aria-hidden />
            {ar ? 'الصفحة السابقة' : 'Previous page'}
          </Button>
        )}
        <Button size="sm" href="/quran/read">
          <FontAwesomeIcon icon={faList} aria-hidden />
          {ar ? 'فهرس السور' : 'Index of surahs'}
        </Button>
        {page < 604 && (
          <Button size="sm" href={`/quran/read/${page + 1}`}>
            {ar ? 'الصفحة التالية' : 'Next page'}
            <FontAwesomeIcon icon={ar ? faArrowLeft : faArrowRight} aria-hidden />
          </Button>
        )}
      </nav>
    </div>
  );
}
