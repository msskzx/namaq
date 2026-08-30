import SlideSwitch from './SlideSwitch';
import { relationColor, relationGroup, sortRelationTypes, CATEGORY_BY_TYPE, RelationGroup } from '@/lib/relations';
import translations from '@/components/language/translations';

// Fixed display order for the relation-type groups; empty groups (e.g. no
// Battle relations present because the current view/kind scope excludes
// them) are simply skipped by the caller-supplied `types` list.
const GROUP_ORDER: RelationGroup[] = ['family', 'battles', 'titles', 'events'];

type GraphStrings = (typeof translations)[keyof typeof translations]['graph'];

interface RelationFilterPanelProps {
  types: string[];
  excludedRelations: Set<string>;
  onToggle: (type: string) => void;
  onToggleAll: (show: boolean) => void;
  relationLabel: (type: string) => string;
  language: 'en' | 'ar';
}

export default function RelationFilterPanel({ types, excludedRelations, onToggle, onToggleAll, relationLabel, language }: RelationFilterPanelProps) {
  const g: GraphStrings = translations[language].graph;
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const groups = GROUP_ORDER.map(group => ({ group, types: types.filter(type => relationGroup(type) === group) })).filter(({ types }) => types.length > 0);

  if (types.length === 0) return null;

  return (
    <fieldset dir={dir} className="mb-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
      <legend className="px-1 text-sm font-medium text-gray-800 dark:text-gray-100">{g.relationshipTypes}</legend>
      <div className="mb-2 border-b border-gray-100 pb-2 dark:border-gray-700">
        <SlideSwitch checked={excludedRelations.size === 0} onChange={() => onToggleAll(excludedRelations.size > 0)} label={g.allRelations} />
      </div>
      <div className="space-y-2">
        {groups.map(({ group, types: groupTypes }) => (
          <details key={group} open className="rounded border border-gray-100 p-2 dark:border-gray-700">
            <summary className="cursor-pointer select-none text-sm font-medium text-gray-800 dark:text-gray-100">
              {g.relationGroups[group]}
            </summary>
            {group === 'family' ? (
              <FamilySubcategories types={groupTypes} excludedRelations={excludedRelations} onToggle={onToggle} relationLabel={relationLabel} g={g} />
            ) : (
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                {groupTypes.map(type => (
                  <RelationSwitch key={type} type={type} active={!excludedRelations.has(type)} onToggle={onToggle} relationLabel={relationLabel} g={g} />
                ))}
              </div>
            )}
          </details>
        ))}
      </div>
    </fieldset>
  );
}

function FamilySubcategories({ types, excludedRelations, onToggle, relationLabel, g }: { types: string[]; excludedRelations: Set<string>; onToggle: (type: string) => void; relationLabel: (type: string) => string; g: GraphStrings }) {
  const sorted = sortRelationTypes(types);
  const categories = [...new Set(sorted.map(type => CATEGORY_BY_TYPE[type] ?? type))];
  return (
    <div className="mt-2 space-y-2">
      {categories.map(category => (
        <div key={category}>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {(g.relationCategories as Record<string, string>)[category] ?? category}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {sorted.filter(type => (CATEGORY_BY_TYPE[type] ?? type) === category).map(type => (
              <RelationSwitch key={type} type={type} active={!excludedRelations.has(type)} onToggle={onToggle} relationLabel={relationLabel} g={g} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function RelationSwitch({ type, active, onToggle, relationLabel, g }: { type: string; active: boolean; onToggle: (type: string) => void; relationLabel: (type: string) => string; g: GraphStrings }) {
  const color = relationColor(type);
  const label = relationLabel(type);
  return (
    <SlideSwitch checked={active} onChange={() => onToggle(type)} label={label} color={color} ariaLabel={active ? g.hideRelation(label) : g.showRelation(label)} />
  );
}
