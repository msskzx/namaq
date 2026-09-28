import { prisma } from '@/lib/prisma';

export interface SitemapEntry {
  slug: string;
  updatedAt: Date | null;
}

export async function listPersonSlugs(): Promise<SitemapEntry[]> {
  const people = await prisma.person.findMany({ select: { slug: true } });
  return people.map(({ slug }: { slug: string }) => ({ slug, updatedAt: null }));
}

export async function listEventSlugs(): Promise<SitemapEntry[]> {
  const events = await prisma.event.findMany({ select: { slug: true, updatedAt: true } });
  return events;
}

export async function listBattleSlugs(): Promise<SitemapEntry[]> {
  const battles = await prisma.battle.findMany({ select: { slug: true, updatedAt: true } });
  return battles;
}

export async function listSourceSlugs(): Promise<SitemapEntry[]> {
  const sources = await prisma.historicalSource.findMany({ select: { slug: true, updatedAt: true } });
  return sources;
}
