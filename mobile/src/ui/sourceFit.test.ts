import { describe, expect, it } from 'vitest';
import { fitted, REST } from './sourceFit';

describe('the books on a source line', () => {
  const names = ['سير أعلام النبلاء', 'صحيح البخاري', 'الطبقات الكبرى'];
  const widths = { 'سير أعلام النبلاء، ': 100, 'صحيح البخاري، ': 80, 'الطبقات الكبرى، ': 90, [REST]: 40 };

  it('names them all when they fit, or before they are measured', () => {
    expect(fitted(names, 300, widths)).toBe(names.join('، '));
    expect(fitted(names, 0, {})).toBe(names.join('، '));
  });

  it('names the whole books that fit with room for «وغيرها», and says it for the rest', () => {
    expect(fitted(names, 230, widths)).toBe(`سير أعلام النبلاء، صحيح البخاري، ${REST}`);
    expect(fitted(names, 150, widths)).toBe(`سير أعلام النبلاء، ${REST}`);
  });
});
