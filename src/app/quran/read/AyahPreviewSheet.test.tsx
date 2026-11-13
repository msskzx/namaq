import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { qiraatOf } from '@shared/quran/qiraatData';
import AyahPreviewSheet from './AyahPreviewSheet';

beforeAll(() => {
  HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) { this.open = true; };
  HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) { this.open = false; };
});
afterEach(cleanup);

describe('the readings sheet', () => {
  it("lists each differing word, Hafs's reading first, with who reads each and the source", () => {
    render(<AyahPreviewSheet preview={{ kind: 'readings', key: '2:85', qiraat: qiraatOf('2:85') }} onClose={vi.fn()} />);
    expect(screen.getByText('تَعۡمَلُونَ')).toBeTruthy();
    expect(screen.getByText('يعملون')).toBeTruthy();
    expect(screen.getAllByText('الباقون').length).toBeGreaterThan(0);
    expect(screen.getByText('المصدر: الموسوعة القرآنية').getAttribute('href')).toBe('https://quranpedia.net');
  });
});
