import { ERROR, Pos } from '../base';
import { L1Base, L1ParseContext, L1ParserReader } from './l1-types';

export class L1String extends L1Base {
  value: string;

  constructor(value: string, pos: Pos) {
    super(pos);
    this.value = value;
  }

  getName(): string {
    return 'L1String';
  }

  toString(): string {
    return `string "${this.value}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  value: ${this.value}\n`);
  }

  static matches(token: any, value?: string): token is L1String {
    return token instanceof L1String && (value === undefined || token.value === value);
  }
}

function read(c: L1ParseContext): L1String | undefined {
  if (c.current !== '"') {
    return;
  }
  let value = '';
  const lin1 = c.lin;
  const col1 = c.col;
  let lin2 = c.lin;
  let col2 = c.col + 1;
  c.consume();

  while (true) {
    if (!c.current) {
      c.errors.push({
        level: ERROR,
        pos: { lin1: c.lin, col1: c.col, lin2: c.lin, col2: c.col },
        message: `Unterminated string`,
      });
      break;
    }
    if (c.current === '"') {
      c.consume();
      break;
    }
    value += c.current;
    lin2 = c.lin;
    col2 = c.col + 1;
    c.consume();
  }
  return new L1String(value, { lin1, col1, lin2, col2 });
}

export const l1StringReader: L1ParserReader = { read };
