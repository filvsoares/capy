import { CgSymbol } from '@/modules/codegen/cg-symbol';
import { CodegenContext } from '@/modules/codegen/codegen';
import { SymbolProcessor } from '@/modules/codegen/symbol-processor';
import { ExpressionProcessor } from '@/modules/expression/expression-processor';
import { GlobalVariable } from '@/modules/global-variable/global-variable';
import { Bean } from '@/util/beans';

export class GlobalVariableSymbolProcessor extends Bean implements SymbolProcessor {
  constructor(private expressionProcessor: ExpressionProcessor) {
    super();
  }

  processSymbol(c: CodegenContext, obj: CgSymbol, indent: '  '): boolean | undefined {
    if (!(obj.symbol instanceof GlobalVariable)) {
      return;
    }
    c.codegenWriter.write(
      `${indent}let ${obj.jsName};\n`,
      `${indent}const ${obj.jsName}get = () => {\n`,
      `${indent}  if (${obj.jsName} === undefined) {\n`,
      `${indent}    ${obj.jsName} = ${
        obj.symbol.initExpr ? this.expressionProcessor.processExpression(c, obj.symbol.initExpr).join('') : 'null'
      };\n`,
      `${indent}  }\n`,
      `${indent}  return ${obj.jsName};\n`,
      `${indent}}\n`
    );
    return true;
  }
}
