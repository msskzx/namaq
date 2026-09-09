// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import ClaimEvidence from './ClaimEvidence';
import type { ClaimWithCitations } from '@/types/provenance';

const { language } = vi.hoisted(() => ({ language: { current: 'en' } }));
vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: language.current }),
}));

function claim(overrides: Partial<ClaimWithCitations> = {}) {
  return {
    id: 'claim-1',
    assertion: 'عامر بن عبد الله بن الجراح',
    confidence: 'ESTABLISHED',
    reviewStatus: 'NOT_REVIEWED',
    relationshipType: null,
    relatedSubjectSlug: null,
    subjectSlug: 'abu-ubaydah-ibn-al-jarrah',
    citations: [
      {
        id: 'citation-1',
        volume: '1',
        pageReference: '5',
        extractionUrl: 'https://shamela.ws/book/10906/1431',
        excerptArabic: 'أَبُو عُبَيْدَةَ بنُ الجَرَّاحِ',
        source: {
          author: 'شمس الدين الذهبي',
          title: 'سير أعلام النبلاء',
          edition: 'الطبعة الثالثة',
          publisher: 'مؤسسة الرسالة',
          publicationYear: '1405/1985',
        },
      },
    ],
    ...overrides,
  } as unknown as ClaimWithCitations;
}

afterEach(() => {
  cleanup();
  language.current = 'en';
});

describe('ClaimEvidence', () => {
  it('shows a claim with its citation and excerpt', () => {
    render(<ClaimEvidence title="Sources" claims={[claim()]} />);

    expect(screen.getByText('عامر بن عبد الله بن الجراح')).toBeTruthy();
    expect(screen.getByText(/سير أعلام النبلاء/)).toBeTruthy();
    expect(screen.getByText('أَبُو عُبَيْدَةَ بنُ الجَرَّاحِ')).toBeTruthy();
  });

  it.each([
    ['NOT_REVIEWED', 'Not reviewed'],
    ['IN_REVIEW', 'In review'],
    ['REVIEWED', 'Reviewed'],
  ])('shows %s rather than hiding the claim', (reviewStatus, label) => {
    render(<ClaimEvidence title="Sources" claims={[claim({ reviewStatus } as Partial<ClaimWithCitations>)]} />);

    expect(screen.getByText(label)).toBeTruthy();
    expect(screen.getByText('عامر بن عبد الله بن الجراح')).toBeTruthy();
  });

  it('translates review status and confidence into Arabic', () => {
    language.current = 'ar';

    render(<ClaimEvidence title="المصادر" claims={[claim()]} />);

    expect(screen.getByText('لم تُراجع')).toBeTruthy();
    expect(screen.getByText('ثابت')).toBeTruthy();
  });

  it('says so for a claim with no citation rather than showing nothing', () => {
    render(<ClaimEvidence title="Sources" claims={[claim({ citations: [] })]} />);

    expect(screen.getByText('References not yet added')).toBeTruthy();
  });

  it('renders nothing when there are no claims', () => {
    const { container } = render(<ClaimEvidence title="Sources" claims={[]} />);

    expect(container.querySelector('section')).toBeNull();
  });

  it('names both ends of a relationship claim', () => {
    render(
      <ClaimEvidence
        title="Relationship evidence"
        relationshipClaims
        claims={[
          claim({
            relationshipType: 'COMPANION_OF',
            relatedSubjectSlug: 'prophet-muhammad',
          } as Partial<ClaimWithCitations>),
        ]}
      />,
    );

    expect(screen.getByText(/abu-ubaydah-ibn-al-jarrah/)).toBeTruthy();
    expect(screen.getByText(/prophet-muhammad/)).toBeTruthy();
    expect(screen.getByText(/companion of/)).toBeTruthy();
  });

  it('links a citation to the page it was read from', () => {
    render(<ClaimEvidence title="Sources" claims={[claim()]} />);

    const link = screen.getByText(/سير أعلام النبلاء/).closest('a');
    expect(link?.getAttribute('href')).toBe('https://shamela.ws/book/10906/1431');
  });
});
