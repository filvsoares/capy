import { Pos } from '@/base';
import { Argument } from '@/modules/parser/method/argument';
import { Type } from '@/modules/parser/type/type';

export class CallableType extends Type {
  argList: Argument[];
  returnType: Type;

  constructor(argList: Argument[], returnType: Type, pos: Pos) {
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
