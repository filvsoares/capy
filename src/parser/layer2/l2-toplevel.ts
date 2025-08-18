import { ERROR } from '@/parser/base';
import { readFunction } from './l2-method';
import { INVALID, L2Base, L2ParseContext, ReadResult } from './l2-types';
import { readUse } from './l2-use';
import { readVariable } from './l2-variable';

export function readToplevel(c: L2ParseContext): ReadResult<L2Base> {
  return readUse(c) || readVariable(c) || readFunction(c);
}

export function readToplevelList(c: L2ParseContext): L2Base[] {
  const outList: L2Base[] = [];
  let error = false;
  while (c.current) {
    const val = readToplevel(c);
    if (val === INVALID) {
      error = true;
      continue;
    }
    if (!val) {
      if (!error) {
        error = true;
        const t = c.current;
        c.errors.push({
          level: ERROR,
          message: `Unexpected ${t}`,
          pos: {
            lin1: t.pos.lin1,
            col1: t.pos.col1,
            lin2: t.pos.lin2,
            col2: t.pos.col2,
          },
        });
      }
      c.consume();
      continue;
    }
    error = false;
    outList.push(val);
  }
  return outList;
}
