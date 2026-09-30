import { createHash } from 'node:crypto';
import type { SourceManifest, StorePage } from './sourceStore';
import { pageAnchors } from './sourceStore';

export const subjectKinds = ['PERSON', 'TITLE', 'BATTLE', 'EVENT'] as const;
export const reviewStatuses = ['NOT_REVIEWED', 'IN_REVIEW', 'REVIEWED'] as const;
export const confidences = ['ESTABLISHED', 'LIKELY', 'DISPUTED', 'UNASSESSED'] as const;
export const passageKinds = ['BODY', 'NOTE'] as const;
/**
 * The extraction checklist's content items (docs/extraction-checklist.md): the
 * only things an account may declare absent from its source, since these are
 * the ones a source can legitimately be silent on. Source-text detail and
 * claims themselves are not on this list — an account always has both, so
 * there is no "absent" state for them to declare.
 */
export const checklistContentItems = [
  'fullName',
  'kunya',
  'appearance',
  'manaqeb',
  'nasab',
  'wives',
  'siblings',
] as const;

export type ChecklistContentItem = (typeof checklistContentItems)[number];

export type SubjectKind = (typeof subjectKinds)[number];
export type ReviewStatus = (typeof reviewStatuses)[number];
export type Confidence = (typeof confidences)[number];
export type PassageKind = (typeof passageKinds)[number];

/**
 * One page of an account's run, naming the store page it reads rather than
 * carrying the page's text: the text lives once in
 * `data/history/sources/<source>/v<N>/<printedPage>.md` — see
 * docs/plans/source-page-store.md.
 */
export interface PageRecord {
  sequence: number;
  printedPage: string;
  /**
   * The volume this page is bound in, by the source's `number`. Omitted, the
   * page takes its account's `volumeNumber`, so only the pages of an entry
   * that crosses a binding need to say anything.
   */
  volumeNumber?: number;
}

export interface AccountRecord {
  sourceSlug: string;
  subjectKind: SubjectKind;
  subjectSlug: string;
  entryIdentifier?: string;
  titleArabic?: string;
  /** The volume this entry opens in, by the source's `number`. */
  volumeNumber?: number;
  extractionUrl: string;
  accessedAt: string;
  pages: PageRecord[];
  /**
   * Extraction-checklist items (docs/extraction-checklist.md) the agent
   * looked for in this account and confirmed the source does not state.
   * Distinguishes "checked, genuinely absent" from "nobody checked yet" —
   * `catalog:checklist` treats an item here as settled rather than a warning.
   */
  notInSource?: ChecklistContentItem[];
}

export interface CitationRecord {
  sourceSlug: string;
  /** Derived anchor `<volume>/<printedPage>-p<n>` of a store page's paragraph. */
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
  accounts: AccountRecord[];
  claims: ClaimRecord[];
  approval?: BatchApproval;
}

export function markBatchReviewed(batch: HistoryBatch) {
  let changed = 0;
  for (const claim of batch.claims) {
    if (claim.reviewStatus === 'REVIEWED') continue;
    claim.reviewStatus = 'REVIEWED';
    changed += 1;
  }
  return changed;
}

/** `summary.md`'s text, the one local file a batch still carries. */
export type BatchFiles = Record<string, string>;

/** The source manifests a batch's accounts and citations refer to, by slug. */
export type SourceManifests = Map<string, SourceManifest>;

/** Store pages the batch's accounts reference, keyed by `sourceSlug/v<N>/<printedPage>`. */
export type StorePages = Map<string, StorePage>;

export function storePageKey(sourceSlug: string, volumeNumber: number, printedPage: string) {
  return `${sourceSlug}/v${volumeNumber}/${printedPage}`;
}

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
  manifests: SourceManifests,
  anchors: Set<string>,
  issues: ValidationIssue[],
) {
  if (!manifests.has(citation.sourceSlug)) {
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
  manifests: SourceManifests,
  pages: StorePages,
  anchors: Set<string>,
  issues: ValidationIssue[],
) {
  const path = `accounts[${index}]`;

  const manifest = manifests.get(account.sourceSlug);
  if (!manifest) {
    issues.push({ path, message: `unknown source "${account.sourceSlug}"` });
  }
  const declared = new Set((manifest?.volumes ?? []).map((volume) => volume.number));
  if (account.volumeNumber !== undefined && !declared.has(account.volumeNumber)) {
    issues.push({
      path,
      message: `volumeNumber ${account.volumeNumber} is not a volume "${account.sourceSlug}" declares`,
    });
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
  const notInSourceSet = new Set<string>(checklistContentItems);
  account.notInSource?.forEach((item, itemIndex) => {
    if (!notInSourceSet.has(item)) {
      issues.push({
        path: `${path}.notInSource[${itemIndex}]`,
        message: `"${item}" is not a checklist content item (${checklistContentItems.join(', ')})`,
      });
    }
  });

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

    const volumeNumber = page.volumeNumber ?? account.volumeNumber;
    if (volumeNumber !== undefined && !declared.has(volumeNumber)) {
      issues.push({
        path: pagePath,
        message: `volumeNumber ${volumeNumber} is not a volume "${account.sourceSlug}" declares`,
      });
    }
    if (volumeNumber === undefined) {
      issues.push({ path: pagePath, message: 'no volumeNumber on the page or the account' });
      return;
    }

    const store = pages.get(storePageKey(account.sourceSlug, volumeNumber, page.printedPage));
    if (!store) {
      issues.push({
        path: pagePath,
        message: `no store page at v${volumeNumber}/${page.printedPage} for "${account.sourceSlug}"`,
      });
      return;
    }
    for (const anchor of pageAnchors(volumeNumber, page.printedPage, store.body).keys()) {
      anchors.add(anchor);
    }
  });
}

