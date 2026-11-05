import Homepage from '@/components/homepage/Homepage';
import { getHomepageData } from '@/lib/homepageData';

export const dynamic = 'force-dynamic';

export default async function Home() {
  return <Homepage data={await getHomepageData()} />;
}
