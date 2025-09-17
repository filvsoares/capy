import { CgSymbol } from '@/modules/codegen/cg-symbol';
import { Application } from '@/modules/parser/application';

export class CodegenData {
  private usedSymbolJsNames = new Set<string>();

  constructor(
    public application: Application,
    public symbols: { [moduleName: string]: { [symbolName: string]: CgSymbol } }
  ) {}

  reserveJsName(...parts: string[]) {
    const baseName = `_${parts.join('_')}_`.replaceAll(/[^A-Za-z0-9_]/g, '_');
    let name = baseName;
    let i = 0;
    while (this.usedSymbolJsNames.has(name)) {
      name = `${baseName}${++i}_`;
    }
    this.usedSymbolJsNames.add(name);
    return name;
  }

  getSymbolJsName(moduleName: string, symbolName: string) {
    const symbol = this.symbols[moduleName]?.[symbolName];
    if (!symbol) {
      throw new Error(`Symbol ${symbolName} not found`);
    }
    return symbol.jsName;
  }
}
