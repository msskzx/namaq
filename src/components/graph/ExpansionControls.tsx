import { ExpansionRelationId } from '@/lib/relationship/expansion';
import { EXPANSION_GROUP_ORDER, ExpansionGroup, LINEAGE_ACTIONS, LineageActionId } from '@/lib/relationship/expansionGroups';
import { RelationType } from '@/lib/relationship/types';
import translations from '@/components/language/translations';

type GraphStrings = (typeof translations)[keyof typeof translations]['graph'];

const LINEAGE_LABEL_KEY: Record<LineageActionId, 'ancestors' | 'paternalLineage' | 'descendants'> = {
  ANCESTORS: 'ancestors',
  PATERNAL_LINEAGE: 'paternalLineage',
  DESCENDANTS: 'descendants',
};

interface ExpansionControlsProps {
  isPerson: boolean;
  groupedRelations: Map<ExpansionGroup, RelationType[]>;
  relationCounts: Map<RelationType, number>;
  hasEligibleDirectRelations: boolean;
  isActive: (relation: ExpansionRelationId) => boolean;
  onToggle: (relation: ExpansionRelationId) => void;
  onExpandAllDirectRelations: () => void;
  relationLabel: (type: string) => string;
  g: GraphStrings;
}

export default function ExpansionControls({
  isPerson,
  groupedRelations,
  relationCounts,
  hasEligibleDirectRelations,
  isActive,
  onToggle,
  onExpandAllDirectRelations,
  relationLabel,
  g,
}: ExpansionControlsProps) {
  return (
    <div className="mt-3 space-y-3">
      {hasEligibleDirectRelations && (
        <button type="button" onClick={onExpandAllDirectRelations} className="rounded bg-amber-400 px-3 py-1.5 text-sm text-gray-950 hover:bg-amber-300">
          {g.allDirectRelations}
        </button>
      )}
      {EXPANSION_GROUP_ORDER.map(group => {
        const relations = groupedRelations.get(group) ?? [];
        if (relations.length === 0) return null;
        return (
          <div key={group}>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{g.expansionGroups[group]}</h3>
            <div className="mt-1 flex flex-wrap gap-2">
              {relations.map(type => (
                <ExpansionButton key={type} active={isActive(type)} label={`${relationLabel(type)} (${relationCounts.get(type) ?? 0})`} onClick={() => onToggle(type)} />
              ))}
            </div>
          </div>
        );
      })}
      {isPerson && (
        <div className="flex flex-wrap gap-2 border-t border-amber-200 pt-3 dark:border-amber-800">
          {LINEAGE_ACTIONS.map(action => (
            <ExpansionButton key={action} active={isActive(action)} label={g.lineageActions[LINEAGE_LABEL_KEY[action]]} onClick={() => onToggle(action)} />
          ))}
        </div>
      )}
    </div>
  );
}

function ExpansionButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded border border-amber-400 px-2.5 py-1 text-xs ${active ? 'bg-amber-400 text-gray-950 hover:bg-amber-300' : 'text-gray-800 hover:bg-amber-100 dark:text-gray-100 dark:hover:bg-gray-700'}`}
    >
      {label}
    </button>
  );
}
