'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import GraphSurface from '@/components/graph/GraphSurface';
import { useLanguage } from '@/components/language/LanguageContext';

interface BattleParticipantsGraphProps {
  slug: string;
}

export default function BattleParticipantsGraph({ slug }: BattleParticipantsGraphProps) {
  const router = useRouter();
  const { language } = useLanguage();

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="h-[400px] w-full">
        <GraphSurface
          url={`/api/graph?battle=${slug}`}
          onNodeClick={(node) => {
            if (node.type === 'person') router.push(`/people/${node.slug}`);
          }}
        />
      </div>
    </div>
  );
}
