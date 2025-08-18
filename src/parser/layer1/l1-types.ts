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

import { Base, ParseError } from '@/parser/base';

export class L1ParseContext {
  s: string;
  pos: number = 0;
  lin: number = 1;
  col: number = 1;
  current: string;
  errors: ParseError[] = [];

  constructor(s: string) {
    this.s = s;
    this.current = s[0];
  }

  consume(): void {
    if (!this.current) {
      return;
    }
    this.pos++;
    if (this.pos >= this.s.length) {
      this.current = '';
      return;
    }
    if (this.current === '\n') {
      this.col = 1;
      this.lin++;
    } else {
      this.col++;
    }
    this.current = this.s[this.pos];
  }
}

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

export type L1ParseResult = {
  list: L1Base[];
  errors: ParseError[];
};
