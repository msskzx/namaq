import { EB_Garamond } from 'next/font/google';
import Homepage from '@/components/homepage/Homepage';
import { getHomePreviews } from '@/lib/homePreviewData';

const garamond = EB_Garamond({ subsets: ['latin'], variable: '--font-home-serif', display: 'swap' });

export const dynamic = 'force-dynamic';

export default async function Home() {
  return <Homepage data={await getHomePreviews()} fontClass={garamond.variable} />;
}
