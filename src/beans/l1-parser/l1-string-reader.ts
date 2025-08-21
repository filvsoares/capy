import { Bean } from '@/util/beans';
import { ERROR } from '../../base';
import { L1Reader } from './l1-reader';
import { L1String } from './l1-string';
import { L1ParseContext } from './l1-types';

export class L1StringReader extends Bean implements L1Reader {
  read(c: L1ParseContext): L1String | undefined {
    if (c.current !== '"') {
      return;
    }
    let value = '';
    const lin1 = c.lin;
    const col1 = c.col;
    let lin2 = c.lin;
    let col2 = c.col + 1;
    c.consume();

    while (true) {
      if (!c.current) {
        c.errors.push({
          level: ERROR,
          pos: { lin1: c.lin, col1: c.col, lin2: c.lin, col2: c.col },
          message: `Unterminated string`,
        });
        break;
      }
      if (c.current === '"') {
        c.consume();
        break;
      }
      value += c.current;
      lin2 = c.lin;
      col2 = c.col + 1;
      c.consume();
    }
    return new L1String(value, { lin1, col1, lin2, col2 });
  }
}
