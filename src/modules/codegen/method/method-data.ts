import { CgLocalVariable } from '@/modules/codegen/method/cg-local-variable';
import { LocalVariableReference } from '@/modules/parser/method/local-variable-reference';
import { Context, ContextValue } from '@/util/context';

export type MethodData = ContextValue<
  'methodData',
  {
    getJsName(obj: LocalVariableReference): string;
  }
>;

export function methodData(stack: CgLocalVariable[]): MethodData {
  return {
    methodData: {
      getJsName(obj) {
        return stack[obj.index].jsName;
      },
    },
  };
}

export function hasMethodData(c: Context<Partial<MethodData>>): c is Context<MethodData> {
  return c.methodData !== undefined;
}
