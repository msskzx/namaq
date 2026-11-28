import { HIZB } from './ayahWords';

export type FlowRun = { text: string };
export type FlowPiece<R extends FlowRun> = { text: string; runs: R[]; newLine: boolean };

const SPACE = /([ \n]+)/;
const JOINS_BEFORE = /^[٠-٩۰-۹ۖ-ۜ۩﴾﴿]+$/;
const GLUE = ' ';

const pieceOf = <R extends FlowRun>(runs: R[], newLine: boolean): FlowPiece<R> => ({ text: runs.map(run => run.text).join(''), runs, newLine });

export function flowPieces<R extends FlowRun>(runs: R[], glue: (text: string) => R): FlowPiece<R>[] {
  const pieces: FlowPiece<R>[] = [];
  let open: R[] = [];
  let newLine = false;
  const close = () => {
    if (!open.length) return;
    const last = pieces[pieces.length - 1];
    if (last && !newLine && JOINS_BEFORE.test(open.map(run => run.text).join(''))) pieces[pieces.length - 1] = pieceOf([...last.runs, glue(GLUE), ...open], last.newLine);
    else pieces.push(pieceOf(open, newLine));
    open = [];
    newLine = false;
  };
  runs.forEach(run => run.text.split(SPACE).forEach((part, at) => {
    if (at % 2) {
      close();
      if (part.includes('\n') && pieces.length) newLine = true;
    } else if (part) open.push({ ...run, text: part });
  }));
  close();
  return pieces.reduce<FlowPiece<R>[]>((list, piece) => {
    const last = list[list.length - 1];
    return last?.text === HIZB && !piece.newLine ? [...list.slice(0, -1), pieceOf([...last.runs, glue(GLUE), ...piece.runs], last.newLine)] : [...list, piece];
  }, []);
}
