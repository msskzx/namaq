import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/tree-sizes'), { warm: false });
