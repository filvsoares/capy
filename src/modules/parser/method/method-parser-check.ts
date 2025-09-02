import { Method } from '@/modules/parser/method/method';
import { ParserCheck } from '@/modules/parser/parser/parser-check';
import { ParserData } from '@/modules/parser/parser/parser-data';
import { Bean } from '@/util/beans';
import { Context } from '@/util/context';
import { ParseErrors } from '@/util/parse-errors';

export class MethodParserCheck extends Bean implements ParserCheck {
  checkOutputs(c: Context<ParserData & ParseErrors>): void {
    const startMethod = c.parserData.getOutput(c.parserData.mainModuleName)?.['start'];
    if (!(startMethod instanceof Method)) {
      c.parseErrors.addError(`Main module "${c.parserData.mainModuleName}" must contain a method named "start"`);
    }
  }
}
