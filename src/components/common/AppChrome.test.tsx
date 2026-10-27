// @vitest-environment jsdom
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AppChrome, { useHideFooter } from './AppChrome';

vi.mock('./NavBar', () => ({ default: () => <nav /> }));
vi.mock('./Footer', () => ({ default: () => <footer>site footer</footer> }));
vi.mock('./NavigationLoader', () => ({ NavigationLoaderProvider: ({ children }: { children: React.ReactNode }) => <>{children}</> }));

function Page() {
  const [running, setRunning] = React.useState(false);
  useHideFooter(running);
  return <button onClick={() => setRunning(value => !value)}>toggle</button>;
}

describe('AppChrome', () => {
  it('hides the footer while a page asks for it and shows it again after', () => {
    render(<AppChrome><Page /></AppChrome>);
    expect(screen.getByText('site footer')).toBeTruthy();
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.queryByText('site footer')).toBeNull();
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByText('site footer')).toBeTruthy();
  });
});
