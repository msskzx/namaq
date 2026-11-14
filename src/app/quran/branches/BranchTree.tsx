'use client';

import theme from './BranchTheme.module.css';

import { createPortal } from 'react-dom';
import { useDesktopRail } from '@/components/common/NavBar';
import LoadingDots from '@/components/common/LoadingDots';
import React, { createContext, useContext, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minus, Plus, RotateCw, ZoomIn } from 'lucide-react';
import Button from '@/components/common/Button';
import MushafText from '@/components/common/MushafText';
import { useLanguage } from '@/components/language/LanguageContext';
import { num } from '@shared/quran/arabicNumber';
import { ayahEnds, ayatLabel, branchesHref, keys, linkable, linkId, shownAyat, spell, type Branch, type BranchAyah, type BranchesView, type Variant } from '@shared/quran/branches';
import type { JuzRange } from '@shared/quran/juz';
import { writtenForms } from '@shared/quran/writtenForms';
import { Fan, PathBox, PathButton, PathProvider, PathScope, Stub, useOuterPaths, usePaths, type FanEntry } from './Paths';
import { treeContexts, type AyahContext, type Surrounding } from '@shared/quran/ayahContext';
import { anchorOf, AroundStatus, NeighbourBox, SurroundToggle, targetStyle, useAroundSetting, useRotated, useSurrounding, type Around } from './Surroundings';
import { reducedMotion, SLIDE, useSwipe } from '@/components/common/useSwipe';
import { growthPlan } from '@shared/quran/growth';
import { useGrowTarget } from './Grow';
import { useGroupConnections } from './GroupConnections';

type Props = { organic?: boolean; hideArrows?: boolean; ayat?: BranchAyah[]; prefixes?: Variant[]; offsets?: Record<string, number>; subtreeLinks?: Record<string, string>; view?: BranchesView; tree: Branch; names: Record<number, string>; variants?: Variant[]; showSpellings?: boolean; zoomable?: boolean; zoomInRail?: boolean | 'preview'; viewportHeight?: string | null; juz?: JuzRange | null; renderNode?: (node: Branch, index: number, tags: Record<string, Variant>) => React.ReactNode; label?: string; header?: React.ReactNode; steppable?: boolean | Neighbours; direction?: 'side' | 'auto'; rotatable?: boolean; growable?: boolean; surround?: { on: boolean; sync?: boolean; data?: Surrounding } };
/** Which neighbouring trees exist; `true` means both. */
type Neighbours = { next: boolean; previous: boolean; nextCard?: React.ReactNode; previousCard?: React.ReactNode;
  /** Where the tree is not the page's own (the home feed): the swipe steps here instead of following the page's step links. */
  onStep?: (forward: boolean) => void };
type NodeProps = Omit<Props, 'tree' | 'variants' | 'juz' | 'header' | 'steppable' | 'surround' | 'growable'> & { start?: React.ReactNode; around?: Around; anchors?: string; node: Branch; parent?: Branch; path: string[]; tags: Record<string, Variant>; lead: number; juz?: JuzRange; indices: Map<Branch, number> };

const LINE = 'border-[var(--home-rule)]';
const LIT = 'border-[var(--home-accent)]';
export const TONE: Record<string, string> = {
  '': 'text-[var(--home-ink)]',
  و: 'text-[var(--home-green)]',
  ف: 'text-[var(--home-root)]',
};

type Refs = { keys: string[]; names: Record<number, string>; tags?: Record<string, Variant>;
  /** The ayat each key's label names, when a branch runs on past its own ayah (see shownAyat). */
  spans?: Record<string, string[]> };

export function AyahRefs({ keys, names, tags = {}, spans = {}, className = 'mt-1' }: Refs & { className?: string }) {
  return (
    <span className={`flex flex-wrap gap-1 ${className}`}>
      {keys.map((key, index) => {
        return (
          <span key={key} className="inline-flex items-center gap-1">
            {index > 0 && <span aria-hidden className="text-xs text-[var(--home-muted)]">·</span>}
            <span className="text-xs text-[var(--home-muted)]">{ayatLabel(spans[key] ?? [key], names)}</span>
            {tags[key] && <span className={`text-xs font-quran ${TONE[tags[key].conj]}`}><MushafText>{tags[key].word}</MushafText></span>}
          </span>
        );
      })}
    </span>
  );
}

function ReferenceHeader({ children }: { children: React.ReactNode }) {
  return <header className="mb-1 border-b border-[var(--home-rule)] py-0.5 text-center text-xs leading-normal text-[var(--home-muted)]">{children}</header>;
}

