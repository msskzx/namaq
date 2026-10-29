import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';

const nav = vi.hoisted(() => {
  let url = '/quizzes';
  const listeners = new Set<() => void>();
  return {
    getUrl: () => url,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    push: (next: string) => {
      url = next;
      listeners.forEach((listener) => listener());
    },
    reset: (next: string) => {
      url = next;
    },
  };
});

vi.mock('next/navigation', async () => {
  const ReactActual = await vi.importActual<typeof import('react')>('react');
  return {
    useRouter: () => ({ push: nav.push }),
    usePathname: () => '/quizzes',
    useSearchParams: () => {
      const search = ReactActual.useSyncExternalStore(
        nav.subscribe,
        () => nav.getUrl().split('?')[1] ?? '',
        () => nav.getUrl().split('?')[1] ?? '',
      );
      return ReactActual.useMemo(() => new URLSearchParams(search), [search]);
    },
  };
});

const reference = {
  excerptArabic: 'نص الشاهد',
  sourceTitle: 'سير أعلام النبلاء',
  pageReference: '5',
  readerUrl: '/people/zaynab-bint-jahsh?book=account-1&page=3&passage=5-p3',
};

const questions = Array.from({ length: 5 }, (_, index) => ({
  key: `question-${index + 1}`,
  family: 'KUNYA',
  promptArabic: `السؤال العربي ${index + 1}؟`,
  choices: [
    { value: 'right', labelArabic: 'الصحيح' },
    { value: 'one', labelArabic: 'الأول' },
    { value: 'two', labelArabic: 'الثاني' },
    { value: 'three', labelArabic: 'الثالث' },
  ],
  correctAnswer: 'right',
  choiceDetails: {},
  evidence: { reference: null as typeof reference | null },
}));

const branchQuestion = {
  ...questions[0],
  family: 'AYAH_BRANCH',
  promptArabic: 'أكمل جميع عقد الشجرة',
  choices: [],
  correctAnswer: 'يوم يبعثهم الله جميعا',
  phrase: 'يوم يبعثهم الله جميعا',
  branches: [
    { words: ['فَيُنَبِّئُهُمْ'], ayat: [{ key: '58:6', page: 542, words: ['فَيُنَبِّئُهُمْ', 'بِمَا', 'عَمِلُوا'] }] },
    { words: ['فَيَحْلِفُونَ', 'لَهُ'], ayat: [{ key: '58:18', page: 544, words: ['فَيَحْلِفُونَ', 'لَهُ'] }] },
  ],
  tree: {
    words: ['يَوْمَ', 'يَبْعَثُهُمُ', 'اللَّهُ', 'جَمِيعًا'],
    ayat: [],
    children: [
      {
        words: ['فَيُنَبِّئُهُمْ'],
        ayat: [],
        children: [
          { words: ['بِمَا', 'عَمِلُوا'], ayat: ['58:6'], children: [] },
          { words: ['عَلَى', 'كُلِّ', 'شَيْءٍ', 'شَهِيدٌ'], ayat: ['58:7'], children: [] },
        ],
      },
      { words: ['فَيَحْلِفُونَ', 'لَهُ'], ayat: ['58:18'], children: [] },
    ],
  },
} as typeof questions[number] & { asked?: number[] };

const availabilityKeys: string[] = [];
let availableSupply = 5;

vi.mock('swr', () => ({
  default: (key: string | null) => {
    if (key?.startsWith('/api/quiz/availability')) availabilityKeys.push(key);
    if (key?.startsWith('/api/quiz/availability')) {
      const available = nav.getUrl().includes('topic=AYAT') ? 2 : availableSupply;
      return { data: { available, lengths: [5, 10, 15].filter((length) => length <= available) }, error: null, isLoading: false };
    }
    if (key?.startsWith('/api/quiz?')) return { data: { questions, surahNames: { 52: 'الطور' } }, error: null, isLoading: false };
    return { data: undefined, error: null, isLoading: false };
  },
}));

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'en' }) }));

import QuizzesPage from './page';

beforeEach(() => {
  nav.reset('/quizzes');
  availableSupply = 5;
  availabilityKeys.length = 0;
});

afterEach(() => {
  cleanup();
});

