// Test helpers for the written quizzes' blanks, which are recite mode's boxes (owner, 2026-11-19): BranchAnswers, CompareAnswers.
import { fireEvent, screen } from '@testing-library/react';

/** The first box of every blank whose name matches (a regex source), once for each row that draws it. */
export const firstBoxes = (name: string) => screen.queryAllByLabelText(new RegExp(`^${name}، (word 1|الكلمة ١)(:|$)`));

/**
 * Writes a blank as a reader does: a tap on its first box, then each word and a space into the one hidden field. Only as many
 * words as the blank has boxes (the words enough to grade it).
 */
export function writeBlank(name: string, text: string) {
  const firsts = firstBoxes(name);
  const boxes = screen.getAllByLabelText(new RegExp(`^${name}، `)).length / firsts.length;
  fireEvent.click(firsts[0]);
  const field = screen.getByLabelText(/^(Write the word|اكتب الكلمة)$/);
  for (const word of text.split(' ').slice(0, boxes)) fireEvent.change(field, { target: { value: `${word} ` } });
}
