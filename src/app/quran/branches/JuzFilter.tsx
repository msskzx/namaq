import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/common/Button';
import { num } from '@/lib/quran/arabicNumber';
import { branchesHref, type BranchesView } from '@/lib/quran/branches';
import { JUZ_STARTS, type JuzRange } from '@/lib/quran/juz';
import { FIELD } from '../panel';

const JUZ = JUZ_STARTS.map((_, i) => i + 1);

export default function JuzFilter({ range, phrase, view }: { range: JuzRange | null; phrase: string; view: BranchesView }) {
  const select = (name: string, label: string, value: number) => (
    <label className="flex items-center gap-2">
      {label}
      <select name={name} defaultValue={value} className={FIELD}>
        {JUZ.map(n => <option key={n} value={n}>{num(n)}</option>)}
      </select>
    </label>
  );
  return (
    <form key={range ? `${range.from}-${range.to}` : ''} method="get" action="/quran/branches" aria-label="نطاق الأجزاء" className="flex flex-wrap items-center gap-3 text-sm">
      <input type="hidden" name="o" value={phrase} />
      {view.list && <input type="hidden" name="v" value="list" />}
      {view.list && view.grouped && <input type="hidden" name="g" value="opening" />}
      {select('juzFrom', 'من الجزء', range?.from ?? 1)}
      {select('juzTo', 'إلى الجزء', range?.to ?? JUZ.length)}
      <Button type="submit" size="sm">
        <FontAwesomeIcon icon={faFilter} />
        تطبيق
      </Button>
      {range && (
        <Button size="sm" href={branchesHref(phrase, undefined, { list: view.list, grouped: view.grouped })}>
          <FontAwesomeIcon icon={faRotateLeft} />
          كل الأجزاء
        </Button>
      )}
    </form>
  );
}
