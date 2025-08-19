import { ERROR, Pos } from '@/beans/base';
import { L1Base, L1ParseContext } from '@/beans/l1-parser/l1-types';
import { Bean } from '@/util/beans';
import { L1Parser, L1Reader } from '../l1-parser/_bean-interfaces';

function isBracketStart(c: string) {
  return c === '(' || c === '[' || c === '{';
}

function isBracketEnd(c: string) {
  return c === ')' || c === ']' || c === '}';
}

export class L1Bracket extends L1Base {
  start: string;
  end: string;
  tokenList: L1Base[];

  constructor(start: string, end: string, tokenList: L1Base[], pos: Pos) {
    super(pos);
    this.start = start;
    this.end = end;
    this.tokenList = tokenList;
  }

  toString(): string {
    return `bracket "${this.start}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  start: ${this.start}\n`);
    out.push(`${prefix}  tokenList:\n`);
    this.tokenList.forEach((val) => {
      out.push(`${prefix}    - `);
      val.debugPrint(out, `${prefix}      `);
    });
  }

  static matches(token: any, value?: string): token is L1Bracket {
    return token instanceof L1Bracket && (value === undefined || token.start === value);
  }
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
