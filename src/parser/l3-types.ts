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
 * @file Type definitions for layer-3 parser.
 */

import { Base, INTERNAL, ParseError, Pos } from './base';
import { Runner } from './runner';

export abstract class L3Base extends Base {
  isL3() {
    return true;
  }
}

export type L3PrimitiveType = 'string' | 'number' | 'boolean' | 'void';

export abstract class L3Type extends L3Base {}

export class L3SimpleType extends L3Type {
  primitive: L3PrimitiveType;

  constructor(primitive: L3PrimitiveType, pos: Pos) {
    super(pos);
    this.primitive = primitive;
  }

  toString(): string {
    return `${this.primitive}`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  primitive: ${this.primitive}\n`);
  }
}

export const STRING = new L3SimpleType('string', INTERNAL);
export const NUMBER = new L3SimpleType('number', INTERNAL);
export const BOOLEAN = new L3SimpleType('boolean', INTERNAL);
export const VOID = new L3SimpleType('void', INTERNAL);

export function isStringType(type: L3Type) {
  return type instanceof L3SimpleType && type.primitive === 'string';
}

export function isVoidType(type: L3Type) {
  return type instanceof L3SimpleType && type.primitive === 'void';
}

export class L3Argument extends L3Type {
  name: string;
  type: L3Type;

  constructor(name: string, type: L3Type, pos: Pos) {
    super(pos);
    this.name = name;
    this.type = type;
  }

  toString(): string {
    return 'argument';
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  name: ${this.name}\n`);
    out.push(`${prefix}  type: `);
    this.type.debugPrint(out, `${prefix}  `);
  }
}

export class L3CallableType extends L3Type {
  argList: L3Argument[];
  returnType: L3Type;

  constructor(argList: L3Argument[], returnType: L3Type, pos: Pos) {
    super(pos);
    this.argList = argList;
    this.returnType = returnType;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  argList:\n`);
    this.argList.forEach((val) => {
      out.push(`${prefix}    - `);
      val.debugPrint(out, `${prefix}      `);
    });
    out.push(`${prefix}  returnType: `);
    this.returnType.debugPrint(out, `${prefix}  `);
  }

  toString(): string {
    return `callable`;
  }
}

export abstract class L3Expression extends L3Base {
  type: L3Type;

  constructor(type: L3Type, pos: Pos) {
    super(pos);
    this.type = type;
  }

  abstract isReference(): boolean;
}

export class L3String extends L3Expression {
  value: string;

  constructor(value: string, pos: Pos) {
    super(STRING, pos);
    this.value = value;
  }

  isReference(): boolean {
    return false;
  }

  toString(): string {
    return `string`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  value: ${this.value}\n`);
  }
}

export class L3Number extends L3Expression {
  value: string;

  constructor(value: string, pos: Pos) {
    super(NUMBER, pos);
    this.value = value;
  }

  isReference(): boolean {
    return false;
  }

  toString(): string {
    return `number`;
  }
}

export class L3Reference extends L3Expression {
  index: number;
  name: string;

  constructor(index: number, name: string, type: L3Type, pos: Pos) {
    super(type, pos);
    this.index = index;
    this.name = name;
  }

  isReference(): boolean {
    return true;
  }

  toString(): string {
    return `identifier "${this.name}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  name: ${this.name}\n`);
    out.push(`${prefix}  index: ${this.index}\n`);
  }
}

export abstract class L3Symbol<T extends L3Type = L3Type> extends L3Base {
  name: string;
  type: T;

  constructor(name: string, type: T, pos: Pos) {
    super(pos);
    this.name = name;
    this.type = type;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  name: ${this.name}\n`);
    out.push(`${prefix}  type: `);
    this.type.debugPrint(out, `${prefix}  `);
  }
}

export class L3Variable extends L3Symbol {
  initMethod: L3Method | null;

  constructor(name: string, type: L3Type, initMethod: L3Method | null, pos: Pos) {
    super(name, type, pos);
    this.initMethod = initMethod;
  }

  toString(): string {
    return 'variable';
  }
  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  initMethod: `);
    this.initMethod ? this.initMethod.debugPrint(out, `${prefix}  `) : out.push(' (none)\n');
  }
}

export abstract class L3Statement extends L3Base {
  constructor(pos: Pos) {
    super(pos);
  }
}

export class L3ExpressionStatement extends L3Statement {
  expr: L3Expression;

  constructor(expr: L3Expression, pos: Pos) {
    super(pos);
    this.expr = expr;
  }

  toString(): string {
    return 'expression';
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  expr: `);
    this.expr.debugPrint(out, `${prefix}  `);
  }
}

export class L3ReturnStatement extends L3Statement {
  expr: L3Expression | null;

  constructor(expr: L3Expression | null, pos: Pos) {
    super(pos);
    this.expr = expr;
  }

  toString(): string {
    return 'return';
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  expr: `);
    this.expr ? this.expr.debugPrint(out, `${prefix}  `) : out.push('(void)\n');
  }
}

