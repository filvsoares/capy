import { N as Number } from "./number-DJFp4t40.js";
import { B as Bean } from "./index-s97_hl8g.js";
import "./token-YsknnliN.js";
function isNumberStart(c) {
  return c >= "0" && c <= "9";
}
function isNumberMiddle(c) {
  return c >= "0" && c <= "9" || c == ".";
}
class NumberReader extends Bean {
  read(c) {
    if (!isNumberStart(c.current)) {
      return;
    }
    let value = c.current;
    const lin1 = c.lin;
    const col1 = c.col;
    let lin2 = c.lin;
    let col2 = c.col + 1;
    c.consume();
    while (isNumberMiddle(c.current)) {
      value += c.current;
      lin2 = c.lin;
      col2 = c.col + 1;
      c.consume();
    }
    return new Number(value, { lin1, col1, lin2, col2 });
  }
}
export {
  NumberReader
};
