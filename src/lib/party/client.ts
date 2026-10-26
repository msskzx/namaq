"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ActionError, PartyView, PlayerAction } from "./rules";

const PLAYER_KEY = "namaq-party-player";
const NAME_KEY = "namaq-party-name";

export const partyUrl = () => (process.env.NEXT_PUBLIC_PARTY_URL ?? "http://localhost:8787").replace(/\/$/, "");

function stored(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function store(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

export function playerId() {
  const existing = stored(PLAYER_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID?.() ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
  store(PLAYER_KEY, id);
  return id;
}

export const savedName = () => stored(NAME_KEY) ?? "";
export const saveName = (name: string) => store(NAME_KEY, name.trim());

export async function startParty(id: string, name: string): Promise<string> {
  const response = await fetch(`${partyUrl()}/parties`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ playerId: id, name }) });
  const body = await response.json();
  if (!response.ok || !body.code) throw new Error(body.error ?? "Failed to start a party");
  return body.code;
}

export type PartyStatus = "connecting" | "open" | "closed" | "missing" | "removed";

export function usePartySocket(code: string, id: string | null, name: string | null) {
  const [view, setView] = useState<PartyView | null>(null);
  const [error, setError] = useState<ActionError | null>(null);
  const [status, setStatus] = useState<PartyStatus>("connecting");
  const [offset, setOffset] = useState(0);
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!id || !name) return;
    let stopped = false;
    let attempt = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const connect = () => {
      setStatus("connecting");
      const ws = new WebSocket(`${partyUrl().replace(/^http/, "ws")}/parties/${code}?player=${encodeURIComponent(id)}`);
      socket.current = ws;
      ws.onopen = () => {
        attempt = 0;
        setStatus("open");
        ws.send(JSON.stringify({ type: "join", name }));
      };
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "state") {
          setView(message.view);
          setOffset(message.view.now - Date.now());
          setError(null);
        } else if (message.type === "error") {
          setError(message.error);
          if (message.error === "removed") setStatus("removed");
        }
      };
      ws.onclose = (event) => {
        if (stopped) return;
        if (event.code === 4001) return setStatus("removed");
        if (event.code === 4004) return setStatus("missing");
        setStatus("closed");
        timer = setTimeout(connect, Math.min(10_000, 500 * 2 ** attempt++));
      };
    };
    connect();
    const wake = () => {
      if (document.visibilityState === "visible" && socket.current?.readyState === WebSocket.CLOSED) {
        clearTimeout(timer);
        connect();
      }
    };
    document.addEventListener("visibilitychange", wake);
    return () => {
      stopped = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", wake);
      socket.current?.close();
    };
  }, [code, id, name]);

  const send = useCallback((action: PlayerAction) => {
    if (socket.current?.readyState === WebSocket.OPEN) socket.current.send(JSON.stringify(action));
  }, []);

  return { view, error, status, send, offset };
}
