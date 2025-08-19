import { Pos } from '@/beans/base';
import { L1Base, L1ParseContext } from '@/beans/l1-parser/l1-types';
import { Bean } from '@/util/beans';
import { L1Reader } from '../l1-parser/_bean-interfaces';

function isSeparator(c: string) {
  return c === ';' || c === ',';
}

export class L1Separator extends L1Base {
  value: string;

  constructor(value: string, pos: Pos) {
    super(pos);
    this.value = value;
  }

  toString(): string {
    return `separator "${this.value}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  value: ${this.value}\n`);
  }

  static matches(token: any, value?: string): token is L1Separator {
    return token instanceof L1Separator && (value === undefined || token.value === value);
  }
}

export class L1SeparatorReader extends Bean implements L1Reader {
  read(c: L1ParseContext): L1Separator | undefined {
    if (!isSeparator(c.current)) {
      return;
    }
    let value = c.current;
    const lin1 = c.lin;
    const col1 = c.col;
    const lin2 = c.lin;
    const col2 = c.col + 1;
    c.consume();
    return new L1Separator(value, { lin1, col1, lin2, col2 });
  }
}
