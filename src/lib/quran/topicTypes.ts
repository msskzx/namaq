export type TopicRange = { from: number; to: number };

export type TopicRecord = {
  slug: string;
  labelAr: string;
  themeId?: string | null;
  ayahFrom: number;
  ayahTo: number;
  excerptAr: string;
  alternativeOf?: string | null;
};

export type TopicInstance = TopicRecord & { surah: number };

export type SharedTopic = {
  slug: string;
  labelAr: string;
  a: TopicRange;
  b: TopicRange;
};
