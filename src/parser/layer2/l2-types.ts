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
 * @file Type definitions for layer-2 parser.
 */

import { Base, ParseError, Pos } from '../base';
import { L1Base } from '../layer1/l1-types';

export abstract class L2Base extends Base {
  isL2() {
    return true;
  }
}

export class L2ParseContext {
  pos: number = 0;
  list: L1Base[];
  current: L1Base | undefined;
  errors: ParseError[] = [];

  constructor(list: L1Base[]) {
    this.list = list;
    this.current = list[0];
  }

  consume(): void {
    if (!this.current) {
      return;
    }
    this.current = this.list[++this.pos];
  }
}

export const INVALID = 1;
export type Invalid = typeof INVALID;
export type ReadResult<T> = T | Invalid | undefined;

export type L2ParseResult<T extends L2Base = L2Base> = {
  list: T[];
  errors: ParseError[];
};
