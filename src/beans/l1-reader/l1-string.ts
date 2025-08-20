import { Pos } from '@/base';
import { L1Base } from '@/beans/l1-parser/l1-types';

export class L1String extends L1Base {
  value: string;

  constructor(value: string, pos: Pos) {
    super(pos);
    this.value = value;
  }

  getName(): string {
    return 'L1String';
  }

  toString(): string {
    return `string "${this.value}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  value: ${this.value}\n`);
  }

  static matches(token: any, value?: string): token is L1String {
    return token instanceof L1String && (value === undefined || token.value === value);
  }
}
