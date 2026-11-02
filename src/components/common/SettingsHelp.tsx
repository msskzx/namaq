'use client';

import React, { useEffect, useSyncExternalStore } from 'react';

// A page's help, shown as a row in the settings sheet instead of its own button.
type Help = { label: string; content: React.ReactNode };
let current: Help | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(listener => listener());
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };

/** Puts the page's help in the settings sheet while the page is open. */
export function SettingsHelp({ label, children }: { label: string; children: React.ReactNode }) {
  useEffect(() => {
    const entry = { label, content: children };
    current = entry;
    emit();
    return () => { if (current === entry) { current = null; emit(); } };
  }, [label, children]);
  return null;
}

export const usePageHelp = () => useSyncExternalStore(subscribe, () => current, () => null);
