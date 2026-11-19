'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { num } from '@shared/quran/arabicNumber';
import { lifeFilters, lifeRail, lifeStrip, openLabel, stripLabels, type LifeItem, type LifeKind } from '@shared/events/lifeTimeline';
import Card from '@/components/common/Card';
import Chip from '@/components/common/Chip';
import Button from '@/components/common/Button';
import Sheet from '@/components/common/Sheet';
import ExternalLink from '@/components/common/ExternalLink';
import TapRow from '@/components/common/TapRow';

/** A dot of the strip or the rail, filled, or a ring for a row of another kind than the one picked. */
export function Dot({ color, hollow = false, size = 9 }: { color: string; hollow?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} aria-hidden className="block shrink-0" style={{ opacity: hollow ? 0.6 : 1 }}>
      <circle cx={size / 2} cy={size / 2} r={size / 2 - 0.75} fill={hollow ? 'none' : color} stroke={color} strokeWidth={1.5} />
    </svg>
  );
}

// A person's «حياته» drawn, as the app's components/LifeTimeline.tsx (owner 2026-11-18; sketch timeline-events/sketch-dark.png,
// screens 1 and 4): the strip of years, the kinds as chips with «+ قارن», the rail by year. shared/events/lifeTimeline.ts lays it out.

/** Each kind's dot, as in the app. */
export const lifeColor = (kind: LifeKind) =>
  ({ ghazwah: 'var(--home-accent)', sariyyah: 'var(--home-path)', battle: 'var(--home-root)', event: 'var(--home-muted)', story: 'var(--home-green)', own: 'var(--home-amber)' })[kind];

export const placeLabel = (place: { year?: number; before?: boolean }) => (place.before ? 'قبل الهجرة' : place.year !== undefined ? num(place.year) : 'بلا سنة');

/** A row's page on the website: a battle's or a story's; none for an event or the person's own fact. */
export const itemHref = (item: LifeItem) => (item.open ? `/${item.open.to === 'battle' ? 'battles' : 'stories'}/${item.open.slug}` : undefined);

export const lifeHref = (slugs: string[]) => `/people/${slugs[0]}/life${slugs.length > 1 ? `?with=${slugs.slice(1).join(',')}` : ''}`;

/** The sentences that place the person in a row, with their pages, and where the sources give its year otherwise. */
export function LifeSheet({ item, onClose }: { item?: LifeItem; onClose: () => void }) {
  const href = item && itemHref(item);
  return (
    <Sheet open={!!item} onClose={onClose} label={item?.name}>
      {item && (
        <div className="flex flex-col gap-3 p-4" lang="ar" dir="rtl">
          <h2 className="text-xl">{item.name}</h2>
          {item.refs.map((ref, i) => (
            <div key={i} className="flex flex-col gap-1">
              <p className="line-clamp-6 text-lg leading-[1.9]">«{ref.text}»</p>
              {ref.url ? <ExternalLink href={ref.url} className="text-sm">{ref.cite}</ExternalLink> : <p className="text-sm text-[var(--home-muted)]">{ref.cite}</p>}
            </div>
          ))}
          {item.others.map((reading, i) => (
            <div key={`o${i}`} className="flex flex-col gap-1">
              <p className="text-sm text-[var(--home-muted)]">وفي سنتها قول آخر</p>
              <p className="text-lg leading-[1.9]">«{reading.text}»</p>
              {reading.refs.map((ref, j) => <p key={j} className="text-sm text-[var(--home-muted)]">{ref.cite}</p>)}
            </div>
          ))}
          {href && <div><Button href={href}>{openLabel(item)}</Button></div>}
        </div>
      )}
    </Sheet>
  );
}

/** Room a year's label takes under the strip, as in the app. */
const LABEL_W = 22;

