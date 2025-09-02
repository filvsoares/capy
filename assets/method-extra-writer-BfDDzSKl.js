import { B as Bean } from "./index-BncJlCxS.js";
class MethodExtraWriter extends Bean {
  writeExtra(c, indent) {
    c.codegenWriter.write(
      `${indent}${c.codegenData.getSymbolJsName(c.codegenData.application.mainModuleName, "start")}();
`
    );
  }
}
export {
  MethodExtraWriter
};
