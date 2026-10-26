import { describe, expect, it } from 'vitest';
import { act, cleanSettings, createParty, expired, HOST_GRACE_MS, IDLE_MS, leaderboard, LOADING_MS, nextWake, quizQuery, viewFor, type Action, type PartyQuestion, type PartyState } from './rules';

const choice = (key: string, correctAnswer = 'a'): PartyQuestion => ({ key, correctAnswer, choices: [{ value: 'a', labelArabic: 'أ' }, { value: 'b', labelArabic: 'ب' }] });
const tree: PartyQuestion = {
  key: 'tree', correctAnswer: 'tree', asked: [0, 1],
  tree: { words: ['قال'], ayat: [], children: [{ words: ['رب'], ayat: ['1:1'], children: [] }, { words: ['يا'], ayat: ['1:2'], children: [] }] },
};

function run(state: PartyState, actions: Action[], now = 0) {
  return actions.reduce((current, action) => act(current, action, now).state, state);
}

function lobby(...names: string[]) {
  return run(createParty('123456', 'p0', 'Host', 0), names.map((name, index) => ({ type: 'join', playerId: `p${index}`, name })));
}

function playing(questions: PartyQuestion[] = [choice('q1'), choice('q2')]) {
  return run(lobby('Host', 'Amina', 'Bilal'), [
    { type: 'start', playerId: 'p0', early: true },
    { type: 'loaded', questions, surahNames: {} },
  ]);
}

describe('party lobby', () => {
  it('keeps names unique, ignoring case and spaces', () => {
    const state = lobby('Host', 'Amina');
    expect(act(state, { type: 'join', playerId: 'p2', name: '  amina ' }, 0).error).toBe('name-taken');
    expect(act(state, { type: 'join', playerId: 'p2', name: '   ' }, 0).error).toBe('name-empty');
  });

  it('lets only the host change settings, and cleans what it sends', () => {
    const state = lobby('Host', 'Amina');
    expect(act(state, { type: 'settings', playerId: 'p1', settings: { length: 10 } }, 0).error).toBe('not-host');
    const next = act(state, { type: 'settings', playerId: 'p0', settings: { length: 7, seconds: 30, juzFrom: 29, juzTo: 3 } }, 0).state;
    expect(next.settings).toMatchObject({ length: 5, seconds: 30, juzFrom: 3, juzTo: 29 });
  });

  it('asks the host to confirm a start before every player is ready', () => {
    const state = lobby('Host', 'Amina', 'Bilal');
    expect(act(state, { type: 'start', playerId: 'p0' }, 0).error).toBe('not-ready');
    const ready = run(state, [{ type: 'ready', playerId: 'p1', ready: true }, { type: 'ready', playerId: 'p2', ready: true }]);
    expect(act(ready, { type: 'start', playerId: 'p0' }, 0).state.phase).toBe('loading');
    expect(act(state, { type: 'start', playerId: 'p0', early: true }, 0).state.phase).toBe('loading');
    expect(act(state, { type: 'start', playerId: 'p1', early: true }, 0).error).toBe('not-host');
  });

  it('lets the host remove a player in the lobby only', () => {
    const state = lobby('Host', 'Amina');
    expect(act(state, { type: 'remove', playerId: 'p0', target: 'p1' }, 0).state.players.map(player => player.name)).toEqual(['Host']);
    expect(act(playing(), { type: 'remove', playerId: 'p0', target: 'p1' }, 0).error).toBe('wrong-phase');
  });

  it('returns to the lobby with the error when the questions fail to load', () => {
    const state = run(lobby('Host', 'Amina'), [{ type: 'ready', playerId: 'p1', ready: true }, { type: 'start', playerId: 'p0' }, { type: 'failed', error: 'Not enough approved questions' }]);
    expect(state).toMatchObject({ phase: 'lobby', error: 'Not enough approved questions' });
    expect(state.players.every(player => !player.ready)).toBe(true);
  });
});

