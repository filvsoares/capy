import { Pos } from '@/base';
import { Expression } from '@/beans/expression/expression';
import { Statement } from '@/beans/statement/statement';

export class ExpressionStatement extends Statement {
  expr: Expression;

  constructor(expr: Expression, pos: Pos) {
    super(pos);
    this.expr = expr;
  }

  toString(): string {
    return `expression statement`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);

    out.push(`${prefix}  expr: `);
    this.expr.debugPrint(out, `${prefix}  `);
  }
}
