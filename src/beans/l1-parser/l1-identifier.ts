import { Pos } from '@/base';
import { L1Base } from '@/beans/l1-parser/l1-base';

export class L1Identifier extends L1Base {
  name: string;

  constructor(name: string, pos: Pos) {
    super(pos);
    this.name = name;
  }

  toString(): string {
    return `identifier "${this.name}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  name: ${this.name}\n`);
  }

  static matches(token: any, value?: string): token is L1Identifier {
    return token instanceof L1Identifier && (value === undefined || token.name === value);
  }
}
