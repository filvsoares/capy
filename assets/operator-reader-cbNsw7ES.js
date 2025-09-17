import { B as Bean } from "./index-3ZiCjh5_.js";
import { O as Operator } from "./operator-BvOOTirp.js";
import "./token-BtqAZLUf.js";
const operatorMap = {
  "=": { "=": true },
  "+": true,
  "-": true,
  "*": true,
  "/": true,
  ":": true,
  ".": true
};
function isOperator(s) {
  let currentMapPos = operatorMap;
  for (const c of s) {
    if (currentMapPos === true) {
      return false;
    }
    currentMapPos = currentMapPos[c];
    if (!currentMapPos) {
      return false;
    }
  }
  return true;
}
class OperatorReader extends Bean {
  read(c) {
    if (!isOperator(c.current)) {
      return;
    }
    let value = c.current;
    const lin1 = c.lin;
    const col1 = c.col;
    let lin2 = c.lin;
    let col2 = c.col + 1;
    c.consume();
    while (c.current && isOperator(value + c.current)) {
      value += c.current;
      lin2 = c.lin;
      col2 = c.col + 1;
    }
    return new Operator(value, { lin1, col1, lin2, col2 });
  }
}
export {
  OperatorReader
};
