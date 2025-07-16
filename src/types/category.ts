export interface Category {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  img?: string | null;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
} 