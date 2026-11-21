import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import OrderTray from './OrderTray';
import { PICKS } from '@shared/quiz/choiceKinds';

afterEach(cleanup);

const question = {
  key: 'ORDER_JUZ:78,79,80',
  choices: [{ value: '80', labelArabic: 'عبس' }, { value: '78', labelArabic: 'النبأ' }, { value: '79', labelArabic: 'النازعات' }],
  order: ['78', '79', '80'],
};
const names = () => within(screen.getByRole('list', { name: 'أسماء السور' })).queryAllByRole('button').map(button => button.textContent);

describe('OrderTray', () => {
  it('fills the lit box from the tray, sends a box back, and checks with a box left empty', () => {
    const onAnswer = vi.fn();
    render(<OrderTray question={question} given={undefined} ar onAnswer={onAnswer} />);
    fireEvent.click(screen.getByRole('button', { name: 'النبأ' }));
    fireEvent.click(screen.getByRole('button', { name: 'عبس' }));
    expect(names()).toEqual(['النازعات']);
    // A filled box pressed sends its name back to the front of the tray.
    fireEvent.click(screen.getByRole('button', { name: /^٧٩، عبس/ }));
    expect(names()).toEqual(['عبس', 'النازعات']);
    // An empty box pressed becomes the next one.
    fireEvent.click(screen.getByRole('button', { name: /^٨٠/ }));
    fireEvent.click(screen.getByRole('button', { name: 'عبس' }));
    fireEvent.click(screen.getByRole('button', { name: 'تحقق' }));
    expect(onAnswer).toHaveBeenCalledWith(['78', '', '80'].join(PICKS));
  });

  it('shows each box once checked: in place, a wrong name struck, and an empty box as not placed', () => {
    render(<OrderTray question={question} given={['78', '', '79'].join(PICKS)} ar />);
    const boxes = within(screen.getByRole('list', { name: 'الترتيب الصحيح' })).getAllByRole('listitem');
    expect(within(boxes[0]).getByLabelText('في مكانها')).toBeTruthy();
    expect(within(boxes[1]).getByText('لم تضعها')).toBeTruthy();
    expect(within(boxes[2]).getByText('النازعات').tagName).toBe('S');
    expect(screen.getByText('١ من ٣ في مكانها.')).toBeTruthy();
  });
});
