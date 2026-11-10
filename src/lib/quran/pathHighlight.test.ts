import { describe, expect, it } from 'vitest';
import { litPaths, pathToggleKey, togglePath } from './pathHighlight';

describe('pathToggleKey', () => {
  it('gives a single ayah the same identity across roots, leaves, and context nodes', () => {
    const pathButton = pathToggleKey('button-12', ['12']);
    const root = pathToggleKey('root-12', ['12']);
    const leaf = pathToggleKey('leaf-12', ['12']);
    const context = pathToggleKey('context-12', ['12']);

    expect(root).toBe(pathButton);
    expect(leaf).toBe(pathButton);
    expect(context).toBe(pathButton);
  });

  it('keeps multi-ayah and empty-ayah nodes independent by id', () => {
    expect(pathToggleKey('branch-a', ['12', '13'])).not.toBe(pathToggleKey('branch-b', ['12', '13']));
    expect(pathToggleKey('empty-a', [])).not.toBe(pathToggleKey('empty-b', []));
  });
});

describe('togglePath', () => {
  it('clears a single path when its leaf is clicked after its root', () => {
    const initial = new Map<string, string[]>();
    const selected = togglePath(initial, 'root-12', ['12']);
    const cleared = togglePath(selected, 'leaf-12', ['12']);

    expect(selected).toEqual(new Map([[pathToggleKey('root-12', ['12']), ['12']]]));
    expect(cleared).toEqual(new Map());
  });

  it('retains distinct selections for shared nodes with the same ayahs', () => {
    const initial = new Map<string, string[]>();
    const firstId = 'shared-a';
    const secondId = 'shared-b';
    const bothSelected = togglePath(togglePath(initial, firstId, ['12', '13']), secondId, ['12', '13']);
    const firstCleared = togglePath(bothSelected, firstId, ['12', '13']);

    expect(firstCleared).toEqual(new Map([[pathToggleKey(secondId, ['12', '13']), ['12', '13']]]));
    expect(bothSelected).toEqual(new Map([
      [pathToggleKey(firstId, ['12', '13']), ['12', '13']],
      [pathToggleKey(secondId, ['12', '13']), ['12', '13']],
    ]));
  });

  it('preserves other paths and an independent search selection when one path clears', () => {
    const searchId = 'search-result';
    const firstId = 'opening-12';
    const secondId = 'opening-13';
    const selected = togglePath(
      togglePath(togglePath(new Map<string, string[]>(), searchId, []), firstId, ['12']),
      secondId,
      ['13'],
    );
    const next = togglePath(selected, firstId, ['12']);

    expect(next).toEqual(new Map([[pathToggleKey(searchId, []), []], [pathToggleKey(secondId, ['13']), ['13']]]));
    expect(litPaths(next)).toEqual(new Set(['13']));
  });

  it('does not mutate the previous selection map', () => {
    const initial = new Map<string, string[]>([['opening-12', ['12']]]);

    togglePath(initial, 'opening-13', ['13']);

    expect(initial).toEqual(new Map([['opening-12', ['12']]]));
  });
});

describe('litPaths', () => {
  it('unions ayahs selected by independent nodes in an answer tree', () => {
    const answerTree = new Map<string, string[]>([
      [pathToggleKey('answer-root', ['31']), ['31']],
      [pathToggleKey('answer-leaf', ['32']), ['32']],
      [pathToggleKey('answer-context', ['31', '33']), ['31', '33']],
    ]);

    expect(litPaths(answerTree)).toEqual(new Set(['31', '32', '33']));
  });
});
