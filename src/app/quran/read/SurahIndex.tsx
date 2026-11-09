'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';
import { num } from '@shared/quran/arabicNumber';
import { plainName } from '@shared/quran/normalize';
import { juzGroups, parseReference, type IndexSurah } from '@/lib/quran/juzIndex';
import { matchesSurah } from '@/lib/quran/surahSearch';
import { searchable, type AyahSearch } from '@/lib/quran/ayahSearch';
import { preloadQuranSearch, searchQuran } from '@/lib/quran/quranText';
import styles from '@/components/homepage/Home.module.css';
import { useNavigatingRouter } from '@/components/common/NavigationLoader';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const MUTED = 'text-[var(--home-muted)]';
const AROUND = 6;
const DELAY = 100;

/** With `recite`, every link opens the reader in recite mode from that place, and `children` sits above the index. */
export default function SurahIndex({ surahs, fontClass, onNavigate, recite = false, children }: { surahs: IndexSurah[]; fontClass?: string; onNavigate?: () => void; recite?: boolean; children?: React.ReactNode }) {
  const { language, languageLoaded } = useLanguage();
  const ar = !languageLoaded || language === 'ar';
  const n = (value: number) => (ar ? num(value) : String(value));
  const router = useNavigatingRouter();
  const [query, setQuery] = useState('');
  const groups = useMemo(() => juzGroups(surahs), [surahs]);
  const reference = parseReference(query, surahs);
  const from = (surah: number, ayah: number) => (recite ? `?recite=${surah}:${ayah}` : '');
  const referenceHref = reference && `/quran/read/ayah/${reference.surah.number}/${reference.ayah}${from(reference.surah.number, reference.ayah)}`;
  const keep = (surah: IndexSurah) => (reference ? surah.number === reference.surah.number : matchesSurah(surah, query));
  const shown = groups
    .map(group => ({ ...group, entries: group.entries.filter(entry => keep(entry.surah)) }))
    .filter(group => group.entries.length > 0);
  const found = new Set(shown.flatMap(group => group.entries.map(entry => entry.surah.number))).size;
  const name = (surah: IndexSurah) => plainName(surah.name).replace(/^سورة\s*/, '');
  const wordSearch = !reference && searchable(query) ? query.trim() : '';
  const [ayat, setAyat] = useState<AyahSearch & { query: string; failed?: boolean }>({ query: '', total: 0, hits: [] });
  useEffect(() => { if (!onNavigate) preloadQuranSearch(); }, [onNavigate]);
  useEffect(() => {
    if (!wordSearch) return;
    let live = true;
    const timer = setTimeout(() => {
      searchQuran(wordSearch).then(
        result => live && setAyat({ ...result, query: wordSearch }),
        () => live && setAyat({ query: wordSearch, total: 0, hits: [], failed: true }),
      );
    }, DELAY);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [wordSearch]);
  const ayahHits = wordSearch && ayat.query === wordSearch ? ayat : null;
  const byNumber = new Map(surahs.map(surah => [surah.number, surah]));

  return (
    <div dir={ar ? 'rtl' : 'ltr'} lang={ar ? 'ar' : 'en'} className={`${styles.page} ${fontClass ?? ''} ${onNavigate ? 'p-4' : 'max-w-6xl mx-auto px-4 py-8 sm:px-8'}`}>
      <header className={onNavigate ? 'mb-3' : 'mb-6 border-b border-[var(--home-rule)] pb-6'}>
        {!onNavigate && <>
          <p className="text-sm text-[var(--home-accent)]">{ar ? 'القرآن' : 'Quran'}</p>
          <h1 className="text-3xl sm:text-4xl leading-normal">{recite ? (ar ? 'التسميع' : 'Recite') : ar ? 'فهرس السور' : 'Index of surahs'}</h1>
          <p className={`${MUTED} mb-5`}>
            {recite ? (ar
              ? 'اختر سورة أو جزءًا أو آية. تُخفى الآيات في مواضعها من الصفحة، وتُظهر كل لمسة الآية التالية.'
              : 'Pick a surah, a juz\' or an ayah. The ayat are hidden in their places on the page, and each tap reveals the next one.') : ar
              ? `السور الـ${num(surahs.length)} مرتبة في أجزائها الثلاثين. تظهر السورة في كل جزء لها فيه آيات. النص برواية حفص.`
              : `The ${surahs.length} surahs in their thirty juz'. A surah is listed under every juz' it has ayat in. The text is in Hafs.`}
          </p>
          {children}
        </>}
        <form
          role="search"
          onSubmit={event => {
            event.preventDefault();
            if (referenceHref) {
              onNavigate?.();
              router.push(referenceHref);
            }
          }}
        >
          <label className="flex max-w-md items-center gap-3 border-b border-[var(--home-rule)] pb-1 focus-within:border-[var(--home-accent)]">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[var(--home-accent)]" aria-hidden />
            <input
              id={onNavigate ? undefined : 'quran-search'}
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder={ar ? 'سورة باسمها أو رقمها، أو آية برقمها (٢:٢٥٥) أو بكلماتها' : 'A surah by name or number, or an ayah by number (2:255) or Arabic words'}
              aria-label={ar ? 'ابحث عن سورة أو آية' : 'Search surahs or ayat'}
              className="w-full scroll-mt-16 bg-transparent py-1 text-lg outline-none placeholder:text-[var(--home-muted)]"
            />
          </label>
        </form>
        {reference && referenceHref && (
          <Button onClick={onNavigate} href={referenceHref} className="mt-3">
            <FontAwesomeIcon icon={faBookOpen} aria-hidden />
            {ar ? `افتح ${name(reference.surah)} ${num(reference.ayah)}` : `Open ${reference.surah.nameTransliterated || name(reference.surah)} ${reference.ayah}`}
          </Button>
        )}
        {wordSearch && found === 0 && !ayahHits && <LoadingSpinner size="sm" className="mt-2 justify-start" />}
        {wordSearch && found === 0 && ayahHits && (
          <p className={`${MUTED} mt-2 text-sm`} aria-live="polite">
            {ayahHits.failed
                ? ar ? 'تعذّر البحث في الآيات الآن.' : 'The ayat could not be searched just now.'
                : ayahHits.total === 0
                  ? ar ? 'لا توجد سورة ولا آية بهذا النص.' : 'No surah or ayah matches that text.'
                  : null}
          </p>
        )}
        {query.trim() && !reference && !(wordSearch && found === 0) && (
          <p className={`${MUTED} mt-2 text-sm`} aria-live="polite">
            {found === 0
              ? ar ? 'لا توجد سورة بهذا الاسم أو الرقم.' : 'No surah matches that name or number.'
              : ar ? `${num(found)} من ${num(surahs.length)} سورة` : `${found} of ${surahs.length} surahs`}
          </p>
        )}
      </header>
      {ayahHits && ayahHits.total > 0 && (
        <section aria-label={ar ? 'آيات' : 'Ayat'} className="mb-8">
          <h2 className={`${MUTED} mb-2`} aria-live="polite">
            {ar ? `${num(ayahHits.total)} آية فيها «` : `${ayahHits.total} ayat contain "`}
            <bdi lang="ar">{wordSearch}</bdi>
            {ar
              ? `»${ayahHits.total > ayahHits.hits.length ? `، أول ${num(ayahHits.hits.length)} منها` : ''}`
              : `"${ayahHits.total > ayahHits.hits.length ? `, the first ${ayahHits.hits.length} shown` : ''}`}
          </h2>
          <ol className="divide-y divide-[var(--home-rule)] border-y border-[var(--home-rule)]">
            {ayahHits.hits.map(hit => {
              const [surah, ayah] = hit.key.split(':').map(Number);
              const start = Math.max(0, hit.from - AROUND);
              const end = Math.min(hit.words.length, hit.to + 1 + AROUND);
              const owner = byNumber.get(surah);
              return (
                <li key={hit.key}>
                  <Link onClick={onNavigate} href={`/quran/read/ayah/${surah}/${ayah}${from(surah, ayah)}`} className="group flex flex-wrap items-baseline gap-x-4 py-2">
                    <span className="w-28 shrink-0 text-sm text-[var(--home-accent)]">
                      {owner ? (ar ? name(owner) : owner.nameTransliterated || name(owner)) : n(surah)} {n(ayah)}
                    </span>
                    <span dir="rtl" lang="ar" className="min-w-0 flex-1 text-xl leading-loose group-hover:underline underline-offset-8 decoration-[var(--home-rule)]">
                      {start > 0 && '… '}
                      {hit.words.slice(start, end).map((word, at) => {
                        const index = start + at;
                        const inside = index >= hit.from && index <= hit.to;
                        return (
                          <React.Fragment key={index}>
                            {inside ? <mark className="bg-transparent text-[var(--home-accent)]">{word}</mark> : word}{' '}
                          </React.Fragment>
                        );
                      })}
                      {end < hit.words.length && '…'}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      )}
      {(!onNavigate || query.trim()) && <div className={onNavigate ? undefined : "columns-1 gap-10 sm:columns-2 lg:columns-3"}>
        {shown.map(group => (
          <section key={group.juz} aria-label={ar ? `الجزء ${num(group.juz)}` : `Juz' ${group.juz}`} className="mb-6 break-inside-avoid">
            <h2 className="flex items-baseline justify-between border-b border-[var(--home-rule)] pb-1">
              <Link onClick={onNavigate} href={`/quran/read/${group.page}${from(group.surah, group.ayah)}`} className="text-xl text-[var(--home-accent)] hover:underline underline-offset-4">
                {ar ? `الجزء ${num(group.juz)}` : `Juz' ${group.juz}`}
              </Link>
              <span className={`${MUTED} text-sm`}>{ar ? `ص ${num(group.page)}` : `p. ${group.page}`}</span>
            </h2>
            <ol className="mt-1">
              {group.entries.map(({ surah, from: first, page }) => (
                <li key={surah.number}>
                  <Link onClick={onNavigate} href={`/quran/read/${page}${from(surah.number, first)}`} className="group flex items-baseline gap-2 py-1">
                    <span className="w-8 shrink-0 text-sm text-[var(--home-accent)] tabular-nums">{n(surah.number)}</span>
                    <span className="text-lg group-hover:text-[var(--home-accent)] group-hover:underline underline-offset-4">
                      {ar ? name(surah) : surah.nameTransliterated || name(surah)}
                    </span>
                    {!ar && surah.nameTransliterated && <span className={`${MUTED} text-sm`} lang="ar">{name(surah)}</span>}
                    {first > 1 && (
                      <span className={`${MUTED} text-sm`}>{ar ? `من الآية ${num(first)}` : `from ayah ${first}`}</span>
                    )}
                    <span className="min-w-4 flex-1 border-b border-dotted border-[var(--home-rule)]" aria-hidden />
                    <span className={`${MUTED} text-sm tabular-nums`}>{n(page)}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>}
    </div>
  );
}
