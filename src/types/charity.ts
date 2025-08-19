export interface CharityLink {
  name: string;
  icon: string;
  url: string;
  type: 'WEBSITE' | 'SOCIAL' | 'DONATION' | string;
}

export interface CharityCategory {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  img: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Charity {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  img: string | null;
  city: string | null;
  country: string | null;
  isVerified: boolean;
  links: CharityLink[] | null;
  categories: {
    id: string;
    name: string;
    slug: string;
  }[];
  createdAt: string;
  updatedAt: string;
}