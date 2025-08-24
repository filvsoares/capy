import { ERROR } from '@/base';
import { INVALID, Invalid } from '@/beans/l3-parser/l3-base';
import { L3ParseContext } from '@/beans/l3-parser/l3-parser';
import { L2SimpleType } from '@/beans/type/l2-simple-type';
import { L2Type } from '@/beans/type/l2-type';
import { L3SimpleType } from '@/beans/type/l3-simple-type';
import { L3Type } from '@/beans/type/l3-type';
import { L3TypeItemProcessor } from '@/beans/type/l3-type-item-processor';
import { Bean } from '@/util/beans';

export class L3SimpleTypeProcessor extends Bean implements L3TypeItemProcessor {
  processType(c: L3ParseContext, obj: L2Type): L3Type | Invalid | undefined {
    if (!(obj instanceof L2SimpleType)) {
      return;
    }
    if (obj.name === 'string' || obj.name === 'number') {
      return new L3SimpleType(obj.name, obj.pos);
    }
    c.errors.push({
      level: ERROR,
      message: `I still don't understand type "${obj.name}"`,
      pos: obj.pos,
    });
    return INVALID;
  }

  isAssignable(type: L3Type, assignTo: L3Type): boolean | undefined {
    if (type instanceof L3SimpleType && assignTo instanceof L3SimpleType) {
      return type.primitive === assignTo.primitive;
    }
  }
}
