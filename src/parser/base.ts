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
 * @file Base type definitions.
 */

export abstract class Base {
  abstract toString(): string;

  static toString(token: Base | undefined) {
    return token?.toString() ?? 'nothing';
  }

  abstract debugPrint(): string;

  static debugPrintList(list: Base[]) {
    let s = '';
    for (const item of list) {
      if (s) {
        s += '\n';
      }
      s += item.debugPrint();
    }
    return s;
  }
}

export type Pos = {
  lin1: number;
  col1: number;
  lin2: number;
  col2: number;
};

export interface WithPos {
  pos: Pos;
}

export const WARNING = 1;
export const ERROR = 2;

export type ParseError1 = {
  level: typeof WARNING | typeof ERROR;
  pos?: Pos;
  message: string;
};

export class ParseError extends Error {
  lin1: number;
  col1: number;
  lin2: number;
  col2: number;

  constructor(message: string, lin1: number, col1: number, lin2?: number, col2?: number) {
    super(`[${lin1}:${col1} - ${lin2}:${col2}] ${message}`);
    this.lin1 = lin1;
    this.col1 = col1;
    this.lin2 = lin2 ?? lin1;
    this.col2 = col2 ?? col1;
  }
}
