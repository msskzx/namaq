'use client';

import React, { useEffect, useSyncExternalStore } from 'react';

// A page's help, shown as a row in the settings sheet instead of its own button.
type Help = { label: string; content: React.ReactNode; refs?: boolean };
let current: Help | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(listener => listener());
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };

/** Puts the page's help in the top bar while the page is open; with refs it is the page's sources, shown as books. */
export function SettingsHelp({ label, refs, children }: { label: string; refs?: boolean; children: React.ReactNode }) {
  useEffect(() => {
    const entry = { label, content: children, refs };
    current = entry;
    emit();
    return () => { if (current === entry) { current = null; emit(); } };
  }, [label, refs, children]);
  return null;
}

export const usePageHelp = () => useSyncExternalStore(subscribe, () => current, () => null);
