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
import { L3Base } from '@/beans/l3-parser/l3-base';
import { L3PrimitiveType, L3Type } from '@/beans/type/l3-type';

export class L3SimpleType extends L3Type {
  primitive: L3PrimitiveType;

  constructor(primitive: L3PrimitiveType, pos: Pos) {
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

export const STRING = new L3SimpleType('string', INTERNAL);
export const NUMBER = new L3SimpleType('number', INTERNAL);
export const BOOLEAN = new L3SimpleType('boolean', INTERNAL);
export const VOID = new L3SimpleType('void', INTERNAL);

export function isStringType(type: L3Type) {
  return type instanceof L3SimpleType && type.primitive === 'string';
}

export function isVoidType(type: L3Type) {
  return type instanceof L3SimpleType && type.primitive === 'void';
}

export abstract class L3TypedSymbol<T extends L3Type = L3Type> extends L3Base {
  name: string;
  type: T;

  constructor(name: string, type: T, pos: Pos) {
    super(pos);
    this.name = name;
    this.type = type;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  name: ${this.name}\n`);
    out.push(`${prefix}  type: `);
    this.type.debugPrint(out, `${prefix}  `);
  }
}
