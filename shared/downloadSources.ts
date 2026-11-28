
export const WEBSITE = 'https://namaq.vercel.app';
export const GITHUB_FILES = 'https://raw.githubusercontent.com/msskzx/namaq/main/';

export type BookSource = 'website' | 'github';
export const BOOK_SOURCE: BookSource = 'github';

// see docs/audits/2026-11-17-audio-playback.md
export type AudioSource = 'website' | 'direct';
export const AUDIO_SOURCE: AudioSource = 'website';
