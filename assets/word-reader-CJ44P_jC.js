import { I as Identifier } from "./identifier-ClyZKQs9.js";
import { K as Keyword } from "./keyword-D76bTD-h.js";
import { B as Bean } from "./index-BPYk8cqz.js";
import "./token-C93Hpdaz.js";
function isWordStart(c) {
  return c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c === "_";
}
function isWordMiddle(c) {
  return c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c >= "0" && c <= "9" || c === "_";
}
const KEYWORDS = /* @__PURE__ */ new Set([
  "use",
  "string",
  "number",
  "boolean",
  "return",
  "function",
  "var",
  "const",
  "native",
  "export"
]);
class WordReader extends Bean {
  read(c) {
    if (!isWordStart(c.current)) {
      return;
    }
    let value = c.current;
    const lin1 = c.lin;
    const col1 = c.col;
    let lin2 = c.lin;
    let col2 = c.col + 1;
    c.consume();
    while (isWordMiddle(c.current)) {
      value += c.current;
      lin2 = c.lin;
      col2 = c.col + 1;
      c.consume();
    }
    return KEYWORDS.has(value) ? new Keyword(value, { lin1, col1, lin2, col2 }) : new Identifier(value, { lin1, col1, lin2, col2 });
  }
}
export {
  KEYWORDS,
  WordReader
};
