'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { LifeItem } from '@shared/events/lifeTimeline';
import type { lifeCompare, PersonHead } from '@/lib/tarajim';
import Card from '@/components/common/Card';
import Chip from '@/components/common/Chip';
import Button from '@/components/common/Button';
import Sheet from '@/components/common/Sheet';
import { SearchField } from '@/components/common/Field';
import { Dot, itemHref, lifeColor, lifeHref, LifeSheet, placeLabel } from '@/components/tarajim/LifeTimeline';

const bare = (text: string) => text.replace(/[ً-ْٰـ]/g, '').replace(/[أإآ]/g, 'ا');

/** One person's row in a year: a box with its kind's dot, a link to its page, or its sentences when it has none. */
function Cell({ item, show }: { item?: LifeItem; show: (item: LifeItem) => void }) {
  if (!item) return <div className="flex-1" />;
  const href = itemHref(item);
  const look = `flex min-h-11 flex-1 items-center gap-2 px-3 py-1.5 text-center ${item.kind === 'own' ? 'text-[var(--home-muted)]' : ''}`;
  const body = <><Dot color={lifeColor(item.kind)} size={7} /><span className="flex-1">{item.name}</span></>;
  return href ? <Card href={href} className={look}>{body}</Card> : <Card as="button" onClick={() => show(item)} className={look}>{body}</Card>;
}

export default function LifePage({ view, people }: { view: ReturnType<typeof lifeCompare>; people: PersonHead[] }) {
  const [adding, setAdding] = useState(view.people.length < 2);
  const [query, setQuery] = useState('');
  const [shown, setShown] = useState<LifeItem | undefined>();
  const picked = view.people.map(p => p.slug);
  const words = bare(query).split(/\s+/).filter(Boolean);
  const offered = people.filter(p => !picked.includes(p.slug) && words.every(w => bare(p.name).includes(w)));
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4" lang="ar" dir="rtl">
      <h1 className="text-[1.75rem]">{view.people.length === 2 ? 'حياتهما' : view.people.length > 2 ? 'حياتهم' : 'حياته'}</h1>
      <div className="flex flex-wrap gap-2">
        {view.people.map((p, i) => (i > 0
          ? <Chip key={p.slug} label={p.name} clearHref={lifeHref(picked.filter(s => s !== p.slug))} clearLabel={`أزل ${p.name}`} />
          : <Chip key={p.slug} label={p.name} on />))}
        <Button size="sm" onClick={() => setAdding(true)}><Plus size={16} aria-hidden />أضف</Button>
      </div>
      {view.people.length < 2 && <p className="text-[var(--home-muted)]">اختر علمًا آخر لتضع حياتيهما جنبًا إلى جنب.</p>}
      {view.people.length > 1 && (
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2">
            <span className="w-12 shrink-0" />
            {view.people.map(p => <span key={p.slug} className="flex-1 text-center text-sm text-[var(--home-muted)]">{p.name}</span>)}
          </div>
          {view.places.map(place => place.rows.map((row, i) => (
            <div key={`${place.key}:${row.key}`} className="flex items-stretch">
              <span className="me-2 w-12 shrink-0 self-center text-center text-sm text-[var(--home-accent)]">{i === 0 ? placeLabel(place) : ''}</span>
              {row.cells.map((cell, c) => (
                <div key={c} className="flex flex-1">
                  {c > 0 && <span className={`h-[1.5px] w-2 shrink-0 self-center ${row.shared && cell && row.cells[c - 1] ? 'bg-[var(--home-rule)]' : ''}`} />}
                  <Cell item={cell} show={setShown} />
                </div>
              ))}
            </div>
          )))}
        </div>
      )}
      <Sheet open={adding} onClose={() => setAdding(false)} label="أضف شخصًا">
        <div className="flex flex-col gap-2 p-4">
          <SearchField label="ابحث عن شخص" placeholder="ابحث عن شخص" value={query} onChangeText={setQuery} />
          <div className="flex max-h-[60vh] flex-col overflow-y-auto">
            {offered.map(p => <Button key={p.slug} variant="ghost" href={lifeHref([...picked, p.slug])} onClick={() => setAdding(false)} className="justify-start">{p.name}</Button>)}
          </div>
        </div>
      </Sheet>
      <LifeSheet item={shown} onClose={() => setShown(undefined)} />
    </div>
  );
}
