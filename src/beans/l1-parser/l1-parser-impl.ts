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

import { ERROR } from '@/base';
import { Bean } from '@/util/beans';
import { L1Parser } from './l1-parser';
import { L1Reader } from './l1-reader';
import { L1Base, L1ParseContext, L1ParseResult } from './l1-types';

export class L1ParserImpl extends Bean implements L1Parser {
  readers: L1Reader[];

  constructor([readers]: [L1Reader[]]) {
    super();
    this.readers = readers;
  }

  read(c: L1ParseContext) {
    for (const reader of this.readers) {
      const item = reader.read(c);
      if (item) {
        return item;
      }
    }
  }
  parse(s: string): L1ParseResult {
    const c = new L1ParseContext(s);

    const list: L1Base[] = [];

    while (c.current) {
      const item = this.read(c);
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
}
