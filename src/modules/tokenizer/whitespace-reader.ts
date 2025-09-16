import { TokenizerContext } from '@/modules/tokenizer/tokenizer-context';
import { Bean } from '@/util/beans';
import { TokenReader } from './token-reader';

function isWhitespace(c: string) {
  return c === ' ' || c === '\t' || c === '\r' || c === '\n';
}

export class WhitespaceReader extends Bean implements TokenReader {
  read(c: TokenizerContext): true | undefined {
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
