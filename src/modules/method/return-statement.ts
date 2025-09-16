import { Pos } from '@/base';
import { Expression } from '@/modules/expression/expression';
import { Statement } from '@/modules/statement/statement';

export class ReturnStatement extends Statement {
  expr: Expression | null;

  constructor(expr: Expression | null, pos: Pos) {
    super(pos);
    this.expr = expr;
  }

  toString(): string {
    return `return statement`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);

    out.push(`${prefix}  expr: `);
    this.expr ? this.expr.debugPrint(out, `${prefix}  `) : out.push(` (void)\n`);
  }
}
