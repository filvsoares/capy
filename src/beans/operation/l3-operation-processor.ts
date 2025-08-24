import { Pos } from '@/base';
import { L3Expression } from '../expression/l3-expression-processor';
import { L3Operation } from '../expression/l3-operation-processor';
import { L3Type } from '../type/l3-types';

export class L3ReadVariable extends L3Operation {
  constructor(operand: L3Expression, type: L3Type, pos: Pos) {
    super(operand, type, pos);
  }

  get isReference(): boolean {
    return false;
  }

  toString(): string {
    return 'read variable';
  }
}

export class L3MethodCall extends L3Operation {
  argList: L3Expression[];

  constructor(operand: L3Expression, argList: L3Expression[], type: L3Type, pos: Pos) {
    super(operand, type, pos);
    this.argList = argList;
  }

  get isReference(): boolean {
    return false;
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

export class L3StringConcat extends L3Operation {
  other: L3Expression;

  constructor(operand: L3Expression, other: L3Expression, type: L3Type, pos: Pos) {
    super(operand, type, pos);
    this.other = other;
  }

  get isReference(): boolean {
    return false;
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

export class L3Assignment extends L3Operation {
  target: L3Expression;

  constructor(operand: L3Expression, target: L3Expression, type: L3Type, pos: Pos) {
    super(operand, type, pos);
    this.target = target;
  }

  get isReference(): boolean {
    return false;
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
