import { d as declareExtraKey } from "./extra-Dqv87a62.js";
import { N as NativeMethod } from "./native-method-CnC8C1vy.js";
import { B as Bean } from "./index-3ZiCjh5_.js";
import "./method-DxMFOSUf.js";
import "./symbol-CzSKJU1d.js";
class CgLibraryData {
  constructor() {
    this.libJsNames = {};
  }
}
const cgLibraryData = declareExtraKey("cgLibraryData");
class NativeMethodSymbolProcessor extends Bean {
  onCreateContext(c) {
    cgLibraryData.addTo(c, new CgLibraryData());
  }
  onBeforeSymbols(c, indent) {
    const _cgLibraryData = cgLibraryData.requireFrom(c);
    _cgLibraryData.loadLibraryWriter = c.codegenWriter.reserve();
  }
  processSymbol(c, obj, indent) {
    if (!(obj.symbol instanceof NativeMethod)) {
      return;
    }
    const _cgLibraryData = cgLibraryData.requireFrom(c);
    let libJsName = _cgLibraryData.libJsNames[obj.symbol.module];
    if (!libJsName) {
      libJsName = _cgLibraryData.libJsNames[obj.symbol.module] = c.codegenData.reserveJsName(obj.symbol.module);
      _cgLibraryData.loadLibraryWriter.write(`const ${libJsName} = await args.loadLibrary('${obj.symbol.module}');
`);
    }
    c.codegenWriter.write(`${indent}const ${obj.jsName} = ${libJsName}['${obj.symbol.name}'];
`);
    return true;
  }
}
export {
  NativeMethodSymbolProcessor
};
