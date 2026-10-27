// @vitest-environment jsdom
import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AppChrome, { useHideFooter, useHideNavbar } from './AppChrome';

vi.mock('./NavBar', () => ({ default: ({ menuOnly }: { menuOnly: boolean }) => <nav>{menuOnly ? 'menu only' : 'full navbar'}</nav> }));
vi.mock('./Footer', () => ({ default: () => <footer>site footer</footer> }));
vi.mock('./NavigationLoader', () => ({ NavigationLoaderProvider: ({ children }: { children: React.ReactNode }) => <>{children}</> }));

function Page() {
  const [running, setRunning] = React.useState(false);
  useHideFooter(running);
  return <button onClick={() => setRunning(value => !value)}>toggle</button>;
}

afterEach(cleanup);

describe('AppChrome', () => {
  it('hides the footer while a page asks for it and shows it again after', () => {
    render(<AppChrome><Page /></AppChrome>);
    expect(screen.getByText('site footer')).toBeTruthy();
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.queryByText('site footer')).toBeNull();
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByText('site footer')).toBeTruthy();
  });

  it('shrinks the navbar to its menu while a page asks for it and restores it after', () => {
    function Room() {
      const [inRoom, setInRoom] = React.useState(false);
      useHideNavbar(inRoom);
      return <button onClick={() => setInRoom(value => !value)}>room</button>;
    }
    render(<AppChrome><Room /></AppChrome>);
    expect(screen.getByText('full navbar')).toBeTruthy();
    fireEvent.click(screen.getByText('room'));
    expect(screen.getByText('menu only')).toBeTruthy();
    fireEvent.click(screen.getByText('room'));
    expect(screen.getByText('full navbar')).toBeTruthy();
  });
});
