import { Pos } from '../base';
import { L1Base, L1ParseContext, L1ParserReader } from './l1-types';

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

export class L1Operator extends L1Base {
  value: string;

  constructor(value: string, pos: Pos) {
    super(pos);
    this.value = value;
  }

  toString(): string {
    return `operator "${this.value}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  value: ${this.value}\n`);
  }
}

function read(c: L1ParseContext): L1Operator | undefined {
  if (!isOperator(c.current)) {
    return;
  }
  let value = c.current;
  const lin1 = c.lin;
  const col1 = c.col;
  let lin2 = c.lin;
  let col2 = c.col + 1;
  c.consume();
  while (c.current && isOperator(value + c.current)) {
    value += c.current;
    lin2 = c.lin;
    col2 = c.col + 1;
  }
  return new L1Operator(value, { lin1, col1, lin2, col2 });
}

export const l1OperatorReader: L1ParserReader = { read };
