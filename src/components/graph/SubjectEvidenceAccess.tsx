'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';
import { fetcher } from '@/lib/swr';
import { reviewStatusLabel, type ClaimWithCitations } from '@/types/provenance';

interface SubjectEvidenceAccessProps {
  kind: string;
  slug: string;
  hasProfile: boolean;
  profileHref: string;
  /** Claim count from the profile preview; unknown until that fetch lands. */
  evidenceCount?: number;
}

interface ReferencesResponse {
  claims: ClaimWithCitations[];
}

// The pane names identity, so a subject without a profile shows the claims
// behind the name it is displaying rather than everything on record.
const identityFields = new Set(['name', 'fullName', 'titles']);

/**
 * Evidence access for the selected subject, in the three cases the plan
 * distinguishes: a profile-backed subject links to its profile's references, a
 * subject with no profile gets a compact list here, and a subject with no
 * evidence is told so — see docs/data-quality-references-plan.md.
 */
export default function SubjectEvidenceAccess({
  kind,
  slug,
  hasProfile,
  profileHref,
  evidenceCount,
}: SubjectEvidenceAccessProps) {
  const { language } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  const { data } = useSWR<ReferencesResponse>(
    hasProfile ? null : `/api/subjects/${kind}/${slug}/references`,
    fetcher,
  );

  const noEvidence = language === 'ar' ? 'لم تُضف المراجع بعد' : 'References not yet added';

  if (hasProfile) {
    if (evidenceCount === 0) {
      return <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{noEvidence}</p>;
    }
    if (evidenceCount === undefined) return null;

    return (
      <div className="mt-2">
        <Button href={profileHref} variant="outline" size="sm">
          <FontAwesomeIcon icon={faBookOpen} />
          {language === 'ar' ? 'المراجع في الصفحة الشخصية' : 'References on the profile'}
        </Button>
      </div>
    );
  }

  const claims = (data?.claims ?? []).filter((claim) => !claim.field || identityFields.has(claim.field));

  if (!data) return null;
  if (claims.length === 0) {
    return <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{noEvidence}</p>;
  }

  return (
    <div className="mt-2">
      <Button variant="outline" size="sm" active={expanded} onClick={() => setExpanded(!expanded)}>
        <FontAwesomeIcon icon={expanded ? faChevronUp : faChevronDown} />
        {language === 'ar' ? 'المراجع' : 'References'}
      </Button>
      {expanded && (
        <ul className="mt-2 space-y-2 text-sm text-gray-700 dark:text-gray-300">
          {claims.map((claim) => (
            <li key={claim.id} className="border-s-2 border-amber-400 ps-2">
              <p>{claim.assertion}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Badge
                  size="sm"
                  color="gray"
                  text={reviewStatusLabel[claim.reviewStatus][language === 'ar' ? 'ar' : 'en']}
                />
                {claim.citations.map((citation) => (
                  <a
                    key={citation.id}
                    className="underline"
                    href={citation.extractionUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {citation.source.title}
                    {citation.pageReference ? ` — ${citation.pageReference}` : ''}
                  </a>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
