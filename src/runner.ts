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

import { L3Expression } from '@/beans/expression/expression';
import { NumberLiteral } from '@/beans/expression/number-literal';
import { StringLiteral } from '@/beans/expression/string-literal';
import { L3MethodReference } from '@/beans/method/l3-method-reference';
import { L3ExpressionStatement } from '@/beans/statement/l3-expression-statement';
import { L3ReturnStatement } from '@/beans/statement/l3-return-statement';
import { L3StatementList } from '@/beans/statement/l3-statement-list';
import { L3Variable } from '@/beans/variable/l3-variable';
import { L3Module, L3Symbol } from './beans/l3-parser/l3-parser';
import {
  L3ArgumentVariable,
  L3CapyMethod,
  L3LibraryMethod,
  L3LocalVariableReference,
  L3Method,
  L3ModuleVariableReference,
} from './beans/method/l3-method';
import { L3Assignment, L3MethodCall, L3ReadVariable, L3StringConcat } from './beans/operation/l3-operation-processor';

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

  runExpression(obj: L3Expression, deps: any[]): any {
    if (obj instanceof StringLiteral) {
      return obj.value;
    }
    if (obj instanceof NumberLiteral) {
      return obj.value;
    }
    if (obj instanceof L3MethodReference) {
      const symbol = this.resolveSymbol(obj.module, obj.name);
      if (!(symbol instanceof L3Method)) {
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
    if (obj instanceof L3MethodCall) {
      const argList: any[] = [];
      for (const arg of obj.argList) {
        argList.push(this.runExpression(arg, deps));
      }
      const method = this.runExpression(obj.operand, deps);
      if (method instanceof L3LibraryMethod) {
        return method.callback(argList, this);
      }
      if (method instanceof L3CapyMethod) {
        return this.runMethod(method, argList);
      }
      throw new Error(`Cannot run ${method.constructor.name}`);
    }
    if (obj instanceof L3StringConcat) {
      const operand = this.runExpression(obj.operand, deps);
      const other = this.runExpression(obj.other, deps);
      return operand + other;
    }
    if (obj instanceof L3ReadVariable) {
      const variable = this.runExpression(obj.operand, deps);
      console.log(variable);
      if (!(variable instanceof Variable)) {
        throw new Error(`${variable.constructor.name} is not variable`);
      }
      return variable.value;
    }
    if (obj instanceof L3Assignment) {
      const target = this.runExpression(obj.target, deps);
      if (!(target instanceof Variable)) {
        throw new Error('Assignment target is not variable');
      }
      return obj;
    }
    throw new Error(`Cannot read value from ${obj.constructor.name}`);
  }

  runStatementList(statementList: L3StatementList, stack: any[]): any {
    for (const item of statementList.list) {
      if (item instanceof L3ExpressionStatement) {
        this.runExpression(item.expr, stack);
      } else if (item instanceof L3ReturnStatement) {
        return item.expr && this.runExpression(item.expr, stack);
      } else if (item instanceof L3StatementList) {
        const returned = this.runStatementList(item, stack);
        if (returned !== undefined) {
          return returned;
        }
      } else {
        throw new Error(`I still don't understand ${item.constructor.name}`);
      }
    }
  }

  runMethod(method: L3CapyMethod, args: any[]): any {
    const stack = method.stack.map((item) => {
      if (item instanceof L3ArgumentVariable) {
        return new Variable(args[item.index]);
      }
      return new Variable('');
    });
    return this.runStatementList(method.statementList, stack);
  }

  resolveSymbol(moduleName: string, symbolName: string) {
    const resolvedModule = this.resolvedModules[moduleName];
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
    if (!(startMethod instanceof L3CapyMethod)) {
      throw new Error(`Symbol "start" is not a method`);
    }
    this.runMethod(startMethod, []);
  }

  print(s: string) {
    this.stdout += s + '\n';
  }
}
