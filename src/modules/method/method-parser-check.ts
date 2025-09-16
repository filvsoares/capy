import { Method } from '@/modules/method/method';
import { ParserContext } from '@/modules/parser/parser';
import { ParserHook } from '@/modules/parser/parser-hook';
import { Bean } from '@/util/beans';

export class MethodParserCheck extends Bean implements ParserHook {
  onCheckOutputs(c: ParserContext): void {
    const startMethod = c.parserData.findSymbol('main', 'start');
    if (!(startMethod instanceof Method)) {
      c.parseErrors.addError(`Main module must contain a method named "start"`);
    }
  }
}
