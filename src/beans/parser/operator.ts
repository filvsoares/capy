import { Pos } from '@/base';
import { Token } from '@/beans/parser/token';

export class Operator extends Token {
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

  static matches(token: any, value?: string): token is Operator {
    return token instanceof Operator && (value === undefined || token.value === value);
  }
}
