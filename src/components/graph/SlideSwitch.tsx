// iOS-style slide switch. Uses justify-content (start/end, which flexbox
// resolves relative to the ambient `dir`) to place the thumb rather than a
// fixed translateX, so it mirrors correctly under the fieldsets' dir="rtl"
// without needing a separate RTL variant.
export default function SlideSwitch({ checked, onChange, label, color, ariaLabel }: { checked: boolean; onChange: () => void; label: string; color?: string; ariaLabel?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel ?? label}
      onClick={onChange}
      className="flex items-center gap-2 rounded-full px-1 py-0.5 text-sm font-medium text-gray-700 dark:text-gray-200"
    >
      <span
        className={`flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${checked ? 'justify-end' : 'justify-start'}`}
        style={{ backgroundColor: checked ? (color ?? '#f59e0b') : '#9ca3af' }}
      >
        <span className="h-4 w-4 rounded-full bg-white shadow transition-transform" />
      </span>
      <span style={checked && color ? { color } : undefined}>{label}</span>
    </button>
  );
}
