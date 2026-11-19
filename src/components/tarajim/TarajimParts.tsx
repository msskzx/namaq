'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { num } from '@shared/quran/arabicNumber';
import type { TieKind } from '@shared/tarajimGraph';
import type { ChainView, Credit, NasabBox, NasabView, RingTie, TiesView, VirtuesView } from '@/lib/tarajim';
import Card from '@/components/common/Card';
import Chip from '@/components/common/Chip';
import Button from '@/components/common/Button';
import Folded from '@/components/common/Folded';
import ExternalLink from '@/components/common/ExternalLink';

// The app's Tarajim views on the website (owner, 2026-11-19: parity): the ties ring (mobile/src/components/TiesRing.tsx),
// a chain of ties (TiesChain.tsx), the nasab tree (screens/nasab.tsx) and the virtues (screens/person.tsx). The data is
// worked out on the server (src/lib/tarajim.ts); these draw it.

/** A person's ties page on the website. */
export const tiesHref = (slug: string) => `/people/${slug}/ties`;
/** «بين عدة أشخاص» with these people picked. */
export const betweenHref = (slugs: string[]) => `/between${slugs.length ? `?slugs=${slugs.join(',')}` : ''}`;
export const nasabHref = (slugs: string[]) => `/people/${slugs[0]}/nasab${slugs.length > 1 ? `?with=${slugs.slice(1).join(',')}` : ''}`;

/** Each kind of tie has its colour, for its lines and its group, as in the app. */
export const kindColor = (kind: TieKind) =>
  ({ parent: 'var(--home-amber)', spouse: 'var(--home-accent)', child: 'var(--home-root)', sibling: 'var(--home-ink)', cousin: 'var(--home-path)', companion: 'var(--home-green)', accompanied: 'var(--home-green)' })[kind];

/** Where the line from `a` to `b` leaves a box of half sizes `hw`×`hh` round `a`. */
function edge(a: { x: number; y: number }, b: { x: number; y: number }, hw: number, hh: number) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const t = Math.min(dx ? hw / Math.abs(dx) : Infinity, dy ? hh / Math.abs(dy) : Infinity, 1);
  return { x: a.x + dx * t, y: a.y + dy * t };
}

/** The width the drawing has, measured, at most `max`. */
function useRoom(max: number) {
  const box = useRef<HTMLDivElement>(null);
  const [room, setRoom] = useState(0);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const watch = new ResizeObserver(() => setRoom(el.clientWidth));
    watch.observe(el);
    setRoom(el.clientWidth);
    return () => watch.disconnect();
  }, []);
  return { box, width: Math.min(room, max) };
}

/** The pages a part rests on, folded at its foot; open, the edition and its link on al-Shamela (the app's Credit). */
export function CreditFold({ credit }: { credit?: Credit }) {
  if (!credit) return null;
  return (
    // Folded, only the books and their authors (owner 2026-11-19); open, the pages, the quotes and the edition.
    <Folded credit={credit.label}>
      <p className="text-[var(--home-muted)]">{credit.pages}</p>
      {credit.quotes?.map((quote, i) => <p key={i} className="text-[var(--home-ink)]">«{quote.text}» <span className="text-[var(--home-muted)]">{quote.pages}</span></p>)}
      {credit.books.map(book => (
        <div key={book.url} className="flex flex-col gap-0.5">
          <p>{book.title}</p>
          <ExternalLink href={book.url} className="w-fit text-[var(--home-accent)]">الكتاب على المكتبة الشاملة</ExternalLink>
        </div>
      ))}
    </Folded>
  );
}

/** A person's virtues as the entry gives them, with who says each; a `marked` one (a quiz's answer, once shown) in green. */
export function Virtues({ view, marked }: { view: VirtuesView; marked?: number }) {
  return <>
    {view.virtues.map((virtue, i) => (
      <div key={i} className="flex flex-col gap-0.5" aria-current={i === marked || undefined}>
        <p className={`text-[1.0625rem] leading-[1.85] ${i === marked ? 'text-[var(--home-green)]' : ''}`}>{virtue.text}</p>
        {virtue.by && <p className="text-sm text-[var(--home-muted)]">{virtue.by}</p>}
      </div>
    ))}
    <CreditFold credit={view.credit} />
  </>;
}

