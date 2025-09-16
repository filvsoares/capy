import { Pos } from '@/base';
import { Statement } from '@/modules/statement/statement';

export class StatementList extends Statement {
  list: Statement[];

  constructor(list: Statement[], pos: Pos) {
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
