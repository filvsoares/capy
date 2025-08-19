import { ERROR, Pos } from '@/beans/base';
import { L1Base, L1ParseContext } from '@/beans/l1-parser/l1-types';
import { Bean } from '@/util/beans';
import { L1Reader } from '../l1-parser/_bean-interfaces';

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

export class L1StringReader extends Bean implements L1Reader {
  read(c: L1ParseContext): L1String | undefined {
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
}
