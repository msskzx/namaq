import type {
  Citation,
  ClaimConfidence,
  ClaimReviewStatus,
  HistoricalClaim,
  HistoricalSource,
  SourceAccount,
  SourceAccountPage,
  SourcePassage,
  SubjectKind,
} from '@/generated/prisma';

export type CitationWithSource = Citation & {
  source: HistoricalSource;
  passage?: (SourcePassage & { page: SourceAccountPage }) | null;
};

export type ClaimWithCitations = HistoricalClaim & {
  citations: CitationWithSource[];
  /**
   * The related subject's own name, resolved from its slug by the route that
   * serves the claim. Absent when that subject has no profile row, which is
   * why a reader may still see a slug.
   */
  relatedSubjectName?: string | null;
};

/** One printed page of a source account, as served to the profile reader. */
export type AccountPage = Pick<
  SourceAccountPage,
  'sequence' | 'printedPage' | 'bodyMarkdown' | 'notesMarkdown' | 'extractionUrl'
>;

/** An account's identity without its text, for the profile's book selector. */
export type AccountSummary = Pick<
  SourceAccount,
  'id' | 'subjectKind' | 'subjectSlug' | 'entryIdentifier' | 'titleArabic' | 'volume' | 'extractionUrl'
> & {
  source: HistoricalSource;
  pageCount: number;
};

export type SubjectReferences = {
  subjectKind: SubjectKind;
  subjectSlug: string;
  claims: ClaimWithCitations[];
  citations: CitationWithSource[];
};

/**
 * Not displayed. Confidence is an editorial reading of how a source states a
 * claim, not something the source says, so it stays hidden until claims are
 * reviewed — see docs/data-quality-references.md.
 */
export const confidenceLabel: Record<ClaimConfidence, { en: string; ar: string }> = {
  ESTABLISHED: { en: 'Well attested', ar: 'ثابت' },
  LIKELY: { en: 'Likely', ar: 'مرجَّح' },
  DISPUTED: { en: 'Disputed', ar: 'مختلف فيه' },
  UNASSESSED: { en: 'Assessment pending', ar: 'لم يُقيَّم' },
};

export const reviewStatusLabel: Record<ClaimReviewStatus, { en: string; ar: string }> = {
  NOT_REVIEWED: { en: 'Not reviewed', ar: 'لم تُراجع' },
  IN_REVIEW: { en: 'In review', ar: 'قيد المراجعة' },
  REVIEWED: { en: 'Reviewed', ar: 'مُراجَعة' },
};
