import { Module } from '@/beans/parser/module';
import { declareBeanInterface } from '@/util/beans';
import { ParseError } from '../../base';

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
