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
 * along with c.program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @file Layer-2 parser implementation.
 */

import { L1Base } from '../l1-parser/l1-types';
import { L2Parser } from './l2-parser';
import { L2ToplevelReader } from './l2-toplevel-reader';
import { L2ParseContext, L2ParseResult } from './l2-types';

export class L2ParserImpl implements L2Parser {
  toplevelReaders: L2ToplevelReader[];

  constructor([toplevelReaders]: [L2ToplevelReader[]]) {
    this.toplevelReaders = toplevelReaders;
  }

  parse(list: L1Base[]): L2ParseResult {
    const c = new L2ParseContext(list);
    const outList = this.toplevelReaders[0].readList(c);
    return { list: outList, errors: c.errors };
  }
}
