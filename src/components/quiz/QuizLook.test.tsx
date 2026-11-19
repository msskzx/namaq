import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render as rtlRender, screen } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { LanguageProvider } from '@/components/language/LanguageContext';
import { BATTLES } from '@/lib/stories';
import { canLook, LookView } from './QuizLook';

// A fresh SWR cache for each test, inside the language the loading dots read.
const render = (ui: React.ReactElement) => rtlRender(<LanguageProvider><SWRConfig value={{ provider: () => new Map() }}>{ui}</SWRConfig></LanguageProvider>);

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('QuizLook', () => {
  it('draws the sira story and battle looks on the website, not yet the others', () => {
    expect(canLook({ view: 'story', slug: 'x' })).toBe(true);
    expect(canLook({ view: 'battle', slug: 'x' })).toBe(true);
    expect(canLook({ view: 'terms', names: [] })).toBe(false);
    expect(canLook(undefined)).toBe(false);
  });

  it('opens a battle with its name under the page heading and no empty moments heading', async () => {
    const battle = BATTLES.find(each => !each.moments.length)!;
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ battle }))));
    render(<LookView look={{ view: 'battle', slug: battle.slug }} />);
    expect(await screen.findByRole('heading', { level: 2, name: battle.name })).toBeTruthy();
    expect(screen.queryByText(/^مجرى/)).toBeNull();
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
  });

  it('says so when the look cannot load', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 500 })));
    render(<LookView look={{ view: 'story', slug: 'nothing' }} />);
    expect(await screen.findByText(/تعذّر التحميل/)).toBeTruthy();
  });
});