const RING_H = 62;
const GROW = 26;
const RING_GAP = 10;
const RING_ROW = RING_H + 46;
const columns = (width: number) => Math.max(2, Math.floor((width + RING_GAP) / (100 + RING_GAP)));
const nodeWidth = (width: number) => (width - (columns(width) - 1) * RING_GAP) / columns(width);
const capacity = (width: number) => 2 * columns(width) + (columns(width) >= 3 ? 2 : 0);

/** The app's ring layout: half the nodes above the middle and the rest below, the sides only once both rows are full. */
function ringLayout(count: number, width: number) {
  const cols = columns(width);
  const w = nodeWidth(width);
  const top = count > 2 * cols ? cols : Math.ceil(count / 2);
  const sides = cols >= 3 ? Math.max(0, count - 2 * cols) : 0;
  const below = count - top - sides;
  const row = (n: number, y: number) => Array.from({ length: n }, (_, i) => ({ x: width / 2 + (i - (n - 1) / 2) * (w + RING_GAP), y }));
  const first = GROW + RING_H / 2;
  const mid = top > 0 ? first + RING_ROW : first;
  const side = [{ x: width - w / 2, y: mid }, { x: w / 2, y: mid }].slice(0, sides);
  const middleW = sides > 0 ? Math.min(w * 1.2, width - 2 * (w + RING_GAP)) : Math.min(w * 1.8, width);
  return { places: [...row(top, first), ...side, ...row(below, mid + RING_ROW)], middle: mid, middleW, height: mid + RING_H / 2 + GROW + (below > 0 ? RING_ROW : 0), w };
}

type Item = { tie: RingTie; kind: TieKind } | { group: TieKind; count: number; word: string; kind: TieKind };

/**
 * The one drawing of a person's ties (the app's TiesRing): the person in the middle and his ties round him, a line
 * coloured by the kind of tie, each node naming what it is to him. A kind with more people than the drawing holds is one
 * node with its count; a click opens that kind alone (a list when even that does not fit). `onPick` gets a person with a
 * page (without it, the node links to his ties page), `onShow` a tie with no page, to show its sentence.
 */
