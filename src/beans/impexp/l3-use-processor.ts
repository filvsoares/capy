import { ERROR } from '@/base';
import { L2Toplevel } from '@/beans/l2-parser/l2-parser';
import { Bean } from '@/util/beans';
import { L3ParseContext } from '../l3-parser/l3-parser';
import { L3ToplevelProcessor } from '../l3-parser/l3-toplevel-processor';
import { L2Use } from './l2-use';

export class L3UseProcessor extends Bean implements L3ToplevelProcessor {
  process(c: L3ParseContext, def: L2Toplevel): boolean {
    if (!(def instanceof L2Use)) {
      return false;
    }
    const module = c.modules[def.value];
    if (!module) {
      c.errors.push({
        level: ERROR,
        message: `Module "${def.value}" not found`,
        pos: def.pos,
      });
    }
    for (const symbol of module.symbols) {
      c.addToAllSymbols(def.value, symbol);
    }
    return true;
  }
}
