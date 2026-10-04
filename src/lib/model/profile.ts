// docs/plans/data-model/plan.md, sections 2.7 and 2.14
import { renderSpanRecord } from './render';
import type { Predicate, Report, WorkFolder } from './types';

export interface ProfileEntry {
  predicate: Predicate;
  parts: string[];
  parsed?: number;
  object?: string;
  origin: { author: string } | { mention: string };
  status: string;
}

export function profilesFromModel(folders: WorkFolder[], root: string) {
  const profiles = new Map<string, ProfileEntry[]>();
  for (const folder of folders) {
    for (const file of folder.units) {
      const text = new Map(
        file.spans.map((span) => [span.id, renderSpanRecord(folder, span, root)]),
      );
      const agentOf = new Map(file.identifications.map((i) => [i.mention, i.agent]));
      const statementReport = new Map(file.statements.map((s) => [s.id, s.report]));
      const reports = new Map(file.reports.map((r) => [r.id, r]));
      const mentionText = new Map(file.mentions.map((m) => [m.id, m.exact]));
      const originOf = (report: Report): ProfileEntry['origin'] =>
        'workAuthor' in report.origin
          ? { author: folder.work.author }
          : { mention: mentionText.get(report.origin.mention) ?? '' };

      for (const assertion of file.assertions) {
        const agent = agentOf.get(assertion.subject);
        const report = reports.get(statementReport.get(assertion.restsOn[0]) ?? '');
        if (!agent || !report) continue;
        const { value } = assertion;
        const entry: ProfileEntry = {
          predicate: assertion.predicate,
          parts: 'spans' in value ? value.spans.map((id) => text.get(id) ?? '') : [],
          origin: originOf(report),
          status: assertion.status,
        };
        if ('parsed' in value) entry.parsed = value.parsed;
        if ('object' in value) entry.object = agentOf.get(value.object);
        profiles.set(agent, [...(profiles.get(agent) ?? []), entry]);
      }
    }
  }
  return profiles;
}
