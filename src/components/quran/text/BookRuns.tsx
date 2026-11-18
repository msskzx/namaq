import { tafsirRuns } from '@shared/quran/tafsirSadi';
import QuranWords from './QuranWords';

/** A book's own text with the Quran it quotes (﴿…﴾) in the mushaf font and the accent: the exception of books (AGENTS.md, "Quran text"). The app has its own BookRuns. */
export default function BookRuns({ text }: { text: string }) {
  return tafsirRuns(text).map((run, i) => (run.quran ? <QuranWords key={i} className="text-[var(--home-accent)]">{run.text}</QuranWords> : <span key={i}>{run.text}</span>));
}
