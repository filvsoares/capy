import { INVALID, Invalid } from '@/base';
import { Expression } from '@/modules/expression/expression';
import { ExpressionReader, ExpressionReaderContext } from '@/modules/expression/expression-reader';
import { IdentifierResolver } from '@/modules/expression/identifier-resolver';
import { Identifier } from '@/modules/tokenizer/identifier';
import { exportData } from '@/modules/use/export-data';
import { Bean } from '@/util/beans';

export class ImportedSymbolIdentifierResolver extends Bean implements IdentifierResolver {
  priority = -100;

  constructor(private expressionReader: ExpressionReader) {
    super();
  }

  resolveIdentifier(c: ExpressionReaderContext, name: string, origin: Identifier): Expression | Invalid | undefined {
    const _exportData = exportData.requireFrom(c);

    /* usingSymbols contains the available (through 'use') symbols to this module that are exported by other
     * modules. */
    let usingSymbols = _exportData.usingSymbols[c.currentModule];

    if (!usingSymbols) {
      /* But it is lazily initialized, because the modules may have not yet been processed when 'use' directives are
       * applied. */
      usingSymbols = _exportData.usingSymbols[c.currentModule] = {};

      /* Loops through all imported modules. */
      for (const moduleName of _exportData.usingModules[c.currentModule] ?? []) {
        /* Loops through all exported symbols in these modules. */
        for (const symbolName of _exportData.exportedSymbols[moduleName] ?? []) {
          let symbols = usingSymbols[symbolName];
          if (!symbols) {
            symbols = usingSymbols[symbolName] = [];
          }
          /* Adds them as usingSymbols. Adding like this allows detecting ambiguous imports later. */
          symbols.push({
            exportModuleName: moduleName,
            exportSymbolName: symbolName,
          });
        }
      }
    }

    const symbols = usingSymbols[name];
    if (!symbols) {
      return;
    }

    if (symbols.length > 1) {
      c.parseErrors.addError(
        `Ambiguous imported reference '${name}', exported in modules '${symbols
          .map((s) => s.exportModuleName)
          .join(`', '`)}'`,
        origin.pos
      );
      return INVALID;
    }

    const symbol = symbols[0];

    return this.expressionReader.resolveIdentifier(
      { ...c, currentModule: symbol.exportModuleName },
      symbol.exportSymbolName,
      origin
    );
  }
}
