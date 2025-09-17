import { CodegenContext } from '@/modules/codegen/codegen';
import { CodegenHook } from '@/modules/codegen/codegen-hook';
import { Bean } from '@/util/beans';

export class MethodExtraWriter extends Bean implements CodegenHook {
  onAfterSymbols(c: CodegenContext, indent: string): void {
    c.codegenWriter.write(`${indent}await ${c.codegenData.getSymbolJsName('main', 'start')}();\n`);
  }
}
