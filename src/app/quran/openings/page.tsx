import type { Metadata } from 'next';
import treeData from '@shared/data/quran/trees.json';
import surahs from '@shared/data/quran/surahs.json';
import { CONDITION_SPANS, conditionLines, openingCards } from '@shared/quran/openingKinds';
import OpeningsView, { type ConditionText } from './OpeningsView';

export const metadata: Metadata = {
  title: 'افتتاح السور',
};

const byKey = new Map((treeData as { ayat: { key: string; words: string[] }[] }).ayat.map(ayah => [ayah.key, ayah.words]));
const words = (key: string) => byKey.get(key) ?? [];

export default function QuranOpeningsPage() {
  const names = Object.fromEntries(surahs.map(s => [s.number, s.name]));
  const conditions: ConditionText = Object.fromEntries(Object.keys(CONDITION_SPANS).map(surah => [surah, conditionLines(Number(surah)).map(line => ({ ...line, words: words(line.key) }))]));
  return (
    <div dir="rtl" className="w-full max-w-3xl mx-auto px-4 py-6 flex flex-col gap-4 text-[var(--home-ink)]">
      <OpeningsView cards={openingCards(words)} names={names} conditions={conditions} />
    </div>
  );
}
