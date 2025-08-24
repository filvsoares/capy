import { INTERNAL, Pos } from '@/base';
import { L3Expression } from '@/beans/expression/l3-expression';
import { L3Base } from '@/beans/l3-parser/l3-base';
import { L3CallableType } from '@/beans/method/l3-callable-type';
import { L3Type } from '@/beans/type/l3-type';
import { Runner } from '@/runner';
import { L3TypedSymbol } from '../type/l3-simple-type';

export abstract class L3VariableReference extends L3Expression {
  get isReference(): boolean {
    return true;
  }
}

export class L3ModuleVariableReference extends L3VariableReference {
  module: string;
  name: string;

  constructor(module: string, name: string, type: L3Type, pos: Pos) {
    super(type, pos);
    this.module = module;
    this.name = name;
  }

  toString(): string {
    return `identifier "${this.name}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  module: ${this.module}\n`);
    out.push(`${prefix}  name: ${this.name}\n`);
  }
}

export class L3LocalVariableReference extends L3VariableReference {
  index: number;
  name: string;

  constructor(index: number, name: string, type: L3Type, pos: Pos) {
    super(type, pos);
    this.index = index;
    this.name = name;
  }

  toString(): string {
    return `identifier "${this.name}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  name: ${this.name}\n`);
    out.push(`${prefix}  index: ${this.index}\n`);
  }
}

export class L3Variable extends L3TypedSymbol {
  initExpr: L3Expression | null;

  constructor(name: string, type: L3Type, initExpr: L3Expression | null, pos: Pos) {
    super(name, type, pos);
    this.initExpr = initExpr;
  }

  toString(): string {
    return 'variable';
  }
  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  initExpr: `);
    this.initExpr ? this.initExpr.debugPrint(out, `${prefix}  `) : out.push(' (none)\n');
  }
}

export abstract class L3Statement extends L3Base {
  constructor(pos: Pos) {
    super(pos);
  }
}

export class L3ExpressionStatement extends L3Statement {
  expr: L3Expression;

  constructor(expr: L3Expression, pos: Pos) {
    super(pos);
    this.expr = expr;
  }

  toString(): string {
    return 'expression';
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  expr: `);
    this.expr.debugPrint(out, `${prefix}  `);
  }
}

export class L3ReturnStatement extends L3Statement {
  expr: L3Expression | null;

  constructor(expr: L3Expression | null, pos: Pos) {
    super(pos);
    this.expr = expr;
  }

  toString(): string {
    return 'return';
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  expr: `);
    this.expr ? this.expr.debugPrint(out, `${prefix}  `) : out.push('(void)\n');
  }
}

export class L3LocalVariable extends L3Base {
  name: string;
  type: L3Type;

  constructor(name: string, type: L3Type, pos: Pos) {
    super(pos);
    this.name = name;
    this.type = type;
  }

  toString(): string {
    return 'local var';
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  name: ${this.name}\n`);
    out.push(`${prefix}  type: `);
    this.type.debugPrint(out, `${prefix}  `);
  }
}

export class L3ArgumentVariable extends L3LocalVariable {
  index: number;

  constructor(index: number, name: string, type: L3Type, pos: Pos) {
    super(name, type, pos);
    this.index = index;
  }

  toString(): string {
    return 'argument dependency';
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  index: ${this.index}\n`);
  }
}

export abstract class L3Method extends L3TypedSymbol<L3CallableType> {}

export class L3UnresolvedMethod extends L3Method {
  toString(): string {
    return 'unresolved method';
  }
}

export class L3CapyMethod extends L3Method {
  stack: L3LocalVariable[];
  statementList: L3StatementList;

  constructor(name: string, type: L3CallableType, deps: L3LocalVariable[], statementList: L3StatementList, pos: Pos) {
    super(name, type, pos);
    this.stack = deps;
    this.statementList = statementList;
  }

  toString(): string {
    return 'method';
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  stack:\n`);
    this.stack.forEach((val) => {
      out.push(`${prefix}    - `);
      val.debugPrint(out, `${prefix}      `);
    });
    out.push(`${prefix}  statementList: `);
    this.statementList.debugPrint(out, `${prefix}  `);
  }
}

export class L3StatementList extends L3Base {
  list: L3Statement[];

  constructor(list: L3Statement[], pos: Pos) {
    super(pos);
    this.list = list;
  }

  toString(): string {
    return 'statement list';
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);

    out.push(`${prefix}  list:\n`);
    this.list.forEach((val) => {
      out.push(`${prefix}    - `);
      val.debugPrint(out, `${prefix}      `);
    });
  }
}

export class L3LibraryMethod extends L3Method {
  callback: (args: any[], runner: Runner) => any;

  constructor(name: string, type: L3CallableType, callback: (args: any[], runner: Runner) => any) {
    super(name, type, INTERNAL);
    this.callback = callback;
  }

  toString(): string {
    return 'method';
  }
}
