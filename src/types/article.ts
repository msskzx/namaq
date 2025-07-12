import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export interface Article {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: IconDefinition;
  color: string;
  href: string;
  available: boolean;
} 