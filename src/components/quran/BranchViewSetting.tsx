'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { GalleryHorizontal } from 'lucide-react';
import Button from '@/components/common/Button';
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
  return <fieldset className="px-3 py-2">
    <legend className="text-sm text-[var(--home-muted)]">{ar ? 'العرض الافتراضي للمتشابه' : 'Default similar-ayat view'}</legend>
    <div className="flex gap-2">
      <Button size="sm" active={view === 'tree'} aria-pressed={view === 'tree'} onClick={() => choose('tree')}><TreeIcon size={16} aria-hidden />{ar ? 'شجرة' : 'Tree'}</Button>
      <Button size="sm" active={view === 'cards'} aria-pressed={view === 'cards'} onClick={() => choose('cards')}><GalleryHorizontal size={16} aria-hidden />{ar ? 'مصفوفة' : 'Matrix'}</Button>
    </div>
  </fieldset>;
}
