import { B as Bean } from "./index-BncJlCxS.js";
import { c as createContext } from "./context-ByTyzBz7.js";
class CgSymbol {
  constructor(symbol, jsName) {
    this.symbol = symbol;
    this.jsName = jsName;
  }
}
function codegenData(application, modules) {
  return {
    codegenData: {
      application,
      modules,
      getSymbolJsName(moduleName, symbolName) {
        var _a;
        const symbol = (_a = modules[moduleName]) == null ? void 0 : _a[symbolName];
        if (!symbol) {
          throw new Error(`Symbol ${moduleName}/${symbolName} not found`);
        }
        return symbol.jsName;
      }
    }
  };
}
function codegenWriter(out) {
  return {
    codegenWriter: {
      write(...s) {
        out.push(...s);
      }
    }
  };
}
class CodegenImpl extends Bean {
  constructor(symbolProcessors, codegenExtraWriters) {
    super();
    this.symbolProcessors = symbolProcessors;
    this.codegenExtraWriters = codegenExtraWriters;
  }
  resolveSymbolJsName(obj, usedJsNames) {
    let jsName;
    do {
      jsName = `${obj.module}_${obj.name}${"_"}`;
    } while (usedJsNames.has(jsName));
    return jsName;
  }
  generateCode(application) {
    const out = [];
    const modules = {};
    const usedJsNames = /* @__PURE__ */ new Set();
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
    for (const extraWriter of this.codegenExtraWriters) {
      extraWriter.writeExtra(c, "");
    }
    return ["nativeMethods", out.join("")];
  }
  getMainModuleName(c) {
    return c.codegenData.application.mainModuleName;
  }
}
export {
  CodegenImpl
};
