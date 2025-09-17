import { fallbackPos, INVALID } from '@/base';
import { NativeMethod } from '@/modules/library/native-method';
import { CallableTypeReader } from '@/modules/method/callable-type-reader';
import { ToplevelReader, ToplevelReaderContext } from '@/modules/parser/toplevel-reader';
import { Identifier } from '@/modules/tokenizer/identifier';
import { Keyword } from '@/modules/tokenizer/keyword';
import { Separator } from '@/modules/tokenizer/separator';
import { Bean } from '@/util/beans';

export class NativeMethodReader extends Bean implements ToplevelReader {
  constructor(private callableTypeReader: CallableTypeReader) {
    super();
  }

  async read(c: ToplevelReaderContext) {
    const t1 = c.tokenReader.current;
    if (!Keyword.matches(t1, 'native')) {
      return;
    }
    c.tokenReader.consume();

    const t2 = c.tokenReader.current;
    if (!Keyword.matches(t2, 'function')) {
      c.parseErrors.addError(`Expected keyword "function"`, fallbackPos(t2?.pos, t1.pos));
      return INVALID;
    }
    c.tokenReader.consume();

    const t3 = c.tokenReader.current;
    if (!Identifier.matches(t3)) {
      c.parseErrors.addError(`Expected function name`, fallbackPos(t3?.pos, t2.pos));
      return INVALID;
    }
    c.tokenReader.consume();

    const t4 = c.tokenReader.current;
    const type = t4 && this.callableTypeReader.read(c);
    if (type === INVALID) {
      return INVALID;
    }
    if (!type) {
      c.parseErrors.addError(`Expected type`, fallbackPos(t4?.pos, t3.pos));
      return INVALID;
    }

    const t5 = c.tokenReader.current;
    if (!Separator.matches(t5, ';')) {
      c.parseErrors.addError(`Expected ";"`, fallbackPos(t5?.pos, type.pos));
      return INVALID;
    }
    c.tokenReader.consume();

    return new NativeMethod(c.currentModule, t3.name, type, t3.pos);
  }
}
