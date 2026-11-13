import { NextRequest, NextResponse } from 'next/server';
import { buildStory } from '@shared/quran/prophets/story';
import { STORIES } from '@shared/quran/prophets/stories';
import { keptViews, type PlaceVerdicts } from '@shared/quran/prophets/review';
import data from '@shared/quran/prophets/verdicts.json';
import { withUnappliedStoryReviews } from '@/lib/quran/curation/storyReviewLog';
import { searchAll, type SearchSources } from '@shared/quran/searchAll';
import { bundledSources } from '@shared/quran/searchSources';
import { listedPairs } from '@/app/quran/compare/pairCards';

/** The website's story pages show only the kept events, so events the review dropped whole are not offered. */
function websiteSources(): SearchSources {
  const sources = bundledSources(listedPairs);
  const verdicts = withUnappliedStoryReviews(data.places as PlaceVerdicts);
  const kept = new Set(Object.entries(STORIES).flatMap(([slug, story]) =>
    keptViews(slug, buildStory(story.events, { names: {}, ayah: () => '' }), verdicts).map(event => `${slug}|${event.title}`)));
  return { ...sources, events: sources.events?.filter(event => kept.has(`${event.slug}|${event.title}`)) };
}

let sources: SearchSources | undefined;

/** The one search (/search): every group but the reader's notes, which stay in the browser. docs/plans/search-everything.md */
export function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q') ?? '';
  const groups = searchAll((sources ??= websiteSources()), query);
  return NextResponse.json({ groups }, { headers: { 'Cache-Control': 'public, max-age=3600' } });
}
