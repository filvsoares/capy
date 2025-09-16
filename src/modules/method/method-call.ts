import { Pos } from '@/base';
import { Expression } from '@/modules/expression/expression';
import { Operation } from '@/modules/expression/operation';
import { Type } from '@/modules/type/type';

export class MethodCall extends Operation {
  argList: Expression[];

  constructor(operand: Expression, argList: Expression[], type: Type, pos: Pos) {
    super(operand, type, pos);
    this.argList = argList;
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
