import type { MetadataRoute } from 'next';
import { SITE_DESCRIPTION } from '@/lib/siteMeta';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Namaq — نَمَق',
    short_name: 'Namaq',
    description: SITE_DESCRIPTION,
    lang: 'ar',
    dir: 'rtl',
    start_url: '/',
    display: 'standalone',
    background_color: '#f4ecdb',
    theme_color: '#f4ecdb',
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
