import { Pos } from '@/base';
import { L2Argument } from '@/beans/method/l2-argument';
import { L2Type } from '@/beans/type/l2-type';

export class L2CallableType extends L2Type {
  argList: L2Argument[];
  returnType: L2Type | null;

  constructor(argList: L2Argument[], returnType: L2Type | null, pos: Pos) {
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
