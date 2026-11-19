'use client';

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeftRight, BookOpenText, BookOpen, Bookmark, Copy, EyeOff, Layers, Lightbulb, LightbulbOff, ListTree, NotebookPen, Play, Send, Sparkles, TableOfContents, TextSearch } from 'lucide-react';
import TreeIcon from '@/components/common/TreeIcon';
import Button from '@/components/common/Button';
import ReactionBubble from '@/components/common/ReactionBubble';
import QuranWords from '@/components/quran/text/QuranWords';
import { num } from '@shared/quran/arabicNumber';
import { NOTE_NAME } from '@shared/quran/selection';
import styles from './Mushaf.module.css';
import type { AyahLink } from './ayahLinks';

type Kind = 'trees' | 'compare' | 'readings' | 'tafsir' | 'irab' | 'gharib' | 'balagha';

/** An icon with its name under it (owner, 2026-11-13: the buttons got many, so each says what it is). */
/** On (forgotten, saved, noted), the icon and its name take the mark's colour with nothing behind them, as in the app (owner, 2026-11-17). */
function Act({ label, name, on = false, tint = 'var(--home-accent)', pressed, popup = false, expanded, wide = false, quran = false, onClick, children }: { label: string; name: string; on?: boolean; tint?: string; pressed?: boolean; popup?: boolean;
  /** Its bubble is open (the «نسيت» and «نسخ» buttons). */
  expanded?: boolean;
  /** As wide as its name: a bubble's choice naming the lit words. */
  wide?: boolean;
  /** Its name is Quran words, in the mushaf's font. */
  quran?: boolean; onClick: (button: HTMLButtonElement) => void; children: ReactNode }) {
  return (
    <Button size="lg" variant="muted" aria-label={label} title={label} aria-pressed={pressed} aria-haspopup={popup ? 'dialog' : undefined} aria-expanded={expanded} onClick={event => onClick(event.currentTarget)}
      style={on ? { color: tint } : undefined}
      className={`!h-auto ${wide ? '!min-w-[3.25rem] !w-auto px-2.5' : '!w-[3.25rem]'} flex-col !gap-1 py-1.5 text-[0.6875rem] leading-none`}>
      {children}
      {quran ? <span aria-hidden><QuranWords className="text-[0.9375rem]">{name}</QuranWords></span> : <span aria-hidden className="whitespace-nowrap">{name}</span>}
    </Button>
  );
}

/**
 * The long press's buttons for one ayah, in three groups with a thin line between them and no titles (owner, 2026-11-19):
 * the reader's own actions (listen, recite, forgot, save, note), the Quran's (tafsir, the pressed word's i'rab and meaning,
 * balagha, readings, similar passages, compare, places, topics), and sending (copy, share last). Each preview opens in a
 * sheet (AyahPreviewSheet); a button shows only where there is something behind it.
 *
 * «نسيت» is one bulb toggle: forgotten while due for review, and a tap then rests it. With a word lit (long pressed, or the
 * words dragged over), «نسيت» and «نسخ» open a bubble over the button, as a chat app's reactions: the ayah, or the lit words.
 */
