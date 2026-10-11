import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faTableColumns } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/common/Button';
import { num } from '@/lib/quran/arabicNumber';
import type { Surah } from '@/lib/quran/curatedShifts';
import { OPENING_GROUPS, TASBIH_SURAHS } from '@/lib/quran/openings';
import type { HopView } from '@/lib/quran/surahOrder';
import { SLOT_COLORS } from '@/components/quran/slotColors';

const PANEL = 'bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-4';
const NOTE = 'text-sm text-gray-600 dark:text-gray-400';

type Line = HopView['tail'][number];

function Words({ line }: { line: Line }) {
  return line.text.split(' ').map((word, i) => (
    <React.Fragment key={i}>
      {i > 0 && ' '}
      {line.slots && i in line.slots ? <mark className={`bg-transparent ${SLOT_COLORS[line.slots[i] % SLOT_COLORS.length]}`}>{word}</mark> : word}
    </React.Fragment>
  ));
}

function Side({ title, lines }: { title: string; lines: Line[] }) {
  return (
    <div>
      <h3 className={`${NOTE} mb-1`}>{title}</h3>
      {lines.map(l => (
        <p key={l.ayah} className="text-2xl leading-[2.2] font-arabic">
          <span className="text-sm text-amber-600 dark:text-amber-400 me-2">{num(l.ayah)}</span>
          <Words line={l} />
        </p>
      ))}
    </div>
  );
}

function Link({ item: { hop, tail, head, words } }: { item: HopView }) {
  return (
    <details id={`hop-${hop.from}`} className="ms-6 my-2">
      <summary className="cursor-pointer text-amber-600 dark:text-amber-400 flex items-center gap-2">
        <FontAwesomeIcon icon={faArrowDown} aria-hidden />
        <span>الصلة بما بعدها</span>
      </summary>
      <div className={`${PANEL} mt-2`}>
        <p className="mb-3">{hop.note}</p>
        {words.length > 0 && <p className={`${NOTE} mb-3`}>{`كلمات مشتركة: ${words.join('، ')}`}</p>}
        <div className="grid md:grid-cols-2 gap-x-4">
          <Side title="آخر السورة" lines={tail} />
          <Side title="أول التالية" lines={head} />
        </div>
        {hop.src.length > 0 ? (
          <ul className={NOTE} aria-label="المصادر">
            {hop.src.map(s => (
              <li key={s.url}>
                <a className="underline" href={s.url} target="_blank" rel="noreferrer">{s.title}</a>
              </li>
            ))}
          </ul>
        ) : (
          <p className={NOTE}>بلا مصدر</p>
        )}
      </div>
    </details>
  );
}

export default function OrderView({ chips, hops }: { chips: Surah[]; hops: HopView[] }) {
  return (
    <div className="flex flex-col gap-3">
      <p className={NOTE}>
        اضغط «الصلة بما بعدها» تحت كل سورة لترى آخر آياتها وأول آيات التي تليها. «بلا مصدر» تعني أن الربط قراءة لنص السورتين لم تُنسب إلى كتاب، وليس لها حجة غير النص. ويُلوَّن اللفظ المشترك في الآيتين بلون واحد، ويُذكر أيضًا في سطر مستقل.
      </p>
      <ol className="flex flex-col" aria-label="ترتيب السور">
        {chips.map(s => {
          const hop = hops.find(h => h.hop.from === s.number);
          const like = (OPENING_GROUPS.find(g => g.includes(s.number)) ?? []).filter(n => n !== s.number);
          return (
            <li key={s.number}>
              <div className={`${PANEL} flex flex-wrap items-center gap-3`}>
                <h2 className="text-xl">{`${num(s.number)} ${s.plain}`}</h2>
                {like.length > 0 && (
                  <Button size="sm" variant="outline" href="/quran/openings">
                    <FontAwesomeIcon icon={faTableColumns} />
                    {TASBIH_SURAHS.includes(s.number) ? 'افتتاحها بالتسبيح كالمسبّحات' : `افتتاحها كافتتاح ${like.map(n => num(n)).join(' و')}`}
                  </Button>
                )}
              </div>
              {hop && <Link item={hop} />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
