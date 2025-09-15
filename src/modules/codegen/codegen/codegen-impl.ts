import { CgSymbol } from '@/modules/codegen/codegen/cg-symbol';
import { Codegen } from '@/modules/codegen/codegen/codegen';
import { codegenData } from '@/modules/codegen/codegen/codegen-data';
import { CodegenExtraWriter } from '@/modules/codegen/codegen/codegen-extra-writer';
import { codegenWriter } from '@/modules/codegen/codegen/codegen-writer';
import { SymbolProcessor } from '@/modules/codegen/codegen/symbol-processor';
import { Application } from '@/modules/parser/parser/application';
import { Symbol } from '@/modules/parser/parser/symbol';
import { Bean } from '@/util/beans';
import { createContext } from '@/util/context';

export class CodegenImpl extends Bean implements Codegen {
  constructor(private symbolProcessors: SymbolProcessor[], private codegenExtraWriters: CodegenExtraWriter[]) {
    super();
  }

  private resolveSymbolJsName(obj: Symbol, usedJsNames: Set<string>) {
    let jsName;
    let i = 0;
    do {
      jsName = `${obj.module}_${obj.name}${i > 0 ? `_${i++}` : '_'}`;
    } while (usedJsNames.has(jsName));
    return jsName;
  }

  generateCode(application: Application): string[] {
    const out: string[] = [];

    const modules: { [moduleName: string]: { [symbolName: string]: CgSymbol } } = {};
    const usedJsNames = new Set<string>();
    for (const symbol of application.symbols) {
      let module = modules[symbol.module];
      if (!module) {
        modules[symbol.module] = module = {};
      }
      module[symbol.name] = new CgSymbol(symbol, this.resolveSymbolJsName(symbol, usedJsNames));
    }

    const c = createContext({}).with(codegenData(application, modules)).with(codegenWriter(out));

    for (const moduleName in modules) {
      const module = modules[moduleName];
      for (const symbolName in module) {
        const symbol = module[symbolName];
        let ok = false;
        c.codegenWriter.write(`// --- ${moduleName}.${symbolName}\n`);
        for (const processor of this.symbolProcessors) {
          if (processor.processSymbol(c, symbol, '')) {
            ok = true;
          }
        }
        if (!ok) {
          throw new Error(`No SymbolProcessor for symbol type ${symbol.constructor.name}`);
        }
      }
    }

    for (const extraWriter of this.codegenExtraWriters) {
      extraWriter.writeExtra(c, '');
    }

    return ['nativeMethods', out.join('')];
  }
}
