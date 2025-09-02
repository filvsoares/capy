import { Argument } from '@/modules/parser/method/argument';
import { Identifier } from '@/modules/parser/tokenizer/identifier';
import { TypeReader } from '@/modules/parser/type/type-reader';
import { Bean } from '@/util/beans';
import { combinePos, fallbackPos, INTERNAL, INVALID, Invalid } from '../../../base';
import { Operator } from '../tokenizer/operator';
import { Separator } from '../tokenizer/separator';
import { ArgumentReader, ArgumentReaderContext } from './argument-reader';

export class ArgumentReaderImpl extends Bean implements ArgumentReader {
  constructor(private typeReader: TypeReader) {
    super();
  }

  read(c: ArgumentReaderContext): Argument | Invalid | undefined {
    const t1 = c.tokenReader.current;
    if (!Identifier.matches(t1)) {
      return;
    }
    c.tokenReader.consume();

    const t2 = c.tokenReader.current;
    if (!Operator.matches(t2, ':')) {
      c.parseErrors.addError(`Expected ":" but found ${t2 ?? '")"'}`, fallbackPos(t2?.pos, t1.pos));
      return INVALID;
    }
    c.tokenReader.consume();

    const t3 = c.tokenReader.current;
    const type = this.typeReader.read(c);
    if (!type) {
      c.parseErrors.addError(`Expected type but found ${t3}`, fallbackPos(t3?.pos, t2.pos));
      return INVALID;
    }
    if (type === INVALID) {
      return INVALID;
    }
    return new Argument(t1.name, type, combinePos(t1.pos, type.pos));
  }

  readList(c: ArgumentReaderContext): Argument[] {
    const outList: Argument[] = [];
    let error = false;

    if (!c.tokenReader.current) {
      return outList;
    }

    while (c.tokenReader.current) {
      const arg = this.read(c);
      if (!arg) {
        if (!error) {
          error = true;
          c.parseErrors.addError(`Expected identifier`, INTERNAL);
        }
        c.tokenReader.consume();
        continue;
      }
      if (arg === INVALID) {
        continue;
      }
      outList.push(arg);

      const t2 = c.tokenReader.current;
      if (!t2) {
        break;
      }
      if (!Separator.matches(t2, ',')) {
        error = true;
        c.parseErrors.addError(`Expected "," but found ${t2}`, t2.pos);
        c.tokenReader.consume();
        continue;
      }
      c.tokenReader.consume();

      const t3 = c.tokenReader.current;
      if (!t3) {
        c.parseErrors.addError(`Expected argument after ","`, t2.pos);
        break;
      }
    }

    return outList;
  }
}
