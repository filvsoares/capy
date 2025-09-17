import { S as StringLiteral } from "./string-literal-bR7Z568W.js";
import { B as Bean } from "./index-3ZiCjh5_.js";
import "./expression-I5NqfmRI.js";
import "./simple-type-CKDhUhFe.js";
import "./type-CXsu6tPh.js";
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
