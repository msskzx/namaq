'use client';

import { useEffect, useImperativeHandle, useRef, type ReactNode, type Ref, type SyntheticEvent } from 'react';
import { useSwipeClose } from './useSwipeClose';

const KINDS = {
  /** Rises from the bottom, swipe down or tap outside to close (the app's `Sheet`). */
  bottom: 'm-0 mx-auto mt-auto max-h-[85dvh] w-full max-w-lg rounded-t-[22px]',
  /** A bottom sheet on a phone, a centred card from `md` up (a note, a share image). */
  center: 'm-auto mb-0 w-full rounded-t-[22px] md:mb-auto md:rounded-[22px]',
  /** The whole screen (a video studio). */
  full: 'm-0 h-svh max-h-none w-screen max-w-none',
} as const;

/**
 * The one dialog: a native `<dialog>` opened with `showModal` while `open` is true, closed by Escape, a tap on the backdrop,
 * a swipe down (bottom) or its own close button, which calls `close()` on the `ref`. Screens put their content inside
 * and never style a `<dialog>` of their own. `className` is for the size only (a max width, a height, `lg:hidden`).
 */
export default function Sheet({ open, onClose, label, kind = 'bottom', dir = 'rtl', lang = 'ar', className = '', ref, children }: {
  open: boolean;
  onClose: (event: SyntheticEvent<HTMLDialogElement>) => void;
  label?: string;
  kind?: keyof typeof KINDS;
  dir?: 'rtl' | 'ltr';
  lang?: string;
  className?: string;
  ref?: Ref<HTMLDialogElement>;
  children?: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useImperativeHandle(ref, () => dialog.current as HTMLDialogElement, []);
  // jsdom has no showModal or close: the open attribute and a close event stand in for them there.
  const shut = () => {
    const box = dialog.current;
    if (!box?.hasAttribute('open')) return;
    if (typeof box.close === 'function') box.close();
    else { box.removeAttribute('open'); box.dispatchEvent(new Event('close')); }
  };
  useEffect(() => {
    const box = dialog.current;
    if (!box) return;
    if (open && !box.hasAttribute('open')) { if (typeof box.showModal === 'function') box.showModal(); else box.setAttribute('open', ''); }
    if (!open) shut();
  }, [open]);
  useSwipeClose(dialog, open && kind === 'bottom', { direction: 'down', onClose: shut });
  return (
    <dialog ref={dialog} aria-label={label} onClose={onClose} onClick={event => { if (event.target === dialog.current) shut(); }} dir={dir} lang={lang}
      className={`${KINDS[kind]} border-0 bg-[var(--home-paper)] p-0 text-[var(--home-ink)] backdrop:bg-[var(--home-backdrop)] ${className}`}>
      {children}
    </dialog>
  );
}
