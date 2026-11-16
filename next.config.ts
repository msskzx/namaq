import type { NextConfig } from "next";

const BOOK_FILES = ['./shared/data/quran/tafsirSadi.json', './shared/data/quran/kashshaf.js', './shared/data/quran/irabUkbari.js'];

const nextConfig: NextConfig = {
  // The book reader reads its books from disk (src/lib/books/readerBook.ts).
  outputFileTracingIncludes: { '/quran/books/**': BOOK_FILES, '/api/books/**': BOOK_FILES },
  async redirects() {
    return [
      { source: '/quran/shifts', destination: '/quran/compare', permanent: true },
      { source: '/quran', has: [{ type: 'query', key: 's' }], destination: '/quran/compare', permanent: true },
      { source: '/quran/musa', destination: '/quran/prophets/musa', permanent: true },
      { source: '/references', destination: '/attributions', permanent: true },
      { source: '/quran/iltifat', destination: '/quran/balagha', permanent: true },
    ];
  },
};

export default nextConfig;
