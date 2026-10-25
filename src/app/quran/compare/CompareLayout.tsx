'use client';

import React, { useId, useState, useSyncExternalStore } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, PanelRightClose, PanelRightOpen } from 'lucide-react';
import Button from '@/components/common/Button';
import { PANEL } from '../panel';

const KEY = 'compare-pane-hidden';
const listeners = new Set<() => void>();
const read = () => {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
};
const write = (hidden: boolean) => {
  try {
    localStorage.setItem(KEY, hidden ? '1' : '0');
  } catch {}
  listeners.forEach(listener => listener());
};
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export default function CompareLayout({ title, current, pane, children }: { title: string; current: string; pane: React.ReactNode; children: React.ReactNode }) {
  const id = useId();
  const search = useSearchParams().toString();
  const hidden = useSyncExternalStore(subscribe, read, () => false);
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === search;
  return (
    <div className={`flex flex-col gap-4 lg:grid lg:items-start ${hidden ? '' : 'lg:grid-cols-[19rem_minmax(0,1fr)]'}`}>
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpenAt(open ? null : search)}
        className="lg:hidden flex items-center justify-between gap-3 rounded-lg border border-[var(--home-accent)] px-3 py-2 text-start text-[var(--home-accent)]">
        <span className="min-w-0 truncate">{current}</span>
        <span className="flex shrink-0 items-center gap-1 text-sm">
          {open ? 'إخفاء السور' : 'تغيير السورتين'}
          <ChevronDown size={16} aria-hidden className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>
      <aside id={id} aria-label={title} className={`${PANEL} min-w-0 flex-col gap-3 ${open ? 'flex' : 'hidden'} ${hidden ? 'lg:hidden' : 'lg:flex'}`}>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl">{title}</h2>
          <span className="hidden lg:block">
            <Button size="sm" onClick={() => write(true)} aria-label="أخفِ قائمة السور">
              <PanelRightClose size={14} aria-hidden />
              إخفاء
            </Button>
          </span>
        </div>
        {pane}
      </aside>
      <div className="min-w-0 flex flex-col gap-4">
        {hidden && (
          <span className="hidden lg:block">
            <Button size="sm" onClick={() => write(false)}>
              <PanelRightOpen size={14} aria-hidden />
              اعرض قائمة السور
            </Button>
          </span>
        )}
        {children}
      </div>
    </div>
  );
}
