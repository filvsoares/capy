import { fallbackPos, INVALID, Invalid } from '@/base';
import { library } from '@/modules/libs/base/library';
import { Symbol } from '@/modules/parser/parser/symbol';
import { ToplevelReader, ToplevelReaderContext } from '@/modules/parser/parser/toplevel-reader';
import { Keyword } from '@/modules/parser/tokenizer/keyword';
import { Separator } from '@/modules/parser/tokenizer/separator';
import { String } from '@/modules/parser/tokenizer/string';
import { Bean, getOneBean } from '@/util/beans';

export class UseReader extends Bean implements ToplevelReader {
  async read(c: ToplevelReaderContext): Promise<Symbol | true | Invalid | undefined> {
    const t1 = c.tokenReader.current;
    if (!Keyword.matches(t1, 'use')) {
      return;
    }
    c.tokenReader.consume();

    const t2 = c.tokenReader.current;
    if (!String.matches(t2)) {
      c.parseErrors.addError(`Expected string but found ${t2}`, fallbackPos(t2?.pos, t1.pos));
      return INVALID;
    }
    c.tokenReader.consume();

    const t3 = c.tokenReader.current;
    if (!Separator.matches(t3, ';')) {
      c.parseErrors.addError(`Expected ";" but found ${t3}`, fallbackPos(t3?.pos, t2.pos));
    } else {
      c.tokenReader.consume();
    }

    const lib = await getOneBean(library, 'Library:' + t2.value);
    console.log('lib', lib);
    if (!lib) {
      c.parseErrors.addError(`Could not find library '${t2.value}'`);
    }

    return true;
  }
}
