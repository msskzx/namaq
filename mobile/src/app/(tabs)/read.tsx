import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/read'));
export { ErrorBoundary } from '@/components/CrashScreen';
