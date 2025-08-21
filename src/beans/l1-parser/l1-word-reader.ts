import { Bean } from '@/util/beans';
import { L1Reader } from './l1-reader';
import { L1ParseContext } from './l1-types';
import { KEYWORDS, L1Identifier, L1Keyword } from './l1-word';

function isWordStart(c: string) {
  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_';
}

function isWordMiddle(c: string) {
  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') || c === '_';
}

export class L1WordReader extends Bean implements L1Reader {
  read(c: L1ParseContext): L1Keyword | L1Identifier | undefined {
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