function SubtreeButton({ href }: { href: string }) {
  const { language } = useLanguage();
  const label = language === 'ar' ? 'عرض هذا الجزء وحده' : 'Show only this part of the tree';
  return <span data-share-skip className="contents"><Button size="sm" href={href} aria-label={label} title={label}><ZoomIn size={16} aria-hidden /></Button></span>;
}

export function spellings(node: Pick<Branch, 'forms'>, skip = 0) {
  const found = new Map<string, { words: string[]; keys: string[] }>();
  Object.entries(node.forms ?? {}).forEach(([key, words]) => {
    const text = JSON.stringify(words.slice(skip));
    found.set(text, { words: words.slice(skip), keys: [...(found.get(text)?.keys ?? []), key] });
  });
  return found.size > 1 ? [...found.values()].sort((a, b) => b.keys.length - a.keys.length) : [];
}

/** The node whose words are being drawn: how each of its ayat writes them, and where the node starts in the ayah. */
const Written = createContext<{ forms?: Branch['forms']; offset: number; names: Record<number, string> }>({ offset: 0, names: {} });

export function Marked({ node, children, offset = 0, enabled = true, references, before, after, names = {} }: { references?: React.ReactNode; enabled?: boolean; node: Pick<Branch, 'forms'>; ayahKeys?: string[]; subject?: string; siblings?: string[]; skip?: number; offset?: number; before?: React.ReactNode; after?: React.ReactNode; names?: Record<number, string>; children: React.ReactNode }) {
  const buttons = (before || after) && <span className="mt-1 flex flex-wrap items-center justify-center gap-2" dir="rtl">{before}{after}</span>;
  if (!enabled) return <>{children}{references}</>;
  return <><Written.Provider value={{ forms: node.forms, offset, names }}>{children}</Written.Provider>{references}{buttons}</>;
}

const Comparison = createContext<{ contexts: AyahContext[]; offsets: Record<string, number> }>({ contexts: [], offsets: {} });

/** A node's words: shared-word colours when the tree compares ayat, and amber for a word its ayat voice differently (inside `Marked`). */
export function TreeWords({ words, ayahKeys, at = 0, prefix = false }: { words: string[]; ayahKeys: string[]; at?: number; prefix?: boolean }) {
  const { contexts, offsets } = useContext(Comparison);
  const written = useContext(Written);
  const lit = useOuterPaths()?.lit;
  const ar = useLanguage().language === 'ar';
  return words.map((word, i) => {
    const matches = ayahKeys.map(key => {
      const match = contexts.find(context => context.ayah.key === key)?.match;
      const index = (prefix ? 0 : offsets[key] ?? 0) + at + i;
      return match?.rooted.includes(index) ? 'root' : match?.exact.includes(index) ? 'exact' : undefined;
    });
    const kind = word !== '۝' && !word.startsWith('﴿') && matches.length && matches.every(Boolean) ? matches.includes('root') ? 'root' : 'exact' : undefined;
    const forms = writtenForms(written, at + i - written.offset, word, lit);
    const differs = forms.length > 1 || forms[0].word !== word;
    const shown = forms[0].word.replace(/^﴿(.+)﴾$/, word.startsWith('﴿') ? '$&' : '$1');
    const text = kind ? <mark data-match={kind} className={`bg-transparent ${kind === 'root' ? 'text-[var(--home-root)]' : 'text-[var(--home-accent)]'}`} title={kind === 'root' ? (ar ? 'نفس اللفظ أو الجذر' : 'Same lemma or root') : (ar ? 'نفس الكلمة' : 'Same word')}><MushafText>{shown}</MushafText></mark> : <MushafText>{shown}</MushafText>;
    const title = ar ? 'تختلف حركاتها بين الآيات' : 'Voiced differently across the ayat';
    // docs/adr/0035-a-tree-node-shows-words-only-as-the-mushaf-writes-them.md
    return <React.Fragment key={i}>{i > 0 && ' '}{forms.length > 1 ? (
      <span data-forms title={title} className="mx-1 inline-flex flex-col rounded-md border-x-2 border-[var(--home-amber)] px-1.5 align-middle leading-normal">
        {forms.map(form => (
          <span key={form.word} data-form className="flex flex-col items-center border-dashed border-[var(--home-rule)] [&+&]:border-t">
            <span className="text-[var(--home-amber)]"><MushafText>{form.word}</MushafText></span>
            <span style={{ fontFamily: 'var(--font-amiri), serif' }}><AyahRefs keys={form.keys} names={written.names} className="-mt-1 justify-center pb-0.5" /></span>
          </span>
        ))}
      </span>
    ) : differs && kind !== 'root' && word !== '۝' ? <span data-differs className="text-[var(--home-amber)]" title={title}><MushafText>{shown}</MushafText></span> : text}</React.Fragment>;
  });
}

