import { Pos } from '@/base';
import { declareBeanInterface } from '@/util/beans';
import { L3ParseContext } from '../l3-parser/l3-parser';
import { Invalid, L3Type } from '../type/l3-types';
import { L2OperationStep } from './l2-expression';
import { L3Expression, L3ExpressionContext } from './l3-expression-processor';

export abstract class L3Operation extends L3Expression {
  operand: L3Expression;

  constructor(operand: L3Expression, type: L3Type, pos: Pos) {
    super(type, pos);
    this.operand = operand;
  }

  toString(): string {
    return 'operation';
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    //out.push(`${prefix}  name: ${this.name}\n`);
    out.push(`${prefix}  operand: `);
    this.operand.debugPrint(out, `${prefix}  `);
  }
}

export interface L3OperationProcessor {
  process(
    c: L3ParseContext,
    operand: L3Expression,
    step: L2OperationStep,
    context: L3ExpressionContext | null
  ): L3Operation | Invalid | undefined;
}

export const l3OperationProcessor = declareBeanInterface<L3OperationProcessor>('L3OperationProcessor');
