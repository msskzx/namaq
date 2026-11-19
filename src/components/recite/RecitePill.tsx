'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Minimize2, PenLine, Undo2, X, type LucideIcon } from 'lucide-react';
import Button from '@/components/common/Button';
import mushaf from '@/app/quran/read/Mushaf.module.css';
import type { Recite } from './useRecite';

/** The pen's label by its rule and whether it is writing. */
export function penLabel(writing: boolean, pen: Recite['pen'], ar: boolean) {
  if (writing) return ar ? 'أوقف الكتابة' : 'Stop writing';
  if (pen === 'whole') return ar ? 'اكتب كل آية كاملة' : 'Write each whole ayah';
  return ar ? 'اكتب أول كل آية وآخرها' : 'Write the first and last words of each ayah';
}

/**
 * Recite mode's bar, the one every place recites with (owner, 2026-11-17; the app's RecitePill): step back, the next word,
 * the next ayah, the pen, and in the mushaf the end of the recitation. A place leaves a button out by giving it no handler
 * (`onClose`), and says what the next-ayah button does once its ayat are done (`after`: the reader's next forgotten ayah)
 * and whether there is anything after (`more`: the next page).
 */
export default function RecitePill({ recite, writing, onWriting, onClose, onFold, after, more = false, lead, ar = true, className }: {
  recite: Recite; writing: boolean; onWriting: () => void; onClose?: () => void;
  /** The reader's bar floats over the page (common/FloatingBar), with a last button that folds it into a circle. */
  onFold?: () => void;
  after?: { Icon: LucideIcon; label: string }; more?: boolean; lead?: React.ReactNode; ar?: boolean; className?: string;
}) {
  const ended = recite.done || !recite.view?.upcoming;
  const next = recite.done && after ? after : { Icon: ar ? ChevronsLeft : ChevronsRight, label: ar ? 'أظهر الآية التالية' : 'Reveal the next ayah' };
  const Word = ar ? ChevronLeft : ChevronRight;
  const tip = (label: string) => ({ 'aria-label': label, title: label });
  const pen = penLabel(writing, recite.pen, ar);
  return <div className={`${mushaf.recitePill} ${className ?? ''}`} dir={ar ? 'rtl' : 'ltr'} role="toolbar" aria-label={ar ? 'أدوات التسميع' : 'Recite tools'}>
    {lead}
    <Button size="lg" variant="muted" {...tip(ar ? 'ارجع خطوة' : 'Step back')} disabled={recite.atStart} onClick={recite.back}><Undo2 aria-hidden /></Button>
    <Button size="lg" variant="muted" {...tip(ar ? 'أظهر الكلمة التالية' : 'Reveal the next word')} disabled={recite.done} onClick={recite.nextWord}><Word aria-hidden /></Button>
    {/* In a party the next ayah waits for everyone, and the pen is on for all (owner, 2026-11-17). */}
    {!recite.party && <Button size="lg" variant="ghost" {...tip(next.label)} disabled={ended && !more} onClick={recite.nextAyah}><next.Icon aria-hidden /></Button>}
    <Button size="lg" variant={writing ? 'primary' : 'muted'} aria-pressed={writing} {...tip(pen)} disabled={recite.party} onClick={onWriting}><PenLine aria-hidden /></Button>
    {onClose && <Button size="lg" variant="muted" {...tip(ar ? 'إنهاء التسميع' : 'Stop reciting')} onClick={onClose}><X aria-hidden /></Button>}
    {/* The far end, away from the buttons: fold the bar into a circle (owner, 2026-11-19). */}
    {onFold && <Button size="lg" variant="muted" {...tip(ar ? 'اطوِ الشريط في دائرة' : 'Fold the bar into a circle')} onClick={onFold}><Minimize2 aria-hidden /></Button>}
  </div>;
}
