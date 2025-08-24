import { L1Keyword } from '@/beans/l1-parser/l1-keyword';
import { L1ParserContext } from '@/beans/l1-parser/l1-parser';
import { Bean } from '@/util/beans';
import { L1Identifier } from './l1-identifier';
import { L1Reader } from './l1-reader';

function isWordStart(c: string) {
  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_';
}

function isWordMiddle(c: string) {
  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') || c === '_';
}

export const KEYWORDS = new Set(['use', 'string', 'number', 'boolean', 'return', 'function', 'var', 'const']);

export class L1WordReader extends Bean implements L1Reader {
  read(c: L1ParserContext): L1Keyword | L1Identifier | undefined {
    if (!isWordStart(c.current)) {
      return;
    }
    let value = c.current;
    const lin1 = c.lin;
    const col1 = c.col;
    let lin2 = c.lin;
    let col2 = c.col + 1;
    c.consume();

    while (isWordMiddle(c.current)) {
      value += c.current;
      lin2 = c.lin;
      col2 = c.col + 1;
      c.consume();
    }
    return KEYWORDS.has(value)
      ? new L1Keyword(value, { lin1, col1, lin2, col2 })
      : new L1Identifier(value, { lin1, col1, lin2, col2 });
  }
}
