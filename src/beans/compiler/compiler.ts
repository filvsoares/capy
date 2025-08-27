import { Module } from '@/beans/parser/module';
import { Symbol } from '@/beans/parser/symbol';
import { declareBeanInterface } from '@/util/beans';
import { ParseError } from '../../base';

export type CompileResult = {
  output: string;
  errors: ParseError[];
  modules?: { [moduleName: string]: { [symbolName: string]: Symbol } };
};

export type CompileOpts = { debugTree?: boolean };

export interface Compiler {
  compile(s: string, libs: Module[], opts: CompileOpts): CompileResult;
}

export const compiler = declareBeanInterface<Compiler>('Compiler');
