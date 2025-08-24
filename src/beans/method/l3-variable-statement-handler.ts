import { ERROR } from '@/base';
import { L3Expression } from '@/beans/expression/expression';
import { L3ExpressionProcessor } from '@/beans/expression/l3-expression-processor';
import { INVALID, Invalid } from '@/beans/l3-parser/l3-base';
import { L3ParseContext } from '@/beans/l3-parser/l3-parser';
import { L3LocalVariable, L3LocalVariableReference } from '@/beans/method/l3-method';
import { MethodStack } from '@/beans/method/l3-method-processor';
import { L3Assignment } from '@/beans/operation/l3-operation-processor';
import { L2Statement } from '@/beans/statement/l2-statement';
import { L3ExpressionStatement } from '@/beans/statement/l3-expression-statement';
import { L3Statement } from '@/beans/statement/l3-statement';
import { L3StatementContext } from '@/beans/statement/l3-statement-context';
import { L3StatementHandler } from '@/beans/statement/l3-statement-handler';
import { L3Type } from '@/beans/type/l3-type';
import { L3TypeProcessor } from '@/beans/type/l3-type-processor';
import { L2Variable } from '@/beans/variable/l2-variable';
import { Bean } from '@/util/beans';

export class L3VariableStatementHandler extends Bean implements L3StatementHandler {
  constructor(private l3ExpressionProcessor: L3ExpressionProcessor, private l3TypeProcessor: L3TypeProcessor) {
    super();
  }

  processStatement(
    c: L3ParseContext,
    src: L2Statement,
    context: L3StatementContext,
    expectedReturnType: L3Type
  ): L3Statement | Invalid | undefined {
    if (!(src instanceof L2Variable) || !(context instanceof MethodStack)) {
      return;
    }
    const type = this.l3TypeProcessor.processType(c, src.type);
    if (type === INVALID) {
      return INVALID;
    }
    let l3expr: L3Expression | null = null;
    if (src.initExpr) {
      const _l3expr = this.l3ExpressionProcessor.processExpression(c, src.initExpr, context);
      if (_l3expr === INVALID) {
        return INVALID;
      }
      l3expr = _l3expr;
      if (!this.l3TypeProcessor.isAssignable(_l3expr.type, type)) {
        c.errors.push({
          level: ERROR,
          message: `Variable has type "${type}" but initializer has type "${_l3expr.type}"`,
          pos: src.pos,
        });
      }
    }
    const localVariable = new L3LocalVariable(src.name, type, src.pos);
    const index = context.add(localVariable);
    if (index === false) {
      c.errors.push({
        level: ERROR,
        message: `Identifier "${src.name}" already declared`,
        pos: src.pos,
      });
      return INVALID;
    }
    if (l3expr) {
      return new L3ExpressionStatement(
        new L3Assignment(l3expr, new L3LocalVariableReference(index, src.name, type, src.pos), type, src.pos),
        src.pos
      );
    }
  }
}
