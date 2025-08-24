import { Pos } from '@/base';
import { L3Expression } from '@/beans/expression/expression';
import { L3Type } from '@/beans/type/l3-type';
import { L3TypedSymbol } from '@/beans/type/simple-type';

export class L3Variable extends L3TypedSymbol {
  initExpr: L3Expression | null;

  constructor(name: string, type: L3Type, initExpr: L3Expression | null, pos: Pos) {
    super(name, type, pos);
    this.initExpr = initExpr;
  }

  toString(): string {
    return 'variable';
  }
  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  initExpr: `);
    this.initExpr ? this.initExpr.debugPrint(out, `${prefix}  `) : out.push(' (none)\n');
  }
}
