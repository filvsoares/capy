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
  L2Expression,
  L2Identifier,
  L2Method,
  L2MethodCall,
  L2Number,
  L2Operation,
  L2String,
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
  voidType,
  L3Expression,
  isStringType,
  L3Dereference,
  stringType,
  L3StringConcat,
  L3ParseResult,
} from './l3-types';
import { indent } from './util';

const INVALID = 1;
type Invalid = typeof INVALID;
type ReadResult<T> = T | Invalid | undefined;

function checkType(name: string): L3PrimitiveType {
  if (name === 'string' || name === 'number' || name === 'boolean') {
    return name;
  }
  throw new Error(`Unknown type "${name}"`);
}

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
          this.symbols[item.name] = new L3Variable(new L3SimpleType(checkType(item.type.name)), item.pos);
        }
      } else if (item instanceof L2Method) {
        if (this.symbols[item.name]) {
          this.errors.push({
            level: ERROR,
            message: `Symbol "${item.name}" already defined`,
            pos: item.pos,
          });
        } else {
          const method = new L3Method(
            new L3CallableType(item.returnType && new L3SimpleType(checkType(item.returnType.name))),
            [],
            item.pos
          );
          this.symbols[item.name] = method;
          deferredTasks.push(() => {
            this.processStatements(method, item);
          });
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
              new L3Operation(start, [new L3MethodCall([], INTERNAL)], voidType, false, INTERNAL),
              INTERNAL
            ),
          ]
        : [];
    return {
      runnable: new L3Runnable(this.symbols, initialStatements),
      errors: this.errors,
    };
  }

  processStatements(method: L3Method, origin: L2Method) {
    for (const item of origin.statementList) {
      if (item instanceof L2Operation) {
        const op = this.processOperation(item);
        if (op !== INVALID) {
          method.statements.push(new L3ExpressionStatement(op, item.pos));
        }
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
      return this.processReference(src.value);
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
        const argList: L3Expression[] = [];
        for (const l2arg of step.argList) {
          const l3arg = this.processExpression(l2arg);
          if (l3arg === INVALID) {
            return INVALID;
          }
          argList.push(l3arg);
        }
        steps.push(new L3MethodCall(argList, step.pos));
        type = voidType;
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
          type = stringType;
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

  processReference(name: string, pos: Pos = INTERNAL): L3Reference | Invalid {
    const symbol = this.symbols[name];
    if (!(symbol instanceof L3Variable)) {
      this.errors.push({
        level: ERROR,
        message: `Undefined symbol "${name}"`,
        pos: pos,
      });
      return INVALID;
    }
    return new L3Reference(name, symbol.type, pos);
  }
}

export function layer3Parse(list: L2Base[], libs: { [name: string]: L3Library }) {
  return new L3Parser().parse(list, libs);
}
