import { S as Statement } from "./statement-1pRbB8Zx.js";
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
