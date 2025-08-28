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
 * @file Type definitions for layer-3 parser.
 */

import { INTERNAL, Pos } from '@/base';
import { Type } from '@/modules/parser/type/type';

export type PrimitiveType = 'string' | 'number' | 'boolean' | 'void';

export class SimpleType extends Type {
  primitive: PrimitiveType;

  constructor(primitive: PrimitiveType, pos: Pos) {
    super(pos);
    this.primitive = primitive;
  }

  toString(): string {
    return `${this.primitive}`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  primitive: ${this.primitive}\n`);
  }
}

export const STRING = new SimpleType('string', INTERNAL);
export const NUMBER = new SimpleType('number', INTERNAL);
export const BOOLEAN = new SimpleType('boolean', INTERNAL);
export const VOID = new SimpleType('void', INTERNAL);

export function isStringType(type: Type) {
  return type instanceof SimpleType && type.primitive === 'string';
}

export function isVoidType(type: Type) {
  return type instanceof SimpleType && type.primitive === 'void';
}
