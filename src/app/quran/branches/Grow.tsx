'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { Clapperboard, Pause, Play, RotateCcw, Timer, X } from 'lucide-react';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';
import { HOURGLASS_FRAME, hourglassSand } from '@/lib/quran/hourglass';
import type { GrowthStep } from '@/lib/quran/growth';
import styles from './Grow.module.css';

/** Watch grows the tree on its own; ask stops at each split with the next box empty until the timer ends or a tap. */
export type GrowMode = 'watch' | 'ask';
type Status = 'idle' | 'playing' | 'paused' | 'done';
type Prefs = { mode: GrowMode; speed: number; timer: number };
/** `studio` is the card's animation state: its controls replace save and share until it is closed. */
type GrowState = Prefs & { status: Status; at: number; total: number; studio: boolean; kind: 'tree' | 'matrix' };

export const SPEEDS = [1, 1.5, 2, 0.5];
/** Seconds the ask mode waits on an empty box; 0 waits for a tap. */
export const TIMERS = [3, 5, 10, 0, 1];
// Milliseconds at 1×: a connector, a box fading in, a box an earlier ayah drew lighting again, the pause at an ayah's end.
const LINE = 200;
const BOX = 300;
const RELIGHT = 140;
const LEAF = 700;

const PREFS = 'branches-grow';
const listeners = new Set<() => void>();
let state: GrowState = { mode: 'watch', speed: 1, timer: 3, status: 'idle', at: 0, total: 0, studio: false, kind: 'tree' };
let target: { card: HTMLElement; plan: GrowthStep[]; light: (key: string | null) => void; matrix?: { root: HTMLElement; enable: () => void } } | null = null;
let run = 0;
let reveal: (() => void) | null = null;
/** The share of the asked box's timer still left. */
let asking: number | null = null;
export const askLeft = () => asking;

function set(next: Partial<GrowState>) {
  state = { ...state, ...next };
  listeners.forEach(listener => listener());
}

function loadPrefs() {
  try {
    const saved = JSON.parse(localStorage.getItem(PREFS) ?? '{}');
    set({
      mode: saved.mode === 'ask' ? 'ask' : 'watch',
      speed: SPEEDS.includes(saved.speed) ? saved.speed : 1,
      timer: TIMERS.includes(saved.timer) ? saved.timer : 3,
    });
  } catch {}
}

export function setPrefs(next: Partial<Prefs>) {
  set(next);
  try { localStorage.setItem(PREFS, JSON.stringify({ mode: state.mode, speed: state.speed, timer: state.timer })); } catch {}
}

const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
const serverState = state;
export const growthState = () => state;
export const useGrowth = () => useSyncExternalStore(subscribe, () => state, () => serverState);

/** Waits `ms` of playing time, or until a tap reveals the asked box. False once a newer run started. */
function wait(ms: number, token: number, ask?: HTMLElement, progress?: (fraction: number) => void) {
  return new Promise<boolean>(resolve => {
    let left = ms;
    let last = Date.now();
    let tapped = false;
    if (ask) reveal = () => { tapped = true; };
    const tick = () => {
      if (token !== run) return resolve(false);
      const now = Date.now();
      if (state.status === 'playing') left -= now - last;
      last = now;
      progress?.(ms > 0 ? Math.min(1, 1 - left / ms) : 1);
      if (ask) {
        asking = ms > 0 ? Math.max(0, left / ms) : 1;
        const seconds = Math.max(1, Math.ceil(left / 1000));
        const label = document.documentElement.lang === 'en' ? String(seconds) : seconds.toLocaleString('ar-EG');
        if (ms > 0) {
          ask.setAttribute('data-left', label);
          const countdown = ask.querySelector('[data-seconds]');
          if (countdown) countdown.textContent = label;
        }
        const sand = hourglassSand(asking);
        for (const part of ['top', 'bottom', 'stream'] as const) ask.querySelector(`[data-sand="${part}"]`)?.setAttribute('d', sand[part]);
      }
      if (tapped || (ms > 0 && left <= 0)) {
        if (ask) { reveal = null; asking = null; }
        return resolve(true);
      }
      setTimeout(tick, 16);
    };
    tick();
  });
}

