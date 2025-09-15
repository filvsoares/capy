import { Method } from '@/modules/parser/method/method';
import { ParserData } from '@/modules/parser/parser/parser-data';
import { ParserHook } from '@/modules/parser/parser/parser-hook';
import { Bean } from '@/util/beans';
import { Context } from '@/util/context';
import { ParseErrors } from '@/util/parse-errors';

export class MethodParserCheck extends Bean implements ParserHook {
  onCheckOutputs(c: Context<ParserData & ParseErrors>): void {
    const startMethod = c.parserData.findSymbol('main', 'start');
    if (!(startMethod instanceof Method)) {
      c.parseErrors.addError(`Main module must contain a method named "start"`);
    }
  }
}
