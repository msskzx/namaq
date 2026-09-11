'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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
  /** The profile's own subject, so a relation names both of its ends. */
  subjectName?: string;
  /** The profile's slug, so a citation can link to the page it was read from. */
  subjectSlug?: string;
  title: string;
  claims: ClaimWithCitations[];
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
  pageSize = 5,
  subjectName,
  subjectSlug,
}: ClaimEvidenceProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const [page, setPage] = useState(1);

  const supportLabel = (claim: ClaimWithCitations) => {
    const relationName = claim.relationshipType
      ? (t.relationTypes as Record<string, string>)[claim.relationshipType] ?? claim.relationshipType
      : null;
    // Same shape as the graph's link tooltip (src/components/graph/GraphCanvas.tsx):
    // naming both ends is what makes the direction readable in either script.
    if (relationName) {
      const other = claim.relatedSubjectName ?? claim.relatedSubjectSlug ?? '';
      return [subjectName ?? claim.subjectSlug, '-', relationName, '->', other].join(' ');
    }
    return claim.field ? fieldLabel[claim.field]?.[language === 'ar' ? 'ar' : 'en'] ?? claim.field : '';
  };

  const pageCount = Math.max(1, Math.ceil(claims.length / pageSize));

  // A shorter list can leave the reader on a page that no longer exists, for
  // instance when the profile's claims arrive after an empty first render.
  useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);

  if (claims.length === 0) return null;

  const first = (page - 1) * pageSize;
  const shown = claims.slice(first, first + pageSize);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-4">
      <h2 className="text-3xl mb-4 text-gray-900 dark:text-gray-200">{title}</h2>
      <ul className="space-y-4">
        {shown.map((claim) => (
            <li key={claim.id} className="border-s-4 border-amber-500 ps-3 text-gray-800 dark:text-gray-200">
              <h3 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">{supportLabel(claim)}</h3>
              {/* A relationship heading already states the claim; repeating the
                  assertion under it says the same thing twice. */}
              {!claim.relationshipType && <p>{claim.assertion}</p>}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge size="sm" color="gray" text={reviewStatusLabel[claim.reviewStatus][language === 'ar' ? 'ar' : 'en']} />
                {claim.disputed && (
                  <Badge size="sm" color="amber" text={language === 'ar' ? 'روايات متعارضة' : 'Accounts conflict'} />
                )}
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
                        <span className="mt-1 flex flex-wrap items-baseline gap-x-2 text-xs text-gray-600 dark:text-gray-400">
                          {citation.passage?.page && subjectSlug ? (
                            <Link
                              className="underline"
                              href={`/people/${subjectSlug}?book=${citation.passage.page.accountId}&page=${citation.passage.page.sequence}`}
                            >
                              {citationText(citation, language)}
                            </Link>
                          ) : (
                            <span>{citationText(citation, language)}</span>
                          )}
                          <a className="underline" href={citation.extractionUrl} target="_blank" rel="noreferrer">
                            {citation.source.digitalHost ?? (language === 'ar' ? 'المصدر الرقمي' : 'Digital host')}
                          </a>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
        ))}
      </ul>

      <Pagination page={page} pageCount={pageCount} onChange={setPage} showSelect />
    </section>
  );
}
