// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, renderHook } from '@testing-library/react';
import { usePartySocket } from './client';

class FakeSocket {
  static OPEN = 1;
  static CLOSED = 3;
  static all: FakeSocket[] = [];
  readyState = 0;
  sent: string[] = [];
  onopen?: () => void;
  onmessage?: (event: { data: string }) => void;
  onclose?: (event: { code: number }) => void;
  constructor(public url: string) { FakeSocket.all.push(this); }
  send(data: string) { this.sent.push(data); }
  close() { this.readyState = FakeSocket.CLOSED; }
  open() { this.readyState = FakeSocket.OPEN; this.onopen?.(); }
  drop(code = 1006) { this.readyState = FakeSocket.CLOSED; this.onclose?.({ code }); }
}

beforeEach(() => {
  FakeSocket.all = [];
  vi.useFakeTimers();
  vi.stubGlobal('WebSocket', FakeSocket);
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('usePartySocket', () => {
  it('joins with the name on every connection, reconnecting after a drop', () => {
    const { result } = renderHook(() => usePartySocket('123456', 'p1', 'Amina'));
    expect(FakeSocket.all[0].url).toBe('ws://localhost:8787/parties/123456?player=p1');
    act(() => FakeSocket.all[0].open());
    expect(FakeSocket.all[0].sent).toEqual([JSON.stringify({ type: 'join', name: 'Amina' })]);
    act(() => FakeSocket.all[0].drop());
    expect(result.current.status).toBe('closed');
    act(() => { vi.advanceTimersByTime(500); });
    act(() => FakeSocket.all[1].open());
    expect(FakeSocket.all[1].sent).toEqual([JSON.stringify({ type: 'join', name: 'Amina' })]);
    expect(result.current.status).toBe('open');
  });

  it('stops for a party that is gone or a player who was removed', () => {
    const { result } = renderHook(() => usePartySocket('123456', 'p1', 'Amina'));
    act(() => FakeSocket.all[0].drop(4004));
    expect(result.current.status).toBe('missing');
    act(() => { vi.advanceTimersByTime(20_000); });
    expect(FakeSocket.all).toHaveLength(1);
    act(() => { FakeSocket.all[0].onmessage?.({ data: JSON.stringify({ type: 'error', error: 'removed' }) }); });
    expect(result.current.status).toBe('removed');
  });

  it('keeps the latest view and the clock offset from the server', () => {
    vi.setSystemTime(1000);
    const { result } = renderHook(() => usePartySocket('123456', 'p1', 'Amina'));
    act(() => FakeSocket.all[0].onmessage?.({ data: JSON.stringify({ type: 'state', view: { now: 4000, phase: 'lobby' } }) }));
    expect(result.current.view).toMatchObject({ phase: 'lobby' });
    expect(result.current.offset).toBe(3000);
  });
});
