import { CgSymbol } from '@/modules/codegen/cg-symbol';
import { Application } from '@/modules/parser/application';

export class CodegenData {
  constructor(
    public application: Application,
    public symbols: { [moduleName: string]: { [symbolName: string]: CgSymbol } }
  ) {}

  getSymbolJsName(moduleName: string, symbolName: string) {
    const symbol = this.symbols[moduleName]?.[symbolName];
    if (!symbol) {
      throw new Error(`Symbol ${symbolName} not found`);
    }
    return symbol.jsName;
  }
}
