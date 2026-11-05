'use client';

import { useEffect, useRef, useState } from 'react';
import { Download, Pause, Play, RotateCcw, Send, X } from 'lucide-react';
import Button from '@/components/common/Button';
import { HOURGLASS_FRAME, hourglassSand } from '@/lib/quran/hourglass';
import LoadingDots from '@/components/common/LoadingDots';
import { useLanguage } from '@/components/language/LanguageContext';
import { askLeft, growRoot, growthState, pause, play, stop, useGrowth } from './Grow';

// A vertical story frame, as Instagram and WhatsApp status show it.
const WIDTH = 1080;
const HEIGHT = 1920;
const FPS = 30;
/** How long the finished tree stays on screen before the video ends. */
const HOLD = 1500;

type Rect = { x: number; y: number; w: number; h: number };
type Word = Rect & { text: string; font: string; color: string };
type Shape = { element: HTMLElement; rect: Rect; words: Word[] };
type Segment = [number, number, number, number, number];
type Line = { element: HTMLElement; segments: Segment[] };
type Drawing = { content: HTMLElement; width: number; height: number; boxes: Shape[]; lines: Line[] };

/** Where every box, word and connector of the tree sits, in the tree's own unscaled pixels. Measured once: growing only fades them. */
function measure(root: HTMLElement): Drawing | null {
  const content = root.closest<HTMLElement>('[data-tree-content]');
  if (!content) return null;
  const frame = content.getBoundingClientRect();
  const k = frame.width ? content.offsetWidth / frame.width : 1;
  const place = (box: DOMRect): Rect => ({ x: (box.left - frame.left) * k, y: (box.top - frame.top) * k, w: box.width * k, h: box.height * k });
  const boxes = [...content.querySelectorAll<HTMLElement>('[data-node]')].map(element => {
    const words: Word[] = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    for (let text = walker.nextNode() as Text | null; text; text = walker.nextNode() as Text | null) {
      const parent = text.parentElement;
      if (!parent || parent.closest('button, a')) continue;
      const style = getComputedStyle(parent);
      for (const match of text.data.matchAll(/\S+/g)) {
        range.setStart(text, match.index);
        range.setEnd(text, match.index + match[0].length);
        const box = range.getBoundingClientRect();
        if (!box.width) continue;
        words.push({ ...place(box), text: match[0], font: `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`, color: style.color });
      }
    }
    return { element, rect: place(element.getBoundingClientRect()), words };
  });
  return { content, width: content.offsetWidth, height: content.offsetHeight, boxes, lines: measureLines(content, 'span[aria-hidden]') };
}

function measureLines(content: HTMLElement, selector: string): Line[] {
  const frame = content.getBoundingClientRect();
  const k = frame.width ? content.offsetWidth / frame.width : 1;
  const place = (box: DOMRect): Rect => ({ x: (box.left - frame.left) * k, y: (box.top - frame.top) * k, w: box.width * k, h: box.height * k });
  return [...content.querySelectorAll<HTMLElement>(selector)].flatMap(element => {
    if (element.closest('[data-node]')) return [];
    const style = getComputedStyle(element);
    const [top, right, bottom, left] = [style.borderTopWidth, style.borderRightWidth, style.borderBottomWidth, style.borderLeftWidth].map(parseFloat);
    if (!top && !right && !bottom && !left) return [];
    const { x, y, w, h } = place(element.getBoundingClientRect());
    const segments: Segment[] = [];
    if (top) segments.push([x, y + top / 2, x + w, y + top / 2, top]);
    if (bottom) segments.push([x, y + h - bottom / 2, x + w, y + h - bottom / 2, bottom]);
    if (left) segments.push([x + left / 2, y, x + left / 2, y + h, left]);
    if (right) segments.push([x + w - right / 2, y, x + w - right / 2, y + h, right]);
    return [{ element, segments }];
  });
}

/** How visible an element is now: its own fade and its branch's. */
function alpha(element: HTMLElement, content: HTMLElement) {
  let value = 1;
  for (let at: HTMLElement | null = element; at && at !== content; at = at.parentElement) {
    if (at === element || at.tagName === 'LI') value *= Number(getComputedStyle(at).opacity);
  }
  return value;
}

type Look = { paper: string; ink: string; rule: string; accent: string; font: string; logo: HTMLImageElement | null; ask: boolean };

