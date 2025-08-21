import { ERROR } from '@/base';
import { Bean } from '@/util/beans';
import { L2Variable } from '../definition/l2-variable';
import { MethodStack } from '../definition/l3-method-processor';
import { L3ExpressionProcessor } from '../expression/l3-expression-processor';
import { L3ParseContext } from '../l3-parser/l3-parser';
import { L3TypeProcessor } from '../type/l3-type-processor';
import {
  INVALID,
  isVoidType,
  L3Assignment,
  L3Expression,
  L3ExpressionStatement,
  L3LocalVariable,
  L3LocalVariableReference,
  L3Operation,
  L3ReturnStatement,
  L3StatementList,
  L3Type,
} from '../type/l3-types';
import { L2ExpressionStatement } from './l2-expression-statement';
import { L2ReturnStatement } from './l2-return-statement';
import { L2StatementList } from './l2-statement-list';
import { L3StatementProcessor } from './l3-statement-processor';

export class L3StatementProcessorImpl extends Bean implements L3StatementProcessor {
  constructor(private l3ExpressionProcessor: L3ExpressionProcessor, private l3TypeProcessor: L3TypeProcessor) {
    super();
  }

  processExpressionStatement(c: L3ParseContext, src: L2ExpressionStatement, stack: MethodStack) {
    const expr = this.l3ExpressionProcessor.processExpression(c, src.expr, stack);
    if (expr === INVALID) {
      return INVALID;
    }
    return new L3ExpressionStatement(expr, src.pos);
  }

  processReturnStatement(c: L3ParseContext, src: L2ReturnStatement, stack: MethodStack, expectedType: L3Type) {
    const expr =
      src.expr &&
      this.l3ExpressionProcessor.readVariable(this.l3ExpressionProcessor.processExpression(c, src.expr, stack));
    if (expr === INVALID) {
      return INVALID;
    }
    const isVoid = isVoidType(expectedType);
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
        message: `Must return expression of type ${expectedType}`,
        pos: src.pos,
      });
      return INVALID;
    }
    if (expr && !isVoid && !this.l3TypeProcessor.isAssignable(expr.type, expectedType)) {
      c.errors.push({
        level: ERROR,
        message: `Return expects ${expectedType} but ${expr.type} was provided`,
        pos: expr.pos,
      });
      return INVALID;
    }
    return new L3ReturnStatement(expr, src.pos);
  }

  processLocalVariable(c: L3ParseContext, src: L2Variable, stack: MethodStack) {
    const type = this.l3TypeProcessor.processType(c, src.type);
    if (type === INVALID) {
      return INVALID;
    }
    let l3expr: L3Expression | null = null;
    if (src.initExpr) {
      const _l3expr = this.l3ExpressionProcessor.processExpression(c, src.initExpr, stack);
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
    const index = stack.add(localVariable);
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
        new L3Operation(
          l3expr,
          [new L3Assignment(new L3LocalVariableReference(index, src.name, type, src.pos), src.pos)],
          type,
          src.pos
        ),
        src.pos
      );
    }
  }

  processStatementList(c: L3ParseContext, src: L2StatementList, stack: MethodStack, expectedReturnType: L3Type) {
    const dst = new L3StatementList([], src.pos);
    for (const item of src.list) {
      if (item instanceof L2ExpressionStatement) {
        const dstItem = this.processExpressionStatement(c, item, stack);
        if (dstItem !== INVALID) {
          dst.list.push(dstItem);
        }
        continue;
      }
      if (item instanceof L2ReturnStatement) {
        const dstItem = this.processReturnStatement(c, item, stack, expectedReturnType);
        if (dstItem !== INVALID) {
          dst.list.push(dstItem);
        }
        continue;
      }
      if (item instanceof L2Variable) {
        const dstItem = this.processLocalVariable(c, item, stack);
        if (dstItem && dstItem !== INVALID) {
          dst.list.push(dstItem);
        }
        continue;
      }
      if (item instanceof L2StatementList) {
        const dstItem = this.processStatementList(c, item, stack.createChild(), expectedReturnType);
        dst.list.push(dstItem);
        continue;
      }
      c.errors.push({
        level: ERROR,
        message: `I still don't understand ${item.constructor.name}`,
        pos: item.pos,
      });
    }
    return dst;
  }
}
