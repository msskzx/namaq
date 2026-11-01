"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useLanguage } from '../language/LanguageContext';
import styles from './NavBar.module.css';

/**
 * A page's search box in the top bar. Desktop shows the box; phones show a search icon that opens
 * the box across the whole bar, with a close button.
 */
export default function NavSearch({ children }: { children: React.ReactNode }) {
  const ar = useLanguage().language === 'ar';
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (open) box.current?.querySelector<HTMLInputElement>('input')?.focus(); }, [open]);
  const close = () => { setOpen(false); toggle.current?.focus(); };
  const label = ar ? 'البحث' : 'Search';
  const closeLabel = ar ? 'إغلاق البحث' : 'Close search';
  return (
    <>
      <button ref={toggle} type="button" className={styles.searchToggle} aria-label={label} title={label} aria-expanded={open} onClick={() => setOpen(true)}>
        <Search size={20} aria-hidden />
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
