import { Base } from './base';
import { L2Base } from './l2-types';
import { indent } from './util';

export abstract class L3Base extends Base {
  isL3() {
    return true;
  }
}
export class L3String extends L3Base {
  value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  toString(): string {
    return `string`;
  }

  debugPrint(): string {
    return `[L3String]\n  value: ${this.value}`;
  }
}

export class L3Number extends L3Base {
  value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  toString(): string {
    return `number`;
  }

  debugPrint(): string {
    return `[L3Number]\n  value: ${this.value}`;
  }
}

export class L3Identifier extends L3Base {
  value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  toString(): string {
    return `identifier "${this.value}"`;
  }

  debugPrint(): string {
    return `[L3Identifier]\n  value: ${this.value}`;
  }
}

export type L3Type = 'string' | 'number';

export class L3Definition extends L3Base {
  toString(): string {
    return '';
  }
  debugPrint(): string {
    return '';
  }
}

export class L3Variable extends L3Definition {
  type: L3Type;

  constructor(type: L3Type) {
    super();
    this.type = type;
  }

  debugPrint(): string {
    return `[L3Variable]\n  type: ${this.type}`;
  }
}

export abstract class L3Statement extends L3Base {}

export abstract class L3Object extends L3Base {}

export abstract class L3OperationStep extends L3Base {}

export class L3Operation extends L3Statement {
  operand: L3Object;
  steps: L3OperationStep[];

  constructor(operand: L3Object, steps: L3OperationStep[]) {
    super();
    this.operand = operand;
    this.steps = steps;
  }

  toString(): string {
    return 'operation';
  }

  debugPrint(): string {
    return `[L3Operation]`;
  }
}

export class L3Method extends L3Definition {
  returnType: L3Type | undefined;
  statements: L3Base[];
  constructor(returnType: L3Type | undefined, statements: L3Base[]) {
    super();
    this.returnType = returnType;
    this.statements = statements;
  }
  debugPrint(): string {
    return `[L3Method]\n  returnType: ${this.returnType ?? '(void)'}\n  statements:\n${this.statements.map(
      (item) => `    - ${indent(item.debugPrint(), 6)}`
    )}`;
  }
}

export class Runnable {
  symbols: { [name: string]: L3Definition };
  constructor(symbols: { [name: string]: L3Definition }) {
    this.symbols = symbols;
  }

  debugPrint() {
    return `[Runnable]\n  symbols:\n${Object.entries(this.symbols)
      .map(([k, v]) => `    ${k}: ${indent(v.debugPrint(), 4)}`)
      .join('\n')}`;
  }
}

export type L3Library = {
  exported: { [name: string]: L3Definition };
};
