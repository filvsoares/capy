import { Pos } from '@/base';
import { L2StatementList } from '../l2-statement/l2-statement-list';
import { L2CallableType } from '../l2-type/l2-callable-type';
import { L2Definition } from './l2-definition';

export class L2Method extends L2Definition<L2CallableType> {
  statementList: L2StatementList;

  constructor(name: string, type: L2CallableType, statementList: L2StatementList, pos: Pos) {
    super(name, type, pos);
    this.name = name;
    this.type = type;
    this.statementList = statementList;
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
