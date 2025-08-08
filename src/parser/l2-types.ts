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
 * @file Type definitions for layer-2 parser.
 */

import { Base, ParseError, Pos } from './base';
import { indent } from './util';

export abstract class L2Base extends Base {
  isL2() {
    return true;
  }
}

export abstract class L2Expression extends L2Base {
  isL2Expression() {
    return true;
  }

  constructor(pos: Pos) {
    super(pos);
  }
}

export abstract class L2OperationStep extends L2Base {
  constructor(pos: Pos) {
    super(pos);
  }
}

export class L2String extends L2Expression {
  value: string;

  constructor(value: string, pos: Pos) {
    super(pos);
    this.value = value;
  }

  toString(): string {
    return `string`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  value: ${this.value}\n`);
  }
}

export class L2Number extends L2Expression {
  value: string;

  constructor(value: string, pos: Pos) {
    super(pos);
    this.value = value;
  }

  toString(): string {
    return `number`;
  }
}

export class L2Identifier extends L2Expression {
  value: string;

  constructor(value: string, pos: Pos) {
    super(pos);
    this.value = value;
  }

  toString(): string {
    return `identifier "${this.value}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  value: ${this.value}\n`);
  }
}

export class L2MethodCall extends L2OperationStep {
  argList: L2Expression[];

  constructor(argList: L2Expression[], pos: Pos) {
    super(pos);
    this.argList = argList;
  }

  toString(): string {
    return `call`;
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

export class L2ArraySubscripting extends L2OperationStep {
  item: L2Expression;

  constructor(item: L2Expression, pos: Pos) {
    super(pos);
    this.item = item;
  }

  toString(): string {
    return 'array';
  }
}

export class L2MemberAccess extends L2OperationStep {
  member: string;

  constructor(member: string, pos: Pos) {
    super(pos);
    this.member = member;
  }

  toString(): string {
    return 'member access';
  }
}

export class L2Operation extends L2Expression {
  operand: L2Expression;
  steps: L2OperationStep[];

  constructor(operand: L2Expression, steps: L2OperationStep[], pos: Pos) {
    super(pos);
    this.operand = operand;
    this.steps = steps;
  }

  toString(): string {
    return `operation`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  operand: `);
    this.operand.debugPrint(out, `${prefix}  `);
    out.push(`${prefix}  steps:\n`);
    this.steps.forEach((val) => {
      out.push(`${prefix}    - `);
      val.debugPrint(out, `${prefix}      `);
    });
  }
}

export class L2UnaryMinus extends L2OperationStep {
  constructor(pos: Pos) {
    super(pos);
  }

  toString(): string {
    return `operation`;
  }
}

export class L2UnaryPlus extends L2OperationStep {
  constructor(pos: Pos) {
    super(pos);
  }

  toString(): string {
    return `operation`;
  }
}

export class L2Addition extends L2OperationStep {
  operand: L2Expression;

  constructor(operand: L2Expression, pos: Pos) {
    super(pos);
    this.operand = operand;
  }

  toString(): string {
    return `operation`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  operand: `);
    this.operand.debugPrint(out, `${prefix}  `);
  }
}

export class L2Subtraction extends L2OperationStep {
  operand: L2Expression;

  constructor(operand: L2Expression, pos: Pos) {
    super(pos);
    this.operand = operand;
  }

  toString(): string {
    return `operation`;
  }
}

export class L2Multiplication extends L2OperationStep {
  operand: L2Expression;

  constructor(operand: L2Expression, pos: Pos) {
    super(pos);
    this.operand = operand;
  }

  toString(): string {
    return `operation`;
  }
}

export class L2Division extends L2OperationStep {
  operand: L2Expression;

  constructor(operand: L2Expression, pos: Pos) {
    super(pos);
    this.operand = operand;
  }

  toString(): string {
    return `operation`;
  }
}

export class L2Remainder extends L2OperationStep {
  operand: L2Expression;

  constructor(operand: L2Expression, pos: Pos) {
    super(pos);
    this.operand = operand;
  }

  toString(): string {
    return `operation`;
  }
}

export class L2Use extends L2Base {
  value: string;

  constructor(value: string, pos: Pos) {
    super(pos);
    this.value = value;
  }

  toString(): string {
    return `use "${this.value}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  value: ${this.value}\n`);
  }
}

export class L2Argument extends L2Base {
  name: string;
  type: L2Type;

  constructor(name: string, type: L2Type, pos: Pos) {
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

export abstract class L2Definition<T extends L2Type = L2Type> extends L2Base {
  type: T;
  name: string;

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

export class L2Method extends L2Definition<L2CallableType> {
  statementList: L2Statement[];

  constructor(name: string, type: L2CallableType, statementList: L2Statement[], pos: Pos) {
    super(name, type, pos);
    this.name = name;
    this.type = type;
    this.statementList = statementList;
  }

  toString(): string {
    return `method "${this.name}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  statementList:\n`);
    this.statementList.forEach((val) => {
      out.push(`${prefix}    - `);
      val.debugPrint(out, `${prefix}      `);
    });
  }
}

export class L2Variable extends L2Definition {
  constructor(name: string, type: L2Type, pos: Pos) {
    super(name, type, pos);
  }

  toString(): string {
    return `variable "${this.name}"`;
  }
}

export abstract class L2Type extends L2Base {
  constructor(pos: Pos) {
    super(pos);
  }
}

export class L2SimpleType extends L2Type {
  name: string;

  constructor(name: string, pos: Pos) {
    super(pos);
    this.name = name;
  }

  toString(): string {
    return `type ${this.name}`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  name: ${this.name}\n`);
  }
}

export class L2CallableType extends L2Type {
  argList: L2Argument[];
  returnType?: L2Type;

  constructor(argList: L2Argument[], returnType: L2Type | undefined, pos: Pos) {
    super(pos);
    this.argList = argList;
    this.returnType = returnType;
  }

  toString(): string {
    return `type`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  argList:\n`);
    this.argList.forEach((val) => {
      out.push(`${prefix}    - `);
      val.debugPrint(out, `${prefix}      `);
    });
    out.push(`${prefix}  returnType: `);
    this.returnType ? this.returnType.debugPrint(out, `${prefix}  `) : out.push('(void)\n');
  }
}

export abstract class L2Statement extends L2Base {
  constructor(pos: Pos) {
    super(pos);
  }
}

export class L2ExpressionStatement extends L2Statement {
  expr: L2Expression;

  constructor(expr: L2Expression, pos: Pos) {
    super(pos);
    this.expr = expr;
  }

  toString(): string {
    return `expression statement`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);

    out.push(`${prefix}  expr: `);
    this.expr.debugPrint(out, `${prefix}  `);
  }
}

export class L2ReturnStatement extends L2Statement {
  expr?: L2Expression;

  constructor(expr: L2Expression | undefined, pos: Pos) {
    super(pos);
    this.expr = expr;
  }

  toString(): string {
    return `return statement`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);

    out.push(`${prefix}  expr: `);
    this.expr ? this.expr.debugPrint(out, `${prefix}  `) : out.push(` (void)\n`);
  }
}

export type L2ParseResult<T extends L2Base = L2Base> = {
  list: T[];
  errors: ParseError[];
};
