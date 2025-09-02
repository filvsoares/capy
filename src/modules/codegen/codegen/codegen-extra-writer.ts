import { CodegenData } from '@/modules/codegen/codegen/codegen-data';
import { CodegenWriter } from '@/modules/codegen/codegen/codegen-writer';
import { declareBeanInterface } from '@/util/beans';
import { Context } from '@/util/context';

export interface CodegenExtraWriter {
  writeExtra(c: Context<CodegenWriter & CodegenData>, indent: string): void;
}

export const codegenExtraWriter = declareBeanInterface<CodegenExtraWriter>('CodegenExtraWriter');
