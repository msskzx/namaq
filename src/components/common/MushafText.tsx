import React from 'react';
import { mushafText } from '@shared/quran/mushafText';

export { mushafText };

export default function MushafText({ children }: { children: string }) {
  return <>{mushafText(children)}</>;
}
