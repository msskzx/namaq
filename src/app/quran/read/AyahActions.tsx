'use client';

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeftRight, BookOpenText, BookOpen, Bookmark, Check, Copy, EyeOff, Layers, LightbulbOff, ListTree, NotebookPen, Play, Send, Sparkles, TableOfContents, TextSearch } from 'lucide-react';
import TreeIcon from '@/components/common/TreeIcon';
import Button from '@/components/common/Button';
import { num } from '@shared/quran/arabicNumber';
import { forgotLabel as forgotName, NOTE_NAME, SCOPE_NAMES, wordScope, type Scope, type Selection } from '@shared/quran/selection';
import Segmented from '@/components/common/Segmented';
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
export default function AyahActions({ ayah, x, y, below, due, forgot, saved, noted = false, ar, links, irab = false, words, scope = 'ayah', text = '', undo = false, onScope, onCopy, onPlaces, onShareWords, onListen, onRecite, onForgot, onClear, onSave, onNote, onPreview, onTopics, onShare, onClose, onDismiss = onClose }: {
  ayah: string;
  /** Something in the ayah is due for review (the ayah or one of its words): «تذكّرتها» shows. Defaults to `forgot > 0`. */
  due?: boolean;
  /** Where the pressed word ends below: the buttons open there when there is no room above it. */
  below?: number;
  /** The pressed word, or the words dragged over after the long press: a tab switches the buttons to theirs (owner, 2026-11-19). */
  words?: Selection;
  /** The tab open: the ayah's buttons, or the word's or words' own. */
  scope?: Scope;
  /** The selected words as text, for their tab's label, copy and places. */
  text?: string;
  /** Every selected word is already forgotten: «نسيت» lets them go. */
  undo?: boolean;
  onScope?: (scope: Scope) => void;
  onCopy?: () => void;
  /** Where the selected words come in the Quran (the search). */
  onPlaces?: () => void;
  onShareWords?: () => void;
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
    box.current?.querySelector<HTMLElement>('button:not([role="tab"])')?.focus({ preventScroll: true });
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
  // Above the word, or under it when the buttons would run off the top of the screen.
  const [under, setUnder] = useState(false);
  useLayoutEffect(() => { setUnder(below !== undefined && Math.max(64, y) - (box.current?.offsetHeight ?? 0) - 8 < 8); }, [x, y, below, scope, words]);
  const [surah, number] = ayah.split(':').map(Number);
  const label = scope !== 'ayah' && text ? `«${text}»` : ar ? `الآية ${num(number)} من السورة ${num(surah)}` : `Ayah ${surah}:${number}`;
  // One «نسيت» for what the tab holds: the ayah, the word, or each selected word (owner, 2026-11-19).
  const forgotLabel = ar ? forgotName(scope, forgot, undo) : undo ? 'I remember now' : scope === 'ayah' ? (forgot ? 'Forgot again' : 'I forgot it') : 'I forgot';
  const saveLabel = saved ? (ar ? 'أزلها من المحفوظات' : 'Remove from saved') : (ar ? 'احفظ الآية' : 'Save ayah');
  const noteLabel = noted ? (ar ? 'ما دوّنته عن الآية' : 'Your note') : (ar ? 'دوّن عن الآية' : 'Write a note');
  const clearLabel = ar ? 'تذكّرتها' : 'I remember it now';
  const compareLabel = ar ? 'في المقارنة' : 'Also in compare';
  const treesLabel = ar ? 'متشابهات الآية' : 'Similar passages of this ayah';
  const shareLabel = ar ? 'مشاركة' : 'Share';
  const readingsLabel = ar ? 'القراءات العشر في كلمات الآية' : 'The ten readings of its words';
  const tafsirLabel = ar ? 'تفسير السعدي' : 'Al-Sa‘di’s tafsir';
  const count = scope === 'words' ? 4 : scope === 'word' ? 5 : 2 + (onListen ? 1 : 0) + (onRecite ? 1 : 0) + (forgot > 0 ? 1 : 0) + (onNote ? 1 : 0) + (onTopics ? 1 : 0) + (links?.compare.length ? 1 : 0) + (links?.trees ? 1 : 0) + (links?.qiraat ? 1 : 0) + (onPreview ? 2 : 0) + (onShare ? 1 : 0);
  // On a narrow phone the buttons wrap onto a second row rather than run off the screen.
  // As wide as its buttons in one row, up to the screen (the tab row above them takes that width too).
  const width = typeof window === 'undefined' ? undefined : Math.min(window.innerWidth - 16, Math.max(count, 4) * 54 + 14);
  const half = width === undefined ? 0 : width / 2;
  const left = typeof window === 'undefined' ? x : Math.min(window.innerWidth - half, Math.max(half, x));
  const preview = (kind: Kind) => () => { onPreview?.(kind); onClose(); };
  const forgotButton = <Act label={forgotLabel} name={ar ? 'نسيت' : 'Forgot'} on={scope === 'ayah' ? !!forgot : undo} onClick={() => { onForgot(); onClose(); }}><LightbulbOff aria-hidden /></Act>;
  return (
    <div ref={box} role="dialog" aria-label={label} data-ayah-actions className={styles.ayahActions} style={under ? { left, width, top: below! + 8, transform: 'translate(-50%, 0)' } : { left, width, top: Math.max(64, y) }}>
      {words && onScope && <Segmented tabs fill label={ar ? 'ما تعمل عليه الأزرار' : 'What the buttons act on'} className="basis-full mb-1"
        options={[{ key: 'ayah', label: ar ? SCOPE_NAMES.ayah : 'Ayah', current: scope === 'ayah', onClick: () => onScope('ayah') },
          { key: 'words', label: ar ? SCOPE_NAMES[wordScope(words)] : wordScope(words) === 'words' ? 'Words' : 'Word', current: scope !== 'ayah', onClick: () => onScope(wordScope(words)) }]} />}
      {forgotButton}
      {scope === 'ayah' ? <>
        {onListen && <Act label={ar ? 'استمع من هذه الآية' : 'Listen from this ayah'} name={ar ? 'استمع' : 'Listen'} onClick={() => { onListen(); onClose(); }}><Play aria-hidden /></Act>}
        {onRecite && <Act label={ar ? 'سمّع من هذه الآية' : 'Recite from this ayah'} name={ar ? 'سمّع' : 'Recite'} onClick={() => { onRecite(); onClose(); }}><EyeOff aria-hidden /></Act>}
        {(due ?? forgot > 0) && <Act label={clearLabel} name={ar ? 'تذكّرتها' : 'Recalled'} onClick={() => { onClear(); onClose(); }}><Check aria-hidden className="text-[var(--home-green)]" /></Act>}
        <Act label={saveLabel} name={ar ? 'احفظ' : 'Save'} on={saved} tint="var(--home-root)" pressed={saved} onClick={() => { onSave(); onClose(); }}><Bookmark aria-hidden fill={saved ? 'currentColor' : 'none'} /></Act>
        {onNote && <Act label={noteLabel} name={ar ? NOTE_NAME : 'Note'} on={noted} pressed={noted} onClick={() => { onNote(); onClose(); }}><NotebookPen aria-hidden /></Act>}
        {onTopics && <Act label={ar ? 'موضوع الآية في السورة' : 'Topic of this ayah'} name={ar ? 'الموضوعات' : 'Topics'} popup onClick={() => { onTopics(); onClose(); }}><TableOfContents aria-hidden /></Act>}
        {!!links?.compare.length && <Act label={compareLabel} name={ar ? 'المقارنة' : 'Compare'} popup onClick={preview('compare')}><ArrowLeftRight aria-hidden /></Act>}
        {links?.trees && <Act label={treesLabel} name={ar ? 'المتشابهات' : 'Similar'} popup onClick={preview('trees')}><TreeIcon aria-hidden /></Act>}
        {links?.qiraat && <Act label={readingsLabel} name={ar ? 'القراءات' : 'Readings'} popup onClick={preview('readings')}><Layers aria-hidden /></Act>}
        {onPreview && <Act label={tafsirLabel} name={ar ? 'التفسير' : 'Tafsir'} popup onClick={preview('tafsir')}><BookOpen aria-hidden /></Act>}
        {onPreview && <Act label={ar ? 'البلاغة في الآية' : 'Rhetoric in the ayah'} name={ar ? 'البلاغة' : 'Balagha'} popup onClick={preview('balagha')}><Sparkles aria-hidden /></Act>}
        {onShare && <Act label={shareLabel} name={ar ? 'مشاركة' : 'Share'} popup onClick={() => { onShare(); onClose(); }}><Send aria-hidden /></Act>}
      </> : <>
        {scope === 'word' && onPreview && irab && <Act label={ar ? 'إعراب الكلمة' : 'Grammar of the word'} name={ar ? 'الإعراب' : 'I‘rab'} popup onClick={preview('irab')}><ListTree aria-hidden /></Act>}
        {scope === 'word' && onPreview && irab && <Act label={ar ? 'معنى الكلمة' : 'Meaning of the word'} name={ar ? 'المعنى' : 'Meaning'} popup onClick={preview('gharib')}><BookOpenText aria-hidden /></Act>}
        {onPlaces && <Act label={ar ? `مواضع «${text}» في القرآن` : `Where «${text}» comes`} name={ar ? 'المواضع' : 'Places'} popup onClick={() => { onPlaces(); onClose(); }}><TextSearch aria-hidden /></Act>}
        {onCopy && <Act label={ar ? (scope === 'words' ? 'انسخ الكلمات' : 'انسخ الكلمة') : 'Copy'} name={ar ? 'نسخ' : 'Copy'} onClick={() => { onCopy(); onClose(); }}><Copy aria-hidden /></Act>}
        {scope === 'words' && onShareWords && <Act label={ar ? 'مشاركة الكلمات' : 'Share the words'} name={ar ? 'مشاركة' : 'Share'} onClick={() => { onShareWords(); onClose(); }}><Send aria-hidden /></Act>}
      </>}
    </div>
  );
}
