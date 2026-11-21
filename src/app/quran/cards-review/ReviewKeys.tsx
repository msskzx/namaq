'use client';

import { useEffect } from 'react';
import { useNavigatingRouter } from '@/components/common/NavigationLoader';

/** Keys by position, so an Arabic keyboard presses the same choice as an English one. */
const ACTIONS: Record<string, string> = { KeyA: 'keep', KeyR: 'drop', KeyD: 'discuss' };

/**
 * The review by keyboard (owner 2026-11-21): up and down move between the cards, left and right turn the page as an Arabic book
 * does, and a, r, d press keep, drop and discuss on the current card, then move to the next. After the last card it turns the
 * page or leaves no card current, so a second press never undoes the first. A click on a card makes it the current one. It
 * listens before the matrices, which slide on left and right too (`AyahCards`).
 */
export default function ReviewKeys({ previous, next }: { previous?: string; next?: string }) {
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
    const onPointer = (event: PointerEvent) => {
      const card = (event.target as Element).closest?.('[data-review-card]');
      if (card) select(cards().indexOf(card as HTMLElement), false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      if ((event.target as Element).closest?.('input, textarea, select, [contenteditable="true"]')) return;
      const action = ACTIONS[event.code];
      if (event.key === 'ArrowDown') select(at + 1, true);
      else if (event.key === 'ArrowUp') select(at - 1, true);
      else if (event.key === 'ArrowLeft') { if (next) router.push(next); }
      else if (event.key === 'ArrowRight') { if (previous) router.push(previous); }
      else if (action) {
        if (event.repeat) return event.preventDefault();
        const list = cards();
        const button = list[at]?.querySelector<HTMLButtonElement>(`[data-card-action="${action}"]`);
        if (!button) return;
        button.click();
        if (at < list.length - 1) select(at + 1, true);
        else if (next) router.push(next);
        else {
          at = list.length;
          list.forEach(card => card.removeAttribute('data-current'));
        }
      } else return;
      event.preventDefault();
    };
    document.addEventListener('pointerdown', onPointer);
    window.addEventListener('keydown', onKey, true);
    return () => { document.removeEventListener('pointerdown', onPointer); window.removeEventListener('keydown', onKey, true); };
  }, [previous, next, router]);
  return <p className="text-sm text-[var(--home-muted)]">↑ ↓ بين البطاقات، ← → بين الصفحات · a إبقاء · r حذف · d للنقاش</p>;
}
