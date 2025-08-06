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

export type Pos = {
  lin1: number;
  col1: number;
  lin2: number;
  col2: number;
};

export function combinePos(a: Pos, b: Pos) {
  if (a === INTERNAL || b === INTERNAL) {
    return INTERNAL;
  }
  let lin1, col1, lin2, col2;
  if (a.lin1 < b.lin1) {
    lin1 = a.lin1;
    col1 = a.col1;
  } else if (b.lin1 < a.lin1) {
    lin1 = b.lin1;
    col1 = b.col1;
  } else {
    lin1 = a.lin1;
    col1 = Math.min(a.col1, b.col1);
  }
  if (a.lin2 > b.lin2) {
    lin2 = a.lin2;
    col2 = a.col2;
  } else if (b.lin2 > a.lin2) {
    lin2 = b.lin2;
    col2 = b.col2;
  } else {
    lin2 = a.lin2;
    col2 = Math.max(a.col2, b.col2);
  }
  return { lin1, col1, lin2, col2 };
}

export function fallbackPos(t: Pos | undefined, tBefore: Pos) {
  return {
    lin1: t?.lin1 ?? tBefore.lin2,
    col1: t?.col1 ?? tBefore.col2,
    lin2: t?.lin2 ?? tBefore.lin2,
    col2: t?.col2 ?? tBefore.col2,
  };
}

export const INTERNAL = Object.freeze<Pos>({
  lin1: 0,
  col1: 0,
  lin2: 0,
  col2: 0,
});

export abstract class Base {
  pos: Pos;

  constructor(pos: Pos) {
    this.pos = pos;
  }

  abstract toString(): string;

  static toString(token: Base | undefined) {
    return token?.toString() ?? 'nothing';
  }

  debugPrint(out: string[], prefix: string) {
    if (this.pos === INTERNAL) {
      out.push(`${this.constructor.name}:\n`);
    } else {
      out.push(`${this.constructor.name}: # ${this.pos.lin1}:${this.pos.col1}-${this.pos.lin2}:${this.pos.col2}\n`);
    }
  }
}

export const WARNING = 1;
export const ERROR = 2;

export type ParseError = {
  level: typeof WARNING | typeof ERROR;
  pos?: Pos;
  message: string;
};
