import { Pos } from '@/parser/base';
import { L2Statement } from './l2-statement';

export class L2StatementList extends L2Statement {
  list: L2Statement[];

  constructor(list: L2Statement[], pos: Pos) {
    super(pos);
    this.list = list;
  }

  toString(): string {
    return `statement list`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  list:\n`);
    this.list.forEach((val) => {
      out.push(`${prefix}    - `);
      val.debugPrint(out, `${prefix}      `);
    });
  }
}
