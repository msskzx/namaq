// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { act as reduce, createParty, viewFor, type Action, type ActionError, type PartyState } from '@/lib/party/rules';
import PartyRoom, { NameForm } from './PartyRoom';

const socket = vi.hoisted(() => ({ view: null as unknown, error: null as ActionError | null, send: vi.fn() }));
vi.mock('@/lib/party/client', () => ({
  playerId: () => 'p0',
  savedName: () => 'Host',
  saveName: vi.fn(),
  usePartySocket: () => ({ view: socket.view, error: socket.error, status: 'open', send: socket.send, offset: 0 }),
}));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'en' }) }));
vi.mock('@/components/common/AppChrome', () => ({ useHideFooter: () => {} }));
vi.mock('swr', () => ({ default: () => ({ data: undefined }) }));

const question = { key: 'q1', correctAnswer: 'a', promptArabic: 'من هو؟', choices: [{ value: 'a', labelArabic: 'أبو بكر' }, { value: 'b', labelArabic: 'عمر' }] };

function party(actions: Action[]) {
  const start = createParty('123456', 'p0', 'Host', 0);
  const joined = [{ type: 'join', playerId: 'p0', name: 'Host' }, { type: 'join', playerId: 'p1', name: 'Amina' }] as Action[];
  return [...joined, ...actions].reduce((state: PartyState, action) => reduce(state, action, 0).state, start);
}

function show(state: PartyState, you = 'p0', error: ActionError | null = null) {
  socket.view = viewFor(state, you, 0);
  socket.error = error;
  return render(<PartyRoom code="123456" />);
}

beforeEach(() => socket.send.mockReset());
afterEach(cleanup);

describe('party lobby', () => {
  it('shows the party number and players, and lets the host start', () => {
    show(party([]));
    expect(screen.getByText('123456', { selector: '[data-code]' })).toBeTruthy();
    expect(within(screen.getByRole('region', { name: 'Players' })).getAllByRole('listitem').map(item => item.getAttribute('data-player'))).toEqual(['Host', 'Amina']);
    fireEvent.click(screen.getByRole('button', { name: /Start the quiz/ }));
    expect(socket.send).toHaveBeenCalledWith({ type: 'start' });
  });

  it('asks the host to confirm when not everyone is ready', () => {
    show(party([]), 'p0', 'not-ready');
    const dialog = screen.getByRole('alertdialog');
    expect(dialog.textContent).toContain('0 of 1 players are ready');
    fireEvent.click(within(dialog).getByRole('button', { name: /Start anyway/ }));
    expect(socket.send).toHaveBeenCalledWith({ type: 'start', early: true });
  });

  it('shows a player the settings without letting them change them', () => {
    show(party([]), 'p1');
    expect(screen.getByText('The host chooses these.')).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Start the quiz/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /I'm ready/ }));
    expect(socket.send).toHaveBeenCalledWith({ type: 'ready', ready: true });
  });

  it('shows the example tree to the host and the players when trees are chosen', () => {
    const trees = reduce(party([]), { type: 'settings', playerId: 'p0', settings: { topics: ['BRANCHES'] } }, 0).state;
    show(trees);
    expect(screen.getByRole('region', { name: 'Example tree' })).toBeTruthy();
    cleanup();
    show(trees, 'p1');
    expect(screen.getByRole('region', { name: 'Example tree' })).toBeTruthy();
    expect(screen.getByText('Grading:')).toBeTruthy();
  });

  it('shows no example tree without the trees topic', () => {
    show(reduce(party([]), { type: 'settings', playerId: 'p0', settings: { topics: ['PEOPLE'] } }, 0).state, 'p1');
    expect(screen.queryByRole('region', { name: 'Example tree' })).toBeNull();
  });
});

describe('party question', () => {
  const asked = () => party([{ type: 'start', playerId: 'p0', early: true }, { type: 'loaded', questions: [question, { ...question, key: 'q2' }], surahNames: {} }]);

  it('waits for the others with the timer and leaderboard, hiding the question and whether it was right', () => {
    show(reduce(asked(), { type: 'submit', playerId: 'p0', answer: 'b' }, 0).state);
    const board = screen.getByRole('region', { name: 'Leaderboard' });
    const status = (name: string) => board.querySelector(`[data-player="${name}"] [data-status]`)?.getAttribute('data-status');
    expect(status('Host')).toBe('answered');
    expect(status('Amina')).toBe('answering');
    expect(screen.queryByText(/Waiting for/)).toBeNull();
    expect(screen.getByText('Your answer is in. Still answering: Amina.').getAttribute('aria-live')).toBe('polite');
    expect(screen.getByRole('timer', { name: 'Time left' })).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Leaderboard' })).toBeTruthy();
    expect(screen.queryByText('من هو؟')).toBeNull();
    expect(screen.queryByText('Correct')).toBeNull();
  });

  it('submits the chosen answer', () => {
    show(asked(), 'p1');
    fireEvent.click(screen.getByRole('button', { name: /عمر/ }));
    expect(socket.send).toHaveBeenCalledWith({ type: 'submit', answer: 'b' });
  });

  it('reveals the answer and the leaderboard once everyone has answered', () => {
    const state = [{ type: 'submit', playerId: 'p0', answer: 'b' }, { type: 'submit', playerId: 'p1', answer: 'a' }].reduce((current: PartyState, action) => reduce(current, action as Action, 0).state, asked());
    show(state);
    expect(screen.getByText('Incorrect', { selector: '[data-result]' })).toBeTruthy();
    const board = screen.getByRole('region', { name: 'Leaderboard' });
    expect(within(board).getAllByRole('listitem').map(item => item.getAttribute('data-player'))).toEqual(['Amina', 'Host']);
    fireEvent.click(screen.getByRole('button', { name: /Next question/ }));
    expect(socket.send).toHaveBeenCalledWith({ type: 'next' });
  });
});

describe('name form', () => {
  it('hides the taken-name error once the name is edited, and shows it again for the same name', () => {
    render(<NameForm initial="Amina" error="Someone in the party has that name." ar={false} label="Join" nameError onSubmit={() => {}} />);
    expect(screen.getByRole('alert')).toBeTruthy();
    const input = screen.getByRole('textbox', { name: 'Your name' });
    fireEvent.change(input, { target: { value: 'Amina K' } });
    expect(screen.queryByRole('alert')).toBeNull();
    fireEvent.change(input, { target: { value: 'Amina' } });
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  it('keeps other errors while the name is edited', () => {
    render(<NameForm initial="Amina" error="Couldn't start a party." ar={false} label="Start" onSubmit={() => {}} />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Your name' }), { target: { value: 'Amina K' } });
    expect(screen.getByRole('alert')).toBeTruthy();
  });
});
