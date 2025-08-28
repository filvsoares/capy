import { ExpressionContext } from '@/beans/expression/expression-reader';
import { Type } from '@/beans/type/type';

export interface StatementContext extends ExpressionContext {
  returnType: Type;
  createChild(): StatementContext;
}
