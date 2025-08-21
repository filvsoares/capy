import { Pos } from '@/base';
import { L2Expression } from '../expression/l2-expression';
import { L2Statement } from './l2-statement';

export class L2ReturnStatement extends L2Statement {
  expr: L2Expression | null;

  constructor(expr: L2Expression | null, pos: Pos) {
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
