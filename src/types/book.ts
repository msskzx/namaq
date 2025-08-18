import { PersonBase } from '@/types/person';

export interface Page {
  id: string;
  bookId: string;
  page: number;
  chapter: number | null;
  text: string;
  mentionedPeople?: PersonBase[];
}

export interface Book {
  id: string;
  slug: string;
  volume: number;
  title: string;
  authorId: string;
  description: string | null;
  createdAt: Date;
  updatedAt?: Date;
}

export interface BookFull extends Book {
  author: PersonBase;
  mentionedPeople?: PersonBase[];
  pages: Page[];
}

export interface BookListResponse {
  books: BookFull[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BookFilters {
  search?: string;
  authorId?: string;
  volume?: number;
  page?: number;
  limit?: number;
}
