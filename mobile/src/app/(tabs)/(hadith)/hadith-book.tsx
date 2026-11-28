import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/hadithBook'));
export { ErrorBoundary } from '@/components/CrashScreen';
