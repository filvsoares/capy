import { declareBeanInterface } from '@/util/beans';
import { ParseError } from '../../base';
import { L3Module } from '../l3-parser/l3-parser';

export type CompileResult = {
  output: string;
  errors: ParseError[];
  runnable?: L3Module;
};

export type CompileOpts = { debugL1?: boolean; debugL2?: boolean; debugL3?: boolean };

export interface Compiler {
  compile(s: string, libs: L3Module[], opts: CompileOpts): CompileResult;
}

export const compiler = declareBeanInterface<Compiler>('Compiler');
