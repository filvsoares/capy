import { B as Bean } from "./index-BPYk8cqz.js";
class CgSymbol {
  constructor(symbol, jsName) {
    this.symbol = symbol;
    this.jsName = jsName;
  }
}
class CodegenData {
  constructor(application, symbols) {
    this.application = application;
    this.symbols = symbols;
    this.usedSymbolJsNames = /* @__PURE__ */ new Set();
  }
  reserveJsName(...parts) {
    const baseName = `_${parts.join("_")}_`.replaceAll(/[^A-Za-z0-9_]/g, "_");
    let name = baseName;
    let i = 0;
    while (this.usedSymbolJsNames.has(name)) {
      name = `${baseName}${++i}_`;
    }
    this.usedSymbolJsNames.add(name);
    return name;
  }
  getSymbolJsName(moduleName, symbolName) {
    var _a;
    const symbol = (_a = this.symbols[moduleName]) == null ? void 0 : _a[symbolName];
    if (!symbol) {
      throw new Error(`Symbol ${symbolName} not found`);
    }
    return symbol.jsName;
  }
}
class CodegenWriter {
  constructor(out) {
    this.out = out;
  }
  write(...s) {
    this.out.push(...s);
  }
  reserve() {
    const data = [];
    this.out.push(data);
    return new CodegenWriter(data);
  }
}
class CodegenImpl extends Bean {
  constructor(symbolProcessors, codegenHooks) {
    super();
    this.symbolProcessors = symbolProcessors;
    this.codegenHooks = codegenHooks;
  }
  generateCode(application) {
    var _a, _b, _c;
    const out = [];
    const modules = {};
    const c = {
      codegenData: new CodegenData(application, modules),
      codegenWriter: new CodegenWriter(out)
    };
    for (const symbol of application.symbols) {
      let module = modules[symbol.module];
      if (!module) {
        modules[symbol.module] = module = {};
      }
      module[symbol.name] = new CgSymbol(symbol, c.codegenData.reserveJsName(symbol.module, symbol.name));
    }
    for (const hook of this.codegenHooks) {
      (_a = hook.onCreateContext) == null ? void 0 : _a.call(hook, c);
    }
    for (const hook of this.codegenHooks) {
      (_b = hook.onBeforeSymbols) == null ? void 0 : _b.call(hook, c, "");
    }
    for (const moduleName in modules) {
      const module = modules[moduleName];
      for (const symbolName in module) {
        const symbol = module[symbolName];
        let ok = false;
        c.codegenWriter.write(`// --- ${moduleName}.${symbolName}
`);
        for (const processor of this.symbolProcessors) {
          if (processor.processSymbol(c, symbol, "")) {
            ok = true;
          }
        }
        if (!ok) {
          throw new Error(`No SymbolProcessor for symbol type ${symbol.constructor.name}`);
        }
      }
    }
    for (const hook of this.codegenHooks) {
      (_c = hook.onAfterSymbols) == null ? void 0 : _c.call(hook, c, "");
    }
    return out.flat().join("");
  }
}
export {
  CodegenImpl
};
