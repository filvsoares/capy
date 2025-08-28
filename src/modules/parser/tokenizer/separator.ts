import { Pos } from '@/base';
import { Token } from '@/modules/parser/tokenizer/token';

export class Separator extends Token {
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

  static matches(token: any, value?: string): token is Separator {
    return token instanceof Separator && (value === undefined || token.value === value);
  }
}
