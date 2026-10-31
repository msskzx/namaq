'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { SkipForward } from 'lucide-react';
import Button from '../common/Button';
import styles from './Home.module.css';

export const SEEN = 'home-tree-intro-seen';
const GROW = 2800;

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

  const bounds = content.getBoundingClientRect();
  const boxes = [...content.querySelectorAll<HTMLElement>('[data-node]')];
  run(content, [{ clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: GROW });
  boxes.forEach(box => run(box, [{ opacity: 0, transform: 'scale(0.92)' }, { opacity: 1, transform: 'none' }], {
    duration: 600,
    delay: ((bounds.right - box.getBoundingClientRect().right) / (bounds.width || 1)) * (GROW - 600),
  }));
  await wait(GROW + 600);

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
    await wait(2800);
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
