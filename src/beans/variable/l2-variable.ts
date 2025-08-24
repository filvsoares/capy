import { Pos } from '@/base';
import { L2Toplevel } from '@/beans/l2-parser/l2-parser';
import { L2Expression } from '../expression/l2-expression';
import { Type } from '../type/type';

export class L2Variable extends L2Toplevel {
  type: Type;
  name: string;
  initExpr: L2Expression | null;

  constructor(name: string, type: Type, initExpr: L2Expression | null, pos: Pos) {
    super(pos);
    this.name = name;
    this.type = type;
    this.initExpr = initExpr;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  name: ${this.name}\n`);
    out.push(`${prefix}  type: `);
    this.type.debugPrint(out, `${prefix}  `);
    out.push(`${prefix}  initExpr: `);
    this.initExpr ? this.initExpr.debugPrint(out, `${prefix}  `) : out.push('(none)\n');
  }

  toString(): string {
    return `variable "${this.name}"`;
  }
}
