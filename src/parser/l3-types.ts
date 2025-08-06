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
import { L2Base } from './l2-types';
import { Runner } from './runner';
import { indent } from './util';

export abstract class L3Base extends Base {
  isL3() {
    return true;
  }
}

export type L3PrimitiveType = 'void' | 'string' | 'number' | 'boolean';

export abstract class L3Type extends L3Base {}

export class L3SimpleType extends L3Type {
  primitive: L3PrimitiveType;

  constructor(primitive: L3PrimitiveType) {
    super(INTERNAL);
    this.primitive = primitive;
  }

  toString(): string {
    return `${this.primitive}`;
  }
}

export const voidType = new L3SimpleType('void');
export const stringType = new L3SimpleType('string');
export const numberType = new L3SimpleType('number');

export function isStringType(type: L3Type) {
  return type instanceof L3SimpleType && type.primitive === 'string';
}

export class L3CallableType extends L3Type {
  returnType?: L3Type;

  constructor(returnType?: L3Type) {
    super(INTERNAL);
    this.returnType = returnType;
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
    super(stringType, pos);
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
    super(numberType, pos);
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
  name: string;

  constructor(name: string, type: L3Type, pos: Pos) {
    super(type, pos);
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
  }
}

export abstract class L3Definition extends L3Base {}

export class L3Variable extends L3Definition {
  type: L3Type;

  constructor(type: L3Type, pos: Pos) {
    super(pos);
    this.type = type;
  }

  toString(): string {
    return 'variable';
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

export class L3Method extends L3Variable {
  statements: L3Base[];

  constructor(type: L3CallableType, statements: L3Base[], pos: Pos) {
    super(type, pos);
    this.statements = statements;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    //out.push(`${prefix}  name: ${this.name}\n`);
    //out.push(`${prefix}  returnType: `);
    //this.returnType ? this.returnType.debugPrint(out, `${prefix}  `) : out.push('(void)\n');
    out.push(`${prefix}  statements:\n`);
    this.statements.forEach((val) => {
      out.push(`${prefix}    - `);
      val.debugPrint(out, `${prefix}      `);
    });
  }
}

export class L3LibraryMethod extends L3Variable {
  callback: (args: any[], runner: Runner) => any;
  constructor(type: L3CallableType, callback: (args: any[], runner: Runner) => any) {
    super(type, INTERNAL);
    this.callback = callback;
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
}

export class L3Runnable extends L3Base {
  symbols: { [name: string]: L3Definition };
  initialStatements: L3Statement[];
  constructor(symbols: { [name: string]: L3Definition }, initialStatements: L3Statement[]) {
    super(INTERNAL);
    this.symbols = symbols;
    this.initialStatements = initialStatements;
  }

  toString(): string {
    return 'runnable';
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  symbols:\n`);
    Object.entries(this.symbols).forEach(([k, v]) => {
      out.push(`${prefix}    ${k}: `);
      v.debugPrint(out, `${prefix}      `);
    });
  }
}

export type L3Library = {
  exported: { [name: string]: L3Definition };
};

export type L3ParseResult = {
  runnable: L3Runnable;
  errors: ParseError[];
};
