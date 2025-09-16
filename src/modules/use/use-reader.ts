import { fallbackPos, INVALID } from '@/base';
import { ToplevelReader, ToplevelReaderContext } from '@/modules/parser/toplevel-reader';
import { Keyword } from '@/modules/tokenizer/keyword';
import { Separator } from '@/modules/tokenizer/separator';
import { String } from '@/modules/tokenizer/string';
import { exportData } from '@/modules/use/export-data';
import { UseProvider } from '@/modules/use/use-provider';
import { Bean } from '@/util/beans';

export class UseReader extends Bean implements ToplevelReader {
  constructor(private useProviders: UseProvider[]) {
    super();
  }

  async read(c: ToplevelReaderContext) {
    const _exportData = exportData.requireFrom(c);

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

    let moduleName: string | undefined;
    for (const provider of this.useProviders) {
      moduleName = await provider.processUse(t2.value, c);
      if (moduleName) {
        break;
      }
    }

    if (!moduleName) {
      c.parseErrors.addError(`Could not find use reference '${t2.value}'`);
      return INVALID;
    }

    _exportData.addUsingModule(c.currentModule, moduleName);
    return true;
  }
}
