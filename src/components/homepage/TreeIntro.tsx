'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { SkipForward } from 'lucide-react';
import Button from '../common/Button';
import styles from './Home.module.css';

export const SEEN = 'home-tree-intro-seen';
const STEP = 300;
const HOLD = 600;

function shouldPlay() {
  try {
    if (new URLSearchParams(window.location.search).get('intro') === '1') return true;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
    return localStorage.getItem(SEEN) !== '1';
  } catch {
    return false;
  }
}

async function play(root: HTMLElement, marker: HTMLElement, signal: AbortSignal, undo: (() => void)[]) {
  const wait = (ms: number) => new Promise<void>((resolve, reject) => {
    if (signal.aborted) return reject(signal.reason);
    const timer = setTimeout(resolve, ms);
    signal.addEventListener('abort', () => { clearTimeout(timer); reject(signal.reason); }, { once: true });
  });
  const content = root.querySelector<HTMLElement>('[data-tree-content]');
  if (!content || typeof content.animate !== 'function') return;
  const run = (element: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
    const animation = element.animate(keyframes, { fill: 'backwards', easing: 'ease-out', ...options });
    undo.push(() => animation.cancel());
    return animation.finished.catch(() => {});
  };
  const pointer = content.style.pointerEvents;
  content.style.pointerEvents = 'none';
  undo.push(() => { content.style.pointerEvents = pointer; });

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
  const shown = new Set<Element>();
  for (const { key } of leaves) {
    const path = pieces.filter(piece => !shown.has(piece) && (!own(piece) || own(piece)!.dataset.keys?.split(' ').includes(key))).sort((a, b) => right(b) - right(a));
    if (path.length === 0) continue;
    for (const piece of path) {
      shown.add(piece);
      piece.style.opacity = '';
      await run(piece, [{ opacity: 0 }, { opacity: 1 }], { duration: STEP });
      signal.throwIfAborted();
    }
    await wait(250);
  }
  pieces.forEach(piece => { piece.style.opacity = ''; });
  for (const { leaf } of leaves) {
    const light = leaf.querySelector<HTMLButtonElement>('button[aria-pressed]');
    if (!light) continue;
    light.click();
    undo.push(() => { if (light.getAttribute('aria-pressed') === 'true') light.click(); });
    await wait(HOLD);
    light.click();
    await wait(200);
  }
  await wait(400);

  const open = content.querySelector<HTMLElement>('[data-node="n-1"] [data-context-open]') ?? content.querySelector<HTMLElement>('[data-context-open]');
  if (open) {
    const area = root.getBoundingClientRect();
    const target = open.getBoundingClientRect();
    const x = target.left + target.width / 2 - area.left;
    const y = target.top + target.height / 2 - area.top;
    await run(marker, [
      { opacity: 0, transform: `translate(${x + 40}px, ${y + 40}px) scale(1)` },
      { opacity: 1, transform: `translate(${x}px, ${y}px) scale(1)`, offset: 0.6 },
      { opacity: 1, transform: `translate(${x}px, ${y}px) scale(0.7)`, offset: 0.8 },
      { opacity: 0, transform: `translate(${x}px, ${y}px) scale(1.2)` },
    ], { duration: 1400, fill: 'none' });
    signal.throwIfAborted();
    undo.push(() => document.querySelectorAll<HTMLDialogElement>('dialog[open]').forEach(dialog => dialog.close()));
    open.click();
    await wait(2400);
    document.querySelectorAll<HTMLDialogElement>('dialog[open]').forEach(dialog => dialog.close());
    await wait(700);
  }

  const leaf = boxes.filter(box => box.dataset.node !== 'n-1').sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left)[0];
  const words = leaf?.querySelector<HTMLElement>('.font-quran');
  if (!leaf || !words?.textContent) return;
  const position = leaf.style.position;
  if (getComputedStyle(leaf).position === 'static') leaf.style.position = 'relative';
  const typed = words.cloneNode(false) as HTMLElement;
  typed.className = `${words.className} ${styles.typing}`;
  Object.assign(typed.style, { position: 'absolute', top: `${words.offsetTop}px`, left: `${words.offsetLeft}px`, width: `${words.offsetWidth}px`, height: `${words.offsetHeight}px` });
  words.style.visibility = 'hidden';
  words.after(typed);
  undo.push(() => { typed.remove(); words.style.visibility = ''; leaf.style.position = position; });
  const letters = typeof Intl.Segmenter === 'function' ? [...new Intl.Segmenter('ar', { granularity: 'grapheme' }).segment(words.textContent)].map(part => part.segment) : Array.from(words.textContent);
  await wait(900);
  const step = Math.min(140, 2500 / letters.length);
  for (let i = 1; i <= letters.length; i++) {
    typed.textContent = letters.slice(0, i).join('');
    await wait(step);
  }
  await wait(800);
}

export default function TreeIntro({ target, ar }: { target: RefObject<HTMLElement | null>; ar: boolean }) {
  const [playing, setPlaying] = useState(false);
  const marker = useRef<HTMLSpanElement>(null);
  const skip = useRef<() => void>(() => {});
  useEffect(() => {
    const root = target.current;
    if (!root || !marker.current || !shouldPlay()) return;
    const controller = new AbortController();
    const undo: (() => void)[] = [];
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
    play(root, marker.current, controller.signal, undo).then(done, () => {});
    return stop;
  }, [target]);
  return <>
    <span ref={marker} aria-hidden className={styles.tapMarker} />
    {playing && <Button size="sm" className={styles.skipIntro} onClick={() => skip.current()}>
      <SkipForward size={16} aria-hidden className={ar ? '-scale-x-100' : undefined} />
      {ar ? 'تخطّ' : 'Skip'}
    </Button>}
  </>;
}
