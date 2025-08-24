import { ERROR } from '@/base';
import { L3Expression } from '@/beans/expression/l3-expression';
import { INVALID, Invalid } from '@/beans/l3-parser/l3-base';
import { L3CallableType } from '@/beans/method/l3-callable-type';
import { Bean } from '@/util/beans';
import { L2OperationStep } from '../expression/l2-expression';
import { L3ExpressionContext, L3ExpressionProcessor } from '../expression/l3-expression-processor';
import { L3Operation, L3OperationProcessor } from '../expression/l3-operation-processor';
import { L3ParseContext } from '../l3-parser/l3-parser';
import { L3VariableReference } from '../method/l3-method';
import { isStringType, STRING } from '../type/l3-simple-type';
import { L3TypeProcessor } from '../type/l3-type-processor';
import { L2Addition } from './l2-addition';
import { L2Assignment } from './l2-assignment';
import { L2MethodCall } from './l2-method-call';
import { L3Assignment, L3MethodCall, L3StringConcat } from './l3-operation-processor';

export class L3OperationProcessorImpl extends Bean implements L3OperationProcessor {
  constructor(private l3ExpressionProcessor: L3ExpressionProcessor, private l3TypeProcessor: L3TypeProcessor) {
    super();
  }

  processOperation(
    c: L3ParseContext,
    operand: L3Expression,
    step: L2OperationStep,
    context: L3ExpressionContext | null
  ): L3Operation | Invalid | undefined {
    if (step instanceof L2MethodCall) {
      if (!(operand.type instanceof L3CallableType)) {
        c.errors.push({
          level: ERROR,
          message: `${operand.type} is not callable`,
          pos: step.pos,
        });
        return INVALID;
      }
      if (operand.type.argList.length !== step.argList.length) {
        c.errors.push({
          level: ERROR,
          message: `Method expects ${operand.type.argList.length} argument(s) but ${step.argList.length} was/were provided`,
          pos: step.pos,
        });
        return INVALID;
      }
      const argList: L3Expression[] = [];
      for (let i = 0; i < step.argList.length; i++) {
        const l3arg = this.l3ExpressionProcessor.readReference(
          c,
          this.l3ExpressionProcessor.processExpression(c, step.argList[i], context)
        );
        if (l3arg === INVALID) {
          return INVALID;
        }
        if (!this.l3TypeProcessor.isAssignable(l3arg.type, operand.type.argList[i].type)) {
          c.errors.push({
            level: ERROR,
            message: `Argument ${i + 1} expects type ${operand.type.argList[i].type} but ${l3arg.type} was provided`,
            pos: l3arg.pos,
          });
          return INVALID;
        }
        argList.push(l3arg);
      }
      const _operand = this.l3ExpressionProcessor.readReference(c, operand);
      if (_operand === INVALID) {
        return INVALID;
      }
      return new L3MethodCall(_operand, argList, operand.type.returnType, step.pos);
    }
    if (step instanceof L2Addition) {
      const other = this.l3ExpressionProcessor.readReference(
        c,
        this.l3ExpressionProcessor.processExpression(c, step.operand, context)
      );
      if (other === INVALID) {
        return INVALID;
      }
      if (isStringType(operand.type) && isStringType(other.type)) {
        const _operand = this.l3ExpressionProcessor.readReference(c, operand);
        if (_operand === INVALID) {
          return INVALID;
        }
        return new L3StringConcat(_operand, other, STRING, step.pos);
      }
      c.errors.push({
        level: ERROR,
        message: `Cannot apply addition to ${operand.type} and ${other.type}`,
        pos: step.pos,
      });
      return INVALID;
    }
    if (step instanceof L2Assignment) {
      const target = this.l3ExpressionProcessor.processExpression(c, step.operand, context);
      if (target === INVALID) {
        return INVALID;
      }
      if (!(target instanceof L3VariableReference)) {
        c.errors.push({
          level: ERROR,
          message: `Cannot assign value to ${target}`,
          pos: target.pos,
        });
        return INVALID;
      }
      if (!this.l3TypeProcessor.isAssignable(operand.type, target.type)) {
        c.errors.push({
          level: ERROR,
          message: `Value of type ${operand.type} cannot be assigned to variable of type ${target.type}`,
          pos: target.pos,
        });
        return INVALID;
      }
      return new L3Assignment(operand, target, operand.type, step.pos);
    }
  }
}
