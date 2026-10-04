// docs/adr/0022-a-shown-value-rests-on-an-attributed-statement.md
import { HARAKAT, matchForm } from './span';

const STANDING: Record<string, string> = {
  'رسول الله': 'prophet-muhammad',
  النبي: 'prophet-muhammad',
};

export function standingAgent(mention: string) {
  return STANDING[matchForm(mention).replace(HARAKAT, '')];
}
