import { INVALID } from '@/base';
import { Parser } from '@/modules/parser/parser/parser';
import { ParserData } from '@/modules/parser/parser/parser-data';
import { ParserHook } from '@/modules/parser/parser/parser-hook';
import { Symbol } from '@/modules/parser/parser/symbol';
import { ToplevelReader, ToplevelReaderContext } from '@/modules/parser/parser/toplevel-reader';
import { Keyword } from '@/modules/parser/tokenizer/keyword';
import { assertExportData, exportData } from '@/modules/parser/use/export-data';
import { Bean } from '@/util/beans';
import { Context, ContextValue } from '@/util/context';
import { ParseErrors } from '@/util/parse-errors';

type InExport = ContextValue<'inExport', true>;

const inExport: InExport = { inExport: true };

function hasInExport(c: Context<Partial<InExport>>): c is Context<InExport> {
  return c.inExport ?? false;
}

export class ExportReader extends Bean implements ToplevelReader, ParserHook {
  constructor(private parser: Parser) {
    super();
  }

  onCreateContext(c: Context<ParserData & ParseErrors>): Context<ParserData & ParseErrors> {
    return c.with(exportData());
  }

  async read(c: ToplevelReaderContext) {
    assertExportData(c);

    const t1 = c.tokenReader.current;
    if (!Keyword.matches(t1, 'export')) {
      return;
    }
    c.tokenReader.consume();

    if (hasInExport(c)) {
      c.parseErrors.addError(`'export' called twice`, t1.pos);
      return INVALID;
    }

    const symbol = await this.parser.readToplevel(c.with(inExport));
    if (!symbol) {
      c.parseErrors.addError(`Expected symbol after 'export'`, t1.pos);
      return INVALID;
    }

    if (symbol instanceof Symbol) {
      c.exportData.addExportedSymbol(symbol.module, symbol.name);
    }

    return symbol;
  }
}
