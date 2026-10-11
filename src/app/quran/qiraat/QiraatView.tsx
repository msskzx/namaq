"use client";

// docs/plans/quran-qiraat.md
import React, { useState } from 'react';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { AyahCard } from '@/components/quran/AyahCard';
import type { Ayah } from '@/types/quran';
import { ayahWords, plainName } from '@/lib/quran/normalize';
import { chipStates, neighbors, READERS, RIWAYAT, type Variant } from '@/lib/quran/qiraat';
import { num } from '@/lib/quran/arabicNumber';
import { wordDiff } from '@/lib/quran/wordDiff';

export type QiraatEntry = { variant: Variant; text: string; surahName: string };

const BADGE_COLORS = ['amber', 'blue', 'emerald', 'rose'];
const WORD_COLORS = ['text-amber-600 dark:text-amber-400', 'text-sky-600 dark:text-sky-400', 'text-emerald-600 dark:text-emerald-400', 'text-rose-600 dark:text-rose-400'];
const UNCONFIRMED = 'غير مؤكد';
const SECOND_LABEL = 'فرق على مستوى الكلمة، وليس نص مصحف تلك الرواية';

const sameWord = (w: string) => w.replace(/[\u2060\u0652\u06D6-\u06ED\u08D3-\u08FF]/g, '').replace(/[ىی]/g, 'ي').replace(/ٱ/g, 'ا').replace(/([\u064B-\u0650])\u0651/g, '\u0651$1');

const key = (v: Variant) => `${v.surah}:${v.ayah}`;
const pediaUrl = (v: Variant) => `https://quranpedia.net/ayahs/${v.surah}/${v.ayah}`;

function Meaning({ meaning }: { meaning: NonNullable<Variant['meaning']> }) {
  if (meaning.kind === 'quote') {
    return (
      <div className="flex flex-col gap-1">
        {meaning.quotes.map(q => <blockquote key={q} className="border-s-2 border-amber-400 ps-3">«{q}»</blockquote>)}
        <a href={meaning.url} className="inline-flex items-center gap-2 text-sm underline" target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faLink} />
          {meaning.source}
        </a>
      </div>
    );
  }
  return <p>{meaning.text}</p>;
}

function hafsWordOf({ variant, text }: QiraatEntry) {
  const words = ayahWords(text, false);
  const found = neighbors(words.norm, variant.hafsWord, variant.occurrence);
  return found ? words.display.slice(found.start, found.end).join(' ') : '';
}

