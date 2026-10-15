import type { SharedTopic } from '@/lib/quran/topicTypes';

export function toThemeRows(shared: SharedTopic[]) {
  return shared.map(({ labelAr, a, b }) => ({ theme: labelAr, a, b }));
}
