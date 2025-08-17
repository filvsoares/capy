import { combinePos, ERROR, fallbackPos, Pos } from '../base';
import { L1Separator } from '../layer1/l1-separator';
import { L1String } from '../layer1/l1-string';
import { L1Keyword } from '../layer1/l1-word';
import { INVALID, L2Base, L2ParseContext, ReadResult } from './l2-types';

export class L2Use extends L2Base {
  value: string;

  constructor(value: string, pos: Pos) {
    super(pos);
    this.value = value;
  }

  toString(): string {
    return `use "${this.value}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  value: ${this.value}\n`);
  }
}

export function readUse(c: L2ParseContext): ReadResult<L2Use> {
  const t1 = c.current;
  if (!L1Keyword.matches(t1, 'use')) {
    return;
  }
  c.consume();

  const t2 = c.current;
  if (!L1String.matches(t2)) {
    c.errors.push({
      level: ERROR,
      message: `Expected string`,
      pos: fallbackPos(t2?.pos, t1.pos),
    });
    return INVALID;
  }
  c.consume();

  const t3 = c.current;
  if (L1Separator.matches(t3, ';')) {
    c.consume();
  } else {
    c.errors.push({
      level: ERROR,
      message: `Expected ";"`,
      pos: fallbackPos(t3?.pos, t2.pos),
    });
  }

  return new L2Use(t2.value, combinePos(t1.pos, (t3 ?? t2).pos));
}
