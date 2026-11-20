'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, CheckCheck, ChevronLeft, ChevronRight, Download, Pause, Play, RotateCcw, Send, X } from 'lucide-react';
import Button from '@/components/common/Button';
import LoadingDots from '@/components/common/LoadingDots';
import { num } from '@shared/quran/arabicNumber';
import { readPlan, READ_SPEEDS, stepTime, type ReadStep } from '@shared/quran/readPlan';
import { compareRecorderPage, compareVideoInput, ENGLISH, markColours, pageVideoInputs, videoCard, type CompareLook, type CompareVideoInput, type VideoNames } from '@shared/video/compareVideo';
import { clock, partLengths, stepEnds } from '@shared/video/pageVideo';
import { VIDEO_TYPES } from '@shared/video/recorder';
import type { CardSide, PairCard } from './pairCards';
import { setReadSpeed, useReadSpeed } from './readAlong';
import Sheet from '@/components/common/Sheet';
import { QURAN_FAMILY, quranFontFace } from '@/components/quran/text/quranFont';

export const canRecord = () => typeof HTMLCanvasElement !== 'undefined' && 'captureStream' in HTMLCanvasElement.prototype
  && typeof MediaRecorder !== 'undefined' && VIDEO_TYPES.some(type => MediaRecorder.isTypeSupported(type));

/** The page's colours, the fonts and the emblem, for the recorder (shared/video/compareVideo.ts), which draws the app's compare card in them. */
function webLook(): CompareLook {
  const css = getComputedStyle(document.documentElement);
  const probe = document.createElement('canvas').getContext('2d');
  // As #rrggbb, which the mark colours are blended in.
  const token = (name: string) => {
    const value = css.getPropertyValue(name).trim();
    if (!probe) return value;
    probe.fillStyle = '#000';
    probe.fillStyle = value;
    return String(probe.fillStyle);
  };
  const paper = token('--home-paper');
  const dark = parseInt(paper.slice(1, 3), 16) < 128;
  // Under the colour setting a mark may have no colour of its own (src/app/theme.css --mark-*): it keeps the text's.
  const mark = (name: string) => (/currentcolor/i.test(css.getPropertyValue(name)) ? undefined : token(name));
  const colours = { marks: { exact: mark('--mark-exact'), written: mark('--mark-written'), root: mark('--mark-root') }, muted: token('--home-muted') };
  return {
    paper, card: token('--home-card'), deep: token('--home-paper-deep'), ink: token('--home-ink'), muted: colours.muted, rule: token('--home-rule'), accent: token('--home-accent'),
    green: token('--home-green'), highlight: token('--home-highlight'), onHighlight: token('--home-on-highlight'), marks: markColours(colours),
    font: `"${QURAN_FAMILY}"`, ui: '"Amiri"', logo: `${location.origin}/brand/namaq-icon-${dark ? 'dark' : 'light'}.svg`,
  };
}

