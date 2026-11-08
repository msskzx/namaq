'use client';

import { useEffect, useRef, useState } from 'react';
import { Download, Pause, Play, RotateCcw, Send, X } from 'lucide-react';
import Button from '@/components/common/Button';
import LoadingDots from '@/components/common/LoadingDots';
import { mushafText } from '@/components/common/MushafText';
import type { SpreadAyah } from '@/components/quran/PageSpread';
import { num } from '@/lib/quran/arabicNumber';
import type { CardSide, PairCard } from './pairCards';
import { ayahStarts, stepTime, type ReadStep } from './readAlong';

// A vertical story frame, as Instagram and WhatsApp status show it.
const WIDTH = 1080;
const HEIGHT = 1920;
const FPS = 30;
const MARGIN = 80;
const TOP = 330;
const BOTTOM = 190;
/** How long the last frame stays before the video ends. */
const HOLD = 1500;

type Look = { paper: string; deep: string; ink: string; muted: string; rule: string; accent: string; root: string; highlight: string; onHighlight: string; quran: string; title: string; logo: HTMLImageElement };
type Placed = { text: string; x: number; y: number; w: number; mark?: SpreadAyah['marks'] extends Record<number, infer M> | undefined ? M : never; ayah: number; word: number; seal?: boolean };
type Block = { label: string; words: Placed[]; height: number };
type Layout = { size: number; blocks: [Block, Block] };

/** The two sides the card shows while a step is read: a one-to-many card swaps in the partner being read. */
export function sidesAt(card: PairCard, option: number): [CardSide, CardSide] {
  const many = card.many;
  if (!many) return card.sides;
  const chosen = many.options[option] ?? many.options[0];
  return card.sides.map((side, i) => (i === many.side ? { ...side, ayah: chosen.ayah.number, ayat: [chosen.ayah] } : { ...side, ayat: [chosen.shared] })) as [CardSide, CardSide];
}

/** Words of one side placed right to left in centred lines; the ayah number closes each ayah. */
function place(context: CanvasRenderingContext2D, side: CardSide, size: number, look: Look): Placed[] {
  context.font = `${size}px ${look.quran}`;
  const tokens = side.ayat.flatMap(ayah => [
    ...ayah.words.map((word, index) => ({ text: mushafText(word), ayah: ayah.number, word: index, mark: ayah.marks?.[index] })),
    { text: `﴿${num(ayah.number)}﴾`, ayah: ayah.number, word: -1, mark: undefined, seal: true },
  ]);
  const space = context.measureText(' ').width;
  const width = WIDTH - 2 * MARGIN;
  const lines: (typeof tokens[number] & { w: number })[][] = [[]];
  let used = 0;
  for (const token of tokens) {
    const w = context.measureText(token.text).width;
    if (used > 0 && used + space + w > width) { lines.push([]); used = 0; }
    lines[lines.length - 1].push({ ...token, w });
    used += (used > 0 ? space : 0) + w;
  }
  const lineHeight = size * 1.9;
  return lines.flatMap((line, row) => {
    const total = line.reduce((sum, token) => sum + token.w, 0) + space * (line.length - 1);
    let x = WIDTH - MARGIN - (width - total) / 2;
    return line.map(token => {
      const placed = { ...token, x, y: row * lineHeight + size * 1.3 };
      x -= token.w + space;
      return placed;
    });
  });
}

function layout(context: CanvasRenderingContext2D, sides: [CardSide, CardSide], labels: [string, string], look: Look): Layout {
  const room = HEIGHT - TOP - BOTTOM;
  for (let size = 72; ; size -= 4) {
    const blocks = sides.map((side, i) => {
      const words = place(context, side, size, look);
      const lines = words.length ? Math.round(words[words.length - 1].y / (size * 1.9)) + 1 : 1;
      return { label: labels[i], words, height: 70 + lines * size * 1.9 };
    }) as [Block, Block];
    if (size <= 28 || blocks[0].height + blocks[1].height + 80 <= room) return { size, blocks };
  }
}

function roundRect(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  context.beginPath();
  if (context.roundRect) context.roundRect(x, y, w, h, r);
  else context.rect(x, y, w, h);
}

