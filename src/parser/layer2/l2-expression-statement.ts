import { combinePos, ERROR, fallbackPos, Pos } from '@/parser/base';
import { L2Expression, readExpression } from './l2-expression';
import { L2Statement } from './l2-statement';
import { INVALID, L2ParseContext, ReadResult } from './l2-types';
import { L1Separator } from '../layer1/reader/l1-separator';

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

export function readExpressionStatement(c: L2ParseContext): ReadResult<L2ExpressionStatement> {
  const val = readExpression(c, {
    unexpectedTokenErrorMsg: (t) => `Expected ";" but found ${t}`,
  });
  if (val === INVALID) {
    return INVALID;
  }
  if (!val) {
    return;
  }

  const t = c.current;
  if (L1Separator.matches(t, ';')) {
    c.consume();
  } else {
    c.errors.push({
      level: ERROR,
      message: `Expected ";"`,
      pos: fallbackPos(t?.pos, val.pos),
    });
  }

  return new L2ExpressionStatement(val, combinePos(val.pos, (t ?? val).pos));
}
