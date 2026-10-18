'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '@/components/language/LanguageContext';
import { num } from '@/lib/quran/arabicNumber';
import { plainName } from '@/lib/quran/normalize';
import { juzGroups, matchesSurah, type IndexSurah } from '@/lib/quran/juzIndex';
import styles from '@/components/homepage/Home.module.css';

const MUTED = 'text-[var(--home-muted)]';

export default function SurahIndex({ surahs, fontClass }: { surahs: IndexSurah[]; fontClass?: string }) {
  const { language, languageLoaded } = useLanguage();
  const ar = !languageLoaded || language === 'ar';
  const n = (value: number) => (ar ? num(value) : String(value));
  const [query, setQuery] = useState('');
  const groups = useMemo(() => juzGroups(surahs), [surahs]);
  const shown = groups
    .map(group => ({ ...group, entries: group.entries.filter(entry => matchesSurah(entry.surah, query)) }))
    .filter(group => group.entries.length > 0);
  const found = new Set(shown.flatMap(group => group.entries.map(entry => entry.surah.number))).size;
  const name = (surah: IndexSurah) => plainName(surah.name).replace(/^سورة\s*/, '');

  return (
    <div dir={ar ? 'rtl' : 'ltr'} lang={ar ? 'ar' : 'en'} className={`${styles.page} ${fontClass ?? ''} max-w-6xl mx-auto px-4 py-8 sm:px-8`}>
      <header className="mb-6 border-b border-[var(--home-rule)] pb-6">
        <p className="text-sm text-[var(--home-accent)]">{ar ? 'القرآن' : 'Quran'}</p>
        <h1 className="text-3xl sm:text-4xl leading-normal">{ar ? 'فهرس السور' : 'Index of surahs'}</h1>
        <p className={`${MUTED} mb-5`}>
          {ar
            ? `السور الـ${num(surahs.length)} مرتبة في أجزائها الثلاثين. تظهر السورة في كل جزء لها فيه آيات. النص برواية حفص.`
            : `The ${surahs.length} surahs in their thirty juz'. A surah is listed under every juz' it has ayat in. The text is in Hafs.`}
        </p>
        <label className="flex max-w-md items-center gap-3 border-b border-[var(--home-rule)] pb-1 focus-within:border-[var(--home-accent)]">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[var(--home-accent)]" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder={ar ? 'ابحث باسم السورة أو رقمها' : 'Search by surah name or number'}
            aria-label={ar ? 'ابحث عن سورة' : 'Search surahs'}
            className="w-full bg-transparent py-1 text-lg outline-none placeholder:text-[var(--home-muted)]"
          />
        </label>
        {query.trim() && (
          <p className={`${MUTED} mt-2 text-sm`} aria-live="polite">
            {found === 0
              ? ar ? 'لا توجد سورة بهذا الاسم أو الرقم.' : 'No surah matches that name or number.'
              : ar ? `${num(found)} من ${num(surahs.length)} سورة` : `${found} of ${surahs.length} surahs`}
          </p>
        )}
      </header>
      <div className="columns-1 gap-10 sm:columns-2 lg:columns-3">
        {shown.map(group => (
          <section key={group.juz} aria-label={ar ? `الجزء ${num(group.juz)}` : `Juz' ${group.juz}`} className="mb-6 break-inside-avoid">
            <h2 className="flex items-baseline justify-between border-b border-[var(--home-rule)] pb-1">
              <Link href={`/quran/read/${group.page}`} className="text-xl hover:text-[var(--home-accent)]">
                {ar ? `الجزء ${num(group.juz)}` : `Juz' ${group.juz}`}
              </Link>
              <span className={`${MUTED} text-sm`}>{ar ? `ص ${num(group.page)}` : `p. ${group.page}`}</span>
            </h2>
            <ol className="mt-1">
              {group.entries.map(({ surah, from, page }) => (
                <li key={surah.number}>
                  <Link href={`/quran/read/${page}`} className="group flex items-baseline gap-2 py-1">
                    <span className="w-8 shrink-0 text-sm text-[var(--home-accent)] tabular-nums">{n(surah.number)}</span>
                    <span className="text-lg group-hover:text-[var(--home-accent)] group-hover:underline underline-offset-4">
                      {ar ? name(surah) : surah.nameTransliterated || name(surah)}
                    </span>
                    {!ar && surah.nameTransliterated && <span className={`${MUTED} text-sm`} lang="ar">{name(surah)}</span>}
                    {from > 1 && (
                      <span className={`${MUTED} text-sm`}>{ar ? `من الآية ${num(from)}` : `from ayah ${from}`}</span>
                    )}
                    <span className="min-w-4 flex-1 border-b border-dotted border-[var(--home-rule)]" aria-hidden />
                    <span className={`${MUTED} text-sm tabular-nums`}>{n(page)}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
