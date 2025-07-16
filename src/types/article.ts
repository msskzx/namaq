export interface Article {
  id: string;
  title: string;
  titleEn?: string;
  summary?: string;
  summaryEn?: string;
  content?: string;
  contentEn?: string;
  slug: string;
  img?: string | null;
  isPublished: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
} 