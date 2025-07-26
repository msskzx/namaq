export interface Category {
  id: string;
  name: string;
  nameTransliterated?: string;
  description?: string;
  descriptionTransliterated?: string;
  img?: string | null;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
} 