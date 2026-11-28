import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/battle'));
export { ErrorBoundary } from '@/components/CrashScreen';
