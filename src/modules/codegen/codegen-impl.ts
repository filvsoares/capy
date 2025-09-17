import { CgSymbol } from '@/modules/codegen/cg-symbol';
import { Codegen, CodegenContext } from '@/modules/codegen/codegen';
import { CodegenData } from '@/modules/codegen/codegen-data';
import { CodegenHook } from '@/modules/codegen/codegen-hook';
import { CodegenWriter, Content } from '@/modules/codegen/codegen-writer';
import { SymbolProcessor } from '@/modules/codegen/symbol-processor';
import { Application } from '@/modules/parser/application';
import { Bean } from '@/util/beans';

export class CodegenImpl extends Bean implements Codegen {
  constructor(private symbolProcessors: SymbolProcessor[], private codegenHooks: CodegenHook[]) {
    super();
  }

  generateCode(application: Application): string {
    const out: Content[] = [];

    const modules: { [moduleName: string]: { [symbolName: string]: CgSymbol } } = {};

    const c: CodegenContext = {
      codegenData: new CodegenData(application, modules),
      codegenWriter: new CodegenWriter(out),
    };

    for (const symbol of application.symbols) {
      let module = modules[symbol.module];
      if (!module) {
        modules[symbol.module] = module = {};
      }
      module[symbol.name] = new CgSymbol(symbol, c.codegenData.reserveJsName(symbol.module, symbol.name));
    }

    for (const hook of this.codegenHooks) {
      hook.onCreateContext?.(c);
    }

    for (const hook of this.codegenHooks) {
      hook.onBeforeSymbols?.(c, '');
    }

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

    for (const hook of this.codegenHooks) {
      hook.onAfterSymbols?.(c, '');
    }

    return out.flat().join('');
  }
}
