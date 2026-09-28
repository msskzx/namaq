import { describe, expect, it } from 'vitest';
import { metadata } from './page';

describe('/quizzes/questions metadata', () => {
  it('keeps the public review inventory out of search indexes', () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
