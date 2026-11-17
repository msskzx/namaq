import type { ReactNode } from 'react';

/**
 * The one "nothing here" line, as the app's ui/Empty: muted, centred, with room around it. Say what is missing and, when
 * there is one, the way to fill it («احفظ … لتجدها هنا»). `children` is an optional action under the line (a button
 * back). `className` is for its place only (a grid span, a margin). A notice that asks for a choice is the page's own text.
 */
export default function Empty({ text, children, className = '' }: { text: ReactNode; children?: ReactNode; className?: string }) {
  const line = <p role="status" className={`p-6 text-center text-[15px] leading-[26px] text-[var(--home-muted)] ${children ? 'pb-0' : className}`}>{text}</p>;
  if (!children) return line;
  return <div className={`flex flex-col items-center gap-4 pb-6 ${className}`}>{line}{children}</div>;
}
