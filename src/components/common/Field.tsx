'use client';

import type { InputHTMLAttributes, Ref, TextareaHTMLAttributes } from 'react';
import { Search, X } from 'lucide-react';

const FRAME = 'rounded-xl border border-[var(--home-rule)] bg-[var(--home-card)] text-base text-[var(--home-ink)] focus-within:border-[var(--home-accent)]';
const TEXT = 'placeholder:text-[var(--home-muted)] focus:outline-none';

type Common = {
  /** What a screen reader says: the field's question, also when it has a placeholder. */
  label: string;
  /** Its place only (width, margins), never its look. */
  className?: string;
};

/**
 * The one text field, as the app's `ui/Field` (owner: inputs 16px): framed like a card, one height. `multiline` grows
 * from five lines for the reader's own words (a note); `code` is a number typed left to right, large and spaced (a party's code).
 * Search goes in `SearchField`. The quiz's and the mushaf's writing boxes are their own.
 */
export default function Field({ label, className = '', multiline = false, code = false, ref, ...input }: Common & (
  ({ multiline: true; code?: false; ref?: Ref<HTMLTextAreaElement> } & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'aria-label'>)
  | ({ multiline?: false; code?: boolean; ref?: Ref<HTMLInputElement> } & Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'aria-label'>)
)) {
  if (multiline) return <textarea ref={ref as Ref<HTMLTextAreaElement>} rows={5} {...(input as TextareaHTMLAttributes<HTMLTextAreaElement>)} aria-label={label}
    className={`${FRAME} ${TEXT} block min-h-36 w-full resize-y px-3 py-2.5 leading-7 ${className}`} />;
  const shape = code ? `h-14 text-center ${input.value ? 'text-[1.625rem] tracking-[0.4em]' : ''}` : 'h-11';
  return <input ref={ref as Ref<HTMLInputElement>} {...(input as InputHTMLAttributes<HTMLInputElement>)} dir={code ? 'ltr' : input.dir} aria-label={label}
    className={`${FRAME} ${TEXT} w-full px-3 ${shape} ${className}`} />;
}

/** The one search field: the field with a magnifier at its start and, once something is typed, a clear button at its end. */
export function SearchField({ label, value, onChangeText, className = '', ref, ...input }: Common & { value: string; onChangeText: (text: string) => void; ref?: Ref<HTMLInputElement> }
  & Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'aria-label' | 'value' | 'onChange' | 'type'>) {
  const clear = 'مسح';
  return (
    <div className={`${FRAME} flex h-11 items-center gap-2 ps-3 has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-[var(--home-accent)] ${value ? 'pe-1' : 'pe-3'} ${className}`}>
      <Search size={18} aria-hidden className="shrink-0 text-[var(--home-muted)]" />
      <input ref={ref} type="search" {...input} value={value} onChange={event => onChangeText(event.target.value)} aria-label={label}
        className={`${TEXT} h-full min-w-0 flex-1 bg-transparent outline-none! [&::-webkit-search-cancel-button]:hidden`} />
      {value !== '' && <button type="button" onClick={event => { onChangeText(''); (event.currentTarget.previousElementSibling as HTMLInputElement | null)?.focus(); }} aria-label={clear} title={clear}
        className="grid size-9 shrink-0 place-items-center rounded-full text-[var(--home-muted)] hover:bg-[var(--home-paper-deep)] hover:text-[var(--home-ink)]"><X size={18} aria-hidden /></button>}
    </div>
  );
}
