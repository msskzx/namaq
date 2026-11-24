import BarStrip from '@/ui/BarStrip';
import type { Palette } from '@/lib/theme';

/**
 * Where a word gathers (owner, 2026-11-16): one bar per surah, al-Fatiha on the right to al-Nas on the left, as tall as
 * the word's count there, with no numbers. A tap or a drag picks the nearest surah that has the word and names it under its bar.
 * Twice as tall since the chart slides away while reading (owner, 2026-11-21). While the finger slides, the surah's name
 * rides in a pill above it, where the finger does not cover it; the name alone, as the count line gives the count.
 */
export default function SurahStrip({ counts, picked, onPick, onLift, onSliding, names, palette }: {
  counts: number[]; picked: number | null; onPick: (surah: number) => void; onLift?: (surah: number) => void; onSliding?: (sliding: boolean) => void; names: Record<number, string>; palette: Palette;
}) {
  return <BarStrip counts={counts} picked={picked} onPick={onPick} onLift={onLift} onSliding={onSliding} name={i => names[i + 1]} under label="عدد مرات ورودها في كل سورة" palette={palette} />;
}
