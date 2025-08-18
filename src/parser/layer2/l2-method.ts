import { combinePos, ERROR, fallbackPos, Pos } from '@/parser/base';
import { L1Identifier, L1Keyword } from '@/parser/layer1/reader/l1-word';
import { L2CallableType, readCallableType } from './l2-callable-type';
import { L2Definition } from './l2-definition';
import { L2StatementList, readStatementList } from './l2-statement-list';
import { INVALID, L2ParseContext, ReadResult } from './l2-types';

export class L2Method extends L2Definition<L2CallableType> {
  statementList: L2StatementList;

  constructor(name: string, type: L2CallableType, statementList: L2StatementList, pos: Pos) {
    super(name, type, pos);
    this.name = name;
    this.type = type;
    this.statementList = statementList;
  }

  toString(): string {
    return `method "${this.name}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  statementList: `);
    this.statementList.debugPrint(out, `${prefix}  `);
  }
}

export function readFunction(c: L2ParseContext): ReadResult<L2Method> {
  const t1 = c.current;
  if (!L1Keyword.matches(t1, 'function')) {
    return;
  }
  c.consume();

  const t2 = c.current;
  if (!L1Identifier.matches(t2)) {
    c.errors.push({
      level: ERROR,
      message: `Expected string`,
      pos: fallbackPos(t2?.pos, t1.pos),
    });
    return INVALID;
  }
  c.consume();

  const t3 = c.current;
  let type = t3 && readCallableType(c);
  if (type === INVALID) {
    return INVALID;
  }
  if (!type) {
    c.errors.push({
      level: ERROR,
      message: `Expected type1`,
      pos: fallbackPos(t3?.pos, t2.pos),
    });
    return INVALID;
  }

  const t4 = c.current;
  const statementList = t4 && readStatementList(c);
  if (!statementList) {
    c.errors.push({
      level: ERROR,
      message: `Expected "{" but found ${t4}`,
      pos: fallbackPos(t4?.pos, type.pos),
    });
    return INVALID;
  }
  if (statementList === INVALID) {
    return INVALID;
  }

  return new L2Method(t2.name, type, statementList, combinePos(t1.pos, t4.pos));
}
