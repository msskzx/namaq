"use client";

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

// Same as --home-paper in theme.css. Read from the theme, not the DOM: next-themes swaps the
// <html> class in its own effect, which runs after this child's effect.
const PAPER = { light: '#f4ecdb', dark: '#0b0b0b' } as const;

/** Keeps the phone browser's top colour on the site paper when the reader picks a theme other than the device's. */
export default function ThemeColor() {
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    if (resolvedTheme !== 'light' && resolvedTheme !== 'dark') return;
    document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach(meta => { meta.content = PAPER[resolvedTheme]; });
  }, [resolvedTheme]);
  return null;
}
