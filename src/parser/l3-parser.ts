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

import { Base } from './base';
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
  Runnable as L3Runnable,
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
} from './l3-types';
import { indent } from './util';

function checkType(name: string): L3PrimitiveType {
  if (name === 'string' || name === 'number') {
    return name;
  }
  throw new Error(`Unknown type "${name}"`);
}

export function link(list: L2Base[], libs: { [name: string]: L3Library }) {
  const symbols: { [name: string]: L3Definition } = {};
  const deferredTasks: (() => void)[] = [];
  for (const item of list) {
    if (item instanceof L2Use) {
      const lib = libs[item.value];
      if (!lib) {
        throw new Error(`Library "${item.value}" not found`);
      }
      for (const def in lib.exported) {
        if (symbols[def]) {
          throw new Error(`Symbol already defined "${def}"`);
        }
        symbols[def] = lib.exported[def];
      }
    } else if (item instanceof L2Variable) {
      if (symbols[item.name]) {
        throw new Error(`Symbol already defined "${item.name}"`);
      }
      symbols[item.name] = new L3Variable(new L3SimpleType(checkType(item.type.name)));
    } else if (item instanceof L2Method) {
      if (symbols[item.name]) {
        throw new Error(`Symbol already defined "${item.name}"`);
      }
      const method = new L3Method(
        new L3CallableType(item.returnType && new L3SimpleType(checkType(item.returnType.name))),
        []
      );
      symbols[item.name] = method;
      deferredTasks.push(() => {
        processStatements(method, item, symbols);
      });
    } else {
      throw new Error(`Unexpected ${item.toString()}`);
    }
  }
  for (const task of deferredTasks) {
    task();
  }
  const initialStatements = [
    new L3ExpressionStatement(
      new L3Operation(processReference('start', symbols), [new L3MethodCall([])], voidType, false)
    ),
  ];
  return new L3Runnable(symbols, initialStatements);
}

function processStatements(method: L3Method, origin: L2Method, symbols: { [name: string]: L3Definition }) {
  for (const item of origin.statementList) {
    if (item instanceof L2Operation) {
      method.statements.push(new L3ExpressionStatement(processOperation(item, symbols)));
    } else {
      throw new Error(`Unknown statement ${item.toString()}`);
    }
  }
}

function processExpression(src: L2Expression, symbols: { [name: string]: L3Definition }): L3Expression {
  if (src instanceof L2String) {
    return new L3String(src.value);
  }
  if (src instanceof L2Number) {
    return new L3Number(src.value);
  }
  if (src instanceof L2Identifier) {
    return processReference(src.value, symbols);
  }
  if (src instanceof L2Operation) {
    return processOperation(src, symbols);
  }
  throw new Error(`Unknown expression ${src}`);
}

function dereference(obj: L3Expression) {
  if (!obj.isReference()) {
    return obj;
  }
  if (obj instanceof L3Operation) {
    obj.steps.push(new L3Dereference());
    return obj;
  }
  return new L3Operation(obj, [new L3Dereference()], obj.type, false);
}

function processOperation(src: L2Operation, symbols: { [name: string]: L3Definition }) {
  const operand = processExpression(src.operand, symbols);
  let type = operand.type;
  let reference = operand.isReference();
  const steps: L3OperationStep[] = [];
  for (const step of src.steps) {
    if (step instanceof L2MethodCall) {
      const argList: L3Expression[] = [];
      for (const arg of step.argList) {
        argList.push(processExpression(arg, symbols));
      }
      steps.push(new L3MethodCall(argList));
      type = voidType;
      reference = false;
    } else if (step instanceof L2Addition) {
      const other = processExpression(step.operand, symbols);
      if (isStringType(type) && isStringType(other.type)) {
        if (reference) {
          steps.push(new L3Dereference());
        }
        steps.push(new L3StringConcat(dereference(other)));
        type = stringType;
        reference = false;
      } else {
        throw new Error(`Cannot apply addition to ${type} and ${other.type}`);
      }
    } else {
      throw new Error(`Unexpected ${step}`);
    }
  }
  return new L3Operation(operand, steps, type, reference);
}

function processReference(name: string, symbols: { [name: string]: L3Definition }) {
  const symbol = symbols[name];
  if (!(symbol instanceof L3Variable)) {
    throw new Error(`Undefined symbol "${name}"`);
  }
  return new L3Reference(name, symbol.type);
}
