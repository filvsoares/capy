/**
 * Capy project.
 * Copyright (c) 2025 - Filipe Vilela Soares
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @file Layer-3 parser implementation.
 */

import { Base, ERROR, INTERNAL, ParseError, Pos } from './base';
import {
  L2Addition,
  L2Base,
  L2CallableType,
  L2Expression,
  L2ExpressionStatement,
  L2Identifier,
  L2Method,
  L2MethodCall,
  L2Number,
  L2Operation,
  L2ReturnStatement,
  L2SimpleType,
  L2String,
  L2Type,
  L2Use,
  L2Variable,
} from './l2-types';
import {
  L3Definition,
  L3Library,
  L3Method,
  L3Type,
  L3Variable,
  L3Runnable as L3Runnable,
  L3Statement,
  L3Operation,
  L3OperationStep,
  L3Base,
  L3Reference,
  L3PrimitiveType,
  L3SimpleType,
  L3CallableType,
  L3MethodCall,
  L3String,
  L3Number,
  L3ExpressionStatement,
  L3Expression,
  isStringType,
  L3Dereference,
  L3StringConcat,
  L3ParseResult,
  L3Argument,
  VOID,
  STRING,
  L3ReturnStatement,
  isVoidType,
} from './l3-types';
import { indent } from './util';

const INVALID = 1;
type Invalid = typeof INVALID;

export class L3Parser {
  symbols: { [name: string]: L3Definition } = {};
  errors: ParseError[] = [];

  parse(list: L2Base[], libs: { [name: string]: L3Library }): L3ParseResult {
    const deferredTasks: (() => void)[] = [];
    for (const item of list) {
      if (item instanceof L2Use) {
        const lib = libs[item.value];
        if (!lib) {
          this.errors.push({
            level: ERROR,
            message: `Library "${item.value}" not found`,
            pos: item.pos,
          });
        }
        for (const def in lib.exported) {
          if (this.symbols[def]) {
            this.errors.push({
              level: ERROR,
              message: `Library "${item.value}" defines "${def}" but it is already defined`,
              pos: item.pos,
            });
          } else {
            this.symbols[def] = lib.exported[def];
          }
        }
      } else if (item instanceof L2Variable) {
        if (this.symbols[item.name]) {
          this.errors.push({
            level: ERROR,
            message: `Symbol "${item.name}" already defined`,
            pos: item.pos,
          });
        } else {
          const type = this.processType(item.type);
          if (type !== INVALID) {
            this.symbols[item.name] = new L3Variable(type, item.pos);
          }
        }
      } else if (item instanceof L2Method) {
        if (this.symbols[item.name]) {
          this.errors.push({
            level: ERROR,
            message: `Symbol "${item.name}" already defined`,
            pos: item.pos,
          });
        } else {
          const type = this.processCallableType(item.type);
          if (type !== INVALID) {
            const method = new L3Method(type, [], item.pos);
            this.symbols[item.name] = method;
            deferredTasks.push(() => {
              this.processMethod(method, item);
            });
          }
        }
      } else {
        this.errors.push({
          level: ERROR,
          message: `I still don't understand ${item.constructor.name}`,
          pos: item.pos,
        });
      }
    }
    for (const task of deferredTasks) {
      task();
    }
    const start = this.processReference('start');

    const initialStatements =
      start !== INVALID
        ? [
            new L3ExpressionStatement(
              new L3Operation(start, [new L3MethodCall([], INTERNAL)], VOID, false, INTERNAL),
              INTERNAL
            ),
          ]
        : [];
    return {
      runnable: new L3Runnable(this.symbols, initialStatements),
      errors: this.errors,
    };
  }

  processMethod(method: L3Method, origin: L2Method) {
    for (const item of origin.statementList) {
      if (item instanceof L2ExpressionStatement) {
        const expr = this.processExpression(item.expr);
        if (expr === INVALID) {
          continue;
        }
        method.statements.push(new L3ExpressionStatement(expr, item.pos));
      } else if (item instanceof L2ReturnStatement) {
        const expr = item.expr && this.processExpression(item.expr);
        if (expr === INVALID) {
          continue;
        }
        const isVoid = isVoidType(method.type.returnType);
        if (expr && isVoid) {
          this.errors.push({
            level: ERROR,
            message: `Cannot return expression when method has void return type`,
            pos: item.pos,
          });
          continue;
        }
        if (!expr && !isVoid) {
          this.errors.push({
            level: ERROR,
            message: `Must return expression of type ${method.type.returnType}`,
            pos: item.pos,
          });
          continue;
        }
        if (expr && !isVoid && !this.isAssignable(expr.type, method.type.returnType)) {
          this.errors.push({
            level: ERROR,
            message: `Return expects ${method.type.returnType} but ${expr.type} was provided`,
            pos: expr.pos,
          });
          continue;
        }
        method.statements.push(new L3ReturnStatement(expr, item.pos));
      } else {
        this.errors.push({
          level: ERROR,
          message: `I still don't understand ${item.constructor.name}`,
          pos: item.pos,
        });
      }
    }
  }

