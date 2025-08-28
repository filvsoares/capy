import { Pos } from '@/base';
import { Expression } from '@/modules/parser/expression/expression';
import { Symbol } from '@/modules/parser/parser/symbol';
import { Type } from '@/modules/parser/type/type';

export class GlobalVariable extends Symbol {
  type: Type;
  initExpr: Expression | null;

  constructor(module: string, name: string, type: Type, initExpr: Expression | null, pos: Pos) {
    super(module, name, pos);
    this.type = type;
    this.initExpr = initExpr;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  name: ${this.name}\n`);
    out.push(`${prefix}  type: `);
    this.type.debugPrint(out, `${prefix}  `);
    out.push(`${prefix}  initExpr: `);
    this.initExpr ? this.initExpr.debugPrint(out, `${prefix}  `) : out.push('(none)\n');
  }

  toString(): string {
    return `variable "${this.name}"`;
  }
}