export function TiesRing({ view, marked, onPick, onShow }: { view: TiesView;
  /** A person whose node is framed in green: the answer a quiz asked about, once it is shown. */
  marked?: string;
  onPick?: (slug: string) => void;
  onShow?: (tie: RingTie) => void }) {
  const { box, width } = useRoom(520);
  const [opened, setOpen] = useState<{ slug: string; kind: TieKind } | undefined>();
  const open = opened?.slug === view.slug ? opened.kind : undefined;
  const groups = view.groups;
  const room = capacity(width || 360);
  const spots = ((): Item[] => {
    if (open) {
      const group = groups.find(g => g.kind === open);
      return group && group.ties.length <= room ? group.ties.map(tie => ({ tie, kind: tie.kind })) : [];
    }
    const folded = new Set<TieKind>();
    const size = () => groups.reduce((sum, g) => sum + (folded.has(g.kind) ? 1 : g.ties.length), 0);
    for (const g of [...groups].sort((a, b) => b.ties.length - a.ties.length)) {
      if (size() <= room) break;
      if (g.ties.length > 1) folded.add(g.kind);
    }
    return groups.flatMap((g): Item[] => (folded.has(g.kind) ? [{ group: g.kind, count: g.ties.length, word: g.word, kind: g.kind }] : g.ties.map(tie => ({ tie, kind: tie.kind }))));
  })();
  const drawW = width || 360;
  const { places, middle, middleW, height, w } = ringLayout(spots.length, drawW);
  const centre = { x: drawW / 2, y: middle };
  const placed = spots.map((spot, i) => ({ ...spot, ...places[i], key: 'tie' in spot ? `${spot.kind}:${spot.tie.to}` : `g:${spot.group}` }));
  const openGroup = open ? groups.find(g => g.kind === open) : undefined;
  const listed = openGroup && openGroup.ties.length > room ? openGroup.ties : [];
  const pick = (tie: RingTie) => (tie.inApp ? onPick?.(tie.to) : onShow?.(tie));
  const nodeBox = 'flex min-h-11 w-full flex-col items-center justify-center px-2 py-1.5 text-center';

  return (
    <div className="flex flex-col gap-3" lang="ar">
      {open && (
        <div className="flex flex-wrap gap-2">
          {groups.map(g => <Chip key={g.kind} label={`${g.word} ${num(g.ties.length)}`} on={g.kind === open} onClick={() => setOpen(g.kind === open ? undefined : { slug: view.slug, kind: g.kind })} />)}
        </div>
      )}
      <div ref={box} className="w-full">
        {width > 0 && (
          <div className="relative mx-auto" style={{ width: drawW, height }}>
            <svg width={drawW} height={height} className="absolute inset-0" aria-hidden>
              {placed.map(spot => {
                const from = edge(centre, spot, middleW / 2, 26);
                const to = edge(spot, centre, w / 2, RING_H / 2);
                return <line key={spot.key} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={kindColor(spot.kind)} strokeWidth={2} strokeOpacity={0.8} />;
              })}
            </svg>
            <div className="absolute flex items-center" style={{ left: drawW / 2 - middleW / 2, top: middle - (RING_H + GROW) / 2, height: RING_H + GROW, width: middleW }}>
              <Card picked className="w-full px-2.5 py-2 text-center text-[1.0625rem]"><h2 className="line-clamp-2">{view.name}</h2></Card>
            </div>
            {placed.map(spot => {
              const grows = spot.y < middle ? 'justify-end' : spot.y > middle ? 'justify-start' : 'justify-center';
              const top = spot.y < middle ? spot.y + RING_H / 2 - RING_H - GROW : spot.y > middle ? spot.y - RING_H / 2 : spot.y - (RING_H + GROW) / 2;
              const style = { left: spot.x - w / 2, width: w, height: RING_H + GROW, top };
              if ('group' in spot) {
                const label = `${spot.word} ${num(spot.count)}`;
                const hasMark = groups.find(g => g.kind === spot.group)?.ties.some(tie => tie.to === marked);
                return (
                  <div key={spot.key} className={`absolute flex flex-col ${grows}`} style={style}>
                    <Card as="button" onClick={() => setOpen({ slug: view.slug, kind: spot.group })} className={nodeBox}
                      outline={hasMark ? 'var(--home-green)' : kindColor(spot.kind)}><span style={{ color: kindColor(spot.kind) }}>{label}</span></Card>
                  </div>
                );
              }
              const tie = spot.tie;
              const label = `${tie.word}: ${tie.name}`;
              const body = <>
                <span className="text-xs" style={{ color: kindColor(spot.kind) }}>{tie.word}</span>
                <span className={`line-clamp-2 text-sm ${tie.inApp ? 'text-[var(--home-accent)]' : 'text-[var(--home-muted)]'}`}>{tie.short}</span>
              </>;
              const card = { className: nodeBox, picked: tie.inApp, faded: !tie.inApp, outline: tie.to === marked ? 'var(--home-green)' : undefined, 'aria-label': label };
              return (
                <div key={spot.key} className={`absolute flex flex-col ${grows}`} style={style}>
                  {tie.inApp && !onPick
                    ? <Card href={tiesHref(tie.to)} {...card}>{body}</Card>
                    : <Card as="button" onClick={() => pick(tie)} {...card}>{body}</Card>}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {open === undefined && (
        <div className="flex flex-wrap justify-center gap-x-3.5 gap-y-1">
          {groups.map(g => (
            <span key={g.kind} className="flex items-center gap-1 text-[0.8125rem] text-[var(--home-muted)]">
              <svg aria-hidden width={14} height={4}><line x1={0} y1={2} x2={14} y2={2} stroke={kindColor(g.kind)} strokeWidth={3} strokeLinecap="round" /></svg>{g.word}
            </span>
          ))}
        </div>
      )}
      {listed.length > 0 && (
        <Card className="flex flex-col px-3.5 py-1">
          {listed.map(tie => (tie.inApp
            ? onPick
              ? <Button key={tie.to} variant="ghost" onClick={() => onPick(tie.to)} className="justify-start">{tie.to === marked && <Check size={16} aria-hidden />}{tie.name}</Button>
              : <Button key={tie.to} variant="ghost" href={tiesHref(tie.to)} className="justify-start">{tie.to === marked && <Check size={16} aria-hidden />}{tie.name}</Button>
            : <p key={tie.to} className={`leading-[2.1] ${tie.to === marked ? 'text-[var(--home-green)]' : 'text-[var(--home-muted)]'}`}>{tie.name}</p>))}
        </Card>
      )}
    </div>
  );
}

/** The sentence that states a tie, with its pages: what a click on someone with no page shows (the app's sheet). */
export function TieSays({ tie }: { tie: RingTie }) {
  return (
    <Card className="flex flex-col gap-1 p-4" lang="ar">
      <p className="text-lg leading-[1.8]">{tie.says}</p>
      <p className="text-sm text-[var(--home-muted)]">{tie.pages}{tie.reversed ? ' · من ترجمة الآخر' : ''}</p>
    </Card>
  );
}

const CHAIN_W = 220;
const CHAIN_GAP = 8;
const CHAIN_H = 44;
const CHAIN_ROW = 92;
const LABEL_W = 170;

/**
 * The one drawing of a chain of ties (the app's TiesChain): each person on the row of his distance from the first, each
 * line carrying the whole tie with both names («الزبير ابنُ صفية»). Inside a feed card the people are chips.
 */
export function TiesChain({ chain, inCard = false }: { chain: ChainView; inCard?: boolean }) {
  const { box, width } = useRoom(480);
  const depth = new Map<string, number>([[chain.first, 0]]);
  for (let changed = true; changed;) {
    changed = false;
    for (const step of chain.steps) {
      for (const [a, b] of [[step.from, step.to], [step.to, step.from]]) {
        if (depth.has(a) && !depth.has(b)) { depth.set(b, depth.get(a)! + 1); changed = true; }
      }
    }
  }
  const last = Math.max(0, ...depth.values());
  for (const node of chain.nodes) if (!depth.has(node.slug)) depth.set(node.slug, last + 1);
  const rows = new Map<number, string[]>();
  for (const node of chain.nodes) rows.set(depth.get(node.slug)!, [...(rows.get(depth.get(node.slug)!) ?? []), node.slug]);
  const place = new Map<string, { x: number; y: number; w: number }>();
  for (const [row, members] of rows) {
    const w = Math.min(CHAIN_W, (width - CHAIN_GAP * (members.length - 1)) / members.length);
    members.forEach((slug, i) => place.set(slug, { x: width / 2 + (i - (members.length - 1) / 2) * (w + CHAIN_GAP), y: CHAIN_H / 2 + 8 + row * CHAIN_ROW, w }));
  }
  const height = (Math.max(0, ...rows.keys()) + 1) * CHAIN_ROW;
  const ground = inCard ? 'var(--home-card)' : 'var(--home-paper)';
  return (
    <div ref={box} className="w-full" lang="ar">
      {width > 0 && (
        <div className="relative mx-auto" style={{ width, height }}>
          <svg width={width} height={height} className="absolute inset-0" aria-hidden>
            {chain.steps.map(step => {
              const p = place.get(step.from)!;
              const q = place.get(step.to)!;
              const a = edge(p, q, p.w / 2, CHAIN_H / 2);
              const b = edge(q, p, q.w / 2, CHAIN_H / 2);
              return <line key={`${step.from}>${step.to}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={kindColor(step.kind)} strokeWidth={2} />;
            })}
          </svg>
          {chain.steps.map((step, i) => {
            const a = place.get(step.from)!;
            const b = place.get(step.to)!;
            const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
            const room = Math.min(LABEL_W, ...chain.steps.filter((_, j) => j !== i).map(other => {
              const p = place.get(other.from)!;
              const q = place.get(other.to)!;
              return Math.abs((p.y + q.y) / 2 - mid.y) < 24 ? Math.abs((p.x + q.x) / 2 - mid.x) - 6 : Infinity;
            }));
            return (
              <p key={`l${step.from}>${step.to}`} className="absolute line-clamp-2 text-center text-[0.8125rem] leading-5"
                style={{ left: Math.max(0, Math.min(width - room, mid.x - room / 2)), top: mid.y - (room < LABEL_W ? 18 : 10), width: room, color: kindColor(step.kind), background: ground }}>
                {step.clause}
              </p>
            );
          })}
          {chain.nodes.map(node => {
            const at = place.get(node.slug)!;
            const picked = chain.picked.includes(node.slug);
            return (
              <div key={node.slug} className="absolute flex items-center justify-center" style={{ left: at.x - at.w / 2, top: at.y - CHAIN_H / 2, width: at.w, height: CHAIN_H }}>
                {inCard
                  ? <Chip label={node.name} on={picked} lit href={node.inApp ? tiesHref(node.slug) : undefined} className={node.inApp ? '' : 'opacity-70'} />
                  : <Card href={node.inApp ? tiesHref(node.slug) : undefined} picked={picked} faded={!node.inApp}
                    className={`flex min-h-11 w-full items-center justify-center px-2 py-1.5 text-center text-sm ${node.inApp ? 'text-[var(--home-accent)]' : 'text-[var(--home-muted)]'}`}>
                    <span className="line-clamp-2">{node.name}</span>
                  </Card>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** A father's name in the tree; a picked person's is picked and, `linked`, opens his page. */
function NasabName({ node, linked }: { node: NasabBox; linked: boolean }) {
  const text = <span className={node.slug ? 'text-[var(--home-accent)]' : ''}>{node.name}</span>;
  return node.slug && linked
    ? <Card href={`/people/${node.slug}`} picked className="flex min-h-11 items-center justify-center whitespace-nowrap px-3 py-1.5 text-center">{text}</Card>
    : <Card picked={!!node.slug} className="whitespace-nowrap px-3 py-1.5 text-center">{text}</Card>;
}

/** A node and his sons under him, joined by lines: a stem down from the father, a bar across the sons, a stem to each. */
function Branch({ node, linked }: { node: NasabBox; linked: boolean }) {
  const stem = 'mx-auto h-4 w-[1.5px] bg-[var(--home-muted)]';
  const many = node.children.length > 1;
  return (
    <div className="flex flex-col items-center">
      <NasabName node={node} linked={linked} />
      {node.children.length > 0 && <div className={stem} />}
      <div className="flex items-start">
        {node.children.map((child, i) => (
          <div key={child.key} className="flex flex-col items-center px-1">
            {many && (
              <div className="-mx-1 flex h-[1.5px] self-stretch">
                <div className={`flex-1 ${i === 0 ? '' : 'bg-[var(--home-muted)]'}`} />
                <div className={`flex-1 ${i === node.children.length - 1 ? '' : 'bg-[var(--home-muted)]'}`} />
              </div>
            )}
            {many && <div className={stem} />}
            <Branch node={child} linked={linked} />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * The nasab tree (the app's NasabTree): the tree of the picked people's fathers, the shared line above folded into one line
 * of names that opens; with meetings, where each pair meets and the chain to it, written out.
 */
export function NasabTree({ view, linked = true, children }: { view: NasabView;
  /** A picked person's name opens his page; not inside a quiz. */
  linked?: boolean; children?: ReactNode }) {
  const [open, setOpen] = useState<string[]>([]);
  return (
    <div className="flex flex-col gap-4" lang="ar">
      {view.trees.map(tree => {
        const shown = open.includes(tree.key);
        return (
          <div key={tree.key} className="flex flex-col gap-2.5">
            {tree.above.length > 0 && (
              <Button variant="ghost" aria-expanded={shown} onClick={() => setOpen(shown ? open.filter(k => k !== tree.key) : [...open, tree.key])} className="justify-start text-start">
                {shown ? <ChevronUp size={16} aria-hidden /> : <ChevronDown size={16} aria-hidden />}
                {`${(shown ? tree.above : tree.above.slice(0, 3)).join(' · ')}${!shown && tree.above.length > 3 ? ' …' : ''}`}
              </Button>
            )}
            <div className="overflow-x-auto"><div className="mx-auto w-fit"><Branch node={tree.start} linked={linked} /></div></div>
          </div>
        );
      })}
      {view.meetings.map(meeting => (
        <Card key={meeting.slug} className="flex flex-col gap-1.5 p-4">
          {meeting.at ? <>
            <p className="text-sm text-[var(--home-muted)]">يلتقيان في: {meeting.at}</p>
            {meeting.chains.map((chain, i) => <p key={i} className="text-[1.0625rem] leading-[1.85]">{chain}</p>)}
          </> : <p className="text-[0.9375rem] text-[var(--home-muted)]">{meeting.apart}</p>}
        </Card>
      ))}
      {children}
      <p className="text-[0.8125rem] leading-6 text-[var(--home-muted)]">
        الأسماء كما في نسب كل علَم في سير أعلام النبلاء؛ وإذا وقف نسبه عند جدٍّ أكمله نسبُ علَمٍ آخر يذكر الآباء أنفسهم.
      </p>
      <CreditFold credit={view.credit} />
    </div>
  );
}
