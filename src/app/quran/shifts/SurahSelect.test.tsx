// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import SurahSelect from './SurahSelect';

afterEach(cleanup);

describe('SurahSelect', () => {
  it('submits its form as soon as a surah is chosen', () => {
    const submit = vi.fn();
    const { container } = render(<form><SurahSelect value={78} options={[{ number: 78, label: 'النبإ' }, { number: 79, label: 'النازعات' }]} /></form>);
    (container.querySelector('form') as HTMLFormElement).requestSubmit = submit;
    fireEvent.change(screen.getByRole('combobox', { name: 'السورة' }), { target: { value: '79' } });
    expect(submit).toHaveBeenCalledOnce();
  });
});
