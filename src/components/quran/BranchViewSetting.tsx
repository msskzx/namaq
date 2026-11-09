'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { GalleryHorizontal } from 'lucide-react';
import Segmented from '@/components/common/Segmented';
import TreeIcon from '@/components/common/TreeIcon';
import { useLanguage } from '@/components/language/LanguageContext';
import { BRANCH_VIEW_COOKIE, parseBranchView, type BranchView } from '@/lib/quran/branchView';

export default function BranchViewSetting() {
  const router = useRouter();
  const ar = useLanguage().language === 'ar';
  const [view, setView] = useState<BranchView>(() => parseBranchView(Cookies.get(BRANCH_VIEW_COOKIE)) ?? 'tree');
  const choose = (value: BranchView) => {
    Cookies.set(BRANCH_VIEW_COOKIE, value, { expires: 365, sameSite: 'lax', path: '/' });
    setView(value);
    router.refresh();
  };
  const label = ar ? 'العرض الافتراضي للمتشابه' : 'Default similar-ayat view';
  return <div className="flex flex-col gap-1 px-3 py-2">
    <span aria-hidden className="text-sm text-[var(--home-muted)]">{label}</span>
    <Segmented label={label} options={[
      { key: 'tree', label: ar ? 'شجرة' : 'Tree', icon: <TreeIcon size={16} aria-hidden />, current: view === 'tree', onClick: () => choose('tree') },
      { key: 'cards', label: ar ? 'مصفوفة' : 'Matrix', icon: <GalleryHorizontal size={16} aria-hidden />, current: view === 'cards', onClick: () => choose('cards') },
    ]} className="self-start" />
  </div>;
}
