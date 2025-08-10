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
  L3Method,
  L3Type,
  L3Variable,
  L3Module as L3Module,
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
  L3Symbol,
  L3MethodDependency,
  L3ModuleSymbolDependency,
  L3ArgumentDependency,
} from './l3-types';

const INVALID = Symbol();
type Invalid = typeof INVALID;

class Scope {
  parent: L3Parser;
  deps: L3MethodDependency[] = [];
  depsByName: { [name: string]: number } = {};

  constructor(parent: L3Parser) {
    this.parent = parent;
  }

  add(dep: L3MethodDependency): number | Invalid {
    const existing = this.depsByName[dep.name];
    if (existing) {
      this.parent.errors.push({
        level: ERROR,
        message: `Dependency ${dep.name} already exists`,
        pos: dep.pos,
      });
      return INVALID;
    }
    const index = this.deps.length;
    this.deps.push(dep);
    this.depsByName[dep.name] = index;
    return index;
  }

  find(ref: L2Identifier): number | Invalid {
    const existing = this.depsByName[ref.value];
    if (existing !== undefined) {
      return existing;
    }
    const known = this.parent.knownDeps[ref.value];
    if (known) {
      if (known.length > 1) {
        this.parent.errors.push({
          level: ERROR,
          message: `Dependency ${ref.value} is ambiguous`,
          pos: ref.pos,
        });
        return INVALID;
      }
      return this.add(known[0]);
    }
    this.parent.errors.push({
      level: ERROR,
      message: `Dependency ${ref.value} not found`,
      pos: ref.pos,
    });
    return INVALID;
  }
}

export class L3Parser {
  errors: ParseError[] = [];
  symbols: { [name: string]: L3Symbol } = {};
  modules: { [name: string]: L3Module } = {};
  knownDeps: { [name: string]: L3MethodDependency[] } = {};
  deferredTasks: (() => void)[] = [];
  moduleName: string = '';

  addSymbol(val: L3Symbol) {
    if (this.symbols[val.name]) {
      return false;
    }
    this.symbols[val.name] = val;
    return true;
  }

  addKnownDep(name: string, val: L3MethodDependency) {
    const existing = this.knownDeps[name];
    if (existing) {
      existing.push(val);
    } else {
      this.knownDeps[name] = [val];
    }
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
      runnable: new L3Module(moduleName, Object.values(this.symbols)),
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
      const dst = new L3ModuleSymbolDependency(use.value, symbol.name, symbol.type, use.pos);
      this.addKnownDep(symbol.name, dst);
    }
  }

  processVariable(item: L2Variable) {
    const type = this.processType(item.type);
    if (type === INVALID) {
      return;
    }
    const dst = new L3Variable(item.name, type, item.pos);
    if (!this.addSymbol(dst)) {
      this.errors.push({
        level: ERROR,
        message: `Symbol "${dst.name}" already defined`,
        pos: item.pos,
      });
    }
    const dep = new L3ModuleSymbolDependency(this.moduleName, dst.name, dst.type, dst.pos);
    this.addKnownDep(dep.name, dep);
  }

  processMethod(method: L2Method) {
    const type = this.processCallableType(method.type);
    if (type === INVALID) {
      return;
    }
    const dst = new L3Method(method.name, type, [], [], method.pos);
    if (!this.addSymbol(dst)) {
      this.errors.push({
        level: ERROR,
        message: `Symbol "${dst.name}" already defined`,
        pos: method.pos,
      });
    }

    const dep = new L3ModuleSymbolDependency(this.moduleName, dst.name, dst.type, dst.pos);
    this.addKnownDep(dep.name, dep);

    this.deferredTasks.push(() => {
      this.processMethodStatements(dst, method);
    });
  }

  processMethodStatements(method: L3Method, origin: L2Method) {
    const scope = new Scope(this);
    method.deps = scope.deps;

    for (let i = 0; i < method.type.argList.length; i++) {
      const arg = method.type.argList[i];
      const dep = new L3ArgumentDependency(i, arg.name, arg.type, arg.pos);
      scope.add(dep);
    }

    for (const item of origin.statementList) {
      if (item instanceof L2ExpressionStatement) {
        const expr = this.processExpression(item.expr, scope);
        if (expr === INVALID) {
          continue;
        }
        method.statements.push(new L3ExpressionStatement(expr, item.pos));
      } else if (item instanceof L2ReturnStatement) {
        const expr = item.expr && this.processExpression(item.expr, scope);
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

  processExpression(src: L2Expression, scope: Scope): L3Expression | Invalid {
    if (src instanceof L2String) {
      return new L3String(src.value, src.pos);
    }
    if (src instanceof L2Number) {
      return new L3Number(src.value, src.pos);
    }
    if (src instanceof L2Identifier) {
      return this.processReference(src, scope);
    }
    if (src instanceof L2Operation) {
      return this.processOperation(src, scope);
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

  processOperation(src: L2Operation, scope: Scope): L3Operation | Invalid {
    const operand = this.processExpression(src.operand, scope);
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
          const l3arg = this.processExpression(step.argList[i], scope);
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
        const other = this.processExpression(step.operand, scope);
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

  processReference(ref: L2Identifier, scope: Scope): L3Reference | Invalid {
    const index = scope.find(ref);
    if (index === INVALID) {
      return INVALID;
    }
    const dep = scope.deps[index];
    return new L3Reference(index, dep.name, dep.type, ref.pos);
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