/**
 * Checks a batch against the rules in docs/data-pipelines.md: known sources,
 * resolvable citation targets and required provenance. `manifests` and
 * `pages` come from `loadBatch`, which reads only the sources and store pages
 * this batch's accounts actually name.
 */
export function validateBatch(
  batch: HistoryBatch,
  files: BatchFiles,
  manifests: SourceManifests,
  pages: StorePages,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!batch.slug.trim()) issues.push({ path: 'slug', message: 'slug is required' });
  if (files[batch.summaryFile] === undefined) {
    issues.push({ path: 'summaryFile', message: `missing summary "${batch.summaryFile}"` });
  }

  const anchors = new Set<string>();
  batch.accounts.forEach((account, index) => checkAccount(account, index, manifests, pages, anchors, issues));

  const keys = new Set<string>();
  batch.claims.forEach((claim, index) => {
    const path = `claims[${index}]`;

    if (keys.has(claim.key)) issues.push({ path, message: `duplicate claim key "${claim.key}"` });
    keys.add(claim.key);

    if (!claim.assertion.trim()) issues.push({ path, message: 'assertion is required' });
    if (!claim.subjectSlug.trim()) issues.push({ path, message: 'subjectSlug is required' });

    // Caught nothing before this: the database enforces its own enum at
    // write time, but a batch with a bad value passed validate/approve
    // clean and only failed on import, minutes into a bulk run -- see
    // docs/lessons/lessons/0003-a-check-that-exists-but-doesnt-run.html.
    if (claim.confidence !== undefined && !confidences.includes(claim.confidence)) {
      issues.push({ path, message: `confidence "${claim.confidence}" is not one of ${confidences.join(', ')}` });
    }
    if (claim.reviewStatus !== undefined && !reviewStatuses.includes(claim.reviewStatus)) {
      issues.push({ path, message: `reviewStatus "${claim.reviewStatus}" is not one of ${reviewStatuses.join(', ')}` });
    }

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
      checkCitation(citation, `${path}.citations[${citationIndex}]`, manifests, anchors, issues),
    );
  });

  return issues;
}

/**
 * Non-blocking nudge, not a validation issue: a PERSON account that declares
 * no `notInSource` at all is either a genuinely thorough entry or one nobody
 * ran docs/extraction-checklist.md's walkthrough against — `history:validate`
 * can't tell which, since that requires reading the source pages a human (or
 * agent) already read. Surfacing it here means the reminder shows up on every
 * validate run rather than only when someone remembers to run
 * `catalog:checklist` separately.
 */
export function checklistReminders(batch: HistoryBatch): string[] {
  return batch.accounts
    .filter((account) => account.subjectKind === 'PERSON' && !account.notInSource?.length)
    .map(
      (account) =>
        `${account.subjectSlug}: no notInSource items declared — run npm run catalog:checklist -- ${account.subjectSlug} before approving`,
    );
}

/**
 * Content hash of the batch itself: its claims, citations and account spans.
 * Store page text is published on its own
 * (docs/plans/source-page-store.md, "Publication") and does not gate a
 * batch's approval. `summary.md` is outside the hash too: the summary is
 * written for the reviewer and changing its wording invalidates nothing
 * about the evidence.
 */
export function batchRevision(batch: HistoryBatch): string {
  const content = { ...batch, approval: undefined };
  const hash = createHash('sha256');
  hash.update(JSON.stringify(content));
  return hash.digest('hex').slice(0, 16);
}

export type ApprovalCheck =
  | { approved: true; revision: string }
  | { approved: false; revision: string; reason: string };

/** Whether the batch as it stands on disk is the exact revision the user approved. */
export function checkApproval(batch: HistoryBatch): ApprovalCheck {
  const revision = batchRevision(batch);

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
