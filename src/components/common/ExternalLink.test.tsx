import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import ExternalLink from './ExternalLink';

const ROOT = join(__dirname, '../../..');

function sources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === 'node_modules' ? [] : sources(path);
    return /\.[jt]sx?$/.test(entry.name) && !/\.test\.[jt]sx?$/.test(entry.name) ? [path] : [];
  });
}

/** Ways a file can send someone out of Namaq without the shared component, and so without the mark. */
const RAW_EXTERNAL = [
  /target=\{?["'`]_blank/,
  /<(a|Link|Button)\b[^>]*?href=\{?["'`]https?:/,
  /<a\b(?:[^>]|=>)*?href=\{[^}]*(url|Url|URL)\}/,
  /Linking\.openURL|\bopenURL\b|window\.open\(|openBrowserAsync/,
];
/** The two components themselves, and the quiz reference button that opens Namaq's own reader in a new tab. */
const ALLOWED = new Set(['src/components/common/ExternalLink.tsx', 'mobile/src/components/ExternalLink.tsx', 'src/components/common/QuizReferenceDialog.tsx']);

describe('ExternalLink', () => {
  afterEach(cleanup);

  it('opens in a new tab and ends with a mark that does not change the link name', () => {
    render(<ExternalLink href="https://shamela.ws/book/1" className="underline">الإتقان</ExternalLink>);
    const link = screen.getByRole('link', { name: 'الإتقان' });
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noreferrer');
    expect(link.getAttribute('class')).toBe('underline');
    const mark = link.querySelector('[data-external-mark]');
    expect(mark?.getAttribute('aria-hidden')).toBe('true');
    expect(link.lastElementChild).toBe(mark);
  });

  it('is the only way the website and the app link out', () => {
    const offenders = [...sources(join(ROOT, 'src')), ...sources(join(ROOT, 'mobile/src'))]
      .map(path => relative(ROOT, path))
      .filter(path => !ALLOWED.has(path))
      .filter(path => {
        const text = readFileSync(join(ROOT, path), 'utf8').replace(/\n\s*/g, ' ');
        return RAW_EXTERNAL.some(pattern => pattern.test(text));
      });
    expect(offenders).toEqual([]);
  });
});
