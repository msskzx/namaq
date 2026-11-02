"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useLanguage } from '../language/LanguageContext';
import styles from './NavBar.module.css';

/**
 * A page's search box in the top bar. Desktop shows the box; phones show a search icon that opens
 * the box across the whole bar, with a close button.
 */
/** `active`: a search is set, shown as a dot on the phone's search icon (like the filter's dot). */
export default function NavSearch({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  const ar = useLanguage().language === 'ar';
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (open) box.current?.querySelector<HTMLInputElement>('input')?.focus(); }, [open]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!box.current?.contains(event.target as Node) && !toggle.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);
  const close = () => { setOpen(false); toggle.current?.focus(); };
  const label = ar ? 'البحث' : 'Search';
  const closeLabel = ar ? 'إغلاق البحث' : 'Close search';
  return (
    <>
      <button ref={toggle} type="button" className={styles.searchToggle} aria-label={label} title={label} aria-expanded={open} onClick={() => setOpen(true)}>
        <Search size={20} aria-hidden />
        {active && <span aria-hidden data-search-dot className={styles.searchDot} />}
      </button>
      <div ref={box} className={`${styles.search} ${open ? styles.searchOpen : ''}`}
        onKeyDown={event => { if (event.key === 'Escape' && !event.defaultPrevented && open && !box.current?.querySelector('[role="listbox"]')) close(); }}>
        <div className="min-w-0 flex-1">{children}</div>
        <button type="button" className={styles.searchClose} aria-label={closeLabel} title={closeLabel} onClick={close}>
          <X size={20} aria-hidden />
        </button>
      </div>
    </>
  );
}
