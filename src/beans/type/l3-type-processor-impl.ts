import { ERROR } from '@/base';
import { INVALID, Invalid } from '@/beans/l3-parser/l3-base';
import { L3Type } from '@/beans/type/l3-type';
import { L3TypeItemProcessor } from '@/beans/type/l3-type-item-processor';
import { Bean } from '@/util/beans';
import { L3ParseContext } from '../l3-parser/l3-parser';
import { L2Type } from './l2-type';
import { L3TypeProcessor } from './l3-type-processor';

export class L3TypeProcessorImpl extends Bean implements L3TypeProcessor {
  constructor(private l3TypeItemProcessors: L3TypeItemProcessor[]) {
    super();
  }

  processType(c: L3ParseContext, obj: L2Type): L3Type | Invalid {
    for (const p of this.l3TypeItemProcessors) {
      const result = p.processType(c, obj);
      if (result) {
        return result;
      }
    }
    c.errors.push({
      level: ERROR,
      message: `I still don't understand "${obj.constructor.name}"`,
      pos: obj.pos,
    });
    return INVALID;
  }

  isAssignable(type: L3Type, assignTo: L3Type) {
    for (const p of this.l3TypeItemProcessors) {
      const result = p.isAssignable(type, assignTo);
      if (typeof result === 'boolean') {
        return result;
      }
    }
    return false;
  }
}
