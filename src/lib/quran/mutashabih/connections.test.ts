import { describe, expect, it } from 'vitest';
import { groups } from '@shared/quran/mutashabih/data';
import { wordConnections } from './connections';

const group = groups.find(group => group.citations.some(citation => citation.id === 'K02'))!;

describe('difference connections', () => {
  it('connects moved words to their matching occurrences', () => {
    expect(wordConnections(group, 'order')).toEqual(expect.arrayContaining([
      { from: { words: [{ key: '2:48', index: 11 }] }, to: { words: [{ key: '2:123', index: 14 }] } },
      { from: { words: [{ key: '2:48', index: 15 }] }, to: { words: [{ key: '2:123', index: 11 }] } },
    ]));
  });

  it('connects the replaced phrase independently from the moved nouns', () => {
    expect(wordConnections(group, 'word')).toEqual([{
      from: { words: [{ key: '2:48', index: 13 }, { key: '2:48', index: 14 }] },
      to: { words: [{ key: '2:123', index: 13 }] },
    }]);
  });

  it('connects an omitted word to the gap beside its nearest shared word', () => {
    const group = groups.find(group => group.citations.some(citation => citation.id === 'K01'))!;
    expect(wordConnections(group, 'addition_omission')).toEqual(expect.arrayContaining([
      expect.objectContaining({ from: { words: [{ key: '2:35', index: 8 }] }, to: expect.objectContaining({ gap: expect.objectContaining({ key: '7:19' }) }) }),
    ]));
  });
});
