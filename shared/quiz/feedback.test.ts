import { expect, it } from 'vitest';
import { correctionOf, gradedTree } from './feedback';

it('puts each checked answer on the matrix row of its ayah, and none on a given row', () => {
  const tree = { words: ['قال'], ayat: [], children: [
    { words: ['ربنا'], ayat: ['1:1'], children: [] },
    { words: ['يا', 'قوم'], ayat: ['2:1', '3:1'], children: [] },
    { words: ['موسى'], ayat: ['4:1'], children: [] },
  ] };
  const { rows } = gradedTree({ tree, asked: [0, 1] }, ['ربنا', 'كلام', 'موسى']);
  expect(correctionOf(rows, '1:1')).toMatchObject({ number: 1, correct: true });
  expect(correctionOf(rows, '2:1')).toMatchObject({ number: 2, correct: false });
  expect(correctionOf(rows, '3:1')).toMatchObject({ number: 2 });
  expect(correctionOf(rows, '4:1')).toBeUndefined();
});
