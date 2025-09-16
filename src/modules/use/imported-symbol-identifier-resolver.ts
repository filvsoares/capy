import { INVALID, Invalid } from '@/base';
import { Expression } from '@/modules/expression/expression';
import { ExpressionReaderContext } from '@/modules/expression/expression-reader';
import { IdentifierResolver } from '@/modules/expression/identifier-resolver';
import { Identifier } from '@/modules/tokenizer/identifier';
import { exportData } from '@/modules/use/export-data';
import { Bean } from '@/util/beans';

export class ImportedSymbolIdentifierResolver extends Bean implements IdentifierResolver {
  resolveIdentifier(c: ExpressionReaderContext, obj: Identifier): Expression | Invalid | undefined {
    const _exportData = exportData.requireFrom(c);

    let usingSymbols = _exportData.usingSymbols[c.currentModule];
    if (!usingSymbols) {
      usingSymbols = _exportData.usingSymbols[c.currentModule] = {};
      for (const moduleName of _exportData.usingModules[c.currentModule] ?? {}) {
        for (const symbolName of _exportData.exportedSymbols[moduleName] ?? {}) {
          let symbols = usingSymbols[symbolName];
          if (!symbols) {
            symbols = usingSymbols[symbolName] = [];
          }
          symbols.push({
            exportModuleName: moduleName,
            exportSymbolName: symbolName,
          });
        }
      }
    }

    const symbol = usingSymbols[obj.name];
    if (!symbol) {
      return;
    }

    if (symbol.length > 1) {
      c.parseErrors.addError(
        `Ambiguous imported reference '${obj.name}', exported in modules '${symbol
          .map((s) => s.exportModuleName)
          .join(`', '`)}'`
      );
      return INVALID;
    }

    /* TODO actually resolve */
  }
}
