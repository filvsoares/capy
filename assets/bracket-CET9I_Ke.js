import { T as Token } from "./token-C93Hpdaz.js";
class Bracket extends Token {
  constructor(start, end, tokenList, pos) {
    super(pos);
    this.start = start;
    this.end = end;
    this.tokenList = tokenList;
  }
  toString() {
    return `bracket "${this.start}"`;
  }
  debugPrint(out, prefix) {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  start: ${this.start}
`);
    out.push(`${prefix}  tokenList:
`);
    this.tokenList.forEach((val) => {
      out.push(`${prefix}    - `);
      val.debugPrint(out, `${prefix}      `);
    });
  }
  static matches(token, value) {
    return token instanceof Bracket && (value === void 0 || token.start === value);
  }
}
export {
  Bracket as B
};
