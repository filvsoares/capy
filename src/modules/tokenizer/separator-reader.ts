import { TokenizerContext } from '@/modules/tokenizer/tokenizer-context';
import { Bean } from '@/util/beans';
import { Separator } from './separator';
import { TokenReader } from './token-reader';

function isSeparator(c: string) {
  return c === ';' || c === ',';
}

export class SeparatorReader extends Bean implements TokenReader {
  read(c: TokenizerContext): Separator | undefined {
    if (!isSeparator(c.current)) {
      return;
    }
    const value = c.current;
    const lin1 = c.lin;
    const col1 = c.col;
    const lin2 = c.lin;
    const col2 = c.col + 1;
    c.consume();
    return new Separator(value, { lin1, col1, lin2, col2 });
  }
}
