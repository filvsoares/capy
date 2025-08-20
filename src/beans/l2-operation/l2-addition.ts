import { Pos } from '../../base';
import { L2Expression, L2OperationStep } from '../l2-expression/l2-expression';

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
