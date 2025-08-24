import { L3ExpressionProcessor } from '@/beans/expression/l3-expression-processor';
import { Invalid, INVALID } from '@/beans/l3-parser/l3-base';
import { L3ParseContext } from '@/beans/l3-parser/l3-parser';
import { L2ExpressionStatement } from '@/beans/statement/l2-expression-statement';
import { L2Statement } from '@/beans/statement/l2-statement';
import { L3ExpressionStatement } from '@/beans/statement/l3-expression-statement';
import { L3Statement } from '@/beans/statement/l3-statement';
import { L3StatementContext } from '@/beans/statement/l3-statement-context';
import { L3StatementHandler } from '@/beans/statement/l3-statement-handler';
import { L3Type } from '@/beans/type/l3-type';
import { Bean } from '@/util/beans';

export class L3ExpressionStatementHandler extends Bean implements L3StatementHandler {
  constructor(private l3ExpressionProcessor: L3ExpressionProcessor) {
    super();
  }

  processStatement(
    c: L3ParseContext,
    src: L2Statement,
    context: L3StatementContext,
    expectedReturnType: L3Type
  ): L3Statement | Invalid | undefined {
    if (!(src instanceof L2ExpressionStatement)) {
      return;
    }
    const expr = this.l3ExpressionProcessor.processExpression(c, src.expr, context);
    if (expr === INVALID) {
      return INVALID;
    }
    return new L3ExpressionStatement(expr, src.pos);
  }
}
