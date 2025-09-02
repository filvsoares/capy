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
import { Application } from '@/modules/parser/parser/application';
import { ModuleInput } from '@/modules/parser/parser/module-input';
import { ParserCheck } from '@/modules/parser/parser/parser-check';
import { ParserContext } from '@/modules/parser/parser/parser-context';
import { Symbol } from '@/modules/parser/parser/symbol';
import { ToplevelReader } from '@/modules/parser/parser/toplevel-reader';
import { Tokenizer } from '@/modules/parser/tokenizer/tokenizer';
import { Bean } from '@/util/beans';
import { declareExtraKey, ExtraHandler } from '@/util/extra';
import { Parser, ParserResult } from './parser';

type ParserExtra = {
  outputs: { [moduleName: string]: { [symbolName: string]: Symbol } };
};

const parserExtraKey = declareExtraKey<ParserExtra>();

export class ParserImpl extends Bean implements Parser {
  constructor(
    private tokenizer: Tokenizer,
    private toplevelReaders: ToplevelReader[],
    private parserChecks: ParserCheck[]
  ) {
    super();
  }

  parseModule(
    moduleName: string,
    inputs: { [moduleName: string]: ModuleInput },
    outputs: { [moduleName: string]: { [symbolName: string]: Symbol } },
    errors: ParseError[],
    extra: ExtraHandler,
    tasks: (() => void)[]
  ) {
    const moduleInput = inputs[moduleName];
    if (!moduleInput) {
      throw new Error(`Module "${moduleName}" not found`);
    }
    if (outputs[moduleName]) {
      return;
    }

    const r = this.tokenizer.process(moduleInput.sourceCode);
    errors.push(...r.errors);

    const c = new ParserContext(moduleName, moduleInput, r.tokenList, errors, tasks, extra);
    const symbols = this.readToplevelList(c);
    outputs[moduleName] = symbols;
  }

  parse(mainModuleName: string, inputs: ModuleInput[]): ParserResult {
    const _inputs: { [moduleName: string]: ModuleInput } = {};
    for (const input of inputs) {
      _inputs[input.name] = input;
    }
    const outputs: { [moduleName: string]: { [symbolName: string]: Symbol } } = {};

    const errors: ParseError[] = [];
    const tasks: (() => void)[] = [];

    const extra = new ExtraHandler();
    extra.put(parserExtraKey, { outputs });

    this.parseModule(mainModuleName, _inputs, outputs, errors, extra, tasks);

    while (tasks.length > 0) {
      const _tasks = tasks.splice(0, tasks.length);
      for (const task of _tasks) {
        task();
      }
    }

    for (const check of this.parserChecks) {
      check.checkOutputs(mainModuleName, outputs, errors);
    }

    return {
      application: new Application(
        mainModuleName,
        Object.values(outputs).flatMap((module) => Object.values(module))
      ),
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
    const module = c.extra.get(parserExtraKey)!.outputs[c.moduleName];
    if (!module) {
      throw new Error('findSymbol() must be used within a task');
    }
    return module[symbolName];
  }

  replaceSymbol(c: ParserContext, newSymbol: Symbol) {
    const module = c.extra.get(parserExtraKey)!.outputs[c.moduleName];
    if (!module) {
      throw new Error('replaceSymbol() must be used within a task');
    }
    module[newSymbol.name] = newSymbol;
  }

  findModule(c: ParserContext, moduleName: string): { [symbolName: string]: Symbol } | undefined {
    return c.extra.get(parserExtraKey)?.outputs[moduleName];
  }
}
