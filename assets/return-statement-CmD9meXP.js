import { S as Statement } from "./statement-D1Z7utbn.js";
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
