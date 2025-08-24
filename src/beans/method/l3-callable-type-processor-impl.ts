import { INVALID, Invalid } from '@/beans/l3-parser/l3-base';
import { L3ParseContext } from '@/beans/l3-parser/l3-parser';
import { L2CallableType } from '@/beans/method/l2-callable-type';
import { L3Argument } from '@/beans/method/l3-argument';
import { L3CallableType } from '@/beans/method/l3-callable-type';
import { L3CallableTypeProcessor } from '@/beans/method/l3-callable-type-processor';
import { L3Type } from '@/beans/type/l3-type';
import { L3TypeItemProcessor } from '@/beans/type/l3-type-item-processor';
import { L3TypeProcessor } from '@/beans/type/l3-type-processor';
import { VOID } from '@/beans/type/simple-type';
import { Type } from '@/beans/type/type';
import { Bean } from '@/util/beans';

export class L3CallableTypeProcessorImpl extends Bean implements L3TypeItemProcessor, L3CallableTypeProcessor {
  constructor(private l3TypeProcessor: L3TypeProcessor) {
    super();
  }

  processType(c: L3ParseContext, obj: Type): L3Type | Invalid | undefined {
    if (obj instanceof L2CallableType) {
      return this.processCallableType(c, obj);
    }
  }

  processCallableType(c: L3ParseContext, obj: L2CallableType): L3CallableType | Invalid {
    const argList: L3Argument[] = [];
    for (const srcArg of obj.argList) {
      const dstType = this.l3TypeProcessor.processType(c, srcArg.type);
      if (dstType === INVALID) {
        return INVALID;
      }
      argList.push(new L3Argument(srcArg.name, dstType, srcArg.pos));
    }
    const returnType = obj.returnType ? this.l3TypeProcessor.processType(c, obj.returnType) : VOID;
    if (returnType === INVALID) {
      return INVALID;
    }
    return new L3CallableType(argList, returnType, obj.pos);
  }

  isAssignable(type: L3Type, assignTo: L3Type): boolean | undefined {
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
  }
}
