import { Number } from '@/beans/tokenizer/number';
import { TokenizerContext } from '@/beans/tokenizer/tokenizer-context';
import { Bean } from '@/util/beans';
import { TokenReader } from './token-reader';

function isNumberStart(c: string) {
  return c >= '0' && c <= '9';
}

function isNumberMiddle(c: string) {
  return (c >= '0' && c <= '9') || c == '.';
}
export class NumberReader extends Bean implements TokenReader {
  read(c: TokenizerContext): Number | undefined {
    if (!isNumberStart(c.current)) {
      return;
    }
    let value = c.current;
    const lin1 = c.lin;
    const col1 = c.col;
    let lin2 = c.lin;
    let col2 = c.col + 1;
    c.consume();
    while (isNumberMiddle(c.current)) {
      value += c.current;
      lin2 = c.lin;
      col2 = c.col + 1;
      c.consume();
    }
    return new Number(value, { lin1, col1, lin2, col2 });
  }
}
