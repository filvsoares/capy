import { CgSymbol } from '@/modules/codegen/codegen/cg-symbol';
import { CodegenContext } from '@/modules/codegen/codegen/codegen';
import { SymbolProcessor } from '@/modules/codegen/codegen/symbol-processor';
import { GlobalVariable } from '@/modules/parser/global-variable/global-variable';
import { Bean } from '@/util/beans';

export class GlobalVariableSymbolProcessor extends Bean implements SymbolProcessor {
  processSymbol(c: CodegenContext, obj: CgSymbol): boolean | undefined {
    if (!(obj.symbol instanceof GlobalVariable)) {
      return;
    }
    c.write(`let ${obj.jsName};\n`);
    return true;
  }
}
