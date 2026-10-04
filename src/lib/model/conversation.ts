// docs/plans/data-model/plan.md, sections 2.5a, 2.6 and 2.14
import { renderSpanRecord } from './render';
import type { Identification, UnitFile, WorkFolder } from './types';

export interface ConversationTurn {
  id: string;
  ordinal: number;
  parts: string[];
  spanIds: string[];
  speaker?: {
    mention: string;
    agents: { agent: string; status: Identification['status'] }[];
  };
  derivedBy?: string;
}

export interface ConversationScene {
  ordinal: number;
  inTurn?: string;
  turns: ConversationTurn[];
}

export interface Conversation {
  unit: string;
  report: string;
  origin: { author: string } | { mention: string };
  scenes: ConversationScene[];
}

export function conversationOf(
  folder: WorkFolder,
  file: UnitFile,
  reportId: string,
  root: string,
): Conversation {
  const report = file.reports.find((r) => r.id === reportId);
  if (!report) throw new Error(`${file.unit.id}: unknown report ${reportId}`);
  const spans = new Map(file.spans.map((span) => [span.id, span]));
  const mentions = new Map(file.mentions.map((m) => [m.id, m.exact]));
  const mentionText = (id: string) => {
    const text = mentions.get(id);
    if (text === undefined) throw new Error(`${file.unit.id}: unknown mention ${id}`);
    return text;
  };
  const candidates = (mention: string) =>
    file.identifications
      .filter((i) => i.mention === mention && i.status !== 'REJECTED')
      .map((i) => ({ agent: i.agent, status: i.status }));

  return {
    unit: file.unit.id,
    report: report.id,
    origin:
      'workAuthor' in report.origin
        ? { author: folder.work.author }
        : { mention: mentionText(report.origin.mention) },
    scenes: (report.scenes ?? []).map((scene) => ({
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
          ? { mention: mentionText(turn.speaker), agents: candidates(turn.speaker) }
          : undefined,
        derivedBy: turn.derivedBy,
      })),
    })),
  };
}
