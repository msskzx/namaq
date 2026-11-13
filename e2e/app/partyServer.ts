import type { BrowserContext, WebSocketRoute } from '@playwright/test';
import corpus from '../../shared/data/quran/trees.json';
import { act, createParty, viewFor, type Action, type PartyQuestion, type PartyState } from '../../shared/party/rules';
import type { BranchAyah } from '../../shared/quran/branches';
import { branchQuestionPool, branchQuiz } from '../../shared/quiz/branchQuestions';

/** The party worker's address in the test build (EXPO_PUBLIC_PARTY_URL in e2e/playwright.config.ts). */
const HOST = 'http://127.0.0.1:8787';
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };

let seed = 11;
const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

/**
 * The party worker (party/src/index.ts) in the test process: the same rules from shared/party/rules.ts, with the
 * questions built from the bundled trees instead of the website's /api/quiz. One party, code 123456.
 */
export class PartyServer {
  readonly code = '123456';
  state: PartyState | null = null;
  private sockets: { id: string; ws: WebSocketRoute }[] = [];

  async attach(context: BrowserContext) {
    await context.route(`${HOST}/parties`, async route => {
      if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS });
      const { playerId, name } = route.request().postDataJSON();
      this.state = createParty(this.code, playerId, name ?? '', Date.now());
      await route.fulfill({ status: 200, headers: CORS, contentType: 'application/json', body: JSON.stringify({ code: this.code }) });
    });
    await context.routeWebSocket(new RegExp(`^ws://127\\.0\\.0\\.1:8787/parties/\\d+`), ws => {
      const id = new URL(ws.url()).searchParams.get('player') ?? '';
      if (!this.state || !id) {
        ws.send(JSON.stringify({ type: 'error', error: 'missing' }));
        return ws.close({ code: 4004, reason: 'No such party' });
      }
      const entry = { id, ws };
      this.sockets.push(entry);
      ws.onMessage(message => this.dispatch({ ...JSON.parse(String(message)), playerId: id } as Action, ws));
      ws.onClose(() => {
        this.sockets = this.sockets.filter(other => other !== entry);
        if (!this.sockets.some(other => other.id === id)) this.dispatch({ type: 'disconnect', playerId: id } as Action);
      });
    });
  }

  /** The question being asked, as the server holds it (with its tree and the leaves asked). */
  get question() {
    return this.state?.questions[this.state.current] ?? null;
  }

  private dispatch(action: Action, from?: WebSocketRoute) {
    const state = this.state;
    if (!state) return;
    const now = Date.now();
    const result = act(state, action, now);
    if (result.error && from) from.send(JSON.stringify({ type: 'error', error: result.error }));
    if (result.state === state) return;
    this.state = result.state;
    for (const { id, ws } of this.sockets) {
      if (result.state.players.some(player => player.id === id)) ws.send(JSON.stringify({ type: 'state', view: viewFor(result.state, id, now) }));
    }
    if (state.phase !== 'loading' && result.state.phase === 'loading') {
      const questions = branchQuiz(branchQuestionPool((corpus as { ayat: BranchAyah[] }).ayat, null), result.state.settings.length, result.state.settings.leaves, random);
      setTimeout(() => this.dispatch({ type: 'loaded', questions: questions as unknown as PartyQuestion[], surahNames: {} }), 50);
    }
  }
}
