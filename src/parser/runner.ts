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
 * @file Runner implementation.
 */

import {
  L3Base,
  L3Expression,
  L3ExpressionStatement,
  L3LibraryMethod,
  L3Method,
  L3MethodCall,
  L3Number,
  L3Operation,
  L3Statement,
  L3String,
  L3StringConcat,
  L3Module,
  L3ReturnStatement,
  L3Symbol,
  L3ArgumentVariable,
  L3ReadVariable,
  L3Assignment,
  L3Variable,
  L3MethodReference,
  L3ModuleVariableReference,
  L3LocalVariableReference,
} from './l3-types';

class Variable {
  value: any;

  constructor(value: any) {
    this.value = value;
  }
}

export class Runner {
  modules: L3Module[] = [];
  resolvedModules: { [module: string]: { index: number; symbols?: { [symbol: string]: L3Symbol } } } = {};
  variables: { [module: string]: { [name: string]: Variable } } = {};

  stdout: string = '';

  constructor() {}

  runExpression(obj: L3Expression, deps: any[]) {
    if (obj instanceof L3String) {
      return obj.value;
    }
    if (obj instanceof L3Number) {
      return obj.value;
    }
    if (obj instanceof L3MethodReference) {
      const symbol = this.resolveSymbol(obj.module, obj.name);
      if (!(symbol instanceof L3Method || symbol instanceof L3LibraryMethod)) {
        throw new Error(`Expected method but found ${symbol.constructor.name}`);
      }
      return symbol;
    }
    if (obj instanceof L3ModuleVariableReference) {
      const symbol = this.resolveSymbol(obj.module, obj.name);
      if (!(symbol instanceof L3Variable)) {
        throw new Error(`Expected variable but found ${symbol.constructor.name}`);
      }
      let val1 = this.variables[obj.module];
      if (!val1) {
        this.variables[obj.module] = val1 = {};
      }
      let val2 = val1[obj.name];
      if (!val2) {
        val1[obj.name] = val2 = new Variable('');
        if (symbol.initExpr) {
          val2.value = this.runExpression(symbol.initExpr, []);
        }
      }
      return val2;
    }
    if (obj instanceof L3LocalVariableReference) {
      return deps[obj.index];
    }
    if (obj instanceof L3Operation) {
      return this.runOperation(obj, deps);
    }
    throw new Error(`Cannot read value from ${obj.constructor.name}`);
  }

  runOperation(op: L3Operation, deps: any[]) {
    let current: any = this.runExpression(op.operand, deps);
    for (const step of op.steps) {
      if (step instanceof L3MethodCall) {
        const argList: any[] = [];
        for (const arg of step.argList) {
          argList.push(this.runExpression(arg, deps));
        }
        if (current instanceof L3LibraryMethod) {
          current = current.callback(argList, this);
        } else if (current instanceof L3Method) {
          current = this.runMethod(current, argList);
        } else {
          throw new Error(`Cannot run ${current.constructor.name}`);
        }
      } else if (step instanceof L3StringConcat) {
        const other = this.runExpression(step.other, deps);
        current += other;
      } else if (step instanceof L3ReadVariable) {
        if (!(current instanceof Variable)) {
          throw new Error(`Current is not variable`);
        }
        current = current.value;
      } else if (step instanceof L3Assignment) {
        const target = this.runExpression(step.target, deps);
        if (!(target instanceof Variable)) {
          throw new Error('Assignment target is not variable');
        }
        target.value = current;
      } else {
        throw new Error(`Unknown step ${step.constructor.name}`);
      }
    }
    return current;
  }

  runMethod(method: L3Method, args: any[]): any {
    const deps = method.stack.map((item) => {
      if (item instanceof L3ArgumentVariable) {
        return new Variable(args[item.index]);
      }
      return new Variable('');
    });
    for (const item of method.statements) {
      if (item instanceof L3ExpressionStatement) {
        this.runExpression(item.expr, deps);
      } else if (item instanceof L3ReturnStatement) {
        return item.expr && this.runExpression(item.expr, deps);
      } else {
        throw new Error(`I still don't understand ${item.constructor.name}`);
      }
    }
  }

  resolveSymbol(moduleName: string, symbolName: string) {
    let resolvedModule = this.resolvedModules[moduleName];
    if (!resolvedModule) {
      throw new Error(`Module "${moduleName}" not found`);
    }
    let symbols = resolvedModule.symbols;
    if (!symbols) {
      const module = this.modules[resolvedModule.index];
      resolvedModule.symbols = symbols = {};
      for (const symbol of module.symbols) {
        symbols[symbol.name] = symbol;
      }
    }
    const symbol = symbols[symbolName];
    if (!symbol) {
      throw new Error(`Symbol "${symbolName}" not found in module ${moduleName}`);
    }
    return symbol;
  }

  run(modules: L3Module[], mainModuleName: string) {
    this.modules = modules;
    for (let i = 0; i < modules.length; i++) {
      this.resolvedModules[modules[i].name] = { index: i };
    }
    const startMethod = this.resolveSymbol(mainModuleName, 'start');
    if (!(startMethod instanceof L3Method)) {
      throw new Error(`Symbol "start" is not a method`);
    }
    this.runMethod(startMethod, []);
  }

  print(s: string) {
    this.stdout += s + '\n';
  }
}
