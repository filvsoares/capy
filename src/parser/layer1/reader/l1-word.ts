import { Pos } from '@/parser/base';
import { L1Base, L1ParseContext } from '@/parser/layer1/l1-types';
import { Bean } from '@/util/beans';
import { L1Reader } from './_bean-interfaces';

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

function isWordStart(c: string) {
  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_';
}

function isWordMiddle(c: string) {
  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') || c === '_';
}

export class L1WordReader extends Bean implements L1Reader {
  read(c: L1ParseContext): L1Keyword | L1Identifier | undefined {
    if (!isWordStart(c.current)) {
      return;
    }
    let value = c.current;
    const lin1 = c.lin;
    const col1 = c.col;
    let lin2 = c.lin;
    let col2 = c.col + 1;
    c.consume();

    while (isWordMiddle(c.current)) {
      value += c.current;
      lin2 = c.lin;
      col2 = c.col + 1;
      c.consume();
    }
    return KEYWORDS.has(value)
      ? new L1Keyword(value, { lin1, col1, lin2, col2 })
      : new L1Identifier(value, { lin1, col1, lin2, col2 });
  }
}
