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

import { Base } from './base';
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
}

export abstract class L2OperationStep extends L2Base {}

export class L2String extends L2Expression {
  value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  toString(): string {
    return `string`;
  }

  debugPrint(): string {
    return `[L2String]\n  value: ${this.value}`;
  }
}

export class L2Number extends L2Expression {
  value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  toString(): string {
    return `number`;
  }

  debugPrint(): string {
    return `[L2Number]\n  value: ${this.value}`;
  }
}

export class L2Identifier extends L2Expression {
  value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  toString(): string {
    return `identifier "${this.value}"`;
  }

  debugPrint(): string {
    return `[L2Identifier]\n  value: ${this.value}`;
  }
}

export class L2MethodCall extends L2OperationStep {
  argList: L2Expression[];

  constructor(argList: L2Expression[]) {
    super();
    this.argList = argList;
  }

  toString(): string {
    return `call`;
  }

  debugPrint(): string {
    return `[L2MethodCall]\n  args:\n${this.argList.map((item) => '    - ' + indent(item.debugPrint(), 6)).join('\n')}`;
  }
}

export class L2ArraySubscripting extends L2OperationStep {
  item: L2Base;

  constructor(item: L2Base) {
    super();
    this.item = item;
  }

  toString(): string {
    return 'array';
  }

  debugPrint(): string {
    return `[L2ArraySubscripting]\n  item: ${indent(this.item.debugPrint(), 2)}`;
  }
}

export class L2MemberAccess extends L2OperationStep {
  member: string;

  constructor(member: string) {
    super();
    this.member = member;
  }

  toString(): string {
    return 'member access';
  }

  debugPrint(): string {
    return `[L2MemberAccess]\n  member: ${this.member}`;
  }
}

export class L2Operation extends L2Expression {
  operand: L2Expression;
  steps: L2OperationStep[];

  constructor(operand: L2Expression, steps: L2OperationStep[]) {
    super();
    this.operand = operand;
    this.steps = steps;
  }

  toString(): string {
    return `operation`;
  }

  debugPrint(): string {
    return `[L2Operation]\n  operand: ${indent(this.operand.debugPrint(), 2)}\n  steps:\n${this.steps
      .map((item) => '    - ' + indent(item.debugPrint(), 6))
      .join('\n')}`;
  }
}

export class L2UnaryMinus extends L2OperationStep {
  constructor() {
    super();
  }

  toString(): string {
    return `operation`;
  }

  debugPrint(): string {
    return `[L2UnaryMinus]`;
  }
}

export class L2UnaryPlus extends L2OperationStep {
  constructor() {
    super();
  }

  toString(): string {
    return `operation`;
  }

  debugPrint(): string {
    return `[L2UnaryPlus]`;
  }
}

export class L2Addition extends L2OperationStep {
  operand: L2Expression;

  constructor(operand: L2Expression) {
    super();
    this.operand = operand;
  }

  toString(): string {
    return `operation`;
  }

  debugPrint(): string {
    return `[L2Addition]\n  operand: ${indent(this.operand.debugPrint(), 2)}`;
  }
}

export class L2Subtraction extends L2OperationStep {
  operand: L2Expression;

  constructor(operand: L2Expression) {
    super();
    this.operand = operand;
  }

  toString(): string {
    return `operation`;
  }

  debugPrint(): string {
    return `[L2Subtraction]\n  operand: ${indent(this.operand.debugPrint(), 2)}`;
  }
}

export class L2Multiplication extends L2OperationStep {
  operand: L2Expression;

  constructor(operand: L2Expression) {
    super();
    this.operand = operand;
  }

  toString(): string {
    return `operation`;
  }

  debugPrint(): string {
    return `[L2Multiplication]\n  operand: ${indent(this.operand.debugPrint(), 2)}`;
  }
}

export class L2Division extends L2OperationStep {
  operand: L2Expression;

  constructor(operand: L2Expression) {
    super();
    this.operand = operand;
  }

  toString(): string {
    return `operation`;
  }

  debugPrint(): string {
    return `[L2Division]\n  operand: ${indent(this.operand.debugPrint(), 2)}`;
  }
}

export class L2Remainder extends L2OperationStep {
  operand: L2Expression;

  constructor(operand: L2Expression) {
    super();
    this.operand = operand;
  }

  toString(): string {
    return `operation`;
  }

  debugPrint(): string {
    return `[L2Remainder]\n  operand: ${indent(this.operand.debugPrint(), 2)}`;
  }
}

export class L2Use extends L2Base {
  value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  toString(): string {
    return `use "${this.value}"`;
  }

  debugPrint(): string {
    return `[L2Use]\n  value: ${this.value}`;
  }
}

export class L2Method extends L2Base {
  name: string;
  returnType: L2Type | undefined;
  statementList: L2Base[];

  constructor(name: string, returnType: L2Type | undefined, statementList: L2Base[]) {
    super();
    this.name = name;
    this.returnType = returnType;
    this.statementList = statementList;
  }

  toString(): string {
    return `method "${this.name}"`;
  }

  debugPrint(): string {
    return `[L2Method]\n  name: ${this.name}\n  statements:\n${this.statementList
      .map((item) => '    - ' + indent(item.debugPrint(), 6))
      .join('\n')}`;
  }
}

export class L2Variable extends L2Base {
  name: string;
  type: L2Type;

  constructor(name: string, type: L2Type) {
    super();
    this.name = name;
    this.type = type;
  }

  toString(): string {
    return `variable "${this.name}"`;
  }

  debugPrint(): string {
    return `[L2Variable] ${this.name}: ${this.type.debugPrint()}`;
  }
}

export class L2Type extends L2Base {
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }

  toString(): string {
    return `type ${this.name}`;
  }

  debugPrint(): string {
    return `[L2Type] ${this.name}`;
  }
}