/** The page's own Amiri faces (self-hosted by next/font under its own family name), renamed "Amiri" for the recorder's frame. */
function amiriFaces() {
  const faces: string[] = [];
  for (const sheet of document.styleSheets) {
    let rules: CSSRuleList;
    try { rules = sheet.cssRules; } catch { continue; }
    for (const rule of rules) {
      if (!(rule instanceof CSSFontFaceRule) || !/amiri/i.test(rule.style.getPropertyValue('font-family')) || /fallback/i.test(rule.style.getPropertyValue('font-family'))) continue;
      faces.push(rule.cssText.replace(/font-family:[^;]+;/, 'font-family:"Amiri";').replace(/url\((["']?)\//g, `url($1${location.origin}/`));
    }
  }
  return faces.join('');
}
const fontFace = () => `${quranFontFace(location.origin)}${amiriFaces()}`;
const pageOf = (input: CompareVideoInput) => compareRecorderPage(input, fontFace());

const fromBase64 = (data: string, mime: string, name: string) => {
  const bytes = Uint8Array.from(atob(data), char => char.charCodeAt(0));
  return new File([bytes], `${name}.${mime.includes('mp4') ? 'mp4' : 'webm'}`, { type: mime });
};

/**
 * Share as video: the recorder page plays in a frame while it records, then the video is shared or saved.
 * With several pages (a long page video in parts) it records them one after another.
 */
function RecorderDialog({ pages, title, ar, onClose }: { pages: string[]; title: string; ar: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [part, setPart] = useState(0);
  const [run, setRun] = useState(0);
  const [video, setVideo] = useState<File | null>(null);
  const [status, setStatus] = useState<'recording' | 'paused' | 'done' | 'failed'>('recording');
  useEffect(() => {
    const listen = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow || typeof event.data !== 'string') return;
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'video') { setVideo(fromBase64(message.data, message.mime, pages.length > 1 ? `namaq-compare-${part + 1}` : 'namaq-compare')); setStatus('done'); }
        if (message.type === 'error') setStatus('failed');
      } catch {}
    };
    window.addEventListener('message', listen);
    return () => window.removeEventListener('message', listen);
  }, [pages.length, part]);
  const restart = (to: number) => { setVideo(null); setStatus('recording'); setPart(to); setRun(value => value + 1); };
  const toggle = () => {
    const paused = status === 'paused';
    frame.current?.contentWindow?.postMessage(JSON.stringify({ type: paused ? 'resume' : 'pause' }), '*');
    setStatus(paused ? 'recording' : 'paused');
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
  const several = pages.length > 1;
  const labels = ar
    ? { title: several ? `مشاركة كفيديو · الجزء ${num(part + 1)} من ${num(pages.length)}` : 'مشاركة كفيديو', close: 'إغلاق', pause: 'إيقاف مؤقت', resume: 'متابعة', again: 'إعادة', share: 'مشاركة الفيديو', save: 'حفظ الفيديو', recording: 'جارٍ تجهيز الفيديو', next: 'الجزء التالي', failed: 'لا يمكن تسجيل الفيديو على هذا الجهاز.' }
    : { title: several ? `Share as video · part ${part + 1} of ${pages.length}` : 'Share as video', close: 'Close', pause: 'Pause', resume: 'Resume', again: 'Replay', share: 'Share video', save: 'Save video', recording: 'Preparing the video', next: 'Next part', failed: 'This device cannot record the video.' };
  const Next = ar ? ChevronLeft : ChevronRight;

  return <Sheet ref={dialog} open kind="full" label={labels.title} onClose={onClose} dir={ar ? 'rtl' : 'ltr'} lang={ar ? 'ar' : 'en'}>
    <div className="flex h-full flex-col items-center gap-3 p-3">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-base font-semibold">{labels.title}</h2>
        <Button size="lg" variant="muted" onClick={() => dialog.current?.close()} aria-label={labels.close} title={labels.close}><X aria-hidden /></Button>
      </div>
      <iframe ref={frame} key={`${part}-${run}`} srcDoc={pages[part]} title={labels.title} className="min-h-0 w-auto max-w-full flex-1 rounded-lg border border-[var(--home-rule)] [aspect-ratio:9/16]" />
      <div className="flex min-h-12 items-center gap-2">
        {status === 'failed' && <p role="status" className="text-[var(--home-accent)]">{labels.failed}</p>}
        {(status === 'recording' || status === 'paused') && <>
          <Button size="lg" variant="muted" onClick={toggle} aria-label={status === 'paused' ? labels.resume : labels.pause} title={status === 'paused' ? labels.resume : labels.pause}>{status === 'paused' ? <Play aria-hidden /> : <Pause aria-hidden />}</Button>
          <LoadingDots label={labels.recording} />
        </>}
        {video && <>
          <Button size="lg" variant="muted" onClick={() => restart(part)} aria-label={labels.again} title={labels.again}><RotateCcw aria-hidden /></Button>
          <Button size="lg" variant="primary" onClick={() => void share()} aria-label={labels.share} title={labels.share}><Send aria-hidden /></Button>
          <Button size="lg" variant="muted" onClick={save} aria-label={labels.save} title={labels.save}><Download aria-hidden /></Button>
          {part < pages.length - 1 && <Button size="lg" variant="neutral" onClick={() => restart(part + 1)}>{labels.next}<Next size={18} aria-hidden /></Button>}
        </>}
      </div>
    </div>
  </Sheet>;
}

/** One card's read-along as a video, from its studio. */
export function CardVideo({ card, plan, speed, title, names, ar, onClose }: { card: PairCard; plan: ReadStep[]; speed: number; title: string; names: VideoNames; ar: boolean; onClose: () => void }) {
  const [pages] = useState(() => [pageOf(compareVideoInput({ title, cards: [videoCard(card, plan, speed, names)], look: webLook() }))]);
  return <RecorderDialog pages={pages} title={title} ar={ar} onClose={onClose} />;
}

/**
 * Share a pair page as video: every card is ticked at first; untick the ones to leave out.
 * A video over about 3 minutes is split into parts (shared/video/pageVideo.ts), recorded one after another.
 */
export function PageVideo({ cards, title, subtitle, label, names, ar, onClose }: { cards: PairCard[]; title: string; subtitle?: string; label: (side: CardSide) => string; names: VideoNames; ar: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const speed = useReadSpeed();
  const [off, setOff] = useState<string[]>([]);
  const [pages, setPages] = useState<string[] | null>(null);
  const plans = useMemo(() => cards.map(card => ({ card, plan: readPlan(card) })), [cards]);
  const picked = plans.filter(({ card }) => !off.includes(card.id));
  const lengths = partLengths(picked.map(({ plan }) => stepEnds(plan.map(step => stepTime(step, speed)))));
  const total = lengths.reduce((sum, length) => sum + length, 0);
  const time = (ms: number) => (ar ? clock(ms) : `${Math.floor(Math.round(ms / 1000) / 60)}:${String(Math.round(ms / 1000) % 60).padStart(2, '0')}`);
  const summary = !lengths.length ? '' : lengths.length > 1 ? `${ar ? `الأجزاء ${num(lengths.length)}` : `${lengths.length} parts`} · ${time(total)}` : time(total);
  const all = off.length === 0;
  const next = READ_SPEEDS[(READ_SPEEDS.indexOf(speed) + 1) % READ_SPEEDS.length];
  const record = () => {
    const inputs = pageVideoInputs({ title, look: webLook(), cards: picked.map(({ card, plan }) => videoCard(card, plan, speed, names)), ...(subtitle ? { subtitle } : {}), ...(ar ? {} : { words: ENGLISH }) });
    setPages(inputs.map(pageOf));
  };
  const toggle = (id: string) => setOff(list => (list.includes(id) ? list.filter(other => other !== id) : [...list, id]));
  const labels = ar
    ? { title: 'مشاركة الصفحة كفيديو', close: 'إغلاق', all: all ? 'إلغاء تحديد الكل' : 'تحديد الكل', speed: 'السرعة', record: 'مشاركة كفيديو' }
    : { title: 'Share the page as video', close: 'Close', all: all ? 'Untick all' : 'Tick all', speed: 'Speed', record: 'Share as video' };
  if (pages) return <RecorderDialog pages={pages} title={title} ar={ar} onClose={onClose} />;
  return <Sheet ref={dialog} open kind="center" label={labels.title} onClose={onClose} dir={ar ? 'rtl' : 'ltr'} lang={ar ? 'ar' : 'en'} className="max-h-[85dvh] max-w-lg p-3">
    <div className="flex max-h-[calc(85dvh-1.5rem)] flex-col gap-2">
      <div className="flex items-center gap-1">
        <h2 className="flex-1 text-base font-semibold">{labels.title}</h2>
        <Button size="sm" variant="muted" className="min-w-9 tabular-nums" onClick={() => setReadSpeed(next)} aria-label={`${labels.speed} ${speed}×`} title={labels.speed}><span dir="ltr">{speed}×</span></Button>
        <Button size="icon" variant="muted" aria-pressed={all} onClick={() => setOff(all ? cards.map(card => card.id) : [])} aria-label={labels.all} title={labels.all} className={all ? 'text-[var(--home-accent)]' : undefined}><CheckCheck size={18} aria-hidden /></Button>
        <Button size="icon" variant="muted" onClick={() => dialog.current?.close()} aria-label={labels.close} title={labels.close}><X size={18} aria-hidden /></Button>
      </div>
      <ol className="min-h-0 flex-1 overflow-y-auto">
        {plans.map(({ card }, index) => {
          const on = !off.includes(card.id);
          return <li key={card.id}>
            <label className="flex min-h-12 cursor-pointer items-center gap-3 border-b border-[var(--home-rule)]">
              <input type="checkbox" checked={on} onChange={() => toggle(card.id)} className="peer sr-only" />
              <span aria-hidden className={`flex size-6 shrink-0 items-center justify-center rounded-md border-[1.5px] peer-focus-visible:outline-2 peer-focus-visible:outline-[var(--home-accent)] ${on ? 'border-[var(--home-accent)] bg-[var(--home-accent)] text-[var(--home-paper)]' : 'border-[var(--home-rule)]'}`}>{on && <Check size={16} />}</span>
              <span className="min-w-6 text-sm text-[var(--home-muted)]">{ar ? num(index + 1) : index + 1}</span>
              <span className={`truncate ${on ? '' : 'text-[var(--home-muted)]'}`}>{label(card.sides[0])} · {label(card.sides[1])}</span>
            </label>
          </li>;
        })}
      </ol>
      <div className="flex items-center gap-3 pt-1">
        <span className="flex-1 text-sm text-[var(--home-muted)]">{summary}</span>
        <Button size="lg" variant="primary" disabled={!picked.length} onClick={record} aria-label={labels.record} title={labels.record}><Send aria-hidden /></Button>
      </div>
    </div>
  </Sheet>;
}
