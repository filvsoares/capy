import { CgSymbol } from '@/modules/codegen/codegen/cg-symbol';
import { CodegenData } from '@/modules/codegen/codegen/codegen-data';
import { CodegenWriter } from '@/modules/codegen/codegen/codegen-writer';
import { SymbolProcessor } from '@/modules/codegen/codegen/symbol-processor';
import { ExpressionProcessor } from '@/modules/codegen/expression/expression-processor';
import { GlobalVariable } from '@/modules/parser/global-variable/global-variable';
import { Bean } from '@/util/beans';
import { Context } from '@/util/context';

export class GlobalVariableSymbolProcessor extends Bean implements SymbolProcessor {
  constructor(private expressionProcessor: ExpressionProcessor) {
    super();
  }

  processSymbol(c: Context<CodegenWriter & CodegenData>, obj: CgSymbol, indent: '  '): boolean | undefined {
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
