export interface VirtueEntry {
  id: string;
  text: string;
  speakerName: string | null;
  speakerSlug: string | null;
}

export function virtueSpeakerHref(entry: Pick<VirtueEntry, 'speakerSlug'>): string | null {
  return entry.speakerSlug ? `/people/${entry.speakerSlug}` : null;
}

export function virtueSpeakerLabel(name: string, language: 'ar' | 'en', says: string): string {
  return language === 'ar' ? `${says} ${name}:` : `${name} ${says}`;
}
