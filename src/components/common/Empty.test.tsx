// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Empty from './Empty';

describe('Empty', () => {
  afterEach(cleanup);

  it('says what is missing as a status line', () => {
    render(<Empty text="Nothing saved yet." />);
    expect(screen.getByRole('status').textContent).toBe('Nothing saved yet.');
  });

  it('puts an action under the line', () => {
    render(<Empty text="Not enough questions."><button>Back</button></Empty>);
    expect(screen.getByRole('status').nextElementSibling?.textContent).toBe('Back');
  });
});
