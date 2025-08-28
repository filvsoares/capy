import { Module } from '@/modules/parser/parser/module';
import { declareBeanInterface } from '@/util/beans';

export interface CodegenContext {
  write(...s: string[]): void;
}

export interface Codegen {
  generateCode(modules: { [moduleName: string]: Module }): string;
}

export const codegen = declareBeanInterface<Codegen>('Codegen');
