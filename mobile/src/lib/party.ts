// The party quiz on the phone talks to the same Cloudflare worker as the website (party/src/index.ts).
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import type { ActionError, PartyView, PlayerAction } from '@shared/party/rules';
import { deviceStorage } from './deviceStorage';

const PLAYER_KEY = 'namaq-party-player';
const NAME_KEY = 'namaq-party-name';

/** The worker's address, set at build time (EXPO_PUBLIC_PARTY_URL), the same value as the website's NEXT_PUBLIC_PARTY_URL. */
export const partyUrl = () => (process.env.EXPO_PUBLIC_PARTY_URL ?? 'http://localhost:8787').replace(/\/$/, '');

const read = (key: string) => { try { return deviceStorage.getItem(key); } catch { return null; } };
const write = (key: string, value: string) => { try { deviceStorage.setItem(key, value); } catch {} };

/** One id per device, so a phone that drops out rejoins the party as the same player with its score. */
export function playerId() {
  const existing = read(PLAYER_KEY);
  if (existing) return existing;
  const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
  write(PLAYER_KEY, id);
  return id;
}

export const savedName = () => read(NAME_KEY) ?? '';
export const saveName = (name: string) => write(NAME_KEY, name.trim());

export async function startParty(id: string, name: string): Promise<string> {
  const response = await fetch(`${partyUrl()}/parties`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ playerId: id, name }) });
  const body = await response.json();
  if (!response.ok || !body.code) throw new Error(body.error ?? 'Failed to start a party');
  return body.code;
}

export type PartyStatus = 'connecting' | 'open' | 'closed' | 'missing' | 'removed';

/** The website's party socket (src/lib/party/client.ts), reconnecting when the app comes back to the front. */
export function usePartySocket(code: string, id: string | null, name: string | null) {
  const [view, setView] = useState<PartyView | null>(null);
  const [error, setError] = useState<ActionError | null>(null);
  const [status, setStatus] = useState<PartyStatus>('connecting');
  const [offset, setOffset] = useState(0);
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!id || !name) return;
    let stopped = false;
    let attempt = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const connect = () => {
      setStatus('connecting');
      const ws = new WebSocket(`${partyUrl().replace(/^http/, 'ws')}/parties/${code}?player=${encodeURIComponent(id)}`);
      socket.current = ws;
      ws.onopen = () => {
        attempt = 0;
        setStatus('open');
        ws.send(JSON.stringify({ type: 'join', name }));
      };
      ws.onmessage = event => {
        const message = JSON.parse(String(event.data));
        if (message.type === 'state') {
          setView(message.view);
          setOffset(message.view.now - Date.now());
          setError(null);
        } else if (message.type === 'error') {
          setError(message.error);
          if (message.error === 'removed') setStatus('removed');
        }
      };
      ws.onclose = event => {
        if (stopped || socket.current !== ws) return;
        if (event.code === 4001) return setStatus('removed');
        if (event.code === 4004) return setStatus('missing');
        setStatus('closed');
        timer = setTimeout(connect, Math.min(10_000, 500 * 2 ** attempt++));
      };
    };
    connect();
    const wake = AppState.addEventListener('change', state => {
      if (state === 'active' && socket.current?.readyState === WebSocket.CLOSED) {
        clearTimeout(timer);
        connect();
      }
    });
    return () => {
      stopped = true;
      clearTimeout(timer);
      wake.remove();
      socket.current?.close();
    };
  }, [code, id, name]);

  const send = useCallback((action: PlayerAction) => {
    if (socket.current?.readyState === WebSocket.OPEN) socket.current.send(JSON.stringify(action));
  }, []);

  return { view, error, status, send, offset };
}
