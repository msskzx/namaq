import BarStrip from '@/ui/BarStrip';
import type { Palette } from '@/lib/theme';

export default function SurahStrip({ counts, picked, onPick, onLift, onSliding, names, palette }: {
  counts: number[]; picked: number | null; onPick: (surah: number) => void; onLift?: (surah: number) => void; onSliding?: (sliding: boolean) => void; names: Record<number, string>; palette: Palette;
}) {
  return <BarStrip counts={counts} picked={picked} onPick={onPick} onLift={onLift} onSliding={onSliding} name={i => names[i + 1]} under label="عدد مرات ورودها في كل سورة" palette={palette} />;
}
