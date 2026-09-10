'use client';

import React, { useEffect, useState } from 'react';
import Pagination from '@/components/common/Pagination';
import { useLanguage } from '@/components/language/LanguageContext';
import translations from '@/components/language/translations';
import {
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

// The profile fields a claim can speak to. A claim with no field is a
// biographical statement rather than support for one recorded value.
const fieldLabel: Record<string, { en: string; ar: string }> = {
  name: { en: 'Name', ar: 'الاسم' },
  fullName: { en: 'Full name', ar: 'الاسم الكامل' },
  titles: { en: 'Titles', ar: 'الألقاب' },
  appearance: { en: 'Appearance', ar: 'الهيئة' },
  virtues: { en: 'Virtues', ar: 'المناقب' },
  deathYearHijri: { en: 'Year of death', ar: 'سنة الوفاة' },
  placeOfDeathArabic: { en: 'Place of death', ar: 'مكان الوفاة' },
};

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
  const t = translations[language];
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

  return (
    <section className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-4">
      <h2 className="text-3xl mb-4 text-gray-900 dark:text-gray-200">{title}</h2>
      <ul className="space-y-4">
        {shown.map((claim) => {
          const relationship =
            relationshipClaims && claim.relationshipType
              ? `${claim.relationshipType.replaceAll('_', ' ').toLowerCase()} → ${claim.relatedSubjectName ?? claim.relatedSubjectSlug ?? ''}`
              : null;
          // What the profile would change if this claim were acted on, so a
          // reader can tell evidence for a recorded value from background.
          const relationName = claim.relationshipType
            ? (t.relationTypes as Record<string, string>)[claim.relationshipType] ?? claim.relationshipType
            : null;
          const supports = relationName
            ? `${relationName} → ${claim.relatedSubjectName ?? claim.relatedSubjectSlug ?? ''}`
            : claim.field
              ? fieldLabel[claim.field]?.[language === 'ar' ? 'ar' : 'en'] ?? claim.field
              : null;

          return (
            <li key={claim.id} className="border-s-4 border-amber-500 ps-3 text-gray-800 dark:text-gray-200">
              {relationship && <p className="mb-1 text-sm font-semibold uppercase tracking-wide">{relationship}</p>}
              <p>{claim.assertion}</p>
              {supports && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {language === 'ar' ? `تدعم: ${supports}` : `Supports: ${supports}`}
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge size="sm" color="gray" text={reviewStatusLabel[claim.reviewStatus][language === 'ar' ? 'ar' : 'en']} />
              </div>
              {claim.citations.length === 0 ? (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {language === 'ar' ? 'لم تُضف المراجع بعد' : 'References not yet added'}
                </p>
              ) : (
                <div className="mt-3">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {language === 'ar' ? 'الشواهد' : 'Supporting passages'}
                  </h3>
                  {/* The passage is the evidence and the reference is its
                      attribution, so the quote leads and the citation sits under
                      it. An assertion often restates its passage closely, and
                      without that order the two read as the same thing twice. */}
                  <ul className="mt-1 space-y-3">
                    {claim.citations.map((citation) => (
                      <li key={citation.id} className="border-s-2 border-gray-300 ps-3 dark:border-gray-600">
                        {citation.excerptArabic && (
                          <p dir="rtl" lang="ar" className="arabic-source text-gray-800 dark:text-gray-200">
                            {citation.excerptArabic}
                          </p>
                        )}
                        <a
                          className="mt-1 inline-block text-xs text-gray-600 underline dark:text-gray-400"
                          href={citation.extractionUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {citationText(citation, language)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <Pagination page={page} pageCount={pageCount} onChange={setPage} showSelect />
    </section>
  );
}
