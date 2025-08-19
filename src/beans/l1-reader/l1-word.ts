import { Pos } from '@/beans/base';
import { L1Base, L1ParseContext } from '@/beans/l1-parser/l1-types';
import { Bean } from '@/util/beans';
import { L1Reader } from '../l1-parser/l1-reader';

export const KEYWORDS = new Set(['use', 'string', 'number', 'boolean', 'return', 'function', 'var', 'const']);

export class L1Keyword extends L1Base {
  name: string;

  constructor(name: string, pos: Pos) {
    super(pos);
    this.name = name;
  }

  toString(): string {
    return `keyword "${this.name}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  name: ${this.name}\n`);
  }

  static matches(token: any, value?: string): token is L1Keyword {
    return token instanceof L1Keyword && (value === undefined || token.name === value);
  }
}

export class L1Identifier extends L1Base {
  name: string;

  constructor(name: string, pos: Pos) {
    super(pos);
    this.name = name;
  }

  toString(): string {
    return `identifier "${this.name}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  name: ${this.name}\n`);
  }

  static matches(token: any, value?: string): token is L1Identifier {
    return token instanceof L1Identifier && (value === undefined || token.name === value);
  }
}
