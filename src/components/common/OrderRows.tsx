"use client";

import { useRef, useState } from "react";
import { Check, GripVertical, ListStart } from "lucide-react";
import Button from "@/components/common/Button";
import { num } from "@shared/quran/arabicNumber";
import { givenOrder, misplaced, moved, orderJuz, sentOrder } from "@shared/quiz/orderAnswer";

type Choice = { value: string; labelArabic: string };

/**
 * A question that puts its choices in order («رتّب السور», owner 2026-11-20; sketch surah-order-quiz/sketch-dark.png): rows
 * the reader drags into place, the dragged one following the pointer and the others making room, the first in the mushaf on
 * top; then «تحقق». Once answered, the rows stand in the right order with each surah's number, green where the reader put
 * it, otherwise saying where he put it. The arrow keys move a focused row, for a keyboard. Solo, the feed card and a party
 * draw it; a party sends each move as a draft (`onDraft`), so the time running out grades the order as it stands.
 */
export default function OrderRows({ question, given, ar, onAnswer, onDraft, sent = false }: {
  question: { key: string; choices: Choice[]; order?: string[]; whereOf?: Record<string, string> };
  /** The order given, joined; undefined while it is still being put in order. */
  given: string | undefined;
  ar: boolean;
  onAnswer?: (value: string) => void;
  onDraft?: (value: string) => void;
  /** A party's order already sent, waiting for the reveal: shown as sent, not draggable. */
  sent?: boolean;
}) {
  const answered = given !== undefined && !!question.order?.length;
  const [state, setState] = useState({ key: question.key, values: question.choices.map(choice => choice.value) });
  const values = state.key === question.key ? state.values : question.choices.map(choice => choice.value);
  const set = (next: string[]) => { setState({ key: question.key, values: next }); onDraft?.(sentOrder(next)); };
  const [drag, setDrag] = useState<{ from: number; dy: number; start: number; step: number } | null>(null);
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const label = (value: string) => question.choices.find(choice => choice.value === value)?.labelArabic ?? value;
  const locked = answered || sent || !onAnswer;

  if (answered) {
    const right = question.order!;
    const placed = givenOrder(given);
    return <>
      <ol className="flex flex-col gap-2" aria-label={ar ? "الترتيب الصحيح" : "The right order"}>
        {right.map(value => {
          const wrong = misplaced(right, placed, value);
          const color = wrong ? "var(--home-accent)" : "var(--home-green)";
          return (
            <li key={value} className="flex min-h-12 items-center justify-between gap-3 rounded-sm border px-4 py-2" style={{ borderColor: color }}>
              <span className="text-lg text-[var(--home-ink)]">{label(value)}
                {question.whereOf?.[value] && <span className="ms-2 text-sm text-[var(--home-muted)]">{question.whereOf[value]}</span>}</span>
              <span className="text-sm" style={{ color }}>{wrong ? wrong[ar ? "ar" : "en"] : <Check size={18} aria-label={ar ? "في مكانها" : "In place"} />}</span>
            </li>
          );
        })}
      </ol>
      <Button className="mt-3 w-fit" href={`/quran/order?juz=${orderJuz(right)}`}><ListStart size={16} aria-hidden />{ar ? "ترتيب السور" : "Surah order"}</Button>
    </>;
  }

  // Where the dragged row would land: as many rows on as it has been moved, the others shifting a row to make room.
  const target = drag ? Math.max(0, Math.min(values.length - 1, drag.from + Math.round(drag.dy / drag.step))) : -1;
  const shift = (at: number) => {
    if (!drag || at === drag.from) return 0;
    if (drag.from < at && at <= target) return -drag.step;
    if (target <= at && at < drag.from) return drag.step;
    return 0;
  };
  const step = (at: number) => {
    const row = rows.current[at], next = rows.current[at + 1] ?? rows.current[at - 1];
    return row && next ? Math.abs(next.getBoundingClientRect().top - row.getBoundingClientRect().top) : (row?.offsetHeight ?? 56);
  };
  return <>
    <p className="mb-1 text-sm text-[var(--home-muted)]">{sent ? (ar ? "أُرسل ترتيبك." : "Your order is sent.") : (ar ? "اسحب كل سورة إلى مكانها، الأولى في المصحف في الأعلى." : "Drag each surah into place, the first in the mushaf on top.")}</p>
    <ol className="flex select-none flex-col gap-2" aria-label={ar ? "رتّب السور" : "Order the surahs"}>
      {values.map((value, at) => {
        const lifted = drag?.from === at;
        return (
          <li key={value} ref={element => { rows.current[at] = element; }} tabIndex={locked ? -1 : 0}
            aria-label={`${label(value)}، ${ar ? "المكان" : "place"} ${ar ? num(at + 1) : at + 1}`}
            className="flex min-h-12 touch-none items-center justify-between gap-3 rounded-sm border bg-[var(--home-card)] px-4 py-2 focus-visible:outline-2 focus-visible:outline-[var(--home-accent)]"
            style={{
              borderColor: lifted ? "var(--home-accent)" : "var(--home-rule)",
              transform: `translateY(${lifted ? drag!.dy : shift(at)}px)`,
              transition: lifted ? "none" : "transform 150ms ease",
              position: "relative", zIndex: lifted ? 2 : 1, boxShadow: lifted ? "0 8px 20px var(--home-shadow)" : undefined,
              cursor: locked ? "default" : lifted ? "grabbing" : "grab",
            }}
            onPointerDown={event => {
              if (locked) return;
              event.currentTarget.setPointerCapture(event.pointerId);
              setDrag({ from: at, dy: 0, start: event.clientY, step: step(at) });
            }}
            onPointerMove={event => { if (drag?.from === at) setDrag({ ...drag, dy: event.clientY - drag.start }); }}
            onPointerUp={() => { if (drag?.from === at) { if (target !== at) set(moved(values, at, target)); setDrag(null); } }}
            onPointerCancel={() => setDrag(null)}
            onKeyDown={event => {
              if (locked) return;
              const to = event.key === "ArrowUp" ? at - 1 : event.key === "ArrowDown" ? at + 1 : -1;
              if (to < 0 || to >= values.length) return;
              event.preventDefault();
              set(moved(values, at, to));
              requestAnimationFrame(() => rows.current[to]?.focus());
            }}>
            <span className="text-lg text-[var(--home-ink)]">{label(value)}</span>
            {!locked && <GripVertical size={20} className="text-[var(--home-muted)]" aria-hidden />}
          </li>
        );
      })}
    </ol>
    {onAnswer && !sent && <Button className="mt-3 w-fit" variant="primary" onClick={() => onAnswer(sentOrder(values))}>
      <Check size={16} aria-hidden />{ar ? "تحقق" : "Check"}</Button>}
  </>;
}
