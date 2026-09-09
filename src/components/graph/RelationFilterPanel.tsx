import SlideSwitch from './SlideSwitch';
import Button from '@/components/common/Button';
import { governingRelationType, relationColor, relationGroup, sortRelationTypes, RelationGroup } from '@/lib/relationship/categories';
import translations from '@/components/language/translations';

export type ControlScope = 'selected' | 'exploration';

// Fixed display order for the relation-type groups; empty groups (e.g. no
// Battle relations present because the current view/kind scope excludes
// them) are simply skipped by the caller-supplied `types` list.
const GROUP_ORDER: RelationGroup[] = ['family', 'battles', 'titles', 'events'];

type GraphStrings = (typeof translations)[keyof typeof translations]['graph'];

interface RelationFilterPanelProps {
  types: string[];
  includedRelations: Set<string>;
  onToggle: (type: string) => void;
  onToggleAll: (show: boolean) => void;
  onToggleGroup: (group: RelationGroup, show: boolean) => void;
  showCompanionTitle: boolean;
  onToggleCompanionTitle: () => void;
  relationLabel: (type: string) => string;
  language: 'en' | 'ar';
  scope?: ControlScope;
  onScopeChange?: (scope: ControlScope) => void;
  disabled?: boolean;
}

export default function RelationFilterPanel({ types, includedRelations, onToggle, onToggleAll, onToggleGroup, showCompanionTitle, onToggleCompanionTitle, relationLabel, language, scope, onScopeChange, disabled = false }: RelationFilterPanelProps) {
  const g: GraphStrings = translations[language].graph;
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const groups = GROUP_ORDER.map(group => ({ group, types: sortRelationTypes(types.filter(type => relationGroup(type) === group)) })).filter(({ types }) => types.length > 0);

  if (types.length === 0) return null;
  // Companionship sits outside the bulk switches, so it neither turns them on
  // nor holds them off (rule 3 of docs/graph-exploration-review-plan.md).
  const inBulk = (type: string) => governingRelationType(type) !== 'COMPANION_OF';
  const allVisible = types.filter(inBulk).every(type => includedRelations.has(type));

  return (
    <fieldset dir={dir} className="mb-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
      <legend className="px-1 text-sm font-medium text-gray-800 dark:text-gray-100">{g.relationshipTypes}</legend>
      {scope && onScopeChange && (
        <div className="mb-2 flex flex-wrap gap-2" role="group" aria-label={g.controlScope}>
          <Button size="sm" active={scope === 'selected'} aria-pressed={scope === 'selected'} onClick={() => onScopeChange('selected')}>
            {g.selectedSubjectScope}
          </Button>
          <Button size="sm" active={scope === 'exploration'} aria-pressed={scope === 'exploration'} onClick={() => onScopeChange('exploration')}>
            {g.explorationScope}
          </Button>
        </div>
      )}
      {disabled && <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">{g.selectSubjectForLocalControls}</p>}
      <div className={disabled ? 'pointer-events-none opacity-50' : undefined} aria-disabled={disabled || undefined}>
      <div className="mb-2 border-b border-gray-100 pb-2 dark:border-gray-700">
        <SlideSwitch checked={allVisible} onChange={() => onToggleAll(!allVisible)} label={g.allRelations} />
      </div>
      <div className="space-y-2">
        {groups.map(({ group, types: groupTypes }) => {
          const allVisible = groupTypes.filter(inBulk).every(type => includedRelations.has(type));
          return (
            <details key={group} open className="rounded border border-gray-100 p-2 dark:border-gray-700">
              <summary className="cursor-pointer select-none text-sm font-medium text-gray-800 dark:text-gray-100">
                {g.relationGroups[group]}
              </summary>
              {group === 'family' && (
                <div className="mb-2 mt-2 border-b border-gray-100 pb-2 dark:border-gray-700">
                  <SlideSwitch checked={allVisible} onChange={() => onToggleGroup(group, !allVisible)} label={g.allFamilyRelations} />
                </div>
              )}
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                {groupTypes.map(type => (
                  <RelationSwitch key={type} type={type} active={includedRelations.has(type)} onToggle={onToggle} relationLabel={relationLabel} g={g} />
                ))}
                {group === 'titles' && (
                  <SlideSwitch checked={showCompanionTitle} onChange={onToggleCompanionTitle} label={g.companionTitleLabel} ariaLabel={showCompanionTitle ? g.hideKind(g.companionTitleLabel) : g.showKind(g.companionTitleLabel)} />
                )}
              </div>
            </details>
          );
        })}
      </div>
      </div>
    </fieldset>
  );
}

function RelationSwitch({ type, active, onToggle, relationLabel, g }: { type: string; active: boolean; onToggle: (type: string) => void; relationLabel: (type: string) => string; g: GraphStrings }) {
  const color = relationColor(type);
  const label = relationLabel(type);
  return (
    <SlideSwitch checked={active} onChange={() => onToggle(type)} label={label} color={color} ariaLabel={active ? g.hideRelation(label) : g.showRelation(label)} />
  );
}
