'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { ArrowLeftRight, BookA, BookOpen, Bookmark, Check, EyeOff, Layers, LightbulbOff, ListTree, NotebookPen, Play, Send, Sparkles, TableOfContents } from 'lucide-react';
import TreeIcon from '@/components/common/TreeIcon';
import Button from '@/components/common/Button';
import { num } from '@shared/quran/arabicNumber';
import styles from './Mushaf.module.css';
import type { AyahLink } from './ayahLinks';

type Kind = 'trees' | 'compare' | 'readings' | 'tafsir' | 'irab' | 'gharib' | 'balagha';

/** An icon with its name under it (owner, 2026-11-13: the buttons got many, so each says what it is). */
/** On (forgotten, saved, noted), the icon and its name take the mark's colour with nothing behind them, as in the app (owner, 2026-11-17). */
function Act({ label, name, on = false, tint = 'var(--home-accent)', pressed, popup = false, onClick, children }: { label: string; name: string; on?: boolean; tint?: string; pressed?: boolean; popup?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <Button size="lg" variant="muted" aria-label={label} title={label} aria-pressed={pressed} aria-haspopup={popup ? 'dialog' : undefined} onClick={onClick}
      style={on ? { color: tint } : undefined}
      className="!h-auto !w-[3.25rem] flex-col !gap-1 py-1.5 text-[0.6875rem] leading-none">
      {children}
      <span aria-hidden className="whitespace-nowrap">{name}</span>
    </Button>
  );
}

/**
 * The icons for one ayah: forgot (with how often, and a check to clear it), save, the reader's note, and where else it is:
 * its compare cards, the trees that hold it, how the ten readers differ in its words and al-Sa'di's tafsir, each previewed
 * in a sheet (AyahPreviewSheet). The first three show only when there are any; every ayah has its tafsir.
 */
