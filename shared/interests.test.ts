// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { FEED_QUIZ_KINDS } from './quiz/feedQuiz';
import { activeInterests, FEED_CARD_KINDS, INTERESTS, interestOf, pickedInterests, SECTIONS, surpriseMe, toggledInterest, UNPLACED_QUIZ_KINDS } from './interests';

describe('interests', () => {
  beforeEach(() => localStorage.clear());

  it('places every feed card and question kind under exactly one interest', () => {
    expect(UNPLACED_QUIZ_KINDS).toEqual([]);
    for (const kind of [...FEED_CARD_KINDS, ...FEED_QUIZ_KINDS]) {
      const owners = INTERESTS.filter(interest => (interest.cards as readonly string[]).includes(kind) || (interest.quizzes as readonly string[]).includes(kind));
      expect(owners.map(interest => interest.id), kind).toHaveLength(1);
      expect(interestOf(kind)).toBe(owners[0]);
    }
  });

  it('gives each interest a known section and something to show', () => {
    const sections = new Set(SECTIONS.map(section => section.id));
    for (const interest of INTERESTS) {
      expect(sections.has(interest.section)).toBe(true);
      expect(interest.cards.length + interest.quizzes.length).toBeGreaterThan(0);
    }
    expect(new Set(INTERESTS.map(interest => interest.id)).size).toBe(INTERESTS.length);
  });

  it('keeps the picks in the list\'s order, drops unknown ids, and none picked means all', () => {
    expect(pickedInterests.read()).toEqual([]);
    pickedInterests.write(['sira', 'tafsir', 'nothing']);
    expect(pickedInterests.read()).toEqual(['tafsir', 'sira']);
    expect(toggledInterest(['tafsir', 'sira'], 'sira')).toEqual(['tafsir']);
    expect(toggledInterest(['tafsir'], 'irab')).toEqual(['tafsir', 'irab']);
    expect(activeInterests([]).length).toBe(INTERESTS.length);
    expect(activeInterests(['irab']).map(interest => interest.id)).toEqual(['irab']);
    // Picks with nothing of the kind asked fall back to all that have it.
    expect(activeInterests(['prophets'], interest => interest.quizzes.length > 0).length).toBe(INTERESTS.filter(interest => interest.quizzes.length).length);
  });

  it('has «فاجئني» on until it is turned off', () => {
    expect(surpriseMe.read()).toBe(true);
    surpriseMe.write(false);
    expect(surpriseMe.read()).toBe(false);
  });
});
