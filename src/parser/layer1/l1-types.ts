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

import { Component, declareComponentKey } from '@/util/components';
import { Base, ParseError, Pos } from '../base';

export interface L1ParseContext {
  lin: number;
  col: number;
  current: string;
  errors: ParseError[];
  consume(): void;
  read(): L1Base | true | undefined;
}

export type L1ParserReader = {
  read: (c: L1ParseContext) => L1Base | true | undefined;
};

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
