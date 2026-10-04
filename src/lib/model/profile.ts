// docs/plans/data-model/plan.md, sections 2.7 and 2.14
import { joinName } from './name';
import { renderSpanRecord } from './render';
import type { Identification, Predicate, WorkFolder } from './types';

export type Origin = { author: string } | { mention: string };

export interface ProfileEntry {
  assertionId: string;
  predicate: Predicate;
  parts: string[];
  text: string;
  spanIds: string[];
  statementIds: string[];
  parsed?: number;
  classified?: string;
  object?: string;
  objectMention?: string;
  origins: Origin[];
  status: string;
  identification: Identification['status'];
}

export function profilesFromModel(folders: WorkFolder[], root: string) {
  const profiles = new Map<string, ProfileEntry[]>();
  for (const folder of folders) {
    for (const file of folder.units) {
      const spans = new Map(file.spans.map((span) => [span.id, span]));
      const textOf = (id: string) => {
        const span = spans.get(id);
        if (!span) throw new Error(`${file.unit.id}: unknown span ${id}`);
        return renderSpanRecord(folder, span, root);
      };
      const identified = new Map<string, Identification[]>();
      for (const identification of file.identifications) {
        if (identification.status === 'REJECTED') continue;
        identified.set(identification.mention, [
          ...(identified.get(identification.mention) ?? []),
          identification,
        ]);
      }
      const statements = new Map(file.statements.map((s) => [s.id, s]));
      const reports = new Map(file.reports.map((r) => [r.id, r]));
      const mentionText = new Map(file.mentions.map((m) => [m.id, m.exact]));
      const originOf = (statementId: string): Origin | undefined => {
        const report = reports.get(statements.get(statementId)?.report ?? '');
        if (!report) return undefined;
        return 'workAuthor' in report.origin
          ? { author: folder.work.author }
          : { mention: mentionText.get(report.origin.mention) ?? report.origin.mention };
      };

      for (const assertion of file.assertions) {
        if (assertion.status === 'REJECTED') continue;
        const { value } = assertion;
        const spanIds = 'spans' in value ? value.spans : [];
        const origins = assertion.restsOn
          .map(originOf)
          .filter((origin): origin is Origin => origin !== undefined);
        const objects = 'object' in value ? (identified.get(value.object) ?? []) : [];
        for (const subject of identified.get(assertion.subject) ?? []) {
          const parts = spanIds.map(textOf);
          const entry: ProfileEntry = {
            assertionId: assertion.id,
            predicate: assertion.predicate,
            parts,
            text: assertion.predicate === 'name.full' ? joinName(parts) : parts.join(' '),
            spanIds,
            statementIds: assertion.restsOn,
            origins,
            status: assertion.status,
            identification: subject.status,
          };
          if ('parsed' in value) entry.parsed = value.parsed;
          if ('classified' in value) entry.classified = value.classified;
          if ('object' in value) {
            entry.object = objects[0]?.agent;
            entry.objectMention = mentionText.get(value.object);
          }
          profiles.set(subject.agent, [...(profiles.get(subject.agent) ?? []), entry]);
        }
      }
    }
  }
  return profiles;
}
