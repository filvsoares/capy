import { Pos } from '@/base';
import { declareBeanInterface } from '@/util/beans';
import { L3Base, L3ParseContext } from '../l3-parser/l3-parser';
import { Invalid, L3Type, NUMBER, STRING } from '../type/l3-types';
import { L2Expression } from './l2-expression';

export abstract class L3Expression extends L3Base {
  type: L3Type;
  abstract get isReference(): boolean;

  constructor(type: L3Type, pos: Pos) {
    super(pos);
    this.type = type;
  }
}

export class L3String extends L3Expression {
  value: string;

  constructor(value: string, pos: Pos) {
    super(STRING, pos);
    this.value = value;
  }

  get isReference(): boolean {
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

  get isReference(): boolean {
    return false;
  }

  toString(): string {
    return `number`;
  }
}

export interface L3ExpressionContext {}

export interface L3ExpressionProcessor {
  processExpression(c: L3ParseContext, src: L2Expression, context: L3ExpressionContext | null): L3Expression | Invalid;
  readReference(c: L3ParseContext, obj: L3Expression | Invalid): L3Expression | Invalid;
}

export const l3ExpressionProcessor = declareBeanInterface<L3ExpressionProcessor>('L3ExpressionProcessor');
