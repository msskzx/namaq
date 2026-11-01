// @vitest-environment jsdom
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AppChrome, { useHideFooter } from './AppChrome';

vi.mock('./NavBar', () => ({ default: () => <nav />, NavSlotContext: React.createContext(() => {}), NavSlotElement: React.createContext(null) }));
vi.mock('./TabBar', () => ({ default: () => <nav aria-label="tabs" /> }));
vi.mock('next/navigation', () => ({ usePathname: () => '/' }));
vi.mock('./NavigationLoader', () => ({ NavigationLoaderProvider: ({ children }: { children: React.ReactNode }) => <>{children}</> }));

function Page() {
  const [running, setRunning] = React.useState(false);
  useHideFooter(running);
  return <button onClick={() => setRunning(value => !value)}>toggle</button>;
}

describe('AppChrome', () => {
  it('has no footer, and hides the tab bar while a page asks for it and shows it again after', () => {
    render(<AppChrome><Page /></AppChrome>);
    expect(document.querySelector('footer')).toBeNull();
    expect(screen.getByRole('navigation', { name: 'tabs' })).toBeTruthy();
    expect(document.documentElement.hasAttribute('data-tabbar')).toBe(true);
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.queryByRole('navigation', { name: 'tabs' })).toBeNull();
    expect(document.documentElement.hasAttribute('data-tabbar')).toBe(false);
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByRole('navigation', { name: 'tabs' })).toBeTruthy();
  });
});