function Card({ entry }: { entry: QiraatEntry }) {
  const { variant, text, surahName } = entry;
  const words = ayahWords(text, false);
  const found = neighbors(words.norm, variant.hafsWord, variant.occurrence);
  const states = chipStates(variant);
  const hafsWord = hafsWordOf(entry);
  const rows = variant.readings.map((r, i) => (i === 0 ? hafsWord : r.text ?? ''));
  const spans = rows.map(r => r.split(' ').filter(Boolean));
  const differing = spans.map(() => new Set<number>());
  spans.slice(1).forEach((span, n) => {
    const d = wordDiff(spans[0].map(sameWord), span.map(sameWord));
    d.a.forEach(k => differing[0].add(k));
    d.b.forEach(k => differing[n + 1].add(k));
  });
  spans.forEach((span, i) => {
    if (i > 0 && span.length === spans[0].length) differing[0].forEach(k => differing[i].add(k));
  });
  const slots = found ? Object.fromEntries([...differing[0]].map(k => [found.start + k, 0])) : undefined;
  const ayah = { id: key(variant), number: variant.ayah, text: words.display.join(' '), surah: { name: surahName } } as unknown as Ayah;
  const around = (side: readonly [number, number]) => words.display.slice(side[0], side[1]).join(' ');

  return (
    <section className="flex flex-col gap-4">
      <AyahCard ayah={ayah} slots={slots} />
      {!found && <p className="rounded-lg border border-red-400 p-4">تعذر تحديد الكلمة المختلف فيها في نص الآية، فلا يُعرض الفرق.</p>}
      {found && (
        <div className="flex flex-col gap-3">
          <div className="grid gap-3 md:grid-cols-2">
            {rows.map((_, i) => (
              <div key={i} className="row-span-2 grid grid-rows-subgrid gap-2 rounded-lg border border-gray-200 dark:border-white/10 p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">{states.filter(c => c.state === i).map(c => c.name).join('، ')}</p>
                <p className="text-2xl leading-[2.2] font-arabic">
                  {around(found.before)}{' '}
                  {spans[i].length === 0 && <mark className={`bg-transparent ${WORD_COLORS[i]}`}>{UNCONFIRMED}</mark>}
                  {spans[i].map((w, k) => (
                    <React.Fragment key={k}>
                      {differing[i].has(k) ? <mark className={`bg-transparent ${WORD_COLORS[i]}`}>{w}</mark> : w}{' '}
                    </React.Fragment>
                  ))}
                  {around(found.after)}
                </p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{SECOND_LABEL}</p>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <ul className="grid gap-3 sm:grid-cols-2" aria-label="الأئمة ورواتهم">
          {READERS.map(reader => {
            const mine = states.filter(c => RIWAYAT.find(r => r.id === c.id)?.reader === reader.id);
            const same = mine.every(c => c.state === mine[0].state);
            return (
              <li key={reader.id} className="flex flex-col gap-2 rounded-lg border border-gray-200 dark:border-white/10 p-3">
                <Badge size="sm" text={reader.name} color={same && mine[0].state !== null ? BADGE_COLORS[mine[0].state!] : 'gray'} />
                <ul aria-label="الرواة" className="flex flex-wrap gap-2 ms-4 ps-3 border-s-2 border-gray-300 dark:border-white/20">
                  {mine.map(s => (
                    <li key={s.id} data-state={s.state ?? 'unknown'}>
                      <Badge size="sm" text={s.name} color={s.state === null ? 'gray' : BADGE_COLORS[s.state]} />
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {states.some(c => c.state === null) && <Badge size="sm" color="gray" text={UNCONFIRMED} />}
        </div>
        {variant.note && <p className="text-sm text-gray-600 dark:text-gray-400">{variant.note}</p>}
      </div>
      {variant.meaning && (
        <div>
          <h3 className="text-lg">المعنى</h3>
          <Meaning meaning={variant.meaning} />
        </div>
      )}
      <a href={pediaUrl(variant)} className="inline-flex items-center gap-2 text-sm underline" target="_blank" rel="noreferrer">
        <FontAwesomeIcon icon={faLink} />
        قوائم القرّاء من موسوعة القرآن: <bdi dir="ltr">{pediaUrl(variant)}</bdi>
      </a>
    </section>
  );
}

const JUZ_AMMA_FROM = 78;
const surahLabel = (entries: QiraatEntry[], surah: number) => {
  const name = entries.find(e => e.variant.surah === surah)?.surahName;
  return name ? plainName(name).replace(/^سورة /, '') : String(surah);
};

export default function QiraatView({ entries }: { entries: QiraatEntry[] }) {
  const [selected, setSelected] = useState(0);
  if (entries.length === 0) return <p dir="rtl" className="max-w-3xl mx-auto p-4">لا توجد آيات محفوظة لعرض القراءات.</p>;
  const surah = entries[selected].variant.surah;
  const surahs = [...new Set(entries.map(e => e.variant.surah))];
  const here = entries.flatMap((e, i) => (e.variant.surah === surah ? [{ e, i }] : []));
  const option = (n: number) => (
    <option key={n} value={n}>{`${surahLabel(entries, n)} (${num(entries.filter(e => e.variant.surah === n).length)})`}</option>
  );
  return (
    <div dir="rtl" className="max-w-3xl mx-auto p-4 flex flex-col gap-4 text-gray-900 dark:text-gray-200">
      <header className="flex flex-col gap-2">
        <h1 className="flex items-center gap-2 text-3xl">
          القراءات: الآية نفسها في أكثر من قراءة
        </h1>
        <p>
          {num(entries.length)} موضعًا اختيرت للتجربة، من الفاتحة إلى المسد، وأرقام آياتها على عدّ حفص (الكوفي). في رواية ورش لا تُعدّ البسملة آية في الفاتحة، فتكون «مالك يوم الدين» الآية ٣ لا ٤.
          وسورة البقرة {num(286)} آية في العدّ الكوفي و{num(287)} في البصري و{num(285)} في المدني.
        </p>
        <p>
          قوائم القرّاء من موسوعة القرآن (Quranpedia): الآيات الأولى من صفحة كل آية، مثل <bdi dir="ltr">https://quranpedia.net/ayahs/1/4</bdi>، وآيات جزء عمّ من ملف بيانات الموسوعة الرسمي للقراءات. ولا تسمّي الموسوعة الكتاب الذي نقلت عنه، وستُراجع على «النشر» في مرحلة التوثيق. القراءات العشر كلها متواترة، والصفحة لا ترجّح بينها.
        </p>
      </header>
      <div className="flex flex-col gap-3 rounded-lg border border-gray-200 dark:border-white/10 p-4">
        <label className="flex flex-wrap items-center gap-3">
          <span>السورة</span>
          <select
            value={surah}
            onChange={ev => setSelected(entries.findIndex(e => e.variant.surah === Number(ev.target.value)))}
            className="rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-black px-3 py-2"
          >
            <optgroup label="سور أخرى">{surahs.filter(n => n < JUZ_AMMA_FROM).map(option)}</optgroup>
            <optgroup label="جزء عمّ">{surahs.filter(n => n >= JUZ_AMMA_FROM).map(option)}</optgroup>
          </select>
        </label>
        <nav className="flex flex-wrap items-center gap-2" aria-label="المواضع">
          <span>الآية</span>
          {here.map(({ e, i }) => (
            <Button key={i} size="sm" active={i === selected} onClick={() => setSelected(i)}>
              {num(e.variant.ayah)}
            </Button>
          ))}
        </nav>
      </div>
      <Card key={selected} entry={entries[selected]} />
    </div>
  );
}
