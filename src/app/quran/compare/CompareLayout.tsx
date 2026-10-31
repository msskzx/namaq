'use client';

import React, { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, PanelRightClose, PanelRightOpen } from 'lucide-react';
import Button from '@/components/common/Button';
import { PANE } from '../panel';

const listeners = new Set<() => void>();
const read = (key: string) => {
  try {
    return localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
};
const write = (key: string, hidden: boolean) => {
  try {
    localStorage.setItem(key, hidden ? '1' : '0');
  } catch {}
  listeners.forEach(listener => listener());
};
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export default function CompareLayout({ title, current, pane, children, bar, storageKey = 'compare-pane-hidden', change = 'تغيير السورتين', paneToggleFirst = false }: { title: string; current: string; pane: React.ReactNode; children: React.ReactNode; bar?: React.ReactNode; storageKey?: string; change?: string; paneToggleFirst?: boolean }) {
  const id = useId();
  const search = useSearchParams().toString();
  const hidden = useSyncExternalStore(subscribe, () => read(storageKey), () => false);
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === search;
  const hide = useRef<HTMLSpanElement>(null);
  const show = useRef<HTMLSpanElement>(null);
  const moved = useRef(false);
  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    (hidden ? show : hide).current?.querySelector('button')?.focus();
  }, [hidden]);
  const toggle = (next: boolean) => {
    moved.current = !paneToggleFirst;
    write(storageKey, next);
  };
  const showPane = hidden && (
    <span ref={show} className="hidden lg:block">
      <Button size="sm" onClick={() => toggle(false)}>
        <PanelRightOpen size={14} aria-hidden />
        اعرض قائمة السور
      </Button>
    </span>
  );
  const phoneToggle = (
    <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpenAt(open ? null : search)}
      className="lg:hidden flex items-center justify-between gap-3 rounded-lg border border-[var(--home-accent)] px-3 py-2 text-start text-[var(--home-accent)]">
      <span className="min-w-0 truncate">{current}</span>
      <span className="flex shrink-0 items-center gap-1 text-sm">
        {open ? 'إخفاء السور' : change}
        <ChevronDown size={16} aria-hidden className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </span>
    </button>
  );
  const paneButton = (
    <span className="hidden lg:block">
      <Button size="sm" aria-expanded={!hidden} aria-controls={id} onClick={() => toggle(!hidden)}>
        {hidden ? <PanelRightOpen size={14} aria-hidden /> : <PanelRightClose size={14} aria-hidden />}
        {hidden ? 'اعرض قائمة السور' : 'أخفِ قائمة السور'}
      </Button>
    </span>
  );
  return (
    <div className="flex flex-col gap-4">
      {paneToggleFirst && phoneToggle}
      {(bar || hidden) && <div className={`${bar ? 'flex' : 'hidden lg:flex'} flex-wrap items-start gap-x-4 gap-y-3`}>
        {paneToggleFirst && paneButton}
        {bar}
        {!paneToggleFirst && showPane}
      </div>}
      <div className={`flex flex-col gap-4 lg:grid lg:items-start ${hidden ? '' : 'lg:grid-cols-[19rem_minmax(0,1fr)]'}`}>
        {!paneToggleFirst && phoneToggle}
        <aside id={id} aria-label={title} className={`${PANE} min-w-0 flex-col gap-3 ${open ? 'flex' : 'hidden'} ${hidden ? 'lg:hidden' : 'lg:flex'}`}>
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl">{title}</h2>
            {!paneToggleFirst && <span ref={hide} className="hidden lg:block">
              <Button size="sm" onClick={() => toggle(true)}>
                <PanelRightClose size={14} aria-hidden />
                إخفاء القائمة
              </Button>
            </span>}
          </div>
          {pane}
        </aside>
        <div className="min-w-0 flex flex-col gap-4">
          {children}
        </div>
      </div>
    </div>
  );
}
