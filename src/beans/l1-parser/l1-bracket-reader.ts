import { ERROR } from '@/base';
import { L1Base } from '@/beans/l1-parser/l1-base';
import { L1Bracket } from '@/beans/l1-parser/l1-bracket';
import { L1Parser, L1ParserContext } from '@/beans/l1-parser/l1-parser';
import { L1Reader } from '@/beans/l1-parser/l1-reader';
import { Bean } from '@/util/beans';

function isBracketStart(c: string) {
  return c === '(' || c === '[' || c === '{';
}

function isBracketEnd(c: string) {
  return c === ')' || c === ']' || c === '}';
}

export class L1BracketReader extends Bean implements L1Reader {
  constructor(private parser: L1Parser) {
    super();
    this.parser = parser;
  }

  read(c: L1ParserContext): L1Bracket | undefined {
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
      const item = this.parser.read(c);
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
