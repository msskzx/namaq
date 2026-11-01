'use client';

import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { GitBranch, Maximize2, Minus, Plus, RotateCw, ZoomIn } from 'lucide-react';
import Button from '@/components/common/Button';
import MushafText from '@/components/common/MushafText';
import { useLanguage } from '@/components/language/LanguageContext';
import { num } from '@/lib/quran/arabicNumber';
import { ayahEnds, branchesHref, keys, linkable, linkId, spell, type Branch, type BranchesView, type Variant } from '@/lib/quran/branches';
import type { JuzRange } from '@/lib/quran/juz';
import AyahContextButton from './AyahContext';
import { Fan, PathBox, PathButton, PathProvider, Stub, useOuterPaths, usePaths, type FanEntry } from './Paths';
import type { Surrounding } from '@/lib/quran/ayahContext';
import { anchorOf, NeighbourBox, SurroundToggle, targetStyle, useSurrounding, type Around } from './Surroundings';
import { reducedMotion, SLIDE, useSwipe } from '@/components/common/useSwipe';
import { noteStep, takeEntering } from './slide';

type Props = { prefixes?: Variant[]; offsets?: Record<string, number>; subtreeLinks?: Record<string, string>; view?: BranchesView; tree: Branch; names: Record<number, string>; variants?: Variant[]; showSpellings?: boolean; zoomable?: boolean; viewportHeight?: string | null; juz?: JuzRange | null; renderNode?: (node: Branch, index: number, tags: Record<string, Variant>) => React.ReactNode; label?: string; header?: React.ReactNode; steppable?: boolean | Neighbours; surround?: { on: boolean; sync?: boolean; data?: Surrounding } };
/** Which neighbouring trees exist; `true` means both. */
type Neighbours = { next: boolean; previous: boolean };
type NodeProps = Omit<Props, 'tree' | 'variants' | 'juz' | 'header' | 'steppable' | 'surround'> & { around?: Around; anchors?: string; node: Branch; parent?: Branch; path: string[]; tags: Record<string, Variant>; lead: number; juz?: JuzRange; indices: Map<Branch, number> };

// Every tree node has the same thin border; only a pinned path is coloured.
const LINE = 'border-[var(--home-rule)]';
const LIT = 'border-[var(--home-accent)]';
export const TONE: Record<string, string> = {
  '': 'text-[var(--home-ink)]',
  و: 'text-[var(--home-green)]',
  ف: 'text-[var(--home-root)]',
};

type Refs = { keys: string[]; names: Record<number, string>; tags?: Record<string, Variant> };

export function AyahRefs({ keys, names, tags = {}, className = 'mt-1' }: Refs & { className?: string }) {
  return (
    <span className={`flex flex-wrap gap-1 ${className}`}>
      {keys.map((key, index) => {
        const [surah, ayah] = key.split(':').map(Number);
        return (
          <span key={key} className="inline-flex items-center gap-1">
            {index > 0 && <span aria-hidden className="text-xs text-[var(--home-muted)]">·</span>}
            <span className="text-xs text-[var(--home-muted)]">{names[surah] ? `${names[surah]} ${num(ayah)}` : `${num(surah)}:${num(ayah)}`}</span>
            {tags[key] && <span className={`text-xs font-quran ${TONE[tags[key].conj]}`}><MushafText>{tags[key].word}</MushafText></span>}
          </span>
        );
      })}
    </span>
  );
}

function SubtreeButton({ href }: { href: string }) {
  const { language } = useLanguage();
  const label = language === 'ar' ? 'عرض هذا الجزء وحده' : 'Show only this part of the tree';
  return <Button size="sm" href={href} aria-label={label} title={label}><ZoomIn size={16} aria-hidden /></Button>;
}

export function spellings(node: Pick<Branch, 'forms'>, skip = 0) {
  const found = new Map<string, { words: string[]; keys: string[] }>();
  Object.entries(node.forms ?? {}).forEach(([key, words]) => {
    const text = JSON.stringify(words.slice(skip));
    found.set(text, { words: words.slice(skip), keys: [...(found.get(text)?.keys ?? []), key] });
  });
  return found.size > 1 ? [...found.values()].sort((a, b) => b.keys.length - a.keys.length) : [];
}

