import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/hadith'));
export { ErrorBoundary } from '@/components/CrashScreen';