// Hidden parts are inert too, so a screen reader or the tab key cannot give the answer away.
const hide = (element: Element | null | undefined) => { element?.setAttribute('data-hide', ''); element?.setAttribute('inert', ''); };
const show = (element: Element | null | undefined) => { element?.removeAttribute('data-hide'); element?.removeAttribute('inert'); };
const ASK = ['data-ask', 'data-wait', 'data-left', 'role', 'tabindex', 'aria-label'];
// The card also holds its neighbours' cards, ready for a swipe: only its own tree grows.
const rootOf = (card: HTMLElement): HTMLElement | undefined => [...card.querySelectorAll<HTMLElement>('[data-grow="n-1"]')].find(root => !root.closest('[data-tree-neighbour]'))?.closest<HTMLElement>('[data-tree-content]') ?? undefined;

/** The connector into a node: its list item in the parent's fan, and the stub between the parent's box and that fan. */
function showLine(item: Element | null | undefined) {
  if (!item) return;
  show(item);
  item.querySelectorAll(':scope > span[aria-hidden]').forEach(show);
  const stub = item.parentElement?.parentElement?.previousElementSibling;
  if (stub?.hasAttribute('data-line')) show(stub);
  show(item.parentElement?.parentElement?.querySelector(':scope > [data-stem]'));
}

async function drawSegment(element: HTMLElement | null | undefined, token: number) {
  if (!element || !element.hasAttribute('data-hide')) return token === run;
  element.setAttribute('data-drawing', element.closest('[data-down]') ? 'down' : getComputedStyle(element).direction === 'ltr' ? 'right' : 'left');
  element.style.setProperty('--grow-line', '0');
  show(element);
  if (!(await wait(LINE / state.speed, token, undefined, fraction => element.style.setProperty('--grow-line', String(fraction))))) return false;
  element.removeAttribute('data-drawing');
  element.style.removeProperty('--grow-line');
  return true;
}

async function drawLine(item: Element | null | undefined, token: number) {
  if (!item || !item.hasAttribute('data-hide')) return token === run;
  const stub = item.parentElement?.parentElement?.previousElementSibling;
  if (stub?.hasAttribute('data-line') && !(await drawSegment(stub as HTMLElement, token))) return false;
  show(item);
  item.querySelectorAll(':scope > span[aria-hidden]:not([data-line])').forEach(show);
  show(item.parentElement?.parentElement?.querySelector(':scope > [data-stem]'));
  return drawSegment(item.querySelector<HTMLElement>(':scope > [data-line]'), token);
}

function showHourglass(box: Element) {
  const timer = document.createElement('span');
  timer.setAttribute('data-timer', '');
  timer.setAttribute('aria-hidden', 'true');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('data-hourglass', '');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  for (const [part, d] of Object.entries({ frame: HOURGLASS_FRAME, ...hourglassSand(1) })) {
    const path = document.createElementNS(svg.namespaceURI, 'path');
    path.setAttribute('data-sand', part);
    path.setAttribute('d', d);
    path.setAttribute('fill', part === 'frame' || part === 'stream' ? 'none' : 'currentColor');
    if (part === 'frame' || part === 'stream') {
      path.setAttribute('stroke', 'currentColor');
      path.setAttribute('stroke-width', part === 'frame' ? '1.5' : '1');
    }
    svg.append(path);
  }
  const countdown = document.createElement('span');
  countdown.setAttribute('data-seconds', '');
  timer.append(svg, countdown);
  box.append(timer);
}

function clearAsk(box: Element) {
  ASK.forEach(name => box.removeAttribute(name));
  box.querySelector('[data-timer]')?.remove();
}

