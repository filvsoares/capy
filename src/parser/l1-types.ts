import { Base } from './base';
import { indent } from './util';

export abstract class L1Base extends Base {
  isL1() {
    return true;
  }
}

export class L1Word extends L1Base {
  value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  toString(): string {
    return `word "${this.value}"`;
  }

  debugPrint(): string {
    return `[L1Word]\n  value: ${this.value}`;
  }
}

export class L1Operator extends L1Base {
  value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  toString(): string {
    return `operator "${this.value}"`;
  }

  debugPrint(): string {
    return `[L1Operator]\n  value:${this.value}`;
  }
}

export class L1Bracket extends L1Base {
  start: string;
  end: string;
  tokenList: L1Base[];

  constructor(start: string, end: string, tokenList: L1Base[]) {
    super();
    this.start = start;
    this.end = end;
    this.tokenList = tokenList;
  }

  toString(): string {
    return `bracket "${this.start}"`;
  }

  debugPrint(): string {
    return `[L1Bracket]\n  start: ${this.start}\n  list:\n${this.tokenList
      .map((item) => '    - ' + indent(item.debugPrint(), 6))
      .join('\n')}`;
  }
}

export class L1Number extends L1Base {
  value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  toString(): string {
    return `number "${this.value}"`;
  }

  debugPrint(): string {
    return `[L1Number]\n  value: ${this.value}`;
  }
}

export class L1String extends L1Base {
  value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  toString(): string {
    return `string "${this.value}"`;
  }

  debugPrint(): string {
    return `[L1String]\n  value: ${this.value}`;
  }
}
