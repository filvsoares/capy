import { Pos } from '@/base';
import { L2Argument } from '@/beans/method/l2-argument';
import { Type } from '@/beans/type/type';

export class L2CallableType extends Type {
  argList: L2Argument[];
  returnType: Type | null;

  constructor(argList: L2Argument[], returnType: Type | null, pos: Pos) {
    super(pos);
    this.argList = argList;
    this.returnType = returnType;
  }

  toString(): string {
    return `type`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  argList:\n`);
    this.argList.forEach((val) => {
      out.push(`${prefix}    - `);
      val.debugPrint(out, `${prefix}      `);
    });
    out.push(`${prefix}  returnType: `);
    this.returnType ? this.returnType.debugPrint(out, `${prefix}  `) : out.push('(void)\n');
  }
}