export function Marked({ node, ayahKeys, subject, siblings, names, children, skip = 0, offset = 0, enabled = true, references, before, after }: { references?: React.ReactNode; enabled?: boolean; node: Pick<Branch, 'forms'>; ayahKeys: string[]; subject?: string; siblings?: string[]; skip?: number; offset?: number; before?: React.ReactNode; after?: React.ReactNode; names: Record<number, string>; children: React.ReactNode }) {
  if (!enabled) return <>{children}{references}</>;
  const forms = Object.values(node.forms ?? {}).map(words => words.slice(skip));
  const differentWords = (forms[0] ?? []).flatMap((_, i) => new Set(forms.map(words => words[i])).size > 1 ? [offset + skip + i] : []);
  const others = (siblings ?? []).filter(key => !ayahKeys.includes(key));
  return <AyahContextButton ayahKeys={ayahKeys} subject={subject} siblings={others} spellings={spellings(node, skip)} spellingAt={offset + skip} differentWords={differentWords} names={names} references={references} before={before} after={after}>{children}</AyahContextButton>;
}

const nodeId = (index: number) => `n${index}`;

function Node({ node, parent, path, names, tags, lead, juz, renderNode, indices, showSpellings, view, around, anchors, subtreeLinks }: NodeProps) {
  const root = path.length === 0;
  const words = [...path, ...node.words];
  const shownWords = node.words.slice(root ? lead : 0);
  const boundary = node.ayat.length === 0 && shownWords.length > 0 && shownWords.every(word => word === '۝' || word.startsWith('﴿'));
  const id = nodeId(indices.get(node)!);
  const subject = (root ? shownWords : node.words).join(' ');
  const subtreeHref = linkable(words) ? branchesHref(linkId(words, keys(node).flatMap(key => (tags[key] ? [tags[key].conj] : []))), juz, { ...view, partition: node.partition }) : subtreeLinks?.[keys(node).join(' ')];
  const nexts: FanEntry[] = !around ? [] : node.ayat.flatMap(key => {
    const neighbour = around.data.after[around.ends[key]];
    return neighbour ? [{ key: `a${key}`, keys: [key], item: <NeighbourBox neighbour={neighbour} of={key} side="after" around={around} opens={id} /> }] : [];
  });
  const entries: FanEntry[] = [...node.children.map((child, i) => ({ key: `n${i}`, keys: keys(child), item: <Node node={child} parent={node} path={words} names={names} tags={tags} lead={lead} juz={juz} renderNode={renderNode} indices={indices} showSpellings={showSpellings} view={view} around={around} anchors={anchors} subtreeLinks={subtreeLinks} /> })), ...nexts];
  return (
    <div className="flex items-center">
      {boundary && <span aria-hidden className="shrink-0 px-1 font-quran text-lg text-[var(--home-muted)]">{shownWords.join(' ')}</span>}
      {!boundary && (!root || shownWords.length > 0 || node.ayat.length > 0) && <PathBox id={id} keys={keys(node)} lit={LIT} tone={LINE} className={`shrink-0 rounded border px-3 py-1.5 ${node.children.length === 0 ? 'max-w-sm' : 'max-w-xs'} bg-[var(--home-paper)] ${root ? 'text-xl' : 'text-lg'}`}>
        {anchors && node.ayat.map(key => <span key={key} data-anchor id={anchorOf(anchors, key)} />)}
        {renderNode && !root ? renderNode(node, indices.get(node)!, tags) : <Marked node={node} ayahKeys={keys(node)} subject={subject} siblings={node.children.length === 0 && parent ? keys(parent) : undefined} names={names} offset={path.length} skip={root ? lead : 0} enabled={showSpellings}
          references={node.ayat.length > 0 && <AyahRefs keys={node.ayat} names={names} tags={tags} />}
          before={<PathButton id={id} keys={keys(node)} subject={subject} />}
          after={!root && view?.kind !== 'inside' && node.children.length > 0 && subtreeHref && <SubtreeButton href={subtreeHref} />}>
          <span className="block font-quran leading-loose"><MushafText>{shownWords.join(' ')}</MushafText></span>
        </Marked>}
      </PathBox>}
      {entries.length > 0 && <>
        <Stub keys={entries.flatMap(entry => entry.keys)} />
        <Fan side="start" entries={entries} />
      </>}
    </div>
  );
}

