import { CodegenData } from '@/modules/codegen/codegen/codegen-data';
import { CodegenExtraWriter } from '@/modules/codegen/codegen/codegen-extra-writer';
import { CodegenWriter } from '@/modules/codegen/codegen/codegen-writer';
import { Bean } from '@/util/beans';
import { Context } from '@/util/context';

export class MethodExtraWriter extends Bean implements CodegenExtraWriter {
  writeExtra(c: Context<CodegenWriter & CodegenData>, indent: string): void {
    c.codegenWriter.write(`${indent}${c.codegenData.getSymbolJsName('main', 'start')}();\n`);
  }
}