export default function AyahActions({ ayah, x, y, forgot, saved, noted = false, ar, links, irab = false, onListen, onRecite, onForgot, onClear, onSave, onNote, onPreview, onTopics, onShare, onClose, onDismiss = onClose }: {
  ayah: string;
  x: number;
  y: number;
  forgot: number;
  saved: boolean;
  /** The reader's «فاصلة» is on this ayah: where they stopped reading, set by them alone (docs/plans/book-reader.md). */
  noted?: boolean;
  ar: boolean;
  links?: AyahLink;
  /** A word was pressed, so its i'rab can open (owner, 2026-11-15). */
  irab?: boolean;
  /** Listening from this ayah to its surah's end, the first button (owner's sketch, 2026-11-17). */
  onListen?: () => void;
  /** Recite mode from this ayah. */
  onRecite?: () => void;
  onForgot: () => void;
  onClear: () => void;
  onSave: () => void;
  onNote?: () => void;
  /** The tree and compare buttons preview in place rather than leaving the mushaf (owner, 2026-11-13). */
  onPreview?: (kind: Kind) => void;
  /** The surah's topics at the ayah's section (owner, 2026-11-14: the header names no topic). */
  onTopics?: () => void;
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
  const treesLabel = ar ? 'متشابهات الآية' : 'Similar passages of this ayah';
  const shareLabel = ar ? 'مشاركة' : 'Share';
  const readingsLabel = ar ? 'القراءات العشر في كلمات الآية' : 'The ten readings of its words';
  const tafsirLabel = ar ? 'تفسير السعدي' : 'Al-Sa‘di’s tafsir';
  const count = 2 + (onListen ? 1 : 0) + (onRecite ? 1 : 0) + (forgot > 0 ? 1 : 0) + (onNote ? 1 : 0) + (onTopics ? 1 : 0) + (links?.compare.length ? 1 : 0) + (links?.trees ? 1 : 0) + (links?.qiraat ? 1 : 0) + (onPreview ? 1 : 0) + (onPreview && irab ? 2 : 0) + (onPreview ? 1 : 0) + (onShare ? 1 : 0);
  // On a narrow phone the buttons wrap onto a second row rather than run off the screen.
  const half = typeof window === 'undefined' ? 0 : Math.min(count * 27 + 8, window.innerWidth / 2 - 8);
  const left = typeof window === 'undefined' ? x : Math.min(window.innerWidth - half, Math.max(half, x));
  const preview = (kind: Kind) => () => { onPreview?.(kind); onClose(); };
  return (
    <div ref={box} role="dialog" aria-label={label} data-ayah-actions className={styles.ayahActions} style={{ left, top: Math.max(64, y) }}>
      {onListen && <Act label={ar ? 'استمع من هذه الآية' : 'Listen from this ayah'} name={ar ? 'استمع' : 'Listen'} onClick={() => { onListen(); onClose(); }}><Play aria-hidden /></Act>}
      {onRecite && <Act label={ar ? 'سمّع من هذه الآية' : 'Recite from this ayah'} name={ar ? 'سمّع' : 'Recite'} onClick={() => { onRecite(); onClose(); }}><EyeOff aria-hidden /></Act>}
      <Act label={forgotLabel} name={ar ? 'نسيتها' : 'Forgot'} on={!!forgot} onClick={() => { onForgot(); onClose(); }}><LightbulbOff aria-hidden /></Act>
      {forgot > 0 && <Act label={clearLabel} name={ar ? 'تذكّرتها' : 'Recalled'} onClick={() => { onClear(); onClose(); }}><Check aria-hidden className="text-[var(--home-green)]" /></Act>}
      <Act label={saveLabel} name={ar ? 'احفظ' : 'Save'} on={saved} tint="var(--home-root)" pressed={saved} onClick={() => { onSave(); onClose(); }}><Bookmark aria-hidden fill={saved ? 'currentColor' : 'none'} /></Act>
      {onNote && <Act label={noteLabel} name={ar ? 'تأمّل' : 'Note'} on={noted} pressed={noted} onClick={() => { onNote(); onClose(); }}><NotebookPen aria-hidden /></Act>}
      {onTopics && <Act label={ar ? 'موضوع الآية في السورة' : 'Topic of this ayah'} name={ar ? 'الموضوعات' : 'Topics'} popup onClick={() => { onTopics(); onClose(); }}><TableOfContents aria-hidden /></Act>}
      {!!links?.compare.length && <Act label={compareLabel} name={ar ? 'المقارنة' : 'Compare'} popup onClick={preview('compare')}><ArrowLeftRight aria-hidden /></Act>}
      {links?.trees && <Act label={treesLabel} name={ar ? 'المتشابهات' : 'Similar'} popup onClick={preview('trees')}><TreeIcon aria-hidden /></Act>}
      {links?.qiraat && <Act label={readingsLabel} name={ar ? 'القراءات' : 'Readings'} popup onClick={preview('readings')}><Layers aria-hidden /></Act>}
      {onPreview && <Act label={tafsirLabel} name={ar ? 'التفسير' : 'Tafsir'} popup onClick={preview('tafsir')}><BookOpen aria-hidden /></Act>}
      {onPreview && irab && <Act label={ar ? 'إعراب الكلمة' : 'Grammar of the word'} name={ar ? 'الإعراب' : 'I‘rab'} popup onClick={preview('irab')}><ListTree aria-hidden /></Act>}
      {onPreview && irab && <Act label={ar ? 'معنى الكلمة' : 'Meaning of the word'} name={ar ? 'المعنى' : 'Meaning'} popup onClick={preview('gharib')}><BookA aria-hidden /></Act>}
      {onPreview && <Act label={ar ? 'البلاغة في الآية' : 'Rhetoric in the ayah'} name={ar ? 'البلاغة' : 'Balagha'} popup onClick={preview('balagha')}><Sparkles aria-hidden /></Act>}
      {onShare && <Act label={shareLabel} name={ar ? 'مشاركة' : 'Share'} popup onClick={() => { onShare(); onClose(); }}><Send aria-hidden /></Act>}
    </div>
  );
}
