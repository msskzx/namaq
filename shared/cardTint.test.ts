import { describe, expect, it } from 'vitest';
import { cardColour, currentTile, parseCardTint } from './cardTint';

describe('card tint', () => {
  it('falls back to paper and dark for missing or unknown values', () => {
    expect(parseCardTint('light', null)).toBe('paper');
    expect(parseCardTint('dark', 'cream')).toBe('dim');
    expect(cardColour('dark', 'black')).toBe('#0b0b0b');
    expect(cardColour('light', 'nope')).toBe('#f4ecdb');
  });
  it('marks device when following the phone, else the mode\'s tint', () => {
    expect(currentTile('system', { light: 'cream', dark: 'black' })).toBe('device');
    expect(currentTile('dark', { light: 'cream', dark: 'black' })).toBe('black');
    expect(currentTile('light', { light: 'x', dark: 'black' })).toBe('paper');
  });
});
