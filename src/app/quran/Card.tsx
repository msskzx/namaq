// docs/plans/quran-repetition-merge.md
import React from 'react';
import { AyahCard, type WordNote } from '@/components/quran/AyahCard';
import type { Surah } from '@/lib/quran/curatedShifts';
import type { Ayah } from '@/types/quran';

export function Card({ surah, ayah, text, slots, notes }: { surah: Surah; ayah: number; text: string; slots?: Record<number, number>; notes?: Record<number, WordNote> }) {
  const s = { id: `s${surah.number}`, number: surah.number, name: surah.name, nameTransliterated: null };
  return <AyahCard ayah={{ id: `${surah.number}:${ayah}`, number: ayah, text, surah: s } as unknown as Ayah} slots={slots} notes={notes} />;
}
