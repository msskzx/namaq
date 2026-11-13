'use client';

import { useEffect, useRef, useState } from 'react';
import { NotebookPen, Send, Trash2, X } from 'lucide-react';
import { AyahShareDialog } from '@/components/share/AyahShare';
import Button from '@/components/common/Button';
import MushafText from '@/components/common/MushafText';
import { readAyahNotes, writeAyahNote } from '@shared/ayahNotes';
import { num } from '@shared/quran/arabicNumber';
import { quranContexts } from '@/lib/quran/quranText';

/** How long typing rests before the note is kept, so the reader behind the dialog is not redrawn on every key. */
const SAVE_MS = 400;

/** The reader's own note on an ayah, kept in this browser. It saves while typing and on closing; emptying it or the bin removes it. */
export default function NoteDialog({ ayah, name, ar, onClose }: { ayah: string; name?: string; ar: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [text, setText] = useState(() => readAyahNotes()[ayah]?.text ?? '');
  const [words, setWords] = useState('');
  const [sharing, setSharing] = useState(false);
  const field = useRef<HTMLTextAreaElement>(null);
  const pending = useRef<{ text: string; timer: ReturnType<typeof setTimeout> } | null>(null);
  const flush = () => { if (pending.current) { clearTimeout(pending.current.timer); writeAyahNote(ayah, pending.current.text); pending.current = null; } };
  const [surah, number] = ayah.split(':').map(Number);
  useEffect(() => {
    const box = dialog.current;
    if (box && !box.open) { if (typeof box.showModal === 'function') box.showModal(); else box.setAttribute('open', ''); }
    if (!readAyahNotes()[ayah]) field.current?.focus();
    let live = true;
    quranContexts([ayah]).then(([context]) => { if (live && context) setWords(context.ayah.words.join(' ')); }).catch(() => {});
    return () => { live = false; flush(); };
  }, [ayah]); // eslint-disable-line react-hooks/exhaustive-deps
  const close = () => { if (typeof dialog.current?.close === 'function') dialog.current.close(); else onClose(); };
  const edit = (next: string, now = false) => {
    setText(next);
    if (pending.current) clearTimeout(pending.current.timer);
    pending.current = { text: next, timer: setTimeout(flush, SAVE_MS) };
    if (now) flush();
  };
  const labels = ar
    ? { title: 'تأملك في هذه الآية', close: 'إغلاق', remove: 'احذف التأمل', share: 'مشاركة' }
    : { title: 'Your note on this ayah', close: 'Close', remove: 'Delete note', share: 'Share' };
  return <dialog ref={dialog} aria-label={labels.title} onClose={() => { flush(); onClose(); }} onClick={event => { if (event.target === dialog.current) close(); }} dir={ar ? 'rtl' : 'ltr'}
    className="m-auto mb-0 w-full max-w-xl rounded-t-2xl bg-[var(--home-paper)] p-0 text-[var(--home-ink)] backdrop:bg-black/45 md:mb-auto md:rounded-2xl">
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-center gap-2">
        <NotebookPen size={18} aria-hidden className="text-[var(--home-accent)]" />
        <span className="flex-1 text-[0.9375rem] text-[var(--home-muted)]" lang="ar" dir="rtl">{name ?? surah} <bdi>{ar ? num(number) : number}</bdi></span>
        {!!text.trim() && <Button size="lg" variant="muted" aria-label={labels.remove} title={labels.remove} onClick={() => { edit('', true); close(); }}><Trash2 aria-hidden /></Button>}
        {!!text.trim() && <Button size="lg" variant="muted" aria-label={labels.share} title={labels.share} aria-haspopup="dialog" onClick={() => { flush(); setSharing(true); }}><Send aria-hidden /></Button>}
        <Button size="lg" variant="muted" aria-label={labels.close} title={labels.close} onClick={close}><X aria-hidden /></Button>
      </div>
      {words && <p lang="ar" dir="rtl" className="line-clamp-2 font-[family-name:var(--font-quran)] text-lg leading-loose text-[var(--home-muted)]"><MushafText>{words}</MushafText></p>}
      <textarea ref={field} value={text} onChange={event => edit(event.target.value)} placeholder={labels.title} aria-label={labels.title} dir="auto" rows={7}
        className="w-full resize-y rounded-xl border border-[var(--home-rule)] bg-[var(--home-card)] p-3 text-base leading-relaxed" />
    </div>
    {sharing && <AyahShareDialog ayah={ayah} name={name} note={text.trim()} onClose={() => setSharing(false)} />}
  </dialog>;
}
