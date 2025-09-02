import { m as methodData } from "./method-data-CGRmJbpc.js";
import { N as NativeMethod, C as CapyMethod, A as ArgumentVariable } from "./native-method-BGvMDny2.js";
import { B as Bean } from "./index-BncJlCxS.js";
import "./local-variable-CyCoFzWG.js";
import "./method-vXMUZt8y.js";
import "./symbol-CzF83rwI.js";
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
  processNativeMethod(c, obj, indent) {
    if (!(obj.symbol instanceof NativeMethod)) {
      return;
    }
    c.codegenWriter.write(`${indent}const ${obj.jsName} = nativeMethods['${obj.symbol.module}.${obj.symbol.name}'];
`);
    return true;
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
    c.codegenWriter.write(`${indent}const ${obj.jsName} = (${args}) => {
`);
    if (stack.length > argCount) {
      c.codegenWriter.write(
        `${indent}  let ${stack.slice(argCount).map((v) => v.jsName).join(", ")};
`
      );
    }
    this.statementProcessor.processStatementList(c.with(methodData(stack)), obj.symbol.statementList, `${indent}  `);
    c.codegenWriter.write(`${indent}}
`);
    return true;
  }
  processSymbol(c, obj, indent) {
    if (this.processNativeMethod(c, obj, indent)) {
      return true;
    }
    if (this.processCapyMethod(c, obj, indent)) {
      return true;
    }
  }
}
export {
  MethodSymbolProcessor
};