const nodeId = (index: number) => `n${index}`;

function Node({ node, parent, path, start, names, tags, lead, juz, renderNode, indices, showSpellings, view, around, anchors, subtreeLinks }: NodeProps) {
  const root = path.length === 0;
  const singleSurah = node.ayat.length > 0 && node.ayat.every(key => key.split(':')[0] === node.ayat[0].split(':')[0]);
  const references = node.ayat.length > 0 && <AyahRefs keys={node.ayat} names={names} tags={tags} spans={shownAyat(node, path)} className={singleSurah ? 'justify-center' : 'mt-1'} />;
  const words = [...path, ...node.words];
  const shownWords = node.words.slice(root ? lead : 0);
  const boundary = node.ayat.length === 0 && shownWords.length > 0 && shownWords.every(word => word === '۝' || word.startsWith('﴿'));
  const id = nodeId(indices.get(node)!);
  const subject = (root ? shownWords : node.words).join(' ');
  const subtreeHref = subtreeLinks ? subtreeLinks[keys(node).join(' ')] : linkable(words) ? branchesHref(linkId(words, keys(node).flatMap(key => (tags[key] ? [tags[key].conj] : []))), juz, { ...view, partition: node.partition }) : undefined;
  const nexts: FanEntry[] = !around ? [] : node.ayat.flatMap(key => {
    const neighbour = around.data.after[around.ends[key]];
    return neighbour ? [{ key: `a${key}`, keys: [key], item: <NeighbourBox neighbour={neighbour} of={key} side="after" around={around} /> }] : [];
  });
  const entries: FanEntry[] = [...node.children.map((child, i) => ({ key: `n${i}`, keys: keys(child), item: <Node node={child} parent={node} path={words} names={names} tags={tags} lead={lead} juz={juz} renderNode={renderNode} indices={indices} showSpellings={showSpellings} view={view} around={around} anchors={anchors} subtreeLinks={subtreeLinks} /> })), ...nexts];
  return (
    <div data-grow={id} className="flex items-center [[data-down]_&]:flex-col">
      {boundary && <span aria-hidden className="shrink-0 px-1 font-quran text-lg text-[var(--home-muted)]">{shownWords.join(' ')}</span>}
      {!boundary && (!root || shownWords.length > 0 || node.ayat.length > 0) && <PathBox id={id} keys={keys(node)} lit={LIT} tone={LINE} className={`${node.children.length === 0 ? 'max-w-52 [[data-down]_&]:max-w-44' : 'max-w-48 [[data-down]_&]:max-w-sm'} ${root ? 'text-xl' : 'text-lg'}`}>
        {anchors && node.ayat.map(key => <span key={key} data-anchor id={anchorOf(anchors, key)} />)}
        {renderNode && !root ? renderNode(node, indices.get(node)!, tags) : <>
          {start}
          {singleSurah && <ReferenceHeader>{references}</ReferenceHeader>}
          <Marked node={node} ayahKeys={keys(node)} subject={subject} siblings={node.children.length === 0 && parent ? keys(parent) : undefined} names={names} offset={path.length} skip={root ? lead : 0} enabled={showSpellings}
            references={!singleSurah && references}
            before={<PathButton id={id} keys={keys(node)} subject={subject} />}
            after={!root && view?.kind !== 'inside' && node.children.length > 0 && subtreeHref && <SubtreeButton href={subtreeHref} />}>
            <span className="block font-quran leading-loose"><TreeWords words={shownWords} ayahKeys={keys(node)} at={path.length + (root ? lead : 0)} /></span>
          </Marked>
        </>}
      </PathBox>}
      {entries.length > 0 && <>
        <Stub keys={entries.flatMap(entry => entry.keys)} />
        <Fan side="start" entries={entries} />
      </>}
    </div>
  );
}

