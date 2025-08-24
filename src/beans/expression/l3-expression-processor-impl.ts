import { ERROR } from '@/base';
import { L3Expression } from '@/beans/expression/l3-expression';
import { L3Number } from '@/beans/expression/l3-number';
import { L3String } from '@/beans/expression/l3-string';
import { INVALID, Invalid } from '@/beans/l3-parser/l3-base';
import { Bean } from '@/util/beans';
import { L3ParseContext } from '../l3-parser/l3-parser';
import { L3TypeProcessor } from '../type/l3-type-processor';
import { L2Expression, L2Identifier, L2Number, L2Operation, L2String } from './l2-expression';
import { L3ExpressionContext, L3ExpressionProcessor } from './l3-expression-processor';
import { L3OperationProcessor } from './l3-operation-processor';
import { L3Reference } from './l3-reference';
import { L3ReferenceProcessor } from './l3-reference-processor';

export class L3ExpressionProcessorImpl extends Bean implements L3ExpressionProcessor {
  constructor(
    private l3OperationProcessors: L3OperationProcessor[],
    private l3ReferenceProcessors: L3ReferenceProcessor[],
    private l3TypeProcessor: L3TypeProcessor
  ) {
    super();
  }

  processExpression(c: L3ParseContext, src: L2Expression, context: L3ExpressionContext | null): L3Expression | Invalid {
    if (src instanceof L2String) {
      return new L3String(src.value, src.pos);
    }
    if (src instanceof L2Number) {
      return new L3Number(src.value, src.pos);
    }
    if (src instanceof L2Identifier) {
      return this.processReference(c, src, context);
    }
    if (src instanceof L2Operation) {
      return this.processOperation(c, src, context);
    }
    c.errors.push({
      level: ERROR,
      message: `I still don't understand ${src.constructor.name}`,
      pos: src.pos,
    });
    return INVALID;
  }

  processOperation(c: L3ParseContext, src: L2Operation, context: L3ExpressionContext | null): L3Expression | Invalid {
    let operand = this.processExpression(c, src.operand, context);
    if (operand === INVALID) {
      return INVALID;
    }
    loop: for (const step of src.steps) {
      for (const p of this.l3OperationProcessors) {
        const result = p.processOperation(c, operand, step, context);
        if (result === INVALID) {
          return INVALID;
        }
        if (result) {
          operand = result;
          continue loop;
        }
      }
      c.errors.push({
        level: ERROR,
        message: `I still don't understand ${step.constructor.name}`,
        pos: step.pos,
      });
      return INVALID;
    }
    return operand;
  }

  processReference(c: L3ParseContext, ref: L2Identifier, context: L3ExpressionContext | null): L3Reference | Invalid {
    for (const p of this.l3ReferenceProcessors) {
      const result = p.processReference(c, ref, context);
      if (result) {
        return result;
      }
    }
    c.errors.push({
      level: ERROR,
      message: `Could not find reference ${ref.value}`,
      pos: ref.pos,
    });
    return INVALID;
  }

  readReference(c: L3ParseContext, obj: L3Expression | Invalid): L3Expression | Invalid {
    if (obj === INVALID || !obj.isReference) {
      return obj;
    }
    for (const p of this.l3ReferenceProcessors) {
      const result = p.readReference(c, obj);
      if (result) {
        return result;
      }
    }
    c.errors.push({
      level: ERROR,
      message: `Cannot read reference type ${obj.constructor.name}`,
      pos: obj.pos,
    });
    return INVALID;
  }
}
