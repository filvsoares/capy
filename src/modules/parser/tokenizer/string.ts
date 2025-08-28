import { Pos } from '@/base';
import { Token } from '@/modules/parser/tokenizer/token';

export class String extends Token {
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

  static matches(token: any, value?: string): token is String {
    return token instanceof String && (value === undefined || token.value === value);
  }
}
