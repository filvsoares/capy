import { Pos } from '@/base';
import { L2Expression } from '../expression/l2-expression';
import { L2Definition } from '../impexp/l2-definition';
import { L2Type } from '../type/l2-type';

export class L2Variable extends L2Definition {
  initExpr: L2Expression | null;

  constructor(name: string, type: L2Type, initExpr: L2Expression | null, pos: Pos) {
    super(name, type, pos);
    this.initExpr = initExpr;
  }

  toString(): string {
    return `variable "${this.name}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  initExpr: `);
    this.initExpr ? this.initExpr.debugPrint(out, `${prefix}  `) : out.push('(none)\n');
  }
}
