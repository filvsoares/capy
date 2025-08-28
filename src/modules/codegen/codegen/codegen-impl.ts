import { CgSymbol } from '@/modules/codegen/codegen/cg-symbol';
import { Codegen, CodegenContext } from '@/modules/codegen/codegen/codegen';
import { SymbolProcessor } from '@/modules/codegen/codegen/symbol-processor';
import { Module } from '@/modules/parser/parser/module';
import { Symbol } from '@/modules/parser/parser/symbol';
import { Bean } from '@/util/beans';

export class CodegenImpl extends Bean implements Codegen {
  constructor(private symbolProcessors: SymbolProcessor[]) {
    super();
  }

  private getSymbolJsName(obj: Symbol, usedJsNames: Set<string>) {
    let jsName;
    let i = 0;
    do {
      jsName = `_${obj.module}_${obj.name}${i > 0 ? `_${i++}` : ''}_`;
    } while (usedJsNames.has(jsName));
    return jsName;
  }

  generateCode(modules: { [moduleName: string]: Module }): string {
    const out: string[] = [];

    const c: CodegenContext = {
      write: (s) => {
        out.push(s);
      },
    };

    const cgModules: { [moduleName: string]: { [symbolName: string]: CgSymbol } } = {};
    const usedJsNames = new Set<string>();
    for (const moduleName in modules) {
      const srcModule = modules[moduleName];
      const dstModule: { [symbolName: string]: CgSymbol } = (cgModules[moduleName] = {});
      for (const symbolName in srcModule.symbols) {
        const srcSymbol = srcModule.symbols[symbolName];
        dstModule[symbolName] = new CgSymbol(srcSymbol, this.getSymbolJsName(srcSymbol, usedJsNames));
      }
    }

    for (const moduleName in cgModules) {
      const module = cgModules[moduleName];
      out.push('// ------------\n', `// Module ${moduleName}\n`, '// ------------\n\n');
      for (const symbolName in module) {
        const symbol = module[symbolName];
        let ok = false;
        out.push(`// ${symbolName}\n`);
        for (const processor of this.symbolProcessors) {
          if (processor.processSymbol(c, symbol)) {
            ok = true;
          }
        }
        if (!ok) {
          throw new Error(`No SymbolProcessor for symbol type ${symbol.constructor.name}`);
        }
      }
    }

    return out.join('');
  }
}
