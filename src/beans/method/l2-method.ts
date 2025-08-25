import { Pos } from '@/base';
import { L2Toplevel } from '@/beans/l2-parser/l2-parser';
import { CallableType } from '@/beans/method/callable-type';
import { StatementList } from '../statement/statement-list';

export class L2Method extends L2Toplevel {
  constructor(public name: string, public type: CallableType, public statementList: StatementList, pos: Pos) {
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
