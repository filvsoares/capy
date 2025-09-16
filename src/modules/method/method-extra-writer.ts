import { CodegenContext } from '@/modules/codegen/codegen';
import { CodegenExtraWriter } from '@/modules/codegen/codegen-extra-writer';
import { Bean } from '@/util/beans';

export class MethodExtraWriter extends Bean implements CodegenExtraWriter {
  writeExtra(c: CodegenContext, indent: string): void {
    c.codegenWriter.write(`${indent}${c.codegenData.getSymbolJsName('main', 'start')}();\n`);
  }
}