function clear(root: HTMLElement) {
  root.classList.remove(styles.growing, styles.paused);
  root.querySelectorAll('[data-hide]').forEach(show);
  root.querySelectorAll('[data-grow-now]').forEach(element => element.removeAttribute('data-grow-now'));
  root.querySelectorAll('[data-ask]').forEach(clearAsk);
  root.querySelectorAll<HTMLElement>('[data-drawing]').forEach(element => { element.removeAttribute('data-drawing'); element.style.removeProperty('--grow-line'); });
  root.querySelectorAll('[data-matrix-prompt]').forEach(element => element.remove());
  root.querySelectorAll<SVGPathElement>('[data-connection] path').forEach(path => { path.style.removeProperty('stroke-dasharray'); path.style.removeProperty('stroke-dashoffset'); });
  root.removeEventListener('click', onTap, true);
  root.removeEventListener('keydown', onKey, true);
}

function onKey(event: KeyboardEvent) {
  if ((event.key !== 'Enter' && event.key !== ' ') || !(event.target as Element).closest('[data-ask]') || !reveal) return;
  event.preventDefault();
  event.stopPropagation();
  reveal();
}

function onTap(event: MouseEvent) {
  if (!(event.target as Element).closest('[data-ask]') || !reveal) return;
  event.preventDefault();
  event.stopPropagation();
  reveal();
}

export const growRoot = () => target?.matrix?.root ?? (target ? rootOf(target.card) : undefined);

