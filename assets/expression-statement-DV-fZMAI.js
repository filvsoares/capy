import { S as Statement } from "./statement-D1Z7utbn.js";
class ExpressionStatement extends Statement {
  constructor(expr, pos) {
    super(pos);
    this.expr = expr;
  }
  toString() {
    return `expression statement`;
  }
  debugPrint(out, prefix) {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  expr: `);
    this.expr.debugPrint(out, `${prefix}  `);
  }
}
export {
  ExpressionStatement as E
};
