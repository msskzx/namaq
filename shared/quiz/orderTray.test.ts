import { describe, expect, it } from 'vitest';
import { emptyTray, inTray, put, sentTray, tapBox, trayOf, trayResults } from './orderTray';
import { PICKS } from './choiceKinds';

const shuffled = ['80', '78', '81', '79'];

describe('the tray of names', () => {
  it('puts a tapped name in the lit box and lights the next empty one', () => {
    let tray = put(emptyTray(4), '78');
    tray = put(tray, '79');
    expect(tray.boxes).toEqual(['78', '79', null, null]);
    expect(tray.at).toBe(2);
    expect(inTray(shuffled, tray)).toEqual(['80', '81']);
  });

  it('lets the reader fill a later box first, then goes on after it and wraps to the empty ones before', () => {
    let tray = tapBox(emptyTray(4), 2);
    tray = put(tray, '80');
    expect(tray.at).toBe(3);
    tray = put(tray, '81');
    expect(tray.at).toBe(0);
    tray = put(put(tray, '78'), '79');
    expect(tray.at).toBeNull();
    expect(put(tray, '78')).toBe(tray);
  });

  it('sends a filled box\'s name back to the front of the tray, keeping the lit box', () => {
    let tray = put(put(put(emptyTray(4), '79'), '78'), '80');
    tray = tapBox(tray, 0);
    expect(tray.boxes).toEqual([null, '78', '80', null]);
    expect(tray.at).toBe(3);
    expect(inTray(shuffled, tray)).toEqual(['79', '81']);
  });

  it('sends empty boxes as nothing and grades them apart from wrong ones', () => {
    const tray = put(tapBox(put(emptyTray(4), '79'), 3), '81');
    const sent = sentTray(tray);
    expect(sent).toBe(['79', '', '', '81'].join(PICKS));
    expect(trayResults(['78', '79', '80', '81'], sent).map(box => box.state)).toEqual(['wrong', 'empty', 'empty', 'right']);
    expect(trayOf(sent, 4)).toEqual({ boxes: ['79', null, null, '81'], at: 1, back: [] });
  });
});