/** Plays from an ayah or connector index. Video recall always uses a finite timer. */
export async function play(from = 0, { video = false } = {}) {
  if (!target) return;
  if (target.matrix) return playMatrix(from, video);
  const { card, plan } = target;
  const root = rootOf(card);
  if (!root || plan.length === 0) return;
  const token = ++run;
  clear(root);
  root.classList.add(styles.growing);
  root.addEventListener('click', onTap, true);
  root.addEventListener('keydown', onKey, true);
  const starts = [...root.querySelectorAll<HTMLElement>('[data-node]')].filter(box => !box.closest('[data-grow]'));
  const shared = root.querySelector<HTMLElement>('[data-grow="n-1"]');
  const bridge = shared?.previousElementSibling;
  root.querySelectorAll('li, [data-line], [data-stem], li > span[aria-hidden]').forEach(element => { if (!element.closest('[data-node]')) hide(element); });
  root.querySelectorAll('[data-node]').forEach(box => { if (starts.length || box.parentElement !== shared) hide(box); });
  const node = (id: number) => root.querySelector(`[data-grow="n${id}"]`);
  const box = (id: number) => node(id)?.querySelector(':scope > [data-node]');
  const after = (key: string) => root.querySelector(`[data-node="after${key}"]`)?.closest('li');
  const startsFor = (key: string) => starts.filter(box => box.getAttribute('data-keys')?.split(' ').includes(key));
  const showStart = (box: HTMLElement) => {
    for (let parent: HTMLElement | null = box.parentElement; parent && parent !== root; parent = parent.parentElement) if (parent.tagName === 'LI') show(parent);
    show(box);
  };
  const drawAt = (step: GrowthStep) => {
    startsFor(step.key).forEach(box => {
      showStart(box);
      if (box.previousElementSibling?.hasAttribute('data-line')) show(box.previousElementSibling);
      showLine(box.closest('li'));
    });
    if (bridge?.hasAttribute('data-line')) show(bridge);
    show(box(-1));
    step.nodes.forEach(id => { if (id >= 0) { showLine(node(id)?.parentElement); show(box(id)); } });
    showLine(after(step.key));
  };
  plan.slice(0, from).forEach(drawAt);
  set({ status: 'playing', at: from, total: plan.length });
  const speed = () => state.speed;
  for (let i = from; i < plan.length; i++) {
    const step = plan[i];
    target.light(step.key);
    set({ at: i });
    const route = startsFor(step.key);
    for (const [at, start] of route.entries()) {
      if (!start.hasAttribute('data-hide')) continue;
      const before = start.previousElementSibling;
      if (before?.hasAttribute('data-line') && !(await drawSegment(before as HTMLElement, token))) return;
      showStart(start);
      start.setAttribute('data-grow-now', '');
      if (!(await wait(BOX / speed(), token))) return;
      const item = start.closest('li');
      if (route[at + 1]?.closest('li') === item) continue;
      item?.querySelectorAll(':scope > span[aria-hidden]:not([data-line])').forEach(show);
      show(item?.parentElement?.parentElement?.querySelector(':scope > [data-stem]'));
      if (!(await drawSegment(item?.querySelector<HTMLElement>(':scope > [data-line]'), token))) return;
    }
    if (route.length && bridge?.hasAttribute('data-line') && !(await drawSegment(bridge as HTMLElement, token))) return;
    for (let j = 0; j < step.nodes.length; j++) {
      const id = step.nodes[j];
      const shown = box(id);
      if (j < step.fresh) {
        const hidden = shown?.hasAttribute('data-hide');
        show(shown);
        shown?.setAttribute('data-grow-now', '');
        if (!(await wait((hidden ? BOX : RELIGHT) / speed(), token))) return;
        continue;
      }
      if (!(await drawLine(node(id)?.parentElement, token))) return;
      if (state.mode === 'ask' && j === step.fresh && shown) {
        const timer = state.timer || (video ? TIMERS[0] : 0);
        shown.setAttribute('data-ask', '');
        // A button for the keyboard and screen readers too; DoubleTapSave also skips taps on buttons.
        shown.setAttribute('role', 'button');
        shown.setAttribute('tabindex', '0');
        shown.setAttribute('aria-label', document.documentElement.lang === 'en' ? 'Show the next word' : 'اكشف الكلمة التالية');
        if (!timer) shown.setAttribute('data-wait', '');
        else showHourglass(shown);
        show(shown);
        if (!(await wait(timer * 1000, token, shown as HTMLElement))) return;
        clearAsk(shown);
      }
      show(shown);
      shown?.setAttribute('data-grow-now', '');
      if (!(await wait(BOX / speed(), token))) return;
    }
    if (!(await drawLine(after(step.key), token))) return;
    if (!(await wait(LEAF / speed(), token))) return;
    root.querySelectorAll('[data-grow-now]').forEach(element => element.removeAttribute('data-grow-now'));
  }
  clear(root);
  target.light(null);
  set({ status: 'done', at: plan.length });
}

export function pause(paused: boolean) {
  if (state.status !== 'playing' && state.status !== 'paused') return;
  const root = growRoot();
  root?.classList.toggle(styles.paused, paused);
  set({ status: paused ? 'paused' : 'playing' });
}

/** Opens the card's animation studio: its controls show, the tree waits for play. */
export function openStudio() {
  if (state.total > 0) { target?.matrix?.enable(); set({ studio: true }); }
}

/** Leaves the studio, stopping a growth on its way, back to save and share. */
export function closeStudio() {
  stop();
  set({ studio: false });
}

export function stop() {
  run++;
  reveal = null;
  asking = null;
  const root = growRoot();
  if (root) clear(root);
  target?.light(null);
  set({ status: 'idle', at: 0 });
}

/** Lets the open tree be grown; a tree swiped away (unmounted) stops its growth. */
export function useGrowTarget(card: React.RefObject<HTMLElement | null>, plan: GrowthStep[] | null) {
  const [lit, light] = useState<string | null>(null);
  useEffect(() => {
    loadPrefs();
    if (!plan || !card.current) return;
    const mine = { card: card.current, plan, light };
    target = mine;
    set({ status: 'idle', at: 0, total: plan.length, studio: false, kind: 'tree' });
    return () => {
      if (target !== mine) return;
      stop();
      target = null;
      set({ total: 0, studio: false });
    };
  }, [card, plan]);
  return lit;
}

