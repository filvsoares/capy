import { S as Statement } from "./statement-eXuGN2Ox.js";
class ReturnStatement extends Statement {
  constructor(expr, pos) {
    super(pos);
    this.expr = expr;
  }
  toString() {
    return `return statement`;
  }
  debugPrint(out, prefix) {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  expr: `);
    this.expr ? this.expr.debugPrint(out, `${prefix}  `) : out.push(` (void)
`);
  }
}
export {
  ReturnStatement as R
};
