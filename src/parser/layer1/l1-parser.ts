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
 * @file Layer-1 parser implementation.
 */

import { getComponents } from '@/util/components';
import { ERROR, ParseError } from '../base';
import { L1Base, L1ParseContext, L1ParseResult } from './l1-types';
import { l1BracketReader } from './l1-bracket';
import { l1NumberReader } from './l1-number';
import { l1OperatorReader } from './l1-operator';
import { l1SeparatorReader } from './l1-separator';
import { l1StringReader } from './l1-string';
import { l1WordReader } from './l1-word';
import { l1WhitespaceReader } from './l1-whitespace';

const readers = [
  l1BracketReader,
  l1NumberReader,
  l1OperatorReader,
  l1WordReader,
  l1SeparatorReader,
  l1StringReader,
  l1WhitespaceReader,
];

class L1ParseContextImpl implements L1ParseContext {
  s: string;
  pos: number = 0;
  lin: number = 0;
  col: number = 0;
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

  read(): L1Base | true | undefined {
    for (const reader of readers) {
      const item = reader.read(this);
      if (item) {
        return item;
      }
    }
  }
}

export function layer1Parse(s: string): L1ParseResult {
  const c = new L1ParseContextImpl(s);

  const list: L1Base[] = [];

  while (c.current) {
    let item = c.read();
    if (!item) {
      c.errors.push({
        level: ERROR,
        pos: { lin1: c.lin, col1: c.col, lin2: c.lin, col2: c.col + 1 },
        message: `Unexpected char "${c.current}"`,
      });
      c.consume();
    }
    if (item instanceof L1Base) {
      list.push(item);
    }
  }
  return { list, errors: c.errors };
}
