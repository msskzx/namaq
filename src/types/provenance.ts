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
  /** The volume this entry opens in, once its edition's volumes are recorded. */
  sourceVolume?: { number: number; name: string | null } | null;
  pageCount: number;
  /** The subject's own name, when it has a profile row; a slug is not a name. */
  subjectName?: string | null;
};

/**
 * One section heading an account declares, and the page it opens on. Lets
 * the reader jump straight into نص المصدر by section instead of only by
 * printed page.
 */
export interface AccountSection {
  sequence: number;
  printedPage: string | null;
  heading: string;
}

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

/** One work on the shelf, with how much of it has been read. */
export type SourceShelfEntry = Pick<
  HistoricalSource,
  | 'slug'
  | 'title'
  | 'author'
  | 'editor'
  | 'publisher'
  | 'publicationYear'
  | 'edition'
  | 'digitalHost'
  | 'url'
  | 'notes'
> & {
  /** The edition's volumes, declared whether or not anything is read from one. */
  volumes: { number: number; name: string | null }[];
  /** Entries read from this work, one per subject. */
  entryCount: number;
  /** Printed pages held across those entries. */
  pageCount: number;
};
