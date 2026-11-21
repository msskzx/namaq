"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Search } from "lucide-react";
import Button from "@/components/common/Button";
import Chip from "@/components/common/Chip";
import { num } from "@shared/quran/arabicNumber";
import { sentOrder } from "@shared/quiz/orderAnswer";
import { boxNumbers, emptyTray, inTray, put, sentTray, tapBox, trayOf, trayResults, type Tray } from "@shared/quiz/orderTray";

type Choice = { value: string; labelArabic: string };

/**
 * The app's OrderTray (owner, 2026-11-21; sketch surah-order-tray/sketch-dark.png): an order filled in numbered boxes from a
 * tray of names, for the long lists («رتّب سور الجزء», the surah-order page's practice). A name pressed goes into the lit
 * box and the next empty box lights; a filled box pressed sends its name back to the front of the tray; an empty box pressed
 * becomes the lit one. «تحقق» works at any time, an empty box counting as not placed. `pinned`: the tray keeps to the foot of
 * the window while the boxes scroll. Once checked, each box shows its surah green, accent with what was put there struck
 * through, or muted «لم تضعها»; `onBox` opens a surah's card. A party sends each change as a draft (`onDraft`).
 */
export default function OrderTray({ question, given, ar, onAnswer, onDraft, sent = false, onRetry, onLook, onBox, pinned = false, start, footer }: {
  question: { key: string; choices: Choice[]; order?: string[] };
  /** The order sent, joined; undefined while it is still being filled. */
  given: string | undefined;
  ar: boolean;
  onAnswer?: (value: string) => void;
  onDraft?: (value: string) => void;
  /** A party's boxes already sent, waiting for the reveal. */
  sent?: boolean;
  /** «أعد الخطأ فقط»: the wrong and empty boxes emptied again (the surah-order page's practice). */
  onRetry?: (start: string) => void;
  /** «ابحث عن الجواب» for the lit box: the surah whose place it is. */
  onLook?: (surah: number) => void;
  onBox?: (surah: number) => void;
  pinned?: boolean;
  start?: string;
  footer?: ReactNode;
}) {
  const values = question.choices.map(choice => choice.value);
  const numbers = boxNumbers(values);
  const label = (value: string) => question.choices.find(choice => choice.value === value)?.labelArabic ?? value;
  const [state, setState] = useState<{ key: string; tray: Tray }>(() => ({ key: question.key, tray: start ? trayOf(start, numbers.length) : emptyTray(numbers.length) }));
  const tray = state.key === question.key ? state.tray : emptyTray(numbers.length);
  const change = (next: Tray) => { setState({ key: question.key, tray: next }); onDraft?.(sentTray(next)); };
  const boxes = useRef<(HTMLLIElement | null)[]>([]);
  // The list follows the lit box, so the next box to fill stays in sight above the tray.
  useEffect(() => {
    if (pinned && tray.at !== null) boxes.current[tray.at]?.scrollIntoView?.({ block: "center", behavior: "smooth" });
  }, [pinned, tray.at]);
  const answered = given !== undefined && !!question.order?.length;
  const locked = answered || sent || !onAnswer;

  if (answered) {
    const all = trayResults(question.order!, given);
    const missed = all.filter(result => result.state !== "right").length;
    return <>
      <p className="mb-2 text-base" style={{ color: missed ? "var(--home-accent)" : "var(--home-green)" }}>
        {missed ? (ar ? `${num(all.length - missed)} من ${num(all.length)} في مكانها.` : `${all.length - missed} of ${all.length} in place.`) : (ar ? "كلها في مكانها." : "All in place.")}
      </p>
      {onBox && <p className="mb-2 text-sm text-[var(--home-muted)]">{ar ? "اضغط أي سورة لترى بطاقتها." : "Press a surah to see its card."}</p>}
      <ol className="flex flex-col gap-2" aria-label={ar ? "الترتيب الصحيح" : "The right order"}>
        {all.map((result, i) => {
          const color = result.state === "right" ? "var(--home-green)" : result.state === "wrong" ? "var(--home-accent)" : "var(--home-rule)";
          const inner = <>
            <span className="w-8 text-sm text-[var(--home-muted)]">{num(numbers[i])}</span>
            <span className="flex-1 text-lg" style={{ color: result.state === "empty" ? "var(--home-muted)" : "var(--home-ink)" }}>{label(result.right)}</span>
            {result.state === "right" ? <Check size={18} style={{ color }} aria-label={ar ? "في مكانها" : "In place"} />
              : result.state === "wrong" ? <s className="text-sm" style={{ color }} aria-label={`${ar ? "وضعت" : "You put"} ${label(result.given!)}`}>{label(result.given!)}</s>
              : <span className="text-sm text-[var(--home-muted)]">{ar ? "لم تضعها" : "Not placed"}</span>}
          </>;
          const style = { borderColor: color };
          const className = "flex min-h-12 w-full items-center gap-3 rounded-sm border-[1.5px] px-3 py-2 text-start";
          return <li key={result.right}>{onBox ? <button type="button" className={className} style={style} onClick={() => onBox(numbers[i])}>{inner}</button> : <div className={className} style={style}>{inner}</div>}</li>;
        })}
      </ol>
      {onRetry && missed > 0 && <Button className="mt-3 w-fit" variant="primary" onClick={() => onRetry(sentOrder(all.map(result => result.state === "right" ? result.right : "")))}>
        {ar ? "أعد الخطأ فقط" : "Redo the wrong ones"}</Button>}
      {footer}
    </>;
  }

  const left = inTray(values, tray);
  return <>
    <p className="mb-2 text-sm text-[var(--home-muted)]">{sent ? (ar ? "أُرسل ترتيبك." : "Your order is sent.") : (ar ? "اضغط اسمًا من الأسفل فيوضع في المربع المضيء." : "Press a name below to put it in the lit box.")}</p>
    <ol className="flex flex-col gap-2" aria-label={ar ? "رتّب السور" : "Order the surahs"}>
      {numbers.map((n, i) => {
        const value = tray.boxes[i];
        const lit = tray.at === i && !locked;
        return (
          <li key={n} ref={element => { boxes.current[i] = element; }}>
            <button type="button" disabled={locked} onClick={() => change(tapBox(tray, i))}
              aria-label={`${num(n)}، ${value ? `${label(value)}، ${ar ? "اضغط لإرجاعها" : "press to send back"}` : lit ? (ar ? "المربع التالي" : "next box") : (ar ? "فارغ" : "empty")}`}
              className="flex min-h-12 w-full items-center gap-3 rounded-sm px-3 py-2 text-start"
              style={{ background: value ? "var(--home-card)" : "transparent", border: value ? "none" : `1.5px ${lit ? "solid" : "dashed"} ${lit ? "var(--home-accent)" : "var(--home-rule)"}` }}>
              <span className="w-8 text-sm" style={{ color: lit ? "var(--home-accent)" : "var(--home-muted)" }}>{num(n)}</span>
              {value && <span className="text-lg text-[var(--home-ink)]">{label(value)}</span>}
            </button>
          </li>
        );
      })}
    </ol>
    {!locked && <div className={`mt-3 flex flex-col gap-2 border-t border-[var(--home-rule)] pt-3 ${pinned ? "sticky bottom-0 z-10 bg-[var(--home-paper)] pb-3" : ""}`}>
      <ul className={`flex flex-wrap gap-2 ${pinned ? "max-h-40 overflow-y-auto" : ""}`} aria-label={ar ? "أسماء السور" : "Surah names"}>
        {left.map(value => <li key={value}><Chip label={label(value)} onClick={() => change(put(tray, value))} /></li>)}
      </ul>
      <div className="flex flex-wrap gap-2">
        <Button className="w-fit" variant="primary" onClick={() => onAnswer!(sentTray(tray))}><Check size={16} aria-hidden />{ar ? "تحقق" : "Check"}</Button>
        {onLook && tray.at !== null && <Button className="w-fit" onClick={() => onLook(numbers[tray.at!])}><Search size={16} aria-hidden />{ar ? "ابحث عن الجواب" : "Look it up"}</Button>}
      </div>
    </div>}
  </>;
}
