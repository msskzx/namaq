import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/hadithSahih'));
export { ErrorBoundary } from '@/components/CrashScreen';
