// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SWRConfig } from 'swr';
import SubjectEvidenceAccess from './SubjectEvidenceAccess';

vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: 'en' }),
}));

const { fetchJson } = vi.hoisted(() => ({ fetchJson: vi.fn() }));
vi.mock('@/lib/swr', () => ({ fetcher: (url: string) => fetchJson(url) }));

function claim(overrides: Record<string, unknown> = {}) {
  return {
    id: 'claim-1',
    field: 'fullName',
    assertion: 'عامر بن عبد الله بن الجراح',
    reviewStatus: 'NOT_REVIEWED',
    citations: [
      {
        id: 'citation-1',
        pageReference: '5',
        extractionUrl: 'https://shamela.ws/book/10906/1431',
        source: { title: 'سير أعلام النبلاء' },
      },
    ],
    ...overrides,
  };
}

function renderAccess(props: Partial<React.ComponentProps<typeof SubjectEvidenceAccess>> = {}) {
  return render(
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      <SubjectEvidenceAccess
        kind="person"
        slug="abu-ubaydah-ibn-al-jarrah"
        hasProfile
        profileHref="/people/abu-ubaydah-ibn-al-jarrah"
        evidenceCount={25}
        {...props}
      />
    </SWRConfig>,
  );
}

describe('SubjectEvidenceAccess', () => {
  beforeEach(() => {
    fetchJson.mockReset();
    fetchJson.mockResolvedValue({ claims: [claim()] });
  });

  afterEach(cleanup);

  it('sends a profile-backed subject to its profile instead of listing citations', () => {
    renderAccess();

    const link = screen.getByText('References on the profile').closest('a');
    expect(link?.getAttribute('href')).toBe('/people/abu-ubaydah-ibn-al-jarrah');
    expect(screen.queryByText('سير أعلام النبلاء')).toBeNull();
  });

  it('does not fetch references for a profile-backed subject', () => {
    renderAccess();

    expect(fetchJson).not.toHaveBeenCalled();
  });

  it('says so when a profile-backed subject has no evidence', () => {
    renderAccess({ evidenceCount: 0 });

    expect(screen.getByText('References not yet added')).toBeTruthy();
  });

  it('lists compact references for a subject with no profile', async () => {
    renderAccess({ hasProfile: false });

    fireEvent.click(await screen.findByText('References'));

    expect(await screen.findByText('عامر بن عبد الله بن الجراح')).toBeTruthy();
    expect(screen.getByText('Not reviewed')).toBeTruthy();
  });

  it('keeps the compact list collapsed until asked', async () => {
    renderAccess({ hasProfile: false });

    await screen.findByText('References');

    expect(screen.queryByText('عامر بن عبد الله بن الجراح')).toBeNull();
  });

  it('shows the review status of each claim it lists', async () => {
    fetchJson.mockResolvedValue({
      claims: [claim({ id: 'a', reviewStatus: 'REVIEWED' }), claim({ id: 'b', field: 'titles', reviewStatus: 'IN_REVIEW' })],
    });
    renderAccess({ hasProfile: false });

    fireEvent.click(await screen.findByText('References'));

    expect(await screen.findByText('Reviewed')).toBeTruthy();
    expect(screen.getByText('In review')).toBeTruthy();
  });

  it('keeps the pane to identity claims, not the whole record', async () => {
    fetchJson.mockResolvedValue({
      claims: [claim({ id: 'a' }), claim({ id: 'b', field: 'appearance', assertion: 'كان نحيفاً' })],
    });
    renderAccess({ hasProfile: false });

    fireEvent.click(await screen.findByText('References'));

    await screen.findByText('عامر بن عبد الله بن الجراح');
    expect(screen.queryByText('كان نحيفاً')).toBeNull();
  });

  it('says so when a subject with no profile has no evidence', async () => {
    fetchJson.mockResolvedValue({ claims: [] });

    renderAccess({ hasProfile: false });

    expect(await screen.findByText('References not yet added')).toBeTruthy();
  });

  it('asks for the subject kind it was given', async () => {
    renderAccess({ hasProfile: false, kind: 'battle', slug: 'yarmuk' });

    await waitFor(() =>
      expect(fetchJson).toHaveBeenCalledWith('/api/subjects/battle/yarmuk/references'),
    );
  });
});
