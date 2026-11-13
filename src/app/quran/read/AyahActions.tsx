'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { ArrowLeftRight, Bookmark, Check, Layers, LightbulbOff, NotebookPen, Send } from 'lucide-react';
import TreeIcon from '@/components/common/TreeIcon';
import Button from '@/components/common/Button';
import { num } from '@shared/quran/arabicNumber';
import styles from './Mushaf.module.css';
import type { AyahLink } from './ayahLinks';

type Kind = 'trees' | 'compare' | 'readings';

/** An icon with its name under it (owner, 2026-11-13: the buttons got many, so each says what it is). */
function Act({ label, name, on = false, pressed, popup = false, onClick, children }: { label: string; name: string; on?: boolean; pressed?: boolean; popup?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <Button size="lg" variant={on ? 'primary' : 'muted'} aria-label={label} title={label} aria-pressed={pressed} aria-haspopup={popup ? 'dialog' : undefined} onClick={onClick}
      className="!h-auto !w-[3.25rem] flex-col !gap-1 py-1.5 text-[0.6875rem] leading-none">
      {children}
      <span aria-hidden className="whitespace-nowrap">{name}</span>
    </Button>
  );
}

/**
 * The icons for one ayah: forgot (with how often, and a check to clear it), save, the reader's note, and where else it is:
 * its compare cards, the trees that hold it and how the ten readers differ in its words, each previewed in a sheet
 * (AyahPreviewSheet). Those three show only when there are any.
 */
export default function AyahActions({ ayah, x, y, forgot, saved, noted = false, ar, links, onForgot, onClear, onSave, onNote, onPreview, onShare, onClose, onDismiss = onClose }: {
  ayah: string;
  x: number;
  y: number;
  forgot: number;
  saved: boolean;
  noted?: boolean;
  ar: boolean;
  links?: AyahLink;
  onForgot: () => void;
  onClear: () => void;
  onSave: () => void;
  onNote?: () => void;
  /** The tree and compare buttons preview in place rather than leaving the mushaf (owner, 2026-11-13). */
  onPreview?: (kind: Kind) => void;
  /** Share as image, always the last button. */
  onShare?: () => void;
  onClose: () => void;
  /** A press outside closes the buttons; the page then ignores that press. */
  onDismiss?: () => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    box.current?.querySelector<HTMLElement>('button')?.focus({ preventScroll: true });
    const outside = (event: PointerEvent) => { if (!box.current?.contains(event.target as Node)) onDismiss(); };
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); onClose(); } };
    document.addEventListener('pointerdown', outside, true);
    window.addEventListener('keydown', key);
    window.addEventListener('resize', onClose);
    window.addEventListener('scroll', onClose, true);
    return () => {
      document.removeEventListener('pointerdown', outside, true);
      window.removeEventListener('keydown', key);
      window.removeEventListener('resize', onClose);
      window.removeEventListener('scroll', onClose, true);
    };
  }, [onClose, onDismiss]);
  const [surah, number] = ayah.split(':').map(Number);
  const label = ar ? `الآية ${num(number)} من السورة ${num(surah)}` : `Ayah ${surah}:${number}`;
  const forgotLabel = forgot ? (ar ? 'نسيتها مرة أخرى' : 'Forgot again') : (ar ? 'نسيتها' : 'I forgot it');
  const saveLabel = saved ? (ar ? 'أزلها من المحفوظات' : 'Remove from saved') : (ar ? 'احفظ الآية' : 'Save ayah');
  const noteLabel = noted ? (ar ? 'تأملك في الآية' : 'Your note') : (ar ? 'اكتب تأملًا' : 'Write a note');
  const clearLabel = ar ? 'تذكّرتها' : 'I remember it now';
  const compareLabel = ar ? 'في المقارنة' : 'Also in compare';
  const treesLabel = ar ? 'أشجار هذه الآية' : 'Trees of this ayah';
  const shareLabel = ar ? 'مشاركة' : 'Share';
  const readingsLabel = ar ? 'القراءات العشر في كلمات الآية' : 'The ten readings of its words';
  const count = 2 + (forgot > 0 ? 1 : 0) + (onNote ? 1 : 0) + (links?.compare.length ? 1 : 0) + (links?.trees ? 1 : 0) + (links?.qiraat ? 1 : 0) + (onShare ? 1 : 0);
  // On a narrow phone the buttons wrap onto a second row rather than run off the screen.
  const half = typeof window === 'undefined' ? 0 : Math.min(count * 27 + 8, window.innerWidth / 2 - 8);
  const left = typeof window === 'undefined' ? x : Math.min(window.innerWidth - half, Math.max(half, x));
  const preview = (kind: Kind) => () => { onPreview?.(kind); onClose(); };
  return (
    <div ref={box} role="dialog" aria-label={label} data-ayah-actions className={styles.ayahActions} style={{ left, top: Math.max(64, y) }}>
      <Act label={forgotLabel} name={ar ? 'نسيتها' : 'Forgot'} on={!!forgot} onClick={() => { onForgot(); onClose(); }}><LightbulbOff aria-hidden /></Act>
      {forgot > 0 && <Act label={clearLabel} name={ar ? 'تذكّرتها' : 'Recalled'} onClick={() => { onClear(); onClose(); }}><Check aria-hidden className="text-[var(--home-green)]" /></Act>}
      <Act label={saveLabel} name={ar ? 'احفظ' : 'Save'} on={saved} pressed={saved} onClick={() => { onSave(); onClose(); }}><Bookmark aria-hidden fill={saved ? 'currentColor' : 'none'} /></Act>
      {onNote && <Act label={noteLabel} name={ar ? 'تأمّل' : 'Note'} on={noted} pressed={noted} onClick={() => { onNote(); onClose(); }}><NotebookPen aria-hidden /></Act>}
      {!!links?.compare.length && <Act label={compareLabel} name={ar ? 'المقارنة' : 'Compare'} popup onClick={preview('compare')}><ArrowLeftRight aria-hidden /></Act>}
      {links?.trees && <Act label={treesLabel} name={ar ? 'الأشجار' : 'Trees'} popup onClick={preview('trees')}><TreeIcon aria-hidden /></Act>}
      {links?.qiraat && <Act label={readingsLabel} name={ar ? 'القراءات' : 'Readings'} popup onClick={preview('readings')}><Layers aria-hidden /></Act>}
      {onShare && <Act label={shareLabel} name={ar ? 'مشاركة' : 'Share'} popup onClick={() => { onShare(); onClose(); }}><Send aria-hidden /></Act>}
    </div>
  );
}
