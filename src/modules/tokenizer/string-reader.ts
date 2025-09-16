import { ERROR } from '@/base';
import { TokenizerContext } from '@/modules/tokenizer/tokenizer-context';
import { Bean } from '@/util/beans';
import { String } from './string';
import { TokenReader } from './token-reader';

export class StringReader extends Bean implements TokenReader {
  read(c: TokenizerContext): String | undefined {
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
        c.addError({
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
    return new String(value, { lin1, col1, lin2, col2 });
  }
}
