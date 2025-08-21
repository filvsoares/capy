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
 * @file Layer-3 parser implementation.
 */

import { ERROR, ParseError } from '../../base';

import { L3Module, L3Symbol } from '../type/l3-types';

import { Bean } from '@/util/beans';
import { L2Definition } from '../definition/l2-definition';
import { L2Base } from '../l2-parser/l2-base';
import { L3ParseContext, L3Parser, L3ParseResult } from './l3-parser';
import { L3ToplevelProcessor } from './l3-toplevel-processor';

class L3ParseContextImpl implements L3ParseContext {
  errors: ParseError[] = [];
  mySymbols: { [name: string]: L3Symbol } = {};
  modules: { [name: string]: L3Module } = {};
  allSymbols: { [name: string]: { module: string; symbol: L3Symbol }[] } = {};
  deferredTasks: (() => void)[] = [];
  moduleName: string = '';

  addToMySymbols(symbol: L3Symbol) {
    if (this.mySymbols[symbol.name]) {
      return false;
    }
    this.mySymbols[symbol.name] = symbol;
    this.addToAllSymbols(this.moduleName, symbol);
    return true;
  }

  replaceInMySymbols(symbol: L3Symbol) {
    if (!this.mySymbols[symbol.name]) {
      return false;
    }
    this.mySymbols[symbol.name] = symbol;
  }

  addToAllSymbols(module: string, symbol: L3Symbol) {
    let list = this.allSymbols[symbol.name];
    if (!list) {
      this.allSymbols[symbol.name] = list = [];
    }
    list.push({ module, symbol });
  }
}

export class L3ParserImpl extends Bean implements L3Parser {
  constructor(private l3ToplevelProcessors: L3ToplevelProcessor[]) {
    super();
  }

  parse(moduleName: string, list: L2Base[], modules: L3Module[]): L3ParseResult {
    const c = new L3ParseContextImpl();

    c.moduleName = moduleName;
    for (const module of modules) {
      c.modules[module.name] = module;
    }

    for (const item of list) {
      let processed = false;
      for (const processor of this.l3ToplevelProcessors) {
        if (processor.process(c, item as L2Definition)) {
          processed = true;
          break;
        }
      }
      if (!processed) {
        c.errors.push({
          level: ERROR,
          message: `I still don't understand ${item.constructor.name}`,
          pos: item.pos,
        });
      }
    }

    for (const task of c.deferredTasks) {
      task();
    }

    return {
      runnable: new L3Module(moduleName, Object.values(c.mySymbols)),
      errors: c.errors,
    };
  }
}
