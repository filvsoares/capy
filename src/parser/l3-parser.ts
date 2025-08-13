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
  L2Assignment,
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
  L2Statement,
  L2StatementList,
  L2String,
  L2Type,
  L2Use,
  L2Variable,
} from './l2-types';
import {
  L3Method,
  L3Type,
  L3Variable,
  L3Module as L3Module,
  L3Statement,
  L3Operation,
  L3OperationStep,
  L3Base,
  L3PrimitiveType,
  L3SimpleType,
  L3CallableType,
  L3MethodCall,
  L3String,
  L3Number,
  L3ExpressionStatement,
  L3Expression,
  isStringType,
  L3ReadVariable,
  L3StringConcat,
  L3ParseResult,
  L3Argument,
  VOID,
  STRING,
  L3ReturnStatement,
  isVoidType,
  L3Symbol,
  L3LocalVariable as L3LocalVariable,
  L3ArgumentVariable,
  L3Assignment,
  L3VariableReference,
  L3MethodReference,
  L3LocalVariableReference,
  L3ModuleVariableReference,
  L3StatementList,
  L3UnresolvedMethod,
  L3CapyMethod,
} from './l3-types';

const INVALID = Symbol();
type Invalid = typeof INVALID;

class MethodStack {
  parent: MethodStack | null;
  items: L3LocalVariable[];
  itemsByName: { [name: string]: number };

  constructor(parent: MethodStack | null = null) {
    this.parent = parent;
    this.items = parent?.items ?? [];
    this.itemsByName = {};
  }

  add(item: L3LocalVariable): number | false {
    const existing = this.itemsByName[item.name];
    if (existing !== undefined) {
      return false;
    }
    const index = this.items.length;
    this.items.push(item);
    this.itemsByName[item.name] = index;
    return index;
  }

  find(ref: L2Identifier): number | undefined {
    let current: MethodStack | null = this;
    while (current) {
      const result = this.itemsByName[ref.value];
      if (result !== undefined) {
        return result;
      }
      current = current.parent;
    }
  }

  createChild() {
    return new MethodStack(this);
  }
}

export class L3Parser {
  errors: ParseError[] = [];
  mySymbols: { [name: string]: L3Symbol } = {};
  modules: { [name: string]: L3Module } = {};
  allSymbols: { [name: string]: { module: string; symbol: L3Symbol }[] } = {};
  deferredTasks: (() => void)[] = [];
  moduleName: string = '';

  addToMySymbols(symbol: L3Symbol) {
    if (this.mySymbols[symbol.name]) {
      return false;
    }
    this.mySymbols[symbol.name] = symbol;
    this.addToAllSymbols(this.moduleName, symbol);
    return true;
  }

  replaceInMySymbols(symbol: L3Symbol) {
    if (!this.mySymbols[symbol.name]) {
      return false;
    }
    this.mySymbols[symbol.name] = symbol;
  }

  addToAllSymbols(module: string, symbol: L3Symbol) {
    let list = this.allSymbols[symbol.name];
    if (!list) {
      this.allSymbols[symbol.name] = list = [];
    }
    list.push({ module, symbol });
  }

  parse(moduleName: string, list: L2Base[], modules: L3Module[]): L3ParseResult {
    this.moduleName = moduleName;
    for (const module of modules) {
      this.modules[module.name] = module;
    }

    for (const item of list) {
      if (item instanceof L2Use) {
        this.processUse(item);
        continue;
      }
      if (item instanceof L2Variable) {
        this.processVariable(item);
        continue;
      }
      if (item instanceof L2Method) {
        this.processMethod(item);
        continue;
      }
      this.errors.push({
        level: ERROR,
        message: `I still don't understand ${item.constructor.name}`,
        pos: item.pos,
      });
    }

    for (const task of this.deferredTasks) {
      task();
    }

    return {
      runnable: new L3Module(moduleName, Object.values(this.mySymbols)),
      errors: this.errors,
    };
  }

  processUse(use: L2Use) {
    const module = this.modules[use.value];
    if (!module) {
      this.errors.push({
        level: ERROR,
        message: `Module "${use.value}" not found`,
        pos: use.pos,
      });
    }
    for (const symbol of module.symbols) {
      this.addToAllSymbols(use.value, symbol);
    }
  }

