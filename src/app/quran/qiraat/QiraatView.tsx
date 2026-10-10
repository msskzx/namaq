"use client";

// docs/plans/quran-qiraat.md
import React, { useState } from 'react';
import { faBookQuran, faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { AyahCard } from '@/components/quran/AyahCard';
import type { Ayah } from '@/types/quran';
import { ayahWords } from '@/lib/quran/normalize';
import { chipStates, neighbors, type Variant } from '@/lib/quran/qiraat';

export type QiraatEntry = { variant: Variant; text: string; surahName: string };

const WORD_COLORS = ['text-amber-600 dark:text-amber-400', 'text-sky-600 dark:text-sky-400'];
const BADGE_COLORS = ['amber', 'blue'];
const UNCONFIRMED = 'غير مؤكد';
const SECOND_LABEL = 'فرق على مستوى الكلمة، وليس نص مصحف تلك الرواية';
const UNSOURCED = 'غير موثق (اقتراح للتجربة)';

const key = (v: Variant) => `${v.surah}:${v.ayah}`;
const pediaUrl = (v: Variant) => `https://quranpedia.net/ayahs/${v.surah}/${v.ayah}`;
const n = (value: number) => value.toLocaleString('ar-EG');

function Meaning({ meaning }: { meaning: Variant['meaning'] }) {
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
  return (
    <p>
      {meaning.text}
      {meaning.kind === 'unsourced' && <span className="block text-sm text-gray-600 dark:text-gray-400">{UNSOURCED}</span>}
    </p>
  );
}

function Card({ entry }: { entry: QiraatEntry }) {
  const { variant, text, surahName } = entry;
  const words = ayahWords(text, false);
  const found = neighbors(words.norm, variant.hafsWord, variant.occurrence);
  const states = chipStates(variant);
  const second = variant.readings[1];
  const hafsWord = found ? words.display.slice(found.start, found.end).join(' ') : '';
  const rows = [hafsWord, second.text ?? ''];
  const slots = found ? Object.fromEntries(Array.from({ length: found.end - found.start }, (_, k) => [found.start + k, 0])) : undefined;
  const ayah = { id: key(variant), number: variant.ayah, text: words.display.join(' '), surah: { name: surahName } } as unknown as Ayah;
  const around = (side: readonly [number, number]) => words.display.slice(side[0], side[1]).join(' ');

  return (
    <section className="flex flex-col gap-4">
      <AyahCard ayah={ayah} slots={slots} />
      {!found && <p className="rounded-lg border border-red-400 p-4">تعذر تحديد الكلمة المختلف فيها في نص الآية، فلا يُعرض الفرق.</p>}
      {found && (
        <div className="flex flex-col gap-2 rounded-lg border border-gray-200 dark:border-white/10 p-4">
          {rows.map((word, i) => (
            <p key={i} className="text-2xl leading-[2.2] font-arabic">
              {around(found.before)} <mark className={`bg-transparent ${WORD_COLORS[i]}`}>{word || UNCONFIRMED}</mark> {around(found.after)}
            </p>
          ))}
          <p className="text-sm text-gray-600 dark:text-gray-400">{SECOND_LABEL}</p>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <ul className="flex flex-wrap gap-2" aria-label="الروايات العشرون">
          {states.map(s => (
            <li key={s.id} data-state={s.state ?? 'unknown'}>
              <Badge size="sm" text={s.name} color={s.state === null ? 'gray' : BADGE_COLORS[s.state]} />
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {found && states.some(c => c.state === 0) && <Badge size="sm" color={BADGE_COLORS[0]} text={hafsWord} />}
          {states.some(c => c.state === 1) && <Badge size="sm" color={BADGE_COLORS[1]} text={second.text ?? ''} />}
          {states.some(c => c.state === null) && <Badge size="sm" color="gray" text={UNCONFIRMED} />}
        </div>
        {variant.note && <p className="text-sm text-gray-600 dark:text-gray-400">{variant.note}</p>}
      </div>
      <div>
        <h3 className="text-lg">المعنى</h3>
        <Meaning meaning={variant.meaning} />
      </div>
      <a href={pediaUrl(variant)} className="inline-flex items-center gap-2 text-sm underline" target="_blank" rel="noreferrer">
        <FontAwesomeIcon icon={faLink} />
        قوائم القرّاء من موسوعة القرآن: <bdi dir="ltr">{pediaUrl(variant)}</bdi>
      </a>
    </section>
  );
}

export default function QiraatView({ entries }: { entries: QiraatEntry[] }) {
  const [selected, setSelected] = useState(0);
  if (entries.length === 0) return <p dir="rtl" className="max-w-3xl mx-auto p-4">لا توجد آيات محفوظة لعرض القراءات.</p>;
  return (
    <div dir="rtl" className="max-w-3xl mx-auto p-4 flex flex-col gap-4 text-gray-900 dark:text-gray-200">
      <header className="flex flex-col gap-2">
        <h1 className="flex items-center gap-2 text-3xl">
          القراءات: الآية نفسها في أكثر من قراءة
          <Badge size="sm" text="تجريبي" color="amber" />
        </h1>
        <p>
          اثنا عشر موضعًا اختيرت للتجربة، وأرقام آياتها على عدّ حفص (الكوفي). في رواية ورش لا تُعدّ البسملة آية في الفاتحة، فتكون «مالك يوم الدين» الآية ٣ لا ٤.
          وسورة البقرة {n(286)} آية في العدّ الكوفي و{n(287)} في البصري و{n(285)} في المدني.
        </p>
        <p>
          قوائم القرّاء من موسوعة القرآن (Quranpedia) على صفحة كل آية، مثل <bdi dir="ltr">https://quranpedia.net/ayahs/1/4</bdi>، ولا تسمّي الموسوعة الكتاب الذي نقلت عنه، وستُراجع على «النشر» في مرحلة التوثيق. القراءات العشر كلها متواترة، والصفحة لا ترجّح بينها.
        </p>
      </header>
      <nav className="flex flex-wrap gap-2" aria-label="المواضع">
        {entries.map((e, i) => (
          <Button key={key(e.variant)} size="sm" active={i === selected} onClick={() => setSelected(i)}>
            <FontAwesomeIcon icon={faBookQuran} />
            {n(e.variant.surah)}:{n(e.variant.ayah)}
          </Button>
        ))}
      </nav>
      <Card key={selected} entry={entries[selected]} />
    </div>
  );
}
