import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/siteUrl';
import {
  listBattleSlugs,
  listEventSlugs,
  listPersonSlugs,
  listSourceSlugs,
  type SitemapEntry,
} from '@/lib/siteContent';

const STATIC_ROUTES = ['/', '/about', '/people', '/events', '/battles', '/sources', '/titles', '/graphs', '/quizzes', '/references'];

function toSitemapEntries(basePath: string, entries: SitemapEntry[]): MetadataRoute.Sitemap {
  return entries.map(({ slug, updatedAt }) => ({
    url: `${SITE_URL}${basePath}/${slug}`,
    ...(updatedAt ? { lastModified: updatedAt } : {}),
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [people, events, battles, sources] = await Promise.all([
    listPersonSlugs(),
    listEventSlugs(),
    listBattleSlugs(),
    listSourceSlugs(),
  ]);

  return [
    ...STATIC_ROUTES.map((route) => ({ url: `${SITE_URL}${route}` })),
    ...toSitemapEntries('/people', people),
    ...toSitemapEntries('/events', events),
    ...toSitemapEntries('/battles', battles),
    ...toSitemapEntries('/sources', sources),
  ];
}
