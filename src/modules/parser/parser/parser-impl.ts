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

import { Application } from '@/modules/parser/parser/application';
import { currentModule } from '@/modules/parser/parser/current-module';
import { ModuleInput } from '@/modules/parser/parser/module-input';
import { parserData } from '@/modules/parser/parser/parser-data';
import { ParserHook } from '@/modules/parser/parser/parser-hook';
import { Symbol } from '@/modules/parser/parser/symbol';
import { tokenReader } from '@/modules/parser/parser/token-reader';
import { ToplevelReader, ToplevelReaderContext } from '@/modules/parser/parser/toplevel-reader';
import { Tokenizer } from '@/modules/parser/tokenizer/tokenizer';
import { Bean } from '@/util/beans';
import { createContext } from '@/util/context';
import { parseErrors } from '@/util/parse-errors';
import { Parser, ParserResult } from './parser';

export class ParserImpl extends Bean implements Parser {
  constructor(
    private tokenizer: Tokenizer,
    private toplevelReaders: ToplevelReader[],
    private parserHooks: ParserHook[]
  ) {
    super();
  }

  async parse(_inputs: ModuleInput[]): Promise<ParserResult> {
    const inputs: { [moduleName: string]: ModuleInput } = {};
    for (const input of _inputs) {
      inputs[input.name] = input;
    }
    const modulesToProcess = ['main'];
    const outputs: { [moduleName: string]: { [symbolName: string]: Symbol } } = {};
    const tasks: (() => void)[] = [];

    let c = createContext({}).with(parserData(inputs, modulesToProcess, outputs, tasks)).with(parseErrors([]));
    for (const hook of this.parserHooks) {
      if (hook.onCreateContext) {
        c = hook.onCreateContext(c);
      }
    }

    while (modulesToProcess.length > 0) {
      const moduleName = modulesToProcess.pop()!;

      let symbols = outputs[moduleName];
      if (symbols) {
        continue;
      }
      symbols = outputs[moduleName] = {};

      const input = inputs[moduleName];
      if (!input) {
        throw new Error(`Module "${moduleName}" not found`);
      }

      const r = this.tokenizer.process(input.sourceCode);
      c.parseErrors.errors.push(...r.errors);

      const result = await this.readToplevelList(c.with(tokenReader(r.tokenList)).with(currentModule(moduleName)));
      for (const symbol of result) {
        if (symbols[symbol.name]) {
          c.parseErrors.addError(`Symbol '${symbol.name}' already defined in module '${moduleName}'`, symbol.pos);
        } else {
          symbols[symbol.name] = symbol;
        }
      }
    }

    while (tasks.length > 0) {
      const _tasks = tasks.splice(0, tasks.length);
      for (const task of _tasks) {
        task();
      }
    }

    for (const hook of this.parserHooks) {
      hook.onCheckOutputs?.(c);
    }

    return {
      application: new Application(Object.values(outputs).flatMap((symbols) => Object.values(symbols))),
      errors: c.parseErrors.errors,
    };
  }

  async readToplevel(c: ToplevelReaderContext) {
    for (const reader of this.toplevelReaders) {
      const result = await reader.read(c);
      if (result) {
        return result;
      }
    }
  }

  private async readToplevelList(c: ToplevelReaderContext) {
    const symbols: Symbol[] = [];
    while (true) {
      const t = c.tokenReader.current;
      if (!t) {
        break;
      }
      const val = await this.readToplevel(c);
      if (!val) {
        c.parseErrors.addError(`Unexpected ${t}`, t!.pos);
        c.tokenReader.consume();
        continue;
      }
      if (val instanceof Symbol) {
        symbols.push(val);
      }
    }
    return symbols;
  }
}
