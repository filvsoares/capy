import { CgSymbol } from '@/modules/codegen/codegen/cg-symbol';
import { CodegenData } from '@/modules/codegen/codegen/codegen-data';
import { CodegenWriter } from '@/modules/codegen/codegen/codegen-writer';
import { SymbolProcessor } from '@/modules/codegen/codegen/symbol-processor';
import { CgLocalVariable } from '@/modules/codegen/method/cg-local-variable';
import { methodData } from '@/modules/codegen/method/method-data';
import { StatementProcessor } from '@/modules/codegen/statement/statement-processor';
import { ArgumentVariable } from '@/modules/parser/method/argument-variable';
import { CapyMethod } from '@/modules/parser/method/capy-method';
import { LocalVariable } from '@/modules/parser/method/local-variable';
import { NativeMethod } from '@/modules/parser/method/native-method';
import { Bean } from '@/util/beans';
import { Context } from '@/util/context';

export class MethodSymbolProcessor extends Bean implements SymbolProcessor {
  constructor(private statementProcessor: StatementProcessor) {
    super();
  }

  processNativeMethod(c: Context<CodegenWriter & CodegenData>, obj: CgSymbol, indent: string): boolean | undefined {
    if (!(obj.symbol instanceof NativeMethod)) {
      return;
    }
    c.codegenWriter.write(`${indent}const ${obj.jsName} = nativeMethods['${obj.symbol.module}.${obj.symbol.name}'];\n`);
    return true;
  }

  private getLocalVariableJsName(obj: LocalVariable, usedJsNames: Set<string>) {
    let jsName;
    let i = 0;
    do {
      jsName = `${obj.name}${i > 0 ? `_${i++}` : ''}`;
    } while (usedJsNames.has(jsName));
    return jsName;
  }

  processCapyMethod(c: Context<CodegenWriter & CodegenData>, obj: CgSymbol, indent: string): boolean | undefined {
    if (!(obj.symbol instanceof CapyMethod)) {
      return;
    }
    const stack: CgLocalVariable[] = [];
    const usedJsNames = new Set<string>();
    let argCount = 0;
    for (let i = 0; i < obj.symbol.stack.length; i++) {
      const item = obj.symbol.stack[i];
      if (item instanceof ArgumentVariable) {
        if (argCount !== i) {
          throw new Error('Argument in stack after regular local variable');
        }
        argCount++;
      }
      stack.push(new CgLocalVariable(item, this.getLocalVariableJsName(item, usedJsNames)));
    }

    const args = stack
      .slice(0, argCount)
      .map((v) => v.jsName)
      .join(', ');

    c.codegenWriter.write(`${indent}const ${obj.jsName} = (${args}) => {\n`);

    if (stack.length > argCount) {
      c.codegenWriter.write(
        `${indent}  let ${stack
          .slice(argCount)
          .map((v) => v.jsName)
          .join(', ')};\n`
      );
    }

    this.statementProcessor.processStatementList(c.with(methodData(stack)), obj.symbol.statementList, `${indent}  `);

    c.codegenWriter.write(`${indent}}\n`);
    return true;
  }

  processSymbol(c: Context<CodegenWriter & CodegenData>, obj: CgSymbol, indent: string): boolean | undefined {
    if (this.processNativeMethod(c, obj, indent)) {
      return true;
    }
    if (this.processCapyMethod(c, obj, indent)) {
      return true;
    }
  }
}
