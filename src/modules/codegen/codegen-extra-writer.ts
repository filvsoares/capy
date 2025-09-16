import { CodegenContext } from '@/modules/codegen/codegen';
import { declareBeanInterface } from '@/util/beans';

export interface CodegenExtraWriter {
  writeExtra(c: CodegenContext, indent: string): void;
}

export const codegenExtraWriter = declareBeanInterface<CodegenExtraWriter>('CodegenExtraWriter');