function draw(context: CanvasRenderingContext2D, drawing: Drawing, look: Look, progress: { at: number; total: number }) {
  context.save();
  context.fillStyle = look.paper;
  context.fillRect(0, 0, WIDTH, HEIGHT);
  context.direction = 'rtl';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  if (look.logo?.complete && look.logo.naturalWidth) context.drawImage(look.logo, WIDTH / 2 - 70, 70, 140, 140);
  context.fillStyle = look.ask ? look.accent : look.ink;
  context.font = `56px ${look.font}`;
  if (look.ask) context.fillText('اكمل الايات', WIDTH / 2, 290, WIDTH - 120);

  const area = { x: 60, y: 380, w: WIDTH - 120, h: 1300 };
  const scale = Math.min(area.w / drawing.width, area.h / drawing.height, 3);
  context.translate(area.x + (area.w - drawing.width * scale) / 2, area.y + (area.h - drawing.height * scale) / 2);
  context.scale(scale, scale);
  context.lineCap = 'butt';
  const lines = [...drawing.lines.filter(line => !line.element.hasAttribute('data-stem')), ...measureLines(drawing.content, '[data-stem]')];
  for (const line of lines) {
    const seen = alpha(line.element, drawing.content);
    if (seen < 0.02 || getComputedStyle(line.element).display === 'none') continue;
    context.globalAlpha = seen;
    const style = getComputedStyle(line.element);
    context.strokeStyle = parseFloat(style.borderTopWidth) ? style.borderTopColor : parseFloat(style.borderLeftWidth) ? style.borderLeftColor : style.borderRightColor;
    for (const [x1, y1, x2, y2, width] of line.segments) {
      context.lineWidth = width;
      context.beginPath();
      const fraction = Number(line.element.style.getPropertyValue('--grow-line') || 1);
      const reverse = line.element.getAttribute('data-drawing') === 'left';
      context.moveTo(reverse ? x2 : x1, reverse ? y2 : y1);
      context.lineTo(reverse ? x2 + (x1 - x2) * fraction : x1 + (x2 - x1) * fraction, reverse ? y2 + (y1 - y2) * fraction : y1 + (y2 - y1) * fraction);
      context.stroke();
    }
  }
  for (const box of drawing.boxes) {
    const seen = alpha(box.element, drawing.content);
    if (seen < 0.02) continue;
    const style = getComputedStyle(box.element);
    const { x, y, w, h } = box.rect;
    context.globalAlpha = seen;
    context.fillStyle = look.paper;
    context.strokeStyle = style.borderTopColor;
    context.lineWidth = 1;
    context.setLineDash(style.borderTopStyle === 'dashed' ? [4, 3] : []);
    context.beginPath();
    context.roundRect(x + 0.5, y + 0.5, w - 1, h - 1, 4);
    context.fill();
    context.stroke();
    context.setLineDash([]);
    if (box.element.hasAttribute('data-ask')) {
      const size = Math.min(32, h - 8, w - 8);
      context.save();
      context.translate(x + (w - size) / 2, y + (h - size) / 2);
      context.scale(size / 24, size / 24);
      context.fillStyle = look.accent;
      context.strokeStyle = look.accent;
      const sand = hourglassSand(askLeft() ?? 1);
      context.lineWidth = 1.5;
      context.stroke(new Path2D(HOURGLASS_FRAME));
      context.fill(new Path2D(sand.top));
      context.fill(new Path2D(sand.bottom));
      context.lineWidth = 1;
      context.stroke(new Path2D(sand.stream));
      context.restore();
      continue;
    }
    for (const word of box.words) {
      context.font = word.font;
      context.fillStyle = word.color;
      context.fillText(word.text, word.x + word.w / 2, word.y + word.h / 2);
    }
  }
  context.restore();

  const gap = 12;
  const bar = (WIDTH - 120 - gap * (progress.total - 1)) / Math.max(1, progress.total);
  for (let i = 0; i < progress.total; i++) {
    context.fillStyle = i <= progress.at ? look.accent : look.rule;
    context.beginPath();
    context.roundRect(WIDTH - 60 - (i + 1) * bar - i * gap, 1740, bar, 8, 4);
    context.fill();
  }
}

const TYPES = ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'];
const supported = () => typeof MediaRecorder !== 'undefined' && TYPES.find(type => MediaRecorder.isTypeSupported(type));
export const canRecord = () => typeof HTMLCanvasElement !== 'undefined' && 'captureStream' in HTMLCanvasElement.prototype && !!supported();

let opener: (() => void) | null = null;
export const openVideo = () => opener?.();

