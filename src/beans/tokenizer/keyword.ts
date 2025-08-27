import { Pos } from '@/base';
import { Token } from '@/beans/tokenizer/token';

export class Keyword extends Token {
  name: string;

  constructor(name: string, pos: Pos) {
    super(pos);
    this.name = name;
  }

  toString(): string {
    return `keyword "${this.name}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  name: ${this.name}\n`);
  }

  static matches(token: any, value?: string): token is Keyword {
    return token instanceof Keyword && (value === undefined || token.name === value);
  }
}
