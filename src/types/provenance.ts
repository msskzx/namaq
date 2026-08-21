import type { ClaimConfidence, HistoricalSource, RelationshipClaim } from '@/generated/prisma';

export type RelationshipClaimWithSource = RelationshipClaim & { source: HistoricalSource };

export const confidenceLabel: Record<ClaimConfidence, string> = {
  ESTABLISHED: 'Well attested',
  LIKELY: 'Likely',
  DISPUTED: 'Disputed',
  UNASSESSED: 'Assessment pending',
};
