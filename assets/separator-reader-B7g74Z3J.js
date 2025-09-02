import { B as Bean } from "./index-BncJlCxS.js";
import { S as Separator } from "./separator-D1CNARzn.js";
import "./token-YbVOofIc.js";
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
