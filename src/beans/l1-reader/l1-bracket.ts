import { ERROR, Pos } from '@/beans/base';
import { L1Base, L1ParseContext } from '@/beans/l1-parser/l1-types';
import { Bean } from '@/util/beans';
import { L1Reader } from '../l1-parser/l1-reader';
import { L1Parser } from '../l1-parser/l1-parser';

export class L1Bracket extends L1Base {
  start: string;
  end: string;
  tokenList: L1Base[];

  constructor(start: string, end: string, tokenList: L1Base[], pos: Pos) {
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

  static matches(token: any, value?: string): token is L1Bracket {
    return token instanceof L1Bracket && (value === undefined || token.start === value);
  }
}
