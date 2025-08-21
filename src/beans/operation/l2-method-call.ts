import { Pos } from '../../base';
import { L2Expression, L2OperationStep } from '../expression/l2-expression';

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