export default function AyahActions({ ayah, x, y, below, forgot, lit, saved, noted = false, ar, links, irab = false, onForgot, onCopy, onPlaces, onListen, onRecite, onSave, onNote, onPreview, onTopics, onShare, onClose, onDismiss = onClose }: {
  ayah: string;
  /** Where the pressed word ends below: the buttons open there when there is no room above it. */
  below?: number;
  x: number;
  y: number;
  /** The ayah is due for review. */
  forgot: boolean;
  /** The lit words, the pressed one or those dragged over after the long press: their text, and whether all are due. */
  lit?: { text: string; forgot: boolean };
  saved: boolean;
  noted?: boolean;
  ar: boolean;
  links?: AyahLink;
  /** A word was pressed, so its i'rab and meaning can open (owner, 2026-11-15). */
  irab?: boolean;
  /** Toggles the ayah's forgot mark, or the lit words'. */
  onForgot: (what: 'ayah' | 'lit') => void;
  /** Copies the ayah, or the lit words. */
  onCopy?: (what: 'ayah' | 'lit') => void;
  /** Where the lit words come in the Quran (the search). */
  onPlaces?: () => void;
  /** Listening from this ayah to its surah's end, the first button (owner's sketch, 2026-11-17). */
  onListen?: () => void;
  /** Recite mode from this ayah. */
  onRecite?: () => void;
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
  /** The open bubble, and its button's place in the buttons' box (and its top on the screen). */
  const [bubble, setBubble] = useState<{ kind: 'forgot' | 'copy'; center: number; top: number; bottom: number; screenTop: number; button: HTMLButtonElement } | null>(null);
  const bubbleNow = useRef(bubble);
  useEffect(() => { bubbleNow.current = bubble; }, [bubble]);
  const bubbleBox = useRef<HTMLDivElement>(null);
  useEffect(() => {
    box.current?.querySelector<HTMLElement>('button')?.focus({ preventScroll: true });
    const outside = (event: PointerEvent) => { if (!box.current?.contains(event.target as Node)) onDismiss(); };
    // Escape lets go of an open bubble first, back to its button, then of the buttons.
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); if (bubbleNow.current) { bubbleNow.current.button.focus({ preventScroll: true }); setBubble(null); } else onClose(); } };
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
  useLayoutEffect(() => { setUnder(below !== undefined && Math.max(64, y) - (box.current?.offsetHeight ?? 0) - 8 < 8); }, [x, y, below]);
  // The bubble sits over its button, or under it when there is no room above; its first choice takes the focus.
  const [bubbleUnder, setBubbleUnder] = useState(false);
  // And sideways it stays on the screen, however long the lit words.
  const [nudge, setNudge] = useState(0);
  useLayoutEffect(() => {
    if (!bubble) return;
    setBubbleUnder(bubble.screenTop - (bubbleBox.current?.offsetHeight ?? 0) - 6 < 8);
    const frame = box.current!.getBoundingClientRect(), width = bubbleBox.current?.offsetWidth ?? 0;
    const start = frame.left + bubble.center - width / 2;
    setNudge(Math.max(8 - start, Math.min(0, window.innerWidth - 8 - (start + width))));
    bubbleBox.current?.querySelector<HTMLElement>('button')?.focus({ preventScroll: true });
  }, [bubble]);
  const [surah, number] = ayah.split(':').map(Number);
  const label = ar ? `الآية ${num(number)} من السورة ${num(surah)}` : `Ayah ${surah}:${number}`;
  const anyForgot = forgot || !!lit?.forgot;
  const Bulb = (on: boolean) => (on ? <LightbulbOff aria-hidden /> : <Lightbulb aria-hidden />);
  const saveLabel = saved ? (ar ? 'أزلها من المحفوظات' : 'Remove from saved') : (ar ? 'احفظ الآية' : 'Save ayah');
  const noteLabel = noted ? (ar ? 'ما دوّنته عن الآية' : 'Your note') : (ar ? 'دوّن عن الآية' : 'Write a note');
  const preview = (kind: Kind) => () => { onPreview?.(kind); onClose(); };
  const toggle = (kind: 'forgot' | 'copy') => (button: HTMLButtonElement) => {
    const frame = box.current!.getBoundingClientRect(), at = button.getBoundingClientRect();
    const next = { kind, center: at.left + at.width / 2 - frame.left, top: at.top - frame.top, bottom: at.bottom - frame.top, screenTop: at.top, button };
    setBubble(was => (was?.kind === kind ? null : next));
  };
  const mine = [onListen, onRecite, true, true, onNote].filter(Boolean).length;
  const quran = [onPreview, onPreview && irab, onPreview && irab, onPreview, links?.qiraat, links?.trees, links?.compare.length, onPlaces && lit, onTopics].filter(Boolean).length;
  // As wide as its longest group in one row, up to the screen; on a narrow phone a group wraps onto a second row.
  const width = typeof window === 'undefined' ? undefined : Math.min(window.innerWidth - 16, Math.max(mine, quran, 4) * 54 + 14);
  const half = width === undefined ? 0 : width / 2;
  const left = typeof window === 'undefined' ? x : Math.min(window.innerWidth - 8 - half, Math.max(8 + half, x));
  const group = (at: number, children: ReactNode) => <div className={`flex basis-full flex-wrap justify-start gap-0.5 ${at ? 'mt-1 border-t border-[var(--home-rule)] pt-1' : ''}`}>{children}</div>;
  const forgotNames = { ayah: ar ? (forgot ? 'تذكّرت الآية' : 'نسيت الآية') : (forgot ? 'I remember the ayah' : 'I forgot the ayah') };
  return (
    <div ref={box} role="dialog" aria-label={label} data-ayah-actions className={styles.ayahActions} style={under ? { left, width, top: below! + 8, transform: 'translate(-50%, 0)' } : { left, width, top: Math.max(64, y) }}>
      {group(0, <>
        {onListen && <Act label={ar ? 'استمع من هذه الآية' : 'Listen from this ayah'} name={ar ? 'استمع' : 'Listen'} onClick={() => { onListen(); onClose(); }}><Play aria-hidden /></Act>}
        {onRecite && <Act label={ar ? 'سمّع من هذه الآية' : 'Recite from this ayah'} name={ar ? 'سمّع' : 'Recite'} onClick={() => { onRecite(); onClose(); }}><EyeOff aria-hidden /></Act>}
        {lit
          ? <Act label={ar ? 'نسيت: الآية أو ما أضاءته' : 'Forgot: the ayah or the lit words'} name={ar ? 'نسيت' : 'Forgot'} on={anyForgot} expanded={bubble?.kind === 'forgot'} onClick={toggle('forgot')}>{Bulb(anyForgot)}</Act>
          : <Act label={forgotNames.ayah} name={ar ? 'نسيت' : 'Forgot'} on={forgot} pressed={forgot} onClick={() => onForgot('ayah')}>{Bulb(forgot)}</Act>}
        <Act label={saveLabel} name={ar ? 'احفظ' : 'Save'} on={saved} tint="var(--home-root)" pressed={saved} onClick={() => { onSave(); onClose(); }}><Bookmark aria-hidden fill={saved ? 'currentColor' : 'none'} /></Act>
        {onNote && <Act label={noteLabel} name={ar ? NOTE_NAME : 'Note'} on={noted} pressed={noted} onClick={() => { onNote(); onClose(); }}><NotebookPen aria-hidden /></Act>}
      </>)}
      {group(1, <>
        {onPreview && <Act label={ar ? 'تفسير السعدي' : 'Al-Sa‘di’s tafsir'} name={ar ? 'التفسير' : 'Tafsir'} popup onClick={preview('tafsir')}><BookOpen aria-hidden /></Act>}
        {onPreview && irab && <Act label={ar ? 'إعراب الكلمة' : 'Grammar of the word'} name={ar ? 'الإعراب' : 'I‘rab'} popup onClick={preview('irab')}><ListTree aria-hidden /></Act>}
        {onPreview && irab && <Act label={ar ? 'معنى الكلمة' : 'Meaning of the word'} name={ar ? 'المعنى' : 'Meaning'} popup onClick={preview('gharib')}><BookOpenText aria-hidden /></Act>}
        {onPreview && <Act label={ar ? 'البلاغة في الآية' : 'Rhetoric in the ayah'} name={ar ? 'البلاغة' : 'Balagha'} popup onClick={preview('balagha')}><Sparkles aria-hidden /></Act>}
        {links?.qiraat && <Act label={ar ? 'القراءات العشر في كلمات الآية' : 'The ten readings of its words'} name={ar ? 'القراءات' : 'Readings'} popup onClick={preview('readings')}><Layers aria-hidden /></Act>}
        {links?.trees && <Act label={ar ? 'متشابهات الآية' : 'Similar passages of this ayah'} name={ar ? 'المتشابهات' : 'Similar'} popup onClick={preview('trees')}><TreeIcon aria-hidden /></Act>}
        {!!links?.compare.length && <Act label={ar ? 'في المقارنة' : 'Also in compare'} name={ar ? 'المقارنة' : 'Compare'} popup onClick={preview('compare')}><ArrowLeftRight aria-hidden /></Act>}
        {onPlaces && lit && <Act label={ar ? `مواضع «${lit.text}» في القرآن` : `Where «${lit.text}» comes`} name={ar ? 'المواضع' : 'Places'} popup onClick={() => { onPlaces(); onClose(); }}><TextSearch aria-hidden /></Act>}
        {onTopics && <Act label={ar ? 'موضوع الآية في السورة' : 'Topic of this ayah'} name={ar ? 'الموضوعات' : 'Topics'} popup onClick={() => { onTopics(); onClose(); }}><TableOfContents aria-hidden /></Act>}
      </>)}
      {group(2, <>
        {onCopy && (lit
          ? <Act label={ar ? 'انسخ الآية أو ما أضاءته' : 'Copy the ayah or the lit words'} name={ar ? 'نسخ' : 'Copy'} expanded={bubble?.kind === 'copy'} onClick={toggle('copy')}><Copy aria-hidden /></Act>
          : <Act label={ar ? 'انسخ الآية' : 'Copy the ayah'} name={ar ? 'نسخ' : 'Copy'} onClick={() => { onCopy('ayah'); onClose(); }}><Copy aria-hidden /></Act>)}
        {onShare && <Act label={ar ? 'مشاركة' : 'Share'} name={ar ? 'مشاركة' : 'Share'} popup onClick={() => { onShare(); onClose(); }}><Send aria-hidden /></Act>}
      </>)}
      {bubble && lit && (() => {
        const place = bubbleUnder ? { top: bubble.bottom + 6 } : { top: bubble.top - 6, transform: 'translate(-50%, -100%)' };
        return (
          <ReactionBubble ref={bubbleBox} label={bubble.kind === 'forgot' ? (ar ? 'ما نسيت' : 'What you forgot') : (ar ? 'ما تنسخ' : 'What to copy')}
            style={{ left: bubble.center + nudge, transform: 'translate(-50%, 0)', ...place }}>
            {bubble.kind === 'forgot' ? <>
              <Act wide label={forgotNames.ayah} name={ar ? 'الآية' : 'Ayah'} on={forgot} pressed={forgot} onClick={() => onForgot('ayah')}>{Bulb(forgot)}</Act>
              <Act wide label={ar ? `${lit.forgot ? 'تذكّرت' : 'نسيت'} «${lit.text}»` : `${lit.forgot ? 'I remember' : 'I forgot'} «${lit.text}»`} quran name={lit.text} on={lit.forgot} pressed={lit.forgot} onClick={() => onForgot('lit')}>{Bulb(lit.forgot)}</Act>
            </> : <>
              <Act wide label={ar ? 'انسخ الآية' : 'Copy the ayah'} name={ar ? 'الآية' : 'Ayah'} onClick={() => { onCopy?.('ayah'); onClose(); }}><Copy aria-hidden /></Act>
              <Act wide label={ar ? `انسخ «${lit.text}»` : `Copy «${lit.text}»`} quran name={lit.text} onClick={() => { onCopy?.('lit'); onClose(); }}><Copy aria-hidden /></Act>
            </>}
          </ReactionBubble>
        );
      })()}
    </div>
  );
}
