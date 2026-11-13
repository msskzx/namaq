/** The solo quiz in progress, kept in this browser so a reload or a later visit can continue it (as the app keeps it). */
export type SoloRun<Data> = {
  /** The quiz page's query string, which names the quiz's settings. */
  search: string;
  data: Data;
  current: number;
  answers: Record<number, string>;
  typed: Record<number, string[]>;
};

const KEY = 'quiz-solo-run';

export function readRun<Data>(): SoloRun<Data> | null {
  try {
    const run = JSON.parse(localStorage.getItem(KEY) ?? 'null') as SoloRun<Data> | null;
    return run && typeof run.search === 'string' && run.data ? run : null;
  } catch { return null; }
}

export function writeRun<Data>(run: SoloRun<Data> | null) {
  try {
    if (run) localStorage.setItem(KEY, JSON.stringify(run));
    else localStorage.removeItem(KEY);
  } catch { /* private mode or full: the quiz still runs, it just isn't kept */ }
}
