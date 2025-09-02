import { ERROR, INTERNAL, ParseError } from '@/base';
import { Method } from '@/modules/parser/method/method';
import { ParserCheck } from '@/modules/parser/parser/parser-check';
import { Symbol } from '@/modules/parser/parser/symbol';
import { Bean } from '@/util/beans';

export class MethodParserCheck extends Bean implements ParserCheck {
  checkOutputs(
    mainModuleName: string,
    outputs: { [moduleName: string]: { [symbolName: string]: Symbol } },
    errors: ParseError[]
  ): void {
    const startMethod = outputs[mainModuleName]?.['start'];
    if (!(startMethod instanceof Method)) {
      errors.push({
        level: ERROR,
        message: `Main module "${mainModuleName}" must contain a method named "start"`,
        pos: INTERNAL,
      });
    }
  }
}
