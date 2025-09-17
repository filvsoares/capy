import { CgSymbol } from '@/modules/codegen/cg-symbol';
import { CodegenContext } from '@/modules/codegen/codegen';
import { CodegenHook } from '@/modules/codegen/codegen-hook';
import { SymbolProcessor } from '@/modules/codegen/symbol-processor';
import { CgLibraryData, cgLibraryData } from '@/modules/library/cg-library-data';
import { NativeMethod } from '@/modules/library/native-method';
import { Bean } from '@/util/beans';

export class NativeMethodSymbolProcessor extends Bean implements SymbolProcessor, CodegenHook {
  onCreateContext(c: CodegenContext): void {
    cgLibraryData.addTo(c, new CgLibraryData());
  }

  onBeforeSymbols(c: CodegenContext, indent: string): void {
    const _cgLibraryData = cgLibraryData.requireFrom(c);
    _cgLibraryData.loadLibraryWriter = c.codegenWriter.reserve();
  }

  processSymbol(c: CodegenContext, obj: CgSymbol, indent: string): boolean | undefined {
    if (!(obj.symbol instanceof NativeMethod)) {
      return;
    }
    const _cgLibraryData = cgLibraryData.requireFrom(c);
    let libJsName = _cgLibraryData.libJsNames[obj.symbol.module];
    if (!libJsName) {
      libJsName = c.codegenData.reserveJsName(obj.symbol.module);
      _cgLibraryData.loadLibraryWriter!.write(`const ${libJsName} = await args.loadLibrary('${obj.symbol.module}');\n`);
    }
    c.codegenWriter.write(`${indent}const ${obj.jsName} = ${libJsName}['${obj.symbol.name}'];\n`);
    return true;
  }
}
