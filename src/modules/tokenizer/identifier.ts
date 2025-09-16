import { Pos } from '@/base';
import { Token } from '@/modules/tokenizer/token';

export class Identifier extends Token {
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

  static matches(token: any, value?: string): token is Identifier {
    return token instanceof Identifier && (value === undefined || token.name === value);
  }
}
