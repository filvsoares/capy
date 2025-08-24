import { Pos } from '@/base';
import { L3Argument } from '@/beans/method/l3-argument';
import { L3Type } from '@/beans/type/l3-type';

export class L3CallableType extends L3Type {
  argList: L3Argument[];
  returnType: L3Type;

  constructor(argList: L3Argument[], returnType: L3Type, pos: Pos) {
    super(pos);
    this.argList = argList;
    this.returnType = returnType;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  argList:\n`);
    this.argList.forEach((val) => {
      out.push(`${prefix}    - `);
      val.debugPrint(out, `${prefix}      `);
    });
    out.push(`${prefix}  returnType: `);
    this.returnType.debugPrint(out, `${prefix}  `);
  }

  toString(): string {
    return `callable`;
  }
}
