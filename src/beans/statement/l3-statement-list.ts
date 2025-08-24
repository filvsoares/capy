import { Pos } from '@/base';
import { L3Base } from '@/beans/l3-parser/l3-base';
import { L3Statement } from '@/beans/statement/l3-statement';

export class L3StatementList extends L3Base {
  list: L3Statement[];

  constructor(list: L3Statement[], pos: Pos) {
    super(pos);
    this.list = list;
  }

  toString(): string {
    return 'statement list';
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
