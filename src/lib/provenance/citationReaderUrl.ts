export interface ReaderTarget {
  readonly subjectSlug: string;
  readonly accountId: string;
  readonly sequence: number;
  readonly anchor?: string | null;
}

/** One passage-aware reader URL shared by quiz references and profile claim evidence. */
export function citationReaderUrl(target: ReaderTarget): string {
  const base = `/people/${target.subjectSlug}?book=${target.accountId}&page=${target.sequence}`;
  return target.anchor ? `${base}&passage=${encodeURIComponent(target.anchor)}` : base;
}
