import { TokenizerContext } from '@/beans/parser/parser';
import { Bean } from '@/util/beans';
import { Operator } from './operator';
import { TokenReader } from './token-reader';

type OperatorMap = { [name: string]: true | OperatorMap };

const operatorMap: OperatorMap = {
  '=': { '=': true },
  '+': true,
  '-': true,
  '*': true,
  '/': true,
  ':': true,
  '.': true,
};

function isOperator(s: string) {
  let currentMapPos: OperatorMap | true = operatorMap;
  for (const c of s) {
    if (currentMapPos === true) {
      /* Map has ended but there are still chars in the string */
      return false;
    }
    currentMapPos = currentMapPos[c];
    if (!currentMapPos) {
      /* Not found */
      return false;
    }
  }
  return true;
}

export class OperatorReader extends Bean implements TokenReader {
  read(c: TokenizerContext): Operator | undefined {
    if (!isOperator(c.current())) {
      return;
    }
    let value = c.current();
    const lin1 = c.lin();
    const col1 = c.col();
    let lin2 = c.lin();
    let col2 = c.col() + 1;
    c.consume();
    while (c.current() && isOperator(value + c.current())) {
      value += c.current();
      lin2 = c.lin();
      col2 = c.col() + 1;
    }
    return new Operator(value, { lin1, col1, lin2, col2 });
  }
}
