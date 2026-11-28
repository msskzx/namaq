import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/battles'));
export { ErrorBoundary } from '@/components/CrashScreen';