export function useMatrixGrowTarget(root: React.RefObject<HTMLDivElement | null>, total: number, revision: unknown, enable: () => void) {
  useEffect(() => {
    if (!root.current || !total) return;
    loadPrefs();
    const mine = { card: root.current, plan: [], light: () => {}, matrix: { root: root.current, enable } };
    target = mine;
    set({ status: 'idle', at: 0, total, studio: false, kind: 'matrix' });
    return () => {
      if (target !== mine) return;
      stop();
      target = null;
      set({ total: 0, studio: false });
    };
  }, [root, total, revision, enable]);
}

async function playMatrix(from: number, video: boolean) {
  const matrix = target?.matrix;
  if (!matrix) return;
  const root = matrix.root;
  const token = ++run;
  clear(root);
  root.classList.add(styles.growing);
  root.addEventListener('click', onTap, true);
  root.addEventListener('keydown', onKey, true);
  const routes = [...root.querySelectorAll<SVGGElement>('[data-connection]')];
  routes.forEach((route, i) => {
    const path = route.querySelector('path')!;
    path.style.strokeDasharray = '1';
    path.style.strokeDashoffset = i < from ? '0' : '1';
    route.querySelectorAll('circle').forEach(circle => { if (i >= from) hide(circle); });
  });
  set({ status: 'playing', at: from });
  for (let i = from; i < routes.length; i++) {
    set({ at: i });
    const route = routes[i];
    const path = route.querySelector('path')!;
    show(route.querySelector('circle'));
    if (state.mode === 'ask') {
      const prompt = document.createElement('div');
      prompt.setAttribute('data-matrix-prompt', '');
      prompt.setAttribute('data-ask', '');
      prompt.setAttribute('role', 'button');
      prompt.setAttribute('tabindex', '0');
      prompt.setAttribute('aria-label', document.documentElement.lang === 'en' ? 'Reveal connection' : 'اكشف الرابط');
      prompt.style.left = `${Number(route.dataset.toX) - 28}px`;
      prompt.style.top = `${Number(route.dataset.toY) - 64}px`;
      const timer = state.timer || (video ? TIMERS[0] : 0);
      if (timer) showHourglass(prompt);
      else prompt.setAttribute('data-wait', '');
      root.append(prompt);
      if (!(await wait(timer * 1000, token, prompt))) return;
      prompt.remove();
    }
    if (!(await wait(700 / state.speed, token, undefined, fraction => { path.style.strokeDashoffset = String(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 0 : 1 - fraction); }))) return;
    show(route.querySelector('circle:last-child'));
    if (!(await wait(500 / state.speed, token))) return;
  }
  clear(root);
  set({ status: 'done', at: routes.length });
}

const SPEED_LABEL = (speed: number) => `${speed}×`;

/** Under the tree. Outside the studio, one button opens it. In it, in place of save and share: close, speed, the ask mode
 * and its timer, sharing as a video, and play, which starts the growth only when pressed and stays a replay once the tree is grown. */
