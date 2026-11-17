import type { SVGProps } from 'react';

/**
 * The «فاصلة»: a narrow ribbon, the page where the reader stopped (docs/plans/book-reader.md); the app draws the same.
 * No line across it (owner, 2026-11-17). Filled, it says this page is the فاصلة.
 */
export default function FasilaIcon({ filled = false, ...props }: SVGProps<SVGSVGElement> & { filled?: boolean }) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 3h6v18l-3-3.2L9 21z" />
    </svg>
  );
}
