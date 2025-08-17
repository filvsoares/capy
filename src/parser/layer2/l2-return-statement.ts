import { combinePos, ERROR, fallbackPos, Pos } from '../base';
import { L1Separator } from '../layer1/l1-separator';
import { L1Keyword } from '../layer1/l1-word';
import { L2Expression, readExpression } from './l2-expression';
import { L2Statement } from './l2-statement';
import { INVALID, L2ParseContext, ReadResult } from './l2-types';

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

export function readReturnStatement(c: L2ParseContext): ReadResult<L2ReturnStatement> {
  const t1 = c.current;
  if (!L1Keyword.matches(t1, 'return')) {
    return;
  }
  c.consume();

  const t2 = c.current;
  if (L1Separator.matches(t2, ';')) {
    c.consume();
    return new L2ReturnStatement(null, combinePos(t1.pos, t2.pos));
  }

  const val = readExpression(c, {
    unexpectedTokenErrorMsg: (t) => `Expected expression but found ${t}`,
  });
  if (val === INVALID) {
    return INVALID;
  }
  if (!val) {
    c.errors.push({
      level: ERROR,
      message: `Expected expression but found ${t2}`,
      pos: fallbackPos(t2?.pos, t1.pos),
    });
    return INVALID;
  }

  const t3 = c.current;
  if (L1Separator.matches(t3, ';')) {
    c.consume();
  } else {
    c.errors.push({
      level: ERROR,
      message: `Expected ";"`,
      pos: fallbackPos(t3?.pos, val.pos),
    });
  }

  return new L2ReturnStatement(val, combinePos(t1.pos, (t3 ?? val).pos));
}
