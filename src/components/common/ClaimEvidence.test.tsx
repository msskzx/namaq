// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
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

  it('translates review status into Arabic', () => {
    language.current = 'ar';

    render(<ClaimEvidence title="المصادر" claims={[claim()]} />);

    expect(screen.getByText('لم تُراجع')).toBeTruthy();
  });

  it('keeps confidence out of the page, since the source never states it', () => {
    render(<ClaimEvidence title="Sources" claims={[claim()]} />);

    expect(screen.queryByText('Well attested')).toBeNull();
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
        subjectName="أبو عبيدة"
        claims={[
          claim({
            relationshipType: 'COMPANION_OF',
            relatedSubjectSlug: 'prophet-muhammad',
          } as Partial<ClaimWithCitations>),
        ]}
      />,
    );

    // Same shape as the graph's link tooltip: naming both ends is what makes
    // the direction readable in either script.
    expect(screen.getByText('Supports: أبو عبيدة - Companion Of -> prophet-muhammad')).toBeTruthy();
  });

  it('shows one page of claims at a time, with a jump to any of them', () => {
    const many = Array.from({ length: 25 }, (_, index) =>
      claim({ id: `claim-${index}`, assertion: `دعوى ${index}` } as Partial<ClaimWithCitations>),
    );

    const { container } = render(<ClaimEvidence title="Sources" claims={many} />);

    expect(screen.getByText('دعوى 0')).toBeTruthy();
    expect(screen.queryByText('دعوى 5')).toBeNull();
    // The same control the source reader uses: previous, a page selector, next.
    expect(container.querySelectorAll('select option')).toHaveLength(5);
  });

  it('pages forward and back through the claims', () => {
    const many = Array.from({ length: 25 }, (_, index) =>
      claim({ id: `claim-${index}`, assertion: `دعوى ${index}` } as Partial<ClaimWithCitations>),
    );

    render(<ClaimEvidence title="Sources" claims={many} />);
    fireEvent.click(screen.getByText('Next'));

    expect(screen.getByText('دعوى 5')).toBeTruthy();
    expect(screen.queryByText('دعوى 0')).toBeNull();

    fireEvent.click(screen.getByText('Previous'));

    expect(screen.getByText('دعوى 0')).toBeTruthy();
  });

  it('stops at both ends', () => {
    const many = Array.from({ length: 7 }, (_, index) =>
      claim({ id: `claim-${index}`, assertion: `دعوى ${index}` } as Partial<ClaimWithCitations>),
    );

    render(<ClaimEvidence title="Sources" claims={many} />);

    expect(screen.getByText('Previous').closest('button')?.hasAttribute('disabled')).toBe(true);

    fireEvent.click(screen.getByText('Next'));

    expect(screen.getByText('دعوى 6')).toBeTruthy();
    expect(screen.getByText('Next').closest('button')?.hasAttribute('disabled')).toBe(true);
  });

  it('offers no pagination when everything fits on one page', () => {
    render(<ClaimEvidence title="Sources" claims={[claim()]} />);

    expect(screen.queryByText('Next')).toBeNull();
  });

  it('names the related person rather than their slug when the route resolved it', () => {
    render(
      <ClaimEvidence
        title="Sources"
        claims={[
          claim({
            relationshipType: 'COMPANION_OF',
            relatedSubjectSlug: 'prophet-muhammad',
            relatedSubjectName: 'محمد بن عبد الله',
          } as Partial<ClaimWithCitations>),
        ]}
      />,
    );

    expect(screen.getByText(/محمد بن عبد الله/)).toBeTruthy();
  });

  it('says which profile field a claim supports', () => {
    render(<ClaimEvidence title="Sources" claims={[claim({ field: 'deathYearHijri' } as Partial<ClaimWithCitations>)]} />);

    expect(screen.getByText('Supports: Year of death')).toBeTruthy();
  });

  // A claim backing nothing cannot reach the interface: validateBatch rejects it
  // (src/lib/history/batchSchema.ts).
  it('says nothing about support for a legacy row that names no field', () => {
    render(<ClaimEvidence title="Sources" claims={[claim({ field: null } as Partial<ClaimWithCitations>)]} />);

    expect(screen.queryByText(/^Supports:/)).toBeNull();
  });

  it('links a citation to the page it was read from', () => {
    render(<ClaimEvidence title="Sources" claims={[claim()]} />);

    const link = screen.getByText(/سير أعلام النبلاء/).closest('a');
    expect(link?.getAttribute('href')).toBe('https://shamela.ws/book/10906/1431');
  });
});
