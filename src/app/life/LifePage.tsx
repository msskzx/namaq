'use client';

import { useState } from 'react';
import { lifeSources, type LifeItem } from '@shared/events/lifeTimeline';
import { sourceEntries } from '@shared/quiz/sources';
import type { lifeCompare, PickPerson } from '@/lib/tarajim';
import Card from '@/components/common/Card';
import CardWithRow from '@/components/common/CardWithRow';
import PeoplePicker from '@/components/tarajim/PeoplePicker';
import { Dot, itemHref, lifeColor, lifeHref, LifeSheet, placeLabel } from '@/components/tarajim/LifeTimeline';

/** One person's row in a year: a box with its kind's dot, a link to its page, or its sentences when it has none. */
function Cell({ item, show }: { item?: LifeItem; show: (item: LifeItem) => void }) {
  if (!item) return <div className="flex-1" />;
  const href = itemHref(item);
  const look = `flex min-h-11 flex-1 items-center gap-2 px-3 py-1.5 text-center ${item.kind === 'own' ? 'text-[var(--home-muted)]' : ''}`;
  const body = <><Dot color={lifeColor(item.kind)} size={7} /><span className="flex-1">{item.name}</span></>;
  return href ? <Card node href={href} className={look}>{body}</Card> : <Card node as="button" onClick={() => show(item)} className={look}>{body}</Card>;
}

export default function LifePage({ view, people }: { view: ReturnType<typeof lifeCompare>; people: PickPerson[] }) {
  const [shown, setShown] = useState<LifeItem | undefined>();
  const one = view.people.length === 1 ? view.people[0] : undefined;
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4" lang="ar" dir="rtl">
      <h1 className="text-[1.75rem]">{view.people.length === 2 ? 'حياتهما' : view.people.length > 2 ? 'حياتهم' : one?.sex === 'FEMALE' ? 'حياتها' : 'حياته'}</h1>
      <PeoplePicker picked={view.people} people={people} hrefOf={lifeHref} />
      {view.people.length < 2 && <p className="text-[var(--home-muted)]">اختر علمًا آخر لتضع حياتيهما جنبًا إلى جنب.</p>}
      {view.people.length > 1 && (
        // The lives in the home card's shape, every sentence they rest on named on the book line (owner 2026-11-20).
        <CardWithRow className="flex flex-col gap-1.5 px-2 py-3.5" source={sourceEntries(lifeSources(view.places.flatMap(place => place.rows.flatMap(row => row.cells.filter((cell): cell is LifeItem => !!cell)))))}>
          <div className="flex gap-2">
            <span className="w-12 shrink-0" />
            {view.people.map(p => <span key={p.slug} className="flex-1 text-center text-sm text-[var(--home-muted)]">{p.name}</span>)}
          </div>
          {view.places.map(place => place.rows.map((row, i) => (
            <div key={`${place.key}:${row.key}`} className="flex items-stretch">
              <span className="me-2 w-12 shrink-0 self-center text-center text-sm text-[var(--home-accent)]">{i === 0 ? placeLabel(place) : ''}</span>
              {view.people.map((_, c) => row.cells[c]).map((cell, c) => (
                <div key={c} className="flex flex-1">
                  {c > 0 && <span className={`h-[1.5px] w-2 shrink-0 self-center ${row.shared && cell && row.cells[c - 1] ? 'bg-[var(--home-rule)]' : ''}`} />}
                  <Cell item={cell} show={setShown} />
                </div>
              ))}
            </div>
          )))}
          {view.people.filter(p => !view.lived.includes(p.slug)).map(p => (
            <p key={p.slug} className="text-sm text-[var(--home-muted)]">لا أحداث مؤرخة بعد لـ{p.name} في التراجم المضافة.</p>
          ))}
        </CardWithRow>
      )}
      <LifeSheet item={shown} onClose={() => setShown(undefined)} />
    </div>
  );
}
