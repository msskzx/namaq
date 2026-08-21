import type { HistoricalSource, PersonClaim } from '@/generated/prisma';
import { confidenceLabel, type RelationshipClaimWithSource } from '@/types/provenance';

type Claim = (PersonClaim & { source: HistoricalSource }) | RelationshipClaimWithSource;

interface ClaimEvidenceProps {
  title: string;
  claims: Claim[];
  relationshipClaims?: boolean;
}

function sourceCitation(source: HistoricalSource, volume?: string | null, pageReference?: string | null) {
  const publication = [source.publisher, source.publicationYear].filter(Boolean).join(', ');
  const pinpoint = [volume && `vol. ${volume}`, pageReference && `p. ${pageReference}`].filter(Boolean).join(', ');
  return [source.author, source.title, source.edition, publication, pinpoint].filter(Boolean).join('. ');
}

/** Displays only claims the API has already limited to PUBLISHED status. */
export default function ClaimEvidence({ title, claims, relationshipClaims = false }: ClaimEvidenceProps) {
  if (claims.length === 0) return null;

  return (
    <section className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-4">
      <h2 className="text-3xl mb-4 text-gray-900 dark:text-gray-200">{title}</h2>
      <ul className="space-y-4">
        {claims.map((claim) => {
          const relationship = relationshipClaims
            ? `${(claim as RelationshipClaimWithSource).sourcePersonSlug} — ${(claim as RelationshipClaimWithSource).relationshipType.replaceAll('_', ' ').toLowerCase()} → ${(claim as RelationshipClaimWithSource).targetPersonSlug}`
            : null;

          return (
            <li key={claim.id} className="border-s-4 border-amber-500 ps-3 text-gray-800 dark:text-gray-200">
              {relationship && <p className="mb-1 text-sm font-semibold uppercase tracking-wide">{relationship}</p>}
              <p>{claim.assertion}</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">{confidenceLabel[claim.confidence]}.</span>{' '}
                {claim.source.url ? (
                  <a className="underline" href={claim.source.url} target="_blank" rel="noreferrer">
                    {sourceCitation(claim.source, claim.volume, claim.pageReference)}
                  </a>
                ) : sourceCitation(claim.source, claim.volume, claim.pageReference)}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
