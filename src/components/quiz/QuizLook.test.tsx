import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render as rtlRender, screen } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { LanguageProvider } from '@/components/language/LanguageContext';
import { BATTLES } from '@/lib/stories';
import { tafsirSadiOf } from '@shared/quran/tafsirSadiData';
import type { QuizLook } from '@shared/quiz/choiceKinds';
import { canLook, LookView } from './QuizLook';

// A fresh SWR cache for each test, inside the language the loading dots read.
const render = (ui: React.ReactElement) => rtlRender(<LanguageProvider><SWRConfig value={{ provider: () => new Map() }}>{ui}</SWRConfig></LanguageProvider>);

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('QuizLook', () => {
  it('draws the looks whose views the website has', () => {
    expect(canLook({ view: 'story', slug: 'x' })).toBe(true);
    expect(canLook({ view: 'battle', slug: 'x' })).toBe(true);
    for (const look of [{ view: 'word', key: '1:1', word: 0 }, { view: 'irab', key: '1:1', word: 0 }, { view: 'balagha', key: '1:1' }, { view: 'qiraat', key: '1:4' }, { view: 'tafsir', keys: ['1:1'] }, { view: 'tuhfa' }] satisfies QuizLook[]) expect(canLook(look)).toBe(true);
    expect(canLook({ view: 'terms', names: [] })).toBe(true);
    expect(canLook({ view: 'hadith' })).toBe(false);
    expect(canLook(undefined)).toBe(false);
  });

  it('opens a battle with its name under the page heading and no empty moments heading', async () => {
    const battle = BATTLES.find(each => !each.moments.length)!;
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ battle }))));
    render(<LookView look={{ view: "battle", slug: battle.slug }} shown={false} />);
    expect(await screen.findByRole('heading', { level: 2, name: battle.name })).toBeTruthy();
    expect(screen.queryByText(/^مجرى/)).toBeNull();
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
  });

  it('says so when the look cannot load', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 500 })));
    render(<LookView look={{ view: "story", slug: "nothing" }} shown={false} />);
    expect(await screen.findByText(/تعذّر التحميل/)).toBeTruthy();
  });

  it('shows the tafsir of the asked ayah first and checked once the answer is shown, not before', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(tafsirSadiOf('2:2')))));
    const look: QuizLook = { view: 'tafsir', keys: ['2:2', '2:3'], mark: '2:3' };
    render(<LookView look={look} shown={false} />);
    expect(screen.getAllByRole('tab').length).toBe(2);
    expect(screen.queryByRole('tab', { name: /الجواب/ })).toBeNull();
    cleanup();
    render(<LookView look={look} shown />);
    expect(screen.getByRole('tab', { name: /٣، الجواب/ })).toBeTruthy();
  });

  it('shows only the chapter of the answering verse of the Tuhfa, the verse lit', () => {
    render(<LookView look={{ view: 'tuhfa', mark: 5 }} shown />);
    expect(screen.getAllByRole('heading', { level: 2 }).length).toBe(1);
    expect(document.querySelector('[aria-current="true"]')?.id).toBe('bayt-5');
  });
});
