'use client';

import React from 'react';
import { SURAHS, nearestSurah, stepSurah } from '@shared/quran/words';

const LABEL = 120;

/**
 * Where a word gathers, as in the app (mobile/src/components/SurahStrip.tsx): one bar per surah, al-Fatiha on the right
 * to al-Nas on the left, as tall as the word's count there, with no numbers. A click, a drag or the arrow keys pick the
 * nearest surah that has the word and name it under its bar.
 */
export default function SurahStrip({ counts, picked, onPick, name }: {
  counts: number[]; picked: number | null; onPick: (surah: number) => void; name: (surah: number) => string;
}) {
  const max = Math.max(1, ...counts);
  const first = counts.findIndex(Boolean);
  const pick = (event: React.PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const surah = nearestSurah(counts, Math.floor(((box.right - event.clientX) / box.width) * SURAHS));
    if (surah !== picked) onPick(surah);
  };
  const last = counts.findLastIndex(Boolean);
  const keys = (event: React.KeyboardEvent) => {
    if (first < 0) return;
    const by = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? 1 : event.key === 'ArrowRight' || event.key === 'ArrowDown' ? -1 : 0;
    const to = event.key === 'Home' ? first : event.key === 'End' ? last : by ? (picked === null ? first : stepSurah(counts, picked, by)) : null;
    if (to === null) return;
    event.preventDefault();
    onPick(to);
  };
  const centre = picked === null ? 0 : ((picked + 0.5) / SURAHS) * 100;
  return (
    <div role="slider" tabIndex={0} aria-label="عدد مرات ورودها في كل سورة" aria-valuemin={1} aria-valuemax={SURAHS}
      aria-valuenow={picked === null ? undefined : picked + 1} aria-valuetext={picked === null ? undefined : name(picked + 1)}
      onPointerDown={event => { event.currentTarget.setPointerCapture?.(event.pointerId); pick(event); }}
      onPointerMove={event => { if (event.buttons) pick(event); }} onKeyDown={keys}
      className="relative h-[4.25rem] cursor-pointer touch-none select-none rounded focus-visible:outline-2 focus-visible:outline-[var(--home-accent)]">
      <div className="absolute inset-x-0 top-0 h-12 border-b border-[var(--home-rule)]">
        {counts.map((count, i) => count > 0 && (
          <span key={i} aria-hidden className="absolute bottom-0 rounded-[1px]"
            style={{ right: `${((i + 0.15) / SURAHS) * 100}%`, width: `${(0.7 / SURAHS) * 100}%`, minWidth: 1, height: `max(2px, ${(count / max) * 100}%)`,
              background: i === picked ? 'var(--home-accent)' : 'var(--home-rule)' }} />
        ))}
      </div>
      {picked !== null && (
        <span aria-hidden className="absolute top-12 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-[var(--home-accent)]"
          style={{ width: LABEL, textAlign: 'center', right: `clamp(0px, calc(${centre}% - ${LABEL / 2}px), calc(100% - ${LABEL}px))` }}>{name(picked + 1)}</span>
      )}
    </div>
  );
}
