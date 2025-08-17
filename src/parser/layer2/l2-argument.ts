import { combinePos, ERROR, fallbackPos, INTERNAL, Pos } from '../base';
import { L1Operator } from '../layer1/l1-operator';
import { L1Separator } from '../layer1/l1-separator';
import { L1Identifier } from '../layer1/l1-word';
import { L2Type } from './l2-type';
import { readType } from './l2-type-all';
import { Invalid, INVALID, L2Base, L2ParseContext, ReadResult } from './l2-types';

export class L2Argument extends L2Base {
  name: string;
  type: L2Type;

  constructor(name: string, type: L2Type, pos: Pos) {
    super(pos);
    this.name = name;
    this.type = type;
  }

  toString(): string {
    return 'argument';
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  name: ${this.name}\n`);
    out.push(`${prefix}  type: `);
    this.type.debugPrint(out, `${prefix}  `);
  }
}

function readArgument(c: L2ParseContext): ReadResult<L2Argument> {
  const t1 = c.current;
  if (!L1Identifier.matches(t1)) {
    return;
  }
  c.consume();

  const t2 = c.current;
  if (!L1Operator.matches(t2, ':')) {
    c.errors.push({
      level: ERROR,
      message: `Expected ":" but found ${t2 ?? '")"'}`,
      pos: fallbackPos(t2?.pos, t1.pos),
    });
    return INVALID;
  }
  c.consume();

  const t3 = c.current;
  const type = readType(c);
  if (!type) {
    c.errors.push({
      level: ERROR,
      message: `Expected type but found ${t3}`,
      pos: fallbackPos(t3?.pos, t2.pos),
    });
    return INVALID;
  }
  if (type === INVALID) {
    return INVALID;
  }
  return new L2Argument(t1.name, type, combinePos(t1.pos, type.pos));
}

export function readArgumentList(c: L2ParseContext): L2Argument[] {
  const outList: L2Argument[] = [];
  let error = false;

  if (!c.current) {
    return outList;
  }

  while (c.current) {
    const arg = readArgument(c);
    if (!arg) {
      if (!error) {
        error = true;
        c.errors.push({
          level: ERROR,
          message: `Expected identifier`,
          pos: INTERNAL,
        });
      }
      c.consume();
      continue;
    }
    if (arg === INVALID) {
      continue;
    }
    outList.push(arg);

    const t2 = c.current;
    if (!t2) {
      break;
    }
    if (!L1Separator.matches(t2, ',')) {
      error = true;
      c.errors.push({
        level: ERROR,
        message: `Expected "," but found ${t2}`,
        pos: t2.pos,
      });
      c.consume();
      continue;
    }
    c.consume();

    const t3 = c.current;
    if (!t3) {
      c.errors.push({
        level: ERROR,
        message: `Expected argument after ","`,
        pos: t2.pos,
      });
      break;
    }
  }

  return outList;
}
