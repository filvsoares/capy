import { Bean } from '@/util/beans';
import { L1Reader } from './l1-reader';
import { L1Separator } from './l1-separator';
import { L1ParseContext } from './l1-types';

function isSeparator(c: string) {
  return c === ';' || c === ',';
}

export class L1SeparatorReader extends Bean implements L1Reader {
  read(c: L1ParseContext): L1Separator | undefined {
    if (!isSeparator(c.current)) {
      return;
    }
    const value = c.current;
    const lin1 = c.lin;
    const col1 = c.col;
    const lin2 = c.lin;
    const col2 = c.col + 1;
    c.consume();
    return new L1Separator(value, { lin1, col1, lin2, col2 });
  }
}
