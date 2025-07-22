import { Category } from './category';

export interface Article {
  id: string;
  title: string;
  titleEn?: string;
  special: boolean;
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
  categories?: Category[];
} 