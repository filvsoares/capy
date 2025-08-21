import { ERROR } from '@/base';
import { Bean } from '@/util/beans';
import { L3ParseContext } from '../l3-parser/l3-parser';
import { L2CallableType } from './l2-callable-type';
import { L2SimpleType } from './l2-simple-type';
import { L2Type } from './l2-type';
import { L3TypeProcessor } from './l3-type-processor';
import { INVALID, Invalid, L3Argument, L3CallableType, L3SimpleType, L3Type, VOID } from './l3-types';

export class L3TypeProcessorImpl extends Bean implements L3TypeProcessor {
  processType(c: L3ParseContext, src: L2Type): L3Type | Invalid {
    if (src instanceof L2SimpleType) {
      if (src.name === 'string' || src.name === 'number') {
        return new L3SimpleType(src.name, src.pos);
      }
      c.errors.push({
        level: ERROR,
        message: `I still don't understand type "${src.name}"`,
        pos: src.pos,
      });
      return INVALID;
    }
    if (src instanceof L2CallableType) {
      return this.processCallableType(c, src);
    }
    c.errors.push({
      level: ERROR,
      message: `I still don't understand "${src.constructor.name}"`,
      pos: src.pos,
    });
    return INVALID;
  }

  processCallableType(c: L3ParseContext, src: L2CallableType): L3CallableType | Invalid {
    const argList: L3Argument[] = [];
    for (const srcArg of src.argList) {
      const dstType = this.processType(c, srcArg.type);
      if (dstType === INVALID) {
        return INVALID;
      }
      argList.push(new L3Argument(srcArg.name, dstType, srcArg.pos));
    }
    const returnType = src.returnType ? this.processType(c, src.returnType) : VOID;
    if (returnType === INVALID) {
      return INVALID;
    }
    return new L3CallableType(argList, returnType, src.pos);
  }

  isAssignable(type: L3Type, assignTo: L3Type) {
    if (type instanceof L3SimpleType && assignTo instanceof L3SimpleType) {
      return type.primitive === assignTo.primitive;
    }
    if (type instanceof L3CallableType && assignTo instanceof L3CallableType) {
      if (!this.isAssignable(type.returnType, assignTo.returnType)) {
        return false;
      }
      if (type.argList.length !== assignTo.argList.length) {
        return false;
      }
      for (let i = 0; i < type.argList.length; i++) {
        if (!this.isAssignable(type.argList[i].type, assignTo.argList[i].type)) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
}
