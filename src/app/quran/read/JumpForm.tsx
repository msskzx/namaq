'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/common/Button';

export default function JumpForm() {
  const router = useRouter();
  const [value, setValue] = useState('');
  return (
    <form
      className="flex items-center justify-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        const page = Number(value);
        if (Number.isInteger(page) && page >= 1 && page <= 604) router.push(`/quran/read/${page}`);
      }}
    >
      <input
        type="number"
        min={1}
        max={604}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-label="رقم الصفحة"
        className="w-20 rounded border border-amber-400 bg-transparent px-2 py-1 text-sm"
      />
      <Button size="sm" type="submit">
        <FontAwesomeIcon icon={faLocationArrow} aria-hidden />
        اذهب إلى الصفحة
      </Button>
    </form>
  );
}
