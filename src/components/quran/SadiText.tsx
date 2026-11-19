import { tafsirRuns } from '@shared/quran/tafsirSadi';
import QuranWords from '@/components/quran/text/QuranWords';

/** Al-Sa'di's words with the Quran he quotes in the mushaf's font and the accent (the reader's tafsir sheet and the quiz's look-up; the app's SadiText). */
export default function SadiText({ text }: { text: string }) {
  return (
    <p className="whitespace-pre-line px-0.5 text-[1.1875rem] leading-[1.9]">
      {tafsirRuns(text).map((run, i) => (run.quran ? <QuranWords key={i} className="text-[var(--home-accent)]">{run.text}</QuranWords> : run.text))}
    </p>
  );
}
