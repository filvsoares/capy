import { Pos } from '@/base';
import { Token } from '@/modules/parser/tokenizer/token';

export class Bracket extends Token {
  start: string;
  end: string;
  tokenList: Token[];

  constructor(start: string, end: string, tokenList: Token[], pos: Pos) {
    super(pos);
    this.start = start;
    this.end = end;
    this.tokenList = tokenList;
  }

  toString(): string {
    return `bracket "${this.start}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  start: ${this.start}\n`);
    out.push(`${prefix}  tokenList:\n`);
    this.tokenList.forEach((val) => {
      out.push(`${prefix}    - `);
      val.debugPrint(out, `${prefix}      `);
    });
  }

  static matches(token: any, value?: string): token is Bracket {
    return token instanceof Bracket && (value === undefined || token.start === value);
  }
}