function BeforeFan({ ayahKeys, around }: { ayahKeys: string[]; around?: Around }) {
  const boxes = !around ? [] : ayahKeys.flatMap(key => (around.data.before[key] ? [{ key, keys: [key], item: <NeighbourBox neighbour={around.data.before[key]!} of={key} side="before" around={around} /> }] : []));
  if (boxes.length === 0) return null;
  return <>
    <Fan side="end" label="الآيات السابقة" entries={boxes} />
    <Stub keys={boxes.map(box => box.key)} />
  </>;
}

const MAX_SCALE = 2;
const DOWN_GAIN = 1.15;
const SCALE_STEP = 0.1;

type DiagramSize = { width: number; height: number; availableWidth: number; availableHeight: number };
/** Where the tree sits in its viewport: its scale and the offset of its top left corner, in pixels. */
type Camera = { s: number; x: number; y: number };

function fitTreeScale({ width, height, availableWidth, availableHeight }: DiagramSize) {
  return Math.min(MAX_SCALE, availableWidth / width, availableHeight / height);
}

/** Room between the card and its neighbours' cards, enough for the arrows. */
const NEIGHBOUR_GAP = '2rem';

const interactive = 'a, button, input, textarea, select, label, [contenteditable]';

function TreeViewport({ children, controls, enabled, ar, height, onStep, neighbours, lane, auto = false, flip = false, zoomInRail = false, hideArrows = false }: { children: React.ReactNode; controls?: React.ReactNode; enabled: boolean; ar: boolean; height?: string; onStep?: (forward: boolean) => void; neighbours?: Neighbours; lane: React.RefObject<HTMLDivElement | null>; auto?: boolean; flip?: boolean; zoomInRail?: boolean | 'preview'; hideArrows?: boolean }) {
  const desktopRail = useDesktopRail();
  const rail = zoomInRail ? desktopRail : null;
  const viewport = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<DiagramSize | null>(null);
  const [down, setDown] = useState(false);

  // Measured before the first paint, so a tree opens at its fit size rather than growing into it.
  useLayoutEffect(() => {
    if (!enabled) return;
    const outer = viewport.current;
    const inner = content.current;
    if (!outer || !inner) return;
    // Draws the tree both ways (a data attribute switches the layout in CSS, no re-render) and keeps the one that fits bigger.
    const drawn = (top: boolean) => {
      inner.toggleAttribute('data-down', top);
      return { width: inner.offsetWidth, height: inner.offsetHeight };
    };
    const measure = () => {
      const available = { availableWidth: outer.clientWidth, availableHeight: height ? outer.clientHeight : Math.max(240, Math.round(window.innerHeight * 0.7)) };
      let box = { width: inner.offsetWidth, height: inner.offsetHeight };
      if (auto) {
        const side = drawn(false);
        const top = drawn(true);
        const fit = (size: { width: number; height: number }) => fitTreeScale({ ...size, ...available });
        // Top-down only when it is clearly bigger: right to left stays the usual way to read a tree.
        const pick = side.width > 0 && (fit(top) > fit(side) * DOWN_GAIN) !== flip;
        box = drawn(pick);
        setDown(pick);
      }
      const next = { ...box, ...available };
      if (!next.width || !next.height || !next.availableWidth) return;
      setSize(previous => previous && Object.keys(next).every(key => previous[key as keyof DiagramSize] === next[key as keyof DiagramSize]) ? previous : next);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(outer);
    observer.observe(inner);
    return () => observer.disconnect();
  }, [enabled, height, auto, flip]);

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
  // A rotated tree starts again at its fit.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (camera.current) paintCamera(null); }, [down]);
  const zoomTo = (scale: number, px: number, py: number, from = shown()) => {
    paintCamera(clamp({ s: scale, x: px - (px - from.x) * scale / from.s, y: py - (py - from.y) * scale / from.s }));
  };
  const zoomBy = (step: number) => {
    const from = shown();
    zoomTo(Number((from.s + step).toFixed(2)), (size?.availableWidth ?? 0) / 2, viewHeight(from.s) / 2);
  };
  const api = useRef({ zoomTo, paintCamera, clamp, shown });
  api.current = { zoomTo, paintCamera, clamp, shown };
  // A size change (a turned phone, the side pane) keeps the zoom but pulls the tree back into view,
  // or back to the fit when the fit is now bigger.
  if (camera.current) camera.current = clamp(camera.current);
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
      event.preventDefault();
      outer.setPointerCapture?.(event.pointerId);
      drag = { x: event.clientX, y: event.clientY, from: camera.current, moved: false };
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!drag) return;
      if (event.buttons === 0) { onPointerUp(); return; }
      const [dx, dy] = [event.clientX - drag.x, event.clientY - drag.y];
      if (!drag.moved && Math.hypot(dx, dy) < 4) return;
      drag.moved = true;
      api.current.paintCamera(api.current.clamp({ ...drag.from, x: drag.from.x + dx, y: drag.from.y + dy }));
    };
    function onPointerUp() {
      if (drag?.moved) {
        // The click the browser sends after a drag must not press the node under the pointer.
        const swallow = (event: MouseEvent) => event.stopPropagation();
        window.addEventListener('click', swallow, { capture: true, once: true });
        setTimeout(() => window.removeEventListener('click', swallow, { capture: true }), 0);
      }
      drag = null;
    }
    // Focusing a node outside the shown part (a quiz field, the tab key) scrolls the viewport; move the camera instead.
    const onScroll = () => {
      const [dx, dy] = [outer.scrollLeft, outer.scrollTop];
      if (!dx && !dy) return;
      outer.scrollLeft = 0;
      outer.scrollTop = 0;
      const from = camera.current;
      if (from) api.current.paintCamera(api.current.clamp({ ...from, x: from.x - dx, y: from.y - dy }));
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
    outer.addEventListener('scroll', onScroll);
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
      outer.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      outer.removeEventListener('gesturestart', onGestureStart);
      outer.removeEventListener('gesturechange', onGestureChange);
    };
  }, [enabled]);

  // Swiping drags the card with the finger, and the neighbouring tree's card comes in beside it; past the threshold
  // the neighbour's card slides into place and that tree opens where its card stopped.
  const sliding = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const leaving = useRef(false);
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
    if (!has(forward) || leaving.current) return;
    clearTimeout(sliding.current);
    leaving.current = true;
    // If the next tree never arrives (an offline phone), the old one comes back after a while.
    const leave = () => { onStep?.(forward); sliding.current = setTimeout(() => { leaving.current = false; paint(0); }, 8000); };
    const element = lane.current;
    if (reducedMotion() || !element?.clientWidth) { leave(); return; }
    // Move by exactly the distance to the neighbour's card, so it ends where this card was.
    const incoming = element.querySelector<HTMLElement>(`[data-tree-neighbour="${forward ? 'next' : 'previous'}"]`)?.getBoundingClientRect();
    const box = element.getBoundingClientRect();
    paint(incoming?.width ? box.left - incoming.left : sign(forward) * element.clientWidth, true);
    sliding.current = setTimeout(leave, SLIDE);
  };
  const settleBack = () => {
    clearTimeout(sliding.current);
    paint(0, true);
    sliding.current = setTimeout(() => paint(0), SLIDE);
  };
  const { justSwiped } = useSwipe(lane, enabled && !!onStep, {
    forward: dx => (ar ? dx > 0 : dx < 0),
    canStep: has,
    allowed: () => camera.current === null && !leaving.current,
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

  if (!enabled) return <>
    {controls && <div className="mb-3 flex flex-wrap items-center justify-between gap-3">{controls}</div>}
    <div data-tree-content className="flex w-max items-center">{children}</div>
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
  const view = shown();
  // Small arrows beside the card open the neighbouring trees (they replace the step buttons).
  // They are placed against the sliding lane around the card (the card itself is not positioned),
  // so the card's overflow does not clip them and they slide with it.
  const peek = (forward: boolean) => {
    if (!has(forward)) return null;
    const label = forward ? (ar ? 'الشجرة التالية' : 'Next tree') : (ar ? 'الشجرة السابقة' : 'Previous tree');
    const Arrow = forward === ar ? ChevronLeft : ChevronRight;
    // Forward sits past the card's end side (the left in Arabic): insetInlineStart: 100% puts it there.
    return <button type="button" data-tree-edge={forward ? 'next' : 'previous'} aria-label={label} title={label} onClick={() => { if (!justSwiped()) slide(forward); }}
      className="absolute top-1/2 flex h-12 w-4 -translate-y-1/2 items-center justify-center rounded-sm text-[var(--home-muted)] transition-colors hover:bg-[var(--home-paper-deep)] hover:text-[var(--home-ink)] sm:w-6"
      style={forward ? { insetInlineStart: 'calc(100% + 1px)' } : { insetInlineEnd: 'calc(100% + 1px)' }}>
      <Arrow size={18} aria-hidden />
    </button>;
  };
  // The neighbouring tree, already drawn beyond the arrow, so a swipe brings in the finished card.
  const neighbour = (forward: boolean) => {
    if (!has(forward)) return null;
    return <div inert aria-hidden data-tree-neighbour={forward ? 'next' : 'previous'} className="pointer-events-none absolute inset-y-0 w-full [&>[data-tree]]:p-2 sm:[&>[data-tree]]:p-4"
      style={forward ? { insetInlineStart: `calc(100% + ${NEIGHBOUR_GAP})` } : { insetInlineEnd: `calc(100% + ${NEIGHBOUR_GAP})` }}>
      <PathScope>{forward ? neighbours?.nextCard : neighbours?.previousCard}</PathScope>
    </div>;
  };
  const viewportHeight = height ?? (size ? viewHeight(view.s) : undefined);
  const touch = manual ? 'touch-none cursor-grab active:cursor-grabbing' : onStep ? 'touch-pan-y' : 'touch-pan-x touch-pan-y';

  const zoomVariant = rail ? 'muted' : 'outline';
  const zoom = (
    <div role="toolbar" data-share-skip aria-label={ar ? 'تكبير الشجرة' : 'Tree zoom'} aria-orientation={rail ? 'vertical' : undefined} className={`flex items-center gap-2 ${rail ? 'flex-col' : 'flex-wrap max-sm:hidden'}`}>
      <Button size="lg" variant={zoomVariant} aria-pressed={!manual} onClick={() => paintCamera(null)} aria-label={labels.fit} title={labels.fit}><Maximize2 size={16} aria-hidden /></Button>
      <div dir="ltr" className={`flex items-center ${rail ? 'flex-col gap-2' : 'gap-1'}`}>
        <Button size="lg" variant={zoomVariant} onClick={() => zoomBy(-SCALE_STEP)} disabled={!manual} aria-label={labels.out} title={labels.out}><Minus size={16} aria-hidden /></Button>
        <Button size="lg" variant={zoomVariant} onClick={() => zoomBy(SCALE_STEP)} disabled={view.s >= MAX_SCALE} aria-label={labels.in} title={labels.in}><Plus size={16} aria-hidden /></Button>
      </div>
    </div>
  );

  return <>
    {rail && zoomInRail !== 'preview' && createPortal(zoom, rail)}
    {(controls || !rail) && <div dir={ar ? 'rtl' : 'ltr'} className={`mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--home-rule)] pb-3 ${controls ? '' : 'max-sm:hidden'}`}>
      {controls && <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-[var(--home-muted)]">{controls}</div>}
      {!rail && zoom}
    </div>}
    {onStep && !hideArrows && peek(false)}
    {onStep && !hideArrows && peek(true)}
    {onStep && neighbour(false)}
    {onStep && neighbour(true)}
    <div ref={viewport} data-tree-viewport data-zoomed={manual || undefined} className={`relative min-w-0 flex-1 overflow-hidden ${touch}`} style={{ height: viewportHeight }}>
        <div ref={frameRef} data-tree-frame dir="ltr" className="absolute left-0 top-0" style={{ transform: `translate(${view.x}px, ${view.y}px)` }}>
          <div ref={content} data-tree-content data-down={down || undefined} dir={ar ? 'rtl' : 'ltr'} className="absolute left-0 top-0 flex w-max items-center data-down:flex-col" style={{ transform: `scale(${view.s})`, transformOrigin: '0 0' }}>{children}</div>
        </div>
      </div>
  </>;
}

// docs/plans/quran-shared-openings.md
const NO_VARIANTS: Variant[] = [];

export default function BranchTree({ tree, names, ayat, offsets = {}, variants = NO_VARIANTS, prefixes, subtreeLinks, showSpellings = true, zoomable = true, zoomInRail = false, viewportHeight = 'clamp(22rem, 70svh, 36rem)', juz = null, renderNode, label = 'شجرة العبارات المشتركة', header, steppable = false, direction = 'side', rotatable = false, growable = false, view: given, surround, hideArrows, organic = false }: Props) {
  const id = useId();
  const group = useGroupConnections()?.group;
  const ar = useLanguage().language === 'ar';
  const [local, setOn] = useState(surround?.on ?? false);
  const [global] = useAroundSetting();
  const [rotated, setRotated] = useRotated();
  // The rotate button turns only the open tree: the next tree opens in its own best direction again.
  useEffect(() => { if (rotatable) return () => setRotated(false); }, [rotatable, setRotated]);
  const on = surround?.sync ? global : local;
  const view = given;
  const outer = useOuterPaths();
  const own = usePaths([], organic);
  const cardRef = useRef<HTMLDivElement>(null);
  const growingKey = useGrowTarget(cardRef, useMemo(() => (growable ? growthPlan(tree, (prefixes ?? variants).map(start => start.keys)) : null), [growable, tree, prefixes, variants]));
  const paths = growingKey ? { ...(outer ?? own), lit: new Set([growingKey]) } : outer ?? own;
  const all = keys(tree);
  const ends = ayahEnds(tree);
  const emptyKeys = (prefixes ?? []).filter(prefix => !prefix.word).flatMap(prefix => prefix.keys);
  const previousKey = (key: string) => {
    const [surah, ayah] = key.split(':').map(Number);
    return ayah > 1 ? `${surah}:${ayah - 1}` : surah === 1 ? '114:6' : undefined;
  };
  // Every ayah has one before it: a surah's first ayah goes back to the previous surah's last (the server finds it).
  const requiredKeys = emptyKeys;
  // On the branches page a phrase that opens its ayah shows the ayah before only with the surrounding-ayat switch on,
  // unless another ayah has words before the phrase: then the ayah before is always drawn beside those words, so they
  // never read as a trunk every ayah shares. Elsewhere (quizzes) that ayah stays, as the phrase's context.
  const mixedBefore = (prefixes ?? []).some(prefix => prefix.word);
  const showBefore = !surround?.sync || on || mixedBefore;
  const mandatory = useSurrounding(showBefore && requiredKeys.length > 0, requiredKeys, {}, surround?.data);
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
  const pinned = new Set([...paths.pinned].flatMap(([key, ayat]) => key === 'search' ? [] : ayat));
  const startReference = (ayahKeys: string[], ending: string[] = []) => {
    const selected = ayahKeys.filter(key => pinned.has(key));
    if (renderNode || selected.length === 0 || (selected.length === 1 && ending.includes(selected[0]))) return null;
    return <ReferenceHeader>{selected.length === 1
      ? <AyahRefs keys={selected} names={names} className="justify-center" />
      : ar ? `الآيات: ${num(selected.length)}` : `${selected.length} ayat`}</ReferenceHeader>;
  };
  const prefixed = new Set((prefixes?.length ? prefixes : variants).flatMap(prefix => prefix.word ? prefix.keys : []));
  const step = (forward: boolean) => (typeof steppable === 'object' && steppable.onStep
    ? steppable.onStep(forward)
    : document.querySelector<HTMLAnchorElement>(`a[data-step="${forward ? 'next' : 'previous'}"]`)?.click());
  // On the branches page the surrounding-ayat switch is one setting in the side rail; the tree only says when it is loading.
  const controls = surround && !surround.sync ? <SurroundToggle on={on} onChange={setOn} loading={isLoading} failed={!!error} />
    : surround && on && (isLoading || error) ? <AroundStatus loading={isLoading} failed={!!error} /> : undefined;
  const beforeEntries: FanEntry[] = (prefixes ?? []).flatMap((prefix, i): FanEntry[] => prefix.word ? [{ key: `${prefix.word}:${i}`, keys: prefix.keys, item: <>
              <BeforeFan ayahKeys={prefix.keys} around={around} />
              <PathBox id={`p${i}`} keys={prefix.keys} lit={LIT} tone={LINE} className="max-w-52 text-xl leading-loose [[data-down]_&]:max-w-44">
                {startReference(prefix.keys)}
                <Marked node={prefix} ayahKeys={prefix.keys} subject={prefix.word} siblings={all} names={names} enabled={showSpellings} before={<PathButton id={`p${i}`} keys={prefix.keys} subject={prefix.word} />}>
                  <span className="block font-quran"><TreeWords words={prefix.words ?? prefix.word.split(' ')} ayahKeys={prefix.keys} prefix /></span>
                </Marked>
              </PathBox>
            </> }] : prefix.keys.flatMap(key => {
              if (!showBefore) return [];
              const neighbour = mandatoryAround?.data.before[key];
              const previous = neighbour?.key;
              if (!neighbour || !previous || !mandatoryAround) return [];
              // The switch adds one more ayah before, except on the branches page when the ayah before is itself what the switch shows.
              const earlier = surround?.sync && !mixedBefore ? undefined : around?.data.before[previous];
              return [{ key, keys: [key], item: <>
                {earlier && around && <><NeighbourBox neighbour={earlier} of={key} side="before" around={around} nodeId={`earlier${key}`} /><Stub keys={[key]} /></>}
                <NeighbourBox neighbour={neighbour} of={key} side="before" around={mandatoryAround} />
              </> }];
            }));
  const lane = useRef<HTMLDivElement>(null);
  const card = (
      <div ref={cardRef} tabIndex={0} role="region" aria-label={label} data-tree={id} data-organic={paths.organic || undefined} data-connection-group={group?.id} className={`${paths.organic ? theme.page : ''} ${zoomable ? 'overflow-hidden' : 'overflow-auto'} rounded-lg border border-[var(--home-rule)] bg-[var(--home-paper)] ${steppable ? 'p-2 sm:p-4' : 'p-4'} text-[var(--home-ink)]`}>
        {header}
        {around && <style>{targetStyle(id)}</style>}
        {mandatory.isLoading && <p className="text-sm"><LoadingDots label={ar ? 'جارٍ تحميل الآيات السابقة' : 'Loading preceding ayat'} /></p>}
        {mandatory.error && <div role="alert" className="flex items-center gap-2 text-sm text-[var(--home-accent)]">
          <span>{ar ? 'تعذّر تحميل الآيات السابقة.' : 'Could not load the preceding ayat.'}</span>
          <Button size="lg" onClick={() => void mandatory.mutate()} aria-label={ar ? 'حاول مجددًا' : 'Try again'} title={ar ? 'حاول مجددًا' : 'Try again'}><RotateCw aria-hidden /></Button>
        </div>}
        <TreeViewport lane={lane} hideArrows={hideArrows} zoomInRail={zoomInRail} controls={controls} enabled={zoomable} ar={ar} height={viewportHeight ?? undefined} onStep={steppable ? step : undefined} neighbours={typeof steppable === 'object' ? steppable : undefined} auto={direction === 'auto'} flip={rotatable && rotated}>
          {beforeEntries.length > 0 ? <>
            <Fan side="end" label={ar ? 'ما قبل العبارة' : 'Before the phrase'} entries={beforeEntries} />
            <Stub keys={all} />
          </> : prefixes && prefixes.length > 0 ? null : variants.length > 0 ? <>
            <Fan side="end" label="صيغ الكلمة الأولى" entries={variants.map((variant, i) => ({ key: variant.word, keys: variant.keys, item: <>
              <BeforeFan ayahKeys={variant.keys} around={around} />
              <PathBox id={`v${i}`} keys={variant.keys} lit={`${LIT} ${TONE[variant.conj]}`} tone={`${LINE} ${TONE[variant.conj]}`} className="text-xl leading-loose">
                {startReference(variant.keys)}
                <Marked node={variant} ayahKeys={variant.keys} subject={variant.word} siblings={variants.flatMap(other => other.keys)} names={names} enabled={showSpellings}
                  before={<PathButton id={`v${i}`} keys={variant.keys} subject={variant.word} />}
                  after={!renderNode && <SubtreeButton href={branchesHref(variant.id, juz ?? undefined, { ...view, spelling: spell(variant.word), partition: variant.partition })} />}>
                  <span className="block font-quran"><TreeWords words={[variant.word]} ayahKeys={variant.keys} prefix /></span>
                </Marked>
              </PathBox>
            </> }))} />
            <Stub keys={all} />
          </> : <BeforeFan ayahKeys={all} around={around} />}
          <Node node={tree} path={[]} start={startReference(all.filter(key => !prefixed.has(key)), tree.ayat)} names={names} tags={tags} lead={!prefixes && variants.length > 0 ? 1 : 0} juz={juz ?? undefined} renderNode={renderNode} indices={indices} showSpellings={showSpellings} view={view} around={around} anchors={surround ? id : undefined} subtreeLinks={subtreeLinks} />
        </TreeViewport>
      </div>
  );
  // A tree that steps to its neighbours slides as a whole card, its neighbours peeking in beside it.
  return (
    <Comparison.Provider value={{ contexts: ayat ? treeContexts(ayat) : [], offsets }}><PathProvider value={paths}>
      {/* The clip keeps the arrows (within 1.75rem of the card) in view but hides the neighbours' cards (2rem out)
          until a swipe brings them in, so they never cover the side pane beside the tree. */}
      {steppable && zoomable ? <div className="-mx-7 overflow-x-clip px-7"><div ref={lane} data-tree-lane dir={ar ? 'rtl' : 'ltr'} className="relative data-[sliding]:transition-transform data-[sliding]:duration-[250ms] data-[sliding]:ease-out motion-reduce:transition-none">{card}</div></div> : card}
    </PathProvider></Comparison.Provider>
  );
}
