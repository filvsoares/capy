import { S as StringLiteral } from "./string-literal-BDu2J8WL.js";
import { B as Bean } from "./index-BncJlCxS.js";
import "./expression-DdT-ttwU.js";
import "./simple-type-BIm_59qh.js";
import "./type-CuPJgnn0.js";
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
