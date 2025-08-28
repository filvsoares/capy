import { Identifier } from '@/modules/parser/tokenizer/identifier';
import { Keyword } from '@/modules/parser/tokenizer/keyword';
import { TokenizerContext } from '@/modules/parser/tokenizer/tokenizer-context';
import { Bean } from '@/util/beans';
import { TokenReader } from './token-reader';

function isWordStart(c: string) {
  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_';
}

function isWordMiddle(c: string) {
  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') || c === '_';
}

export const KEYWORDS = new Set(['use', 'string', 'number', 'boolean', 'return', 'function', 'var', 'const', 'native']);

export class WordReader extends Bean implements TokenReader {
  read(c: TokenizerContext): Keyword | Identifier | undefined {
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
      ? new Keyword(value, { lin1, col1, lin2, col2 })
      : new Identifier(value, { lin1, col1, lin2, col2 });
  }
}
