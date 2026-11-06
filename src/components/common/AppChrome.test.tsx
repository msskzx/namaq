// @vitest-environment jsdom
import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AppChrome, { useHideFooter } from './AppChrome';

vi.mock('./NavBar', () => ({ default: () => <nav />, NavSlotContext: React.createContext(() => {}), NavSlotElement: React.createContext(null), RailSlotContext: React.createContext(() => {}), RailSlotElement: React.createContext(null) }));
vi.mock('./TabBar', () => ({ default: () => <nav aria-label="tabs" />, TabSpacer: () => <div /> }));
const route = vi.hoisted(() => ({ pathname: '/' }));
vi.mock('next/navigation', () => ({ usePathname: () => route.pathname }));
afterEach(() => { cleanup(); route.pathname = '/'; });
vi.mock('./NavigationLoader', () => ({ NavigationLoaderProvider: ({ children }: { children: React.ReactNode }) => <>{children}</> }));

function Page() {
  const [running, setRunning] = React.useState(false);
  useHideFooter(running);
  return <button onClick={() => setRunning(value => !value)}>toggle</button>;
}

describe('AppChrome', () => {
  it.each(['/', '/quran', '/quran/read/1', '/quran/branches', '/quizzes', '/quizzes/party/abc'])('applies the feature palette including chrome on %s', pathname => {
    route.pathname = pathname;
    const { container } = render(<AppChrome><Page /></AppChrome>);
    const scope = container.querySelector('[data-feature-theme]');
    expect(scope?.querySelector('main')).toBeTruthy();
    expect(scope?.querySelector('nav')).toBeTruthy();
  });

  it.each(['/experiments', '/experiments/quran', '/quran/words', '/quran/compare', '/quran/prophets/musa', '/quran/qiraat', '/people', '/quizzes-other'])('keeps the existing palette on %s', pathname => {
    route.pathname = pathname;
    const { container } = render(<AppChrome><Page /></AppChrome>);
    expect(container.querySelector('[data-feature-theme]')).toBeNull();
  });

  it('has no footer, and hides the tab bar while a page asks for it and shows it again after', () => {
    render(<AppChrome><Page /></AppChrome>);
    expect(document.querySelector('footer')).toBeNull();
    expect(screen.getByRole('navigation', { name: 'tabs' }).compareDocumentPosition(screen.getByRole('main')) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByRole('navigation', { name: 'tabs' })).toBeTruthy();
    expect(document.documentElement.hasAttribute('data-tabbar')).toBe(true);
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.queryByRole('navigation', { name: 'tabs' })).toBeNull();
    expect(document.documentElement.hasAttribute('data-tabbar')).toBe(false);
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByRole('navigation', { name: 'tabs' })).toBeTruthy();
  });
});
