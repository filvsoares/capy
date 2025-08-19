import { Pos } from '../base';
import { L2Base } from '../l2-parser/l2-types';

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
