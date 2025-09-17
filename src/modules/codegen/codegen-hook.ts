import { CodegenContext } from '@/modules/codegen/codegen';
import { declareBeanInterface } from '@/util/beans';

export interface CodegenHook {
  onCreateContext?(c: CodegenContext): void;
  onBeforeSymbols?(c: CodegenContext, indent: string): void;
  onAfterSymbols?(c: CodegenContext, indent: string): void;
}

export const codegenHook = declareBeanInterface<CodegenHook>('CodegenHook');
