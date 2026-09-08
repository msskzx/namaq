import { ExpansionRelationId, LINEAGE_ACTIONS, LineageActionId } from '@/lib/relationship/expansion';
import translations from '@/components/language/translations';

type GraphStrings = (typeof translations)[keyof typeof translations]['graph'];

const LINEAGE_LABEL_KEY: Record<LineageActionId, 'ancestors' | 'paternalLineage' | 'descendants'> = {
  ANCESTORS: 'ancestors',
  PATERNAL_LINEAGE: 'paternalLineage',
  DESCENDANTS: 'descendants',
};

interface ExpansionControlsProps {
  isPerson: boolean;
  hasEligibleDirectRelations: boolean;
  isActive: (relation: ExpansionRelationId) => boolean;
  onToggle: (relation: ExpansionRelationId) => void;
  onExpandAllDirectRelations: () => void;
  g: GraphStrings;
}

export default function ExpansionControls({
  isPerson,
  hasEligibleDirectRelations,
  isActive,
  onToggle,
  onExpandAllDirectRelations,
  g,
}: ExpansionControlsProps) {
  return (
    <div className="mt-3 space-y-3">
      {hasEligibleDirectRelations && (
        <button type="button" onClick={onExpandAllDirectRelations} className="rounded bg-amber-400 px-3 py-1.5 text-sm text-gray-950 hover:bg-amber-300">
          {g.allDirectRelations}
        </button>
      )}
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
