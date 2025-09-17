import { G as GlobalVariable } from "./global-variable-CUKWfMi2.js";
import { B as Bean } from "./index-BPYk8cqz.js";
import "./symbol-CAVyxDMA.js";
class GlobalVariableSymbolProcessor extends Bean {
  constructor(expressionProcessor) {
    super();
    this.expressionProcessor = expressionProcessor;
  }
  processSymbol(c, obj, indent) {
    if (!(obj.symbol instanceof GlobalVariable)) {
      return;
    }
    c.codegenWriter.write(
      `${indent}let ${obj.jsName};
`,
      `${indent}const ${obj.jsName}get = () => {
`,
      `${indent}  if (${obj.jsName} === undefined) {
`,
      `${indent}    ${obj.jsName} = ${obj.symbol.initExpr ? this.expressionProcessor.processExpression(c, obj.symbol.initExpr).join("") : "null"};
`,
      `${indent}  }
`,
      `${indent}  return ${obj.jsName};
`,
      `${indent}}
`
    );
    return true;
  }
}
export {
  GlobalVariableSymbolProcessor
};
