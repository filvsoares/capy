import { Pos } from '@/base';
import { L1Base } from '@/beans/l1-parser/l1-base';

export class L1Separator extends L1Base {
  value: string;

  constructor(value: string, pos: Pos) {
    super(pos);
    this.value = value;
  }

  toString(): string {
    return `separator "${this.value}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  value: ${this.value}\n`);
  }

  static matches(token: any, value?: string): token is L1Separator {
    return token instanceof L1Separator && (value === undefined || token.value === value);
  }
}
