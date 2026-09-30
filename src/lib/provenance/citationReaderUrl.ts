export interface ReaderTarget {
  readonly subjectSlug: string;
  readonly volumeNumber: number;
  readonly printedPage: number;
  readonly anchor?: string | null;
}

/**
 * One passage-aware reader URL shared by quiz references and profile claim
 * evidence. Addresses a page by volume and printed page rather than by
 * account: a page can belong to more than one account, and the profile
 * route is already scoped to the subject, so the reader resolves which of
 * the subject's own entries covers this page itself.
 */
export function citationReaderUrl(target: ReaderTarget): string {
  const base = `/people/${target.subjectSlug}?volume=${target.volumeNumber}&page=${target.printedPage}`;
  return target.anchor ? `${base}&passage=${encodeURIComponent(target.anchor)}` : base;
}
