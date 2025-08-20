import { Pos } from '../../base';
import { L2Expression, L2OperationStep } from '../l2-expression/l2-expression';

export class L2ArraySubscript extends L2OperationStep {
  item: L2Expression;

  constructor(item: L2Expression, pos: Pos) {
    super(pos);
    this.item = item;
  }

  toString(): string {
    return 'array';
  }
}
