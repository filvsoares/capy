import { CgSymbol } from '@/modules/codegen/codegen/cg-symbol';
import { CodegenContext } from '@/modules/codegen/codegen/codegen';
import { SymbolProcessor } from '@/modules/codegen/codegen/symbol-processor';
import { CgMethodStack } from '@/modules/codegen/method/cg-method-stack';
import { ArgumentVariable } from '@/modules/parser/method/argument-variable';
import { CapyMethod } from '@/modules/parser/method/capy-method';
import { LocalVariable } from '@/modules/parser/method/local-variable';
import { NativeMethod } from '@/modules/parser/method/native-method';
import { Bean } from '@/util/beans';

export class MethodSymbolProcessor extends Bean implements SymbolProcessor {
  processNativeMethod(c: CodegenContext, obj: CgSymbol): boolean | undefined {
    if (!(obj.symbol instanceof NativeMethod)) {
      return;
    }
    c.write(`const ${obj.jsName} = nativeMethods['${obj.symbol.module}.${obj.symbol.name}'];\n`);
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

  processCapyMethod(c: CodegenContext, obj: CgSymbol): boolean | undefined {
    if (!(obj.symbol instanceof CapyMethod)) {
      return;
    }
    const jsNames: string[] = [];
    const usedJsNames = new Set<string>();
    for (const item of obj.symbol.stack) {
      jsNames.push(this.getLocalVariableJsName(item, usedJsNames));
    }
    const stack = new CgMethodStack(obj.symbol.stack, jsNames);

    c.write(
      `function ${obj.jsName}(${obj.symbol.stack
        .filter((arg) => arg instanceof ArgumentVariable)
        .map((e, i) => jsNames[i])
        .join(', ')}) {}\n`
    );
    return true;
  }

  processSymbol(c: CodegenContext, obj: CgSymbol): boolean | undefined {
    if (this.processNativeMethod(c, obj)) {
      return true;
    }
    if (this.processCapyMethod(c, obj)) {
      return true;
    }
  }
}
