// The party quiz on the phone talks to the same Cloudflare worker as the website (party/src/index.ts).
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import type { ActionError, PartyView, PlayerAction } from '@shared/party/rules';
import { deviceStorage } from './deviceStorage';

const PLAYER_KEY = 'namaq-party-player';
const NAME_KEY = 'namaq-party-name';

/** The live worker, the website's NEXT_PUBLIC_PARTY_URL. Public, so a published build never depends on an Expo env setting. */
const PUBLISHED_PARTY_URL = 'https://namaq.msskzx.workers.dev';

/**
 * The worker's address: EXPO_PUBLIC_PARTY_URL when set at build time, else a local worker on the dev server
 * and the live worker in a published build (the trial updates and store builds).
 */
export const partyUrl = (): string | null => {
  const url = process.env.EXPO_PUBLIC_PARTY_URL ?? (__DEV__ ? 'http://localhost:8787' : PUBLISHED_PARTY_URL);
  return url ? url.replace(/\/$/, '') : null;
};

export class NoPartyServer extends Error {}

/** How long starting a party may take before the phone gives up. */
const START_TIMEOUT = 10_000;

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
  const url = partyUrl();
  if (!url) throw new NoPartyServer();
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), START_TIMEOUT);
  let response: Response;
  let body: { code?: string; error?: string };
  try {
    response = await fetch(`${url}/parties`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ playerId: id, name }), signal: abort.signal });
    body = await response.json();
  } finally {
    clearTimeout(timer);
  }
  if (!response.ok || !body.code) throw new Error(body.error ?? 'Failed to start a party');
  return body.code;
}

/** `offline`: the socket keeps failing before the party was ever reached (no network, or no party server). */
export type PartyStatus = 'connecting' | 'open' | 'closed' | 'offline' | 'missing' | 'removed';

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
    let reached = false;
    const url = partyUrl();
    if (!url) {
      setStatus('offline');
      return;
    }
    const connect = () => {
      // An offline notice stays up while retrying, so it doesn't flicker back to the loader on each try.
      setStatus(current => current === 'offline' ? current : 'connecting');
      const ws = new WebSocket(`${url.replace(/^http/, 'ws')}/parties/${code}?player=${encodeURIComponent(id)}`);
      socket.current = ws;
      ws.onopen = () => {
        setStatus('open');
        ws.send(JSON.stringify({ type: 'join', name }));
      };
      ws.onmessage = event => {
        let message;
        try { message = JSON.parse(String(event.data)); } catch { return; }
        if (message.type === 'state') {
          reached = true;
          attempt = 0;
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
        // Still retrying, but after a few failed tries with nothing reached, say so instead of loading forever.
        setStatus(!reached && attempt >= 2 ? 'offline' : 'closed');
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
