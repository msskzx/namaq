/**
 * Where the phone downloads what it keeps offline: books and recitations. Each kind has its sources side by side, and the
 * one in use is chosen here, so moving between them is one line and no source's code is lost (owner, 2026-11-21).
 */

/** The website: books from /api/books, recitations through Quran Foundation's Content Sync at /api/quran/listen-sync. */
export const WEBSITE = 'https://namaq.vercel.app';
/** The repository's files as GitHub serves them: gzipped, open to any origin, up whether or not the website is. */
export const GITHUB_FILES = 'https://raw.githubusercontent.com/msskzx/namaq/main/';

export type BookSource = 'website' | 'github';
/** GitHub while Vercel has the website paused (until 2026-12-20). */
export const BOOK_SOURCE: BookSource = 'github';

/**
 * `website`: Content Sync through the website, the only offline copy Quran Foundation's terms allow (terms §3.1,
 * docs/audits/2026-11-17-audio-playback.md). `direct`: each ayah's file straight from the address it streams from, no keys
 * and no website.
 */
export type AudioSource = 'website' | 'direct';
export const AUDIO_SOURCE: AudioSource = 'website';
