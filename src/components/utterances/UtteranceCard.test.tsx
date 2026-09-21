// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import UtteranceCard from './UtteranceCard';
import UtteranceGroup from './UtteranceGroup';
import type { Utterance } from '@/types/utterance';

const { language } = vi.hoisted(() => ({ language: { current: 'en' } }));
vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: language.current }),
}));

afterEach(() => {
  cleanup();
  language.current = 'en';
});

function utterance(over: Partial<Utterance> = {}): Utterance {
  return {
    id: 'u-1',
    slug: 'abu-talib-lamiyyah',
    kind: 'POETRY',
    textArabic: 'ولما رأيت القوم لا ود فيهم\nوقد صارحونا بالعداوة والأذى',
    speaker: { id: 'p-1', slug: 'abu-talib', name: 'أبو طالب', nameTransliterated: 'Abu Talib' },
    speakerName: null,
    subject: null,
    grading: null,
    occasion: null,
    event: null,
    battle: null,
    ...over,
  };
}

describe('UtteranceCard', () => {
  // Verse is printed line by line, because a poem run together is not a poem.
  it('keeps each line of verse on its own row', () => {
    render(<UtteranceCard utterance={utterance()} />);

    expect(screen.getByText('ولما رأيت القوم لا ود فيهم')).toBeTruthy();
    expect(screen.getByText('وقد صارحونا بالعداوة والأذى')).toBeTruthy();
  });

  it('does not split a saying into lines', () => {
    render(<UtteranceCard utterance={utterance({ kind: 'SAYING', textArabic: 'غفار غفر الله لها' })} />);

    expect(screen.getByText('غفار غفر الله لها')).toBeTruthy();
  });

  // A speaker the app holds is a link; one it does not is text, which is the
  // whole point of speakerName -- a poet named once does not become a node.
  it('links a speaker it has a subject for and leaves a named one as text', () => {
    const { container } = render(<UtteranceCard utterance={utterance()} />);
    expect(container.querySelector('a[href="/people/abu-talib"]')).toBeTruthy();

    cleanup();
    const named = render(
      <UtteranceCard utterance={utterance({ speaker: null, speakerName: 'معبد الخزاعي' })} />,
    );
    expect(screen.getByText('معبد الخزاعي')).toBeTruthy();
    expect(named.container.querySelector('a[href^="/people/"]')).toBeNull();
  });

  // The grading is the source's verdict, so it must never appear bare: without
  // the attribution it reads as the app grading the report.
  it('attributes a grading to the source', () => {
    render(<UtteranceCard utterance={utterance({ grading: 'إسناده حسن' })} />);

    expect(screen.getByText(/The source says/)).toBeTruthy();
    expect(screen.getByText('إسناده حسن')).toBeTruthy();
  });

  it('links the occasion it was said at when the source ties it to one', () => {
    const { container } = render(
      <UtteranceCard
        utterance={utterance({ battle: { slug: 'uhud', name: 'غزوة أحد', nameTransliterated: 'Battle of Uhud' } })}
      />,
    );

    expect(container.querySelector('a[href="/battles/uhud"]')).toBeTruthy();
    expect(screen.getByText('Battle of Uhud')).toBeTruthy();
  });
});

describe('UtteranceGroup', () => {
  it('renders nothing when there is nothing to show', () => {
    const { container } = render(<UtteranceGroup utterances={[]} variant="said" />);
    expect(container.firstChild).toBeNull();
  });

  // Arabic has no neutral pronoun, so the heading has to take the sex the
  // catalog cites rather than default to the masculine.
  it('takes the Arabic heading from the sex the catalog records', () => {
    language.current = 'ar';
    render(<UtteranceGroup utterances={[utterance()]} variant="said" sex="FEMALE" />);
    expect(screen.getByText('ما رُوي عنها من شعر وقول')).toBeTruthy();

    cleanup();
    render(<UtteranceGroup utterances={[utterance()]} variant="said" sex="MALE" />);
    expect(screen.getByText('ما رُوي عنه من شعر وقول')).toBeTruthy();
  });

  // An unset sex must not become a claim about the person: the masculine is
  // the fallback the language forces, not something the catalog said.
  it('falls back to the masculine when no sex is recorded', () => {
    language.current = 'ar';
    render(<UtteranceGroup utterances={[utterance()]} variant="about" sex={null} />);
    expect(screen.getByText('ما قيل فيه')).toBeTruthy();
  });

  it('needs no sex in English', () => {
    render(<UtteranceGroup utterances={[utterance()]} variant="about" />);
    expect(screen.getByText('Said about them')).toBeTruthy();
  });

  // Uses the app's own Pagination component (src/components/common/Pagination.tsx)
  // rather than a bespoke control, same as ClaimEvidence and SourceAccountReader.
  it('pages forward and back through the utterances', () => {
    const many = Array.from({ length: 12 }, (_, index) =>
      utterance({ id: `u-${index}`, textArabic: `قول رقم ${index}` }),
    );

    render(<UtteranceGroup utterances={many} variant="said" pageSize={5} />);

    expect(screen.getByText('قول رقم 0')).toBeTruthy();
    expect(screen.queryByText('قول رقم 5')).toBeNull();

    fireEvent.click(screen.getByText('Next'));

    expect(screen.getByText('قول رقم 5')).toBeTruthy();
    expect(screen.queryByText('قول رقم 0')).toBeNull();

    fireEvent.click(screen.getByText('Previous'));

    expect(screen.getByText('قول رقم 0')).toBeTruthy();
  });

  it('offers no pagination when everything fits on one page', () => {
    render(<UtteranceGroup utterances={[utterance()]} variant="said" />);

    expect(screen.queryByText('Next')).toBeNull();
  });
});
