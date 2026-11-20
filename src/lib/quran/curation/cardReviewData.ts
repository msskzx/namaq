import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { CardProposals, CardReviewIndex } from './cardReviewIndex';

/**
 * The review page's two files, read from disk once per server (not bundled: the index is several MB). The index is rebuilt by
 * `npm run quran:card-review`; the proposals are the agents' merged verdicts (scripts/quran/mergeCardProposals.ts).
 */
let index: CardReviewIndex | undefined;
let proposals: CardProposals | undefined;
const read = <T>(file: string): T => JSON.parse(readFileSync(join(process.cwd(), 'src/lib/quran/curation', file), 'utf8')) as T;

export const cardReviewIndex = () => (index ??= read<CardReviewIndex>('cardReview.json'));
export const cardProposals = () => (proposals ??= read<{ cards: CardProposals }>('cardProposals.json').cards);
