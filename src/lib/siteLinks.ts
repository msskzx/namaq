import translations from '@/components/language/translations';

export interface SiteLink {
  href: string;
  label: string;
}

// The full site nav link list, shared between NavBar's mobile dropdown and
// the graph workspace's menu (src/components/graph/GraphCanvas.tsx) -- kept
// here once so the two never drift apart.
export const getAllNavLinks = (language: 'en' | 'ar'): SiteLink[] => [
  { href: '/graphs', label: translations[language].allGraph },
  { href: '/people/prophet-muhammad', label: translations[language].prophet },
  { href: '/people', label: translations[language].people },
  { href: '/events', label: translations[language].events },
  { href: '/battles', label: translations[language].battles.title },
];
