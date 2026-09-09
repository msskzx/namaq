'use client';

import React, { useEffect, useState } from 'react';
import Pagination from '@/components/common/Pagination';
import { useLanguage } from '@/components/language/LanguageContext';
import {
  confidenceLabel,
  reviewStatusLabel,
  type CitationWithSource,
  type ClaimWithCitations,
} from '@/types/provenance';
import Badge from '@/components/common/Badge';

interface ClaimEvidenceProps {
  title: string;
  claims: ClaimWithCitations[];
  relationshipClaims?: boolean;
  pageSize?: number;
}

function citationText(citation: CitationWithSource, language: string) {
  const { source } = citation;
  const publication = [source.publisher, source.publicationYear].filter(Boolean).join(', ');
  const pinpoint = [
    citation.volume && (language === 'ar' ? `ج${citation.volume}` : `vol. ${citation.volume}`),
    citation.pageReference && (language === 'ar' ? `ص${citation.pageReference}` : `p. ${citation.pageReference}`),
  ]
    .filter(Boolean)
    .join('، ');
  return [source.author, source.title, source.edition, publication, pinpoint].filter(Boolean).join('. ');
}

/**
 * Shows every recorded claim with its review status rather than hiding
 * unreviewed work — see docs/adr/0008-separate-review-from-visibility.md.
 */
export default function ClaimEvidence({
  title,
  claims,
  relationshipClaims = false,
  pageSize = 5,
}: ClaimEvidenceProps) {
  const { language } = useLanguage();
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(claims.length / pageSize));

  // A shorter list can leave the reader on a page that no longer exists, for
  // instance when the profile's claims arrive after an empty first render.
  useEffect(() => {
    setPage((current) => Math.min(current, Math.max(1, Math.ceil(claims.length / pageSize))));
  }, [claims.length, pageSize]);

  if (claims.length === 0) return null;

  const first = (page - 1) * pageSize;
  const shown = claims.slice(first, first + pageSize);
  const range = language === 'ar'
    ? `${first + 1}–${first + shown.length} من ${claims.length}`
    : `${first + 1}–${first + shown.length} of ${claims.length}`;

  return (
    <section className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-4">
      <h2 className="text-3xl mb-4 text-gray-900 dark:text-gray-200">{title}</h2>
      <ul className="space-y-4">
        {shown.map((claim) => {
          const relationship =
            relationshipClaims && claim.relationshipType
              ? `${claim.subjectSlug} — ${claim.relationshipType.replaceAll('_', ' ').toLowerCase()} → ${claim.relatedSubjectSlug ?? ''}`
              : null;

          return (
            <li key={claim.id} className="border-s-4 border-amber-500 ps-3 text-gray-800 dark:text-gray-200">
              {relationship && <p className="mb-1 text-sm font-semibold uppercase tracking-wide">{relationship}</p>}
              <p>{claim.assertion}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge size="sm" color="gray" text={reviewStatusLabel[claim.reviewStatus][language === 'ar' ? 'ar' : 'en']} />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {confidenceLabel[claim.confidence][language === 'ar' ? 'ar' : 'en']}
                </span>
              </div>
              {claim.citations.length === 0 ? (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {language === 'ar' ? 'لم تُضف المراجع بعد' : 'References not yet added'}
                </p>
              ) : (
                <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {claim.citations.map((citation) => (
                    <li key={citation.id}>
                      <a className="underline" href={citation.extractionUrl} target="_blank" rel="noreferrer">
                        {citationText(citation, language)}
                      </a>
                      {citation.excerptArabic && (
                        <span className="block mt-1" dir="rtl" lang="ar">
                          {citation.excerptArabic}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      <Pagination page={page} pageCount={pageCount} onChange={setPage} summary={range} />
    </section>
  );
}
