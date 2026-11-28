import { describe, expect, it } from 'vitest';
import { dropOn, emptyTray, inTray, put, sentTray, takeOut, tapBox, trayFinds, trayOf, trayResults } from './orderTray';
import { SURAH_NAMES } from '../quran/surahNames';
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

describe('dragging names between the list and the boxes', () => {
  it('drops a name from the list on an empty box and moves the light off it', () => {
    const tray = dropOn(emptyTray(4), '80', 0);
    expect(tray.boxes).toEqual(['80', null, null, null]);
    expect(tray.at).toBe(1);
    expect(inTray(shuffled, tray)).toEqual(['78', '81', '79']);
  });

  it('keeps the light where it was when the name lands on another box', () => {
    const tray = dropOn(emptyTray(4), '81', 3);
    expect(tray.at).toBe(0);
  });

  it('sends the name already in a box back to the front of the list when another is dropped on it', () => {
    const tray = dropOn(dropOn(emptyTray(4), '80', 0), '78', 0);
    expect(tray.boxes).toEqual(['78', null, null, null]);
    expect(inTray(shuffled, tray)[0]).toBe('80');
  });

  it('swaps two boxes when one name is dragged onto the other, and moves a name to an empty box', () => {
    let tray = dropOn(dropOn(emptyTray(4), '79', 0), '78', 1);
    tray = dropOn(tray, '79', 1);
    expect(tray.boxes).toEqual(['78', '79', null, null]);
    tray = dropOn(tray, '79', 3);
    expect(tray.boxes).toEqual(['78', null, null, '79']);
    expect(inTray(shuffled, tray)).toEqual(['80', '81']);
  });

  it('does nothing when a name is dropped back on its own box', () => {
    const tray = dropOn(emptyTray(4), '79', 2);
    expect(dropOn(tray, '79', 2)).toBe(tray);
  });

  it('takes a dragged name out of its box back to the list', () => {
    const tray = takeOut(dropOn(emptyTray(4), '79', 2), '79');
    expect(tray.boxes).toEqual([null, null, null, null]);
    expect(inTray(shuffled, tray)[0]).toBe('79');
    expect(takeOut(tray, '79')).toBe(tray);
  });
});

describe('finding a surah in a long list', () => {
  const juz30 = Array.from({ length: 37 }, (_, i) => 78 + i);
  const found = (typed: string) => juz30.filter(surah => trayFinds(SURAH_NAMES[surah], typed));

  it('finds names by their first letters, with or without «ال»', () => {
    expect(found('ب')).toEqual([85, 90, 98]);
    expect(found('الب')).toEqual(found('ب'));
    expect(found('قر')).toEqual([106]);
  });

  it('shows every name when nothing is typed', () => {
    expect(found(' ')).toEqual(juz30);
  });

  it('never finds a surah by its number, which is the answer the boxes ask for', () => {
    expect(found('85')).toEqual([]);
    expect(found('٨٥')).toEqual([]);
  });
});