function Strip({ items, on }: { items: LifeItem[]; on: (item: LifeItem) => boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const watch = new ResizeObserver(() => setWidth(el.clientWidth));
    watch.observe(el);
    return () => watch.disconnect();
  }, []);
  const columns = lifeStrip(items);
  if (columns.length === 0) return null;
  const named = stripLabels(columns, width / (columns.length + (columns[0].before ? 1 : 0)), LABEL_W);
  return (
    <Card className="px-5 py-3">
      <div ref={box} className="flex items-end" role="img" aria-label={`على سنوات الهجرة، من ${placeLabel(columns[0])} إلى ${placeLabel(columns[columns.length - 1])}`}>
        {columns.map(column => (
          <div key={column.key} className="flex min-w-0 flex-col items-center gap-[3px]" style={{ flex: column.before ? 2 : 1 }}>
            {column.items.slice().reverse().map(item => (
              <Dot key={item.key} color={on(item) ? lifeColor(item.kind) : 'var(--home-muted)'} hollow={!on(item)} />
            ))}
            <span className="mt-0.5 min-h-4 w-10 text-center text-xs text-[var(--home-muted)]">
              {named.has(column.key) ? (column.before ? 'قبل' : num(column.year!)) : ''}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/** One row on the rail: its dot on the line and its name, a link to its page; a row with no page shows its sentences. */
function Item({ item, show, last }: { item: LifeItem; show: (item: LifeItem) => void; last: boolean }) {
  const href = itemHref(item);
  const label = <>
    {item.name}
    {item.note && <small className="ms-2 text-sm text-[var(--home-muted)]">{item.note}</small>}
    {item.others.length > 0 && <small className="ms-2 text-sm text-[var(--home-muted)]">وقيل غير ذلك</small>}
  </>;
  const text = `py-2 text-lg leading-[1.7] ${item.kind === 'own' ? 'text-[var(--home-muted)]' : ''}`;
  return (
    <div className="flex min-h-11 items-stretch">
      <div className="relative w-[18px] shrink-0">
        <span className="absolute inset-x-0 top-0 mx-auto w-[1.5px] bg-[var(--home-rule)]" style={{ bottom: last ? '50%' : 0 }} />
        <span className="absolute inset-x-0 top-[17px] flex justify-center"><Dot color={lifeColor(item.kind)} /></span>
      </div>
      <div className="flex flex-1 items-center gap-2 ps-2">
        <TapRow href={href} onClick={() => show(item)} className={text}><span>{label}</span></TapRow>
        {href && <Button size="sm" variant="ghost" onClick={() => show(item)}>من الكتاب</Button>}
      </div>
    </div>
  );
}

/** A person's «حياته»: the strip, the chips and the rail. `compare` is the «+ قارن» page with him first. */
export default function LifeTimeline({ items, compare }: { items: LifeItem[]; compare?: string }) {
  const [filter, setFilter] = useState<number | undefined>();
  const [shown, setShown] = useState<LifeItem | undefined>();
  const filters = lifeFilters(items);
  const picked = filter === undefined ? undefined : filters[filter];
  const on = (item: LifeItem) => !picked || picked.kinds.includes(item.kind) || item.kind === 'own';
  const rail = lifeRail(items.filter(on));
  if (items.length === 0) return null;
  return (
    <div className="flex flex-col gap-3" lang="ar" dir="rtl">
      <Strip items={items} on={on} />
      {(filters.length > 0 || compare) && (
        <div className="flex flex-wrap gap-2">
          {filters.length > 0 && <Chip label="الكل" on={filter === undefined} onClick={() => setFilter(undefined)} />}
          {filters.map((f, i) => <Chip key={f.label} label={f.label} on={filter === i} onClick={() => setFilter(filter === i ? undefined : i)} />)}
          {compare && <Button size="sm" href={compare}><Plus size={16} aria-hidden />قارن</Button>}
        </div>
      )}
      <div>
        {rail.map((place, p) => (
          <div key={place.key} className="flex">
            <span className={`w-[52px] shrink-0 pt-3 text-center ${place.year === undefined ? 'text-[var(--home-muted)]' : 'text-[var(--home-accent)]'}`}>{placeLabel(place)}</span>
            <div className="flex-1">
              {place.items.map((item, i) => <Item key={item.key} item={item} show={setShown} last={p === rail.length - 1 && i === place.items.length - 1} />)}
            </div>
          </div>
        ))}
      </div>
      <LifeSheet item={shown} onClose={() => setShown(undefined)} />
    </div>
  );
}