  processVariable(item: L2Variable) {
    const type = this.processType(item.type);
    if (type === INVALID) {
      return;
    }
    const dst = new L3Variable(item.name, type, null, item.pos);
    if (!this.addToMySymbols(dst)) {
      this.errors.push({
        level: ERROR,
        message: `Symbol "${dst.name}" already defined`,
        pos: item.pos,
      });
    }

    if (item.initExpr) {
      this.deferredTasks.push(() => {
        this.processVariableInitializer(dst, item.initExpr!);
      });
    }
  }

  processMethod(method: L2Method) {
    const type = this.processCallableType(method.type);
    if (type === INVALID) {
      return;
    }
    const dst = new L3UnresolvedMethod(method.name, type, method.pos);
    if (!this.addToMySymbols(dst)) {
      this.errors.push({
        level: ERROR,
        message: `Symbol "${dst.name}" already defined`,
        pos: method.pos,
      });
    }

    this.deferredTasks.push(() => {
      this.resolveMethod(dst, method.statementList);
    });
  }

  processVariableInitializer(variable: L3Variable, initExpr: L2Expression) {
    const l3expr = this.processExpression(initExpr, null);
    if (l3expr === INVALID) {
      return;
    }
    variable.initExpr = l3expr;
  }

  resolveMethod(src: L3UnresolvedMethod, srcStatementList: L2StatementList) {
    const stack = new MethodStack();

    for (let i = 0; i < src.type.argList.length; i++) {
      const arg = src.type.argList[i];
      stack.add(new L3ArgumentVariable(i, arg.name, arg.type, arg.pos));
    }

    const statementList = this.processStatementList(srcStatementList, stack, src.type.returnType);

    const dst = new L3CapyMethod(src.name, src.type, stack.items, statementList, src.pos);
    this.replaceInMySymbols(dst);
  }

  processExpressionStatement(src: L2ExpressionStatement, stack: MethodStack) {
    const expr = this.processExpression(src.expr, stack);
    if (expr === INVALID) {
      return INVALID;
    }
    return new L3ExpressionStatement(expr, src.pos);
  }

  processReturnStatement(src: L2ReturnStatement, stack: MethodStack, expectedType: L3Type) {
    const expr = src.expr && this.readVariable(this.processExpression(src.expr, stack));
    if (expr === INVALID) {
      return INVALID;
    }
    const isVoid = isVoidType(expectedType);
    if (expr && isVoid) {
      this.errors.push({
        level: ERROR,
        message: `Cannot return expression when method has void return type`,
        pos: src.pos,
      });
      return INVALID;
    }
    if (!expr && !isVoid) {
      this.errors.push({
        level: ERROR,
        message: `Must return expression of type ${expectedType}`,
        pos: src.pos,
      });
      return INVALID;
    }
    if (expr && !isVoid && !this.isAssignable(expr.type, expectedType)) {
      this.errors.push({
        level: ERROR,
        message: `Return expects ${expectedType} but ${expr.type} was provided`,
        pos: expr.pos,
      });
      return INVALID;
    }
    return new L3ReturnStatement(expr, src.pos);
  }

