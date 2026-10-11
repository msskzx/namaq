// docs/data-pipelines.md
export type ReaderItem = { surah: number } | { line: (string | number)[]; short?: boolean };

export type ReaderPageData = { juz: number; items: ReaderItem[] };

