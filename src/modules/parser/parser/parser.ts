import { ParseError } from '@/base';
import { Application } from '@/modules/parser/parser/application';
import { CurrentModule } from '@/modules/parser/parser/current-module';
import { ModuleInput } from '@/modules/parser/parser/module-input';
import { ParserData } from '@/modules/parser/parser/parser-data';
import { Symbol } from '@/modules/parser/parser/symbol';
import { declareBeanInterface } from '@/util/beans';
import { Context } from '@/util/context';

export type ParserResult = {
  application: Application;
  errors: ParseError[];
};

export interface Parser {
  parse(mainModuleName: string, inputs: ModuleInput[]): Promise<ParserResult>;
  findSymbol(c: Context<ParserData & CurrentModule>, symbolName: string): Symbol | undefined;
  replaceSymbol(c: Context<ParserData & CurrentModule>, newSymbol: Symbol): void;
}

export const parser = declareBeanInterface<Parser>('Parser');