  processLocalVariable(src: L2Variable, stack: MethodStack) {
    const type = this.processType(src.type);
    if (type === INVALID) {
      return INVALID;
    }
    let l3expr: L3Expression | null = null;
    if (src.initExpr) {
      const _l3expr = this.processExpression(src.initExpr, stack);
      if (_l3expr === INVALID) {
        return INVALID;
      }
      l3expr = _l3expr;
      if (!this.isAssignable(_l3expr.type, type)) {
        this.errors.push({
          level: ERROR,
          message: `Variable has type "${type}" but initializer has type "${_l3expr.type}"`,
          pos: src.pos,
        });
      }
    }
    const localVariable = new L3LocalVariable(src.name, type, src.pos);
    const index = stack.add(localVariable);
    if (index === false) {
      this.errors.push({
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

  processStatementList(src: L2StatementList, stack: MethodStack, expectedReturnType: L3Type) {
    const dst = new L3StatementList([], src.pos);
    for (const item of src.list) {
      if (item instanceof L2ExpressionStatement) {
        const dstItem = this.processExpressionStatement(item, stack);
        if (dstItem !== INVALID) {
          dst.list.push(dstItem);
        }
        continue;
      }
      if (item instanceof L2ReturnStatement) {
        const dstItem = this.processReturnStatement(item, stack, expectedReturnType);
        if (dstItem !== INVALID) {
          dst.list.push(dstItem);
        }
        continue;
      }
      if (item instanceof L2Variable) {
        const dstItem = this.processLocalVariable(item, stack);
        if (dstItem && dstItem !== INVALID) {
          dst.list.push(dstItem);
        }
        continue;
      }
      if (item instanceof L2StatementList) {
        const dstItem = this.processStatementList(item, stack.createChild(), expectedReturnType);
        dst.list.push(dstItem);
        continue;
      }
      this.errors.push({
        level: ERROR,
        message: `I still don't understand ${item.constructor.name}`,
        pos: item.pos,
      });
    }
    return dst;
  }

  processExpression(src: L2Expression, stack: MethodStack | null): L3Expression | Invalid {
    if (src instanceof L2String) {
      return new L3String(src.value, src.pos);
    }
    if (src instanceof L2Number) {
      return new L3Number(src.value, src.pos);
    }
    if (src instanceof L2Identifier) {
      return this.processReference(src, stack);
    }
    if (src instanceof L2Operation) {
      return this.processOperation(src, stack);
    }
    this.errors.push({
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

  processOperation(src: L2Operation, stack: MethodStack | null): L3Operation | Invalid {
    const operand = this.processExpression(src.operand, stack);
    if (operand === INVALID) {
      return INVALID;
    }
    let type = operand.type;
    let isVariable = operand instanceof L3VariableReference;
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
          const l3arg = this.readVariable(this.processExpression(step.argList[i], stack));
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
        if (isVariable) {
          steps.push(new L3ReadVariable());
          isVariable = false;
        }
        steps.push(new L3MethodCall(argList, step.pos));
        type = type.returnType;
      } else if (step instanceof L2Addition) {
        const other = this.readVariable(this.processExpression(step.operand, stack));
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
          this.errors.push({
            level: ERROR,
            message: `Cannot apply addition to ${type} and ${other.type}`,
            pos: step.pos,
          });
          return INVALID;
        }
      } else if (step instanceof L2Assignment) {
        const target = this.processExpression(step.operand, stack);
        if (target === INVALID) {
          return INVALID;
        }
        if (!(target instanceof L3VariableReference)) {
          this.errors.push({
            level: ERROR,
            message: `Cannot assign value to ${target}`,
            pos: target.pos,
          });
          return INVALID;
        }
        if (!this.isAssignable(type, target.type)) {
          this.errors.push({
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
        this.errors.push({
          level: ERROR,
          message: `I still don't understand ${step.constructor.name}`,
          pos: step.pos,
        });
        return INVALID;
      }
    }
    return new L3Operation(operand, steps, type, src.pos);
  }

  isAssignable(type: L3Type, assignTo: L3Type) {
    if (type instanceof L3SimpleType && assignTo instanceof L3SimpleType) {
      return type.primitive === assignTo.primitive;
    }
    if (type instanceof L3CallableType && assignTo instanceof L3CallableType) {
      if (!this.isAssignable(type.returnType, assignTo.returnType)) {
        return false;
      }
      if (type.argList.length !== assignTo.argList.length) {
        return false;
      }
      for (let i = 0; i < type.argList.length; i++) {
        if (!this.isAssignable(type.argList[i].type, assignTo.argList[i].type)) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  processReference(ref: L2Identifier, stack: MethodStack | null): L3MethodReference | L3VariableReference | Invalid {
    if (stack) {
      const index = stack.find(ref);
      if (index !== undefined) {
        const dep = stack.items[index];
        return new L3LocalVariableReference(index, dep.name, dep.type, ref.pos);
      }
    }
    const symbols = this.allSymbols[ref.value];
    if (symbols) {
      if (symbols.length > 1) {
        this.errors.push({
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
    this.errors.push({
      level: ERROR,
      message: `Could not find reference ${ref.value}`,
      pos: ref.pos,
    });
    return INVALID;
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

export function layer3Parse(moduleName: string, list: L2Base[], modules: L3Module[]) {
  return new L3Parser().parse(moduleName, list, modules);
}