function BeforeFan({ ayahKeys, around, opens }: { ayahKeys: string[]; around?: Around; opens: string }) {
  const boxes = !around ? [] : ayahKeys.flatMap(key => (around.data.before[key] ? [{ key, keys: [key], item: <NeighbourBox neighbour={around.data.before[key]!} of={key} side="before" around={around} opens={opens} /> }] : []));
  if (boxes.length === 0) return null;
  return <>
    <Fan side="end" label="الآيات السابقة" entries={boxes} />
    <Stub keys={boxes.map(box => box.key)} />
  </>;
}

const MAX_SCALE = 2;
const SCALE_STEP = 0.1;

type DiagramSize = { width: number; height: number; availableWidth: number; availableHeight: number };
/** Where the tree sits in its viewport: its scale and the offset of its top left corner, in pixels. */
type Camera = { s: number; x: number; y: number };

function fitTreeScale({ width, height, availableWidth, availableHeight }: DiagramSize) {
  return Math.min(MAX_SCALE, availableWidth / width, availableHeight / height);
}

const interactive = 'a, button, input, textarea, select, label, [contenteditable]';

function TreeViewport({ children, controls, enabled, ar, height, onStep, neighbours }: { children: React.ReactNode; controls?: React.ReactNode; enabled: boolean; ar: boolean; height?: string; onStep?: (forward: boolean) => void; neighbours?: Neighbours }) {
  const viewport = useRef<HTMLDivElement>(null);
  const lane = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<DiagramSize | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const outer = viewport.current;
    const inner = content.current;
    if (!outer || !inner) return;
    const measure = () => {
      const next = {
        width: inner.offsetWidth,
        height: inner.offsetHeight,
        availableWidth: outer.clientWidth,
        availableHeight: height ? outer.clientHeight : Math.max(240, Math.round(window.innerHeight * 0.7)),
      };
      if (!next.width || !next.height || !next.availableWidth) return;
      setSize(previous => previous && Object.keys(next).every(key => previous[key as keyof DiagramSize] === next[key as keyof DiagramSize]) ? previous : next);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(outer);
    observer.observe(inner);
    return () => observer.disconnect();
  }, [enabled, height]);

  // The tree is placed with a transform, never by scrolling, so a pinch can keep any point of the tree under
  // the fingers, and each finger move only writes one transform (no re-render, no flicker).
  // null is the fit: the whole tree, centred. Zooming out past the fit goes back to the fit.
  const camera = useRef<Camera | null>(null);
  const [, redraw] = useState(0);
  const fitted = size ? fitTreeScale(size) : 1;
  const viewHeight = (scale: number) => (size ? (height ? size.availableHeight : Math.min(size.height * scale, size.availableHeight)) : 0);
  const fitCamera = (): Camera => (size ? { s: fitted, x: (size.availableWidth - size.width * fitted) / 2, y: (viewHeight(fitted) - size.height * fitted) / 2 } : { s: 1, x: 0, y: 0 });
  /** Keeps the tree covering the viewport when it is bigger, and inside it when it is smaller. */
  const clamp = (wanted: Camera): Camera | null => {
    const scale = Math.min(MAX_SCALE, wanted.s);
    if (scale <= fitted + 0.005) return null;
    if (!size) return { ...wanted, s: scale };
    const span = (at: number, view: number, length: number) => Math.min(Math.max(at, Math.min(0, view - length)), Math.max(0, view - length));
    return { s: scale, x: span(wanted.x, size.availableWidth, size.width * scale), y: span(wanted.y, viewHeight(scale), size.height * scale) };
  };
  const shown = () => camera.current ?? fitCamera();
  const paintCamera = (next: Camera | null) => {
    const fitChanged = (next === null) !== (camera.current === null);
    camera.current = next;
    const view = shown();
    if (frameRef.current) frameRef.current.style.transform = `translate(${view.x}px, ${view.y}px)`;
    if (content.current) content.current.style.transform = `scale(${view.s})`;
    if (!height && viewport.current) viewport.current.style.height = `${viewHeight(view.s)}px`;
    if (fitChanged) redraw(version => version + 1);
  };
  /** Scales to `scale` keeping the viewport point (px, py) over the same spot of the tree. */
  const zoomTo = (scale: number, px: number, py: number, from = shown()) => {
    paintCamera(clamp({ s: scale, x: px - (px - from.x) * scale / from.s, y: py - (py - from.y) * scale / from.s }));
  };
  const zoomBy = (step: number) => {
    const from = shown();
    zoomTo(Number((from.s + step).toFixed(2)), (size?.availableWidth ?? 0) / 2, viewHeight(from.s) / 2);
  };
  const api = useRef({ zoomTo, paintCamera, clamp, shown });
  api.current = { zoomTo, paintCamera, clamp, shown };
  const manual = camera.current !== null;

  // Pinch (two fingers on a touch screen, a trackpad pinch that browsers send
  // as ctrl+wheel, or Safari's gesture events) zooms the tree, not the page.
  // The point between the fingers stays put while the tree grows around it.
  // Once zoomed in, one finger, a mouse drag or the wheel moves the tree around.
  useEffect(() => {
    const outer = viewport.current;
    if (!enabled || !outer) return;
    const local = (x: number, y: number) => { const box = outer.getBoundingClientRect(); return { x: x - box.left, y: y - box.top }; };
    const onWheel = (event: WheelEvent) => {
      const { zoomTo, paintCamera, clamp, shown } = api.current;
      if (event.ctrlKey) {
        event.preventDefault();
        const at = local(event.clientX, event.clientY);
        zoomTo(shown().s * Math.exp(-event.deltaY * 0.01), at.x, at.y);
        return;
      }
      const from = camera.current;
      if (!from) return;
      const next = clamp({ ...from, x: from.x - event.deltaX, y: from.y - event.deltaY });
      if (!next || (next.x === from.x && next.y === from.y)) return;
      event.preventDefault();
      paintCamera(next);
    };
    let pinch: { distance: number; x: number; y: number; from: Camera } | null = null;
    let pan: { x: number; y: number; from: Camera } | null = null;
    const fingers = (event: TouchEvent) => {
      const [a, b] = [event.touches[0], event.touches[1]];
      return { distance: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), ...local((a.clientX + b.clientX) / 2, (a.clientY + b.clientY) / 2) };
    };
    const onTouches = (event: TouchEvent) => {
      pinch = null;
      pan = null;
      if (event.touches.length === 2) pinch = { ...fingers(event), from: api.current.shown() };
      else if (event.touches.length === 1 && camera.current) pan = { x: event.touches[0].clientX, y: event.touches[0].clientY, from: camera.current };
    };
    const onTouchMove = (event: TouchEvent) => {
      if (pinch && event.touches.length === 2) {
        event.preventDefault();
        const now = fingers(event);
        if (!pinch.distance) return;
        const { from } = pinch;
        const scale = from.s * now.distance / pinch.distance;
        // The spot of the tree that was between the fingers follows them, both when they spread and when they move.
        api.current.paintCamera(api.current.clamp({ s: scale, x: now.x - (pinch.x - from.x) * scale / from.s, y: now.y - (pinch.y - from.y) * scale / from.s }));
        return;
      }
      if (pan && event.touches.length === 1) {
        if (event.cancelable) event.preventDefault();
        const { from } = pan;
        api.current.paintCamera(api.current.clamp({ ...from, x: from.x + event.touches[0].clientX - pan.x, y: from.y + event.touches[0].clientY - pan.y }));
      }
    };
    let drag: { x: number; y: number; from: Camera; moved: boolean } | null = null;
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0 || !camera.current || (event.target instanceof Element && event.target.closest(interactive))) return;
      drag = { x: event.clientX, y: event.clientY, from: camera.current, moved: false };
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!drag) return;
      const [dx, dy] = [event.clientX - drag.x, event.clientY - drag.y];
      if (!drag.moved && Math.hypot(dx, dy) < 4) return;
      drag.moved = true;
      api.current.paintCamera(api.current.clamp({ ...drag.from, x: drag.from.x + dx, y: drag.from.y + dy }));
    };
    const onPointerUp = () => {
      if (drag?.moved) window.addEventListener('click', event => event.stopPropagation(), { capture: true, once: true });
      drag = null;
    };
    let gesture: Camera | null = null;
    const onGestureStart = (event: Event) => { event.preventDefault(); gesture = api.current.shown(); };
    const onGestureChange = (event: Event) => {
      event.preventDefault();
      if ('ontouchstart' in window || !gesture) return;
      const { scale: ratio, clientX, clientY } = event as Event & { scale: number; clientX: number; clientY: number };
      const at = local(clientX, clientY);
      api.current.zoomTo(gesture.s * ratio, at.x, at.y, gesture);
    };
    outer.addEventListener('wheel', onWheel, { passive: false });
    outer.addEventListener('touchstart', onTouches, { passive: true });
    outer.addEventListener('touchmove', onTouchMove, { passive: false });
    outer.addEventListener('touchend', onTouches);
    outer.addEventListener('touchcancel', onTouches);
    outer.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    outer.addEventListener('gesturestart', onGestureStart);
    outer.addEventListener('gesturechange', onGestureChange);
    return () => {
      outer.removeEventListener('wheel', onWheel);
      outer.removeEventListener('touchstart', onTouches);
      outer.removeEventListener('touchmove', onTouchMove);
      outer.removeEventListener('touchend', onTouches);
      outer.removeEventListener('touchcancel', onTouches);
      outer.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      outer.removeEventListener('gesturestart', onGestureStart);
      outer.removeEventListener('gesturechange', onGestureChange);
    };
  }, [enabled]);

  // Swiping drags the tree and its neighbour strips with the finger; past the threshold the tree slides out
  // and the neighbouring tree opens, sliding in from the other side (see slide.ts).
  const sliding = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const paint = (x: number, animate = false) => {
    const element = lane.current;
    if (!element) return;
    element.toggleAttribute('data-sliding', animate);
    element.style.transform = x ? `translate3d(${x}px, 0, 0)` : '';
  };
  const has = (forward: boolean) => !!onStep && (!neighbours || (forward ? neighbours.next : neighbours.previous));
  // Forward is a drag to the right in Arabic (the next tree sits on the left) and to the left in English.
  const sign = (forward: boolean) => (forward === ar ? 1 : -1);
  const slide = (forward: boolean) => {
    if (!has(forward)) return;
    clearTimeout(sliding.current);
    const leave = () => { noteStep(forward); onStep?.(forward); sliding.current = setTimeout(() => paint(0), 2000); };
    if (reducedMotion() || !lane.current?.clientWidth) { leave(); return; }
    paint(sign(forward) * lane.current.clientWidth, true);
    sliding.current = setTimeout(leave, SLIDE);
  };
  const settleBack = () => {
    clearTimeout(sliding.current);
    paint(0, true);
    sliding.current = setTimeout(() => paint(0), SLIDE);
  };
  const { justSwiped } = useSwipe(lane, enabled && !!onStep, {
    allowed: () => camera.current === null,
    forward: dx => (ar ? dx > 0 : dx < 0),
    canStep: has,
    start: () => { clearTimeout(sliding.current); paint(0); },
    drag: x => paint(x),
    step: slide,
    cancel: settleBack,
  });
  const stepRef = useRef<((forward: boolean) => void) | undefined>(undefined);
  stepRef.current = !manual && onStep ? slide : undefined;
  useEffect(() => {
    if (!enabled) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || document.querySelector('dialog[open]')) return;
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable]')) return;
      const step = stepRef.current;
      if (!step) return;
      step((event.key === 'ArrowLeft') === ar);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled, ar]);
  useEffect(() => () => clearTimeout(sliding.current), []);
  // A tree opened by a step slides in from the side the previous one left towards, once it has its fit size.
  const entered = useRef(false);
  useLayoutEffect(() => {
    if (entered.current || !size || !enabled) return;
    entered.current = true;
    const forward = takeEntering();
    const element = lane.current;
    if (forward === null || !element?.clientWidth || reducedMotion()) return;
    paint(-sign(forward) * element.clientWidth);
    void element.offsetWidth;
    paint(0, true);
    sliding.current = setTimeout(() => paint(0), SLIDE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, enabled]);

  if (!enabled) return <>
    {controls && <div className="mb-3 flex flex-wrap items-center justify-between gap-3">{controls}</div>}
    <div className="flex w-max items-center">{children}</div>
  </>;

  const labels = ar ? {
    fit: 'ملاءمة',
    out: 'تصغير',
    in: 'تكبير',
  } : {
    fit: 'Fit',
    out: 'Zoom out',
    in: 'Zoom in',
  };
  // A size change (a turned phone, the side pane) keeps the zoom but pulls the tree back into view.
  if (camera.current) camera.current = clamp(camera.current);
  const view = shown();
  // The dashed strips at the sides are the neighbouring trees peeking in, as in the ayah matrix.
  const edge = (forward: boolean) => {
    if (!has(forward)) return <div aria-hidden className="w-4 shrink-0 sm:w-8" />;
    const label = forward ? (ar ? 'الشجرة التالية' : 'Next tree') : (ar ? 'الشجرة السابقة' : 'Previous tree');
    return <button type="button" data-tree-edge={forward ? 'next' : 'previous'} aria-label={label} className="flex w-5 shrink-0 items-start justify-center rounded-sm border-x border-dashed border-[var(--home-rule)] pt-4 text-[var(--home-muted)] hover:bg-[var(--home-paper-deep)] hover:text-[var(--home-ink)] sm:w-8" title={label} onClick={() => { if (!justSwiped()) slide(forward); }}>
      <GitBranch size={16} aria-hidden />
    </button>;
  };
  const viewportHeight = height ?? (size ? viewHeight(view.s) : undefined);
  const touch = manual ? 'touch-none cursor-grab active:cursor-grabbing' : onStep ? 'touch-pan-y' : 'touch-pan-x touch-pan-y';

  return <>
    <div dir={ar ? 'rtl' : 'ltr'} className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--home-rule)] pb-3">
      {controls && <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-[var(--home-muted)]">{controls}</div>}
      <div role="toolbar" aria-label={ar ? 'تكبير الشجرة' : 'Tree zoom'} className={`flex flex-wrap items-center gap-2 ${onStep ? 'max-sm:hidden' : ''}`}>
        <Button size="lg" aria-pressed={!manual} onClick={() => paintCamera(null)} aria-label={labels.fit} title={labels.fit}><Maximize2 size={16} aria-hidden /></Button>
        <div dir="ltr" className="flex items-center gap-1">
          <Button size="lg" onClick={() => zoomBy(-SCALE_STEP)} disabled={!manual} aria-label={labels.out} title={labels.out}><Minus size={16} aria-hidden /></Button>
          <Button size="lg" onClick={() => zoomBy(SCALE_STEP)} disabled={view.s >= MAX_SCALE} aria-label={labels.in} title={labels.in}><Plus size={16} aria-hidden /></Button>
        </div>
      </div>
    </div>
    <div ref={lane} data-tree-lane dir={ar ? 'rtl' : 'ltr'} className="flex items-stretch gap-1 sm:gap-2 data-[sliding]:transition-transform data-[sliding]:duration-[250ms] data-[sliding]:ease-out motion-reduce:transition-none">
      {onStep && edge(false)}
      <div ref={viewport} data-tree-viewport data-zoomed={manual || undefined} className={`relative min-w-0 flex-1 overflow-hidden ${touch}`} style={{ height: viewportHeight }}>
        <div ref={frameRef} data-tree-frame dir="ltr" className="absolute left-0 top-0" style={{ transform: `translate(${view.x}px, ${view.y}px)` }}>
          <div ref={content} data-tree-content dir={ar ? 'rtl' : 'ltr'} className="absolute left-0 top-0 flex w-max items-center" style={{ transform: `scale(${view.s})`, transformOrigin: '0 0' }}>{children}</div>
        </div>
      </div>
      {onStep && edge(true)}
    </div>
  </>;
}

