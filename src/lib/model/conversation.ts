// docs/plans/data-model/plan.md, sections 2.5a and 2.14
import { renderSpanRecord } from './render';
import type { UnitFile, WorkFolder } from './types';

export interface ConversationTurn {
  id: string;
  ordinal: number;
  parts: string[];
  spanIds: string[];
  speaker?: { mention: string; agent?: string };
  derivedBy?: string;
}

export interface ConversationScene {
  ordinal: number;
  inTurn?: string;
  turns: ConversationTurn[];
}

export function conversationOf(folder: WorkFolder, file: UnitFile, reportId: string, root: string) {
  const report = file.reports.find((r) => r.id === reportId);
  if (!report) throw new Error(`${file.unit.id}: unknown report ${reportId}`);
  const spans = new Map(file.spans.map((span) => [span.id, span]));
  const mentions = new Map(file.mentions.map((m) => [m.id, m.exact]));
  const agents = new Map(
    file.identifications
      .filter((i) => i.status !== 'REJECTED')
      .map((i) => [i.mention, i.agent] as const),
  );
  return (report.scenes ?? []).map((scene): ConversationScene => ({
    ordinal: scene.ordinal,
    inTurn: scene.inTurn,
    turns: scene.turns.map((turn) => ({
      id: turn.id,
      ordinal: turn.ordinal,
      spanIds: turn.spans,
      parts: turn.spans.map((id) => {
        const span = spans.get(id);
        if (!span) throw new Error(`${file.unit.id}: unknown span ${id}`);
        return renderSpanRecord(folder, span, root);
      }),
      speaker: turn.speaker
        ? { mention: mentions.get(turn.speaker) ?? turn.speaker, agent: agents.get(turn.speaker) }
        : undefined,
      derivedBy: turn.derivedBy,
    })),
  }));
}
