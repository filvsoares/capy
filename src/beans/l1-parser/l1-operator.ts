import { Pos } from '@/base';
import { L1Base } from '@/beans/l1-parser/l1-base';

export class L1Operator extends L1Base {
  value: string;

  constructor(value: string, pos: Pos) {
    super(pos);
    this.value = value;
  }

  toString(): string {
    return `operator "${this.value}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  value: ${this.value}\n`);
  }

  static matches(token: any, value?: string): token is L1Operator {
    return token instanceof L1Operator && (value === undefined || token.value === value);
  }
}
