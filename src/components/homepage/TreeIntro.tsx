'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { RotateCcw, SkipForward } from 'lucide-react';
import Button from '../common/Button';
import MushafText from '../common/MushafText';
import { num } from '@/lib/quran/arabicNumber';
import type { AyahContext } from '@/lib/quran/ayahContext';
import styles from './Home.module.css';

export const SEEN = 'home-tree-intro-seen';
const STEP = 450;
const HOLD = 900;
const TYPE = 110;
const TYPING = 1800;
const LEVEL = 500;

function shouldPlay() {
  try {
    if (new URLSearchParams(window.location.search).get('intro') === '1') return true;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
    return localStorage.getItem(SEEN) !== '1';
  } catch {
    return false;
  }
}

export type View = { visible: boolean; waiting: Set<() => void>; running: Set<Animation> };

export type Peek = { context: AyahContext; top: number };

async function play(root: HTMLElement, marker: HTMLElement, peek: (shown: Peek | null) => void, cardRef: () => HTMLElement | null, view: View, signal: AbortSignal, undo: (() => void)[]) {
  const sleep = (ms: number) => new Promise<void>((resolve, reject) => {
    if (signal.aborted) return reject(signal.reason);
    const abort = () => { clearTimeout(timer); reject(signal.reason); };
    const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve(); }, ms);
    signal.addEventListener('abort', abort, { once: true });
  });
  const seen = () => view.visible ? Promise.resolve() : new Promise<void>(resolve => view.waiting.add(resolve));
  const wait = async (ms: number) => {
    for (let left = ms; left > 0;) {
      await seen();
      const start = Date.now();
      await sleep(Math.min(left, 100));
      left -= Date.now() - start;
    }
  };
  const content = root.querySelector<HTMLElement>('[data-tree-content]');
  if (!content || typeof content.animate !== 'function') return;
  const run = async (element: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
    await seen();
    const animation = element.animate(keyframes, { fill: 'backwards', easing: 'ease-out', ...options });
    undo.push(() => animation.cancel());
    view.running.add(animation);
    await animation.finished.catch(() => {});
    view.running.delete(animation);
    signal.throwIfAborted();
  };
  const inert = content.inert;
  content.inert = true;
  undo.push(() => { content.inert = inert; });
  const surround = root.querySelector<HTMLInputElement>('input[role="switch"]');
  const toggle = surround?.closest('label');
  if (surround && toggle) {
    const was = surround.checked;
    if (was) surround.click();
    toggle.inert = true;
    undo.push(() => { toggle.inert = false; if (surround.isConnected && surround.checked !== was) surround.click(); });
  }

  const pins = [...content.querySelectorAll<HTMLButtonElement>('[data-node] button[aria-pressed="true"]')];
  pins.forEach(pin => pin.click());
  undo.push(() => pins.forEach(pin => { if (pin.isConnected && pin.getAttribute('aria-pressed') !== 'true') pin.click(); }));

  const depth = (piece: HTMLElement) => { let count = piece.matches('li') ? 1 : 0; for (let at = piece.parentElement; at && at !== content; at = at.parentElement) if (at.matches('li')) count++; return count; };
  const own = (piece: HTMLElement) => piece.matches('[data-node]') ? piece : piece.querySelector<HTMLElement>('[data-node]');
  const pieces = [...content.querySelectorAll<HTMLElement>('li, [data-node="n-1"], [data-line]')].filter(piece => piece.matches('li, [data-node]') || !piece.closest('li'));
  pieces.forEach(piece => {
    const opacity = piece.style.opacity;
    piece.style.opacity = '0';
    undo.push(() => { piece.style.opacity = opacity; });
  });
  const blank = (box: HTMLElement) => {
    const words = box.querySelector<HTMLElement>('.font-quran');
    if (!words?.textContent) return async () => {};
    const position = box.style.position;
    if (getComputedStyle(box).position === 'static') box.style.position = 'relative';
    const typed = words.cloneNode(false) as HTMLElement;
    Object.assign(typed.style, { position: 'absolute', top: `${words.offsetTop}px`, left: `${words.offsetLeft}px`, width: `${words.offsetWidth}px`, height: `${words.offsetHeight}px` });
    words.style.visibility = 'hidden';
    words.after(typed);
    const restore = () => { typed.remove(); words.style.visibility = ''; box.style.position = position; };
    undo.push(restore);
    const letters = typeof Intl.Segmenter === 'function' ? [...new Intl.Segmenter('ar', { granularity: 'grapheme' }).segment(words.textContent)].map(part => part.segment) : Array.from(words.textContent);
    return async () => {
      const step = Math.min(TYPE, TYPING / letters.length);
      for (let i = 1; i <= letters.length; i++) {
        typed.textContent = letters.slice(0, i).join('');
        await wait(step);
      }
      restore();
    };
  };
  // Breadth first: each level of the tree appears together and its words are typed together.
  const levels = [...new Set(pieces.map(depth))].sort((a, b) => a - b);
  for (const level of levels) {
    const row = pieces.filter(piece => depth(piece) === level);
    const typing = row.flatMap(piece => { const box = own(piece); return box ? [blank(box)] : []; });
    row.forEach(piece => { piece.style.opacity = ''; });
    await Promise.all(row.map(piece => run(piece, [{ opacity: 0 }, { opacity: 1 }], { duration: STEP })));
    await Promise.all(typing.map(type => type()));
    await wait(LEVEL);
  }
  pieces.forEach(piece => { piece.style.opacity = ''; });
  await wait(HOLD);

  const showing = (button: HTMLElement) => {
    const { left, top, width, height } = button.getBoundingClientRect();
    const hit = document.elementFromPoint?.(left + width / 2, top + height / 2);
    return !!hit && root.contains(hit);
  };
  const area = () => root.getBoundingClientRect();
  const tap = async (button: HTMLElement) => {
    const box = area();
    const target = button.getBoundingClientRect();
    const x = target.left + target.width / 2 - box.left;
    const y = target.top + target.height / 2 - box.top;
    await run(marker, [
      { opacity: 0, transform: `translate(${x + 40}px, ${y + 40}px) scale(1)` },
      { opacity: 1, transform: `translate(${x}px, ${y}px) scale(1)`, offset: 0.6 },
      { opacity: 1, transform: `translate(${x}px, ${y}px) scale(0.7)`, offset: 0.8 },
      { opacity: 0, transform: `translate(${x}px, ${y}px) scale(1.2)` },
    ], { duration: 1800, fill: 'none' });
  };

  // The ayah before the tree and after each leaf.
  if (surround && toggle && !surround.checked) {
    const before = new Set(content.querySelectorAll('li, [data-line], [data-node]'));
    toggle.inert = false;
    surround.click();
    toggle.inert = true;
    for (let tries = 0; tries < 60 && content.querySelectorAll('[data-ctx]').length === 0; tries++) await wait(100);
    const added = [...content.querySelectorAll<HTMLElement>('li, [data-line], [data-node]')].filter(piece => !before.has(piece) && !(piece.parentElement?.closest('li, [data-node]') && !before.has(piece.parentElement.closest('li, [data-node]')!)));
    added.forEach(piece => {
      const opacity = piece.style.opacity;
      piece.style.opacity = '0';
      undo.push(() => { piece.style.opacity = opacity; });
    });
    if (added.length > 0) {
      added.forEach(piece => { piece.style.opacity = ''; });
      await Promise.all(added.map(piece => run(piece, [{ opacity: 0 }, { opacity: 1 }], { duration: STEP * 2 })));
      await wait(HOLD * 2);
    }
  }

  // How to light a path: once, on a leaf.
  const nodes = [...content.querySelectorAll<HTMLElement>('[data-node]:not([data-ctx])')];
  const keysOf = (box: HTMLElement) => box.dataset.keys?.split(' ') ?? [];
  const leaves = [...new Set(nodes.flatMap(keysOf))].map(key => nodes.filter(box => keysOf(box).includes(key)).at(-1)!);
  const light = [...content.querySelectorAll<HTMLButtonElement>('[data-node]:not([data-ctx]) button[aria-pressed]')].find(button => showing(button) && leaves.some(leaf => leaf.contains(button)))
    ?? [...content.querySelectorAll<HTMLButtonElement>('[data-node] button[aria-pressed]')].find(showing);
  if (light) {
    await tap(light);
    light.click();
    const restore = () => { if (light.getAttribute('aria-pressed') === 'true') light.click(); };
    undo.push(restore);
    await wait(HOLD * 3);
    restore();
    await wait(600);
  }

  // The ayah in its context, in a small card.
  const open = [light?.closest<HTMLElement>('[data-node]')?.querySelector<HTMLElement>('[data-context-open]'), ...content.querySelectorAll<HTMLElement>('[data-context-open]')].find(button => button && showing(button));
  const key = open?.closest<HTMLElement>('[data-node]')?.dataset.keys?.split(' ')[0];
  if (!open || !key) return;
  const context = await fetch(`/api/quran/context?${new URLSearchParams({ q: key })}`).then(response => response.ok ? response.json() as Promise<AyahContext[]> : []).then(found => found[0], () => undefined);
  signal.throwIfAborted();
  if (!context) return;
  await tap(open);
  const box = area();
  const target = open.getBoundingClientRect();
  peek({ context, top: Math.min(target.bottom - box.top + 10, Math.max(box.height - 260, 8)) });
  undo.push(() => peek(null));
  await wait(50);
  const card = cardRef();
  if (card) await run(card, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 300, fill: 'forwards' });
  await wait(1600);
  const scroller = card?.querySelector<HTMLElement>('[data-peek-scroll]');
  const far = scroller ? scroller.scrollHeight - scroller.clientHeight : 0;
  for (let i = 1; scroller && far > 0 && i <= 30; i++) {
    scroller.scrollTop = (far * i) / 30;
    await wait(60);
  }
  await wait(2400);
  if (card) await run(card, [{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' });
  peek(null);
  await wait(300);
}

export default function TreeIntro({ target, ar, names = {} }: { target: RefObject<HTMLElement | null>; ar: boolean; names?: Record<number, string> }) {
  const [playing, setPlaying] = useState(false);
  const [round, setRound] = useState(0);
  const [shown, setShown] = useState<Peek | null>(null);
  const marker = useRef<HTMLSpanElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const skip = useRef<() => void>(() => {});
  useEffect(() => {
    const root = target.current;
    if (!root || !marker.current || (round === 0 && !shouldPlay())) return;
    const controller = new AbortController();
    const undo: (() => void)[] = [];
    const view: View = { visible: round > 0 || typeof IntersectionObserver === 'undefined', waiting: new Set(), running: new Set() };
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      view.visible = entry.intersectionRatio >= 0.6;
      view.running.forEach(animation => (view.visible ? animation.play() : animation.pause()));
      if (view.visible) view.waiting.forEach(resume => resume());
      if (view.visible) view.waiting.clear();
    }, { threshold: [0, 0.6] });
    observer?.observe(root);
    undo.push(() => observer?.disconnect());
    const stop = () => {
      controller.abort();
      undo.splice(0).reverse().forEach(restore => restore());
      setPlaying(false);
    };
    const done = () => {
      try { localStorage.setItem(SEEN, '1'); } catch {}
      stop();
    };
    skip.current = done;
    setPlaying(true);
    play(root, marker.current, setShown, () => card.current, view, controller.signal, undo).then(done, () => {});
    return stop;
  }, [target, round]);
  const ref = (key: string) => {
    const [surah, ayah] = key.split(':').map(Number);
    return `${names[surah] ?? (ar ? `سورة ${num(surah)}` : `Surah ${surah}`)} ${ar ? num(ayah) : ayah}`;
  };
  return <>
    <span ref={marker} aria-hidden className={styles.tapMarker} />
    {shown && <div ref={card} aria-hidden className={styles.introPeek} style={{ top: shown.top, opacity: 0 }}>
      <div className={styles.introPeekHead}><strong>{ar ? 'الآيات في سياقها' : 'Ayat in context'}</strong><span>{ref(shown.context.ayah.key)}</span></div>
      <div data-peek-scroll className={styles.introPeekBody} dir="rtl">
        {[shown.context.before, shown.context.ayah, shown.context.after].map(ayah => ayah && <p key={ayah.key} className={`font-quran ${ayah === shown.context.ayah ? styles.introPeekAyah : ''}`}>
          <MushafText>{ayah.words.join(' ')}</MushafText> <span className={styles.introPeekNumber}>{num(Number(ayah.key.split(':')[1]))}</span>
        </p>)}
      </div>
    </div>}
    {playing ? <Button size="icon" className={styles.skipIntro} onClick={() => skip.current()} aria-label={ar ? 'تخطّ' : 'Skip'} title={ar ? 'تخطّ' : 'Skip'}>
      <SkipForward size={16} aria-hidden className={ar ? '-scale-x-100' : undefined} />
    </Button> : <Button size="icon" className={styles.skipIntro} onClick={() => setRound(count => count + 1)} aria-label={ar ? 'إعادة العرض' : 'Replay'} title={ar ? 'إعادة العرض' : 'Replay'}>
      <RotateCcw size={16} aria-hidden />
    </Button>}
  </>;
}
