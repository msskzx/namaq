import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/order'));
export { ErrorBoundary } from '@/components/CrashScreen';
