import { INVALID } from '@/base';
import { Parser, ParserContext } from '@/modules/parser/parser';
import { ParserHook } from '@/modules/parser/parser-hook';
import { Symbol } from '@/modules/parser/symbol';
import { ToplevelReader, ToplevelReaderContext } from '@/modules/parser/toplevel-reader';
import { Keyword } from '@/modules/tokenizer/keyword';
import { ExportData, exportData } from '@/modules/use/export-data';
import { Bean } from '@/util/beans';
import { declareExtraKey } from '@/util/extra';

const inExport = declareExtraKey<true>('InExport');

export class ExportReader extends Bean implements ToplevelReader, ParserHook {
  constructor(private parser: Parser) {
    super();
  }

  onCreateContext(c: ParserContext) {
    exportData.addTo(c, new ExportData());
  }

  async read(c: ToplevelReaderContext) {
    const _exportData = exportData.requireFrom(c);
    const _inExport = inExport.optionalFrom(c) ?? false;

    const t1 = c.tokenReader.current;
    if (!Keyword.matches(t1, 'export')) {
      return;
    }
    c.tokenReader.consume();

    if (_inExport) {
      c.parseErrors.addError(`'export' called twice`, t1.pos);
      return INVALID;
    }

    const symbol = await this.parser.readToplevel({ ...c, ...inExport.wrap(true) });
    if (!symbol) {
      c.parseErrors.addError(`Expected symbol after 'export'`, t1.pos);
      return INVALID;
    }

    if (symbol instanceof Symbol) {
      _exportData.addExportedSymbol(symbol.module, symbol.name);
    }

    return symbol;
  }
}
