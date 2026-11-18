import { describe, expect, it } from 'vitest';
import { ayahPreview, PREVIEW_MAX } from './ayahPreview';

describe("the reader's ayah preview", () => {
  it('lists the trees holding the ayah, each with its own page', () => {
    const { trees } = ayahPreview('2:25');
    expect(trees.length).toBeGreaterThan(0);
    expect(trees.length).toBeLessThanOrEqual(PREVIEW_MAX);
    for (const tree of trees) {
      expect(tree.href).toBe(`/quran/branches?o=${encodeURIComponent(tree.id).replace(/%20/g, '+')}`);
      expect(tree.ayat.some(ayah => ayah.key === '2:25')).toBe(true);
    }
  });

  it('gives the other ayah of each compare card, its shared words marked', () => {
    const [card] = ayahPreview('2:5').compare;
    expect(card.page).toBe('البَقَرَةْ مع لُقْمَانْ');
    expect(card.partner).toBe('لُقْمَانْ ٥');
    expect(card.href).toContain('/quran/compare?a=2&b=31');
    expect(card.words.every(word => word.shared)).toBe(true);
  });

  it('is empty for an ayah with no tree or compare card', () => {
    // 2:21 has its own card now: al-Kirmani's entry on the call «يا أيها الناس اعبدوا ربكم», said only there.
    expect(ayahPreview('2:20')).toEqual({ trees: [], compare: [] });
    expect(ayahPreview('2:21').trees).toHaveLength(1);
  });
});
