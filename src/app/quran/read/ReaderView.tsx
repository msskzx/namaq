import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faList } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/common/Button';
import type { ReaderPageData } from '@/lib/quran/readerPage';
import { num } from '@/lib/quran/arabicNumber';
import FitLines from './FitLines';
import JumpForm from './JumpForm';

const BASMALA = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

const SAJDA = '۩';

const groups = (tokens: (string | number)[]) =>
  tokens.reduce<{ word: string; marks: (string | number)[] }[]>((all, token) => {
    if (typeof token === 'string' && token !== SAJDA) all.push({ word: token, marks: [] });
    else if (all.length === 0) all.push({ word: '', marks: [token] });
    else all.at(-1)?.marks.push(token);
    return all;
  }, []);

const hasBasmala = (surah: number) => surah !== 1 && surah !== 9;

const MARK =
  'mx-1 inline-flex h-[2.4em] w-[2.4em] items-center justify-center rounded-full border border-gray-400 align-middle text-[0.5em] text-gray-600 dark:border-gray-500 dark:text-gray-400';

export default function ReaderView({
  page,
  data,
  names,
}: {
  page: number;
  data: ReaderPageData;
  names: Record<number, string>;
}) {
  const small = page <= 2;
  return (
    <article dir="rtl" lang="ar" className="max-w-3xl mx-auto p-4 text-gray-900 dark:text-gray-200">
      <header className="mb-4 text-center">
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
          الجزء {num(data.juz)} · برواية حفص
        </p>
        <JumpForm />
      </header>
      <section
        aria-label={`الصفحة ${num(page)}`}
        className={`[container-type:inline-size] border border-gray-200 bg-white/60 px-5 pt-5 pb-3 dark:border-gray-700 dark:bg-gray-900/40 ${
          small ? 'mx-auto max-w-md rounded-[2rem]' : 'rounded-lg'
        }`}
      >
        <FitLines key={page}>
          {data.items.map((item, index) =>
            'surah' in item ? (
              <div key={index} className="my-2 text-center">
                <h2 className="text-xl text-amber-600 dark:text-amber-400">{names[item.surah]}</h2>
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
                {groups(item.line).map((group, at) => (
                  <span key={at}>
                    {group.word}
                    {group.marks.map((mark, markAt) =>
                      mark === SAJDA ? (
                        <span key={markAt} aria-label="سجدة">
                          {' '}
                          {mark}
                        </span>
                      ) : (
                        <span key={markAt} className={MARK}>
                          {num(Number(mark))}
                        </span>
                      ),
                    )}
                  </span>
                ))}
              </p>
            ),
          )}
        </FitLines>
        <p className="mt-3 border-t border-gray-200 pt-2 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          {num(page)}
        </p>
      </section>
      <nav
        aria-label="التنقل بين الصفحات"
        className="mt-4 flex flex-wrap items-center justify-center gap-3"
      >
        {page > 1 && (
          <Button size="sm" href={`/quran/read/${page - 1}`}>
            <FontAwesomeIcon icon={faArrowRight} aria-hidden />
            الصفحة السابقة
          </Button>
        )}
        <Button size="sm" href="/quran/read">
          <FontAwesomeIcon icon={faList} aria-hidden />
          فهرس السور
        </Button>
        {page < 604 && (
          <Button size="sm" href={`/quran/read/${page + 1}`}>
            الصفحة التالية
            <FontAwesomeIcon icon={faArrowLeft} aria-hidden />
          </Button>
        )}
      </nav>
    </article>
  );
}
