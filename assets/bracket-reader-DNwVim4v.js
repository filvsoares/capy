import { B as Bean, E as ERROR } from "./index-s97_hl8g.js";
import { B as Bracket } from "./bracket-CL1IELux.js";
import { T as Token } from "./token-YsknnliN.js";
function isBracketStart(c) {
  return c === "(" || c === "[" || c === "{";
}
function isBracketEnd(c) {
  return c === ")" || c === "]" || c === "}";
}
class BracketReader extends Bean {
  constructor(tokenizer) {
    super();
    this.tokenizer = tokenizer;
  }
  read(c) {
    if (!isBracketStart(c.current)) {
      return;
    }
    const bracketStart = c.current;
    const expectedBracketEnd = bracketStart === "(" ? ")" : bracketStart === "[" ? "]" : bracketStart === "{" ? "}" : "";
    const lin1 = c.lin;
    const col1 = c.col;
    c.consume();
    const list = [];
    while (true) {
      if (!c.current) {
        c.addError({
          level: ERROR,
          pos: { lin1: c.lin, col1: c.col, lin2: c.lin, col2: c.col },
          message: `Expected "${expectedBracketEnd}"`
        });
        break;
      }
      if (isBracketEnd(c.current)) {
        break;
      }
      const item = this.tokenizer.readToken(c);
      if (item instanceof Token) {
        list.push(item);
      }
    }
    const lin2 = c.lin;
    const col2 = c.col + 1;
    if (c.current) {
      if (c.current !== expectedBracketEnd) {
        c.addError({
          level: ERROR,
          pos: { lin1: c.lin, col1: c.col, lin2: c.lin, col2: c.col + 1 },
          message: `Expected "${expectedBracketEnd}" but found ${c.current}`
        });
      }
      c.consume();
    }
    return new Bracket(bracketStart, expectedBracketEnd, list, { lin1, col1, lin2, col2 });
  }
}
export {
  BracketReader
};