export function GrowControls({ share }: { share?: React.ReactNode } = {}) {
  const ar = useLanguage().language === 'ar';
  const growth = useGrowth();
  if (growth.total === 0) return null;
  const chip = 'h-11 min-w-11 px-2 text-sm tabular-nums';
  if (!growth.studio) {
    const label = growth.kind === 'matrix' ? (ar ? 'استوديو الروابط' : 'Connector studio') : (ar ? 'استوديو النمو' : 'Growth studio');
    return <Button size="lg" variant="muted" onClick={openStudio} aria-label={label} title={label}><Clapperboard aria-hidden /></Button>;
  }
  const active = growth.status === 'playing' || growth.status === 'paused';
  const playing = growth.status === 'playing';
  const label = playing ? (ar ? 'إيقاف مؤقت' : 'Pause') : growth.status === 'paused' ? (ar ? 'متابعة' : 'Resume') : growth.status === 'done' ? (ar ? 'إعادة' : 'Replay') : growth.kind === 'matrix' ? (ar ? 'شاهد الروابط' : 'Watch the connections') : (ar ? 'شاهد الشجرة تنمو' : 'Watch the tree grow');
  const press = () => {
    if (active) pause(playing);
    else void play();
  };
  const ask = growth.mode === 'ask';
  const next = <T,>(list: T[], value: T) => list[(list.indexOf(value) + 1) % list.length];
  const close = ar ? 'إغلاق الاستوديو' : 'Close the studio';
  const resetLabel = ar ? 'إعادة ضبط' : 'Reset';
  const askLabel = growth.kind === 'matrix' ? (ar ? 'تذكّر الرابط' : 'Recall the connection') : (ar ? 'اكمل الايات' : 'Complete the ayat');
  return <>
    <Button size="lg" variant="muted" onClick={closeStudio} aria-label={close} title={close}><X aria-hidden /></Button>
    <span className="flex-1" />
    <Button size="md" variant="muted" className={chip} onClick={() => setPrefs({ speed: next(SPEEDS, growth.speed) })} aria-label={`${ar ? 'السرعة' : 'Speed'} ${SPEED_LABEL(growth.speed)}`} title={ar ? 'السرعة' : 'Speed'}>
      <span dir="ltr">{SPEED_LABEL(growth.speed)}</span>
    </Button>
    {ask && <Button size="md" variant={growth.timer ? 'ghost' : 'muted'} className={chip} onClick={() => setPrefs({ timer: next(TIMERS, growth.timer) })} aria-label={`${ar ? 'مهلة السؤال' : 'Time to answer'} ${growth.timer ? `${growth.timer}s` : '∞'}`} title={ar ? 'مهلة السؤال' : 'Time to answer'}>
      <span dir="ltr">{growth.timer ? `${growth.timer}s` : '∞'}</span>
    </Button>}
    <Button size="lg" variant={ask ? 'ghost' : 'muted'} aria-pressed={ask} onClick={() => setPrefs({ mode: ask ? 'watch' : 'ask' })} aria-label={askLabel} title={askLabel}>
      <Timer aria-hidden />
    </Button>
    {share}
    <Button size="lg" variant="muted" onClick={press} aria-label={label} title={label} className={active ? 'text-[var(--home-accent)]' : undefined}>
      {playing ? <Pause aria-hidden /> : <Play aria-hidden />}
    </Button>
    <Button size="lg" variant="muted" onClick={stop} aria-label={resetLabel} title={resetLabel}><RotateCcw aria-hidden /></Button>
  </>;
}

/** A bar per ayah or connector; a tap starts playback from that step. */
export function GrowProgress() {
  const ar = useLanguage().language === 'ar';
  const growth = useGrowth();
  if (!growth.studio || growth.total === 0) return null;
  return <div role="group" aria-label={growth.kind === 'matrix' ? (ar ? 'تقدّم الروابط' : 'Connection progress') : (ar ? 'تقدّم الشجرة' : 'Tree progress')} className="flex gap-1">
    {Array.from({ length: growth.total }, (_, i) => {
      const label = growth.kind === 'matrix' ? (ar ? `من الرابط ${i + 1}` : `From connection ${i + 1}`) : (ar ? `من الآية ${i + 1}` : `From ayah ${i + 1}`);
      return <button key={i} type="button" onClick={() => void play(i)} aria-label={label} title={label} aria-current={i === growth.at || undefined} className="group flex h-6 flex-1 items-center">
        <span className={`block h-1 w-full rounded-full transition-colors ${(growth.status === 'done' || (growth.status !== 'idle' && i <= growth.at)) ? 'bg-[var(--home-green)]' : 'bg-[var(--home-rule)] group-hover:bg-[var(--home-muted)]'}`} />
      </button>;
    })}
  </div>;
}
