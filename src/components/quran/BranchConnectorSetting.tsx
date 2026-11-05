'use client';

import { useId, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Toggle from '@/components/common/Toggle';
import { useLanguage } from '@/components/language/LanguageContext';
import { BRANCH_CONNECTORS_COOKIE } from '@/lib/quran/branchView';

export default function BranchConnectorSetting() {
  const id = useId();
  const router = useRouter();
  const ar = useLanguage().language === 'ar';
  const label = ar ? 'روابط الكلمات افتراضيًا' : 'Show word connectors by default';
  const [enabled, setEnabled] = useState(() => Cookies.get(BRANCH_CONNECTORS_COOKIE) === 'on');
  return <div className="flex items-center justify-between gap-3 px-3 py-2">
    <label htmlFor={id} className="text-sm text-[var(--home-muted)]">{label}</label>
    <Toggle id={id} label={label} checked={enabled} onChange={checked => {
      Cookies.set(BRANCH_CONNECTORS_COOKIE, checked ? 'on' : 'off', { expires: 365, sameSite: 'lax', path: '/' });
      setEnabled(checked);
      router.refresh();
    }} />
  </div>;
}