/** Share as video: the tree grows in a story frame; what plays here is recorded, then shared or saved. */
export default function GrowVideo() {
  const ar = useLanguage().language === 'ar';
  const growth = useGrowth();
  const dialog = useRef<HTMLDialogElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const session = useRef<{ recorder: MediaRecorder; stream: MediaStream; chunks: Blob[]; frame: number; keep: boolean } | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [open, setOpen] = useState(false);

  const end = (keep: boolean) => {
    const current = session.current;
    if (!current) return;
    session.current = null;
    current.keep = keep;
    cancelAnimationFrame(current.frame);
    if (current.recorder.state !== 'inactive') current.recorder.stop();
    current.stream.getTracks?.().forEach(track => track.stop());
  };

  const start = () => {
    end(false);
    setVideo(null);
    const root = growRoot();
    const type = supported();
    const element = canvas.current;
    const context = element?.getContext('2d');
    if (!root || !type || !element || !context) return;
    const drawing = measure(root);
    if (!drawing) return;
    const css = getComputedStyle(document.documentElement);
    const token = (name: string) => css.getPropertyValue(name).trim();
    context.fillStyle = token('--home-paper');
    const dark = parseInt(String(context.fillStyle).slice(1, 3), 16) < 128;
    const logo = new Image();
    logo.src = `/brand/namaq-icon-${dark ? 'dark' : 'light'}.svg`;
    const look: Look = { paper: token('--home-paper'), ink: token('--home-ink'), rule: token('--home-rule'), accent: token('--home-accent'), font: getComputedStyle(root).getPropertyValue('--font-quran') || 'serif', logo, ask: false };
    const stream = element.captureStream(FPS);
    const recorder = new MediaRecorder(stream, { mimeType: type });
    const chunks: Blob[] = [];
    const current = { recorder, stream, chunks, frame: 0, keep: true };
    recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
    recorder.onstop = () => {
      if (!current.keep) return;
      const extension = type.startsWith('video/mp4') ? 'mp4' : 'webm';
      setVideo(new File(chunks, `namaq-tree.${extension}`, { type: type.split(';')[0] }));
    };
    session.current = current;
    let doneAt = 0;
    let started = false;
    const tick = () => {
      if (session.current !== current) return;
      const now = growthState();
      // The tree went away under the dialog (a back navigation): nothing left to record.
      if ((now.status === 'idle' && session.current === current && started) || !drawing.content.isConnected) { end(false); dialog.current?.close(); return; }
      started = true;
      look.ask = now.mode === 'ask';
      draw(context, drawing, look, now);
      doneAt = now.status === 'done' ? doneAt || Date.now() : 0;
      if (doneAt && Date.now() - doneAt > HOLD) { end(true); return; }
      current.frame = requestAnimationFrame(tick);
    };
    recorder.start();
    void play(0, { video: true });
    tick();
  };

  useEffect(() => {
    opener = () => {
      dialog.current?.showModal();
      setOpen(true);
      requestAnimationFrame(start);
    };
  });
  useEffect(() => () => { opener = null; end(false); }, []);

  const close = () => {
    end(false);
    stop();
    setVideo(null);
    setOpen(false);
    document.querySelector<HTMLElement>('[data-share-tree]')?.focus();
  };

  const recording = !video && (growth.status === 'playing' || growth.status === 'paused' || growth.status === 'done');
  const paused = growth.status === 'paused';
  const toggle = () => {
    const recorder = session.current?.recorder;
    if (paused) { recorder?.resume(); pause(false); }
    else { recorder?.pause(); pause(true); }
  };
  const save = () => {
    if (!video) return;
    const url = URL.createObjectURL(video);
    const link = document.createElement('a');
    link.href = url;
    link.download = video.name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const share = async () => {
    if (!video) return;
    if (navigator.canShare?.({ files: [video] })) {
      try { await navigator.share({ files: [video], title: document.title }); } catch {}
      return;
    }
    save();
  };
  const labels = ar
    ? { title: 'مشاركة كفيديو', close: 'إغلاق', pause: 'إيقاف مؤقت', resume: 'متابعة', again: 'إعادة', share: 'مشاركة الفيديو', save: 'حفظ الفيديو', recording: 'جارٍ تجهيز الفيديو' }
    : { title: 'Share as video', close: 'Close', pause: 'Pause', resume: 'Resume', again: 'Replay', share: 'Share video', save: 'Save video', recording: 'Preparing the video' };

  return <dialog ref={dialog} aria-label={labels.title} onClose={close} dir={ar ? 'rtl' : 'ltr'}
    className="m-0 h-svh max-h-none w-screen max-w-none bg-[var(--home-paper)] p-0 text-[var(--home-ink)] backdrop:bg-black/60">
    <div className="flex h-full flex-col items-center gap-3 p-3">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-base font-semibold">{labels.title}</h2>
        <Button size="lg" variant="muted" onClick={() => dialog.current?.close()} aria-label={labels.close} title={labels.close}><X aria-hidden /></Button>
      </div>
      <canvas ref={canvas} width={WIDTH} height={HEIGHT} className="min-h-0 w-auto max-w-full flex-1 rounded-lg border border-[var(--home-rule)] [aspect-ratio:9/16]" />
      {open && <div className="flex items-center gap-2">
        {recording && growth.status !== 'done' && <Button size="lg" variant="muted" onClick={toggle} aria-label={paused ? labels.resume : labels.pause} title={paused ? labels.resume : labels.pause}>{paused ? <Play aria-hidden /> : <Pause aria-hidden />}</Button>}
        {recording && <LoadingDots label={labels.recording} />}
        {video && <>
          <Button size="lg" variant="muted" onClick={start} aria-label={labels.again} title={labels.again}><RotateCcw aria-hidden /></Button>
          <Button size="lg" variant="primary" onClick={() => void share()} aria-label={labels.share} title={labels.share}><Send aria-hidden /></Button>
          <Button size="lg" variant="muted" onClick={save} aria-label={labels.save} title={labels.save}><Download aria-hidden /></Button>
        </>}
      </div>}
    </div>
  </dialog>;
}
