'use client';

import { useEffect } from 'react';
import { preloadQuranText } from '@/lib/quran/quranText';

export default function PreloadQuranText() {
  useEffect(preloadQuranText, []);
  return null;
}
