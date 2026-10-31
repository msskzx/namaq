'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { RotateCcw, SkipForward } from 'lucide-react';
import Button from '../common/Button';
import styles from './Home.module.css';

export const SEEN = 'home-tree-intro-seen';
const STEP = 450;
const HOLD = 900;
const TYPE = 110;
const TYPING = 1800;

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

async function play(root: HTMLElement, marker: HTMLElement, bubble: HTMLElement, view: View, signal: AbortSignal, undo: (() => void)[]) {
  const sleep = (ms: number) => new Promise<void>((resolve, reject) => {
    if (signal.aborted) return reject(signal.reason);
    const timer = setTimeout(resolve, ms);
    signal.addEventListener('abort', () => { clearTimeout(timer); reject(signal.reason); }, { once: true });
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
  const pointer = content.style.pointerEvents;
  content.style.pointerEvents = 'none';
  undo.push(() => { content.style.pointerEvents = pointer; });
  const surround = root.querySelector<HTMLInputElement>('input[role="switch"]');
  const toggle = surround?.closest('label');
  if (surround && toggle) {
    const was = surround.checked;
    if (was) surround.click();
    toggle.inert = true;
    undo.push(() => { toggle.inert = false; if (was && !surround.checked) surround.click(); });
  }

  const boxes = [...content.querySelectorAll<HTMLElement>('[data-node]')];
  const right = (element: Element) => element.getBoundingClientRect().right;
  const own = (piece: HTMLElement) => piece.matches('[data-node]') ? piece : piece.querySelector<HTMLElement>('[data-node]');
  const pieces = [...content.querySelectorAll<HTMLElement>('li, [data-node="n-1"], [data-line]')].filter(piece => piece.matches('li, [data-node]') || !piece.closest('li'));
  pieces.forEach(piece => {
    const opacity = piece.style.opacity;
    piece.style.opacity = '0';
    undo.push(() => { piece.style.opacity = opacity; });
  });
  const deepest = (key: string) => boxes.filter(box => box.dataset.keys?.split(' ').includes(key)).at(-1)!;
  const leaves = [...new Set(boxes.flatMap(box => box.dataset.keys?.split(' ') ?? []))].map(key => ({ key, leaf: deepest(key) })).sort((a, b) => a.leaf.getBoundingClientRect().top - b.leaf.getBoundingClientRect().top);
  const blank = (box: HTMLElement) => {
    const words = box.querySelector<HTMLElement>('.font-quran');
    if (!words?.textContent) return async () => {};
    const position = box.style.position;
    if (getComputedStyle(box).position === 'static') box.style.position = 'relative';
    const typed = words.cloneNode(false) as HTMLElement;
    typed.className = `${words.className} ${styles.typing}`;
    Object.assign(typed.style, { position: 'absolute', top: `${words.offsetTop}px`, left: `${words.offsetLeft}px`, width: `${words.offsetWidth}px`, height: `${words.offsetHeight}px` });
    words.style.visibility = 'hidden';
    words.after(typed);
    const restore = () => { typed.remove(); words.style.visibility = ''; box.style.position = position; };
    undo.push(restore);
    const letters = typeof Intl.Segmenter === 'function' ? [...new Intl.Segmenter('ar', { granularity: 'grapheme' }).segment(words.textContent)].map(part => part.segment) : Array.from(words.textContent);
    return async () => {
      await wait(450);
      const step = Math.min(TYPE, TYPING / letters.length);
      for (let i = 1; i <= letters.length; i++) {
        typed.textContent = letters.slice(0, i).join('');
        await wait(step);
      }
      restore();
    };
  };
  const lit = async (leaf: HTMLElement, during: () => Promise<void>) => {
    const light = leaf.querySelector<HTMLButtonElement>('button[aria-pressed]');
    if (!light) return during();
    light.click();
    undo.push(() => { if (light.getAttribute('aria-pressed') === 'true') light.click(); });
    await during();
    light.click();
  };
  const shown = new Set<Element>();
  for (const { key, leaf } of leaves) {
    const path = pieces.filter(piece => !shown.has(piece) && (!own(piece) || own(piece)!.dataset.keys?.split(' ').includes(key))).sort((a, b) => right(b) - right(a));
    if (path.length === 0) continue;
    for (const piece of path) {
      shown.add(piece);
      const type = own(piece) === leaf && leaf.dataset.node !== 'n-1' ? blank(leaf) : null;
      piece.style.opacity = '';
      await run(piece, [{ opacity: 0 }, { opacity: 1 }], { duration: STEP });
      if (type) await lit(leaf, async () => { await type(); await wait(HOLD); });
    }
    await wait(400);
  }
  pieces.forEach(piece => { piece.style.opacity = ''; });
  await wait(600);

  const showing = (button: HTMLElement) => {
    const { left, top, width, height } = button.getBoundingClientRect();
    const hit = document.elementFromPoint?.(left + width / 2, top + height / 2);
    return !!hit && root.contains(hit);
  };
  const open = [content.querySelector<HTMLElement>('[data-node="n-1"] [data-context-open]'), ...content.querySelectorAll<HTMLElement>('[data-context-open]')].find(button => button && showing(button));
  if (!open) return;
  const area = root.getBoundingClientRect();
  const target = open.getBoundingClientRect();
  const x = target.left + target.width / 2 - area.left;
  const y = target.top + target.height / 2 - area.top;
  await run(marker, [
    { opacity: 0, transform: `translate(${x + 40}px, ${y + 40}px) scale(1)` },
    { opacity: 1, transform: `translate(${x}px, ${y}px) scale(1)`, offset: 0.6 },
    { opacity: 1, transform: `translate(${x}px, ${y}px) scale(0.7)`, offset: 0.8 },
    { opacity: 0, transform: `translate(${x}px, ${y}px) scale(1.2)` },
  ], { duration: 1800, fill: 'none' });
  const half = bubble.offsetWidth / 2;
  const left = Math.min(Math.max(x, half + 8), area.width - half - 8);
  const at = `translate(${left - half}px, ${target.bottom - area.top + 10}px)`;
  bubble.style.setProperty('--tail', `${x - left + half}px`);
  await run(bubble, [{ opacity: 0, transform: `${at} translateY(6px)` }, { opacity: 1, transform: at }], { duration: 300, fill: 'forwards' });
  await wait(2800);
  await run(bubble, [{ opacity: 1, transform: at }, { opacity: 0, transform: at }], { duration: 400, fill: 'forwards' });
  await wait(300);
}

export default function TreeIntro({ target, ar }: { target: RefObject<HTMLElement | null>; ar: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [round, setRound] = useState(0);
  const marker = useRef<HTMLSpanElement>(null);
  const bubble = useRef<HTMLSpanElement>(null);
  const skip = useRef<() => void>(() => {});
  useEffect(() => {
    const root = target.current;
    if (!root || !marker.current || !bubble.current || (round === 0 && !shouldPlay())) return;
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
    play(root, marker.current, bubble.current, view, controller.signal, undo).then(done, () => {});
    return stop;
  }, [target, round]);
  return <>
    <span ref={marker} aria-hidden className={styles.tapMarker} />
    <span ref={bubble} aria-hidden className={styles.introBubble}>{ar ? 'الآيات في سياقها' : 'Ayat in context'}</span>
    {playing ? <Button size="icon" className={styles.skipIntro} onClick={() => skip.current()} aria-label={ar ? 'تخطّ' : 'Skip'} title={ar ? 'تخطّ' : 'Skip'}>
      <SkipForward size={16} aria-hidden className={ar ? '-scale-x-100' : undefined} />
    </Button> : <Button size="icon" className={styles.skipIntro} onClick={() => setRound(count => count + 1)} aria-label={ar ? 'إعادة العرض' : 'Replay'} title={ar ? 'إعادة العرض' : 'Replay'}>
      <RotateCcw size={16} aria-hidden />
    </Button>}
  </>;
}
