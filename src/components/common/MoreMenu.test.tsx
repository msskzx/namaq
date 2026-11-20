// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CircleMinus } from 'lucide-react';
import MoreMenu from './MoreMenu';

const notMine = (onClick: () => void) => [{ Icon: CircleMinus, name: 'ليس من اهتماماتي', label: '«الحديث» ليس من اهتماماتي', onClick }];

// Owner, 2026-11-20: «ليس من اهتماماتي» moves into a «⋯» alone at the row's far left, and a card with no such choice has no «⋯».
describe('MoreMenu', () => {
  afterEach(cleanup);

  it('draws no «⋯» when the card has no choice', () => {
    render(<MoreMenu items={[]} />);
    expect(screen.queryByRole('button', { name: 'خيارات البطاقة' })).toBeNull();
  });

  it('opens on «⋯», runs the choice and closes', () => {
    const onClick = vi.fn();
    render(<MoreMenu items={notMine(onClick)} />);
    expect(screen.queryByRole('menuitem')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'خيارات البطاقة' }));
    fireEvent.click(screen.getByRole('menuitem', { name: '«الحديث» ليس من اهتماماتي' }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('closes on Escape and on a press outside, without acting', () => {
    const onClick = vi.fn();
    render(<MoreMenu items={notMine(onClick)} />);
    const more = screen.getByRole('button', { name: 'خيارات البطاقة' });
    fireEvent.click(more);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).toBeNull();
    fireEvent.click(more);
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole('menu')).toBeNull();
    expect(onClick).not.toHaveBeenCalled();
  });
});
