import { citationReaderUrl } from '@/lib/provenance/citationReaderUrl';

/** The single citation a quiz surface presents for an answer. */
export interface QuizReference {
  readonly excerptArabic: string;
  readonly sourceTitle: string;
  readonly pageReference: string | null;
  readonly readerUrl: string;
}

interface ReferenceCitation {
  readonly subjectKind: string;
  readonly subjectSlug: string;
  readonly excerptArabic: string;
  readonly pageReference: string | null;
  readonly source: { readonly title: string };
  readonly passage: {
    readonly anchor: string | null;
    readonly page: { readonly accountId: string; readonly sequence: number } | null;
  } | null;
}

interface ReferenceClaim {
  readonly authoringKey: string;
  readonly citations: readonly ReferenceCitation[];
}

/** The first usable cited passage in stable claim and citation order. */
export function selectQuizReference(
  claimKeys: readonly string[],
  claims: readonly ReferenceClaim[],
): QuizReference | null {
  const byKey = new Map(claims.map((claim) => [claim.authoringKey, claim]));
  for (const key of [...claimKeys].sort()) {
    const claim = byKey.get(key);
    if (!claim) continue;
    const [first] = claim.citations
      .filter((citation) => citation.subjectKind === 'PERSON' && citation.passage?.page)
      .sort((a, b) =>
        (a.passage?.page?.sequence ?? 0) - (b.passage?.page?.sequence ?? 0) ||
        (a.passage?.anchor ?? '').localeCompare(b.passage?.anchor ?? ''),
      );
    if (!first?.passage?.page) continue;
    return {
      excerptArabic: first.excerptArabic,
      sourceTitle: first.source.title,
      pageReference: first.pageReference,
      readerUrl: citationReaderUrl({
        subjectSlug: first.subjectSlug,
        accountId: first.passage.page.accountId,
        sequence: first.passage.page.sequence,
        anchor: first.passage.anchor,
      }),
    };
  }
  return null;
}