function draw(context: CanvasRenderingContext2D, frame: Layout, look: Look, step: ReadStep | undefined, title: string, progress: { starts: number[]; at: number; done: boolean }) {
  context.direction = 'rtl';
  context.fillStyle = look.paper;
  context.fillRect(0, 0, WIDTH, HEIGHT);
  if (look.logo.complete && look.logo.naturalWidth) context.drawImage(look.logo, WIDTH / 2 - 60, 90, 120, 120);
  context.textAlign = 'center';
  context.fillStyle = look.ink;
  context.font = `44px ${look.title}`;
  context.fillText(title, WIDTH / 2, 270);
  const room = HEIGHT - TOP - BOTTOM;
  let y = TOP + (room - frame.blocks[0].height - frame.blocks[1].height - 80) / 2;
  frame.blocks.forEach((block, side) => {
    if (side === 1) {
      context.fillStyle = look.rule;
      context.fillRect(MARGIN * 2, y + 30, WIDTH - MARGIN * 4, 2);
      y += 80;
    }
    context.textAlign = 'center';
    context.fillStyle = look.muted;
    context.font = `36px ${look.title}`;
    context.fillText(block.label, WIDTH / 2, y + 40);
    const top = y + 70;
    context.textAlign = 'right';
    context.font = `${frame.size}px ${look.quran}`;
    for (const word of block.words) {
      const reading = step?.side === side && step.ayah === word.ayah && step.word === word.word;
      const lit = !!step?.link && word.mark?.link === step.link;
      const baseline = top + word.y;
      if (lit) {
        context.fillStyle = look.highlight;
        roundRect(context, word.x - word.w - 8, baseline - frame.size * 1.15, word.w + 16, frame.size * 1.6, 10);
        context.fill();
      }
      context.fillStyle = word.seal ? look.muted : lit ? look.onHighlight : word.mark ? (word.mark.kind === 'exact' ? look.accent : look.root) : look.ink;
      if (word.mark?.kind === 'related' && !lit) context.globalAlpha = 0.6;
      context.fillText(word.text, word.x, baseline);
      context.globalAlpha = 1;
      if (reading) {
        context.fillStyle = look.accent;
        context.fillRect(word.x - word.w, baseline + frame.size * 0.42, word.w, 5);
      }
    }
    y += block.height;
  });
  // A bar per ayah read, as under the card, and where the video comes from.
  const bars = progress.starts.length;
  if (bars > 1) {
    const gap = 10;
    const w = (WIDTH - 2 * MARGIN - gap * (bars - 1)) / bars;
    progress.starts.forEach((start, i) => {
      context.fillStyle = progress.done || start <= progress.at ? look.accent : look.rule;
      roundRect(context, WIDTH - MARGIN - (i + 1) * w - i * gap, HEIGHT - 150, w, 8, 4);
      context.fill();
    });
  }
  context.textAlign = 'center';
  context.fillStyle = look.muted;
  context.font = `32px ${look.title}`;
  context.direction = 'ltr';
  context.fillText('namaq.vercel.app', WIDTH / 2, HEIGHT - 70);
}

const TYPES = ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'];
const supported = () => typeof MediaRecorder !== 'undefined' && TYPES.find(type => MediaRecorder.isTypeSupported(type));
export const canRecord = () => typeof HTMLCanvasElement !== 'undefined' && 'captureStream' in HTMLCanvasElement.prototype && !!supported();

