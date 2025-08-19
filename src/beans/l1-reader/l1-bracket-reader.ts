import { Bean } from '@/util/beans';
import { L1Reader } from '../l1-parser/l1-reader';
import { L1Parser } from '../l1-parser/l1-parser';
import { L1Base, L1ParseContext } from '../l1-parser/l1-types';
import { L1Bracket } from './l1-bracket';
import { ERROR } from '../base';

export function isBracketStart(c: string) {
  return c === '(' || c === '[' || c === '{';
}

export function isBracketEnd(c: string) {
  return c === ')' || c === ']' || c === '}';
}

export class L1BracketReader extends Bean implements L1Reader {
  parsers: L1Parser[];

  constructor([parsers]: [L1Parser[]]) {
    super();
    this.parsers = parsers;
  }
  read(c: L1ParseContext): L1Bracket | undefined {
    if (!isBracketStart(c.current)) {
      return;
    }

    const bracketStart = c.current;
    const expectedBracketEnd =
      bracketStart === '(' ? ')' : bracketStart === '[' ? ']' : bracketStart === '{' ? '}' : '';
    const lin1 = c.lin;
    const col1 = c.col;

    c.consume();

    const list: L1Base[] = [];
    while (true) {
      if (!c.current) {
        c.errors.push({
          level: ERROR,
          pos: { lin1: c.lin, col1: c.col, lin2: c.lin, col2: c.col },
          message: `Expected "${expectedBracketEnd}"`,
        });
        break;
      }
      if (isBracketEnd(c.current)) {
        break;
      }
      const item = this.parsers[0].read(c);
      if (!item) {
        c.errors.push({
          level: ERROR,
          pos: { lin1: c.lin, col1: c.col, lin2: c.lin, col2: c.col + 1 },
          message: `Unexpected char "${c.current}"`,
        });
        c.consume();
      }
      if (item instanceof L1Base) {
        list.push(item);
      }
    }

    const lin2 = c.lin;
    const col2 = c.col + 1;

    if (c.current) {
      if (c.current !== expectedBracketEnd) {
        c.errors.push({
          level: ERROR,
          pos: { lin1: c.lin, col1: c.col, lin2: c.lin, col2: c.col + 1 },
          message: `Expected "${expectedBracketEnd}" but found ${c.current}`,
        });
      }
      c.consume();
    }

    return new L1Bracket(bracketStart, expectedBracketEnd, list, { lin1, col1, lin2, col2 });
  }
}
