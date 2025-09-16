import { CgLocalVariable } from '@/modules/method/cg-local-variable';
import { LocalVariableReference } from '@/modules/method/local-variable-reference';
import { declareExtraKey } from '@/util/extra';

export const methodData = declareExtraKey<MethodData>('methodData');

export class MethodData {
  constructor(private stack: CgLocalVariable[]) {}
  getJsName(obj: LocalVariableReference) {
    return this.stack[obj.index].jsName;
  }
}
