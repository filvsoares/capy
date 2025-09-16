import { symbolProcessor } from '@/modules/codegen/symbol-processor';
import { expressionItemProcessor } from '@/modules/expression/expression-item-processor';
import { expressionProcessor } from '@/modules/expression/expression-processor';
import { expressionReader } from '@/modules/expression/expression-reader';
import { identifierResolver } from '@/modules/expression/identifier-resolver';
import { parser } from '@/modules/parser/parser';
import { toplevelReader } from '@/modules/parser/toplevel-reader';
import { typeReader } from '@/modules/type/type-reader';
import { declareBean, single } from '@/util/beans';

export function declareBeans() {
  declareBean({
    name: 'GlobalVariableReader',
    provides: [toplevelReader],
    dependencies: [single(typeReader), single(expressionReader)],
    loadModule: () => import('./global-variable-reader'),
    factory: (m, deps) => new m.GlobalVariableReader(...deps),
  });
  declareBean({
    name: 'GlobalVariableIdentifierResolver',
    provides: [identifierResolver],
    dependencies: [single(parser)],
    loadModule: () => import('./global-variable-identifier-resolver'),
    factory: (m, deps) => new m.GlobalVariableIdentifierResolver(...deps),
  });
  declareBean({
    name: 'GlobalVariableReferenceProcessor',
    provides: [expressionItemProcessor],
    dependencies: [],
    loadModule: () => import('./global-variable-reference-processor'),
    factory: (m, deps) => new m.GlobalVariableReferenceProcessor(...deps),
  });
  declareBean({
    name: 'GlobalVariableSymbolProcessor',
    provides: [symbolProcessor],
    dependencies: [single(expressionProcessor)],
    loadModule: () => import('./global-variable-symbol-processor'),
    factory: (m, deps) => new m.GlobalVariableSymbolProcessor(...deps),
  });
}
