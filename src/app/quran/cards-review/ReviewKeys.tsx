'use client';

import { useEffect } from 'react';
import { useNavigatingRouter } from '@/components/common/NavigationLoader';

/** Keys by position, so an Arabic keyboard presses the same choice as an English one. */
const ACTIONS: Record<string, string> = { KeyA: 'keep', KeyD: 'drop', KeyQ: 'discuss' };

/**
 * The review by keyboard (owner 2026-11-21): up and down move between the cards, left and right turn the page as an Arabic book
 * does, and a, d, q press keep, drop and discuss on the current card, then move to the next. After the last card it turns the
 * page or leaves no card current, so a second press never undoes the first. A click on a card makes it the current one. It
 * listens before the matrices, which slide on left and right too (`AyahCards`).
 */
export default function ReviewKeys({ previous, next, unreviewed }: { previous?: string; next?: string; unreviewed?: boolean }) {
  const router = useNavigatingRouter();
  useEffect(() => {
    const cards = () => Array.from(document.querySelectorAll<HTMLElement>('[data-review-card]'));
    let at = 0;
    const select = (index: number, scroll: boolean) => {
      const list = cards();
      if (!list.length) return;
      at = Math.max(0, Math.min(list.length - 1, index));
      list.forEach((card, i) => card.toggleAttribute('data-current', i === at));
      if (scroll) list[at].scrollIntoView({ block: 'start', behavior: 'smooth' });
    };
    select(0, false);
    let pressed = false;
    // With «غير المراجَعة فقط» the cards pressed here leave the list, so the next page is this one again, reloaded.
    const forward = () => {
      if (unreviewed && pressed) router.refresh();
      else if (next) router.push(next);
    };
    const onClick = (event: MouseEvent) => {
      if ((event.target as Element).closest?.('[data-card-action]')) pressed = true;
    };
    const onPointer = (event: PointerEvent) => {
      const card = (event.target as Element).closest?.('[data-review-card]');
      if (card) select(cards().indexOf(card as HTMLElement), false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || document.querySelector('dialog[open]')) return;
      if ((event.target as Element).closest?.('input, textarea, select, [contenteditable="true"]')) return;
      const action = ACTIONS[event.code];
      if (event.key === 'ArrowDown') select(at + 1, true);
      else if (event.key === 'ArrowUp') select(at - 1, true);
      else if (event.key === 'ArrowLeft') forward();
      else if (event.key === 'ArrowRight') { if (previous) router.push(previous); }
      else if (action) {
        if (event.repeat) return event.preventDefault();
        const list = cards();
        const button = list[at]?.querySelector<HTMLButtonElement>(`[data-card-action="${action}"]`);
        if (!button) return;
        button.click();
        if (at < list.length - 1) select(at + 1, true);
        else {
          at = list.length;
          list.forEach(card => card.removeAttribute('data-current'));
          forward();
        }
      } else return;
      event.preventDefault();
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('click', onClick, true);
    window.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('keydown', onKey, true);
    };
  }, [previous, next, unreviewed, router]);
  return <p className="text-sm text-[var(--home-muted)]">↑ ↓ بين البطاقات، ← → بين الصفحات · a إبقاء · d حذف · q للنقاش</p>;
}
