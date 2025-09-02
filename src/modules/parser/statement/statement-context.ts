import { ExpressionContext } from '@/modules/parser/expression/expression-reader';

export interface StatementContext extends ExpressionContext {
  createChild(): StatementContext;
}
