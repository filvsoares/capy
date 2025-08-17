import { ERROR, INTERNAL, Pos } from '../base';
import { L1Bracket } from '../layer1/l1-bracket';
import { L2Statement, readStatement } from './l2-statement';
import { INVALID, L2Base, L2ParseContext, ReadResult } from './l2-types';

export class L2StatementList extends L2Statement {
  list: L2Statement[];

  constructor(list: L2Statement[], pos: Pos) {
    super(pos);
    this.list = list;
  }

  toString(): string {
    return `statement list`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  list:\n`);
    this.list.forEach((val) => {
      out.push(`${prefix}    - `);
      val.debugPrint(out, `${prefix}      `);
    });
  }
}

export function readStatementList(c: L2ParseContext): ReadResult<L2StatementList> {
  const outList: L2Statement[] = [];
  let error = false;
  while (c.current) {
    const val = readStatement(c);
    if (val === INVALID) {
      error = true;
      continue;
    }
    if (!val) {
      if (!error) {
        error = true;
        const t = c.current!;
        c.errors.push({
          level: ERROR,
          message: `Unexpected ${t}`,
          pos: t.pos,
        });
      }
      c.consume();
      continue;
    }
    error = false;
    outList.push(val);
  }
  return new L2StatementList(outList, INTERNAL);
}
