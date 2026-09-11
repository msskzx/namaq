import { createHash } from 'node:crypto';

export const subjectKinds = ['PERSON', 'TITLE', 'BATTLE', 'EVENT'] as const;
export const reviewStatuses = ['NOT_REVIEWED', 'IN_REVIEW', 'REVIEWED'] as const;
export const confidences = ['ESTABLISHED', 'LIKELY', 'DISPUTED', 'UNASSESSED'] as const;
export const passageKinds = ['BODY', 'NOTE'] as const;

export type SubjectKind = (typeof subjectKinds)[number];
export type ReviewStatus = (typeof reviewStatuses)[number];
export type Confidence = (typeof confidences)[number];
export type PassageKind = (typeof passageKinds)[number];

export interface SourceRecord {
  slug: string;
  title: string;
  author?: string;
  editor?: string;
  publisher?: string;
  publicationYear?: string;
  edition?: string;
  digitalHost?: string;
  url?: string;
  notes?: string;
}

export interface PassageRecord {
  anchor: string;
  kind?: PassageKind;
  excerpt: string;
}

export interface PageRecord {
  sequence: number;
  printedPage?: string;
  /** Path to the page's Markdown, relative to the batch directory. */
  bodyFile: string;
  notesFile?: string;
  extractionUrl?: string;
  passages?: PassageRecord[];
}

export interface AccountRecord {
  sourceSlug: string;
  subjectKind: SubjectKind;
  subjectSlug: string;
  entryIdentifier?: string;
  titleArabic?: string;
  volume?: string;
  extractionUrl: string;
  accessedAt: string;
  pages: PageRecord[];
}

export interface CitationRecord {
  sourceSlug: string;
  /** Anchor of a passage declared by one of this batch's account pages. */
  passageAnchor?: string;
  paragraphKey?: string;
  footnoteNumber?: number;
  volume?: string;
  pageReference?: string;
  extractionUrl: string;
  excerptArabic: string;
  accessedAt: string;
}

export interface ClaimRecord {
  key: string;
  subjectKind: SubjectKind;
  subjectSlug: string;
  field?: string;
  assertion: string;
  relationshipType?: string;
  relatedSubjectKind?: SubjectKind;
  relatedSubjectSlug?: string;
  confidence?: Confidence;
  reviewStatus?: ReviewStatus;
  reviewerNote?: string;
  disputed?: boolean;
  citations: CitationRecord[];
}

export interface BatchApproval {
  revision: string;
  approvedAt: string;
  approvedBy: string;
  /**
   * Why this batch may be written. Approval permits publication; it is not a
   * statement that the content was checked, which is what each claim's review
   * status records — see docs/adr/0008-separate-review-from-visibility.md.
   */
  note?: string;
}

export interface HistoryBatch {
  slug: string;
  summaryFile: string;
  sources: SourceRecord[];
  accounts: AccountRecord[];
  claims: ClaimRecord[];
  approval?: BatchApproval;
}

/** Markdown for every page file the batch references, keyed by its relative path. */
export type BatchFiles = Record<string, string>;

export interface ValidationIssue {
  path: string;
  message: string;
}

