import Link from 'next/link';
import Card from '@/components/common/Card';

export type PersonRow = { slug: string; name: string; line: string };

/**
 * People as rows in one card, as the app's components/tarajim/PersonRows: the name, and the kunya or laqab at the end in
 * muted text; a row opens the person's page. One card for the list, never a card for each person.
 */
export default function PersonRowList({ rows }: { rows: PersonRow[] }) {
  return (
    <Card className="px-3.5">
      <ul>
      {rows.map(row => (
        <li key={row.slug} className="border-t border-[var(--home-rule)]/30 first:border-t-0">
          <Link href={`/people/${row.slug}`} className="flex min-h-[50px] items-center gap-2 py-2 hover:text-[var(--home-accent)]">
            <span className="flex-1 text-lg">{row.name}</span>
            {row.line && <span className="max-w-[50%] text-end text-sm text-[var(--home-muted)]">{row.line}</span>}
          </Link>
        </li>
      ))}
      </ul>
    </Card>
  );
}
