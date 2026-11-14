import { describe, expect, it } from 'vitest';
import { cleanPiece, joinPieces } from './sadiClean';

const ayah = (text: string) => `<span class="book-ayah text-primary">﴿${text}﴾</span>`;

describe('cleanPiece', () => {
  it('drops the edition footnotes and their marks, keeps the quotes and line breaks', () => {
    const html = `{١ - ٧} ${ayah('الْحَمْدُ لِلَّهِ')} ومن عداهم فلهم (١) نصيب منها.<br />\rواعلم (٢٣) أن<div class="foot-notes">(١) في ب: فله.<br />(٢٣) في ب: x.</div>`;
    expect(cleanPiece(html)).toBe('{١ - ٧} ﴿الْحَمْدُ لِلَّهِ﴾ ومن عداهم فلهم نصيب منها.\nواعلم أن');
  });

  it('keeps a numbered line the author wrote', () => {
    expect(cleanPiece('قبله.<br />\r(٢) المراد بالمنافقين')).toBe('قبله.\n(٢) المراد بالمنافقين');
  });

  it('cuts the next surah’s heading the dump appends, wherever it sits', () => {
    expect(cleanPiece('تفسير سورة البقرة<br />وهي مدنية')).toBe('');
    expect(cleanPiece('ونسأله العفو والعافية].<br />تفسير سورة الفيل<br />وهي مكية<div class="foot-notes">(١) x</div>')).toBe('ونسأله العفو والعافية].');
    expect(cleanPiece('<p class="text-center">[تمت بحمد لله]</p>تفسير سورة إذا زلزلت<br />وهي مدنية')).toBe('[تمت بحمد لله]');
    expect(cleanPiece('<p class="text-center">بسم الله الرحمن الرحيم</p>تفسير سورة الأعراف<br />مكية')).toBe('');
  });

  it('keeps the author’s own closing line and drops the surah’s own heading before its first range', () => {
    expect(cleanPiece('رضاه. تم تفسير سورة الحج، والحمد لله.')).toBe('رضاه. تم تفسير سورة الحج، والحمد لله.');
    expect(cleanPiece(`تفسير سورة المائدة<br />وهي مدنية<br />{١} ${ayah('يَا أَيُّهَا')}`)).toBe('{١} ﴿يَا أَيُّهَا﴾');
  });

  it('drops the printed page markers and lays a poem’s halves on one line', () => {
    expect(cleanPiece("كما قيل:<table class='poem'><tr><td>-[١٤١]- أطوف به</td><td>إليه</td></tr></table>")).toBe('كما قيل:\nأطوف به … إليه');
  });
});

describe('joinPieces', () => {
  it('carries a sentence over the page break and marks brace quotes as Quran', () => {
    expect(joinPieces(['عن النسيان في', 'العبادات {وَمَا كَانَ} {٢٨}'])).toBe('عن النسيان في العبادات ﴿وَمَا كَانَ﴾ {٢٨}');
  });
});
