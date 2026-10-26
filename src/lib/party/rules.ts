// docs/adr/0031-a-live-party-runs-in-one-durable-object.md
import { questionPoints, type QuestionAnswer, type ScoredQuestion } from '@/lib/quiz/score';
import { QUIZ_LEAVES, QUIZ_LENGTHS, QUIZ_TOPICS, type QuizTopic } from '@/lib/quiz/types';

export const QUESTION_SECONDS = [15, 30, 60, 90] as const;
export const TREE_SECONDS = [60, 120, 180, 300] as const;
export const HOST_GRACE_MS = 30_000;
export const LOADING_MS = 30_000;
export const IDLE_MS = 2 * 60 * 60_000;
export const NAME_MAX = 24;

export type PartySettings = {
  topics: QuizTopic[];
  length: number;
  person: string;
  juzFrom: number;
  juzTo: number;
  leaves: number;
  seconds: number;
  treeSeconds: number;
};

export const DEFAULT_SETTINGS: PartySettings = { topics: ['BRANCHES'], length: 5, person: '', juzFrom: 1, juzTo: 30, leaves: 3, seconds: 60, treeSeconds: 180 };

export type PartyQuestion = ScoredQuestion & { key: string; correctAnswer: string; [field: string]: unknown };
export type Points = { earned: number; total: number };
export type Player = { id: string; name: string; ready: boolean; connected: boolean; score: number };
export type Phase = 'lobby' | 'loading' | 'question' | 'reveal' | 'final';

export type PartyState = {
  code: string;
  hostId: string;
  phase: Phase;
  settings: PartySettings;
  players: Player[];
  questions: PartyQuestion[];
  surahNames: Record<number, string>;
  current: number;
  deadline: number | null;
  answers: Record<string, QuestionAnswer>;
  results: Record<string, Points>;
  hostAwaySince: number | null;
  removed: string[];
  error: string | null;
  touched: number;
};

export type PlayerAction =
  | { type: 'join'; name: string }
  | { type: 'leave' }
  | { type: 'settings'; settings: Partial<PartySettings> }
  | { type: 'ready'; ready: boolean }
  | { type: 'remove'; target: string }
  | { type: 'start'; early?: boolean }
  | { type: 'submit'; answer: QuestionAnswer }
  | { type: 'next' }
  | { type: 'again' };

export type Action =
  | (PlayerAction & { playerId: string })
  | { type: 'disconnect'; playerId: string }
  | { type: 'loaded'; questions: PartyQuestion[]; surahNames: Record<number, string> }
  | { type: 'failed'; error: string }
  | { type: 'tick' };

export type ActionError = 'name-taken' | 'name-empty' | 'started' | 'removed' | 'not-host' | 'not-ready' | 'unknown-player' | 'wrong-phase';

const cleanName = (name: string) => name.normalize('NFC').trim().replace(/\s+/g, ' ').slice(0, NAME_MAX);

export function createParty(code: string, hostId: string, hostName: string, now: number): PartyState {
  const host = { id: hostId, name: cleanName(hostName) || '…', ready: false, connected: false, score: 0 };
  return { code, hostId, phase: 'lobby', settings: DEFAULT_SETTINGS, players: [host], questions: [], surahNames: {}, current: 0, deadline: null, answers: {}, results: {}, hostAwaySince: now, removed: [], error: null, touched: now };
}

const pick = <T,>(options: readonly T[], value: unknown, fallback: T) => options.includes(value as T) ? value as T : fallback;
const juz = (value: unknown, fallback: number) => Number.isInteger(value) && (value as number) >= 1 && (value as number) <= 30 ? value as number : fallback;

export function cleanSettings(settings: Partial<PartySettings>, base: PartySettings = DEFAULT_SETTINGS): PartySettings {
  const topics = Array.isArray(settings.topics) ? [...new Set(settings.topics.filter(topic => QUIZ_TOPICS.includes(topic)))] : base.topics;
  const from = juz(settings.juzFrom, base.juzFrom);
  const to = juz(settings.juzTo, base.juzTo);
  return {
    topics,
    length: pick(QUIZ_LENGTHS, settings.length, base.length as (typeof QUIZ_LENGTHS)[number]),
    person: typeof settings.person === 'string' ? settings.person.trim() : base.person,
    juzFrom: Math.min(from, to),
    juzTo: Math.max(from, to),
    leaves: pick(QUIZ_LEAVES, settings.leaves, base.leaves as (typeof QUIZ_LEAVES)[number]),
    seconds: pick(QUESTION_SECONDS, settings.seconds, base.seconds as (typeof QUESTION_SECONDS)[number]),
    treeSeconds: pick(TREE_SECONDS, settings.treeSeconds, base.treeSeconds as (typeof TREE_SECONDS)[number]),
  };
}

