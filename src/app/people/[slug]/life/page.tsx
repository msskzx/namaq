import { redirect } from 'next/navigation';

/** The old address of «حياتهما» (`/people/a/life?with=b,c`), kept for links already shared: the page is /life now. */
export default async function PersonLifePage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ with?: string }> }) {
  const slugs = [(await params).slug, ...((await searchParams).with ?? '').split(',').filter(Boolean)];
  redirect(`/life?slugs=${slugs.join(',')}`);
}
