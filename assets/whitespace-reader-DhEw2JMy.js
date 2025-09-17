import { B as Bean } from "./index-DyTq3Mxn.js";
function isWhitespace(c) {
  return c === " " || c === "	" || c === "\r" || c === "\n";
}
class WhitespaceReader extends Bean {
  read(c) {
    if (!isWhitespace(c.current)) {
      return;
    }
    c.consume();
    while (isWhitespace(c.current)) {
      c.consume();
    }
    return true;
  }
}
export {
  WhitespaceReader
};
