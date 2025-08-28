import { expressionReader } from '@/beans/expression/expression-reader';
import { identifierResolver } from '@/beans/expression/identifier-resolver';
import { parser } from '@/beans/parser/parser';
import { toplevelReader } from '@/beans/parser/toplevel-reader';
import { typeReader } from '@/beans/type/type-reader';
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
