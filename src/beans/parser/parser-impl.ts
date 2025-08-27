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
import { ParserContext } from '@/beans/parser/parser-context';
import { Symbol } from '@/beans/parser/symbol';
import { ToplevelReader } from '@/beans/parser/toplevel-reader';
import { Tokenizer } from '@/beans/tokenizer/tokenizer';
import { Bean } from '@/util/beans';
import { Parser, ParserResult } from './parser';

export class ParserImpl extends Bean implements Parser {
  constructor(private tokenizer: Tokenizer, private toplevelReaders: ToplevelReader[]) {
    super();
  }

  parse(srcModules: { [moduleName: string]: string }): ParserResult {
    const modules: { [moduleName: string]: { [symbolName: string]: Symbol } } = {};

    const errors: ParseError[] = [];

    for (const moduleName in srcModules) {
      const { tokenList, errors: tokenizerErrors } = this.tokenizer.process(srcModules[moduleName]);
      errors.push(...tokenizerErrors);
      const c = new ParserContext(modules, moduleName, tokenList, errors);
      modules[moduleName] = this.readToplevelList(c);
    }

    return { modules, errors };
  }

  private readToplevel(c: ParserContext) {
    for (const reader of this.toplevelReaders) {
      const result = reader.read(c);
      if (result) {
        return result;
      }
    }
    const t = c.current;
    c.addError({
      level: ERROR,
      message: `Unexpected ${t}`,
      pos: t!.pos ?? INTERNAL,
    });
    c.consume();
    return INVALID;
  }

  private readToplevelList(c: ParserContext) {
    const symbols: { [name: string]: Symbol } = {};
    while (c.current) {
      const val = this.readToplevel(c);
      if (val instanceof Symbol) {
        if (symbols[val.name]) {
          c.addError({ level: ERROR, message: `Symbol "${val.name}" already defined`, pos: val.pos });
        } else {
          symbols[val.name] = val;
        }
      }
    }
    return symbols;
  }

  findSymbol(c: ParserContext, symbolName: string): Symbol | undefined {
    return c.modules[c.moduleName][symbolName];
  }
}
