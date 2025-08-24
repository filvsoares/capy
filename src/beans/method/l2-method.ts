import { Pos } from '@/base';
import { L2Toplevel } from '@/beans/l2-parser/l2-parser';
import { L2CallableType } from '@/beans/method/l2-callable-type';
import { L2StatementList } from '../statement/l2-statement-list';

export class L2Method extends L2Toplevel {
  constructor(public name: string, public type: L2CallableType, public statementList: L2StatementList, pos: Pos) {
    super(pos);
  }

  toString(): string {
    return `method "${this.name}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  statementList: `);
    this.statementList.debugPrint(out, `${prefix}  `);
  }
}
