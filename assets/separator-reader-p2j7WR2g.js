import { B as Bean } from "./index-s97_hl8g.js";
import { S as Separator } from "./separator-DCoNiD5Y.js";
import "./token-YsknnliN.js";
function isSeparator(c) {
  return c === ";" || c === ",";
}
class SeparatorReader extends Bean {
  read(c) {
    if (!isSeparator(c.current)) {
      return;
    }
    const value = c.current;
    const lin1 = c.lin;
    const col1 = c.col;
    const lin2 = c.lin;
    const col2 = c.col + 1;
    c.consume();
    return new Separator(value, { lin1, col1, lin2, col2 });
  }
}
export {
  SeparatorReader
};
