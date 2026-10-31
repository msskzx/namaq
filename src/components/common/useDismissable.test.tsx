// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import useDismissable from './useDismissable';

afterEach(cleanup);

function Bubble() {
  const ref = useDismissable();
  return <><details ref={ref} open><summary>Help</summary><p>Inside</p></details><p>Outside</p></>;
}

it('closes on a press outside or Escape, and stays open on a press inside', () => {
  render(<Bubble />);
  const details = screen.getByText('Help').closest('details')!;
  fireEvent.pointerDown(screen.getByText('Inside'));
  expect(details.open).toBe(true);
  fireEvent.pointerDown(screen.getByText('Outside'));
  expect(details.open).toBe(false);
  details.open = true;
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(details.open).toBe(false);
});
