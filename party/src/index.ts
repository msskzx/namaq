// docs/adr/0031-a-live-party-runs-in-one-durable-object.md
import { DurableObject } from 'cloudflare:workers';
import { act, createParty, expired, nextWake, quizQuery, viewFor, type Action, type PartyQuestion, type PartyState, type PlayerAction } from '../../src/lib/party/rules';

interface Env {
  PARTY: DurableObjectNamespace<Party>;
  APP_URL: string;
}

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...CORS } });
const CODE = /^\d{6}$/;

export class Party extends DurableObject<Env> {
  private state: PartyState | null | undefined;

  private async load() {
    if (this.state === undefined) {
      const state = await this.ctx.storage.get<PartyState>('state');
      const questions = await this.ctx.storage.get<PartyQuestion[]>('questions');
      this.state = state ? { ...state, questions: questions ?? [] } : null;
    }
    return this.state;
  }

  private async save(state: PartyState, questionsChanged: boolean) {
    this.state = state;
    const { questions, ...rest } = state;
    await this.ctx.storage.put('state', { ...rest, questions: [] });
    if (questionsChanged) await this.ctx.storage.put('questions', questions);
    await this.ctx.storage.setAlarm(Math.max(nextWake(state), Date.now() + 1000));
  }

  async create(code: string, hostId: string, hostName: string) {
    if (await this.load()) return false;
    await this.save(createParty(code, hostId, hostName, Date.now()), true);
    return true;
  }

  async fetch(request: Request) {
    const state = await this.load();
    const playerId = new URL(request.url).searchParams.get('player') ?? '';
    if (request.headers.get('Upgrade') !== 'websocket') return new Response('Expected a WebSocket', { status: 426 });
    const [client, server] = Object.values(new WebSocketPair());
    this.ctx.acceptWebSocket(server, [playerId]);
    if (!state || !playerId) {
      server.send(JSON.stringify({ type: 'error', error: 'missing' }));
      server.close(4004, 'No such party');
    }
    return new Response(null, { status: 101, webSocket: client });
  }

  private async dispatch(action: Action, from?: WebSocket) {
    const state = await this.load();
    if (!state) return;
    const now = Date.now();
    const result = act(state, action, now);
    if (result.error && from) from.send(JSON.stringify({ type: 'error', error: result.error }));
    if (result.state === state) return;
    await this.save(result.state, result.state.questions !== state.questions);
    for (const socket of this.ctx.getWebSockets()) {
      const [id] = this.ctx.getTags(socket);
      if (result.state.players.some(player => player.id === id)) socket.send(JSON.stringify({ type: 'state', view: viewFor(result.state, id, now) }));
      else if (state.players.some(player => player.id === id)) socket.close(4001, 'Removed from the party');
    }
    if (state.phase !== 'loading' && result.state.phase === 'loading') this.ctx.waitUntil(this.fetchQuestions(result.state));
  }

  private async fetchQuestions(state: PartyState) {
    try {
      const response = await fetch(`${this.env.APP_URL}/api/quiz?${quizQuery(state.settings)}`);
      const body = await response.json() as { questions?: PartyQuestion[]; surahNames?: Record<number, string>; error?: string };
      if (!response.ok || !body.questions?.length) return this.dispatch({ type: 'failed', error: body.error ?? 'Failed to build the quiz' });
      await this.dispatch({ type: 'loaded', questions: body.questions, surahNames: body.surahNames ?? {} });
    } catch {
      await this.dispatch({ type: 'failed', error: 'Failed to build the quiz' });
    }
  }

  async webSocketMessage(socket: WebSocket, message: string | ArrayBuffer) {
    const [playerId] = this.ctx.getTags(socket);
    let action: PlayerAction;
    try {
      action = JSON.parse(typeof message === 'string' ? message : new TextDecoder().decode(message));
    } catch {
      return;
    }
    await this.dispatch({ ...action, playerId } as Action, socket);
  }

  async webSocketClose(socket: WebSocket, code: number, reason: string) {
    try {
      socket.close(code, reason);
    } catch {}
    await this.dropped(socket);
  }

  async webSocketError(socket: WebSocket) {
    await this.dropped(socket);
  }

  private async dropped(socket: WebSocket) {
    const [playerId] = this.ctx.getTags(socket);
    const others = this.ctx.getWebSockets(playerId).filter(other => other !== socket && other.readyState === WebSocket.OPEN);
    if (!others.length) await this.dispatch({ type: 'disconnect', playerId });
  }

  async alarm() {
    const state = await this.load();
    if (!state) return;
    if (expired(state, Date.now())) {
      for (const socket of this.ctx.getWebSockets()) socket.close(4004, 'The party ended');
      this.state = null;
      await this.ctx.storage.deleteAll();
      return;
    }
    await this.dispatch({ type: 'tick' });
    if (this.state) await this.ctx.storage.setAlarm(Math.max(nextWake(this.state), Date.now() + 1000));
  }
}

export default {
  async fetch(request: Request, env: Env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });
    const url = new URL(request.url);
    const [, root, code] = url.pathname.split('/');
    if (root !== 'parties') return json({ error: 'Not found' }, 404);
    if (!code && request.method === 'POST') {
      const { playerId, name } = await request.json<{ playerId?: string; name?: string }>().catch(() => ({ playerId: undefined, name: undefined }));
      if (!playerId) return json({ error: 'A player id is needed' }, 400);
      for (let attempt = 0; attempt < 5; attempt++) {
        const next = String(100000 + Math.floor(Math.random() * 900000));
        if (await env.PARTY.get(env.PARTY.idFromName(next)).create(next, playerId, name ?? '')) return json({ code: next });
      }
      return json({ error: 'No free party code' }, 503);
    }
    if (code && CODE.test(code)) return env.PARTY.get(env.PARTY.idFromName(code)).fetch(request);
    return json({ error: 'Not found' }, 404);
  },
} satisfies ExportedHandler<Env>;
