import { ExpansionRelationId, LINEAGE_ACTIONS, LineageActionId } from '@/lib/relationship/expansion';
import translations from '@/components/language/translations';
import Button from '@/components/common/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownLong, faShareNodes, faSitemap, faUpLong } from '@fortawesome/free-solid-svg-icons';

type GraphStrings = (typeof translations)[keyof typeof translations]['graph'];

const LINEAGE_LABEL_KEY: Record<LineageActionId, 'ancestors' | 'paternalLineage' | 'descendants'> = {
  ANCESTORS: 'ancestors',
  PATERNAL_LINEAGE: 'paternalLineage',
  DESCENDANTS: 'descendants',
};

// Vertical arrows for the two directions of a lineage, which read the same way
// under both writing directions; the father's line gets the tree instead.
const LINEAGE_ICON: Record<LineageActionId, typeof faUpLong> = {
  ANCESTORS: faUpLong,
  PATERNAL_LINEAGE: faSitemap,
  DESCENDANTS: faDownLong,
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
        <Button variant="primary" onClick={onExpandAllDirectRelations}>
          <FontAwesomeIcon icon={faShareNodes} />
          {g.allDirectRelations}
        </Button>
      )}
      {isPerson && (
        <div className="flex flex-wrap gap-2 border-t border-amber-200 pt-3 dark:border-amber-800">
          {LINEAGE_ACTIONS.map(action => (
            <Button key={action} size="sm" active={isActive(action)} aria-pressed={isActive(action)} onClick={() => onToggle(action)}>
              <FontAwesomeIcon icon={LINEAGE_ICON[action]} />
              {g.lineageActions[LINEAGE_LABEL_KEY[action]]}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
