import { L1ParseContext } from '@/parser/layer1/l1-types';
import { L1Reader } from './_bean-interfaces';
import { Bean } from '@/util/beans';

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
