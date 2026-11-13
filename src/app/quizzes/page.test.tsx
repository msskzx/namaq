vi.mock('@/components/common/MushafText', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';

const nav = vi.hoisted(() => {
  let url = '/quizzes';
  const listeners = new Set<() => void>();
  return {
    getUrl: () => url,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    push: vi.fn<(next: string, options?: { scroll?: boolean }) => void>((next) => {
      url = next;
      listeners.forEach((listener) => listener());
    }),
    reset: (next: string) => {
      url = next;
    },
  };
});

vi.mock('next/navigation', async () => {
  const ReactActual = await vi.importActual<typeof import('react')>('react');
  return {
    useRouter: () => ({ push: nav.push, replace: nav.push }),
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
  localStorage.clear();
});

describe('QuizzesPage', () => {
  it('reveals a tree without awarding points for unfinished text, then starts over', () => {
    const original = questions[0];
    questions[0] = branchQuestion;
    try {
      nav.reset('/quizzes?topic=BRANCHES&length=5');
      render(<QuizzesPage />);
      fireEvent.change(screen.getByLabelText('Node 1'), { target: { value: 'فينبئهم' } });
      fireEvent.click(screen.getByRole('button', { name: 'Show answer' }));
      expect(screen.getByRole('button', { name: 'Question 1 - incorrect' })).toBeTruthy();
      expect(screen.queryByRole('textbox')).toBeNull();
      fireEvent.click(screen.getByRole('button', { name: 'Start over' }));
      expect(screen.getByLabelText('Node 1')).toHaveProperty('value', '');
      expect(screen.getByRole('button', { name: 'Question 1 - unanswered' })).toBeTruthy();
      fireEvent.click(screen.getByRole('button', { name: 'Exit to setup' }));
      expect(nav.getUrl()).toBe('/quizzes?topic=BRANCHES');
      expect(screen.getByRole('button', { name: 'Start quiz' })).toBeTruthy();
    } finally {
      questions[0] = original;
    }
  });
  it('keeps a picked juz range when Start is clicked before navigation completes', () => {
    nav.reset('/quizzes?topic=BRANCHES');
    const pushes: string[] = [];
    const pending = vi.spyOn(nav, 'push').mockImplementation((url) => { pushes.push(url); });
    try {
      render(<QuizzesPage />);
      fireEvent.change(screen.getByLabelText('From juz'), { target: { value: '25' } });
      fireEvent.click(screen.getByRole('button', { name: 'Start quiz' }));
      const final = new URLSearchParams(pushes.at(-1)?.split('?')[1]);
      expect(final.get('juzFrom')).toBe('25');
      expect(final.get('length')).toBe('5');
      expect(final.get('topic')).toBe('BRANCHES');
    } finally {
      pending.mockRestore();
    }
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
    expect(screen.queryByText('No answer')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Review questions' }));
    expect(screen.getByText('No answer')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Review question 5' }));
    expect(screen.getByText('السؤال العربي 5؟')).toBeTruthy();
    expect(screen.getByText('No answer')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Back to results' }));
    expect(screen.queryByRole('region', { name: 'Question review' })).toBeNull();
    expect(screen.getByText('Score: 0 / 5 (0%)')).toBeTruthy();
  });

  it('shows the exact small supply and offers no impossible length', () => {
    nav.reset('/quizzes?topic=AYAT');
    render(<QuizzesPage />);

    expect(screen.getByText('2 questions available')).toBeTruthy();
    expect(screen.getByText('Fewer than five approved questions are available.')).toBeTruthy();
    expect(screen.queryByRole('button', { name: '5' })).toBeNull();
  });

  it('asks solo or party first with cards, and keeps the settings when the last topic is removed', () => {
    nav.reset('/quizzes');
    render(<QuizzesPage />);
    const modes = screen.getByRole('navigation', { name: 'Quiz mode' });
    const links = within(modes).getAllByRole('link');
    expect(links.map(link => link.getAttribute('href'))).toEqual(['/quizzes?topic=BRANCHES', '/quizzes/party', '/quran/read/recite', '/quizzes/openings', '/quran/read?write=1']);
    expect(within(links[2]).getByText('Recite')).toBeTruthy();
    expect(within(links[0]).getByText('Solo quiz')).toBeTruthy();
    expect(within(links[1]).getByText('Party quiz')).toBeTruthy();
    cleanup();
    nav.reset('/quizzes?topic=BRANCHES');
    render(<QuizzesPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Shared Quranic wording' }));
    expect(new URLSearchParams(nav.getUrl().split('?')[1]).get('solo')).toBe('1');
    expect(screen.queryByRole('navigation', { name: 'Quiz mode' })).toBeNull();
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

  it('asks which surah an ayah is in and shows the look-alike in the surah picked wrongly', () => {
    const original = questions[0];
    questions[0] = {
      ...original, key: 'SURAH:2:34', family: 'SURAH', promptArabic: 'في أي سورة هذه الآية؟',
      choices: [{ value: '20', labelArabic: 'طه' }, { value: '2', labelArabic: 'البقرة' }, { value: '18', labelArabic: 'الكهف' }, { value: '17', labelArabic: 'الإسراء' }],
      correctAnswer: '2',
      ...{ quran: ['فَسَجَدُوٓا۟', 'إِلَّآ', 'إِبْلِيسَ', 'أَبَىٰ'], ayahKey: '2:34', alike: { 17: { key: '17:61', words: ['فَسَجَدُوٓا۟', 'إِلَّآ', 'إِبْلِيسَ', 'قَالَ'] } } },
    };
    try {
      nav.reset('/quizzes?topic=SURAH&length=5');
      render(<QuizzesPage />);
      expect(document.querySelectorAll('p.font-quran span')).toHaveLength(4);
      expect(screen.queryByRole('link', { name: 'In the mushaf' })).toBeNull();
      fireEvent.click(screen.getByRole('button', { name: 'الإسراء' }));
      expect(screen.getByText('Incorrect')).toBeTruthy();
      expect(screen.getByText('آية الإسراء التي تشبهها، ٦١')).toBeTruthy();
      expect(screen.getByRole('link', { name: 'In the mushaf' }).getAttribute('href')).toBe('/quran/read/ayah/2/34');
    } finally {
      questions[0] = original;
    }
  });

  it('keeps a recited snippet\'s rest and choices hidden until shown, and saves «نسيتها» as forgotten', () => {
    const original = questions[0];
    questions[0] = {
      ...original, key: 'RECITE:36:1', family: 'RECITE', promptArabic: 'سمّع بقية الآية',
      choices: [{ value: '1', labelArabic: 'حفظتها' }, { value: '0', labelArabic: 'نسيتها' }], correctAnswer: '1',
      ...{ quran: ['وَٱلْقُرْءَانِ'], reveal: ['ٱلْحَكِيمِ'], ayahKey: '36:2' },
    };
    try {
      nav.reset('/quizzes?topic=RECITE&length=5');
      render(<QuizzesPage />);
      expect(document.querySelector('p.font-quran')!.textContent).toMatch(/…$/);
      expect(screen.queryByRole('button', { name: 'نسيتها' })).toBeNull();
      expect(screen.queryByRole('button', { name: 'Show answer' })).toBeNull();
      fireEvent.click(screen.getByRole('button', { name: 'Show the ayah' }));
      fireEvent.click(screen.getByRole('button', { name: 'نسيتها' }));
      expect(screen.getByRole('button', { name: 'Question 1 - incorrect' })).toBeTruthy();
      expect(JSON.parse(localStorage.getItem('ayah-forgot') ?? '{}')['36:2'].forgot).toBe(1);
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

  it('offers an unfinished quiz at the setup and continues it where it stopped, with its own questions', () => {
    nav.reset('/quizzes?topic=PEOPLE&length=5');
    render(<QuizzesPage />);
    fireEvent.click(screen.getByRole('button', { name: 'الأول' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    cleanup();

    const original = questions[0];
    questions[0] = { ...original, promptArabic: 'سؤال جديد؟' };
    try {
      nav.reset('/quizzes?topic=PEOPLE');
      render(<QuizzesPage />);
      expect(screen.getByText('You have an unfinished quiz, at question 2 of 5.')).toBeTruthy();
      expect(screen.getByRole('link', { name: /Continue it/ }).getAttribute('href')).toBe('/quizzes?topic=PEOPLE&length=5');
      cleanup();

      nav.reset('/quizzes?topic=PEOPLE&length=5');
      render(<QuizzesPage />);
      expect(screen.getByText('السؤال العربي 2؟')).toBeTruthy();
      fireEvent.click(screen.getByRole('button', { name: 'Question 1 - incorrect' }));
      expect(screen.getByText('السؤال العربي 1؟')).toBeTruthy();
    } finally {
      questions[0] = original;
    }
  });

  it('lets go of an unfinished quiz on «Leave it», on a new start and once submitted', () => {
    nav.reset('/quizzes?topic=PEOPLE&length=5');
    render(<QuizzesPage />);
    fireEvent.click(screen.getByRole('button', { name: 'الأول' }));
    cleanup();

    nav.reset('/quizzes?topic=PEOPLE');
    render(<QuizzesPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Leave it' }));
    expect(screen.queryByText(/unfinished quiz/)).toBeNull();
    expect(localStorage.getItem('quiz-solo-run')).toBeNull();
    cleanup();

    nav.reset('/quizzes?topic=PEOPLE&length=5');
    render(<QuizzesPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Question 5 - unanswered' }));
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(localStorage.getItem('quiz-solo-run')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'New quiz' }));
    expect(screen.queryByText(/unfinished quiz/)).toBeNull();
  });

  it('keeps the saved progress through Exit to setup and saves nothing after New quiz, while the URL is still changing', () => {
    const stalled = vi.spyOn(nav, 'push').mockImplementation(() => {});
    try {
      nav.reset('/quizzes?topic=PEOPLE&length=5');
      render(<QuizzesPage />);
      fireEvent.click(screen.getByRole('button', { name: 'الأول' }));
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      fireEvent.click(screen.getByRole('button', { name: 'Exit to setup' }));
      const kept = JSON.parse(localStorage.getItem('quiz-solo-run')!);
      expect(kept.current).toBe(1);
      expect(kept.answers).toEqual({ 0: 'one' });
      cleanup();

      render(<QuizzesPage />);
      fireEvent.click(screen.getByRole('button', { name: 'Question 5 - unanswered' }));
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
      fireEvent.click(screen.getByRole('button', { name: 'New quiz' }));
      expect(localStorage.getItem('quiz-solo-run')).toBeNull();
    } finally {
      stalled.mockRestore();
    }
  });

  it('offers the latest progress after leaving the quiz without its buttons, as Back does', () => {
    nav.reset('/quizzes?topic=PEOPLE&length=5');
    render(<QuizzesPage />);
    fireEvent.click(screen.getByRole('button', { name: 'الأول' }));
    act(() => nav.push('/quizzes?topic=PEOPLE'));
    expect(screen.getByText('You have an unfinished quiz, at question 1 of 5.')).toBeTruthy();
    act(() => nav.push('/quizzes?topic=PEOPLE&length=5'));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.click(screen.getByRole('button', { name: 'الصحيح' }));
    act(() => nav.push('/quizzes?topic=PEOPLE'));
    expect(screen.getByText('You have an unfinished quiz, at question 2 of 5.')).toBeTruthy();
    act(() => nav.push('/quizzes?topic=PEOPLE&length=5'));
    expect(screen.getByText('السؤال العربي 2؟')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Question 1 - incorrect' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Question 2 - correct' })).toBeTruthy();
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

  it('keeps a tree answer with no right leaf marked incorrect', () => {
    const original = questions[0];
    questions[0] = branchQuestion;
    try {
      nav.reset('/quizzes?topic=BRANCHES&length=5');
      render(<QuizzesPage />);
      fireEvent.change(screen.getByLabelText('Node 4'), { target: { value: 'خطأ' } });
      fireEvent.click(screen.getByRole('button', { name: 'Check' }));
      expect(screen.getByRole('button', { name: 'Question 1 - incorrect' })).toBeTruthy();
    } finally {
      questions[0] = original;
    }
  });

  it('marks a partial tree answer partly correct and reveals the intermediate split and every leaf', () => {
    const original = questions[0];
    questions[0] = branchQuestion;
    try {
      nav.reset('/quizzes?topic=BRANCHES&length=5');
      render(<QuizzesPage />);

      expect(screen.getAllByRole('textbox')).toHaveLength(4);
      fireEvent.change(screen.getByLabelText('Node 1'), { target: { value: 'فينبئهم' } });
      fireEvent.change(screen.getByLabelText('Node 4'), { target: { value: 'فيحلفون له' } });
      fireEvent.click(screen.getByRole('button', { name: 'Check' }));

      expect(screen.getByRole('button', { name: 'Question 1 - partly correct' })).toBeTruthy();
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
      fireEvent.click(screen.getByRole('button', { name: 'Review questions' }));
      expect(screen.getByText('4 of 4 leaves')).toBeTruthy();
    } finally {
      questions[0] = original;
    }
  });

  it('opens a trees quiz on what is memorized while «الأسئلة مما أحفظ فقط» is on, and not over a range already picked', () => {
    localStorage.setItem('memorized', JSON.stringify({ unit: 'juz', picked: [29, 30] }));
    nav.reset('/quizzes?topic=BRANCHES');
    render(<QuizzesPage />);
    expect(new URLSearchParams(nav.getUrl().split('?')[1]).get('juz')).toBe('29,30');
    cleanup();
    nav.reset('/quizzes?topic=BRANCHES&juzFrom=1&juzTo=5');
    render(<QuizzesPage />);
    expect(new URLSearchParams(nav.getUrl().split('?')[1]).has('juz')).toBe(false);
    cleanup();
    localStorage.setItem('memorized-questions', '0');
    nav.reset('/quizzes?topic=BRANCHES');
    render(<QuizzesPage />);
    expect(new URLSearchParams(nav.getUrl().split('?')[1]).has('juz')).toBe(false);
    localStorage.clear();
  });

  it('picks a juz range with the branches filters and preserves the other URL options', () => {
    nav.reset('/quizzes?topic=BRANCHES&juzFrom=1&juzTo=30&view=tree');
    render(<QuizzesPage />);
    expect((screen.getByLabelText('From juz') as HTMLSelectElement).value).toBe('1');
    expect((screen.getByLabelText('To juz') as HTMLSelectElement).value).toBe('30');
    fireEvent.change(screen.getByLabelText('From juz'), { target: { value: '25' } });
    const params = new URLSearchParams(nav.getUrl().split('?')[1]);
    expect(params.get('juzFrom')).toBe('25');
    expect(params.get('juzTo')).toBe('30');
    expect(params.get('topic')).toBe('BRANCHES');
    expect(params.get('view')).toBe('tree');
    expect(params.has('length')).toBe(false);
    expect(availabilityKeys.at(-1)).toBe('/api/quiz/availability?topic=BRANCHES&juzFrom=25&juzTo=30');
  });

  it('keeps the juz range beside a person circle and moves to along when from passes it', () => {
    nav.reset('/quizzes?topic=BRANCHES,PERSON_CIRCLE&person=abu-ubaydah&juzFrom=20&juzTo=25');
    render(<QuizzesPage />);
    fireEvent.change(screen.getByLabelText('From juz'), { target: { value: '28' } });
    const params = new URLSearchParams(nav.getUrl().split('?')[1]);
    expect(params.get('juzFrom')).toBe('28');
    expect(params.get('juzTo')).toBe('28');
    expect(params.get('person')).toBe('abu-ubaydah');
  });

  it('asks the kinds of difference picked, as on the branches page, and sends them with the count', () => {
    nav.reset('/quizzes?topic=BRANCHES');
    render(<QuizzesPage />);
    fireEvent.click(screen.getByRole('button', { name: /Word trees/ }));
    const params = new URLSearchParams(nav.getUrl().split('?')[1]);
    expect(params.get('categories')).toBe('mutashabeh,words');
    expect(availabilityKeys.at(-1)).toBe('/api/quiz/availability?topic=BRANCHES&categories=mutashabeh%2Cwords');
    expect(screen.queryByRole('group', { name: 'Sort' })).toBeNull();
  });

  it('offers one to ten answers per tree, defaulting to three, and sends the choice with the quiz', () => {
    nav.reset('/quizzes?topic=BRANCHES');
    render(<QuizzesPage />);
    const group = screen.getByRole('group', { name: 'Answers per tree' });
    expect(within(group).getAllByRole('button').map((button) => button.textContent)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    expect(within(group).getByRole('button', { name: '3' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getAllByText('You type this')).toHaveLength(3);
    fireEvent.click(within(group).getByRole('button', { name: '10' }));
    expect(new URLSearchParams(nav.getUrl().split('?')[1]).get('leaves')).toBe('10');
    expect(nav.push).toHaveBeenLastCalledWith(expect.any(String), { scroll: false });
    expect(screen.getAllByText('You type this')).toHaveLength(6);
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
