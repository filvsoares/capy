import { ERROR } from '@/base';
import { L3ExpressionProcessor } from '@/beans/expression/l3-expression-processor';
import { Invalid, INVALID } from '@/beans/l3-parser/l3-base';
import { L3ParseContext } from '@/beans/l3-parser/l3-parser';
import { L2ReturnStatement } from '@/beans/statement/l2-return-statement';
import { L2Statement } from '@/beans/statement/l2-statement';
import { L3ReturnStatement } from '@/beans/statement/l3-return-statement';
import { L3Statement } from '@/beans/statement/l3-statement';
import { L3StatementContext } from '@/beans/statement/l3-statement-context';
import { L3StatementHandler } from '@/beans/statement/l3-statement-handler';
import { L3Type } from '@/beans/type/l3-type';
import { L3TypeProcessor } from '@/beans/type/l3-type-processor';
import { isVoidType } from '@/beans/type/simple-type';
import { Bean } from '@/util/beans';

export class L3ReturnStatementHandler extends Bean implements L3StatementHandler {
  constructor(private l3ExpressionProcessor: L3ExpressionProcessor, private l3TypeProcessor: L3TypeProcessor) {
    super();
  }

  processStatement(
    c: L3ParseContext,
    src: L2Statement,
    context: L3StatementContext,
    expectedReturnType: L3Type
  ): L3Statement | Invalid | undefined {
    if (!(src instanceof L2ReturnStatement)) {
      return;
    }
    const expr =
      src.expr &&
      this.l3ExpressionProcessor.readReference(c, this.l3ExpressionProcessor.processExpression(c, src.expr, context));
    if (expr === INVALID) {
      return INVALID;
    }
    const isVoid = isVoidType(expectedReturnType);
    if (expr && isVoid) {
      c.errors.push({
        level: ERROR,
        message: `Cannot return expression when method has void return type`,
        pos: src.pos,
      });
      return INVALID;
    }
    if (!expr && !isVoid) {
      c.errors.push({
        level: ERROR,
        message: `Must return expression of type ${expectedReturnType}`,
        pos: src.pos,
      });
      return INVALID;
    }
    if (expr && !isVoid && !this.l3TypeProcessor.isAssignable(expr.type, expectedReturnType)) {
      c.errors.push({
        level: ERROR,
        message: `Return expects ${expectedReturnType} but ${expr.type} was provided`,
        pos: expr.pos,
      });
      return INVALID;
    }
    return new L3ReturnStatement(expr, src.pos);
  }
}
