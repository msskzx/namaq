'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { RotateCcw, SkipForward } from 'lucide-react';
import Button from '../common/Button';
import { MARK } from '../common/Emblem';
import styles from './Home.module.css';

export const SEEN = 'home-tree-intro-seen';
const STEP = 450;
const HOLD = 900;
const TYPE = 110;
const TYPING = 1800;
const LEVEL = 500;
export const LOGO = HOLD + 300;

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

export type Ink = { drop: HTMLElement | null; blot: HTMLElement | null; logo: HTMLElement | null };

async function play(root: HTMLElement, marker: HTMLElement, view: View, signal: AbortSignal, undo: (() => void)[], ink: Ink = { drop: null, blot: null, logo: null }) {
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

  const pins = [...new Map([...content.querySelectorAll<HTMLButtonElement>('[data-node] button[aria-pressed="true"]')].map(pin => [pin.dataset.pathToggle ?? pin, pin])).values()];
  pins.forEach(pin => pin.click());
  undo.push(() => pins.forEach(pin => { if (pin.isConnected && pin.getAttribute('aria-pressed') !== 'true') pin.click(); }));

  const depth = (piece: HTMLElement) => { let count = piece.matches('li') ? 1 : 0; for (let at = piece.parentElement; at && at !== content; at = at.parentElement) if (at.matches('li')) count++; return count; };
  const own = (piece: HTMLElement) => piece.matches('[data-node]') ? piece : piece.querySelector<HTMLElement>(':scope > [data-node], :scope > div > [data-node]');
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
  // A drop of ink falls, the logo grows out of it, then it shrinks into the first node.
  const first = pieces.filter(piece => depth(piece) === levels[0]).map(own).find(Boolean);
  if (first && ink.drop && ink.blot && ink.logo) {
    const { drop, blot, logo } = ink;
    await seen();
    const box = root.getBoundingClientRect();
    const stage = (content.closest('[data-tree-frame]')?.parentElement ?? root).getBoundingClientRect();
    const node = first.getBoundingClientRect();
    const size = Math.min(150, stage.width * 0.4, stage.height * 0.4);
    const cx = stage.left + stage.width / 2 - box.left;
    const cy = stage.top + stage.height / 2 - box.top - size * 0.1;
    const at = (x: number, y: number) => `translate(${x}px, ${y}px)`;
    const mark = logo.querySelector<SVGSVGElement>('svg');
    const words = logo.querySelector<HTMLElement>('[data-logo-words]');
    const parts = mark ? { bowl: mark.querySelector(':scope > path'), boughs: [...mark.querySelectorAll('g[fill] > path')], nodes: [...mark.querySelectorAll('circle')] } : null;
    if (mark) { mark.style.width = `${size}px`; mark.style.height = `${size}px`; }
    const bowl = cy + size * 0.25 - (words?.offsetHeight ?? 0) / 2;
    logo.style.transform = at(cx, cy);
    const hidden = [parts?.bowl, ...(parts?.boughs ?? []), ...(parts?.nodes ?? []), words].filter((part): part is Element => !!part) as (HTMLElement | SVGElement)[];
    hidden.forEach(part => { part.style.opacity = '0'; });
    logo.style.opacity = '1';
    undo.push(() => { logo.style.opacity = '0'; hidden.forEach(part => { part.style.opacity = ''; }); [logo, blot, ...hidden].forEach(element => element.getAnimations?.().forEach(animation => animation.cancel())); });
    const show = async (part: Element | null | undefined, keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
      if (!part) return;
      (part as HTMLElement).style.opacity = '';
      await run(part, keyframes, options);
    };
    const top = Math.max(stage.top - box.top + 8, bowl - 110);
    await run(drop, [{ opacity: 0, transform: `${at(cx, top)} scale(1)` }, { opacity: 1, transform: `${at(cx, top)} scale(1)`, offset: 0.15 }, { opacity: 1, transform: `${at(cx, bowl)} scale(.9, 1.3)` }], { duration: 650, easing: 'cubic-bezier(.5, 0, 1, 1)', fill: 'none' });
    await run(blot, [{ opacity: 1, transform: `${at(cx, bowl)} scale(0)` }, { opacity: 1, transform: `${at(cx, bowl)} scale(1.7)`, offset: 0.45 }, { opacity: 1, transform: `${at(cx, bowl)} scale(1)` }], { duration: 420, fill: 'forwards' });
    await Promise.all([
      run(blot, [{ opacity: 1, transform: `${at(cx, bowl)} scale(1)` }, { opacity: 0, transform: `${at(cx, bowl)} scale(3)` }], { duration: 500, fill: 'forwards' }),
      show(parts?.bowl, [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'none' }], { duration: 500 }),
    ]);
    await Promise.all((parts?.boughs ?? []).map((bough, i) => show(bough, [{ opacity: 0, transform: 'scale(.15)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: i * 90 })));
    await Promise.all((parts?.nodes ?? []).map((dot, i) => show(dot, [{ opacity: 0, transform: 'scale(0)' }, { opacity: 1, transform: 'scale(1.3)', offset: 0.7 }, { opacity: 1, transform: 'none' }], { duration: 350, delay: i * 60 })));
    await show(words, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 400 });
    await wait(LOGO);
    const x = node.left + node.width / 2 - box.left;
    const y = node.top + node.height / 2 - box.top;
    await run(logo, [{ opacity: 1, transform: `${at(cx, cy)} scale(1)` }, { opacity: 0, transform: `${at(x, y)} scale(${Math.max(0.15, node.height / size)})` }], { duration: 650, easing: 'ease-in', fill: 'forwards' });
    logo.style.opacity = '0';
  }
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
    const added: HTMLElement[] = [];
    const hide = (records: MutationRecord[]) => records.forEach(record => record.addedNodes.forEach(node => {
      if (!(node instanceof HTMLElement) || added.some(piece => piece.contains(node))) return;
      const opacity = node.style.opacity;
      node.style.opacity = '0';
      undo.push(() => { node.style.opacity = opacity; });
      added.push(node);
    }));
    const watcher = new MutationObserver(hide);
    watcher.observe(content, { childList: true, subtree: true });
    undo.push(() => watcher.disconnect());
    toggle.inert = false;
    surround.click();
    toggle.inert = true;
    for (let tries = 0; tries < 60 && content.querySelectorAll('[data-ctx]').length === 0; tries++) await wait(100);
    hide(watcher.takeRecords());
    watcher.disconnect();
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
}

export default function TreeIntro({ target, ar }: { target: RefObject<HTMLElement | null>; ar: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [round, setRound] = useState(0);
  const marker = useRef<HTMLSpanElement>(null);
  const drop = useRef<HTMLSpanElement>(null);
  const blot = useRef<HTMLSpanElement>(null);
  const logo = useRef<HTMLDivElement>(null);
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
    play(root, marker.current, view, controller.signal, undo, { drop: drop.current, blot: blot.current, logo: logo.current }).then(done, () => {});
    return stop;
  }, [target, round]);
  return <>
    <span ref={marker} aria-hidden className={styles.tapMarker} />
    <span ref={drop} aria-hidden className={styles.inkDrop} />
    <span ref={blot} aria-hidden className={styles.inkBlot} />
    <div ref={logo} aria-hidden className={styles.introLogo}>
      <svg viewBox="12 24.7 76 76" dangerouslySetInnerHTML={{ __html: MARK }} />
      <span data-logo-words>{ar ? 'تدبّر القرآن' : 'Reflect on the Quran'}</span>
    </div>
    {playing ? <Button size="icon" className={styles.skipIntro} onClick={() => skip.current()} aria-label={ar ? 'تخطّ' : 'Skip'} title={ar ? 'تخطّ' : 'Skip'}>
      <SkipForward size={16} aria-hidden className={ar ? '-scale-x-100' : undefined} />
    </Button> : <Button size="icon" className={styles.skipIntro} onClick={() => setRound(count => count + 1)} aria-label={ar ? 'إعادة العرض' : 'Replay'} title={ar ? 'إعادة العرض' : 'Replay'}>
      <RotateCcw size={16} aria-hidden />
    </Button>}
  </>;
}
