import { Argument } from '@/modules/parser/method/argument';
import { ParserContext } from '@/modules/parser/parser/parser-context';
import { Identifier } from '@/modules/parser/tokenizer/identifier';
import { TypeReader } from '@/modules/parser/type/type-reader';
import { Bean } from '@/util/beans';
import { combinePos, ERROR, fallbackPos, INTERNAL, INVALID, Invalid } from '../../../base';
import { Operator } from '../tokenizer/operator';
import { Separator } from '../tokenizer/separator';
import { ArgumentReader } from './argument-reader';

export class ArgumentReaderImpl extends Bean implements ArgumentReader {
  constructor(private typeReader: TypeReader) {
    super();
  }

  read(c: ParserContext): Argument | Invalid | undefined {
    const t1 = c.current;
    if (!Identifier.matches(t1)) {
      return;
    }
    c.consume();

    const t2 = c.current;
    if (!Operator.matches(t2, ':')) {
      c.addError({
        level: ERROR,
        message: `Expected ":" but found ${t2 ?? '")"'}`,
        pos: fallbackPos(t2?.pos, t1.pos),
      });
      return INVALID;
    }
    c.consume();

    const t3 = c.current;
    const type = this.typeReader.read(c);
    if (!type) {
      c.addError({
        level: ERROR,
        message: `Expected type but found ${t3}`,
        pos: fallbackPos(t3?.pos, t2.pos),
      });
      return INVALID;
    }
    if (type === INVALID) {
      return INVALID;
    }
    return new Argument(t1.name, type, combinePos(t1.pos, type.pos));
  }

  readList(c: ParserContext): Argument[] {
    const outList: Argument[] = [];
    let error = false;

    if (!c.current) {
      return outList;
    }

    while (c.current) {
      const arg = this.read(c);
      if (!arg) {
        if (!error) {
          error = true;
          c.addError({
            level: ERROR,
            message: `Expected identifier`,
            pos: INTERNAL,
          });
        }
        c.consume();
        continue;
      }
      if (arg === INVALID) {
        continue;
      }
      outList.push(arg);

      const t2 = c.current;
      if (!t2) {
        break;
      }
      if (!Separator.matches(t2, ',')) {
        error = true;
        c.addError({
          level: ERROR,
          message: `Expected "," but found ${t2}`,
          pos: t2.pos,
        });
        c.consume();
        continue;
      }
      c.consume();

      const t3 = c.current;
      if (!t3) {
        c.addError({
          level: ERROR,
          message: `Expected argument after ","`,
          pos: t2.pos,
        });
        break;
      }
    }

    return outList;
  }
}
