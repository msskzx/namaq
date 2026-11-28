import type { AppCite, AppCited } from '../battles/battle';

export type AppLifeEntry = {
  kind: 'event' | 'battle' | 'story';
  slug: string;
  name: string;
  year?: AppCited<number>;
  role?: 'شهدها' | 'استشهد فيها';
  refs: AppCite[];
};

export type AppLife = Record<string, AppLifeEntry[]>;