describe('QuizzesPage', () => {
  it('keeps a typed juz range when Start is clicked before navigation completes', () => {
    nav.reset('/quizzes?topic=BRANCHES');
    const pushes: string[] = [];
    const pending = vi.spyOn(nav, 'push').mockImplementation((url) => { pushes.push(url); });
    render(<QuizzesPage />);
    const from = screen.getByRole('spinbutton', { name: "From juz'" });
    fireEvent.change(from, { target: { value: '25' } });
    fireEvent.blur(from);
    fireEvent.click(screen.getByRole('button', { name: 'Start quiz' }));
    const final = new URLSearchParams(pushes.at(-1)?.split('?')[1]);
    expect(final.get('juzFrom')).toBe('25');
    expect(final.get('length')).toBe('5');
    expect(final.get('topic')).toBe('BRANCHES');
    pending.mockRestore();
  });

  it('renders reviewed Arabic content and only shows Submit on the final question', () => {
    nav.reset('/quizzes?topic=PEOPLE&length=5');
    render(<QuizzesPage />);

    expect(screen.getByText('السؤال العربي 1؟')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Submit' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Question 5 - unanswered' }));
    expect(screen.getByText('السؤال العربي 5؟')).toBeTruthy();
    expect(screen.getAllByRole('button', { name: 'Submit' })).toHaveLength(1);
    expect(screen.queryByRole('button', { name: 'Next' })).toBeNull();
  });

  it('allows unanswered submission and reports it as incorrect', () => {
    nav.reset('/quizzes?topic=PEOPLE&length=5');
    render(<QuizzesPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Question 5 - unanswered' }));
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByText('Score: 0 / 5 (0%)')).toBeTruthy();
    expect(screen.getByText('Not passed')).toBeTruthy();
    expect(screen.getAllByText('No answer')).toHaveLength(5);
  });

  it('shows the exact small supply and offers no impossible length', () => {
    nav.reset('/quizzes?topic=AYAT');
    render(<QuizzesPage />);

    expect(screen.getByText('2 questions available')).toBeTruthy();
    expect(screen.getByText('Fewer than five approved questions are available.')).toBeTruthy();
    expect(screen.queryByRole('button', { name: '5' })).toBeNull();
  });

  it('toggles a unique multi-topic selection', () => {
    nav.reset('/quizzes?topic=PEOPLE,BATTLES,RELATIONSHIPS,BATTLES');
    render(<QuizzesPage />);

    for (const name of ['People', 'Battles', 'Relationships']) {
      expect(screen.getByRole('button', { name }).getAttribute('aria-pressed')).toBe('true');
    }
    fireEvent.click(screen.getByRole('button', { name: 'Battles' }));
    expect(new URLSearchParams(nav.getUrl().split('?')[1]).get('topic')).toBe('PEOPLE,RELATIONSHIPS');
  });

  it('renders Quran text supplied for an ayah choice', () => {
    const original = questions[0];
    questions[0] = {
      ...original,
      family: 'AYAH_LINK',
      choiceDetails: { right: { text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ', reference: 'البقرة 2:255' } },
    };
    try {
      nav.reset('/quizzes?topic=PEOPLE&length=5');
      render(<QuizzesPage />);
      expect(screen.getByText('اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ')).toBeTruthy();
      expect(screen.getByText('البقرة 2:255')).toBeTruthy();
    } finally {
      questions[0] = original;
    }
  });

  it('locks the first answer and shows immediate correct feedback with its source', () => {
    const original = questions[0];
    questions[0] = { ...original, evidence: { reference } };
    try {
      nav.reset('/quizzes?topic=PEOPLE&length=5');
      render(<QuizzesPage />);

      expect(screen.queryByRole('button', { name: 'Source' })).toBeNull();
      fireEvent.click(screen.getByRole('button', { name: 'الصحيح' }));
      expect(screen.getByText('Correct')).toBeTruthy();
      expect(screen.getByRole('button', { name: 'Source' })).toBeTruthy();

      fireEvent.click(screen.getByRole('button', { name: 'الأول' }));
      expect(screen.queryByText('Incorrect')).toBeNull();
      expect(screen.getByRole('button', { name: 'Question 1 - correct' })).toBeTruthy();
    } finally {
      questions[0] = original;
    }
  });

  it('marks a wrong answer incorrect, reveals the correct one and keeps feedback across navigation', () => {
    nav.reset('/quizzes?topic=PEOPLE&length=5');
    render(<QuizzesPage />);

    fireEvent.click(screen.getByRole('button', { name: 'الأول' }));
    expect(screen.getByText('Incorrect')).toBeTruthy();
    expect(screen.getByText('Correct')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Question 1 - incorrect' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.click(screen.getByRole('button', { name: 'Question 1 - incorrect' }));
    expect(screen.getByText('Incorrect')).toBeTruthy();
    expect(screen.getByText('Correct')).toBeTruthy();
  });

  it('opens the quiz reference overlay from a locked question', () => {
    const original = questions[0];
    questions[0] = { ...original, evidence: { reference } };
    try {
      nav.reset('/quizzes?topic=PEOPLE&length=5');
      render(<QuizzesPage />);

      fireEvent.click(screen.getByRole('button', { name: 'الصحيح' }));
      fireEvent.click(screen.getByRole('button', { name: 'Source' }));
      expect(screen.getByRole('dialog')).toBeTruthy();
      expect(screen.getByText('نص الشاهد')).toBeTruthy();
    } finally {
      questions[0] = original;
    }
  });

  it('reports a rounded percentage with a pass state at the inclusive threshold', () => {
    nav.reset('/quizzes?topic=PEOPLE&length=5');
    render(<QuizzesPage />);

    for (const name of ['Question 1 - unanswered', 'Question 2 - unanswered', 'Question 3 - unanswered']) {
      fireEvent.click(screen.getByRole('button', { name }));
      fireEvent.click(screen.getByRole('button', { name: 'الصحيح' }));
    }
    fireEvent.click(screen.getByRole('button', { name: 'Question 5 - unanswered' }));
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByText('Score: 3 / 5 (60%)')).toBeTruthy();
    expect(screen.getByText('Passed')).toBeTruthy();
  });

  it('marks a partial tree answer wrong and reveals the intermediate split and every leaf', () => {
    const original = questions[0];
    questions[0] = branchQuestion;
    try {
      nav.reset('/quizzes?topic=BRANCHES&length=5');
      render(<QuizzesPage />);

      expect(screen.getAllByRole('textbox')).toHaveLength(4);
      fireEvent.change(screen.getByLabelText('Node 1'), { target: { value: 'فينبئهم' } });
      fireEvent.change(screen.getByLabelText('Node 4'), { target: { value: 'فيحلفون له' } });
      fireEvent.click(screen.getByRole('button', { name: 'Check' }));

      expect(screen.getByRole('button', { name: 'Question 1 - incorrect' })).toBeTruthy();
      for (const words of ['فَيُنَبِّئُهُمْ', 'بِمَا عَمِلُوا', 'عَلَى كُلِّ شَيْءٍ شَهِيدٌ', 'فَيَحْلِفُونَ لَهُ']) {
        expect(document.body.textContent).toContain(words);
      }
      fireEvent.click(screen.getByRole('button', { name: 'Question 5 - unanswered' }));
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
      expect(screen.getByText('Score: 2 / 8 (25%)')).toBeTruthy();
    } finally {
      questions[0] = original;
    }
  });

  it('accepts every tree node with ordinary Arabic typing and keeps feedback and scoring across navigation', () => {
    const original = questions[0];
    questions[0] = branchQuestion;
    try {
      nav.reset('/quizzes?topic=BRANCHES&length=5');
      render(<QuizzesPage />);
      for (const [index, value] of ['فينبئهم', 'بما عملوا', 'على كل شي شهيد', 'فيحلفون له'].entries()) {
        fireEvent.change(screen.getByLabelText(`Node ${index + 1}`), { target: { value } });
      }
      fireEvent.click(screen.getByRole('button', { name: 'Check' }));
      expect(screen.getByRole('button', { name: 'Question 1 - correct' })).toBeTruthy();
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      fireEvent.click(screen.getByRole('button', { name: 'Question 1 - correct' }));
      expect(screen.queryByRole('textbox')).toBeNull();
      for (const words of ['فَيُنَبِّئُهُمْ', 'بِمَا عَمِلُوا', 'عَلَى كُلِّ شَيْءٍ شَهِيدٌ', 'فَيَحْلِفُونَ لَهُ']) {
        expect(document.body.textContent).toContain(words);
      }
      fireEvent.click(screen.getByRole('button', { name: 'Question 5 - unanswered' }));
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
      expect(screen.getByText('Score: 4 / 8 (50%)')).toBeTruthy();
      expect(screen.getByText('4 of 4 leaves')).toBeTruthy();
    } finally {
      questions[0] = original;
    }
  });

  it('commits a typed juz range on blur and preserves the other URL options', () => {
    nav.reset('/quizzes?topic=BRANCHES&juzFrom=1&juzTo=30&view=tree');
    render(<QuizzesPage />);

    const from = screen.getByRole('spinbutton', { name: "From juz'" });
    const to = screen.getByRole('spinbutton', { name: "To juz'" });
    expect((from as HTMLInputElement).value).toBe('1');
    expect((to as HTMLInputElement).value).toBe('30');
    fireEvent.change(from, { target: { value: '25' } });
    expect(new URLSearchParams(nav.getUrl().split('?')[1]).get('juzFrom')).toBe('1');
    fireEvent.blur(from);
    const params = new URLSearchParams(nav.getUrl().split('?')[1]);
    expect(params.get('juzFrom')).toBe('25');
    expect(params.get('juzTo')).toBe('30');
    expect(params.get('topic')).toBe('BRANCHES');
    expect(params.get('view')).toBe('tree');
    expect(params.has('length')).toBe(false);
    expect(availabilityKeys.at(-1)).toBe('/api/quiz/availability?topic=BRANCHES&juzFrom=25&juzTo=30');
  });

  it('keeps the juz range beside a person circle and never lets from pass to', () => {
    nav.reset('/quizzes?topic=BRANCHES,PERSON_CIRCLE&person=abu-ubaydah&juzFrom=20&juzTo=25');
    render(<QuizzesPage />);
    const from = screen.getByRole('spinbutton', { name: "From juz'" });
    fireEvent.change(from, { target: { value: '28' } });
    fireEvent.blur(from);
    const params = new URLSearchParams(nav.getUrl().split('?')[1]);
    expect(params.get('juzFrom')).toBe('28');
    expect(params.get('juzTo')).toBe('28');
  });

  it('offers one to six answers per tree, defaulting to three, and sends the choice with the quiz', () => {
    nav.reset('/quizzes?topic=BRANCHES');
    render(<QuizzesPage />);
    const group = screen.getByRole('group', { name: 'Answers per tree' });
    expect(within(group).getAllByRole('button').map((button) => button.textContent)).toEqual(['1', '2', '3', '4', '5', '6']);
    expect(within(group).getByRole('button', { name: '3' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getAllByText('You type this')).toHaveLength(3);
    fireEvent.click(within(group).getByRole('button', { name: '5' }));
    expect(new URLSearchParams(nav.getUrl().split('?')[1]).get('leaves')).toBe('5');
    expect(screen.getAllByText('You type this')).toHaveLength(5);
  });

  it('keeps the setup example free of ayah controls while retaining tree zoom', () => {
    nav.reset('/quizzes?topic=BRANCHES');
    render(<QuizzesPage />);
    const tree = screen.getByRole('region', { name: 'Example tree' });
    expect(within(tree).getByRole('toolbar', { name: 'Tree zoom' })).toBeTruthy();
    expect(within(tree).queryByRole('button', { name: /View ayat in context/ })).toBeNull();
    expect(within(tree).queryAllByRole('link')).toHaveLength(0);
    expect(tree.querySelector('[data-differing]')).toBeTruthy();
  });

  it('types only the asked leaves and gives the rest of the tree', () => {
    const original = questions[0];
    questions[0] = { ...branchQuestion, asked: [3] } as typeof questions[number];
    try {
      nav.reset('/quizzes?topic=BRANCHES&length=5');
      render(<QuizzesPage />);
      expect(screen.getAllByRole('textbox')).toHaveLength(1);
      expect(screen.getByText('فَيُنَبِّئُهُمْ')).toBeTruthy();
      fireEvent.change(screen.getByLabelText('Node 4'), { target: { value: 'فيحلفون له' } });
      fireEvent.click(screen.getByRole('button', { name: 'Check' }));
      expect(screen.getByRole('button', { name: 'Question 1 - correct' })).toBeTruthy();
    } finally {
      questions[0] = original;
    }
  });

  it('selects an available question count and starts only after the explicit action', () => {
    availableSupply = 15;
    nav.reset('/quizzes?topic=BRANCHES&juzFrom=25&view=tree');
    render(<QuizzesPage />);

    const count = screen.getByRole('spinbutton', { name: 'Question count' });
    expect((count as HTMLInputElement).value).toBe('5');
    expect(screen.queryByRole('button', { name: 'Increase Question count' })).toBeNull();
    fireEvent.keyDown(count, { key: 'ArrowUp' });
    expect((count as HTMLInputElement).value).toBe('10');
    fireEvent.keyDown(count, { key: 'ArrowUp' });
    expect((count as HTMLInputElement).value).toBe('15');
    fireEvent.keyDown(count, { key: 'ArrowUp' });
    expect((count as HTMLInputElement).value).toBe('15');
    expect(new URLSearchParams(nav.getUrl().split('?')[1]).has('length')).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: 'Start quiz' }));
    const params = new URLSearchParams(nav.getUrl().split('?')[1]);
    expect(params.get('length')).toBe('15');
    expect(params.get('juzFrom')).toBe('25');
    expect(params.get('view')).toBe('tree');
    expect(screen.getByText('السؤال العربي 1؟')).toBeTruthy();
  });
});
