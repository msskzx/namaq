'use client';

import { useEffect, useRef } from 'react';
import { ArrowLeftRight, Bookmark, Check, LightbulbOff, NotebookPen } from 'lucide-react';
import TreeIcon from '@/components/common/TreeIcon';
import Button from '@/components/common/Button';
import { num } from '@shared/quran/arabicNumber';
import styles from './Mushaf.module.css';
import type { AyahLink } from './ayahLinks';

/**
 * The icons for one ayah: forgot (with how often, and a check to clear it), save, the reader's note, and where else it is:
 * its compare cards and the trees that hold it, each previewed in a sheet (AyahPreviewSheet). Those two show only when there are any.
 */
export default function AyahActions({ ayah, x, y, forgot, saved, noted = false, ar, links, onForgot, onClear, onSave, onNote, onPreview, onClose, onDismiss = onClose }: {
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
  onPreview?: (kind: 'trees' | 'compare') => void;
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
  const half = 155;
  const left = typeof window === 'undefined' ? x : Math.min(window.innerWidth - half, Math.max(half, x));
  const preview = (kind: 'trees' | 'compare') => () => { onPreview?.(kind); onClose(); };
  return (
    <div ref={box} role="dialog" aria-label={label} className={styles.ayahActions} style={{ left, top: Math.max(64, y) }}>
      <Button size="lg" variant={forgot ? 'primary' : 'muted'} aria-label={forgotLabel} title={forgotLabel} onClick={() => { onForgot(); onClose(); }}>
        <LightbulbOff aria-hidden />
      </Button>
      {forgot > 0 && <Button size="lg" variant="muted" aria-label={clearLabel} title={clearLabel} onClick={() => { onClear(); onClose(); }}><Check aria-hidden className="text-[var(--home-green)]" /></Button>}
      <Button size="lg" variant={saved ? 'primary' : 'muted'} aria-label={saveLabel} title={saveLabel} aria-pressed={saved} onClick={() => { onSave(); onClose(); }}>
        <Bookmark aria-hidden fill={saved ? 'currentColor' : 'none'} />
      </Button>
      {onNote && <Button size="lg" variant={noted ? 'primary' : 'muted'} aria-label={noteLabel} title={noteLabel} aria-pressed={noted} onClick={() => { onNote(); onClose(); }}>
        <NotebookPen aria-hidden />
      </Button>}
      {!!links?.compare.length && <Button size="lg" variant="muted" aria-label={compareLabel} title={compareLabel} aria-haspopup="dialog" onClick={preview('compare')}><ArrowLeftRight aria-hidden /></Button>}
      {links?.trees && <Button size="lg" variant="muted" aria-label={treesLabel} title={treesLabel} aria-haspopup="dialog" onClick={preview('trees')}><TreeIcon aria-hidden /></Button>}
    </div>
  );
}
