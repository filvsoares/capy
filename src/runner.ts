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

import { Expression } from '@/beans/expression/expression';
import { NumberLiteral } from '@/beans/expression/number-literal';
import { StringLiteral } from '@/beans/expression/string-literal';
import { GlobalVariable } from '@/beans/global-variable/global-variable';
import { ArgumentVariable } from '@/beans/method/argument-variable';
import { CapyMethod } from '@/beans/method/capy-method';
import { GlobalVariableReference } from '@/beans/method/global-variable-reference';
import { LibraryMethod } from '@/beans/method/library-method';
import { LocalVariableReference } from '@/beans/method/local-variable-reference';
import { Method } from '@/beans/method/method';
import { MethodReference } from '@/beans/method/method-reference';
import { ReadVariable } from '@/beans/method/read-variable';
import { Assignment } from '@/beans/operation/assignment';
import { MethodCall } from '@/beans/operation/method-call';
import { StringConcat } from '@/beans/operation/string-concat';
import { Module } from '@/beans/parser/module';
import { Symbol } from '@/beans/parser/symbol';
import { ExpressionStatement } from '@/beans/statement/expression-statement';
import { ReturnStatement } from '@/beans/statement/return-statement';
import { StatementList } from '@/beans/statement/statement-list';

class MyVariable {
  value: any;

  constructor(value: any) {
    this.value = value;
  }
}

export class Runner {
  modules: Module[] = [];
  resolvedModules: { [module: string]: { index: number; symbols?: { [symbol: string]: Symbol } } } = {};
  variables: { [module: string]: { [name: string]: MyVariable } } = {};

  stdout: string = '';

  constructor() {}

  runExpression(obj: Expression, deps: any[]): any {
    if (obj instanceof StringLiteral) {
      return obj.value;
    }
    if (obj instanceof NumberLiteral) {
      return obj.value;
    }
    if (obj instanceof MethodReference) {
      const symbol = this.resolveSymbol(obj.module, obj.name);
      if (!(symbol instanceof Method)) {
        throw new Error(`Expected method but found ${symbol.constructor.name}`);
      }
      return symbol;
    }
    if (obj instanceof GlobalVariableReference) {
      const symbol = this.resolveSymbol(obj.module, obj.name);
      if (!(symbol instanceof GlobalVariable)) {
        throw new Error(`Expected variable but found ${symbol.constructor.name}`);
      }
      let val1 = this.variables[obj.module];
      if (!val1) {
        this.variables[obj.module] = val1 = {};
      }
      let val2 = val1[obj.name];
      if (!val2) {
        val1[obj.name] = val2 = new MyVariable('');
        if (symbol.initExpr) {
          val2.value = this.runExpression(symbol.initExpr, []);
        }
      }
      return val2;
    }
    if (obj instanceof LocalVariableReference) {
      return deps[obj.index];
    }
    if (obj instanceof MethodCall) {
      const argList: any[] = [];
      for (const arg of obj.argList) {
        argList.push(this.runExpression(arg, deps));
      }
      const method = this.runExpression(obj.operand, deps);
      if (method instanceof LibraryMethod) {
        return method.callback(argList, this);
      }
      if (method instanceof CapyMethod) {
        return this.runMethod(method, argList);
      }
      throw new Error(`Cannot run ${method.constructor.name}`);
    }
    if (obj instanceof StringConcat) {
      const operand = this.runExpression(obj.operand, deps);
      const other = this.runExpression(obj.other, deps);
      return operand + other;
    }
    if (obj instanceof ReadVariable) {
      const variable = this.runExpression(obj.operand, deps);
      console.log(variable);
      if (!(variable instanceof MyVariable)) {
        throw new Error(`${variable.constructor.name} is not variable`);
      }
      return variable.value;
    }
    if (obj instanceof Assignment) {
      const target = this.runExpression(obj.target, deps);
      if (!(target instanceof MyVariable)) {
        throw new Error('Assignment target is not variable');
      }
      return obj;
    }
    throw new Error(`Cannot read value from ${obj.constructor.name}`);
  }

  runStatementList(statementList: StatementList, stack: any[]): any {
    for (const item of statementList.list) {
      if (item instanceof ExpressionStatement) {
        this.runExpression(item.expr, stack);
      } else if (item instanceof ReturnStatement) {
        return item.expr && this.runExpression(item.expr, stack);
      } else if (item instanceof StatementList) {
        const returned = this.runStatementList(item, stack);
        if (returned !== undefined) {
          return returned;
        }
      } else {
        throw new Error(`I still don't understand ${item.constructor.name}`);
      }
    }
  }

  runMethod(method: CapyMethod, args: any[]): any {
    const stack = method.stack.map((item) => {
      if (item instanceof ArgumentVariable) {
        return new MyVariable(args[item.index]);
      }
      return new MyVariable('');
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

  run(modules: Module[], mainModuleName: string) {
    this.modules = modules;
    for (let i = 0; i < modules.length; i++) {
      this.resolvedModules[modules[i].name] = { index: i };
    }
    const startMethod = this.resolveSymbol(mainModuleName, 'start');
    if (!(startMethod instanceof CapyMethod)) {
      throw new Error(`Symbol "start" is not a method`);
    }
    this.runMethod(startMethod, []);
  }

  print(s: string) {
    this.stdout += s + '\n';
  }
}
