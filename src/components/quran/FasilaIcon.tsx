import type { SVGProps } from 'react';

/** The «فاصلة»: a ribbon across a line, where the reader stopped (docs/plans/book-reader.md); the app draws the same. */
export default function FasilaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 13h18" />
      <path d="M10 3h4v17l-2-2.2L10 20z" />
    </svg>
  );
}
