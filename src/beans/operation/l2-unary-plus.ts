import { Pos } from '../../base';
import { L2OperationStep } from '../expression/l2-expression';

export class L2UnaryPlus extends L2OperationStep {
  constructor(pos: Pos) {
    super(pos);
  }

  toString(): string {
    return `operation`;
  }
}
