import { legacyUnreviewed, type CatalogVirtue } from '../../src/lib/catalog/types';

/** One `PersonVirtue` row, as projectCatalog writes it. */
export interface VirtueRow {
  readonly position: number;
  readonly text: string;
  readonly speakerName: string | null;
  readonly speakerSlug: string | null;
  readonly claimKey: string | null;
}

/**
 * The rows a person's entries project to, in the order the files list them.
 * The claim key is the first one cited: an entry is one virtue backed by one
 * claim, so a second is there for the reader rather than for the row.
 */
export function virtueRows(virtues: readonly CatalogVirtue[] | undefined): VirtueRow[] {
  return (virtues ?? []).map((virtue, position) => ({
    position,
    text: virtue.value,
    speakerName: virtue.speaker?.name ?? null,
    speakerSlug: virtue.speaker?.slug ?? null,
    claimKey: virtue.claims === legacyUnreviewed ? null : virtue.claims[0],
  }));
}

const same = (row: VirtueRow, live: VirtueRow) =>
  row.text === live.text &&
  row.speakerName === live.speakerName &&
  row.speakerSlug === live.speakerSlug &&
  row.claimKey === live.claimKey;

/**
 * A person's rows are replaced rather than merged, the way the other
 * catalog-owned values are: the files are the authority, so an entry the files
 * dropped goes with the edit that dropped it.
 */
export function planVirtues(
  at: string,
  virtues: readonly CatalogVirtue[] | undefined,
  live: readonly VirtueRow[],
): { rows: VirtueRow[]; changes: string[] } {
  const rows = virtueRows(virtues);
  const changes = rows.flatMap((row, position) => {
    const held = live[position];
    if (!held) return [`${at}.virtues[${position}]: add`];
    if (same(row, held)) return [];
    return [`${at}.virtues[${position}]: overwrite ${JSON.stringify(held.text)} with ${JSON.stringify(row.text)}`];
  });

  live.slice(rows.length).forEach((row, i) => changes.push(`${at}.virtues[${rows.length + i}]: drop`));

  return { rows, changes };
}