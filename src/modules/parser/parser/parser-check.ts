import { ParseError } from '@/base';
import { Symbol } from '@/modules/parser/parser/symbol';
import { declareBeanInterface } from '@/util/beans';

export interface ParserCheck {
  checkOutputs(
    mainModuleName: string,
    outputs: { [moduleName: string]: { [symbolName: string]: Symbol } },
    errors: ParseError[]
  ): void;
}

export const parserCheck = declareBeanInterface<ParserCheck>('ParserCheck');
