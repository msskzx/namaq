'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faSitemap, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '@/components/language/LanguageContext';
import GraphSearch from '@/components/graph/GraphSearch';
import Button from '@/components/common/Button';
import Toggle from '@/components/common/Toggle';
import NasabPlot from './NasabPlot';
import { givenName, layoutNasab, type NasabPerson } from '@/lib/relationship/nasabLayout';

const QUICK_PICKS = [
  { slug: 'prophet-muhammad', en: 'The Prophet ﷺ', ar: 'النبي ﷺ' },
  { slug: 'abu-bakr-as-siddiq', en: 'Abu Bakr', ar: 'أبو بكر' },
  { slug: 'umar-ibn-al-khattab', en: 'Umar', ar: 'عمر' },
  { slug: 'uthman-ibn-affan', en: 'Uthman', ar: 'عثمان' },
  { slug: 'ali-ibn-abi-talib', en: 'Ali', ar: 'علي' },
];

interface Fetched {
  key: string;
  people: NasabPerson[];
  subjects: string[];
}

// See docs/plans/nasab-plot.md.
export default function NasabView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const subjects = useMemo(
    () => (searchParams?.getAll('subject') ?? []).filter((id) => id.startsWith('person:')).map((id) => id.slice('person:'.length)),
    [searchParams],
  );
  const descendants = searchParams?.get('descendants') === '1';
  const key = `${subjects.join(',')}|${descendants}`;
  const [fetched, setFetched] = useState<Fetched | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (subjects.length === 0) return;
    let cancelled = false;
    setFailed(false);
    const query = subjects.map((slug) => `person=${encodeURIComponent(slug)}`).join('&');
    fetch(`/api/nasab?${query}${descendants ? '&descendants=1' : ''}`)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
      .then((data) => {
        if (cancelled) return;
        setFailed(false);
        setFetched({ key, people: data.people, subjects: data.subjects });
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [key, subjects, descendants]);

  const current = fetched?.key === key ? fetched : null;
  const layout = useMemo(() => (current ? layoutNasab(current.people, current.subjects) : null), [current]);
  const names = useMemo(() => new Map(current?.people.map((person) => [person.slug, person.name])), [current]);

  const navigate = (change: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    change(params);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };
  const setSubjects = (next: string[]) =>
    navigate((params) => {
      params.delete('subject');
      next.forEach((slug) => params.append('subject', `person:${slug}`));
    });
  const setDescendants = (on: boolean) => navigate((params) => (on ? params.set('descendants', '1') : params.delete('descendants')));
  const sideLabel = (on: boolean) => 'cursor-pointer ' + (on ? 'font-semibold text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400');
  const toggle = (slug: string) => setSubjects(subjects.includes(slug) ? subjects.filter((s) => s !== slug) : [...subjects, slug]);

  const nameOf = (slug: string) => names.get(slug) ?? slug;
  const missing = current ? subjects.filter((slug) => !current.subjects.includes(slug)) : [];
  const joiner = isArabic ? ' بن ' : ' ibn ';

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="flex flex-col gap-4 text-gray-900 dark:text-gray-200">
      <header>
        <h1 className="text-3xl mb-1">{isArabic ? 'النسب' : 'Nasab'}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isArabic
            ? 'اختر شخصًا لترى سلسلة آبائه، وشغّل المفتاح لترى ذريته تحته. إذا اخترت أكثر من واحد التقت السلسلتان عند أول جد مشترك.'
            : 'Pick a person to see the line of their fathers, and turn on the switch to see their descendants below them. Pick several and their lines join at the first ancestor they share.'}
        </p>
      </header>

      <div>
        <GraphSearch personOnly hint={isArabic ? 'اختر لعرض النسب' : 'Select to show the nasab'} />
        <div className="flex flex-wrap gap-2" aria-label={isArabic ? 'اختيارات سريعة' : 'Quick picks'}>
          {QUICK_PICKS.map((pick) => (
            <Button key={pick.slug} size="sm" active={subjects.includes(pick.slug)} aria-pressed={subjects.includes(pick.slug)} onClick={() => toggle(pick.slug)}>
              <FontAwesomeIcon icon={faUser} />
              {isArabic ? pick.ar : pick.en}
            </Button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm">
          <button type="button" tabIndex={-1} aria-hidden className={sideLabel(!descendants)} onClick={() => setDescendants(false)}>
            {isArabic ? 'الآباء فقط' : 'Fathers only'}
          </button>
          <Toggle
            label={isArabic ? 'مع الذرية' : 'With descendants'}
            checked={descendants}
            onChange={setDescendants}
            offIcon={<FontAwesomeIcon icon={faArrowUp} className="size-3" />}
            onIcon={<FontAwesomeIcon icon={faSitemap} className="size-3" />}
          />
          <button type="button" tabIndex={-1} aria-hidden className={sideLabel(descendants)} onClick={() => setDescendants(true)}>
            {isArabic ? 'مع الذرية' : 'With descendants'}
          </button>
        </div>
      </div>

      {subjects.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {subjects.map((slug) => (
            <li key={slug}>
              <Button size="sm" onClick={() => toggle(slug)} aria-label={`${isArabic ? 'إزالة' : 'Remove'} ${nameOf(slug)}`}>
                <FontAwesomeIcon icon={faXmark} />
                {nameOf(slug)}
              </Button>
            </li>
          ))}
        </ul>
      )}

      {subjects.length === 0 && <p>{isArabic ? 'لم تختر أحدًا بعد.' : 'Nobody picked yet.'}</p>}
      {failed && subjects.length > 0 && <p role="alert">{isArabic ? 'تعذر تحميل النسب.' : 'Could not load the nasab.'}</p>}
      {subjects.length > 0 && !current && !failed && <p>{isArabic ? 'جارٍ التحميل…' : 'Loading…'}</p>}
      {missing.length > 0 && (
        <p>{isArabic ? 'لا سجل لهؤلاء في الشبكة: ' : 'Not in the graph: '}{missing.join(', ')}</p>
      )}

      {layout && layout.nodes.length > 0 && (
        <>
          <NasabPlot layout={layout} isArabic={isArabic} />
          {!layout.nodes.some((node) => node.isMeeting) && layout.chains.length > 1 && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isArabic ? 'لا جد مشترك مسجل بين هؤلاء.' : 'No common ancestor is recorded for these people.'}
            </p>
          )}
          <ol className="list-decimal ps-6 text-sm">
            {layout.chains.map((chain) => (
              <li key={chain.subject}>{chain.slugs.map((slug) => givenName(nameOf(slug))).join(joiner)}</li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}
