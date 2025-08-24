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

import { ERROR } from '@/base';
import { L1Base } from '@/beans/l1-parser/l1-base';
import { Bean } from '@/util/beans';
import { INVALID, L2ParseContext, ReadResult } from './l2-base';
import { L2Parser, L2ParseResult, L2Toplevel } from './l2-parser';
import { L2ToplevelReader } from './l2-toplevel-reader';

export class L2ParserImpl extends Bean implements L2Parser {
  constructor(private toplevelReaders: L2ToplevelReader[]) {
    super();
  }

  parse(list: L1Base[]): L2ParseResult {
    const c = new L2ParseContext(list);
    const outList = this.readToplevelList(c);
    return { list: outList, errors: c.errors };
  }

  private readToplevel(c: L2ParseContext): ReadResult<L2Toplevel> {
    for (const reader of this.toplevelReaders) {
      const result = reader.read(c);
      if (result) {
        return result;
      }
    }
  }

  readToplevelList(c: L2ParseContext): L2Toplevel[] {
    const outList: L2Toplevel[] = [];
    let error = false;
    while (c.current) {
      const val = this.readToplevel(c);
      if (val === INVALID) {
        error = true;
        continue;
      }
      if (!val) {
        if (!error) {
          error = true;
          const t = c.current;
          c.errors.push({
            level: ERROR,
            message: `Unexpected ${t}`,
            pos: {
              lin1: t.pos.lin1,
              col1: t.pos.col1,
              lin2: t.pos.lin2,
              col2: t.pos.col2,
            },
          });
        }
        c.consume();
        continue;
      }
      error = false;
      outList.push(val);
    }
    return outList;
  }
}
