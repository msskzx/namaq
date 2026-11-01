"use client";

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

/** Keeps the phone browser's top colour on the site paper when the reader picks a theme other than the device's. */
export default function ThemeColor() {
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    if (!resolvedTheme) return;
    const color = getComputedStyle(document.documentElement).getPropertyValue('--home-paper').trim();
    if (!color) return;
    document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach(meta => { meta.content = color; });
  }, [resolvedTheme]);
  return null;
}
