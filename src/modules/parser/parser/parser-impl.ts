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

import { INVALID } from '@/base';
import { Application } from '@/modules/parser/parser/application';
import { CurrentModule, currentModule } from '@/modules/parser/parser/current-module';
import { ModuleInput } from '@/modules/parser/parser/module-input';
import { ParserCheck } from '@/modules/parser/parser/parser-check';
import { parserData, ParserData } from '@/modules/parser/parser/parser-data';
import { Symbol } from '@/modules/parser/parser/symbol';
import { tokenReader } from '@/modules/parser/parser/token-reader';
import { ToplevelReader, ToplevelReaderContext } from '@/modules/parser/parser/toplevel-reader';
import { Tokenizer } from '@/modules/parser/tokenizer/tokenizer';
import { Bean } from '@/util/beans';
import { Context, createContext } from '@/util/context';
import { parseErrors, ParseErrors } from '@/util/parse-errors';
import { Parser, ParserResult } from './parser';

export class ParserImpl extends Bean implements Parser {
  constructor(
    private tokenizer: Tokenizer,
    private toplevelReaders: ToplevelReader[],
    private parserChecks: ParserCheck[]
  ) {
    super();
  }

  parseModule(c: Context<ParserData & ParseErrors>, moduleName: string) {
    if (c.parserData.getOutput(moduleName)) {
      return;
    }

    const input = c.parserData.getInput(moduleName);
    if (!input) {
      throw new Error(`Module "${moduleName}" not found`);
    }

    const r = this.tokenizer.process(input.sourceCode);
    c.parseErrors.errors.push(...r.errors);

    const symbols = this.readToplevelList(c.with(tokenReader(r.tokenList)).with(currentModule(moduleName)));
    c.parserData.putOutput(moduleName, symbols);
  }

  parse(mainModuleName: string, _inputs: ModuleInput[]): ParserResult {
    const inputs: { [moduleName: string]: ModuleInput } = {};
    for (const input of _inputs) {
      inputs[input.name] = input;
    }

    const outputs: { [moduleName: string]: { [symbolName: string]: Symbol } } = {};
    const tasks: (() => void)[] = [];

    const c = createContext({}).with(parserData(mainModuleName, inputs, outputs, tasks)).with(parseErrors([]));
    this.parseModule(c, mainModuleName);

    while (tasks.length > 0) {
      const _tasks = tasks.splice(0, tasks.length);
      for (const task of _tasks) {
        task();
      }
    }

    for (const check of this.parserChecks) {
      check.checkOutputs(c);
    }

    return {
      application: new Application(
        mainModuleName,
        Object.values(outputs).flatMap((module) => Object.values(module))
      ),
      errors: c.parseErrors.errors,
    };
  }

  private readToplevel(c: ToplevelReaderContext) {
    for (const reader of this.toplevelReaders) {
      const result = reader.read(c);
      if (result) {
        return result;
      }
    }
    const t = c.tokenReader.current;
    c.parseErrors.addError(`Unexpected ${t}`, t!.pos);
    c.tokenReader.consume();
    return INVALID;
  }

  private readToplevelList(c: ToplevelReaderContext) {
    const symbols: { [name: string]: Symbol } = {};
    while (c.tokenReader.current) {
      const val = this.readToplevel(c);
      if (val instanceof Symbol) {
        if (symbols[val.name]) {
          c.parseErrors.addError(`Symbol "${val.name}" already defined`, val.pos);
        } else {
          symbols[val.name] = val;
        }
      }
    }
    return symbols;
  }

  findSymbol(c: Context<ParserData & CurrentModule>, symbolName: string): Symbol | undefined {
    const module = c.parserData.getOutput(c.currentModule);
    if (!module) {
      throw new Error('findSymbol() must be used within a task');
    }
    return module[symbolName];
  }

  replaceSymbol(c: Context<ParserData & CurrentModule>, newSymbol: Symbol) {
    const module = c.parserData.getOutput(c.currentModule);
    if (!module) {
      throw new Error('replaceSymbol() must be used within a task');
    }
    module[newSymbol.name] = newSymbol;
  }
}
