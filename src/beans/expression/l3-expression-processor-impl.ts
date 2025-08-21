import { ERROR } from '@/base';
import { Bean } from '@/util/beans';
import { MethodStack } from '../definition/l3-method-processor';
import { L3ParseContext } from '../l3-parser/l3-parser';
import { L2Addition } from '../operation/l2-addition';
import { L2Assignment } from '../operation/l2-assignment';
import { L2MethodCall } from '../operation/l2-method-call';
import { L3TypeProcessor } from '../type/l3-type-processor';
import {
  INVALID,
  Invalid,
  isStringType,
  L3Assignment,
  L3CallableType,
  L3Expression,
  L3LocalVariableReference,
  L3Method,
  L3MethodCall,
  L3MethodReference,
  L3ModuleVariableReference,
  L3Number,
  L3Operation,
  L3OperationStep,
  L3ReadVariable,
  L3String,
  L3StringConcat,
  L3Variable,
  L3VariableReference,
  STRING,
} from '../type/l3-types';
import { L2Expression, L2Identifier, L2Number, L2Operation, L2String } from './l2-expression';
import { L3ExpressionProcessor } from './l3-expression-processor';

export class L3ExpressionProcessorImpl extends Bean implements L3ExpressionProcessor {
  constructor(private l3TypeProcessor: L3TypeProcessor) {
    super();
  }

  processExpression(c: L3ParseContext, src: L2Expression, stack: MethodStack | null): L3Expression | Invalid {
    if (src instanceof L2String) {
      return new L3String(src.value, src.pos);
    }
    if (src instanceof L2Number) {
      return new L3Number(src.value, src.pos);
    }
    if (src instanceof L2Identifier) {
      return this.processReference(c, src, stack);
    }
    if (src instanceof L2Operation) {
      return this.processOperation(c, src, stack);
    }
    c.errors.push({
      level: ERROR,
      message: `I still don't understand ${src.constructor.name}`,
      pos: src.pos,
    });
    return INVALID;
  }

  readVariable(obj: L3Expression | Invalid) {
    if (obj === INVALID) {
      return INVALID;
    }
    if (!(obj instanceof L3VariableReference)) {
      return obj;
    }
    return new L3Operation(obj, [new L3ReadVariable()], obj.type, obj.pos);
  }

  processOperation(c: L3ParseContext, src: L2Operation, stack: MethodStack | null): L3Operation | Invalid {
    const operand = this.processExpression(c, src.operand, stack);
    if (operand === INVALID) {
      return INVALID;
    }
    let type = operand.type;
    let isVariable = operand instanceof L3VariableReference;
    const steps: L3OperationStep[] = [];
    for (const step of src.steps) {
      if (step instanceof L2MethodCall) {
        if (!(type instanceof L3CallableType)) {
          c.errors.push({
            level: ERROR,
            message: `${type} is not callable`,
            pos: step.pos,
          });
          return INVALID;
        }
        if (type.argList.length !== step.argList.length) {
          c.errors.push({
            level: ERROR,
            message: `Method expects ${type.argList.length} argument(s) but ${step.argList.length} was/were provided`,
            pos: step.pos,
          });
          return INVALID;
        }
        const argList: L3Expression[] = [];
        for (let i = 0; i < step.argList.length; i++) {
          const l3arg = this.readVariable(this.processExpression(c, step.argList[i], stack));
          if (l3arg === INVALID) {
            return INVALID;
          }
          if (!this.l3TypeProcessor.isAssignable(l3arg.type, type.argList[i].type)) {
            c.errors.push({
              level: ERROR,
              message: `Argument ${i + 1} expects type ${type.argList[i].type} but ${l3arg.type} was provided`,
              pos: l3arg.pos,
            });
            return INVALID;
          }
          argList.push(l3arg);
        }
        if (isVariable) {
          steps.push(new L3ReadVariable());
          isVariable = false;
        }
        steps.push(new L3MethodCall(argList, step.pos));
        type = type.returnType;
      } else if (step instanceof L2Addition) {
        const other = this.readVariable(this.processExpression(c, step.operand, stack));
        if (other === INVALID) {
          return INVALID;
        }
        if (isStringType(type) && isStringType(other.type)) {
          if (isVariable) {
            steps.push(new L3ReadVariable());
            isVariable = false;
          }
          steps.push(new L3StringConcat(other, step.pos));
          type = STRING;
        } else {
          c.errors.push({
            level: ERROR,
            message: `Cannot apply addition to ${type} and ${other.type}`,
            pos: step.pos,
          });
          return INVALID;
        }
      } else if (step instanceof L2Assignment) {
        const target = this.processExpression(c, step.operand, stack);
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
        if (!this.l3TypeProcessor.isAssignable(type, target.type)) {
          c.errors.push({
            level: ERROR,
            message: `Value of type ${type} cannot be assigned to variable of type ${target.type}`,
            pos: target.pos,
          });
          return INVALID;
        }
        if (isVariable) {
          steps.push(new L3ReadVariable());
          isVariable = false;
        }
        steps.push(new L3Assignment(target, step.pos));
      } else {
        c.errors.push({
          level: ERROR,
          message: `I still don't understand ${step.constructor.name}`,
          pos: step.pos,
        });
        return INVALID;
      }
    }
    return new L3Operation(operand, steps, type, src.pos);
  }

  processReference(
    c: L3ParseContext,
    ref: L2Identifier,
    stack: MethodStack | null
  ): L3MethodReference | L3VariableReference | Invalid {
    if (stack) {
      const index = stack.find(ref);
      if (index !== undefined) {
        const dep = stack.items[index];
        return new L3LocalVariableReference(index, dep.name, dep.type, ref.pos);
      }
    }
    const symbols = c.allSymbols[ref.value];
    if (symbols) {
      if (symbols.length > 1) {
        c.errors.push({
          level: ERROR,
          message: `Dependency ${ref.value} is ambiguous`,
          pos: ref.pos,
        });
        return INVALID;
      }
      const { module, symbol } = symbols[0];
      if (symbol instanceof L3Method) {
        return new L3MethodReference(module, symbol.name, symbol.type, ref.pos);
      }
      if (symbol instanceof L3Variable) {
        return new L3ModuleVariableReference(module, symbol.name, symbol.type, ref.pos);
      }
      throw new Error(`Unexpected symbol type ${symbol.constructor.name}`);
    }
    c.errors.push({
      level: ERROR,
      message: `Could not find reference ${ref.value}`,
      pos: ref.pos,
    });
    return INVALID;
  }
}
