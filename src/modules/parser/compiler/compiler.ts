import { ParseError } from '@/base';
import { Module } from '@/modules/parser/parser/module';
import { declareBeanInterface } from '@/util/beans';

export type CompileResult = {
  output: string;
  errors: ParseError[];
  modules?: { [moduleName: string]: Module };
};

export type CompileOpts = { debugTree?: boolean };

export interface Compiler {
  compile(s: string, opts: CompileOpts): CompileResult;
}

export const compiler = declareBeanInterface<Compiler>('Compiler');
