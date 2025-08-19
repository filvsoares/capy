import { combinePos, ERROR, fallbackPos, Pos } from '@/beans/base';
import { L2Statement } from './l2-statement';
import { L2Expression } from '../l2-expression/l2-expression-reader';

export class L2ExpressionStatement extends L2Statement {
  expr: L2Expression;

  constructor(expr: L2Expression, pos: Pos) {
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
