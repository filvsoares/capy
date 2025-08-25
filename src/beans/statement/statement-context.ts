import { ExpressionContext } from '@/beans/expression/expression-reader';

export interface StatementContext extends ExpressionContext {
  createChild(): StatementContext;
}
