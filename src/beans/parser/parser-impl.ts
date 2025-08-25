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

import { ERROR, INTERNAL, INVALID, ParseError } from '@/base';
import { Module } from '@/beans/parser/module';
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

  parse(moduleName: string, s: string, modules: Module[]): ParserResult {
    const moduleMap: { [name: string]: Module } = {};
    for (const module of modules) {
      moduleMap[module.name] = module;
    }

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

    const mySymbols: { [name: string]: Toplevel } = {};
    const allSymbols: { [name: string]: { module: string; symbol: Toplevel }[] } = {};

    const addToMySymbols: ParserContext['addToMySymbols'] = (symbol) => {
      if (mySymbols[symbol.name]) {
        return false;
      }
      mySymbols[symbol.name] = symbol;
      addToAllSymbols(moduleName, symbol);
      return true;
    };

    const addToAllSymbols: ParserContext['addToAllSymbols'] = (module, symbol) => {
      let list = allSymbols[symbol.name];
      if (!list) {
        allSymbols[symbol.name] = list = [];
      }
      list.push({ module, symbol });
    };

    const parserContext: ParserContext = {
      addError: (e) => {
        errors.push(e);
      },
      current: () => currentToken,
      consume: () => {
        currentToken = this.readToken(tokenizerContext);
      },
      getModule: (name: string) => moduleMap[name],
      addToMySymbols,
      addToAllSymbols,
    };

    this.readToplevelList(parserContext);

    return {
      symbols: Object.values(mySymbols),
      errors,
    };
  }

  private readToplevel(c: ParserContext) {
    for (const reader of this.toplevelReaders) {
      const result = reader.read(c);
      if (result) {
        return result;
      }
    }
  }

  readToplevelList(c: ParserContext) {
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
    }
  }
}
