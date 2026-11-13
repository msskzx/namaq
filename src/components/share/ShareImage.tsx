'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Clapperboard, Link2, Send, X } from 'lucide-react';
import Button from '@/components/common/Button';
import Emblem from '@/components/common/Emblem';
import LoadingDots from '@/components/common/LoadingDots';
import { useLanguage } from '@/components/language/LanguageContext';
import { shareTarget, shareUrl } from './shareTarget';

/** What the dialog draws: a card on the page (captured as it looks) or a card drawn for the image (an ayah, a note). */
export type ShareSource = { element: HTMLElement } | { content: React.ReactNode };

/** The image's width in CSS pixels; drawn three times over, it is about 1080 pixels wide, as in the phone app. */
const FRAME = 360;
const SCALE = 3;

async function draw(element: HTMLElement) {
  const html2canvas = (await import('html2canvas-pro')).default;
  return html2canvas(element, {
    scale: SCALE, backgroundColor: null, useCORS: true,
    ignoreElements: node => node.hasAttribute('data-share-skip'),
    // Parts meant only for the image (a timeline place's event title) show in the copy that is drawn.
    onclone: copy => copy.querySelectorAll<HTMLElement>('[data-share-only]').forEach(node => { node.hidden = false; }),
  });
}

async function shareBlob(blob: Blob, title: string) {
  const file = new File([blob], 'namaq.png', { type: 'image/png' });
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title }); } catch {}
    return;
  }
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Share as image, as in the phone app: the card on the page colour, the logo and «نمق» under it.
 * The big button shares the image; beside it the card's video (where it has one) and its link.
 */
export function ShareImageDialog({ source, link, onVideo, onClose }: { source: ShareSource; link?: string; onVideo?: () => void; onClose: () => void }) {
  const ar = useLanguage().language === 'ar';
  const dialog = useRef<HTMLDialogElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [shot, setShot] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const box = dialog.current;
    if (box && !box.open) { if (typeof box.showModal === 'function') box.showModal(); else box.setAttribute('open', ''); }
    if (!('element' in source)) return;
    let live = true;
    draw(source.element).then(canvas => { if (live) setShot(canvas.toDataURL('image/png')); }, () => { if (live) setFailed(true); });
    return () => { live = false; };
  }, [source]);
  const close = () => { if (typeof dialog.current?.close === 'function') dialog.current.close(); else onClose(); };
  const ready = 'content' in source || !!shot;
  const send = async () => {
    if (!frame.current || busy) return;
    setBusy(true);
    try {
      const canvas = await draw(frame.current);
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
      if (blob) await shareBlob(blob, document.title);
    } catch { setFailed(true); }
    setBusy(false);
  };
  const shareLink = async () => {
    if (!link) return;
    if (navigator.share) { try { await navigator.share({ title: document.title, url: link }); } catch {} return; }
    try { await navigator.clipboard.writeText(link); } catch {}
  };
  const labels = ar
    ? { title: 'مشاركة', close: 'إغلاق', image: 'مشاركة كصورة', video: 'مشاركة كفيديو', link: 'مشاركة الرابط', failed: 'تعذّر تجهيز الصورة.', wait: 'جارٍ تجهيز الصورة' }
    : { title: 'Share', close: 'Close', image: 'Share as image', video: 'Share as video', link: 'Share link', failed: 'Could not make the image.', wait: 'Making the image' };
  return <dialog ref={dialog} aria-label={labels.title} onClose={onClose} onClick={event => { if (event.target === dialog.current) close(); }} dir="rtl"
    className="m-auto mb-0 flex max-h-[92dvh] w-full max-w-md flex-col rounded-t-2xl bg-[var(--home-paper)] p-0 text-[var(--home-ink)] backdrop:bg-black/45 md:mb-auto md:rounded-2xl">
    <div className="flex items-center gap-2 px-4 pt-3">
      <h2 className="flex-1 font-semibold">{labels.title}</h2>
      <Button size="lg" variant="muted" aria-label={labels.close} title={labels.close} onClick={close}><X aria-hidden /></Button>
    </div>
    <div className="mx-3 flex min-h-48 flex-1 items-start justify-center overflow-auto rounded-xl border border-[var(--home-rule)] bg-[var(--home-paper-deep)] p-3">
      {failed ? <p className="self-center text-[var(--home-accent)]">{labels.failed}</p>
        : ready ? <div ref={frame} className="flex flex-col gap-2.5 bg-[var(--home-paper)] px-4 pb-3 pt-5" style={{ width: FRAME }}>
          {/* A captured data URL: next/image has nothing to optimise here. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {'content' in source ? source.content : <img src={shot!} alt="" className="block w-full" />}
          <p className="flex items-center gap-1.5 text-[1.2rem] font-bold leading-none" lang="ar"><Emblem className="size-[26px]" />نمق</p>
        </div>
          : <div className="self-center" aria-label={labels.wait}><LoadingDots /></div>}
    </div>
    <div className="flex items-center justify-center gap-3 py-4">
      <Button size="lg" variant="primary" onClick={() => void send()} disabled={!ready || busy || failed} aria-label={labels.image} title={labels.image}><Send aria-hidden /></Button>
      {onVideo && <Button size="lg" variant="muted" aria-label={labels.video} title={labels.video} onClick={() => { close(); onVideo(); }}><Clapperboard aria-hidden /></Button>}
      {link && <Button size="lg" variant="muted" aria-label={labels.link} title={labels.link} onClick={() => void shareLink()}><Link2 aria-hidden /></Button>}
    </div>
  </dialog>;
}

/**
 * The paper airplane: opens share as image on its card. With `content` it shares that; otherwise the card it sits in,
 * the nearest `[data-share-card]` (its `[data-share-image]` part if it marks one), leaving out anything marked `data-share-skip`.
 */
export function ShareImageButton({ content, href, onVideo, size = 'lg', className, iconSize }: {
  content?: React.ReactNode; href?: string; onVideo?: () => void; size?: 'lg' | 'icon'; className?: string; iconSize?: number;
}) {
  const ar = useLanguage().language === 'ar';
  const [source, setSource] = useState<ShareSource | null>(null);
  const label = ar ? 'مشاركة' : 'Share';
  const open = (button: HTMLElement) => {
    if (content) { setSource({ content }); return; }
    const element = shareTarget(button);
    if (element) setSource({ element });
  };
  return <>
    <Button size={size} variant="muted" onClick={event => open(event.currentTarget)} aria-label={label} title={label} aria-haspopup="dialog" className={className}>
      <Send aria-hidden size={iconSize} />
    </Button>
    {/* On the page's body: inside the card, a part left out of the image would take the dialog with it. */}
    {source && createPortal(<ShareImageDialog source={source} link={shareUrl(href)} onVideo={onVideo} onClose={() => setSource(null)} />, document.body)}
  </>;
}
