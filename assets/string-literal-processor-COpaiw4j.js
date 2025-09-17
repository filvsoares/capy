import { S as StringLiteral } from "./string-literal-BeYzi1M2.js";
import { B as Bean } from "./index-BPYk8cqz.js";
import "./expression-gX919Tzj.js";
import "./simple-type-KY6tNXlF.js";
import "./type-Dxgg9cQE.js";
class StringLiteralProcessor extends Bean {
  processExpression(c, obj) {
    if (!(obj instanceof StringLiteral)) {
      return;
    }
    return ['"', obj.value, '"'];
  }
}
export {
  StringLiteralProcessor
};