  processExpression(src: L2Expression): L3Expression | Invalid {
    if (src instanceof L2String) {
      return new L3String(src.value, src.pos);
    }
    if (src instanceof L2Number) {
      return new L3Number(src.value, src.pos);
    }
    if (src instanceof L2Identifier) {
      return this.processReference(src.value, src.pos);
    }
    if (src instanceof L2Operation) {
      return this.processOperation(src);
    }
    this.errors.push({
      level: ERROR,
      message: `I still don't understand ${src.constructor.name}`,
      pos: src.pos,
    });
    return INVALID;
  }

  dereference(obj: L3Expression) {
    if (!obj.isReference()) {
      return obj;
    }
    if (obj instanceof L3Operation) {
      obj.steps.push(new L3Dereference());
      return obj;
    }
    return new L3Operation(obj, [new L3Dereference()], obj.type, false, obj.pos);
  }

  processOperation(src: L2Operation): L3Operation | Invalid {
    const operand = this.processExpression(src.operand);
    if (operand === INVALID) {
      return INVALID;
    }
    let type = operand.type;
    let reference = operand.isReference();
    const steps: L3OperationStep[] = [];
    for (const step of src.steps) {
      if (step instanceof L2MethodCall) {
        if (!(type instanceof L3CallableType)) {
          this.errors.push({
            level: ERROR,
            message: `${type} is not callable`,
            pos: step.pos,
          });
          return INVALID;
        }
        if (type.argList.length !== step.argList.length) {
          this.errors.push({
            level: ERROR,
            message: `Method expects ${type.argList.length} argument(s) but ${step.argList.length} was/were provided`,
            pos: step.pos,
          });
          return INVALID;
        }
        const argList: L3Expression[] = [];
        for (let i = 0; i < step.argList.length; i++) {
          const l3arg = this.processExpression(step.argList[i]);
          if (l3arg === INVALID) {
            return INVALID;
          }
          if (!this.isAssignable(l3arg.type, type.argList[i].type)) {
            this.errors.push({
              level: ERROR,
              message: `Argument ${i + 1} expects type ${type.argList[i].type} but ${l3arg.type} was provided`,
              pos: l3arg.pos,
            });
            return INVALID;
          }
          argList.push(l3arg);
        }
        steps.push(new L3MethodCall(argList, step.pos));
        type = type.returnType;
        reference = false;
      } else if (step instanceof L2Addition) {
        const other = this.processExpression(step.operand);
        if (other === INVALID) {
          return INVALID;
        }
        if (isStringType(type) && isStringType(other.type)) {
          if (reference) {
            steps.push(new L3Dereference());
          }
          steps.push(new L3StringConcat(this.dereference(other), step.pos));
          type = STRING;
          reference = false;
        } else {
          this.errors.push({
            level: ERROR,
            message: `Cannot apply addition to ${type} and ${other.type}`,
            pos: step.pos,
          });
          return INVALID;
        }
      } else {
        this.errors.push({
          level: ERROR,
          message: `I still don't understand ${step.constructor.name}`,
          pos: step.pos,
        });
        return INVALID;
      }
    }
    return new L3Operation(operand, steps, type, reference, src.pos);
  }

  isAssignable(type: L3Type, assignTo: L3Type) {
    return type instanceof L3SimpleType && assignTo instanceof L3SimpleType && type.primitive === assignTo.primitive;
  }

  processReference(name: string, pos: Pos = INTERNAL): L3Reference | Invalid {
    const symbol = this.symbols[name];
    if (!(symbol instanceof L3Definition)) {
      this.errors.push({
        level: ERROR,
        message: `Undefined symbol "${name}"`,
        pos: pos,
      });
      return INVALID;
    }
    return new L3Reference(name, symbol.type, pos);
  }

  processCallableType(src: L2CallableType): L3CallableType | Invalid {
    const argList: L3Argument[] = [];
    for (const srcArg of src.argList) {
      const dstType = this.processType(srcArg.type);
      if (dstType === INVALID) {
        return INVALID;
      }
      argList.push(new L3Argument(srcArg.name, dstType, srcArg.pos));
    }
    const returnType = src.returnType ? this.processType(src.returnType) : VOID;
    if (returnType === INVALID) {
      return INVALID;
    }
    return new L3CallableType(argList, returnType, src.pos);
  }

  processType(src: L2Type): L3Type | Invalid {
    if (src instanceof L2SimpleType) {
      if (src.name === 'string' || src.name === 'number') {
        return new L3SimpleType(src.name, src.pos);
      }
      this.errors.push({
        level: ERROR,
        message: `I still don't understand type "${src.name}"`,
        pos: src.pos,
      });
      return INVALID;
    }
    if (src instanceof L2CallableType) {
      return this.processCallableType(src);
    }
    this.errors.push({
      level: ERROR,
      message: `I still don't understand "${src.constructor.name}"`,
      pos: src.pos,
    });
    return INVALID;
  }
}

export function layer3Parse(list: L2Base[], libs: { [name: string]: L3Library }) {
  return new L3Parser().parse(list, libs);
}
