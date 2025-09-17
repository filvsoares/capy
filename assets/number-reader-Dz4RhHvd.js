import { N as Number } from "./number-B1q5ngO1.js";
import { B as Bean } from "./index-3ZiCjh5_.js";
import "./token-BtqAZLUf.js";
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
