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

import { Base, ParseError1, Pos, WithPos } from './base';
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

  debugPrint(): string {
    return `[L1Word]\n  value: ${this.value}`;
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

  debugPrint(): string {
    return `[L1Operator]\n  value:${this.value}`;
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

  debugPrint(): string {
    return `[L1Bracket]\n  start: ${this.start}\n  list:\n${this.tokenList
      .map((item) => '    - ' + indent(item.debugPrint(), 6))
      .join('\n')}`;
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

  debugPrint(): string {
    return `[L1Number]\n  value: ${this.value}`;
  }
}

export class L1String extends L1BasePos {
  value: string;

  constructor(value: string, pos: Pos) {
    super(pos);
    this.value = value;
  }

  toString(): string {
    return `string "${this.value}"`;
  }

  debugPrint(): string {
    return `[L1String]\n  value: ${this.value}`;
  }
}

export type L1ParseResult = {
  list: L1BasePos[];
  errors: ParseError1[];
};
