import { Pos } from '@/base';
import { L3Expression } from '@/beans/expression/expression';
import { L3Statement } from '@/beans/statement/l3-statement';

export class L3ReturnStatement extends L3Statement {
  expr: L3Expression | null;

  constructor(expr: L3Expression | null, pos: Pos) {
    super(pos);
    this.expr = expr;
  }

  toString(): string {
    return 'return';
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  expr: `);
    this.expr ? this.expr.debugPrint(out, `${prefix}  `) : out.push('(void)\n');
  }
}
