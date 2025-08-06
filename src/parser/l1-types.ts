/**
 * Capy project.
 * Copyright (c) 2025 - Filipe Vilela Soares
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @file Type definitions for layer-1 parser.
 */

import { Base, ParseError, Pos, WithPos } from './base';
import { indent } from './util';

/**
 * Base class for L1 objects.
 */
export abstract class L1Base extends Base {
  /**
   * Method to enforce TypeScript nominal typing.
   */
  isL1Base() {
    return true;
  }
}

export abstract class L1BasePos extends L1Base implements WithPos {
  pos: Pos;

  constructor(pos: Pos) {
    super();
    this.pos = pos;
  }

  debugPrint(out: string[], prefix: string): void {
    out.push(`[${this.constructor.name} ${this.pos.lin1}:${this.pos.col1}-${this.pos.lin2}:${this.pos.col2}]:\n`);
  }
}

export class L1Word extends L1BasePos {
  value: string;

  constructor(value: string, pos: Pos) {
    super(pos);
    this.value = value;
  }

  toString(): string {
    return `word "${this.value}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  value: ${this.value}`);
  }
}

export class L1Operator extends L1BasePos {
  value: string;

  constructor(value: string, pos: Pos) {
    super(pos);
    this.value = value;
  }

  toString(): string {
    return `operator "${this.value}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  value: ${this.value}`);
  }
}

export class L1Bracket extends L1BasePos {
  start: string;
  end: string;
  tokenList: L1BasePos[];

  constructor(start: string, end: string, tokenList: L1BasePos[], pos: Pos) {
    super(pos);
    this.start = start;
    this.end = end;
    this.tokenList = tokenList;
  }

  toString(): string {
    return `bracket "${this.start}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  start: ${this.start}`);
    out.push(`${prefix}  tokenList:`);
    this.tokenList.forEach((val) => val.debugPrint(out, `${prefix}    `));
  }
}

export class L1Number extends L1BasePos {
  value: string;

  constructor(value: string, pos: Pos) {
    super(pos);
    this.value = value;
  }

  toString(): string {
    return `number "${this.value}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  value: ${this.value}`);
  }
}

export class L1String extends L1BasePos {
  value: string;

  constructor(value: string, pos: Pos) {
    super(pos);
    this.value = value;
  }

  getName(): string {
    return 'L1String';
  }

  toString(): string {
    return `string "${this.value}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  value: ${this.value}`);
  }
}

export type L1ParseResult = {
  list: L1BasePos[];
  errors: ParseError[];
};
