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

import { ERROR, INTERNAL, INVALID, Invalid, ParseError } from '@/base';
import { Toplevel } from '@/beans/parser/toplevel';
import { ToplevelReader } from '@/beans/parser/toplevel-reader';
import { Bean } from '@/util/beans';
import { Parser, ParserContext, ParserResult, TokenizerContext } from './parser';
import { TokenReader } from './token-reader';

export class ParserImpl extends Bean implements Parser {
  constructor(private l1Readers: TokenReader[], private toplevelReaders: ToplevelReader[]) {
    super();
  }

  readToken(c: TokenizerContext) {
    while (true) {
      for (const reader of this.l1Readers) {
        const item = reader.read(c);
        if (item === true) {
          continue;
        }
        if (item) {
          return item;
        }
      }
      return;
    }
  }

  parse(s: string): ParserResult {
    const errors: ParseError[] = [];

    let pos = 0;
    let lin = 1;
    let col = 1;
    let currentChar = s[0];

    const tokenizerContext: TokenizerContext = {
      lin: () => lin,
      col: () => col,
      addError: (e) => {
        errors.push(e);
      },
      current: () => currentChar,
      consume: () => {
        if (!currentChar) {
          return;
        }
        pos++;
        if (pos >= s.length) {
          currentChar = '';
          return;
        }
        if (currentChar === '\n') {
          col = 1;
          lin++;
        } else {
          col++;
        }
        currentChar = s[pos];
      },
    };

    let currentToken = this.readToken(tokenizerContext);

    const parserContext: ParserContext = {
      addError: (e) => {
        errors.push(e);
      },
      current: () => currentToken,
      consume: () => {
        currentToken = this.readToken(tokenizerContext);
      },
    };

    return {
      list: this.readToplevelList(parserContext),
      errors,
    };
  }

  private readToplevel(c: ParserContext): Toplevel | Invalid | undefined {
    for (const reader of this.toplevelReaders) {
      const result = reader.read(c);
      if (result) {
        return result;
      }
    }
  }

  readToplevelList(c: ParserContext): Toplevel[] {
    const outList: Toplevel[] = [];
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
          const t = c.current();
          c.addError({
            level: ERROR,
            message: `Unexpected ${t}`,
            pos: t?.pos ?? INTERNAL,
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
