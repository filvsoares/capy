import { CodegenContext } from '@/modules/codegen/codegen/codegen-context';
import { declareBeanInterface } from '@/util/beans';

export interface CodegenExtraWriter {
  writeExtra(c: CodegenContext, indent: string): void;
}

export const codegenExtraWriter = declareBeanInterface<CodegenExtraWriter>('CodegenExtraWriter');