/** Share as video: the card's read-along plays in a story frame, both ayat stacked; what plays is recorded, then shared or saved. */
export default function ReadVideo({ card, plan, speed, title, label, ar, onClose }: { card: PairCard; plan: ReadStep[]; speed: number; title: string; label: (side: CardSide) => string; ar: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const session = useRef<{ recorder: MediaRecorder; stream: MediaStream; frame: number; keep: boolean; paused: number; pausedAt: number } | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [status, setStatus] = useState<'recording' | 'paused' | 'done'>('recording');

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
    setStatus('recording');
    const type = supported();
    const element = canvas.current;
    const context = element?.getContext('2d');
    if (!type || !element || !context) return;
    const css = getComputedStyle(document.documentElement);
    const token = (name: string) => css.getPropertyValue(name).trim();
    const body = getComputedStyle(document.body);
    context.fillStyle = token('--home-paper');
    const dark = parseInt(String(context.fillStyle).slice(1, 3), 16) < 128;
    const logo = new Image();
    logo.src = `/brand/namaq-icon-${dark ? 'dark' : 'light'}.svg`;
    const look: Look = {
      paper: token('--home-paper'), deep: token('--home-paper-deep'), ink: token('--home-ink'), muted: token('--home-muted'), rule: token('--home-rule'),
      accent: token('--home-accent'), root: token('--home-root'), highlight: token('--home-highlight'), onHighlight: token('--home-on-highlight'),
      // The mushaf font, as the cards show the ayat (the page itself is lang="ar", so it can't be found by language).
      quran: body.getPropertyValue('--font-quran').trim() || 'serif', title: body.fontFamily || 'serif', logo,
    };
    const layouts = new Map<number, Layout>();
    const frameFor = (option: number) => {
      if (!layouts.has(option)) {
        const sides = sidesAt(card, option);
        layouts.set(option, layout(context, sides, [label(sides[0]), label(sides[1])], look));
      }
      return layouts.get(option)!;
    };
    const ends = plan.reduce<number[]>((list, step) => [...list, (list[list.length - 1] ?? 0) + stepTime(step, speed)], []);
    const total = ends[ends.length - 1] ?? 0;
    const starts = ayahStarts(plan);
    const stream = element.captureStream(FPS);
    const recorder = new MediaRecorder(stream, { mimeType: type });
    const chunks: Blob[] = [];
    const current = { recorder, stream, frame: 0, keep: true, paused: 0, pausedAt: 0 };
    recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
    recorder.onstop = () => {
      if (!current.keep) return;
      const extension = type.startsWith('video/mp4') ? 'mp4' : 'webm';
      setVideo(new File(chunks, `namaq-compare.${extension}`, { type: type.split(';')[0] }));
      setStatus('done');
    };
    session.current = current;
    const began = performance.now();
    const tick = () => {
      if (session.current !== current) return;
      if (!current.pausedAt) {
        const t = performance.now() - began - current.paused;
        const at = ends.findIndex(end => end > t);
        const step = at >= 0 ? plan[at] : undefined;
        draw(context, frameFor(step?.option ?? plan[plan.length - 1]?.option ?? 0), look, step, title, { starts, at: at >= 0 ? at : plan.length, done: at < 0 });
        if (t > total + HOLD) { end(true); return; }
      }
      current.frame = requestAnimationFrame(tick);
    };
    recorder.start();
    tick();
  };

  useEffect(() => {
    dialog.current?.showModal();
    const record = () => { if (dialog.current?.open) start(); };
    if (document.fonts) void document.fonts.ready.then(() => requestAnimationFrame(record));
    else requestAnimationFrame(record);
    return () => end(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    const current = session.current;
    if (!current) return;
    if (current.pausedAt) {
      current.paused += performance.now() - current.pausedAt;
      current.pausedAt = 0;
      current.recorder.resume();
      setStatus('recording');
    } else {
      current.pausedAt = performance.now();
      current.recorder.pause();
      setStatus('paused');
    }
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
      try { await navigator.share({ files: [video], title }); } catch {}
      return;
    }
    save();
  };
  const labels = ar
    ? { title: 'مشاركة كفيديو', close: 'إغلاق', pause: 'إيقاف مؤقت', resume: 'متابعة', again: 'إعادة', share: 'مشاركة الفيديو', save: 'حفظ الفيديو', recording: 'جارٍ تجهيز الفيديو' }
    : { title: 'Share as video', close: 'Close', pause: 'Pause', resume: 'Resume', again: 'Replay', share: 'Share video', save: 'Save video', recording: 'Preparing the video' };

  return <dialog ref={dialog} aria-label={labels.title} onClose={() => { end(false); onClose(); }} dir={ar ? 'rtl' : 'ltr'}
    className="m-0 h-svh max-h-none w-screen max-w-none bg-[var(--home-paper)] p-0 text-[var(--home-ink)] backdrop:bg-black/60">
    <div className="flex h-full flex-col items-center gap-3 p-3">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-base font-semibold">{labels.title}</h2>
        <Button size="lg" variant="muted" onClick={() => dialog.current?.close()} aria-label={labels.close} title={labels.close}><X aria-hidden /></Button>
      </div>
      <canvas ref={canvas} width={WIDTH} height={HEIGHT} className="min-h-0 w-auto max-w-full flex-1 rounded-lg border border-[var(--home-rule)] [aspect-ratio:9/16]" />
      <div className="flex items-center gap-2">
        {status !== 'done' && <>
          <Button size="lg" variant="muted" onClick={toggle} aria-label={status === 'paused' ? labels.resume : labels.pause} title={status === 'paused' ? labels.resume : labels.pause}>{status === 'paused' ? <Play aria-hidden /> : <Pause aria-hidden />}</Button>
          <LoadingDots label={labels.recording} />
        </>}
        {video && <>
          <Button size="lg" variant="muted" onClick={start} aria-label={labels.again} title={labels.again}><RotateCcw aria-hidden /></Button>
          <Button size="lg" variant="primary" onClick={() => void share()} aria-label={labels.share} title={labels.share}><Send aria-hidden /></Button>
          <Button size="lg" variant="muted" onClick={save} aria-label={labels.save} title={labels.save}><Download aria-hidden /></Button>
        </>}
      </div>
    </div>
  </dialog>;
}
