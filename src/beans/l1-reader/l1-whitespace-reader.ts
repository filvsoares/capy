import { L1ParseContext } from '@/beans/l1-parser/l1-types';
import { Bean } from '@/util/beans';
import { L1Reader } from '../l1-parser/l1-reader';

function isWhitespace(c: string) {
  return c === ' ' || c === '\t' || c === '\r' || c === '\n';
}

export class L1WhitespaceReader extends Bean implements L1Reader {
  read(c: L1ParseContext): true | undefined {
    if (!isWhitespace(c.current)) {
      return;
    }
    c.consume();
    while (isWhitespace(c.current)) {
      c.consume();
    }
    return true;
  }
}
