import { ERROR, fallbackPos, INVALID, Invalid } from '@/base';
import { ExtraKey, ParserContext } from '@/beans/parser/parser-context';
import { Symbol } from '@/beans/parser/symbol';
import { ToplevelReader } from '@/beans/parser/toplevel-reader';
import { Keyword } from '@/beans/tokenizer/keyword';
import { String } from '@/beans/tokenizer/string';
import { Bean } from '@/util/beans';
import { Separator } from '../tokenizer/separator';

class UseExtra {
  symbols: { [symbolName: string]: { moduleName: string; value: Symbol }[] } = {};
}

const useExtraKey = new ExtraKey<UseExtra>();

export class UseReader extends Bean implements ToplevelReader {
  read(c: ParserContext): true | Invalid | undefined {
    const t1 = c.current;
    if (!Keyword.matches(t1, 'use')) {
      return;
    }
    c.consume();

    const t2 = c.current;
    if (!String.matches(t2)) {
      c.addError({
        level: ERROR,
        message: `Expected import name but found ${t2?.constructor.name}`,
        pos: fallbackPos(t2?.pos, t1.pos),
      });
      return INVALID;
    }
    c.consume();

    const t3 = c.current;
    if (Separator.matches(t3, ';')) {
      c.consume();
    } else {
      c.addError({
        level: ERROR,
        message: `Expected ";"`,
        pos: fallbackPos(t3?.pos, t2.pos),
      });
    }

    const module = c.modules[t2.value];
    if (!module) {
      c.addError({
        level: ERROR,
        message: `Module "${t2.value}" not found`,
        pos: t2.pos,
      });
      return INVALID;
    }

    const useExtra = c.getOrCreateExtra(useExtraKey, () => new UseExtra());

    for (const symbolName in module) {
      let list = useExtra.symbols[symbolName];
      if (!list) {
        useExtra.symbols[symbolName] = list = [];
      }
      list.push({ moduleName: t2.value, value: module[symbolName] });
    }

    return true;
  }
}
