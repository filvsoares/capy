import { expressionReader } from '@/modules/parser/expression/expression-reader';
import { identifierResolver } from '@/modules/parser/expression/identifier-resolver';
import { parser } from '@/modules/parser/parser/parser';
import { toplevelReader } from '@/modules/parser/parser/toplevel-reader';
import { typeReader } from '@/modules/parser/type/type-reader';
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
}