describe('party lobby, continued', () => {
  it('keeps a removed device out', () => {
    const state = act(lobby('Host', 'Amina'), { type: 'remove', playerId: 'p0', target: 'p1' }, 0).state;
    expect(act(state, { type: 'join', playerId: 'p1', name: 'Amina 2' }, 0).error).toBe('removed');
  });

  it('gives up on questions that never arrive', () => {
    const state = act(lobby('Host'), { type: 'start', playerId: 'p0' }, 0).state;
    expect(nextWake(state)).toBe(LOADING_MS);
    expect(act(state, { type: 'tick' }, LOADING_MS)).toMatchObject({ state: { phase: 'lobby', error: 'Failed to build the quiz' } });
  });

  it('changes nothing, not even the idle clock, for a no-op', () => {
    const state = lobby('Host', 'Amina');
    expect(act(state, { type: 'tick' }, 5).state).toBe(state);
    expect(act(state, { type: 'ready', playerId: 'p1', ready: false }, 5).state).toBe(state);
    expect(act(state, { type: 'start', playerId: 'p1' }, 5).state).toBe(state);
  });

  it('hands the party on when its creator never connects', () => {
    let state = createParty('1', 'p0', 'Host', 0);
    state = act(state, { type: 'join', playerId: 'p1', name: 'Amina' }, 1000).state;
    expect(state.hostAwaySince).toBe(0);
    expect(act(state, { type: 'tick' }, HOST_GRACE_MS).state.hostId).toBe('p1');
  });
});

describe('party questions', () => {
  it('closes the party to new players once it starts, but lets a dropped device back in', () => {
    const state = act(playing(), { type: 'disconnect', playerId: 'p1' }, 0).state;
    expect(act(state, { type: 'join', playerId: 'p9', name: 'Late' }, 0).error).toBe('started');
    const back = act(state, { type: 'join', playerId: 'p1', name: 'Other name' }, 0).state;
    expect(back.players[1]).toMatchObject({ name: 'Amina', connected: true });
  });

  it('lets a dropped player back in under their own name even if it is now taken', () => {
    let state = act(playing(), { type: 'disconnect', playerId: 'p1' }, 0).state;
    expect(state.players[1].connected).toBe(false);
    expect(act(state, { type: 'disconnect', playerId: 'p1' }, 0).state).toBe(state);
    state = act(state, { type: 'join', playerId: 'p1', name: 'Bilal' }, 0).state;
    expect(state.players.map(player => player.name)).toEqual(['Host', 'Amina', 'Bilal']);
    expect(state.players[1].connected).toBe(true);
  });

  it('reveals only when every player has answered', () => {
    let state = playing();
    state = run(state, [{ type: 'submit', playerId: 'p0', answer: 'a' }, { type: 'submit', playerId: 'p1', answer: 'b' }]);
    expect(state.phase).toBe('question');
    state = act(state, { type: 'submit', playerId: 'p2', answer: 'a' }, 0).state;
    expect(state.phase).toBe('reveal');
    expect(state.players.map(player => player.score)).toEqual([1, 0, 1]);
  });

  it('keeps the first answer a player sends', () => {
    const state = run(playing(), [{ type: 'submit', playerId: 'p1', answer: 'b' }, { type: 'submit', playerId: 'p1', answer: 'a' }]);
    expect(state.answers.p1).toBe('b');
  });

  it('reveals when the timer runs out, scoring nothing for a missing answer', () => {
    const state = act(playing(), { type: 'submit', playerId: 'p0', answer: 'a' }, 0).state;
    const deadline = state.deadline!;
    expect(deadline).toBe(60_000);
    expect(act(state, { type: 'tick' }, deadline - 1).state.phase).toBe('question');
    const revealed = act(state, { type: 'tick' }, deadline).state;
    expect(revealed.phase).toBe('reveal');
    expect(revealed.results).toEqual({ p0: { earned: 1, total: 1 }, p1: { earned: 0, total: 1 }, p2: { earned: 0, total: 1 } });
  });

  it('scores a tree question one point per asked leaf, on the longer timer', () => {
    let state = playing([tree]);
    expect(state.deadline).toBe(180_000);
    state = run(state, [
      { type: 'submit', playerId: 'p0', answer: ['رب', 'يا'] },
      { type: 'submit', playerId: 'p1', answer: ['رب', 'لا'] },
      { type: 'submit', playerId: 'p2', answer: ['', ''] },
    ]);
    expect(state.players.map(player => player.score)).toEqual([2, 1, 0]);
  });

  it('moves on only when the host taps next, then ends on the final leaderboard', () => {
    let state = run(playing(), ['p0', 'p1', 'p2'].map(playerId => ({ type: 'submit', playerId, answer: 'a' }) as Action));
    expect(act(state, { type: 'next', playerId: 'p1' }, 0).error).toBe('not-host');
    state = act(state, { type: 'next', playerId: 'p0' }, 5).state;
    expect(state).toMatchObject({ phase: 'question', current: 1, answers: {}, deadline: 60_005 });
    state = run(state, ['p0', 'p1', 'p2'].map(playerId => ({ type: 'submit', playerId, answer: 'b' }) as Action));
    state = act(state, { type: 'next', playerId: 'p0' }, 0).state;
    expect(state.phase).toBe('final');
    const again = act(state, { type: 'again', playerId: 'p0' }, 0).state;
    expect(again.phase).toBe('lobby');
    expect(again.players.map(player => player.score)).toEqual([0, 0, 0]);
  });

  it('does not wait for a player who leaves mid-question', () => {
    const state = run(playing(), [{ type: 'submit', playerId: 'p0', answer: 'a' }, { type: 'submit', playerId: 'p1', answer: 'a' }, { type: 'leave', playerId: 'p2' }]);
    expect(state.phase).toBe('reveal');
  });
});

