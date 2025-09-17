import { B as Bean } from "./index-3ZiCjh5_.js";
class MethodExtraWriter extends Bean {
  onAfterSymbols(c, indent) {
    c.codegenWriter.write(`${indent}await ${c.codegenData.getSymbolJsName("main", "start")}();
`);
  }
}
export {
  MethodExtraWriter
};
