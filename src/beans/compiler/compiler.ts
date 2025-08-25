import { Module } from '@/beans/parser/module';
import { declareBeanInterface } from '@/util/beans';
import { ParseError } from '../../base';

export type CompileResult = {
  output: string;
  errors: ParseError[];
  runnable?: Module;
};

export type CompileOpts = { debugTree?: boolean };

export interface Compiler {
  compile(s: string, libs: Module[], opts: CompileOpts): CompileResult;
}

export const compiler = declareBeanInterface<Compiler>('Compiler');
