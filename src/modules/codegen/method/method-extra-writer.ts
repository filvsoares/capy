import { Codegen } from '@/modules/codegen/codegen/codegen';
import { CodegenContext } from '@/modules/codegen/codegen/codegen-context';
import { CodegenExtraWriter } from '@/modules/codegen/codegen/codegen-extra-writer';
import { Bean } from '@/util/beans';

export class MethodExtraWriter extends Bean implements CodegenExtraWriter {
  constructor(private codegen: Codegen) {
    super();
  }

  writeExtra(c: CodegenContext, indent: string): void {
    c.write(`${indent}${this.codegen.getSymbolJsName(c, this.codegen.getMainModuleName(c), 'start')}();\n`);
  }
}
