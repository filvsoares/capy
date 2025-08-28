import { Pos } from '@/base';
import { CallableType } from '@/modules/parser/method/callable-type';
import { LocalVariable } from '@/modules/parser/method/local-variable';
import { Method } from '@/modules/parser/method/method';
import { StatementList } from '@/modules/parser/statement/statement-list';

export class CapyMethod extends Method {
  stack: LocalVariable[];
  statementList: StatementList;

  constructor(
    module: string,
    name: string,
    type: CallableType,
    deps: LocalVariable[],
    statementList: StatementList,
    pos: Pos
  ) {
    super(module, name, type, pos);
    this.stack = deps;
    this.statementList = statementList;
  }

  toString(): string {
    return 'method';
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  stack:\n`);
    this.stack.forEach((val) => {
      out.push(`${prefix}    - `);
      val.debugPrint(out, `${prefix}      `);
    });
    out.push(`${prefix}  statementList: `);
    this.statementList.debugPrint(out, `${prefix}  `);
  }
}
