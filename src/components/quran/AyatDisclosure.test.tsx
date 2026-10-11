// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import AyatDisclosure from './AyatDisclosure';

afterEach(cleanup);

describe('AyatDisclosure', () => {
  it('starts closed and names its title and ayah count', () => {
    const { container } = render(<AyatDisclosure title="٢٨ القصص ٧-٨" lines={[{ ayah: 7, text: 'أ' }, { ayah: 8, text: 'ب' }]} />);
    expect((container.querySelector('details') as HTMLDetailsElement).open).toBe(false);
    expect(screen.getByText('٢٨ القصص ٧-٨')).toBeTruthy();
    expect(screen.getByText('٢ آية')).toBeTruthy();
  });
});