export function quizQuery(settings: PartySettings) {
  const params = new URLSearchParams();
  settings.topics.forEach(topic => params.append('topic', topic));
  params.set('length', String(settings.length));
  if (settings.topics.includes('PERSON_CIRCLE') && settings.person) params.set('person', settings.person);
  if (settings.topics.includes('BRANCHES')) {
    if (settings.juzFrom !== 1 || settings.juzTo !== 30) {
      params.set('juzFrom', String(settings.juzFrom));
      params.set('juzTo', String(settings.juzTo));
    }
    params.set('leaves', String(settings.leaves));
  }
  return params.toString();
}

const key = (name: string) => name.normalize('NFC').trim().replace(/\s+/g, ' ').toLocaleLowerCase();
const secondsFor = (state: PartyState, question: PartyQuestion) => (question.tree ? state.settings.treeSeconds : state.settings.seconds) * 1000;

function nextHost(players: Player[], hostId: string, connected: boolean) {
  const at = players.findIndex(player => player.id === hostId);
  const order = [...players.slice(at + 1), ...players.slice(0, Math.max(at, 0))];
  return order.find(player => !connected || player.connected);
}

function ask(state: PartyState, index: number, now: number): PartyState {
  return { ...state, phase: 'question', current: index, answers: {}, results: {}, deadline: now + secondsFor(state, state.questions[index]) };
}

function reveal(state: PartyState): PartyState {
  const question = state.questions[state.current];
  const results = Object.fromEntries(state.players.map(player => [player.id, questionPoints(question, state.answers[player.id])]));
  return { ...state, phase: 'reveal', deadline: null, results, players: state.players.map(player => ({ ...player, score: player.score + results[player.id].earned })) };
}

const everyoneAnswered = (state: PartyState) => state.players.length > 0 && state.players.every(player => player.id in state.answers);
const settle = (state: PartyState) => state.phase === 'question' && everyoneAnswered(state) ? reveal(state) : state;

export function act(state: PartyState, action: Action, now: number): { state: PartyState; error?: ActionError } {
  const result = apply(state, action, now);
  if (result.state === state || action.type === 'tick') return result;
  return { state: { ...result.state, touched: now }, error: result.error };
}

