import { S as StringLiteral } from "./string-literal-bXpXWRwd.js";
import { B as Bean } from "./index-DyTq3Mxn.js";
import "./expression-BI_7gns1.js";
import "./simple-type-DZbjR7se.js";
import "./type-Cw01Jon0.js";
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
