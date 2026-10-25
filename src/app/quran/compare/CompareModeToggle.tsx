'use client';

import { useOptimistic, useTransition } from 'react';
import type { ReactNode } from 'react';

import { faFont, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Toggle from '@/components/common/Toggle';
import { useNavigatingRouter } from '@/components/common/NavigationLoader';

type Props = { on: boolean; offHref: string; onHref: string; offLabel?: string; onLabel?: string; label?: string; offIcon?: ReactNode; onIcon?: ReactNode };

export default function CompareModeToggle({
  on, offHref, onHref, offLabel = 'النص', onLabel = 'المواضيع', label = 'المقارنة بالمواضيع',
  offIcon = <FontAwesomeIcon icon={faFont} className="size-3" />, onIcon = <FontAwesomeIcon icon={faLayerGroup} className="size-3" />,
}: Props) {
  const router = useNavigatingRouter();
  const [, startTransition] = useTransition();
  const [shown, setShown] = useOptimistic(on);
  const style = (active: boolean) => (active ? 'font-semibold text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400');
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={style(!shown)}>{offLabel}</span>
      <Toggle
        label={label}
        checked={shown}
        onChange={(checked) =>
          startTransition(() => {
            setShown(checked);
            router.push(checked ? onHref : offHref);
          })
        }
        offIcon={offIcon}
        onIcon={onIcon}
      />
      <span className={style(shown)}>{onLabel}</span>
    </div>
  );
}