// docs/plans/quran-shared-openings.md
export default function BranchTree({ tree, names, variants = [], prefixes, subtreeLinks, showSpellings = true, zoomable = true, viewportHeight = 'clamp(22rem, 70svh, 36rem)', juz = null, renderNode, label = 'شجرة العبارات المشتركة', header, steppable = false, view: given, surround }: Props) {
  const id = useId();
  const ar = useLanguage().language === 'ar';
  const [on, setOn] = useState(() => (surround?.sync && typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('c') === '1' : surround?.on ?? false));
  const view = surround?.sync && given ? { ...given, context: on } : given;
  const outer = useOuterPaths();
  const own = usePaths();
  const paths = outer ?? own;
  const all = keys(tree);
  const ends = ayahEnds(tree);
  const emptyKeys = (prefixes ?? []).filter(prefix => !prefix.word).flatMap(prefix => prefix.keys);
  const previousKey = (key: string) => {
    const [surah, ayah] = key.split(':').map(Number);
    return ayah > 1 ? `${surah}:${ayah - 1}` : surah === 1 ? '114:6' : undefined;
  };
  const requiredKeys = emptyKeys.filter(key => previousKey(key));
  const mandatory = useSurrounding(requiredKeys.length > 0, requiredKeys, {}, surround?.data);
  const precedingKey = (key: string) => mandatory.data?.before[key]?.key ?? previousKey(key);
  const optionalKeys = all.flatMap(key => emptyKeys.includes(key) ? precedingKey(key) ?? key : key);
  const extraKeys = emptyKeys.flatMap(key => precedingKey(key) ?? []);
  const preloaded = surround?.data && extraKeys.every(key => Number(key.split(':')[1]) === 1 || Object.prototype.hasOwnProperty.call(surround.data!.before, key)) ? surround.data : undefined;
  const { data, isLoading, error } = useSurrounding(!!surround && on, optionalKeys, ends, preloaded);
  const around: Around | undefined = surround && on && (data ?? surround.data) ? { data: (data ?? surround.data)!, ends, inTree: new Set(all), names, tree: id } : undefined;
  const mandatoryAround: Around | undefined = mandatory.data ? { data: mandatory.data, ends, inTree: new Set(all), names, tree: id } : undefined;
  const indices = new Map<Branch, number>();
  const visit = (node: Branch) => {
    indices.set(node, indices.size - 1);
    node.children.forEach(visit);
  };
  visit(tree);
  const tags = Object.fromEntries(variants.flatMap(variant => variant.keys.map(key => [key, variant])));
  const rootId = nodeId(-1);
  const step = (forward: boolean) => document.querySelector<HTMLAnchorElement>(`a[data-step="${forward ? 'next' : 'previous'}"]`)?.click();
  const controls = (header || surround) ? <>
    {header}
    {surround && <SurroundToggle on={on} onChange={setOn} sync={surround.sync} loading={isLoading} failed={!!error} />}
  </> : undefined;
  return (
    <PathProvider value={paths}>
      <div tabIndex={0} role="region" aria-label={label} data-tree={id} className={`${zoomable ? 'overflow-hidden' : 'overflow-auto'} rounded-lg border border-[var(--home-rule)] bg-[var(--home-paper)] ${steppable ? 'p-2 sm:p-4' : 'p-4'} text-[var(--home-ink)]`}>
        {around && <style>{targetStyle(id)}</style>}
        {mandatory.isLoading && <p role="status" className="text-sm text-[var(--home-muted)]">{ar ? 'جارٍ تحميل الآيات السابقة' : 'Loading preceding ayat'}</p>}
        {mandatory.error && <div role="alert" className="flex items-center gap-2 text-sm text-[var(--home-accent)]">
          <span>{ar ? 'تعذّر تحميل الآيات السابقة.' : 'Could not load the preceding ayat.'}</span>
          <Button size="lg" onClick={() => void mandatory.mutate()} aria-label={ar ? 'حاول مجددًا' : 'Try again'} title={ar ? 'حاول مجددًا' : 'Try again'}><RotateCw aria-hidden /></Button>
        </div>}
        <TreeViewport controls={controls} enabled={zoomable} ar={ar} height={viewportHeight ?? undefined} onStep={steppable ? step : undefined} neighbours={typeof steppable === 'object' ? steppable : undefined}>
          {prefixes && prefixes.length > 0 ? <>
            <Fan side="end" label={ar ? 'ما قبل العبارة' : 'Before the phrase'} entries={prefixes.flatMap((prefix, i): FanEntry[] => prefix.word ? [{ key: `${prefix.word}:${i}`, keys: prefix.keys, item: <>
              <BeforeFan ayahKeys={prefix.keys} around={around} opens={`p${i}`} />
              <PathBox id={`p${i}`} keys={prefix.keys} lit={LIT} tone={LINE} className="max-w-sm shrink-0 rounded border bg-[var(--home-paper)] px-3 py-1.5 text-xl leading-loose">
                <Marked node={prefix} ayahKeys={prefix.keys} subject={prefix.word} siblings={all} names={names} enabled={showSpellings} before={<PathButton id={`p${i}`} keys={prefix.keys} subject={prefix.word} />}>
                  <span className="block font-quran"><MushafText>{prefix.word}</MushafText></span>
                </Marked>
              </PathBox>
            </> }] : prefix.keys.flatMap(key => {
              const previous = precedingKey(key);
              if (!previous) return [{ key, keys: [key], item: <PathBox id={`p${i}:${key}`} keys={[key]} lit={LIT} tone={LINE} className="shrink-0 rounded border bg-[var(--home-paper)] px-3 py-1.5">
                <span className="block text-base text-[var(--home-muted)]">{ar ? 'بداية السورة' : 'Start of surah'}</span>
                <AyahRefs keys={[key]} names={names} />
              </PathBox> }];
              const neighbour = mandatoryAround?.data.before[key];
              if (!neighbour || !mandatoryAround) return [];
              const earlier = around?.data.before[previous];
              return [{ key, keys: [key], item: <>
                {earlier && around && <><NeighbourBox neighbour={earlier} of={key} side="before" around={around} opens={rootId} nodeId={`earlier${key}`} /><Stub keys={[key]} /></>}
                <NeighbourBox neighbour={neighbour} of={key} side="before" around={mandatoryAround} opens={rootId} />
              </> }];
            }))} />
            <Stub keys={all} />
          </> : variants.length > 0 ? <>
            <Fan side="end" label="صيغ الكلمة الأولى" entries={variants.map((variant, i) => ({ key: variant.word, keys: variant.keys, item: <>
              <BeforeFan ayahKeys={variant.keys} around={around} opens={`v${i}`} />
              <PathBox id={`v${i}`} keys={variant.keys} lit={`${LIT} ${TONE[variant.conj]}`} tone={`${LINE} ${TONE[variant.conj]}`} className="shrink-0 rounded border bg-[var(--home-paper)] px-3 py-1.5 text-xl leading-loose">
                <Marked node={variant} ayahKeys={variant.keys} subject={variant.word} siblings={variants.flatMap(other => other.keys)} names={names} enabled={showSpellings}
                  before={<PathButton id={`v${i}`} keys={variant.keys} subject={variant.word} />}
                  after={!renderNode && <SubtreeButton href={branchesHref(variant.id, juz ?? undefined, { ...view, spelling: spell(variant.word), partition: variant.partition })} />}>
                  <span className="block font-quran"><MushafText>{variant.word}</MushafText></span>
                </Marked>
              </PathBox>
            </> }))} />
            <Stub keys={all} />
          </> : <BeforeFan ayahKeys={all} around={around} opens={rootId} />}
          <Node node={tree} path={[]} names={names} tags={tags} lead={!prefixes && variants.length > 0 ? 1 : 0} juz={juz ?? undefined} renderNode={renderNode} indices={indices} showSpellings={showSpellings} view={view} around={around} anchors={surround ? id : undefined} subtreeLinks={subtreeLinks} />
        </TreeViewport>
      </div>
    </PathProvider>
  );
}