export abstract class L3OperationStep extends L3Base {
  constructor(pos: Pos) {
    super(pos);
  }
}

export class L3Operation extends L3Expression {
  operand: L3Expression;
  steps: L3OperationStep[];
  reference: boolean;

  constructor(operand: L3Expression, steps: L3OperationStep[], type: L3Type, reference: boolean, pos: Pos) {
    super(type, pos);
    this.operand = operand;
    this.reference = reference;
    this.steps = steps;
  }

  isReference(): boolean {
    return this.reference;
  }

  toString(): string {
    return 'operation';
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    //out.push(`${prefix}  name: ${this.name}\n`);
    out.push(`${prefix}  operand: `);
    this.operand.debugPrint(out, `${prefix}  `);
    out.push(`${prefix}  steps:\n`);
    this.steps.forEach((val) => {
      out.push(`${prefix}    - `);
      val.debugPrint(out, `${prefix}      `);
    });
  }
}

export abstract class L3MethodDependency extends L3Base {
  name: string;
  type: L3Type;

  constructor(name: string, type: L3Type, pos: Pos) {
    super(pos);
    this.name = name;
    this.type = type;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  name: ${this.name}\n`);
    out.push(`${prefix}  type: `);
    this.type.debugPrint(out, `${prefix}  `);
  }
}

export class L3ModuleSymbolDependency extends L3MethodDependency {
  module: string;

  constructor(module: string, name: string, type: L3Type, pos: Pos) {
    super(name, type, pos);
    this.module = module;
  }

  toString(): string {
    return 'module symbol dependency';
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  module: ${this.module}\n`);
  }
}

export class L3ArgumentDependency extends L3MethodDependency {
  index: number;

  constructor(index: number, name: string, type: L3Type, pos: Pos) {
    super(name, type, pos);
    this.index = index;
  }

  toString(): string {
    return 'argument dependency';
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  index: ${this.index}\n`);
  }
}

export class L3Method extends L3Symbol<L3CallableType> {
  deps: L3MethodDependency[];
  statements: L3Base[];

  constructor(name: string, type: L3CallableType, deps: L3MethodDependency[], statements: L3Base[], pos: Pos) {
    super(name, type, pos);
    this.deps = deps;
    this.statements = statements;
  }

  toString(): string {
    return 'method';
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  deps:\n`);
    this.deps.forEach((val) => {
      out.push(`${prefix}    - `);
      val.debugPrint(out, `${prefix}      `);
    });
    out.push(`${prefix}  statements:\n`);
    this.statements.forEach((val) => {
      out.push(`${prefix}    - `);
      val.debugPrint(out, `${prefix}      `);
    });
  }
}

export class L3LibraryMethod extends L3Symbol<L3CallableType> {
  callback: (args: any[], runner: Runner) => any;
  constructor(name: string, type: L3CallableType, callback: (args: any[], runner: Runner) => any) {
    super(name, type, INTERNAL);
    this.callback = callback;
  }

  toString(): string {
    return 'method';
  }
}

export class L3Dereference extends L3OperationStep {
  constructor() {
    super(INTERNAL);
  }

  toString(): string {
    return 'dereference';
  }
}

export class L3MethodCall extends L3OperationStep {
  argList: L3Expression[];

  constructor(argList: L3Expression[], pos: Pos) {
    super(pos);
    this.argList = argList;
  }

  toString(): string {
    return 'method call';
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  argList:\n`);
    this.argList.forEach((val) => {
      out.push(`${prefix}    - `);
      val.debugPrint(out, `${prefix}      `);
    });
  }
}

export class L3StringConcat extends L3OperationStep {
  other: L3Expression;

  constructor(other: L3Expression, pos: Pos) {
    super(pos);
    this.other = other;
  }

  toString(): string {
    return 'string concat';
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  other: `);
    this.other.debugPrint(out, `${prefix}  `);
  }
}

export class L3Assignment extends L3OperationStep {
  target: L3Expression;

  constructor(target: L3Expression, pos: Pos) {
    super(pos);
    this.target = target;
  }

  toString(): string {
    return 'assignment';
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  target: `);
    this.target.debugPrint(out, `${prefix}  `);
  }
}

export class L3Module extends L3Base {
  name: string;
  symbols: L3Symbol[] = [];

  constructor(name: string, symbols: L3Symbol[]) {
    super(INTERNAL);
    this.name = name;
    this.symbols = symbols;
  }

  toString(): string {
    return 'runnable';
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  symbols:\n`);
    this.symbols.forEach((val) => {
      out.push(`${prefix}    - `);
      val?.debugPrint(out, `${prefix}      `);
    });
  }
}

export type L3ParseResult = {
  runnable: L3Module;
  errors: ParseError[];
};
