import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';
import { bodyMarkdown, extractShamelaPage, notesMarkdown, sliceEntry } from './shamelaEntry';

function pageDocument(inner: string, title = 'ج1 - ص5 - سير أعلام النبلاء') {
  return new JSDOM(`<!doctype html><title>${title}</title><div class="nass">${inner}</div>`).window.document;
}

const samplePage = `
  <p><span id="p1" class="anchor"></span>الْجُزْءُ الْأَوَّلُ<a href="#p1" class="btn_tag btn"><span class="fa"></span></a></p>
  <p><span id="p2" class="anchor"></span>١ - أَبُو عُبَيْدَةَ بنُ الجَرَّاحِ</p>
  <p><span id="p3" class="anchor"></span>٢ - طَلْحَةُ بنُ عُبَيْدِ اللهِ</p>
  <hr>
  <p class="hamesh">(*) مسند أحمد: ١ / ١٩٥</p>
`;

describe('extractShamelaPage', () => {
  it('separates the work text from the edition notes', () => {
    const page = extractShamelaPage(pageDocument(samplePage));

    expect(page.body.map((p) => p.anchor)).toEqual(['p1', 'p2', 'p3']);
    expect(page.notes).toEqual(['(*) مسند أحمد: ١ / ١٩٥']);
  });

  it('reads the printed page number from the title', () => {
    expect(extractShamelaPage(pageDocument(samplePage)).printedPage).toBe('5');
  });

  it('drops the copy-link buttons the reader injects', () => {
    const page = extractShamelaPage(pageDocument(samplePage));

    expect(page.body[0].text).toBe('الْجُزْءُ الْأَوَّلُ');
  });

  it('fails loudly when the page layout is not what it expects', () => {
    const document = new JSDOM('<!doctype html><title>ج1 - ص5</title><div></div>').window.document;

    expect(() => extractShamelaPage(document)).toThrow(/layout has changed/);
  });
});

describe('sliceEntry', () => {
  it('keeps only this entry when a page carries two', () => {
    const page = extractShamelaPage(pageDocument(samplePage));

    expect(sliceEntry(page, { startAnchor: 'p2', endAnchor: 'p2' }).body.map((p) => p.text)).toEqual(['١ - أَبُو عُبَيْدَةَ بنُ الجَرَّاحِ']);
  });

  it('keeps the whole page when neither end is named', () => {
    const page = extractShamelaPage(pageDocument(samplePage));

    expect(sliceEntry(page).body).toHaveLength(3);
  });

  it("drops the next entry's notes from a shared page", () => {
    const page = extractShamelaPage(
      pageDocument(`${samplePage.replace('(*) مسند أحمد: ١ / ١٩٥', '(٤) الكتم: نبت.(*) مسند أحمد: ١ / ١٦٠')}`),
    );

    const sliced = sliceEntry(page, { endAnchor: 'p2', notesEndMarker: '(*)' });

    expect(sliced.notes).toEqual(['(٤) الكتم: نبت.']);
  });

  it('refuses an anchor that is not on the page', () => {
    const page = extractShamelaPage(pageDocument(samplePage));

    expect(() => sliceEntry(page, { startAnchor: 'p9' })).toThrow(/not on this page/);
  });
});

describe('bodyMarkdown and notesMarkdown', () => {
  it('keeps the work text and the edition notes in separate documents', () => {
    const page = extractShamelaPage(pageDocument(samplePage));

    expect(bodyMarkdown(page)).not.toContain('مسند أحمد');
    expect(notesMarkdown(page)).toBe('(*) مسند أحمد: ١ / ١٩٥\n');
  });

  it('reports no notes as absent rather than as an empty document', () => {
    const page = extractShamelaPage(pageDocument('<p><span id="p1" class="anchor"></span>نص</p>'));

    expect(bodyMarkdown(page)).toBe('نص\n');
    expect(notesMarkdown(page)).toBeNull();
  });
});
