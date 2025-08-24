import { INTERNAL, Pos } from '@/base';
import { L3Expression } from '@/beans/expression/expression';
import { L3Base } from '@/beans/l3-parser/l3-base';
import { L3CallableType } from '@/beans/method/l3-callable-type';
import { L3StatementList } from '@/beans/statement/l3-statement-list';
import { L3Type } from '@/beans/type/l3-type';
import { Runner } from '@/runner';
import { L3TypedSymbol } from '../type/simple-type';

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
