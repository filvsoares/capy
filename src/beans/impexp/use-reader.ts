import { ERROR, fallbackPos, INVALID, Invalid } from '@/base';
import { Keyword } from '@/beans/parser/keyword';
import { ToplevelParserContext } from '@/beans/parser/parser';
import { String } from '@/beans/parser/string';
import { ToplevelReader } from '@/beans/parser/toplevel-reader';
import { Bean } from '@/util/beans';
import { Separator } from '../parser/separator';

export class UseReader extends Bean implements ToplevelReader {
  read(c: ToplevelParserContext): true | Invalid | undefined {
    const t1 = c.current();
    if (!Keyword.matches(t1, 'use')) {
      return;
    }
    c.consume();

    const t2 = c.current();
    if (!String.matches(t2)) {
      c.addError({
        level: ERROR,
        message: `Expected import name but found ${t2?.constructor.name}`,
        pos: fallbackPos(t2?.pos, t1.pos),
      });
      return INVALID;
    }
    c.consume();

    const t3 = c.current();
    if (Separator.matches(t3, ';')) {
      c.consume();
    } else {
      c.addError({
        level: ERROR,
        message: `Expected ";"`,
        pos: fallbackPos(t3?.pos, t2.pos),
      });
    }

    const module = c.getModule(t2.value);
    if (!module) {
      c.addError({
        level: ERROR,
        message: `Module "${t2.value}" not found`,
        pos: t2.pos,
      });
      return INVALID;
    }

    for (const symbol of module.symbols) {
      c.addToAllSymbols(t2.value, symbol);
    }

    return true;
  }
}