function isIsoDate(value: string) {
  return !Number.isNaN(Date.parse(value));
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function checkCitation(
  citation: CitationRecord,
  path: string,
  sourceSlugs: Set<string>,
  anchors: Set<string>,
  issues: ValidationIssue[],
) {
  if (!sourceSlugs.has(citation.sourceSlug)) {
    issues.push({ path, message: `unknown source "${citation.sourceSlug}"` });
  }
  if (!isHttpUrl(citation.extractionUrl)) {
    // A missing printed page is tolerable; a citation nobody can recheck is not.
    issues.push({ path, message: 'extractionUrl must be an http(s) URL' });
  }
  if (!citation.excerptArabic.trim()) {
    issues.push({ path, message: 'excerptArabic is required' });
  }
  if (!isIsoDate(citation.accessedAt)) {
    issues.push({ path, message: 'accessedAt must be a date' });
  }
  if (citation.passageAnchor && !anchors.has(citation.passageAnchor)) {
    issues.push({ path, message: `citation targets unknown passage "${citation.passageAnchor}"` });
  }
}

function checkAccount(
  account: AccountRecord,
  index: number,
  sourceSlugs: Set<string>,
  files: BatchFiles,
  anchors: Set<string>,
  issues: ValidationIssue[],
) {
  const path = `accounts[${index}]`;

  if (!sourceSlugs.has(account.sourceSlug)) {
    issues.push({ path, message: `unknown source "${account.sourceSlug}"` });
  }
  if (!isHttpUrl(account.extractionUrl)) {
    issues.push({ path, message: 'extractionUrl must be an http(s) URL' });
  }
  if (!isIsoDate(account.accessedAt)) {
    issues.push({ path, message: 'accessedAt must be a date' });
  }
  if (account.pages.length === 0) {
    issues.push({ path, message: 'an account needs at least one page' });
  }

  const seen = new Set<number>();
  account.pages.forEach((page, pageIndex) => {
    const pagePath = `${path}.pages[${pageIndex}]`;

    // Sequence is the account's own ordering, so gaps would silently drop a
    // page from the reader even when printed numbering is irregular.
    if (page.sequence !== pageIndex + 1) {
      issues.push({ path: pagePath, message: `sequence must be ${pageIndex + 1}, found ${page.sequence}` });
    }
    if (seen.has(page.sequence)) {
      issues.push({ path: pagePath, message: `duplicate sequence ${page.sequence}` });
    }
    seen.add(page.sequence);

    if (files[page.bodyFile] === undefined) {
      issues.push({ path: pagePath, message: `missing page file "${page.bodyFile}"` });
    } else if (!files[page.bodyFile].trim()) {
      issues.push({ path: pagePath, message: `page file "${page.bodyFile}" is empty` });
    }
    if (page.notesFile && files[page.notesFile] === undefined) {
      issues.push({ path: pagePath, message: `missing notes file "${page.notesFile}"` });
    }

    page.passages?.forEach((passage, passageIndex) => {
      const key = `${account.sourceSlug}:${account.subjectSlug}:${passage.anchor}`;
      if (anchors.has(key)) {
        issues.push({ path: `${pagePath}.passages[${passageIndex}]`, message: `duplicate anchor "${passage.anchor}"` });
      }
      anchors.add(key);
      anchors.add(passage.anchor);
      if (!passage.excerpt.trim()) {
        issues.push({ path: `${pagePath}.passages[${passageIndex}]`, message: 'excerpt is required' });
      }
    });
  });
}

/**
 * Checks a batch against the rules in docs/data-quality-references.md:
 * known sources, resolvable citation targets, required provenance, and page
 * integrity. Returns every issue found rather than throwing on the first.
 */
export function validateBatch(batch: HistoryBatch, files: BatchFiles): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!batch.slug.trim()) issues.push({ path: 'slug', message: 'slug is required' });
  if (files[batch.summaryFile] === undefined) {
    issues.push({ path: 'summaryFile', message: `missing summary "${batch.summaryFile}"` });
  }

  const sourceSlugs = new Set<string>();
  batch.sources.forEach((source, index) => {
    if (sourceSlugs.has(source.slug)) {
      issues.push({ path: `sources[${index}]`, message: `duplicate source slug "${source.slug}"` });
    }
    sourceSlugs.add(source.slug);
    if (!source.title.trim()) issues.push({ path: `sources[${index}]`, message: 'title is required' });
  });

  const anchors = new Set<string>();
  batch.accounts.forEach((account, index) => checkAccount(account, index, sourceSlugs, files, anchors, issues));

  const keys = new Set<string>();
  batch.claims.forEach((claim, index) => {
    const path = `claims[${index}]`;

    if (keys.has(claim.key)) issues.push({ path, message: `duplicate claim key "${claim.key}"` });
    keys.add(claim.key);

    if (!claim.assertion.trim()) issues.push({ path, message: 'assertion is required' });
    if (!claim.subjectSlug.trim()) issues.push({ path, message: 'subjectSlug is required' });

    // A claim exists to make one recorded value checkable. The source pages
    // already hold everything the entry says, so a claim backing nothing is a
    // second copy of text rather than evidence -- see AGENTS.md, "Historical
    // evidence data".
    if (!claim.field && !claim.relationshipType) {
      issues.push({ path, message: 'a claim must name the field or relationship it supports' });
    }

    const relationshipParts = [claim.relationshipType, claim.relatedSubjectKind, claim.relatedSubjectSlug];
    const present = relationshipParts.filter(Boolean).length;
    if (present > 0 && present < relationshipParts.length) {
      issues.push({ path, message: 'a relationship claim needs type, related kind and related slug' });
    }

    if (claim.citations.length === 0) {
      issues.push({ path, message: 'every claim needs at least one citation' });
    }
    claim.citations.forEach((citation, citationIndex) =>
      checkCitation(citation, `${path}.citations[${citationIndex}]`, sourceSlugs, anchors, issues),
    );
  });

  return issues;
}

/**
 * Content hash of the batch and the source pages, so any edit after approval
 * has to be approved again. summary.md is outside it: the summary is written
 * for the reviewer and changing its wording invalidates nothing about the
 * evidence.
 */
export function batchRevision(batch: HistoryBatch, files: BatchFiles): string {
  const content = { ...batch, approval: undefined };
  const hash = createHash('sha256');
  hash.update(JSON.stringify(content));
  Object.keys(files)
    .filter((path) => path !== batch.summaryFile)
    .sort()
    .forEach((path) => {
      hash.update(path);
      hash.update(files[path]);
    });
  return hash.digest('hex').slice(0, 16);
}

export type ApprovalCheck =
  | { approved: true; revision: string }
  | { approved: false; revision: string; reason: string };

/** Whether the batch as it stands on disk is the exact revision the user approved. */
export function checkApproval(batch: HistoryBatch, files: BatchFiles): ApprovalCheck {
  const revision = batchRevision(batch, files);

  if (!batch.approval) {
    return { approved: false, revision, reason: 'the batch has no recorded approval' };
  }
  if (batch.approval.revision !== revision) {
    return {
      approved: false,
      revision,
      reason: `approval covers revision ${batch.approval.revision}, but the files are now ${revision}`,
    };
  }
  return { approved: true, revision };
}
