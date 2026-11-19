'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp, type LucideIcon } from 'lucide-react';

/**
 * A settings row that folds, as the app's `ui/SettingRow`: its icon, its name and what is chosen under it; a click opens
 * the picker below. Settings' «ما أحفظه» and «اهتماماتي» share it. `onFold` hears each open and close.
 */
export default function SettingRow({ Icon, title, value, children, onFold }: {
  Icon: LucideIcon; title: string; value: string; children: ReactNode; onFold?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const toggle = () => { onFold?.(!open); setOpen(!open); };
  return <>
    <button type="button" aria-expanded={open} aria-label={`${title}: ${value}`} onClick={toggle} className="flex items-center gap-3 py-1.5 text-start">
      <Icon size={20} aria-hidden className="text-[var(--home-accent)]" />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-[var(--home-ink)]">{title}</span>
        <span className="truncate text-sm text-[var(--home-muted)]">{value}</span>
      </span>
      {open ? <ChevronUp size={18} aria-hidden /> : <ChevronDown size={18} aria-hidden />}
    </button>
    {open && children}
  </>;
}