function apply(state: PartyState, action: Action, now: number): { state: PartyState; error?: ActionError } {
  if (action.type === 'tick') {
    let next = state;
    const due = next.deadline !== null && now >= next.deadline;
    if (due && next.phase === 'question') next = reveal(next);
    if (due && next.phase === 'loading') return apply(next, { type: 'failed', error: 'Failed to build the quiz' }, now);
    if (next.hostAwaySince !== null && now - next.hostAwaySince >= HOST_GRACE_MS) {
      const host = nextHost(next.players, next.hostId, true);
      next = { ...next, hostId: host?.id ?? next.hostId, hostAwaySince: null };
    }
    return { state: next };
  }
  if (action.type === 'loaded') {
    if (state.phase !== 'loading' || action.questions.length === 0) return { state };
    return { state: ask({ ...state, questions: action.questions, surahNames: action.surahNames, error: null }, 0, now) };
  }
  if (action.type === 'failed') {
    if (state.phase !== 'loading') return { state };
    return { state: { ...state, phase: 'lobby', deadline: null, error: action.error, players: state.players.map(player => ({ ...player, ready: false })) } };
  }

  const player = state.players.find(item => item.id === action.playerId);
  const isHost = action.playerId === state.hostId;
  const update = (id: string, change: Partial<Player>) => state.players.map(item => item.id === id ? { ...item, ...change } : item);

  if (action.type === 'join') {
    const name = cleanName(action.name);
    const taken = state.players.some(item => item.id !== action.playerId && key(item.name) === key(name));
    const host = state.players.find(item => item.id === state.hostId);
    const away = isHost ? null : state.hostAwaySince ?? (host && !host.connected ? now : null);
    if (state.removed.includes(action.playerId)) return { state, error: 'removed' };
    if (player && (state.phase !== 'lobby' || !name || taken)) return { state: { ...state, hostAwaySince: away, players: update(player.id, { connected: true }) } };
    if (!name) return { state, error: 'name-empty' };
    if (taken) return { state, error: 'name-taken' };
    if (player) return { state: { ...state, hostAwaySince: away, players: update(player.id, { connected: true, name }) } };
    if (state.phase !== 'lobby') return { state, error: 'started' };
    return { state: { ...state, hostAwaySince: away, players: [...state.players, { id: action.playerId, name, ready: false, connected: true, score: 0 }] } };
  }
  if (!player) return { state, error: 'unknown-player' };

  switch (action.type) {
    case 'disconnect':
      if (!player.connected) return { state };
      return { state: { ...state, players: update(player.id, { connected: false }), hostAwaySince: isHost ? now : state.hostAwaySince } };
    case 'leave': {
      const players = state.players.filter(item => item.id !== player.id);
      const answers = Object.fromEntries(Object.entries(state.answers).filter(([id]) => id !== player.id));
      if (!isHost) return { state: settle({ ...state, players, answers }) };
      const host = nextHost(state.players, player.id, true) ?? nextHost(state.players, player.id, false);
      return { state: settle({ ...state, players, answers, hostId: host?.id ?? state.hostId, hostAwaySince: host && !host.connected ? now : null }) };
    }
    case 'ready':
      if (state.phase !== 'lobby') return { state, error: 'wrong-phase' };
      if (player.ready === action.ready) return { state };
      return { state: { ...state, players: update(player.id, { ready: action.ready }) } };
  }

  if (action.type === 'submit') {
    if (state.phase !== 'question') return { state, error: 'wrong-phase' };
    if (player.id in state.answers) return { state };
    return { state: settle({ ...state, answers: { ...state.answers, [player.id]: action.answer } }) };
  }

  if (!isHost) return { state, error: 'not-host' };
  switch (action.type) {
    case 'settings':
      if (state.phase !== 'lobby') return { state, error: 'wrong-phase' };
      return { state: { ...state, error: null, settings: cleanSettings({ ...state.settings, ...action.settings }, state.settings) } };
    case 'remove':
      if (state.phase !== 'lobby') return { state, error: 'wrong-phase' };
      if (action.target === state.hostId || !state.players.some(item => item.id === action.target)) return { state };
      return { state: { ...state, players: state.players.filter(item => item.id !== action.target), removed: [...state.removed, action.target] } };
    case 'start':
      if (state.phase !== 'lobby') return { state, error: 'wrong-phase' };
      if (!action.early && state.players.some(item => item.id !== state.hostId && !item.ready)) return { state, error: 'not-ready' };
      return { state: { ...state, phase: 'loading', error: null, deadline: now + LOADING_MS } };
    case 'next':
      if (state.phase !== 'reveal') return { state, error: 'wrong-phase' };
      if (state.current + 1 >= state.questions.length) return { state: { ...state, phase: 'final' } };
      return { state: ask(state, state.current + 1, now) };
    case 'again':
      if (state.phase !== 'final') return { state, error: 'wrong-phase' };
      return { state: { ...state, phase: 'lobby', questions: [], surahNames: {}, current: 0, answers: {}, results: {}, players: state.players.map(item => ({ ...item, ready: false, score: 0 })) } };
  }
  return { state };
}

export function nextWake(state: PartyState) {
  return Math.min(
    state.deadline ?? Infinity,
    state.hostAwaySince === null ? Infinity : state.hostAwaySince + HOST_GRACE_MS,
    state.touched + IDLE_MS,
  );
}

export const expired = (state: PartyState, now: number) => now >= state.touched + IDLE_MS;

export type PlayerView = Player & { submitted: boolean; earned: number | null };
export type PartyView = {
  code: string;
  you: string;
  hostId: string;
  phase: Phase;
  settings: PartySettings;
  players: PlayerView[];
  index: number;
  total: number;
  question: PartyQuestion | null;
  surahNames: Record<number, string>;
  deadline: number | null;
  now: number;
  answer: QuestionAnswer | null;
  result: Points | null;
  error: string | null;
};

// docs/adr/0032-a-party-s-questions-are-fixed-when-the-host-starts-it.md
export function viewFor(state: PartyState, playerId: string, now: number): PartyView {
  const revealed = state.phase === 'reveal';
  const question = state.phase === 'question' || revealed ? state.questions[state.current] : null;
  const hidden = question && !revealed ? { ...question, correctAnswer: '', evidence: undefined } : question;
  return {
    code: state.code,
    you: playerId,
    hostId: state.hostId,
    phase: state.phase,
    settings: state.settings,
    players: state.players.map(player => ({ ...player, submitted: player.id in state.answers, earned: revealed ? state.results[player.id]?.earned ?? 0 : null })),
    index: state.current,
    total: state.questions.length,
    question: hidden,
    surahNames: state.surahNames,
    deadline: state.phase === 'question' ? state.deadline : null,
    now,
    answer: state.answers[playerId] ?? null,
    result: revealed ? state.results[playerId] ?? null : null,
    error: state.error,
  };
}

export const leaderboard = <T extends Pick<Player, 'score' | 'name'>>(players: T[]) =>
  [...players].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
