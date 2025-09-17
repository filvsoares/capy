import { C as CapyMethod, A as ArgumentVariable } from "./capy-method-BPyyA8yv.js";
import { m as methodData, M as MethodData } from "./cg-method-data-D1Uf3f84.js";
import { B as Bean } from "./index-BPYk8cqz.js";
import "./local-variable-B09Bv3_O.js";
import "./method-DkaTFuoM.js";
import "./symbol-CAVyxDMA.js";
import "./extra-Dqv87a62.js";
class CgLocalVariable {
  constructor(variable, jsName) {
    this.variable = variable;
    this.jsName = jsName;
  }
}
class MethodSymbolProcessor extends Bean {
  constructor(statementProcessor) {
    super();
    this.statementProcessor = statementProcessor;
  }
  getLocalVariableJsName(obj, usedJsNames) {
    let jsName;
    do {
      jsName = `${obj.name}${""}`;
    } while (usedJsNames.has(jsName));
    return jsName;
  }
  processCapyMethod(c, obj, indent) {
    if (!(obj.symbol instanceof CapyMethod)) {
      return;
    }
    const stack = [];
    const usedJsNames = /* @__PURE__ */ new Set();
    let argCount = 0;
    for (let i = 0; i < obj.symbol.stack.length; i++) {
      const item = obj.symbol.stack[i];
      if (item instanceof ArgumentVariable) {
        if (argCount !== i) {
          throw new Error("Argument in stack after regular local variable");
        }
        argCount++;
      }
      stack.push(new CgLocalVariable(item, this.getLocalVariableJsName(item, usedJsNames)));
    }
    const args = stack.slice(0, argCount).map((v) => v.jsName).join(", ");
    c.codegenWriter.write(`${indent}const ${obj.jsName} = async (${args}) => {
`);
    if (stack.length > argCount) {
      c.codegenWriter.write(
        `${indent}  let ${stack.slice(argCount).map((v) => v.jsName).join(", ")};
`
      );
    }
    this.statementProcessor.processStatementList(
      { ...c, ...methodData.wrap(new MethodData(stack)) },
      obj.symbol.statementList,
      `${indent}  `
    );
    c.codegenWriter.write(`${indent}}
`);
    return true;
  }
  processSymbol(c, obj, indent) {
    if (this.processCapyMethod(c, obj, indent)) {
      return true;
    }
  }
}
export {
  MethodSymbolProcessor
};
