import { redirect } from 'next/navigation';
import { modeHref } from '../../compare/modeHref';

export default async function QuranThemesCompareRedirect({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  redirect(modeHref('themes', await searchParams));
}
