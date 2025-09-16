import { ParserContext } from '@/modules/parser/parser';
import { declareBeanInterface } from '@/util/beans';

export interface ParserHook {
  onCreateContext?(c: ParserContext): void;
  onCheckOutputs?(c: ParserContext): void;
}

export const parserHook = declareBeanInterface<ParserHook>('ParserHook');
