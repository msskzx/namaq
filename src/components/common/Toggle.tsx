import type { ReactNode } from 'react';

interface ToggleProps {
  checked: boolean;
  label: string;
  disabled?: boolean;
  describedBy?: string;
  id?: string;
  onChange(checked: boolean): void;
  onIcon?: ReactNode;
  offIcon?: ReactNode;
  size?: 'md' | 'lg';
  palette?: 'default' | 'site';
}

export default function Toggle({ checked, label, disabled = false, describedBy, id, onChange, onIcon, offIcon, size = 'md' }: ToggleProps) {
  const hasIcons = onIcon !== undefined || offIcon !== undefined;
  const lg = hasIcons && size === 'lg';
  const iconBox = lg ? 'size-7' : 'size-5';
  const track = 'border-[var(--home-rule)] bg-[var(--home-paper-deep)]';
  const thumb = 'bg-[var(--home-muted)] peer-checked:bg-[var(--home-accent)] peer-focus-visible:ring-[var(--home-accent)] peer-focus-visible:ring-offset-[var(--home-paper)]';
  const offColour = 'text-[var(--home-paper)] peer-checked:text-[var(--home-muted)]';
  const onColour = 'text-[var(--home-muted)] peer-checked:text-[var(--home-paper)]';
  return (
    <label className={`relative inline-block shrink-0 ${lg ? 'h-9 w-[68px]' : hasIcons ? 'h-7 w-[52px]' : 'h-5 w-9'} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <input id={id} className="peer sr-only" type="checkbox" role="switch" checked={checked} aria-label={label} aria-describedby={describedBy} disabled={disabled} onChange={(event) => onChange(event.currentTarget.checked)} />
      <span className={`absolute inset-0 rounded-full border transition-colors peer-disabled:cursor-not-allowed peer-disabled:opacity-50 ${track}`} aria-hidden="true" />
      <span className={`absolute start-0.5 top-1/2 -translate-y-1/2 rounded-full shadow transition-[background-color,transform] peer-checked:translate-x-full rtl:peer-checked:-translate-x-full peer-focus-visible:ring-2 peer-focus-visible:ring-offset-1 ${thumb} ${lg ? 'size-8' : hasIcons ? 'size-6' : 'size-4'}`} aria-hidden="true" />
      {offIcon && <span className={`absolute start-1 top-1/2 z-10 grid ${iconBox} -translate-y-1/2 place-items-center transition-[color,opacity] peer-checked:opacity-70 ${offColour}`} aria-hidden="true">{offIcon}</span>}
      {onIcon && <span className={`absolute end-1 top-1/2 z-10 grid ${iconBox} -translate-y-1/2 place-items-center opacity-90 transition-[color,opacity] peer-checked:opacity-100 ${onColour}`} aria-hidden="true">{onIcon}</span>}
    </label>
  );
}