describe('party host', () => {
  it('passes to the next player who joined when the host leaves', () => {
    const state = act(lobby('Host', 'Amina', 'Bilal'), { type: 'leave', playerId: 'p0' }, 0).state;
    expect(state.hostId).toBe('p1');
  });

  it('passes to the next joiner even when they are away, and on again if they stay away', () => {
    let state = run(lobby('Host', 'Amina', 'Bilal'), [{ type: 'disconnect', playerId: 'p1' }]);
    state = act(state, { type: 'leave', playerId: 'p0' }, 1000).state;
    expect(state).toMatchObject({ hostId: 'p2', hostAwaySince: null });
    state = run(lobby('Host', 'Amina', 'Bilal'), [{ type: 'disconnect', playerId: 'p1' }, { type: 'disconnect', playerId: 'p2' }]);
    state = act(state, { type: 'leave', playerId: 'p0' }, 1000).state;
    expect(state).toMatchObject({ hostId: 'p1', hostAwaySince: 1000 });
    state = act(state, { type: 'join', playerId: 'p2', name: 'Bilal' }, 2000).state;
    expect(act(state, { type: 'tick' }, 1000 + HOST_GRACE_MS).state.hostId).toBe('p2');
  });

  it('passes on when the host stays disconnected past the grace period', () => {
    const state = act(playing(), { type: 'disconnect', playerId: 'p0' }, 1000).state;
    expect(nextWake(state)).toBe(1000 + HOST_GRACE_MS);
    expect(act(state, { type: 'tick' }, 1000 + HOST_GRACE_MS - 1).state.hostId).toBe('p0');
    expect(act(state, { type: 'tick' }, 1000 + HOST_GRACE_MS).state.hostId).toBe('p1');
    const back = act(state, { type: 'join', playerId: 'p0', name: 'Host' }, 2000).state;
    expect(act(back, { type: 'tick' }, 1000 + HOST_GRACE_MS).state.hostId).toBe('p0');
  });
});

describe('party view', () => {
  it('hides the correct choice and its source until the reveal', () => {
    const state = playing([{ ...choice('q1'), evidence: { reference: { excerpt: 'x' } } }]);
    expect(viewFor(state, 'p1', 0).question).toMatchObject({ correctAnswer: '', evidence: undefined });
    const revealed = run(state, ['p0', 'p1', 'p2'].map(playerId => ({ type: 'submit', playerId, answer: 'b' }) as Action));
    const view = viewFor(revealed, 'p1', 0);
    expect(view.question?.correctAnswer).toBe('a');
    expect(view.result).toEqual({ earned: 0, total: 1 });
  });

  it('shows who has submitted but not what they answered', () => {
    const view = viewFor(act(playing(), { type: 'submit', playerId: 'p2', answer: 'a' }, 0).state, 'p1', 0);
    expect(view.players.map(player => player.submitted)).toEqual([false, false, true]);
    expect(view.answer).toBeNull();
  });
});

describe('party helpers', () => {
  it('builds the solo quiz query from the settings', () => {
    expect(quizQuery(cleanSettings({ topics: ['BRANCHES', 'PEOPLE'], length: 10, juzFrom: 28, juzTo: 30, leaves: 4 }))).toBe('topic=BRANCHES&topic=PEOPLE&length=10&juzFrom=28&juzTo=30&leaves=4');
    expect(quizQuery(cleanSettings({ topics: ['PERSON_CIRCLE'], person: 'ali' }))).toBe('topic=PERSON_CIRCLE&length=5&person=ali');
  });

  it('expires an idle party', () => {
    const state = createParty('1', 'p0', 'Host', 0);
    expect(expired(state, IDLE_MS - 1)).toBe(false);
    expect(expired(state, IDLE_MS)).toBe(true);
  });

  it('ranks the leaderboard by score, then name', () => {
    expect(leaderboard([{ name: 'b', score: 1 }, { name: 'a', score: 1 }, { name: 'c', score: 2 }]).map(player => player.name)).toEqual(['c', 'a', 'b']);
  });
});
