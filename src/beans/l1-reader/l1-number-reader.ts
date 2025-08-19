import { Bean } from '@/util/beans';
import { L1ParseContext } from '../l1-parser/l1-types';
import { L1Number } from './l1-number';
import { L1Reader } from '../l1-parser/l1-reader';

function isNumberStart(c: string) {
  return c >= '0' && c <= '9';
}

function isNumberMiddle(c: string) {
  return (c >= '0' && c <= '9') || c == '.';
}
export class L1NumberReader extends Bean implements L1Reader {
  read(c: L1ParseContext): L1Number | undefined {
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
    return new L1Number(value, { lin1, col1, lin2, col2 });
  }
}
