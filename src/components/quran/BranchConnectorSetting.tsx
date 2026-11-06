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
  const label = ar ? 'ربط الكلمات المتشابهة بخطوط تلقائيًا' : 'Connect matching words automatically';
  const description = ar ? 'إظهار خطوط بين الكلمات المشتركة تلقائيًا عند فتح المصفوفة.' : 'Show lines between shared words by default when opening the matrix.';
  const [enabled, setEnabled] = useState(() => Cookies.get(BRANCH_CONNECTORS_COOKIE) === 'on');
  return <div className="flex items-center justify-between gap-3 px-3 py-2">
    <div className="min-w-0">
      <label htmlFor={id} className="text-sm text-[var(--home-ink)]">{label}</label>
      <p id={`${id}-description`} className="mt-1 text-xs text-[var(--home-muted)]">{description}</p>
    </div>
    <Toggle id={id} label={label} describedBy={`${id}-description`} checked={enabled} onChange={checked => {
      Cookies.set(BRANCH_CONNECTORS_COOKIE, checked ? 'on' : 'off', { expires: 365, sameSite: 'lax', path: '/' });
      setEnabled(checked);
      router.refresh();
    }} />
  </div>;
}
