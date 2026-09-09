import { ExpansionRelationId, LineageActionId } from '@/lib/relationship/expansion';
import translations from '@/components/language/translations';
import Button from '@/components/common/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownLong, faShareNodes, faUpLong } from '@fortawesome/free-solid-svg-icons';

type GraphStrings = (typeof translations)[keyof typeof translations]['graph'];

const LINEAGE_LABEL_KEY: Record<LineageActionId, 'ancestors' | 'paternalLineage' | 'descendants'> = {
  ANCESTORS: 'ancestors',
  PATERNAL_LINEAGE: 'paternalLineage',
  DESCENDANTS: 'descendants',
};

// Vertical arrows for the two directions of a lineage, which read the same way
// under both writing directions.
const LINEAGE_ICON: Partial<Record<LineageActionId, typeof faUpLong>> = {
  ANCESTORS: faUpLong,
  DESCENDANTS: faDownLong,
};

// Paternal lineage keeps working from a saved URL; only its button is gone
// while the action's future is undecided. See
// docs/graph-exploration-implementation-plan.md.
const LINEAGE_BUTTONS: readonly LineageActionId[] = ['ANCESTORS', 'DESCENDANTS'];

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
    <div className="mt-3 flex flex-wrap gap-3 border-t border-amber-200 pt-3 dark:border-amber-800">
      {hasEligibleDirectRelations && (
        <Button variant="primary" onClick={onExpandAllDirectRelations}>
          <FontAwesomeIcon icon={faShareNodes} />
          {g.exploreSubject}
        </Button>
      )}
      {isPerson && (
        <>
          {LINEAGE_BUTTONS.map(action => (
            <Button key={action} active={isActive(action)} aria-pressed={isActive(action)} onClick={() => onToggle(action)}>
              <FontAwesomeIcon icon={LINEAGE_ICON[action]!} />
              {g.lineageActions[LINEAGE_LABEL_KEY[action]]}
            </Button>
          ))}
        </>
      )}
    </div>
  );
}
