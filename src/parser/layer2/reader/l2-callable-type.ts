import { combinePos, ERROR, Pos } from '@/parser/base';
import { L2Argument, readArgumentList } from './l2-argument';
import { L2Type } from './l2-type';
import { readType } from './l2-type-all';
import { INVALID, L2Base, L2ParseContext, ReadResult } from '../l2-types';
import { L1Bracket } from '../../layer1/reader/l1-bracket';
import { L1Operator } from '../../layer1/reader/l1-operator';

export class L2CallableType extends L2Type {
  argList: L2Argument[];
  returnType: L2Type | null;

  constructor(argList: L2Argument[], returnType: L2Type | null, pos: Pos) {
    super(pos);
    this.argList = argList;
    this.returnType = returnType;
  }

  toString(): string {
    return `type`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  argList:\n`);
    this.argList.forEach((val) => {
      out.push(`${prefix}    - `);
      val.debugPrint(out, `${prefix}      `);
    });
    out.push(`${prefix}  returnType: `);
    this.returnType ? this.returnType.debugPrint(out, `${prefix}  `) : out.push('(void)\n');
  }
}

export function readCallableType(c: L2ParseContext): ReadResult<L2CallableType> {
  const t1 = c.current;
  if (!L1Bracket.matches(t1, '(')) {
    return;
  }
  c.consume();

  let returnType: L2Type | null = null;

  const c1 = new L2ParseContext(t1.tokenList);
  const args = readArgumentList(c1);
  c.errors.push(...c1.errors);

  const t2 = c.current;
  if (L1Operator.matches(t2, ':')) {
    c.consume();

    const _returnType = readType(c);
    if (_returnType === INVALID) {
      return INVALID;
    }
    if (!_returnType) {
      c.errors.push({
        level: ERROR,
        message: `Expected type`,
        pos: t2.pos,
      });
      return INVALID;
    }
    returnType = _returnType;
  }

  return new L2CallableType(args, returnType, combinePos(t1.pos, (returnType ?? t1).pos));
}
