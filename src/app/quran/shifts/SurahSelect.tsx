'use client';

export default function SurahSelect({ value, options }: { value: number; options: { number: number; label: string }[] }) {
  return (
    <select
      name="s"
      aria-label="السورة"
      defaultValue={value}
      onChange={e => e.currentTarget.form?.requestSubmit()}
      className="min-w-0 flex-1 rounded border border-amber-400 bg-white dark:bg-gray-900 px-2 py-1 text-sm"
    >
      {options.map(o => <option key={o.number} value={o.number}>{o.label}</option>)}
    </select>
  );
}
